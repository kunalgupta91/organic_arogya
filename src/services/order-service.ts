import { customAlphabet } from "nanoid";
import { prisma } from "@/lib/prisma";
import { getPaymentProvider } from "@/lib/payment-provider";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { calculateShipping } from "@/services/shipping-service";
import { validateCoupon, InvalidCouponError } from "@/services/coupon-service";
import { getCartWithTotals } from "@/services/cart-service";
import { getOrCreateCart } from "@/lib/cart";
import type { AddressInput } from "@/validations/checkout";

const orderSuffix = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 8);

export class EmptyCartError extends Error {
  constructor() {
    super("Your cart is empty.");
  }
}

export class UnsupportedCurrencyError extends Error {
  constructor(currency: string) {
    super(
      `${currency} checkout isn't live yet — international payments are coming soon. Please use our contact page for now.`,
    );
  }
}

function regionForCountry(country: string): "DOMESTIC" | "INTERNATIONAL" {
  return country.trim().toLowerCase() === "in" || country.trim().toLowerCase() === "india"
    ? "DOMESTIC"
    : "INTERNATIONAL";
}

export async function createOrderFromCart(input: {
  userId?: string;
  guestEmail?: string;
  shipping: AddressInput;
  couponCode?: string;
}) {
  const { items, subtotalInr, taxInr } = await getCartWithTotals();
  if (items.length === 0) throw new EmptyCartError();

  const region = regionForCountry(input.shipping.country);
  const currency = region === "DOMESTIC" ? "INR" : "USD";

  const provider = getPaymentProvider(currency);
  if (!provider) throw new UnsupportedCurrencyError(currency);

  let discountInr = 0;
  let couponId: string | undefined;
  if (input.couponCode) {
    try {
      const result = await validateCoupon(
        input.couponCode,
        subtotalInr,
        items.map((i) => i.productId),
      );
      discountInr = result.discountInr;
      couponId = result.coupon.id;
    } catch (error) {
      if (error instanceof InvalidCouponError) throw error;
      throw error;
    }
  }

  const shippingInr = await calculateShipping(subtotalInr - discountInr, region, currency);
  const totalInr = subtotalInr - discountInr + shippingInr + taxInr;

  const orderNumber = `OA-${new Date().getFullYear()}-${orderSuffix()}`;
  const addressJson = { ...input.shipping };

  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId: input.userId,
      guestEmail: input.userId ? undefined : input.guestEmail,
      currency,
      subtotalAmount: subtotalInr,
      discountAmount: discountInr,
      shippingAmount: shippingInr,
      taxAmount: taxInr,
      totalAmount: totalInr,
      shippingAddress: addressJson,
      billingAddress: addressJson,
      couponId,
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          productNameSnapshot: item.product.name,
          skuSnapshot: item.product.sku,
          quantity: item.quantity,
          unitPriceSnapshot: item.product.sellingPriceInr,
          gstAmountSnapshot: Math.round(
            (item.product.sellingPriceInr * item.quantity * item.product.gstPercent) / 100,
          ),
          totalPrice: item.product.sellingPriceInr * item.quantity,
        })),
      },
    },
  });

  const providerOrder = await provider.createOrder({
    amountInSmallestUnit: totalInr,
    currency,
    receipt: orderNumber,
  });

  await prisma.payment.create({
    data: {
      orderId: order.id,
      provider: provider.name,
      providerOrderId: providerOrder.providerOrderId,
      status: "PENDING",
      amount: totalInr,
      currency,
    },
  });

  return { order, providerOrderId: providerOrder.providerOrderId };
}

export class PaymentVerificationError extends Error {}

/**
 * Confirms a Razorpay payment after the client-side checkout succeeds.
 * Idempotent: if the payment is already PAID (e.g. the webhook beat this
 * call to it), this is a no-op rather than double-decrementing stock.
 */
export async function confirmRazorpayPayment(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  signature: string,
) {
  if (!verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, signature)) {
    throw new PaymentVerificationError("Payment signature verification failed.");
  }

  const payment = await prisma.payment.findFirst({
    where: { providerOrderId: razorpayOrderId },
    include: { order: { include: { items: true, user: true } } },
  });
  if (!payment) throw new PaymentVerificationError("Order not found for this payment.");

  if (payment.status === "PAID") {
    return payment.order; // already processed (e.g. by the webhook)
  }

  const order = await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: { status: "PAID", providerPaymentId: razorpayPaymentId, providerSignature: signature },
    });

    for (const item of payment.order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    if (payment.order.couponId) {
      await tx.coupon.update({
        where: { id: payment.order.couponId },
        data: { usedCount: { increment: 1 } },
      });
    }

    return tx.order.update({
      where: { id: payment.orderId },
      data: { status: "CONFIRMED" },
      include: { items: true, user: true },
    });
  });

  if (order.userId) {
    const cart = await prisma.cart.findUnique({ where: { userId: order.userId } });
    if (cart) await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  } else {
    const cart = await getOrCreateCart();
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }

  await prisma.notification.create({
    data: {
      type: "ORDER",
      title: "New order confirmed",
      message: `Order ${order.orderNumber} — ${order.totalAmount / 100} ${order.currency}`,
      link: "/admin",
    },
  });

  try {
    const to = order.user?.email ?? order.guestEmail;
    if (to) await sendOrderConfirmationEmail(to, order);
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
  }

  return order;
}

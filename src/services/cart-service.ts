import { prisma } from "@/lib/prisma";
import { getCart, getOrCreateCart } from "@/lib/cart";

export async function addToCart(productId: string, quantity: number) {
  const cart = await getOrCreateCart();
  const product = await prisma.product.findUniqueOrThrow({ where: { id: productId } });
  if (product.status !== "PUBLISHED") throw new Error("This product is not available.");

  const existing = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
  });
  const nextQuantity = Math.min((existing?.quantity ?? 0) + quantity, product.stock || quantity);

  await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId } },
    update: { quantity: nextQuantity },
    create: { cartId: cart.id, productId, quantity: Math.min(quantity, product.stock) },
  });
}

export async function updateCartItemQuantity(productId: string, quantity: number) {
  const cart = await getOrCreateCart();
  if (quantity <= 0) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId } });
    return;
  }
  const product = await prisma.product.findUniqueOrThrow({ where: { id: productId } });
  await prisma.cartItem.update({
    where: { cartId_productId: { cartId: cart.id, productId } },
    data: { quantity: Math.min(quantity, product.stock) },
  });
}

export async function removeFromCart(productId: string) {
  const cart = await getOrCreateCart();
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId } });
}

export async function getCartWithTotals() {
  const cart = await getCart();
  if (!cart) {
    return { cartId: null, items: [], subtotalInr: 0, taxInr: 0, itemCount: 0 };
  }

  const items = await prisma.cartItem.findMany({
    where: { cartId: cart.id },
    include: {
      product: {
        include: { images: { where: { isThumbnail: true }, take: 1 } },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const validItems = items.filter((item) => item.product.status === "PUBLISHED");
  const subtotalInr = validItems.reduce(
    (sum, item) => sum + item.product.sellingPriceInr * item.quantity,
    0,
  );
  const taxInr = validItems.reduce(
    (sum, item) =>
      sum + Math.round((item.product.sellingPriceInr * item.quantity * item.product.gstPercent) / 100),
    0,
  );
  const itemCount = validItems.reduce((sum, item) => sum + item.quantity, 0);

  return { cartId: cart.id, items: validItems, subtotalInr, taxInr, itemCount };
}

export async function getCartItemCount() {
  const { itemCount } = await getCartWithTotals();
  return itemCount;
}

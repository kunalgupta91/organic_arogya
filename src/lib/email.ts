import { Resend } from "resend";
import { SITE_CONFIG } from "@/constants/site";

let client: Resend | undefined;

function getClient() {
  if (!client) {
    client = new Resend(process.env.RESEND_API_KEY);
  }
  return client;
}

const FROM = `${SITE_CONFIG.name} <no-reply@organicarogya.com>`;

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  await getClient().emails.send({
    from: FROM,
    to,
    subject: "Reset your password",
    html: `
      <p>Someone requested a password reset for your ${SITE_CONFIG.name} account.</p>
      <p><a href="${resetUrl}">Click here to reset your password</a>. This link expires in 1 hour.</p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `,
  });
}

const ADMIN_NOTIFICATION_EMAIL = process.env.ORDER_NOTIFICATION_EMAIL || SITE_CONFIG.email;

export async function sendAdminNotificationEmail(subject: string, html: string) {
  await getClient().emails.send({
    from: FROM,
    to: ADMIN_NOTIFICATION_EMAIL,
    subject,
    html,
  });
}

type OrderConfirmationOrder = {
  orderNumber: string;
  currency: string;
  totalAmount: number;
  items: { productNameSnapshot: string; quantity: number; totalPrice: number }[];
};

export async function sendOrderConfirmationEmail(to: string, order: OrderConfirmationOrder) {
  const formatAmount = (amount: number) => (amount / 100).toFixed(2);
  const rows = order.items
    .map(
      (item) =>
        `<tr><td>${item.productNameSnapshot} × ${item.quantity}</td><td>${order.currency} ${formatAmount(item.totalPrice)}</td></tr>`,
    )
    .join("");

  await getClient().emails.send({
    from: FROM,
    to,
    subject: `Order confirmed — ${order.orderNumber}`,
    html: `
      <p>Thank you for your order! Here's a summary of <strong>${order.orderNumber}</strong>:</p>
      <table cellpadding="6" style="border-collapse: collapse; width: 100%;">
        ${rows}
      </table>
      <p><strong>Total: ${order.currency} ${formatAmount(order.totalAmount)}</strong></p>
      <p>We'll email you again once your order ships.</p>
    `,
  });
}

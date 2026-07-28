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

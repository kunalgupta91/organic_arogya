import { prisma } from "@/lib/prisma";
import { sendAdminNotificationEmail } from "@/lib/email";

export type ContactInput = {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
};

export async function submitContactForm(input: ContactInput) {
  const submission = await prisma.contactSubmission.create({ data: input });

  await prisma.notification.create({
    data: {
      type: "SYSTEM",
      title: "New contact form submission",
      message: `${input.name} (${input.email}): ${input.message.slice(0, 140)}`,
      link: "/admin",
    },
  });

  // Email notification is best-effort — the submission is already saved,
  // so a missing/unconfigured RESEND_API_KEY must not fail the request.
  try {
    await sendAdminNotificationEmail(
      `New contact form message from ${input.name}`,
      `<p><strong>Name:</strong> ${input.name}</p>
       <p><strong>Email:</strong> ${input.email}</p>
       ${input.phone ? `<p><strong>Phone:</strong> ${input.phone}</p>` : ""}
       ${input.subject ? `<p><strong>Subject:</strong> ${input.subject}</p>` : ""}
       <p><strong>Message:</strong></p>
       <p>${input.message}</p>`,
    );
  } catch (error) {
    console.error("Failed to send contact notification email:", error);
  }

  return submission;
}

import { prisma } from "@/lib/prisma";
import { sendAdminNotificationEmail } from "@/lib/email";
import type { BulkOrderInput } from "@/validations/bulk-order";

export async function submitBulkOrder(input: BulkOrderInput, userId?: string) {
  const order = await prisma.bulkOrder.create({
    data: { ...input, userId },
  });

  await prisma.notification.create({
    data: {
      type: "BULK_ORDER",
      title: "New bulk order request",
      message: `${input.name} (${input.company ?? "individual"}) requested ${input.quantity} units.`,
      link: "/admin",
    },
  });

  try {
    await sendAdminNotificationEmail(
      `New bulk order request from ${input.name}`,
      `<p><strong>Name:</strong> ${input.name}</p>
       <p><strong>Company:</strong> ${input.company ?? "—"}</p>
       <p><strong>GST Number:</strong> ${input.gstNumber ?? "—"}</p>
       <p><strong>Phone:</strong> ${input.phone}</p>
       <p><strong>Email:</strong> ${input.email}</p>
       <p><strong>Address:</strong> ${input.address}, ${input.city}, ${input.state}, ${input.country}</p>
       <p><strong>Quantity:</strong> ${input.quantity}</p>
       ${input.remarks ? `<p><strong>Remarks:</strong> ${input.remarks}</p>` : ""}`,
    );
  } catch (error) {
    console.error("Failed to send bulk order notification email:", error);
  }

  return order;
}

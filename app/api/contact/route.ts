import { NextResponse } from "next/server";
import { z } from "zod";
import { sendEmail } from "@/src/lib/mail";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(160),
  email: z.string().trim().email(),
  projectType: z.string().trim().min(2).max(80),
  preferredDate: z.string().trim().optional().or(z.literal("")),
  budget: z.string().trim().max(80).optional().or(z.literal("")),
  message: z.string().trim().min(10).max(2000),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = contactSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: "Please complete all required fields correctly." }, { status: 400 });
    }

    const { name, email, projectType, preferredDate, budget, message } = parsed.data;
    const destination = process.env.CONTACT_EMAIL ?? "";

    if (!destination || !process.env.RESEND_API_KEY) {
      return NextResponse.json({
        error: "The contact form is currently unavailable. Please email the studio directly.",
      }, { status: 503 });
    }

    const result = await sendEmail({
      to: destination,
      subject: `New enquiry from ${name}`,
      html: `
        <h1>New enquiry</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Project type:</strong> ${projectType}</p>
        <p><strong>Preferred date:</strong> ${preferredDate || "Not specified"}</p>
        <p><strong>Budget:</strong> ${budget || "Not specified"}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
      text: `New enquiry from ${name}\nEmail: ${email}\nProject type: ${projectType}\nPreferred date: ${preferredDate || "Not specified"}\nBudget: ${budget || "Not specified"}\nMessage: ${message}`,
    });

    if (!result.ok) {
      return NextResponse.json({ error: "The enquiry could not be sent right now. Please try again later." }, { status: 500 });
    }

    return NextResponse.json({ message: "Your enquiry has been sent successfully." });
  } catch {
    return NextResponse.json({ error: "Something went wrong while sending the enquiry." }, { status: 500 });
  }
}

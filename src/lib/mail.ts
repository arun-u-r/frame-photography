import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  if (!resendApiKey) {
    return { ok: false, reason: "EMAIL_NOT_CONFIGURED" as const };
  }

  const resend = new Resend(resendApiKey);
  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "onboarding@resend.dev",
    to,
    subject,
    html,
    text,
  });

  if (result.error) {
    return { ok: false, reason: "EMAIL_SEND_FAILED" as const, error: result.error };
  }

  return { ok: true, id: result.data?.id ?? null };
}

import { Resend } from 'resend';
import { VerificationEmail } from '@/components/emails/VerificationEmail';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.FROM_EMAIL;

/**
 * Sends a verification email.
 */
export async function sendVerificationEmail(to: string, name:string, otp: string) {
  if (!fromEmail) {
    console.error('[Mail] FROM_EMAIL environment variable is not set. Email not sent.');
    // In production, you might want to throw an error or handle this more gracefully.
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `GiorBaliTour <${fromEmail}>`,
      to: [to],
      subject: `Your GiorBaliTour Verification Code: ${otp}`,
      react: VerificationEmail({ name, otp }),
      tags: [
        { name: 'category', value: 'confirm_email' },
      ],
    });

    if (error) {
      // Log the error for server-side inspection but don't block the API response.
      return console.error(`[Mail] Failed to send verification email to ${to}:`, error);
    }

    console.log(`[Mail] Verification email sent successfully to ${to}. Message ID: ${data?.id}`);

  } catch (err) {
    // Handles unexpected errors during the API call.
    console.error(`[Mail] An unexpected error occurred while sending email to ${to}:`, err);
  }
}

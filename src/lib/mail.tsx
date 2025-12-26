import { Resend } from 'resend';
import { VerificationEmail } from '@/components/emails/VerificationEmail';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';

/**
 * Sends a verification email and returns any error that occurs.
 * @returns A promise that resolves to the error object if sending fails, otherwise null.
 */
export async function sendVerificationEmail(to: string, name:string, otp: string): Promise<any | null> {
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
      console.error(`[Mail] Failed to send verification email to ${to}:`, error);
      return error; // Return the error instead of hiding it
    }

    console.log(`[Mail] Verification email sent successfully to ${to}. Message ID: ${data?.id}`);
    return null; // Return null on success

  } catch (err) {
    console.error(`[Mail] An unexpected error occurred while sending email to ${to}:`, err);
    return err; // Return the caught exception
  }
}

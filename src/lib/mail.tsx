import { Resend } from 'resend';
import { VerificationEmail } from '@/components/emails/VerificationEmail';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';

/**
 * Sends a verification email to a new user using the Resend `react` property.
 * @param to The recipient's email address.
 * @param name The recipient's name.
 * @param otp The One-Time Password to include in the email.
 */
export async function sendVerificationEmail(to: string, name: string, otp: string): Promise<void> {
  try {
    const { data, error } = await resend.emails.send({
      from: `GiorBaliTour <${fromEmail}>`,
      to: [to],
      subject: `Your GiorBaliTour Verification Code: ${otp}`,
      // Use the `react` property instead of `html` to let Resend handle the rendering.
      react: VerificationEmail({ name, otp }),
      tags: [
        { name: 'category', value: 'confirm_email' },
        { name: 'user_email', value: to },
      ],
    });

    if (error) {
      console.error(`[Mail] Failed to send verification email to ${to}:`, error);
      // We don't throw here, just log the error. The registration process should not fail if email fails.
      return;
    }

    console.log(`[Mail] Verification email sent successfully to ${to}. Message ID: ${data?.id}`);

  } catch (err) {
    console.error(`[Mail] An unexpected error occurred while sending email to ${to}:`, err);
    // Also don't throw, to ensure user registration can proceed.
  }
}

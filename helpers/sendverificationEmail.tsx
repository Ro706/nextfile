import { transporter } from '@/lib/nodemailer';
import VerificationEmail from '@/email/verificationEmail';
import { ApiResponse } from '@/types/ApiResponse';
import { render } from '@react-email/render';

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const emailHtml = await render(<VerificationEmail username={username} otp={verifyCode} />);

    await transporter.sendMail({
      from: `"True Feedback" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Mystery Message | Verification Code',
      html: emailHtml,
    });

    return {
      success: true,
      message: 'Verification email sent successfully.',
    };
  } catch (emailError) {
    console.error('Error sending verification email:', emailError);
    
    // Fallback for development
    console.log("----------------------------------------------------");
    console.log(`[DEV FALLBACK] Verification code for ${username}: ${verifyCode}`);
    console.log("----------------------------------------------------");

    return {
      success: false,
      message: emailError instanceof Error ? emailError.message : 'Failed to send verification email.',
    };
  }
}

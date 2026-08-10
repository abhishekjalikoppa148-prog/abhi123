interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private static fromEmail = process.env.EMAIL_FROM || 'noreply@celebrationcraft.com';
  private static apiKey = process.env.SENDGRID_API_KEY || process.env.RESEND_API_KEY;

  static async sendEmail(template: EmailTemplate): Promise<boolean> {
    try {
      if (!this.apiKey) {
        console.warn('Email API key not configured, skipping email send');
        return false;
      }

      // Using Resend API (can be swapped for SendGrid)
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: this.fromEmail,
          to: template.to,
          subject: template.subject,
          html: template.html,
          text: template.text
        })
      });

      if (!response.ok) {
        console.error('Email send failed:', await response.text());
        return false;
      }

      return true;
    } catch (error) {
      console.error('Email send error:', error);
      return false;
    }
  }

  static sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #e11d48;">Welcome to CelebrationCraft! 🎉</h1>
        <p>Hi ${name},</p>
        <p>Welcome to CelebrationCraft! We're excited to help you create beautiful birthday websites for your loved ones.</p>
        <p>Get started by creating your first birthday website:</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/onboarding" style="display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #e11d48, #9333ea); color: white; text-decoration: none; border-radius: 8px;">Create Your First Website</a>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <p>Best regards,<br>The CelebrationCraft Team</p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Welcome to CelebrationCraft! 🎉',
      html,
      text: `Welcome to CelebrationCraft! Get started by creating your first birthday website at ${process.env.NEXT_PUBLIC_APP_URL}/onboarding`
    });
  }

  static sendWebsitePublishedEmail(email: string, name: string, websiteUrl: string, personName: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #e11d48;">Your Birthday Website is Live! 🎂</h1>
        <p>Hi ${name},</p>
        <p>Great news! Your birthday website for ${personName} has been published successfully.</p>
        <p>Share the link with ${personName} and make their day special:</p>
        <a href="${websiteUrl}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #e11d48, #9333ea); color: white; text-decoration: none; border-radius: 8px;">View Birthday Website</a>
        <p>Website URL: ${websiteUrl}</p>
        <p>Best regards,<br>The CelebrationCraft Team</p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: `Your Birthday Website for ${personName} is Live! 🎂`,
      html,
      text: `Your birthday website for ${personName} is live! View it at: ${websiteUrl}`
    });
  }

  static sendPaymentConfirmationEmail(email: string, name: string, orderId: string, amount: number): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #e11d48;">Payment Confirmed! ✅</h1>
        <p>Hi ${name},</p>
        <p>Your payment has been processed successfully.</p>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Amount:</strong> ₹${amount}</p>
        <p>Your birthday website is now active and ready to share!</p>
        <p>Best regards,<br>The CelebrationCraft Team</p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: `Payment Confirmed - Order #${orderId}`,
      html,
      text: `Payment confirmed for order ${orderId}. Amount: ₹${amount}`
    });
  }

  static sendExpiringSoonEmail(email: string, name: string, websiteUrl: string, daysLeft: number): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #e11d48;">Your Birthday Website is Expiring Soon ⏰</h1>
        <p>Hi ${name},</p>
        <p>Your birthday website will expire in ${daysLeft} day${daysLeft > 1 ? 's' : ''}.</p>
        <p>To keep your website active, consider upgrading to a premium plan.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #e11d48, #9333ea); color: white; text-decoration: none; border-radius: 8px;">View Your Dashboard</a>
        <p>Website URL: ${websiteUrl}</p>
        <p>Best regards,<br>The CelebrationCraft Team</p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: `Your Birthday Website Expires in ${daysLeft} Days`,
      html,
      text: `Your birthday website expires in ${daysLeft} days. View it at: ${websiteUrl}`
    });
  }

  static sendReferralRewardEmail(email: string, name: string, credits: number): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #e11d48;">You Earned Credits! 🎁</h1>
        <p>Hi ${name},</p>
        <p>Someone used your referral code! You've earned ${credits} credits.</p>
        <p>Use these credits to create more birthday websites or upgrade to premium features.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #e11d48, #9333ea); color: white; text-decoration: none; border-radius: 8px;">View Your Credits</a>
        <p>Best regards,<br>The CelebrationCraft Team</p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: `You Earned ${credits} Credits! 🎁`,
      html,
      text: `You earned ${credits} credits from a referral! View your dashboard at ${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    });
  }
}

// server/utils/email.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export async function sendEmail(to, notification) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: notification.title,
      text: notification.message,
      html: generateEmailTemplate(notification)
    });
  } catch (error) {
    console.error('Email sending failed:', error);
  }
}

function generateEmailTemplate(notification) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">${notification.title}</h2>
      <p style="color: #666;">${notification.message}</p>
      ${notification.actionUrl ? `
        <a href="${notification.actionUrl}" 
           style="display: inline-block; padding: 10px 20px; 
                  background: #4F46E5; color: white; 
                  text-decoration: none; border-radius: 5px;">
          ${notification.actionText || 'View Details'}
        </a>
      ` : ''}
    </div>
  `;
}

let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch (err) {
  nodemailer = null;
}

const getTransporter = () => {
  if (!nodemailer) return null;
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return null;
};

const sendVerificationEmail = async ({ to, name, token }) => {
  const transporter = getTransporter();
  const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email?token=${token}`;
  const from = process.env.EMAIL_FROM || `no-reply@${process.env.CLIENT_URL?.replace(/https?:\/\//, '') || 'local'}`;
  const subject = 'Verify your email';
  const text = `Hello ${name || ''},\n\nPlease verify your email by clicking the link: ${verifyUrl}\n\nIf you did not request this, ignore.`;
  const html = `<p>Hello ${name || ''},</p><p>Please verify your email by clicking <a href="${verifyUrl}">this link</a>.</p>`;

  if (!transporter) {
    // Fallback: log to console
    console.log('Verification email (no SMTP configured):', { to, subject, text, verifyUrl });
    return;
  }

  await transporter.sendMail({ from, to, subject, text, html });
};

module.exports = { sendVerificationEmail };

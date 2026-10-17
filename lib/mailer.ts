import nodemailer from "nodemailer";

function getMailer() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("SMTP_HOST, SMTP_USER and SMTP_PASS must be configured");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendVerificationCode(email: string, code: string) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  await getMailer().sendMail({
    from,
    to: email,
    subject: "Your Mentor AI verification code",
    text: `Your Mentor AI verification code is ${code}. It expires in 10 minutes.`,
    html: `<p>Your Mentor AI verification code is:</p><p style="font-size: 24px; font-weight: bold; letter-spacing: 4px">${code}</p><p>This code expires in 10 minutes.</p>`,
  });
}

export async function sendPasswordResetLink(email: string, resetUrl: string) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  await getMailer().sendMail({
    from,
    to: email,
    subject: "Reset your Mentor AI password",
    text: `Use this link to reset your Mentor AI password: ${resetUrl}\n\nThis link expires in 30 minutes and can only be used once.`,
    html: `<p>We received a request to reset your Mentor AI password.</p><p><a href="${resetUrl}">Reset your password</a></p><p>This link expires in 30 minutes and can only be used once. If you did not request this, you can ignore this email.</p>`,
  });
}

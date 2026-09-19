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

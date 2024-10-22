import nodemailer from "nodemailer";

type EmailFormat = "text" | "html";

export const sendMail = async (
  to: string,
  subject: string,
  body: string,
  format: EmailFormat = "text"
) => {
  const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE_SENDER_HOST,
    auth: {
      user: process.env.MAIL_SERVICE_SENDER_USER,
      pass: process.env.MAIL_SERVICE_SENDER_PASSWORD,
    },
  });

  const fullMail = {
    from: process.env.MAIL_SERVICE_SENDER_USER,
    to: to,
    subject: subject,
    ...(format === "html" ? { html: body } : { text: body }),
  };
  try {
    await transporter.sendMail(fullMail);
  } catch (error) {
    console.error("Error on sending mail:", error);
  }
};

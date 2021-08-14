const nodemailer = require("nodemailer");
const envVars = require("../config/envVars.config");

const sendEmail = ({ toEmail, subject, body }) => {
  if (envVars.environment === "test") return true;
  const transporter = nodemailer.createTransport({
    host: envVars.smtp_host,
    port: envVars.smtp_port,
    secure: false,
    auth: {
      user: envVars.smtp_user,
      pass: envVars.smtp_password,
    },
  });

  transporter.sendMail(
    {
      from: envVars.from_user_email,
      to: toEmail,
      subject,
      text: body,
    },
    (info, err) => {
      console.info(`[EMAIL SENT] [TO] : ${toEmail} - [SUBJECT] ${subject} `);
    }
  );
  return true;
};

module.exports = { sendEmail };

const Brevo = require("@getbrevo/brevo");

const sendEmail = async (to, subject, htmlText) => {
  const apiInstance = new Brevo.TransactionalEmailsApi();

  apiInstance.setApiKey(
    Brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY
  );

  const sendSmtpEmail = {
    sender: {
      name: "CodeVault",
      email: process.env.EMAIL_FROM // 🔥 FIXED
    },
    to: [{ email: to }],
    subject,
    htmlContent: `
      <html>
        <body>
          <p>${htmlText}</p>
        </body>
      </html>
    `
  };

  await apiInstance.sendTransacEmail(sendSmtpEmail);
};

module.exports = sendEmail;

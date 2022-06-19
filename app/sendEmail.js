var SibApiV3Sdk = require("sib-api-v3-sdk");
var defaultClient = SibApiV3Sdk.ApiClient.instance;
var apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey =
  "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";

const sendEmail = async (email, subject, text) => {
    var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail = {
      sender: { email: "restar@restar.com" },
      to: [
        {
          email: email,
          name: "Restar",
        },
      ],
      subject: subject,
      textContent: text,
    };
    apiInstance.sendTransacEmail(sendSmtpEmail).then(
      function (data) {
        console.log("API called successfully. Returned data: " + data);
      },
      function (error) {
        console.error(error);
      }
    );
}

module.exports = sendEmail;

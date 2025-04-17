const mailer = require("nodemailer");

const sendingMail = async (to, subject, text) => {
  const transporter = mailer.createTransport({
    service: "gmail",
    auth: {
      user: "phoenix.3acc@gmail.com", // sending account
      pass: "mqww ogif noqg euvn", // app-specific password for the sending account
    },
  });

  const mailOptions = {
    from: "phoenix.3acc@gmail.com", // sender's email address
    to: to, // recipient's email address (e.g., shashankdemo@gmail.com)
    subject: subject,
    text: text,
  };

  const mailresponse = await transporter.sendMail(mailOptions);
  console.log(mailresponse);
  return mailresponse;
};

module.exports = {
  sendingMail,
};

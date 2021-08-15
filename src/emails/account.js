const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "charithj12@gmail.com",
    subject: "Welcome to the Task Manager App!",
    text: `Thanks for joining to the app, ${name}. Let us know how you get along with the app.`,
  });
};

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "charithj12@gmail.com",
    subject: "Task Manager Team Feedback",
    text: `It's sad to see you go ${name}. Please let us know why you cancelled your account. Hope we can improve.`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail,
};

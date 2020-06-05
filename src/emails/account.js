
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'hyrum.butler3@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'hyrum.butler3@gmail.com',
        subject: `We're sad to see you go ${name}`,
        text: `Goodbye, ${name}, would you mind taking a quick minute to share why you are leaving?`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}

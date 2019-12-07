const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const sendWelcomeEmail=(email, name)=>{
    sgMail.send({
        to:email,
        from:'tjnabieu@njala.edu.sl',
        subject:'Account Confirmation',
        text:'Welcome to the app, '+name+' Thank You for joining us. Please Let me know how we can get along'
    })
}

const sendCancelationEmail = (email,name)=>{
    sgMail.send({
        to:email,
        from:'tjnabieu@njala.edu.sl',
        subject:'Sorry ro see you go !',
        text:'Good bye, ' +name+ ', i hope to see you back soon'
    })
}

module.exports ={
    sendWelcomeEmail,
    sendCancelationEmail,
}
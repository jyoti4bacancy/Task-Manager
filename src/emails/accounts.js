const sgMail=require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail=(email,name)=>{
  sgMail.send({
      to:email,
      from:'jyoti.sharma@bacancy.com',
      subject:'thanks for joining..',
      text:`welcome  ${name} in our app.`

  })
  // .then(() => {
  //   console.log(' welcome Email sent')
  // })
  // .catch((error) => {
  //   console.error(error)
  // })
}

const sendCancelationEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'jyoti.sharma@bacancy.com',
        subject:'sry to see u go.',
        text:`good bye ${name}.`
  
    })
    // .then(() => {
    //       console.log(' cancelation Email sent')
    //     })
    //     .catch((error) => {
    //       console.error(error)
    //     })
  }
  
module.exports={
    sendWelcomeEmail,
    sendCancelationEmail
}











// sgMail.send({
//     to:'jyoti.sharma@bacancy.com',
//     from:'jyoti.sharma@bacancy.com',
//     subject:'Task app mail',
//     text:'node js app. related to task manager'
// }) .then(() => {
//     console.log('Email sent')
//   })
//   .catch((error) => {
//     console.error(error)
//   })
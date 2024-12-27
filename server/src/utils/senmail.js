 import nodemailer from 'nodemailer'



 


const sendEmail = async (toEmail, otp) => {
    const transporter =nodemailer.createTransport({
        service:'gmail',
        auth:{
    
          user:process.env.GMAIL,
          pass:process.env.GMAIL_PASSWORD
        },
    
     
     
       
    })
    console.log(process.env.GMAIL)
    const mailOptions = {
      from: process.env.GMAIL,
      to: toEmail,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. This OTP is valid for 5 minutes.`
    };
  
    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      return false;
    }
  };
  
  export { sendEmail };
  
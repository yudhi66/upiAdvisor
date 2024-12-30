 
import transporter from './transporter.js';

 


const sendEmail = async (toEmail, otp) => {
   
     
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
  
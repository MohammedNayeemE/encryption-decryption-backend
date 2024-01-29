import nodemailer from 'nodemailer'


const email = process.env.EMAIL;
const password = process.env.PASSWORD;


export const sendthroughMail = async (token : string , Email : string) =>{
  
    let config = {
        service : 'gmail',
        auth : {
            user : email,
            pass : password
            
        }
    }

    let transporter = nodemailer.createTransport(config);

    let info = {
        from : `GIT OUT OF THE WAY 🐱 ${email}`,
        to : `${Email}`,
        subject : `OTP FOR PASSWORD RESET`,
        text : `otp for password enter the following otp`,
        html : `<b>${token}</b>`
    }
    try{
    const response = await transporter.sendMail(info);
    if(response){
        console.log(`mail sent successfully`);
        
        return response;
    }
    }
    catch(error){
        console.error(error);
        
      return null
    }

}
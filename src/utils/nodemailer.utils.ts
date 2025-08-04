 import nodeMailer from 'nodemailer'
 import CustomError from '../middlewares/error-handler.middleware'
//nodemailer  Config

const transporter = nodeMailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMPT_PORT) === 465 ? true : false, 
  service: process.env.SMTP_SERVICE,
  auth: {  
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS, 
    
  },

});
 

interface IMailOption {
    to:string;
    subject:string
    html:string;
    attachments? : null | any[],
    cc?: null | string | string[]
    bcc?: null | string | string[]

}


export const sendMail = async ({
  to,
  subject,
  html,
  attachments = null,
  cc = null,
  bcc = null,
}:IMailOption) => {
  try {
    let messageOptions: Record<string, any> = {
      from: `Travel Management System<${process.env.SMTP_USER}>`,
      to: to,
      subject,
      html,
    };

    if (attachments) {
      messageOptions["attachments"] = attachments;
    }

    if (cc) {
      messageOptions["cc"] = cc;
    }

    if (bcc) {
      messageOptions["bcc"] = bcc;
    }

    // !sending mail 
    await transporter.sendMail(messageOptions);
  } catch (error) {
    console.log(error)
    throw new CustomError("email send error", 500);
  }
};
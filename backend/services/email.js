import { Resend } from "resend";

export const sendEmail = async ({ name, email, message }) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  return resend.emails.send({
    from: "Portfolio <contact@abi.gg>", 
    to: "contact@abi.gg",                 
    subject: `[Portfolio Contact Form] New Message from ${name}`,
    text: `Message from ${name} <${email}>\n---\n\n${message}`, 
    replyTo: email                        
  });
};
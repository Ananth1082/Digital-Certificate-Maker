import nodemailer from "nodemailer";
import { CertDetails, generateCertificate } from "./generate-certificate";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function generateEmail(
  to: string,
  subject: string,
  text: string,
  imageBuffer: Buffer
) {
  const info = await transporter.sendMail({
    from: "Incredia",
    to,
    subject,
    text,
    attachments: [
      {
        filename: "certificate.png",
        content: imageBuffer,
        contentType: "image/png",
      },
    ],
  });
  return info;
}

export async function generateCertificateEmail(
  details: CertDetails,
  email: string
) {
  const emailText = `Hi ${details.name},

Thank you for your active participation in Incridea, held from February 22nd-24th at NMAMIT, Nitte.

Your captivating performance perfectly aligned with our theme, 'Dice of Destiny', casting a spell of chance and fortune. Let's continue to embrace the unpredictable twists of creativity and imagination through Incridea in the years to come.❤️
  
Please find your participation certificate attached.
  
Warm Regards,
Team Incridea
  
Check out the Official Aftermovie '24 down below 👇
https://youtu.be/YoWeuaSMytk
  
Find more updates and highlights of the fest on our Instagram page @incridea 👇
https://instagram.com/incridea
 `;
  const emailSubject = `Incridea Participation Certificate (${details.event})`;
  const emailContent = {
    to: email,
    subject: emailSubject,
    text: emailText,
  };
  const imageBuffer = (await generateCertificate(details)) as Buffer;
  await generateEmail(
    emailContent.to,
    emailContent.subject,
    emailContent.text,
    imageBuffer
  );
  return imageBuffer;
}

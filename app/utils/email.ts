import * as fs from "fs";
import * as path from "path";
import * as nodemailer from "nodemailer";
import htmlToImage from "node-html-to-image";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { generateCertificate } from "./generate-cert";

let certificateSentSuccess = 0;
let certificateSentError = 0;

const sendCertificate = async (
  participantName: string,
  college: string,
  eventName: string,
  participantEmail: string
) => {
  const emailText = `Hi ${participantName},

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
  const emailSubject = `Incridea Participation Certificate (${eventName})`;
  const certificatePath = await generateCertificate(
    participantName,
    college,
    eventName
  );
  await sendEmailWithAttachment(
    participantEmail,
    certificatePath,
    emailSubject,
    emailText
  );
};

async function sendParticipationCertificate() {
  const participation = await prisma.team.findMany({
    where: {
      attended: true,
    },
    include: {
      TeamMembers: {
        include: {
          User: {
            include: {
              College: true,
            },
          },
        },
      },
      Event: {
        select: {
          name: true,
        },
      },
    },
  });

  //  participationData  ={
  //   name: "Participant Name";
  //   eventName: "Event Name";
  //   email: "Participant Email";
  //   college: "Participant College";
  // }[]
  const participationData = participation.map((team) => {
    return team.TeamMembers.map((member) => {
      return {
        userId: member.userId,
        eventId: team.eventId,
        name: member.User.name,
        eventName: team.Event.name,
        email: member.User.email,
        college: member.User.College?.name,
      };
    });
  });
  // reduce the array of arrays to a single array
  const flattenedParticipationData = participationData.reduce(
    (acc, val) => acc.concat(val),
    []
  );
  for (let i = 0; i < flattenedParticipationData.length; i++) {
    const participant = flattenedParticipationData[i];
    try {
      await sendCertificate(
        participant.name,
        participant.college || "OTHER",
        participant.eventName,
        participant.email
      );
      certificateSentSuccess++;
      await prisma.certificateIssue.create({
        data: {
          EventId: participant.eventId,
          userId: participant.userId,
          issued: true,
        },
      });
    } catch (err) {
      certificateSentError++;
      await prisma.certificateIssue.create({
        data: {
          EventId: participant.eventId,
          userId: participant.userId,
          issued: false,
        },
      });
    }
    console.log(
      `Sent ${certificateSentSuccess} certificates and ${certificateSentError} failed`
    );
  }

  await fs.writeFileSync(
    "./participation.json",
    JSON.stringify(flattenedParticipationData)
  );
}

// sendParticipationCertificate()
//   .then(() => {
//     console.log("done");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

export async function sendEmailWithAttachmentBuff(
  participantEmail: string,
  raw: Buffer,
  subject: string,
  text: string
): Promise<void> {
  try {
    // Create a nodemailer transporter
    const count = await getCount();
    const user = getUser(count);
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: user,
        pass: process.env.EMAIL_SERVER_PASSWORD as string,
      },
    });

    // Compose the email
    const mailOptions = {
      from: process.env.EMAIL_FROM as string,
      to: participantEmail,
      subject: subject,
      text: text,
      attachments: [{ raw, filename: `certificate.png` }],
    };
    await transporter.sendMail(mailOptions);
    await updateCount(count);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Could not send Email: Internal server error");
  }
}

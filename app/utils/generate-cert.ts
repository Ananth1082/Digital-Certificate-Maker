import htmlToImage from "node-html-to-image";
import fs from "node:fs";
const template = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="" />
    
    <title>Participation Certificate</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap');
      * {
        margin: 0;
        padding: 0;
      }
      .background {
        position: relative;
        /* background-image: url("https://res.cloudinary.com/dfhg1joox/image/upload/v1718946999/pya21yngjtywworaebiy.jpg"); */
        background-image: url("https://res.cloudinary.com/dfhg1joox/image/upload/v1722062123/qqgtml9wknn55dgcy6ky.jpg");
        background-color: transparent;
        display: flex;
        width: 1080px;
        height: 764.5px;
        background-repeat: no-repeat;
        background-size: cover;
      }
      .content {
        position: absolute;
        top: 385px;
        left: 320px;
        font-size: 24px;
        padding: 10px 50px;
        text-align: justify;
        -moz-text-align-last: center;
        text-align-last: center;
        line-height: 35px;
        font-family: 'Raleway', sans-serif;
      }
      .custom-text {
        text-transform: uppercase;
        font-weight: 700;
        font-size: 24px;
        line-height: 35px;
        font-family: 'Raleway', sans-serif;
      }
      .image {
        height:47px;
        position: absolute;
        top: -32px;
        left: 8px;
      }
    </style>
  </head>

  <body class="background">
    <div class="content">
      <pre style="text-align: center;  
      font-size: 24px;
      line-height: 35px;
      font-family: 'Raleway', sans-serif;" >THIS IS TO CERTIFY THAT </pre>
      MR/MS <span class="custom-text">{{name}}</span><span> OF</span>
      <span class="custom-text">{{college}}</span> HAS PARTICIPATED IN
      <span class="custom-text">{{event}}</span> DURING
      <span style="position: relative; width: 120px; display: inline-flex"
        >
        <img
          class="image"
          src="https://res.cloudinary.com/nexttrek/image/upload/v1688186046/Incridea/logo-black_enaoeg.png"
          alt="INCRIDEA LOGO"
      />
    </span>
    ‘24 HELD BETWEEN FEBRUARY 22<span style="font-size:small; vertical-align:top;">nd</span> - 24<span style="font-size:small; vertical-align:top;">th</span> AT N.M.A.M. INSTITUTE OF TECHNOLOGY, NITTE.
    </div>
  </body>

  <!-- <body class="background">
    <div class="content">
      <pre style="text-align: center;  
      font-size: 24px;
      line-height: 35px;
      text-transform: capitalize;
      font-family: 'Raleway', sans-serif;" >This Is To Certify That </pre>
      Mr/Ms <span class="custom-text">{{name}}</span><span> OF</span>
      <span class="custom-text">{{college}}</span> Has Participated In
      <span class="custom-text">{{event}}</span> During
      <span style="position: relative; width: 120px; display: inline-flex; text-transform: capitalize;" 
        >
        <img
          class="image"
          src="https://res.cloudinary.com/nexttrek/image/upload/v1688186046/Incridea/logo-black_enaoeg.png"
          alt="INCRIDEA LOGO"
      />
    </span>
    ‘24 Held Between February 22<span style="font-size:small; vertical-align:top;">nd</span> - 24<span style="font-size:small; vertical-align:top;">th</span> At NMAM Institute Of Technology, Nitte.
    </div>
  </body> -->
</html>
`;

export async function generateCertificate(
  fields: string[],
  certificateDetails: Record<string, string>
): Promise<string | Buffer> {
  try {
    let html = template;

    fields.forEach((field) => {
      html = html.replace(`{{${field}}}`, certificateDetails[field]);
    });

    const imageBuffer = await htmlToImage({
      html,
    });

    if (Array.isArray(imageBuffer)) {
      console.log("Multiple images generated");
      return imageBuffer[0];
    }

    return imageBuffer;
  } catch (error) {
    console.error("Error generating certificate:", error);
    throw new Error("Error generating certificate");
  }
}

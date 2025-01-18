import htmlToImage from "node-html-to-image";

export async function generateCertificate(
  fields: string[],
  certificateDetails: Record<string, string>,
  format: string
): Promise<string | Buffer> {
  try {
    let html = format;

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

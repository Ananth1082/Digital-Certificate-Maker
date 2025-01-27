import { generateCertificateEmail, generateEmail } from "@/util/email";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { to, details, cid } = await req.json();

    if (!to) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }
    const headers = new Headers();
    headers.set("Content-Type", "image/jpeg");
    const info = await generateCertificateEmail(details, to);
    if (cid) {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/certificate/mark-as-sent/${cid}`,
        {
          method: "PUT",
        }
      );
    }
    return new NextResponse(info, { status: 200, headers });
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};

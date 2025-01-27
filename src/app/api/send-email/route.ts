import { generateCertificateEmail, generateEmail } from "@/util/email";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Parse the JSON body
    const { to, details, cid } = await req.json();

    // Validate required fields
    if (!to) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }
    const headers = new Headers();
    headers.set("Content-Type", "image/jpeg");
    // Send email
    const info = await generateCertificateEmail(details, to);
    if (cid) {
      await fetch(`http://localhost:4000/certificate/mark-as-sent/${cid}`, {
        method: "PUT",
      });
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

// Optionally configure allowed methods
export const config = {
  api: {
    bodyParser: true,
  },
};

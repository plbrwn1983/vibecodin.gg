import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { name, description, reason } = await request.json();

  if (!name || !description || !reason) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: "vibecodin.gg <onboarding@resend.dev>",
    to: "plbrwn1983@gmail.com",
    subject: `Hub Nomination: ${name}`,
    text: `Hub Name: ${name}\n\nDescription: ${description}\n\nWhy this hub should exist:\n${reason}`,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Failed to send nomination" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

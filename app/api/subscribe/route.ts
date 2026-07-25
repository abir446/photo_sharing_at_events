import { NextRequest, NextResponse } from "next/server";
// @ts-ignore
import mailchimp from "@mailchimp/mailchimp_marketing";

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY || "",
  server: process.env.MAILCHIMP_SERVER || "",
});

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
    if (!audienceId) {
      console.error("Missing MAILCHIMP_AUDIENCE_ID in environment variables.");
      return NextResponse.json({
        success: false,
        message: "Mailchimp is not configured correctly on the server.",
      });
    }

    await mailchimp.lists.addListMember(audienceId, {
      email_address: email.trim(),
      status: "subscribed",
    });

    return NextResponse.json({
      success: true,
    });

  } catch (err: any) {
    console.error("Mailchimp API Error:", err);
    
    // Extract a human-readable detail from Mailchimp response if present
    const detail = err.response?.body?.detail || err.message || "Something went wrong.";
    
    return NextResponse.json({
      success: false,
      message: detail,
    });
  }
}

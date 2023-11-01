import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, message, stack, details } = body;
  const data = {
    name,
    message,
    stack,
  };
  if (
    details.trim().toLowerCase() !== "each address can only mint two tokens"
  ) {
    sendToSlack(data);
  }
  try {
    return NextResponse.json({ message: "This Worked", success: true });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: err, success: false });
  }
}

const sendToSlack = async (message: any) => {
  try {
    await axios.post(
      `https://hooks.zapier.com/hooks/catch${process.env.ZAPIER_WEBHOOK_PATH}`,
      {
        text: message,
      }
    );
  } catch (error) {
    console.error("Failed to send error to Slack", error);
  }
};

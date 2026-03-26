import { NextRequest, NextResponse } from "next/server";
import { storeMemory } from "../../../lib/mem0";

export async function POST(request: NextRequest) {
  try {
    const { userId, userMessage, assistantMessage } = await request.json();

    if (!userId || !userMessage || !assistantMessage) {
      return NextResponse.json(
        { error: "Missing userId, userMessage, or assistantMessage" },
        { status: 400 }
      );
    }

    await storeMemory(userId, [
      { role: "user", content: userMessage },
      { role: "assistant", content: assistantMessage },
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Memory conversation API error:", error);
    return NextResponse.json(
      { error: "Failed to store conversation" },
      { status: 500 }
    );
  }
}

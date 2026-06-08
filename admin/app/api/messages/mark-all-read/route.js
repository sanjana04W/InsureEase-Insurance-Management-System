import { NextResponse } from "next/server";
import { connectDB }    from "@/lib/mongodb";
import Contact          from "@/models/Contact";

// PUT /api/messages/mark-all-read — mark all unread as read
export async function PUT() {
  try {
    await connectDB();
    const result = await Contact.updateMany(
      { isRead: false },
      { $set: { isRead: true } }
    );
    return NextResponse.json(
      { success: true, updated: result.modifiedCount },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to mark all as read" },
      { status: 500 }
    );
  }
}

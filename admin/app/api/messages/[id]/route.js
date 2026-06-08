import { NextResponse } from "next/server";
import { connectDB }    from "@/lib/mongodb";
import Contact          from "@/models/Contact";

// GET /api/messages/:id — fetch single message & mark as read
export async function GET(request, { params }) {
  try {
    await connectDB();
    const message = await Contact.findByIdAndUpdate(
      (await params).id,
      { isRead: true },
      { new: true }
    );
    if (!message) {
      return NextResponse.json(
        { success: false, message: "Message not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, message }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch message" },
      { status: 500 }
    );
  }
}

// PUT /api/messages/:id — toggle read/unread
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { isRead } = await request.json();
    const message = await Contact.findByIdAndUpdate(
      (await params).id,
      { isRead },
      { new: true }
    );
    if (!message) {
      return NextResponse.json(
        { success: false, message: "Message not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, message }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to update message" },
      { status: 500 }
    );
  }
}

// DELETE /api/messages/:id
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const message = await Contact.findByIdAndDelete((await params).id);
    if (!message) {
      return NextResponse.json(
        { success: false, message: "Message not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: true, message: "Message deleted successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to delete message" },
      { status: 500 }
    );
  }
}
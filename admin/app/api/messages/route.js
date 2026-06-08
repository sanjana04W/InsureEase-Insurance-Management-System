import { NextResponse } from "next/server";
import { connectDB }    from "@/lib/mongodb";
import Contact          from "@/models/Contact";

export const dynamic = "force-dynamic";

// GET /api/messages — fetch all messages with filters
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const filter = searchParams.get("filter"); // "all" | "unread" | "read"

    const query = {};
    if (filter === "unread") query.isRead = false;
    if (filter === "read")   query.isRead = true;
    if (search) {
      query.$or = [
        { name:    { $regex: search, $options: "i" } },
        { email:   { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }

    const messages = await Contact.find(query).sort({ createdAt: -1 });
    const total    = await Contact.countDocuments();
    const unread   = await Contact.countDocuments({ isRead: false });
    const read     = await Contact.countDocuments({ isRead: true });

    return NextResponse.json(
      { success: true, messages, meta: { total, unread, read } },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
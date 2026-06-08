import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/Contact";
import { validateContactForm } from "@/utils/validators";

// POST /api/contact — save contact form submission
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const errors = validateContactForm(body);
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors },
        { status: 400 }
      );
    }

    const contact = await Contact.create({
      ...body,
      email: body.email.toLowerCase(),
    });

    return NextResponse.json(
      { success: true, message: "Message received successfully", contact },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to send message" },
      { status: 500 }
    );
  }
}

// GET /api/contact — fetch all messages (admin use)
export async function GET() {
  try {
    await connectDB();
    const messages = await Contact.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, messages }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
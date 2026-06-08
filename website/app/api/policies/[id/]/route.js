import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Policy from "@/models/Policy";

// GET /api/policies/:id
export async function GET(request, { params }) {
  try {
    await connectDB();
    const policy = await Policy.findById(params.id);
    if (!policy) {
      return NextResponse.json(
        { success: false, message: "Policy not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, policy }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch policy" },
      { status: 500 }
    );
  }
}

// PUT /api/policies/:id
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const body   = await request.json();
    const policy = await Policy.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });

    if (!policy) {
      return NextResponse.json(
        { success: false, message: "Policy not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, policy }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update policy" },
      { status: 500 }
    );
  }
}

// DELETE /api/policies/:id
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const policy = await Policy.findByIdAndDelete(params.id);
    if (!policy) {
      return NextResponse.json(
        { success: false, message: "Policy not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, message: "Policy deleted" }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete policy" },
      { status: 500 }
    );
  }
}
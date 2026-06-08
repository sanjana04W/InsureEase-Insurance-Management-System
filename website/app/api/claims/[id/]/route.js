import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Claim from "@/models/Claim";

// GET /api/claims/:id
export async function GET(request, { params }) {
  try {
    await connectDB();
    const claim = await Claim.findById(params.id);
    if (!claim) {
      return NextResponse.json(
        { success: false, message: "Claim not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, claim }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch claim" },
      { status: 500 }
    );
  }
}

// PUT /api/claims/:id — update claim status (admin)
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const body  = await request.json();
    const claim = await Claim.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });

    if (!claim) {
      return NextResponse.json(
        { success: false, message: "Claim not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, claim }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update claim" },
      { status: 500 }
    );
  }
}

// DELETE /api/claims/:id
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const claim = await Claim.findByIdAndDelete(params.id);
    if (!claim) {
      return NextResponse.json(
        { success: false, message: "Claim not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, message: "Claim deleted" }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete claim" },
      { status: 500 }
    );
  }
}
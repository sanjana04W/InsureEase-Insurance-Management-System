import { NextResponse } from "next/server";
import { connectDB }    from "@/lib/mongodb";
import Payment          from "@/models/Payment";

// GET /api/payments/:id
export async function GET(request, { params }) {
  try {
    await connectDB();
    const payment = await Payment.findById((await params).id);
    if (!payment) {
      return NextResponse.json(
        { success: false, message: "Payment not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, payment }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch payment" },
      { status: 500 }
    );
  }
}

// PUT /api/payments/:id — update payment status
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const body    = await request.json();
    const payment = await Payment.findByIdAndUpdate(
      (await params).id, body, { new: true, runValidators: true }
    );
    if (!payment) {
      return NextResponse.json(
        { success: false, message: "Payment not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, payment }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to update payment" },
      { status: 500 }
    );
  }
}

// DELETE /api/payments/:id
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const payment = await Payment.findByIdAndDelete((await params).id);
    if (!payment) {
      return NextResponse.json(
        { success: false, message: "Payment not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: true, message: "Payment deleted successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to delete payment" },
      { status: 500 }
    );
  }
}
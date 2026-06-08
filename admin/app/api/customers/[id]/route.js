import { NextResponse } from "next/server";
import { connectDB }    from "@/lib/mongodb";
import Customer         from "@/models/Customer";

// GET /api/customers/:id
export async function GET(request, { params }) {
  try {
    await connectDB();
    const customer = await Customer.findById((await params).id);
    if (!customer) {
      return NextResponse.json(
        { success: false, message: "Customer not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, customer }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch customer" },
      { status: 500 }
    );
  }
}

// PUT /api/customers/:id — update customer
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const body     = await request.json();
    const customer = await Customer.findByIdAndUpdate(
      (await params).id,
      { ...body, email: body.email?.toLowerCase() },
      { new: true, runValidators: true }
    );
    if (!customer) {
      return NextResponse.json(
        { success: false, message: "Customer not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, customer }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to update customer" },
      { status: 500 }
    );
  }
}

// DELETE /api/customers/:id
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const customer = await Customer.findByIdAndDelete((await params).id);
    if (!customer) {
      return NextResponse.json(
        { success: false, message: "Customer not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: true, message: "Customer deleted successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to delete customer" },
      { status: 500 }
    );
  }
}
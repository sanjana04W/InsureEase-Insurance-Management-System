import { NextResponse } from "next/server";
import { connectDB }    from "@/lib/mongodb";
import Customer         from "@/models/Customer";

export const dynamic = "force-dynamic";

// GET /api/customers — fetch all with optional search & status filter
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");

    const query = {};
    if (status && status !== "all") query.status = status;
    if (search) {
      query.$or = [
        { name:  { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const customers = await Customer.find(query).sort({ createdAt: -1 });
    const total     = await Customer.countDocuments();
    const active    = await Customer.countDocuments({ status: "active" });
    const inactive  = await Customer.countDocuments({ status: "inactive" });

    return NextResponse.json(
      { success: true, customers, meta: { total, active, inactive } },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

// POST /api/customers — create new customer
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: "Name and email are required" },
        { status: 400 }
      );
    }

    // Check duplicate email
    const existing = await Customer.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "A customer with this email already exists" },
        { status: 409 }
      );
    }

    const customer = await Customer.create({ ...body, email: email.toLowerCase() });
    return NextResponse.json({ success: true, customer }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to create customer" },
      { status: 500 }
    );
  }
}
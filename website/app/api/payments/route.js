import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Payment from "@/models/Payment";

// GET /api/payments — fetch all payments
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const policyNumber = searchParams.get("policyNumber");

    const query = {};
    if (policyNumber) query.policyNumber = policyNumber;

    const payments = await Payment.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, payments }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}

// POST /api/payments — create new payment record
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const { customerName, policyNumber, policyType, amount, paymentDate, paymentMethod } = body;
    if (!customerName || !policyNumber || !policyType || !amount || !paymentDate || !paymentMethod) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const payment = await Payment.create(body);
    return NextResponse.json({ success: true, payment }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to create payment" },
      { status: 500 }
    );
  }
}
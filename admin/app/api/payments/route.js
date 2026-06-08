import { NextResponse } from "next/server";
import { connectDB }    from "@/lib/mongodb";
import Payment          from "@/models/Payment";

export const dynamic = "force-dynamic";

// GET /api/payments — fetch all with filters
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const search      = searchParams.get("search");
    const status      = searchParams.get("status");
    const policyType  = searchParams.get("policyType");
    const policyNumber = searchParams.get("policyNumber");

    const query = {};
    if (status      && status      !== "all") query.status     = status;
    if (policyType  && policyType  !== "all") query.policyType = policyType;
    if (policyNumber) query.policyNumber = policyNumber;
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: "i" } },
        { policyNumber: { $regex: search, $options: "i" } },
      ];
    }

    const payments = await Payment.find(query).sort({ createdAt: -1 });

    // Meta stats
    const total   = await Payment.countDocuments();
    const paid    = await Payment.countDocuments({ status: "paid" });
    const pending = await Payment.countDocuments({ status: "pending" });
    const failed  = await Payment.countDocuments({ status: "failed" });

    // Total revenue from paid
    const revenueData = await Payment.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalRevenue = revenueData[0]?.total || 0;

    // Pending amount
    const pendingData = await Payment.aggregate([
      { $match: { status: "pending" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const pendingAmount = pendingData[0]?.total || 0;

    return NextResponse.json(
      {
        success: true,
        payments,
        meta: { total, paid, pending, failed, totalRevenue, pendingAmount },
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}

// POST /api/payments — create new payment
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
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to create payment" },
      { status: 500 }
    );
  }
}
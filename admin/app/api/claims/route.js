import { NextResponse } from "next/server";
import { connectDB }    from "@/lib/mongodb";
import Claim            from "@/models/Claim";

export const dynamic = "force-dynamic";

// GET /api/claims — fetch all with filters
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const search    = searchParams.get("search");
    const status    = searchParams.get("status");
    const claimType = searchParams.get("claimType");

    const query = {};
    if (status    && status    !== "all") query.status    = status;
    if (claimType && claimType !== "all") query.claimType = claimType;
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: "i" } },
        { email:        { $regex: search, $options: "i" } },
        { policyNumber: { $regex: search, $options: "i" } },
      ];
    }

    const claims   = await Claim.find(query).sort({ createdAt: -1 });
    const total    = await Claim.countDocuments();
    const pending  = await Claim.countDocuments({ status: "pending" });
    const approved = await Claim.countDocuments({ status: "approved" });
    const rejected = await Claim.countDocuments({ status: "rejected" });

    // Total claimed amount
    const amountData = await Claim.aggregate([
      { $group: { _id: null, total: { $sum: "$claimAmount" } } },
    ]);
    const totalAmount = amountData[0]?.total || 0;

    return NextResponse.json(
      { success: true, claims, meta: { total, pending, approved, rejected, totalAmount } },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch claims" },
      { status: 500 }
    );
  }
}

// POST /api/claims — create claim (from website)
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { customerName, email, policyNumber, claimType, incidentDate, description, claimAmount } = body;

    if (!customerName || !email || !policyNumber || !claimType || !incidentDate || !description || !claimAmount) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const claim = await Claim.create({ ...body, email: body.email.toLowerCase(), status: "pending" });
    return NextResponse.json({ success: true, claim }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to submit claim" },
      { status: 500 }
    );
  }
}
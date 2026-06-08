import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Claim from "@/models/Claim";
import { validateClaimForm } from "@/utils/validators";

// GET /api/claims?email=xxx — fetch claims by customer email
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const claims = await Claim.find({ email: email.toLowerCase() }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, claims }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch claims" },
      { status: 500 }
    );
  }
}

// POST /api/claims — submit a new claim
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    // Validate
    const errors = validateClaimForm(body);
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors },
        { status: 400 }
      );
    }

    const claim = await Claim.create({
      ...body,
      email:  body.email.toLowerCase(),
      status: "pending",
    });

    return NextResponse.json({ success: true, claim }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to submit claim" },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Policy from "@/models/Policy";

// GET /api/policies — fetch all active policies with optional filters
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search   = searchParams.get("search");

    const query = { status: "active" };
    if (category && category !== "All") query.category = category;
    if (search) {
      query.$or = [
        { title:       { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const policies = await Policy.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, policies }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch policies" },
      { status: 500 }
    );
  }
}

// POST /api/policies — create new policy (admin use)
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const { title, description, category, coverageAmount, premium, duration } = body;
    if (!title || !description || !category || !coverageAmount || !premium || !duration) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const policy = await Policy.create(body);
    return NextResponse.json({ success: true, policy }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to create policy" },
      { status: 500 }
    );
  }
}
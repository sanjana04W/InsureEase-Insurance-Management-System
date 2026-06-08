import { NextResponse } from "next/server";
import { connectDB }    from "@/lib/mongodb";
import Policy           from "@/models/Policy";

// GET /api/policies — fetch all with filters
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const search   = searchParams.get("search");
    const category = searchParams.get("category");
    const status   = searchParams.get("status");

    const query = {};
    if (status   && status   !== "all") query.status   = status;
    if (category && category !== "all") query.category = category;
    if (search) {
      query.$or = [
        { title:       { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const policies = await Policy.find(query).sort({ createdAt: -1 });
    const total    = await Policy.countDocuments();
    const active   = await Policy.countDocuments({ status: "active" });
    const inactive = await Policy.countDocuments({ status: "inactive" });

    return NextResponse.json(
      { success: true, policies, meta: { total, active, inactive } },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch policies" },
      { status: 500 }
    );
  }
}

// POST /api/policies — create new policy
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
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to create policy" },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { connectDB }    from "@/lib/mongodb";
import AdminUser        from "@/models/AdminUser";
import { signToken }    from "@/lib/jwt";

export async function POST(request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const admin = await AdminUser.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = await signToken({
      id: admin._id.toString(), email: admin.email, role: admin.role,
    });

    const response = NextResponse.json(
      { success: true, message: "Login successful",
        admin: { id: admin._id, name: admin.name, email: admin.email } },
      { status: 200 }
    );

    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge:   60 * 60 * 24 * 7,
      path:     "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, message: "Login failed" },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { connectDB }    from "@/lib/mongodb";
import Customer from "@/models/Customer";
import Policy   from "@/models/Policy";
import Claim    from "@/models/Claim";
import Payment  from "@/models/Payment";
import Contact  from "@/models/Contact";

export async function GET() {
  try {
    await connectDB();

    const [
      totalCustomers,
      activeCustomers,
      totalPolicies,
      activePolicies,
      totalClaims,
      pendingClaims,
      approvedClaims,
      rejectedClaims,
      totalPayments,
      paidPayments,
      unreadMessages,
      recentClaims,
      recentCustomers,
      claimsByType,
      monthlyPayments,
    ] = await Promise.all([
      Customer.countDocuments(),
      Customer.countDocuments({ status: "active" }),
      Policy.countDocuments(),
      Policy.countDocuments({ status: "active" }),
      Claim.countDocuments(),
      Claim.countDocuments({ status: "pending" }),
      Claim.countDocuments({ status: "approved" }),
      Claim.countDocuments({ status: "rejected" }),
      Payment.countDocuments(),
      Payment.countDocuments({ status: "paid" }),
      Contact.countDocuments({ isRead: false }),
      Claim.find().sort({ createdAt: -1 }).limit(5),
      Customer.find().sort({ createdAt: -1 }).limit(5),

      Claim.aggregate([
        { $group: { _id: "$claimType", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      Payment.aggregate([
        {
          $match: {
            status: "paid",
            createdAt: {
              $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
            },
          },
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id": 1 } },
      ]),
    ]);

    const revenueData = await Payment.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalRevenue = revenueData[0]?.total || 0;

    return NextResponse.json({
      success: true,
      stats: {
        customers:    { total: totalCustomers, active: activeCustomers },
        policies:     { total: totalPolicies,  active: activePolicies },
        claims:       { total: totalClaims, pending: pendingClaims, approved: approvedClaims, rejected: rejectedClaims },
        payments:     { total: totalPayments, paid: paidPayments },
        revenue:      totalRevenue,
        unreadMessages,
      },
      recentClaims,
      recentCustomers,
      claimsByType,
      monthlyPayments,
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}

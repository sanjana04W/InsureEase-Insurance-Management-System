import { NextResponse } from "next/server";
import { connectDB }    from "@/lib/mongodb";
import Customer  from "@/models/Customer";
import Policy    from "@/models/Policy";
import Claim     from "@/models/Claim";
import Payment   from "@/models/Payment";

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
      revenueData,
      pendingRevenueData,
      claimAmountData,
      claimsByStatus,
      claimsByType,
      paymentsByMethod,
      paymentsByType,
      policiesByCategory,
      customersByMonth,
      claimsByMonth,
      revenueByMonth,
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
      Payment.aggregate([
        { $match: { status: "paid" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Payment.aggregate([
        { $match: { status: "pending" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Claim.aggregate([
        { $group: { _id: null, total: { $sum: "$claimAmount" } } },
      ]),
      Claim.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Claim.aggregate([
        { $group: { _id: "$claimType", count: { $sum: 1 }, totalAmount: { $sum: "$claimAmount" } } },
        { $sort: { count: -1 } },
      ]),
      Payment.aggregate([
        { $group: { _id: "$paymentMethod", count: { $sum: 1 }, total: { $sum: "$amount" } } },
        { $sort: { total: -1 } },
      ]),
      Payment.aggregate([
        { $match: { status: "paid" } },
        { $group: { _id: "$policyType", total: { $sum: "$amount" }, count: { $sum: 1 } } },
        { $sort: { total: -1 } },
      ]),
      Policy.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 }, avgPremium: { $avg: "$premium" } } },
        { $sort: { count: -1 } },
      ]),
      Customer.aggregate([
        { $match: { createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 11)) } } },
        { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
      Claim.aggregate([
        { $match: { createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 11)) } } },
        { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, count: { $sum: 1 }, totalAmount: { $sum: "$claimAmount" } } },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
      Payment.aggregate([
        { $match: { status: "paid", createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 11)) } } },
        { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, total: { $sum: "$amount" }, count: { $sum: 1 } } },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
    ]);

    const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    const normalizeMonthly = (data, valueKey = "count") =>
      data.map((d) => ({
        month: MONTHS[d._id.month - 1],
        [valueKey]: d[valueKey] || 0,
        ...(d.totalAmount !== undefined ? { totalAmount: d.totalAmount } : {}),
      }));

    return NextResponse.json({
      success: true,
      summary: {
        totalCustomers,   activeCustomers,
        totalPolicies,    activePolicies,
        totalClaims,      pendingClaims, approvedClaims, rejectedClaims,
        totalPayments,    paidPayments,
        totalRevenue:     revenueData[0]?.total        || 0,
        pendingRevenue:   pendingRevenueData[0]?.total || 0,
        totalClaimAmount: claimAmountData[0]?.total    || 0,
        claimApprovalRate: totalClaims > 0
          ? Math.round((approvedClaims / totalClaims) * 100)
          : 0,
      },
      claimsByStatus,
      claimsByType,
      paymentsByMethod,
      paymentsByType,
      policiesByCategory,
      monthly: {
        customers: normalizeMonthly(customersByMonth, "count"),
        claims:    normalizeMonthly(claimsByMonth,    "count"),
        revenue:   normalizeMonthly(revenueByMonth,   "total"),
      },
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to generate report" },
      { status: 500 }
    );
  }
}

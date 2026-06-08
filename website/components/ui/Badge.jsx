const styles = {
  active:   "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-600",
  pending:  "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  paid:     "bg-blue-100 text-blue-700",
};

export default function Badge({ label, status }) {
  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {label || status}
    </span>
  );
}
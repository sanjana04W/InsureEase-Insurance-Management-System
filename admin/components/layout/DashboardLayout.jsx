import AdminSidebar from "./AdminSidebar";
import AdminHeader  from "./AdminHeader";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-primary-950 transition-colors duration-300">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Subtle background gradient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-primary-100/30 to-transparent blur-3xl" />
          <div className="absolute bottom-[20%] -left-[5%] w-[25%] h-[25%] rounded-full bg-gradient-to-tr from-accent/5 to-transparent blur-3xl" />
        </div>
        <AdminHeader />
        <main className="flex-1 p-8 overflow-y-auto relative z-[1]">
          {children}
        </main>
      </div>
    </div>
  );
}
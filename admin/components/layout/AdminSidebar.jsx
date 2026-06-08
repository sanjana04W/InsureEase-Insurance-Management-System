"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, Users, FileText, ClipboardList, CreditCard, BarChart3, MessageSquare, LogOut, ShieldCheck } from "lucide-react";

const navItems = [
  { href: "/dashboard",  label: "Dashboard",  icon: LayoutDashboard },
  { href: "/customers",  label: "Customers",  icon: Users },
  { href: "/policies",   label: "Policies",   icon: FileText },
  { href: "/claims",     label: "Claims",     icon: ClipboardList },
  { href: "/payments",   label: "Payments",   icon: CreditCard },
  { href: "/reports",    label: "Reports",    icon: BarChart3 },
  { href: "/messages",   label: "Messages",   icon: MessageSquare },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <aside className="w-72 min-h-screen bg-primary-950 flex flex-col border-r border-white/5 relative z-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-[20%] w-[150%] h-[50%] rounded-full bg-gradient-to-br from-accent/10 to-transparent blur-3xl opacity-30" />
      </div>

      {/* Logo */}
      <div className="p-6 border-b border-white/10 relative z-10">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-accent-light to-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20 group-hover:shadow-accent/40 transition-shadow">
            <ShieldCheck size={24} className="text-primary-950" />
          </div>
          <div>
            <p className="text-white font-display font-bold text-lg tracking-wide group-hover:text-accent-light transition-colors">InsureEase</p>
            <p className="text-gray-400 text-xs font-medium tracking-wider uppercase">Admin Portal</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto relative z-10 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all relative ${
                isActive
                  ? "text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white/10 rounded-xl border border-white/10"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent-light rounded-r-full shadow-[0_0_10px_rgba(251,191,36,0.5)]" />}
              <item.icon size={20} className={`relative z-10 ${isActive ? 'text-accent-light' : ''}`} />
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10 relative z-10 bg-primary-950/50 backdrop-blur-sm">
        <button
          onClick={handleLogout}
          disabled={loading}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20"
        >
          <LogOut size={20} />
          {loading ? "Logging out..." : "Secure Logout"}
        </button>
      </div>
    </aside>
  );
}
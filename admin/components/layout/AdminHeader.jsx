"use client";

import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Search, Settings, ChevronDown, User, LogOut, HelpCircle, Sun, Moon, X, CheckCircle, Info } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const titles = {
  "/dashboard": "Dashboard Overview",
  "/customers": "Customer Management",
  "/policies":  "Policy Management",
  "/claims":    "Claim Management",
  "/payments":  "Payment Management",
  "/reports":   "Reports & Analytics",
  "/messages":  "Contact Messages",
};

const subtitles = {
  "/dashboard": "Welcome back, Admin",
  "/customers": "Manage customer accounts",
  "/policies":  "Configure insurance policies",
  "/claims":    "Review and process claims",
  "/payments":  "Track all transactions",
  "/reports":   "Insights & analytics",
  "/messages":  "Customer inquiries",
};

export default function AdminHeader() {
  const pathname = usePathname();
  const base     = "/" + pathname.split("/")[1];
  const title    = titles[base] || "Admin Portal";
  const subtitle = subtitles[base] || "";
  const today    = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  const profileRef = useRef(null);
  const notificationsRef = useRef(null);
  const settingsRef = useRef(null);
  const { theme, toggleTheme } = useTheme();

  // Toast notification helper
  const showToast = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setSettingsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <>
    <header className="bg-white/70 dark:bg-primary-950/70 backdrop-blur-xl border-b border-gray-100/80 dark:border-gray-800/80 px-8 py-5 flex items-center justify-between sticky top-0 z-10 transition-colors duration-300">
      {/* Left: Title area */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white tracking-tight transition-colors">{title}</h1>
        <p className="text-sm font-medium text-gray-400 dark:text-gray-500 mt-0.5">
          {subtitle} · <span className="text-gray-300 dark:text-gray-600">{today}</span>
        </p>
      </motion.div>
      
      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden lg:flex items-center gap-2 bg-gray-50/80 dark:bg-primary-900/50 border border-gray-200/60 dark:border-gray-800 rounded-xl px-4 py-2.5 w-64 group hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
          <Search size={16} className="text-gray-400 group-hover:text-primary-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Quick search..." 
            className="bg-transparent text-sm text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none w-full"
          />
          <kbd className="hidden xl:flex items-center text-[10px] text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-primary-800 px-1.5 py-0.5 rounded font-mono transition-colors">⌘K</kbd>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-8 bg-gray-200" />

        {/* Notification bell */}
        <div className="relative" ref={notificationsRef}>
          <motion.button 
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative text-gray-400 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors p-2.5 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-800 border border-transparent hover:border-primary-100 dark:hover:border-primary-700"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-primary-950 animate-pulse" />
          </motion.button>

          <AnimatePresence>
            {notificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-72 bg-white dark:bg-primary-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 transition-colors"
              >
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-primary-950/50 flex justify-between items-center">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Notifications</p>
                  <span
                    onClick={() => {
                      showToast("All notifications marked as read", "success");
                      setNotificationsOpen(false);
                    }}
                    className="text-xs text-primary-600 dark:text-primary-400 cursor-pointer hover:underline"
                  >
                    Mark all read
                  </span>
                </div>
                <div className="p-4 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">No new notifications</p>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme toggle */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="text-gray-400 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors p-2.5 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-800 border border-transparent hover:border-primary-100 dark:hover:border-primary-700"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </motion.div>
          </AnimatePresence>
        </motion.button>

        {/* Settings */}
        <div className="relative" ref={settingsRef}>
          <motion.button 
            onClick={() => setSettingsOpen(!settingsOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-gray-400 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors p-2.5 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-800 border border-transparent hover:border-primary-100 dark:hover:border-primary-700"
          >
            <Settings size={20} />
          </motion.button>

          <AnimatePresence>
            {settingsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-primary-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 transition-colors"
              >
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-primary-950/50">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Quick Settings</p>
                </div>
                <div className="py-1.5">
                  <button
                    onClick={() => {
                      showToast("System Settings page coming soon!", "info");
                      setSettingsOpen(false);
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-primary-800 transition-colors"
                  >
                    <Settings size={14} className="text-gray-400" />
                    System Settings
                  </button>
                  <button
                    onClick={() => {
                      showToast("Account settings page coming soon!", "info");
                      setSettingsOpen(false);
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-primary-800 transition-colors"
                  >
                    <User size={14} className="text-gray-400" />
                    Account
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-8 bg-gray-200" />

        {/* Profile dropdown */}
        <div className="relative" ref={profileRef}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 p-2 -my-2 rounded-xl hover:bg-gray-50 dark:hover:bg-primary-800/50 transition-colors"
          >
            <div className="hidden md:block text-right">
              <p className="text-sm font-bold text-gray-900 dark:text-white transition-colors">System Admin</p>
              <p className="text-xs font-medium text-primary-600 dark:text-primary-400 transition-colors">admin@insureease.com</p>
            </div>
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-900 to-primary-700 text-white font-display font-bold text-sm flex items-center justify-center shadow-md shadow-primary-900">
                SA
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 hidden md:block ${profileOpen ? 'rotate-180' : ''}`} />
          </motion.button>

          {/* Dropdown menu */}
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-56 bg-white dark:bg-primary-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 transition-colors"
              >
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-primary-950/50">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">System Admin</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">admin@insureease.com</p>
                </div>
                <div className="py-1.5">
                  <button
                    onClick={() => {
                      showToast("Profile Settings page coming soon!", "info");
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-primary-800 transition-colors"
                  >
                    <User size={16} className="text-gray-400 dark:text-gray-500" />
                    Profile Settings
                  </button>
                  <button
                    onClick={() => {
                      showToast("Help & Support page coming soon!", "info");
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-primary-800 transition-colors"
                  >
                    <HelpCircle size={16} className="text-gray-400 dark:text-gray-500" />
                    Help & Support
                  </button>
                </div>
                <div className="border-t border-gray-100 dark:border-gray-800 py-1.5">
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>

    {/* Toast notifications */}
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 80, scale: 0.85 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.85 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-xl min-w-[280px] max-w-[380px]"
            style={{
              background: toast.type === "success"
                ? "linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(6,95,70,0.08) 100%)"
                : "linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(30,64,175,0.08) 100%)",
              borderColor: toast.type === "success"
                ? "rgba(16,185,129,0.25)"
                : "rgba(59,130,246,0.25)",
              boxShadow: toast.type === "success"
                ? "0 8px 32px rgba(16,185,129,0.15), 0 2px 8px rgba(0,0,0,0.08)"
                : "0 8px 32px rgba(59,130,246,0.15), 0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
              toast.type === "success"
                ? "bg-emerald-500/20 text-emerald-500"
                : "bg-blue-500/20 text-blue-500"
            }`}>
              {toast.type === "success" ? <CheckCircle size={18} /> : <Info size={18} />}
            </div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100 flex-1">
              {toast.message}
            </p>
            <button
              onClick={() => dismissToast(toast.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-lg p-1 hover:bg-black/5 dark:hover:bg-white/10"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
    </>
  );
}
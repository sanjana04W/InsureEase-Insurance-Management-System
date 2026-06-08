"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShieldCheck, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const navLinks = [
  { href: "/",          label: "Home" },
  { href: "/about",     label: "About" },
  { href: "/policies",  label: "Policies" },
  { href: "/claims/submit", label: "File a Claim" },
  { href: "/claims/status", label: "Claim Status" },
  { href: "/contact",   label: "Contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/95 dark:bg-primary-950/95 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800 py-3" 
          : "bg-white dark:bg-primary-950 border-b border-gray-100 dark:border-gray-800 py-5"
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-slate-800 dark:bg-primary-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-900/20 group-hover:shadow-slate-900/40 transition-all duration-300">
              <ShieldCheck size={20} strokeWidth={2.5} />
            </div>
            <span className={`font-display font-bold text-2xl tracking-tight transition-colors duration-300 ${scrolled ? 'text-primary-900 dark:text-white' : 'text-primary-900 dark:text-white drop-shadow-sm'}`}>
              InsureEase
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-sm group transition-colors"
                >
                  <span className={`relative z-10 px-3 py-1.5 transition-colors duration-300 rounded-lg border ${
                    isActive ? "text-yellow-500 dark:text-yellow-400 font-bold border-yellow-500/50 dark:border-yellow-400/50 bg-yellow-50/50 dark:bg-yellow-900/20" : "text-gray-600 dark:text-gray-300 font-semibold border-transparent"
                  }`}>
                    {link.label}
                  </span>
                </Link>
              );
            })}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="ml-2 p-2.5 rounded-full bg-gray-100 dark:bg-primary-800 hover:bg-gray-200 dark:hover:bg-primary-700 text-gray-600 dark:text-gray-300 transition-all duration-300 hover:scale-105 active:scale-95"
              aria-label="Toggle theme"
            >
              <motion.div
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </motion.div>
            </button>
          </nav>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-primary-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {/* Mobile menu toggle */}
            <button
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-primary-800 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden bg-white/95 dark:bg-primary-900/95 backdrop-blur-md rounded-2xl mt-4 border border-gray-100 dark:border-gray-700 shadow-xl"
            >
              <div className="py-4 px-4 flex flex-col gap-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`block px-4 py-3 text-sm rounded-xl transition-colors border ${
                        isActive
                          ? "bg-gray-50 dark:bg-primary-800 text-yellow-500 dark:text-yellow-400 font-bold border-yellow-500/50 dark:border-yellow-400/50"
                          : "text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-primary-800 border-transparent"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
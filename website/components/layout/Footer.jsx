import Link from "next/link";
import { ShieldCheck, Mail, Phone, Clock, ChevronRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary-950 text-white mt-auto relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-700/20 rounded-full blur-3xl" />
      
      <div className="container-custom py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

          {/* Brand */}
          <div className="col-span-1 md:col-span-4 lg:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center">
                <ShieldCheck size={24} className="text-accent-light" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight">InsureEase</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-8">
              A premium insurance management platform helping you protect
              what matters most with transparent policies, fast claims, and dedicated support.
            </p>
          </div>

          {/* Quick links */}
          <div className="col-span-1 md:col-span-4 lg:col-span-3">
            <h4 className="font-sans font-semibold text-sm uppercase tracking-widest text-gray-300 mb-6">
              Quick Links
            </h4>
            <ul className="space-y-4 text-sm text-gray-400">
              {[
                { href: "/policies", label: "View Policies" },
                { href: "/claims/submit", label: "File a Claim" },
                { href: "/claims/status", label: "Claim Status" },
                { href: "/contact", label: "Contact Us" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="group flex items-center gap-2 hover:text-white transition-colors">
                    <ChevronRight size={14} className="text-primary-600 group-hover:text-accent-light transition-colors" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div className="col-span-1 md:col-span-4 lg:col-span-4">
            <h4 className="font-sans font-semibold text-sm uppercase tracking-widest text-gray-300 mb-6">
              Contact
            </h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-primary-500" />
                <a href="mailto:info@insureease.com" className="hover:text-white transition-colors">info@insureease.com</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-primary-500" />
                <a href="tel:+18001234567" className="hover:text-white transition-colors">+1 (800) 123-4567</a>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={16} className="text-primary-500" />
                <span>Mon–Fri, 9am – 6pm EST</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-16 pt-8 text-xs text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} InsureEase. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
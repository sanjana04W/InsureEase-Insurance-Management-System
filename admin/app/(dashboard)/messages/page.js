"use client";

import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatsCard       from "@/components/ui/StatsCard";
import ConfirmModal    from "@/components/ui/ConfirmModal";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MailOpen, Inbox, Trash2, CheckCheck, Search, Clock, Reply } from "lucide-react";

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60)    return "just now";
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function EmptyState({ filter }) {
  const map = {
    all:    { icon: Inbox, text: "No messages yet" },
    unread: { icon: Inbox, text: "No unread messages" },
    read:   { icon: Inbox, text: "No read messages" },
  };
  const { icon: Icon, text } = map[filter] || map.all;
  return (
    <div className="flex flex-col items-center justify-center h-full py-20 text-gray-300">
      <Icon size={48} className="mb-4 opacity-50" />
      <p className="text-sm font-medium text-gray-400">{text}</p>
    </div>
  );
}

export default function MessagesPage() {
  const [messages,   setMessages]   = useState([]);
  const [meta,       setMeta]       = useState({ total: 0, unread: 0, read: 0 });
  const [selected,   setSelected]   = useState(null);
  const [search,     setSearch]     = useState("");
  const [filter,     setFilter]     = useState("all");
  const [loading,    setLoading]    = useState(true);
  const [deleteId,   setDeleteId]   = useState(null);
  const [markingAll, setMarkingAll] = useState(false);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search)           params.set("search", search);
    if (filter !== "all") params.set("filter", filter);
    const res  = await fetch(`/api/messages?${params}`);
    const data = await res.json();
    setMessages(data.messages || []);
    setMeta(data.meta || {});
    setLoading(false);
  }, [search, filter]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const openMessage = async (msg) => {
    if (!msg.isRead) {
      await fetch(`/api/messages/${msg._id}`);
      setMessages((prev) =>
        prev.map((m) => m._id === msg._id ? { ...m, isRead: true } : m)
      );
      setMeta((prev) => ({ ...prev, unread: Math.max(0, prev.unread - 1), read: prev.read + 1 }));
    }
    setSelected({ ...msg, isRead: true });
  };

  const toggleRead = async (msg, e) => {
    e.stopPropagation();
    const newRead = !msg.isRead;
    await fetch(`/api/messages/${msg._id}`, {
      method:  "PUT",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ isRead: newRead }),
    });
    setMessages((prev) =>
      prev.map((m) => m._id === msg._id ? { ...m, isRead: newRead } : m)
    );
    setMeta((prev) => ({
      ...prev,
      unread: newRead ? prev.unread - 1 : prev.unread + 1,
      read:   newRead ? prev.read   + 1 : prev.read   - 1,
    }));
    if (selected?._id === msg._id) setSelected((s) => ({ ...s, isRead: newRead }));
  };

  const deleteMessage = async (id) => {
    await fetch(`/api/messages/${id}`, { method: "DELETE" });
    setMessages((prev) => prev.filter((m) => m._id !== id));
    if (selected?._id === id) setSelected(null);
    setDeleteId(null);
  };

  const markAllRead = async () => {
    setMarkingAll(true);
    await fetch("/api/messages/mark-all-read", { method: "PUT" });
    setMessages((prev) => prev.map((m) => ({ ...m, isRead: true })));
    setMeta((prev) => ({ ...prev, unread: 0, read: prev.total }));
    if (selected) setSelected((s) => ({ ...s, isRead: true }));
    setMarkingAll(false);
  };

  return (
    <DashboardLayout>
      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
      >
        <StatsCard title="Total Messages" value={meta.total || 0} icon={Mail} color="blue" />
        <StatsCard title="Unread" value={meta.unread || 0} icon={Inbox} color="yellow" />
        <StatsCard title="Read" value={meta.read || 0} icon={MailOpen} color="green" />
      </motion.div>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between mb-5"
      >
        <div>
          <h2 className="section-title">Contact Messages</h2>
        </div>
        {meta.unread > 0 && (
          <button
            onClick={markAllRead}
            disabled={markingAll}
            className="btn-secondary text-xs"
          >
            <CheckCheck size={16} />
            {markingAll ? "Marking..." : "Mark all as read"}
          </button>
        )}
      </motion.div>

      {/* Main panel */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex bg-white dark:bg-slate-800 rounded-2xl border border-gray-100/80 dark:border-slate-700/80 shadow-sm overflow-hidden"
        style={{ minHeight: "600px" }}
      >
        {/* Left: message list */}
        <div className="w-full lg:w-96 flex-shrink-0 border-r border-gray-100 flex flex-col">

          {/* Search + filter */}
          <div className="p-4 border-b border-gray-100 space-y-3 bg-gray-50/30">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search messages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10 text-sm"
              />
            </div>
            <div className="tab-bar w-full">
              {["all", "unread", "read"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    filter === f ? "tab-active" : "tab-inactive"
                  }`}
                >
                  {f}
                  {f === "unread" && meta.unread > 0 && (
                    <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${
                      filter === f ? "bg-white/20 text-white" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {meta.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Message list */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {loading ? (
              <div className="p-4 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-50 rounded w-full" />
                  </div>
                ))}
              </div>
            ) : messages.length === 0 ? (
              <EmptyState filter={filter} />
            ) : (
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    onClick={() => openMessage(msg)}
                    className={`p-4 cursor-pointer transition-all relative ${
                      selected?._id === msg._id ? "bg-primary-50/50 dark:bg-slate-700 border-l-4 border-primary-500" : "hover:bg-gray-50 dark:hover:bg-slate-700/50"
                    } ${!msg.isRead ? "bg-primary-50/20 dark:bg-primary-900/20" : ""}`}
                  >
                    {!msg.isRead && (
                      <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                    )}

                    <div className="flex items-start gap-3 pr-4">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-sm ${
                        !msg.isRead ? "bg-gradient-to-br from-primary-600 to-primary-800 text-white" : "bg-gray-100 text-gray-500"
                      }`}>
                        {msg.name?.charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className={`text-sm truncate ${
                            !msg.isRead ? "font-bold text-gray-900 dark:text-white" : "font-semibold text-gray-700 dark:text-gray-300"
                          }`}>
                            {msg.name}
                          </p>
                          <p className="text-xs text-gray-400 flex-shrink-0 ml-2 font-medium">
                            {timeAgo(msg.createdAt)}
                          </p>
                        </div>
                        <p className={`text-xs truncate mb-1.5 ${
                          !msg.isRead ? "text-gray-800 dark:text-gray-200 font-semibold" : "text-gray-500 dark:text-gray-400 font-medium"
                        }`}>
                          {msg.subject}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{msg.message}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Right: message detail */}
        <div className="hidden lg:flex flex-1 flex-col bg-gray-50/30">
          <AnimatePresence mode="wait">
            {!selected ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full text-gray-300"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Mail size={40} className="text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-400">Select a message to read</p>
                <p className="text-xs text-gray-400 mt-1">
                  {meta.unread > 0
                    ? `You have ${meta.unread} unread message${meta.unread > 1 ? "s" : ""}`
                    : "All caught up!"}
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="detail"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col h-full"
              >
                {/* Message header */}
                <div className="px-8 py-6 border-b border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2">
                        {selected.subject}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold text-gray-800 dark:text-gray-200">{selected.name}</span>
                        <span className="text-gray-300">·</span>
                        <a href={`mailto:${selected.email}`} className="hover:text-primary-600 transition-colors">{selected.email}</a>
                        {selected.phone && (
                          <>
                            <span className="text-gray-300">·</span>
                            <span>{selected.phone}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={(e) => toggleRead(selected, e)}
                        className="btn-secondary text-xs px-3 py-1.5"
                      >
                        {selected.isRead ? "Mark unread" : "Mark read"}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteId(selected._id); }}
                        className="btn-danger text-xs px-3 py-1.5 flex items-center gap-1"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="px-8 py-3 bg-gray-50/80 border-b border-gray-100 flex items-center gap-2">
                  <Clock size={14} className="text-gray-400" />
                  <p className="text-xs text-gray-500 font-medium">
                    Received:{" "}
                    {new Date(selected.createdAt).toLocaleString("en-US", {
                      weekday: "long",
                      year:    "numeric",
                      month:   "long",
                      day:     "numeric",
                      hour:    "2-digit",
                      minute:  "2-digit",
                    })}
                  </p>
                </div>

                {/* Message body */}
                <div className="flex-1 px-8 py-8 overflow-y-auto bg-white dark:bg-slate-800">
                  <div className="max-w-2xl">
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                      {selected.message}
                    </p>
                  </div>
                </div>

                {/* Reply footer */}
                <div className="px-8 py-5 border-t border-gray-100 dark:border-slate-700 bg-gray-50/80 dark:bg-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-gray-500 dark:text-gray-400 shadow-sm">
                      Reply to: <span className="font-medium text-gray-700 dark:text-gray-200">{selected.email}</span>
                    </div>
                    <a
                      href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                      className="btn-primary text-sm"
                    >
                      <Reply size={16} /> Reply via Email
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <ConfirmModal 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={() => deleteId && deleteMessage(deleteId)} 
        title="Delete Message" 
        message="Are you sure you want to delete this message? This action cannot be undone." 
      />
    </DashboardLayout>
  );
}
"use client";

import { motion } from "framer-motion";
import { Inbox } from "lucide-react";

export default function Table({ headers, children, empty = "No records found." }) {
  const hasChildren = children && (Array.isArray(children) ? children.length > 0 : true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="overflow-hidden rounded-2xl border border-gray-100/80 dark:border-slate-700/80 shadow-sm bg-white dark:bg-slate-800"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              {headers.map((h) => (
                <th key={h} className="table-th first:rounded-tl-2xl last:rounded-tr-2xl">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {hasChildren ? children : (
              <tr>
                <td colSpan={headers.length} className="text-center py-16">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center">
                      <Inbox size={24} className="text-gray-300" />
                    </div>
                    <p className="text-sm text-gray-400 font-medium">{empty}</p>
                  </motion.div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
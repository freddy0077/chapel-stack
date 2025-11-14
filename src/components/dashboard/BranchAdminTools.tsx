import React from "react";
import Link from "next/link";

const tools = [
  { label: "Add Branch Event", href: "/dashboard/calendar" },
  // { label: "Approve Reports" },
  { label: "View Branch Logs", href: "/dashboard/audits" },
];

export function BranchAdminTools({ branchName }: { branchName: string }) {
  return (
    <section className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-blue-100">
      <h2 className="font-semibold text-xl mb-6 text-blue-800">
        Branch Admin Tools
      </h2>
      <div className="flex gap-8 flex-wrap">
        {tools.map((tool) => {
          const content = (
            <div className="flex flex-col items-center gap-3 px-6 py-5 bg-gradient-to-br from-blue-50 to-yellow-50 rounded-xl hover:bg-blue-100 transition border border-blue-100 min-w-[140px] shadow group">
              <span className="text-2xl text-blue-700">🛠️</span>
              <span className="text-base font-semibold text-blue-900">
                {tool.label}
              </span>
            </div>
          );

          return tool.href ? (
            <Link key={tool.label} href={tool.href} className="inline-block">
              {content}
            </Link>
          ) : (
            <button key={tool.label} className="inline-block">{content}</button>
          );
        })}
      </div>
    </section>
  );
}

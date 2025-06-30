import React from "react";

const navItems = [
  { name: "Dashboard", icon: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/></svg>
  )},
  { name: "Reports", icon: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M4 4h16v16H4z"/><path d="M9 9h6v6H9z"/></svg>
  )},
  { name: "Ministries", icon: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a6.5 6.5 0 0 1 13 0"/></svg>
  )},
  { name: "Attendance", icon: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/></svg>
  )},
];

export const Sidebar = () => (
  <aside className="w-24 bg-gradient-to-b from-primary to-purple-400/80 flex flex-col items-center py-8 space-y-10 shadow-xl rounded-tr-3xl rounded-br-3xl">
    {navItems.map((item, idx) => (
      <button
        key={item.name}
        className={`flex flex-col items-center text-white/90 hover:text-yellow-300 transition-colors focus:outline-none ${idx === 0 ? "bg-white/20 shadow-lg scale-110" : ""} px-3 py-2 rounded-xl`}
        title={item.name}
      >
        {item.icon}
        <span className="text-xs mt-1 font-semibold tracking-wide">{item.name}</span>
      </button>
    ))}
  </aside>
);

export default Sidebar;

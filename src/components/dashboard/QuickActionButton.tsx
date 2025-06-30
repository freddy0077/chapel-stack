import React, { useState } from "react";

const actions = [
  { label: "Create Branch", icon: "🏛️" },
  { label: "Add Member", icon: "👤" },
  { label: "New Event", icon: "🎉" },
  { label: "Export Report", icon: "📤" },
];

export const QuickActionButton = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-8 right-8 z-40">
      <button
        className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-purple-400 text-white text-3xl shadow-lg flex items-center justify-center hover:scale-110 transition-transform focus:outline-none"
        onClick={() => setOpen((o) => !o)}
        aria-label="Quick actions"
      >
        +
      </button>
      {open && (
        <div className="absolute bottom-20 right-0 w-56 bg-white dark:bg-black/90 rounded-xl shadow-xl p-3 flex flex-col gap-2">
          {actions.map((a) => (
            <button
              key={a.label}
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-primary/10 dark:hover:bg-primary/20 text-gray-700 dark:text-gray-200 text-base focus:outline-none"
              aria-label={a.label}
            >
              <span>{a.icon}</span> {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuickActionButton;

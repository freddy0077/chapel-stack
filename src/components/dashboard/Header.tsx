import React from "react";
import ThemeToggle from "./ThemeToggle";
import NotificationDropdown from "./NotificationDropdown";

export const Header = () => (
  <header className="h-16 bg-white/70 backdrop-blur-lg border-b border-gray-200 flex items-center px-6 justify-between shadow-md">
    <div className="flex items-center space-x-3">
      <span className="font-bold text-2xl text-primary drop-shadow-sm tracking-tight">ChapelStack</span>
      <span className="text-gray-400 text-sm hidden sm:inline font-medium">Dashboard</span>
    </div>
    <div className="flex items-center space-x-4">
      <ThemeToggle />
      <NotificationDropdown />
      {/* User Avatar with dropdown */}
      <div className="relative group">
        <div className="w-9 h-9 bg-gradient-to-tr from-primary to-purple-400 rounded-full flex items-center justify-center text-white font-bold shadow-md cursor-pointer">
          FA
        </div>
        <div className="absolute right-0 mt-2 w-40 bg-white/90 backdrop-blur-lg rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto z-10">
          <div className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">Profile</div>
          <div className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">Logout</div>
        </div>
      </div>
    </div>
  </header>
);

export default Header;

"use client";

import {
  Search,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Home,
  Menu
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/context/AuthProvider";
import { useSidebar } from "@/lib/context/SidebarProvider";

export function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const { toggleSidebar } = useSidebar();
  const handleLogout = () => {
    logout();
    router.push("/login"); // điều hướng bằng Next router
  };

  const userName = user?.name || "User";
  const userEmail = user?.email || "user@example.com";

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 fixed top-0 left-0 right-0 md:left-64 shadow-sm z-40">
      {/* Left section: Hamburger and Search */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Hamburger Menu */}
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex-shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar */}
        <div className="hidden sm:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties, clients..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary focus:bg-white transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
        {/* Search Icon (Mobile) */}
        <button className="sm:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
          <Search className="w-5 h-5" />
        </button>

        {/* Notification Bell */}
        <button className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex-shrink-0">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 px-2 md:px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-semibold">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm font-medium hidden lg:inline">
              {userName}
            </span>
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform hidden md:block",
                isProfileOpen && "transform rotate-180",
              )}
            />
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="p-3 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-900">
                  {userName}
                </p>
                <p className="text-xs text-gray-600">{userEmail}</p>
              </div>
              <nav className="py-2">
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <User className="w-4 h-4" />
                  My Profile
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-200"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
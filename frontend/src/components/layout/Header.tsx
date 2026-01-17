"use client";

import {
  Search,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Menu,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/context/AuthProvider";
import { useSidebar } from "@/lib/context/SidebarProvider";

interface NotificationItem {
  id: number;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  targetUrl: string;
}

export function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { toggleSidebar } = useSidebar();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifyRef = useRef<HTMLDivElement>(null);

  const userName = user?.name || "User";
  const userEmail = user?.email || "user@example.com";

  /* ===== MOCK NOTIFICATIONS ===== */
  const notifications: NotificationItem[] = [
    {
      id: 1,
      title: "New transaction created",
      desc: "Transaction TXN-2024-001 has been created",
      time: "5 minutes ago",
      unread: true,
      targetUrl: "/transactions/TXN-2024-001",
    },
    {
      id: 2,
      title: "New staff added",
      desc: "Alice Chen joined your office",
      time: "1 hour ago",
      unread: false,
      targetUrl: "/staff/S002",
    },
    {
      id: 3,
      title: "Password changed",
      desc: "Your password was updated successfully",
      time: "Yesterday",
      unread: false,
      targetUrl: "/settings?tab=security",
    },
  ];

  /* ===== CLICK OUTSIDE ===== */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false);
      }
      if (notifyRef.current && !notifyRef.current.contains(e.target as Node)) {
        setIsNotifyOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleGoProfile = () => {
    setIsProfileOpen(false);
    router.push("/settings/account?mode=profile");
  };

  const handleGoSettings = () => {
    setIsProfileOpen(false);
    router.push("/settings");
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 fixed top-0 left-0 right-0 md:left-64 shadow-sm z-40">
      {/* ===== LEFT ===== */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties, clients..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* ===== RIGHT ===== */}
      <div className="flex items-center gap-3">
        {/* ===== NOTIFICATIONS ===== */}
        <div ref={notifyRef} className="relative">
          <button
            onClick={() => {
              setIsNotifyOpen(!isNotifyOpen);
              setIsProfileOpen(false);
            }}
            className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            <Bell className="w-5 h-5" />
            {notifications.some((n) => n.unread) && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          {isNotifyOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="px-4 py-3 border-b">
                <p className="text-sm font-semibold">Notifications</p>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      setIsNotifyOpen(false);
                      router.push(n.targetUrl);
                    }}
                    className={cn(
                      "px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer",
                      n.unread && "bg-blue-50",
                    )}
                  >
                    <p className="font-medium">{n.title}</p>
                    <p className="text-xs text-gray-600">{n.desc}</p>
                    <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setIsNotifyOpen(false);
                  router.push("/notifications");
                }}
                className="w-full px-4 py-2 text-sm text-primary hover:bg-gray-50 border-t"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>

        {/* ===== PROFILE ===== */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotifyOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg"
          >
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="hidden lg:inline text-sm font-medium">
              {userName}
            </span>
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform",
                isProfileOpen && "rotate-180",
              )}
            />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
              <div className="px-4 py-3 border-b">
                <p className="text-sm font-semibold">{userName}</p>
                <p className="text-xs text-gray-500">{userEmail}</p>
              </div>

              <button
                onClick={handleGoProfile}
                className="w-full px-4 py-2 flex items-center gap-2 text-sm hover:bg-gray-50"
              >
                <User className="w-4 h-4" />
                My Profile
              </button>

              <button
                onClick={handleGoSettings}
                className="w-full px-4 py-2 flex items-center gap-2 text-sm hover:bg-gray-50"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>

              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 flex items-center gap-2 text-sm hover:bg-gray-50 border-t"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

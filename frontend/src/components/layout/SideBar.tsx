"use client";

import Link from "next/link";
import { usePathname, useServerInsertedHTML } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  Users,
  UserCheck,
  ScrollText,
  Calendar,
  BarChart3,
  Settings,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/lib/context/SidebarProvider";

const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Properties", path: "/properties", icon: Home },
  { name: "Clients", path: "/clients", icon: Users },
  { name: "Agents", path: "/agents", icon: UserCheck },
  { name: "Transactions", path: "/transactions", icon: ScrollText },
  { name: "Calendar", path: "/calendar", icon: Calendar },
  { name: "Reports", path: "/reports", icon: BarChart3 },
  { name: "Settings", path: "/settings", icon: Settings },
];

export function Sidebar() {
  
  const pathname = usePathname();
  const {isOpen, closeSidebar} = useSidebar();
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={cn(
          "w-64 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 shadow-sm transition-transform duration-300 ease-in-out z-40 md:translate-x-0",
          !isOpen && "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-start px-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900">RealEstate</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={closeSidebar}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group relative",
                  isActive
                    ? "bg-primary text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-50",
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-sm flex-1">{item.name}</span>
                {isActive && (
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-xs text-gray-600 mb-2">Version 1.0</p>
            <p className="text-xs font-medium text-gray-900">
              Professional Edition
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
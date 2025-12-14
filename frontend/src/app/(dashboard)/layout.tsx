import { Sidebar } from "@/components/layout/SideBar";
import { Header } from "@/components/layout/Header";
import { SidebarProvider } from "@/lib/context/SidebarProvider";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <SidebarProvider>
        <Sidebar />
        <Header />
        <main className="mt-16 md:ml-64 p-4 md:p-8">{children}</main></SidebarProvider>
        
    </div>
  );
}

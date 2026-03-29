"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/src/store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/src/components/Header";
import Sidebar from "@/src/components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const adminToken = localStorage.getItem("adminToken");
    const isLoginPage = pathname === "/admin/login";

    const isUserAuthenticated = isAuthenticated || !!adminToken;

    if (isUserAuthenticated && isLoginPage) {
      router.replace("/admin/dashboard");
    } else if (!isUserAuthenticated && !isLoginPage) {
      router.replace("/admin/login");
    }
  }, [isAuthenticated, pathname, router, mounted]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (!mounted) {
    return null;
  }

  const isLoginPage = pathname === "/admin/login";

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-white selection:text-black">
      {!isLoginPage ? (
        <div className="flex relative">
          {/* Mobile overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          {/* Main content area */}
          <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
            {/* Header */}
            <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

            <main className="flex-1 p-4 md:p-6 lg:p-8 animate-fade-in">
              {children}
            </main>
          </div>
        </div>
      ) : (
        <main>{children}</main>
      )}
    </div>
  );
}
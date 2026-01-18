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

  if (!mounted) {
    return null;
  }

  const isLoginPage = pathname === "/admin/login";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 selection:bg-black selection:text-white">
      {!isLoginPage ? (
        <div className="flex">
          <Sidebar />

          <div className="flex-1 ml-64">
            {/* Header */}
            <Header />

            <main className="p-6">
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
"use client";

import Link from "next/link";
import { useDispatch } from "react-redux";
import { logout } from "../store/auth/slice";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  Tag,
  ShoppingCart,
  LogOut,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/src/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Category", href: "/admin/categorys", icon: Layers },
    { label: "Brand", href: "/admin/brands", icon: Tag },
    { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "w-64 h-screen bg-[#0F0F0F] text-white fixed left-0 top-0 flex flex-col border-r border-[#222222] z-50 transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo area */}
        <div className="flex items-center justify-between px-6 pt-8 pb-6">
          <div className="flex items-center gap-3 cursor-pointer">
            <img
              src="/logo.png"
              alt="Zendo"
              className="h-7 w-auto object-contain"
            />
          </div>
          {/* Close button (mobile only) */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-[#555555] hover:text-white hover:bg-[#1A1A1A] rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Divider */}
        <div className="mx-6 h-px bg-[#222222] mb-4" />

        {/* Navigation */}
        <nav className="flex flex-col gap-1 flex-1 px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between group px-4 py-3 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-white text-black font-semibold"
                    : "text-[#888888] hover:bg-[#1A1A1A] hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn("w-[1.125rem] h-[1.125rem]", isActive ? "text-black" : "text-[#555555] group-hover:text-white")} />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-4 pb-6 pt-4 border-t border-[#222222] mx-2">
          <button
            onClick={() => {
              localStorage.removeItem("adminToken");
              dispatch(logout());
              router.push("/admin/login");
            }}
            className="flex items-center gap-3 px-4 py-3 text-[#555555] hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 w-full text-left"
          >
            <LogOut className="w-[1.125rem] h-[1.125rem]" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0F0F0F] border-t border-[#222222] z-50 lg:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all min-w-[3.5rem]",
                  isActive
                    ? "text-white"
                    : "text-[#555555]"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive && "text-white")} />
                <span className={cn(
                  "text-[0.625rem] font-medium tracking-wide",
                  isActive && "font-semibold"
                )}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="w-1 h-1 bg-white rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

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
  ChevronRight
} from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function Sidebar() {
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
    <div className="w-64 h-screen bg-black text-white p-6 fixed left-0 top-0 flex flex-col border-r border-gray-800">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
          <span className="text-black font-black text-xl">Z</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight">Zendo Admin</h2>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between group px-4 py-3 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-white text-black font-semibold shadow-lg shadow-white/10"
                  : "text-gray-400 hover:bg-gray-900 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-5 h-5", isActive ? "text-black" : "text-gray-400 group-hover:text-white")} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-gray-800">
        <button
          onClick={() => {
            localStorage.removeItem("adminToken");
            dispatch(logout());
            router.push("/admin/login");
          }}
          className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 w-full text-left"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}


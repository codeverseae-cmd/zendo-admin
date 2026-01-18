"use client";

import { Bell, Search, User, ChevronDown } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [selectedPeriod, setSelectedPeriod] = useState("Today");
  const pathname = usePathname();

  // Map pathname to title
  const getTitle = () => {
    if (pathname.includes("/dashboard")) return "Dashboard";
    if (pathname.includes("/products")) return "Products";
    if (pathname.includes("/categorys")) return "Categories";
    if (pathname.includes("/brands")) return "Brands";
    if (pathname.includes("/orders")) return "Orders";
    return "Admin";
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Left: Title */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {getTitle()}
            </h1>
            <p className="text-xs text-gray-500 font-medium">Welcome back, Admin</p>
          </div>

          <div className="flex items-center gap-6">
            {/* Search */}
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search anything..."
                className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all w-72"
              />
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2.5 text-gray-500 hover:text-black hover:bg-gray-50 rounded-xl transition-all">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full" />
              </button>

              <div className="h-8 w-px bg-gray-100 mx-2" />

              {/* Profile */}
              <button className="flex items-center gap-3 hover:bg-gray-50 p-1.5 rounded-xl transition-all group">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-black/10">
                  <User className="w-5 h-5" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-black">
                    Admin User
                  </p>
                  <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                    Super Admin
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
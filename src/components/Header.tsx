"use client";

import { Bell, Search, User, ChevronDown, Menu } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
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
    <header className="glass border-b border-[#222222] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Left: Hamburger + Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 text-[#888888] hover:text-white hover:bg-[#1A1A1A] rounded-xl transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-white tracking-tight">
                {getTitle()}
              </h1>
              <p className="text-[0.6875rem] text-[#555555] font-medium hidden md:block">Welcome back, Admin</p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            {/* Search */}
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555555]" />
              <input
                type="text"
                placeholder="Search anything..."
                className="pl-10 pr-4 py-2.5 bg-[#0F0F0F] border border-[#222222] rounded-xl text-sm text-white placeholder:text-[#555555] focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-[#444444] transition-all w-64 xl:w-72"
              />
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              {/* Search icon (mobile) */}
              <button className="lg:hidden p-2.5 text-[#555555] hover:text-white hover:bg-[#1A1A1A] rounded-xl transition-all">
                <Search className="w-5 h-5" />
              </button>

              {/* Notifications */}
              <button className="relative p-2.5 text-[#555555] hover:text-white hover:bg-[#1A1A1A] rounded-xl transition-all">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full" />
              </button>

              <div className="h-8 w-px bg-[#222222] mx-1 hidden md:block" />

              {/* Profile */}
              <button className="flex items-center gap-3 hover:bg-[#1A1A1A] p-1.5 rounded-xl transition-all group">
                <div className="w-9 h-9 md:w-10 md:h-10 bg-white rounded-xl flex items-center justify-center text-black font-bold">
                  <User className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-white group-hover:text-white">
                    Admin User
                  </p>
                  <p className="text-[0.625rem] font-medium text-[#555555] uppercase tracking-wider">
                    Super Admin
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-[#555555] group-hover:text-white transition-colors hidden md:block" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
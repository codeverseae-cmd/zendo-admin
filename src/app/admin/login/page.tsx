"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/src/store/auth/thunk";

export default function AdminLoginPage() {
  const dispatch = useDispatch<any>();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await dispatch(adminLogin(form));
    if (res.payload?.token) {
      localStorage.setItem("adminToken", res.payload?.token);
      router.push("/admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#000000] relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(#FFFFFF 1px, transparent 1px), linear-gradient(90deg, #FFFFFF 1px, transparent 1px)`,
        backgroundSize: '4rem 4rem'
      }} />

      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-lg h-128 bg-white/2 rounded-full blur-3xl" />

      <form
        onSubmit={handleSubmit}
        className="relative bg-[#0F0F0F] p-8 md:p-10 rounded-2xl text-white border border-[#222222] w-full max-w-[24rem] mx-4 space-y-6 animate-fade-in-scale"
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-4 mb-2">
          <img
            src="/logo.png"
            alt="Zendo"
            className="h-10 w-auto object-contain"
          />
          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Admin Login</h1>
            <p className="text-sm text-[#555555] mt-1 font-medium">Sign in to your dashboard</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[#888888] block mb-1.5">Email</label>
            <input
              className="w-full border border-[#222222] rounded-xl p-3 bg-[#0A0A0A] text-white placeholder:text-[#555555] focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-[#444444] transition-all text-sm"
              type="email"
              placeholder="Email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[#888888] block mb-1.5">Password</label>
            <input
              className="w-full border border-[#222222] rounded-xl p-3 bg-[#0A0A0A] text-white placeholder:text-[#555555] focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-[#444444] transition-all text-sm"
              type="password"
              placeholder="Password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
        </div>

        <button
          className="w-full bg-white text-black p-3 rounded-xl font-semibold hover:bg-neutral-200 transition-all active:scale-[0.98] text-sm"
          type="submit"
        >
          Sign In
        </button>

        <p className="text-center text-[0.6875rem] text-[#333333] font-medium">
          Zendo Admin Panel — Secure Access
        </p>
      </form>
    </div>
  );
}

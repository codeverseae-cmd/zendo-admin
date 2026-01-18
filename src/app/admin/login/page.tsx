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
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-md text-gray-900 shadow-lg w-96 space-y-4"
      >
        <h1 className="text-2xl font-bold">Admin Login</h1>

        <input
          className="border p-2 w-full"
          type="email"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          className="border p-2 w-full"
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 transition"
          type="submit"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}

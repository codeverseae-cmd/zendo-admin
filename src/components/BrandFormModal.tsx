"use client";

import { useState } from "react";
import { createBrand, updateBrand } from "@/src/store/brand/thunk";
import { useAppDispatch } from "../hooks/useDispatch";
import { stripMetadata } from "../utils/stripMetadata";
import { X } from "lucide-react";


export default function BrandFormModal({ close, editData }: any) {
  const dispatch = useAppDispatch();

  const [form, setForm] = useState(
    editData || { name: { en: "", ar: "" } }
  );

  const handleSubmit = () => {
    if (editData) {
      dispatch(updateBrand({ id: editData._id, data: stripMetadata(form) }));
    } else {

      dispatch(createBrand(form));
    }
    close();
  };

  const inputClasses = "w-full border border-[#222222] rounded-lg p-3 bg-[#0F0F0F] text-white placeholder:text-[#555555] focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-[#444444] transition-all text-sm";

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-[#0F0F0F] text-white border border-[#222222] p-6 md:p-8 w-full max-w-[400px] rounded-2xl space-y-5 animate-fade-in-scale">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {editData ? "Edit Brand" : "Add Brand"}
          </h2>
          <button onClick={close} className="p-2 text-[#555555] hover:text-white hover:bg-[#1A1A1A] rounded-lg transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[#888888] block mb-1.5">English Name</label>
            <input
              className={inputClasses}
              placeholder="e.g., Apple"
              value={form.name.en}
              onChange={(e) => setForm({ ...form, name: { ...form.name, en: e.target.value } })}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[#888888] block mb-1.5">Arabic Name</label>
            <input
              className={`${inputClasses} text-right`}
              placeholder="e.g., أبل"
              dir="rtl"
              value={form.name.ar}
              onChange={(e) => setForm({ ...form, name: { ...form.name, ar: e.target.value } })}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-5 border-t border-[#222222]">
          <button className="px-5 py-2.5 border border-[#222222] rounded-xl text-[#888888] hover:text-white hover:bg-[#1A1A1A] transition-all text-sm font-medium" onClick={close}>Cancel</button>
          <button
            className="px-6 py-2.5 bg-white text-black rounded-xl font-semibold hover:bg-neutral-200 transition-all text-sm"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

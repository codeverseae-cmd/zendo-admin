"use client";

import { useEffect, useState } from "react";
import { fetchBrands, deleteBrand } from "@/src/store/brand/thunk";
import { useAppDispatch } from "../hooks/useDispatch";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import BrandFormModal from "./BrandFormModal";
import { Search, Plus, Edit2, Trash2, Tag } from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function BrandPageComponent() {
  const dispatch = useAppDispatch();
  const { data, loading } = useSelector((state: RootState) => state.brand);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  const filteredBrands = search
    ? data.filter((b) =>
      b.name.en.toLowerCase().includes(search.toLowerCase()) ||
      b.name.ar.toLowerCase().includes(search.toLowerCase())
    )
    : data;

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* Search & Add Brand */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555555] group-focus-within:text-white transition-colors" />
          <input
            type="text"
            placeholder="Search brands..."
            className="w-full pl-10 pr-4 py-3 bg-[#0F0F0F] border border-[#222222] rounded-xl text-sm text-white placeholder:text-[#555555] focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-[#444444] transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-neutral-200 transition-all active:scale-95 whitespace-nowrap text-sm"
        >
          <Plus className="w-4 h-4" />
          Add New Brand
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-[#0F0F0F] rounded-2xl border border-[#222222] overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <p className="text-[#555555] font-medium text-sm">Fetching brands...</p>
          </div>
        ) : filteredBrands.length === 0 ? (
          <div className="p-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-[#1A1A1A] rounded-2xl flex items-center justify-center mb-4 border border-[#222222]">
              <Tag className="w-8 h-8 text-[#555555]" />
            </div>
            <h3 className="text-lg font-semibold text-white">No brands found</h3>
            <p className="text-[#555555] max-w-xs mt-2 text-sm">Try adjusting your search or add a new brand to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left responsive-table">
              <thead>
                <tr className="border-b border-[#222222]">
                  <th className="px-6 py-4 text-[0.6875rem] font-semibold text-[#555555] uppercase tracking-wider">English Name</th>
                  <th className="px-6 py-4 text-[0.6875rem] font-semibold text-[#555555] uppercase tracking-wider text-right">Arabic Name</th>
                  <th className="px-6 py-4 text-[0.6875rem] font-semibold text-[#555555] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]">
                {filteredBrands.map((brand) => (
                  <tr key={brand._id} className="hover:bg-[#1A1A1A] transition-colors group">
                    <td className="px-6 py-4" data-label="English">
                      <span className="font-semibold text-white text-sm">{brand.name.en}</span>
                    </td>
                    <td className="px-6 py-4 text-right" data-label="Arabic">
                      <span className="text-sm font-medium text-[#888888] font-arabic" dir="rtl">{brand.name.ar}</span>
                    </td>
                    <td className="px-6 py-4 text-right" data-label="Actions">
                      <div className="flex items-center justify-end gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button
                          className="p-2.5 text-[#555555] hover:text-white hover:bg-[#1A1A1A] border border-transparent hover:border-[#222222] rounded-xl transition-all"
                          onClick={() => {
                            setEditData(brand);
                            setShowForm(true);
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2.5 text-[#555555] hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-xl transition-all"
                          onClick={() => brand._id && dispatch(deleteBrand(brand._id))}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <BrandFormModal
          close={() => {
            setShowForm(false);
            setEditData(null);
          }}
          editData={editData}
        />
      )}
    </div>
  );
}

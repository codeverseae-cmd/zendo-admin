"use client";

import { useState, useEffect } from "react";
import { createProduct, updateProduct } from "@/src/store/product/thunk";
import { fetchCategories } from "@/src/store/category/thunk";
import { fetchBrands } from "@/src/store/brand/thunk";
import { useAppDispatch } from "../hooks/useDispatch";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store";
import { cleanProductData } from "../utils/cleanProductData";
import { UploadImage } from "../utils/uploadImage";
import { Loader2, Upload, X } from "lucide-react";

const COLORS = [
  { label: "Green", value: "green" },
  { label: "Red", value: "red" },
  { label: "Orange", value: "orange" },
];

export default function ProductFormModal({ close, editData }: any) {
  const dispatch = useAppDispatch();
  const [isUploading, setIsUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const { data: categories } = useSelector((s: RootState) => s.category);
  const { data: brands } = useSelector((s: RootState) => s.brand);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchBrands());
  }, [dispatch]);

  const [form, setForm] = useState(
    editData ? {
      ...editData,
      categoryId: typeof editData.categoryId === 'object' ? editData.categoryId?._id : editData.categoryId,
      brandId: typeof editData.brandId === 'object' ? editData.brandId?._id : editData.brandId
    } : {
      name: { en: "", ar: "" },
      categoryId: "",
      brandId: "",
      image: "",
      price: 0,
      originalPrice: 0,
      rating: 0,
      discount: "",
      discountColor: "",
      badge: "",
      badgeColor: "",
    }
  );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);

    setIsUploading(true);
    const imageUrl = await UploadImage(file);
    if (imageUrl) {
      setForm({ ...form, image: imageUrl });
    }
    setIsUploading(false);
  };

  const handleSubmit = () => {
    const cleanedData = cleanProductData(form);
    if (editData) {
      dispatch(
        updateProduct({ id: editData._id, data: cleanedData })
      );
    } else {
      dispatch(createProduct(cleanedData));
    }
    close();
  };

  const inputClasses = "w-full border border-[#222222] rounded-lg p-3 bg-[#0F0F0F] text-white placeholder:text-[#555555] focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-[#444444] transition-all text-sm";
  const labelClasses = "font-medium text-sm text-[#888888] block mb-1.5";

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-[#0F0F0F] text-white border border-[#222222] p-6 md:p-8 w-full max-w-[500px] max-h-[90vh] overflow-y-auto rounded-2xl space-y-5 animate-fade-in-scale">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {editData ? "Edit Product" : "Add Product"}
          </h2>
          <button onClick={close} className="p-2 text-[#555555] hover:text-white hover:bg-[#1A1A1A] rounded-lg transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* IMAGE UPLOAD */}
        <div>
          <label className={labelClasses}>Product Image</label>
          <div className="flex items-center gap-4">
            {(form.image || localPreview) && (
              <div className="relative w-20 h-20 border border-[#222222] rounded-xl overflow-hidden shrink-0 bg-[#0F0F0F]">
                <img
                  src={localPreview || form.image}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <label className="flex-1 border border-dashed border-[#333333] rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-white/40 transition-colors bg-[#0A0A0A]">
              {isUploading ? (
                <Loader2 className="w-6 h-6 animate-spin text-white" />
              ) : (
                <>
                  <Upload className="w-6 h-6 text-[#555555]" />
                  <span className="text-xs text-[#555555] mt-1.5 font-medium">
                    Click to upload image (JPG, PNG, WEBP)
                  </span>
                </>
              )}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
            </label>
          </div>
        </div>

        {/* NAME */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClasses}>Name (English)</label>
            <input
              className={inputClasses}
              placeholder="e.g., Fresh Orange Juice"
              value={form.name.en}
              onChange={(e) =>
                setForm({ ...form, name: { ...form.name, en: e.target.value } })
              }
            />
          </div>

          <div>
            <label className={labelClasses}>Name (Arabic)</label>
            <input
              className={`${inputClasses} text-right`}
              placeholder="e.g., عصير برتقال طازج"
              dir="rtl"
              value={form.name.ar}
              onChange={(e) =>
                setForm({ ...form, name: { ...form.name, ar: e.target.value } })
              }
            />
          </div>
        </div>

        {/* CATEGORY & BRAND */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClasses}>Category</label>
            <select
              className={inputClasses}
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            >
              <option value="">Select Category</option>
              {categories.map((cat: any) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name.en}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClasses}>Brand</label>
            <select
              className={inputClasses}
              value={form.brandId}
              onChange={(e) => setForm({ ...form, brandId: e.target.value })}
            >
              <option value="">Select Brand</option>
              {brands.map((brand: any) => (
                <option key={brand._id} value={brand._id}>
                  {brand.name.en}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* PRICE */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClasses}>Price (SAR)</label>
            <input
              type="number"
              className={inputClasses}
              placeholder="0.00"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: Number(e.target.value) })
              }
            />
          </div>

          <div>
            <label className={labelClasses}>Original Price</label>
            <input
              type="number"
              className={inputClasses}
              placeholder="0.00"
              value={form.originalPrice}
              onChange={(e) =>
                setForm({ ...form, originalPrice: Number(e.target.value) })
              }
            />
          </div>
        </div>

        {/* DISCOUNT */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClasses}>Discount</label>
            <input
              className={inputClasses}
              placeholder="e.g., 20%"
              value={form.discount}
              onChange={(e) => setForm({ ...form, discount: e.target.value })}
            />
          </div>

          <div>
            <label className={labelClasses}>Discount Color</label>
            <select
              className={inputClasses}
              value={form.discountColor}
              onChange={(e) =>
                setForm({ ...form, discountColor: e.target.value })
              }
            >
              <option value="">Select Color</option>
              {COLORS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* BADGE */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClasses}>Badge Text</label>
            <input
              className={inputClasses}
              placeholder="e.g., Best Seller"
              value={form.badge}
              onChange={(e) => setForm({ ...form, badge: e.target.value })}
            />
          </div>

          <div>
            <label className={labelClasses}>Badge Color</label>
            <select
              className={inputClasses}
              value={form.badgeColor}
              onChange={(e) => setForm({ ...form, badgeColor: e.target.value })}
            >
              <option value="">Select Color</option>
              {COLORS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex justify-end gap-3 pt-5 border-t border-[#222222]">
          <button
            className="px-6 py-2.5 rounded-xl border border-[#222222] text-[#888888] hover:text-white hover:bg-[#1A1A1A] transition-all text-sm font-medium"
            onClick={close}
          >
            Cancel
          </button>
          <button
            disabled={isUploading}
            className="px-6 py-2.5 rounded-xl bg-white text-black font-semibold hover:bg-neutral-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
            onClick={handleSubmit}
          >
            {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
            {editData ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

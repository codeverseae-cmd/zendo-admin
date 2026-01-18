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
import { Loader2, Upload } from "lucide-react";

const COLORS = [
  { label: "Green", value: "green" },
  { label: "Red", value: "red" },
  { label: "Orange", value: "orange" },
];

export default function ProductFormModal({ close, editData }: any) {
  const dispatch = useAppDispatch();
  const [isUploading, setIsUploading] = useState(false);

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

    setIsUploading(true);
    const imageUrl = await UploadImage(file);
    if (imageUrl) {
      setForm({ ...form, image: imageUrl });
    }
    setIsUploading(false);
  };

  const handleSubmit = () => {
    if (editData) {
      dispatch(
        updateProduct({ id: editData._id, data: cleanProductData(form) })
      );
    } else {
      dispatch(createProduct(form));
    }
    close();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white text-gray-900 border border-gray-100 p-6 w-full max-w-[500px] max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl space-y-4">
        <h2 className="text-2xl font-bold mb-4">
          {editData ? "Edit Product" : "Add Product"}
        </h2>

        {/* IMAGE UPLOAD */}
        <div>
          <label className="font-semibold block mb-2">Product Image</label>
          <div className="flex items-center gap-4">
            {form.image && (
              <div className="relative w-20 h-20 border rounded-lg overflow-hidden shrink-0">
                <img
                  src={form.image}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <label className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
              {isUploading ? (
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              ) : (
                <>
                  <Upload className="w-6 h-6 text-gray-400" />
                  <span className="text-sm text-gray-500 mt-1">
                    Click to upload image
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
            <label className="font-semibold block mb-1">Name (English)</label>
            <input
              className="w-full border rounded-lg p-2 bg-transparent text-gray-900"
              placeholder="e.g., Fresh Orange Juice"
              value={form.name.en}
              onChange={(e) =>
                setForm({ ...form, name: { ...form.name, en: e.target.value } })
              }
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Name (Arabic)</label>
            <input
              className="w-full border rounded-lg p-2 bg-transparent text-right text-gray-900"
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
            <label className="font-semibold block mb-1">Category</label>
            <select
              className="w-full border rounded-lg p-2 bg-transparent text-gray-900"
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
            <label className="font-semibold block mb-1">Brand</label>
            <select
              className="w-full border rounded-lg p-2 bg-transparent text-gray-900"
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
            <label className="font-semibold block mb-1">Price (SAR)</label>
            <input
              type="number"
              className="w-full border rounded-lg p-2 bg-transparent text-gray-900"
              placeholder="0.00"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: Number(e.target.value) })
              }
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Original Price</label>
            <input
              type="number"
              className="w-full border rounded-lg p-2 bg-transparent text-gray-900"
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
            <label className="font-semibold block mb-1">Discount</label>
            <input
              className="w-full border rounded-lg p-2 bg-transparent text-gray-900"
              placeholder="e.g., 20%"
              value={form.discount}
              onChange={(e) => setForm({ ...form, discount: e.target.value })}
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Discount Color</label>
            <select
              className="w-full border rounded-lg p-2 bg-transparent text-gray-900"
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
            <label className="font-semibold block mb-1">Badge Text</label>
            <input
              className="w-full border rounded-lg p-2 bg-transparent text-gray-900"
              placeholder="e.g., Best Seller"
              value={form.badge}
              onChange={(e) => setForm({ ...form, badge: e.target.value })}
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Badge Color</label>
            <select
              className="w-full border rounded-lg p-2 bg-transparent text-gray-900"
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
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            className="px-6 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            onClick={close}
          >
            Cancel
          </button>
          <button
            disabled={isUploading}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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


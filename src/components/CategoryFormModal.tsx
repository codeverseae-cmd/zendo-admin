"use client";

import { useState } from "react";
import { createCategory, updateCategory } from "@/src/store/category/thunk";
import { useAppDispatch } from "../hooks/useDispatch";
import { stripMetadata } from "../utils/stripMetadata";


export default function CategoryFormModal({ close, editData }: any) {
  const dispatch = useAppDispatch();

  const [form, setForm] = useState(
    editData || { name: { en: "", ar: "" }, subCategories: [] }
  );

  const handleSubmit = () => {
    if (editData) {
      dispatch(updateCategory({ id: editData._id, data: stripMetadata(form) }));
    } else {

      dispatch(createCategory(form));
    }
    close();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white text-gray-900 border border-gray-100 p-6 w-full max-w-[400px] rounded-xl shadow-2xl space-y-4">
        <h2 className="text-2xl font-bold">
          {editData ? "Edit Category" : "Add Category"}
        </h2>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-semibold block mb-1">English Name</label>
            <input
              className="border rounded-lg p-2 w-full bg-transparent text-gray-900"
              placeholder="e.g., Electronics"
              value={form.name.en}
              onChange={(e) =>
                setForm({ ...form, name: { ...form.name, en: e.target.value } })
              }
            />
          </div>

          <div>
            <label className="text-sm font-semibold block mb-1">Arabic Name</label>
            <input
              className="border rounded-lg p-2 w-full bg-transparent text-right text-gray-900"
              placeholder="e.g., إلكترونيات"
              dir="rtl"
              value={form.name.ar}
              onChange={(e) =>
                setForm({ ...form, name: { ...form.name, ar: e.target.value } })
              }
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" onClick={close}>
            Cancel
          </button>
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

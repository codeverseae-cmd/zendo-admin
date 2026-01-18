"use client";

import { useEffect, useState } from "react";
import { fetchProducts, deleteProduct } from "@/src/store/product/thunk";
import Pagination from "@/src/components/Pagination";
import { useAppDispatch } from "../hooks/useDispatch";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import ProductFormModal from "./ProductForm";
import { Search, Plus, Edit2, Trash2, Package } from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function ProductPage() {
  const dispatch = useAppDispatch();
  const { datas, loading, page, limit, totalPages } = useSelector(
    (state: RootState) => state.product
  );

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchProducts({ page, limit, search }));
  }, [page, search, dispatch, limit]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Search & Add Product */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all shadow-sm"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-2xl font-semibold hover:bg-gray-800 transition-all shadow-lg shadow-black/10 active:scale-95 whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Add New Product
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 font-medium">Fetching products...</p>
          </div>
        ) : datas.length === 0 ? (
          <div className="p-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No products found</h3>
            <p className="text-gray-500 max-w-xs mt-2">Try adjusting your search or add a new product to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {datas.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl border border-gray-100 overflow-hidden bg-white p-1 shrink-0">
                          <img
                            src={product.image || "/placeholder-img.png"}
                            alt={product.name.en}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 line-clamp-1">{product.name.en}</p>
                          <p className="text-xs text-gray-400 font-medium mt-0.5 line-clamp-1">{product.name.ar}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900">SAR {product.price.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="p-2.5 text-gray-400 hover:text-black hover:bg-white border border-transparent hover:border-gray-200 rounded-xl transition-all"
                          onClick={() => {
                            setEditData(product);
                            setShowForm(true);
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-white border border-transparent hover:border-gray-200 rounded-xl transition-all"
                          onClick={() => handleDelete(product._id!)}
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

      <div className="flex justify-center">
        <Pagination totalPages={totalPages} />
      </div>

      {showForm && (
        <ProductFormModal
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


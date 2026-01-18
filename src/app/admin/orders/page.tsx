"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { Order } from "@/src/store/order/type";
import { useAppDispatch } from "@/src/hooks/useDispatch";
import { RootState } from "@/src/store";
import { fetchOrders } from "@/src/store/order/thunk";
import { changePage } from "@/src/store/product/slice";
import { ExternalLink, ShoppingBag, User as UserIcon, Calendar, CreditCard } from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const { list, loading, pagination } = useSelector(
    (s: RootState) => s.order
  );
  const { page, totalPages } = pagination;

  useEffect(() => {
    dispatch(fetchOrders({ page, limit: pagination.limit }));
  }, [page, dispatch, pagination.limit]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-50 text-green-600 border-green-100';
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
      case 'processing': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'shipped': return 'bg-purple-50 text-purple-600 border-purple-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Orders</p>
          <div className="flex items-center justify-between mt-2">
            <h3 className="text-3xl font-bold">{pagination.total || 0}</h3>
            <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-black" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 font-medium">Fetching orders...</p>
          </div>
        ) : list.length === 0 ? (
          <div className="p-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
              <ShoppingBag className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No orders yet</h3>
            <p className="text-gray-500 max-w-xs mt-2">When customers place orders, they will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {list.map((o: Order) => (
                  <tr key={o._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">#{o._id.slice(-6).toUpperCase()}</span>
                        <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(o.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <UserIcon className="w-4 h-4 text-gray-500" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900 line-clamp-1">{o.contact.fullName}</span>
                          <span className="text-xs text-green-600 font-bold mt-0.5">SAR {o.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">{o.paymentStatus}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                        getStatusColor(o.orderStatus)
                      )}>
                        {o.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/orders/${o._id}`}
                        className="inline-flex items-center gap-1.5 text-black bg-white border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-black hover:text-white hover:border-black transition-all shadow-sm"
                      >
                        Details
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => dispatch(changePage(p))}
              className={cn(
                "w-10 h-10 rounded-xl font-bold transition-all border",
                p === page
                  ? "bg-black text-white border-black shadow-lg shadow-black/10"
                  : "bg-white text-gray-400 border-gray-100 hover:border-gray-300 hover:text-black"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
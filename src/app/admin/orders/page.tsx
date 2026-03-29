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
      case 'delivered': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'processing': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'shipped': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-[#1A1A1A] text-[#888888] border-[#222222]';
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-16 lg:pb-0">
      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-[#0F0F0F] p-6 rounded-2xl border border-[#222222]">
          <p className="text-[#555555] text-[0.6875rem] font-semibold uppercase tracking-wider">Total Orders</p>
          <div className="flex items-center justify-between mt-3">
            <h3 className="text-3xl font-bold text-white tracking-tight">{pagination.total || 0}</h3>
            <div className="w-11 h-11 bg-[#1A1A1A] border border-[#222222] rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-[#0F0F0F] rounded-2xl border border-[#222222] overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <p className="text-[#555555] font-medium text-sm">Fetching orders...</p>
          </div>
        ) : list.length === 0 ? (
          <div className="p-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-[#1A1A1A] rounded-2xl flex items-center justify-center mb-4 border border-[#222222]">
              <ShoppingBag className="w-8 h-8 text-[#555555]" />
            </div>
            <h3 className="text-lg font-semibold text-white">No orders yet</h3>
            <p className="text-[#555555] max-w-xs mt-2 text-sm">When customers place orders, they will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left responsive-table">
              <thead>
                <tr className="border-b border-[#222222]">
                  <th className="px-6 py-4 text-[0.6875rem] font-semibold text-[#555555] uppercase tracking-wider">Order</th>
                  <th className="px-6 py-4 text-[0.6875rem] font-semibold text-[#555555] uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-[0.6875rem] font-semibold text-[#555555] uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-4 text-[0.6875rem] font-semibold text-[#555555] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[0.6875rem] font-semibold text-[#555555] uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]">
                {list.map((o: Order) => (
                  <tr key={o._id} className="hover:bg-[#1A1A1A] transition-colors group">
                    <td className="px-6 py-4" data-label="Order">
                      <div className="flex flex-col">
                        <span className="font-semibold text-white text-sm">#{o._id.slice(-6).toUpperCase()}</span>
                        <span className="text-[0.625rem] text-[#555555] font-medium flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(o.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4" data-label="Customer">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#1A1A1A] border border-[#222222] rounded-lg flex items-center justify-center">
                          <UserIcon className="w-4 h-4 text-[#555555]" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-white line-clamp-1 text-sm">{o.contact.fullName}</span>
                          <span className="text-xs text-emerald-400 font-semibold mt-0.5">SAR {o.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4" data-label="Payment">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-3.5 h-3.5 text-[#555555]" />
                        <span className="text-xs font-semibold text-[#888888] uppercase tracking-wider">{o.paymentStatus}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4" data-label="Status">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[0.625rem] font-semibold uppercase tracking-wider border",
                        getStatusColor(o.orderStatus)
                      )}>
                        {o.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right" data-label="Action">
                      <Link
                        href={`/admin/orders/${o._id}`}
                        className="inline-flex items-center gap-1.5 text-white bg-[#0F0F0F] border border-[#222222] px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-white hover:text-black hover:border-white transition-all"
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
                "w-10 h-10 rounded-xl font-semibold transition-all border text-sm",
                p === page
                  ? "bg-white text-black border-white"
                  : "bg-[#0F0F0F] text-[#555555] border-[#222222] hover:border-[#444444] hover:text-white"
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
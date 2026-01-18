"use client";

import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "@/src/store";
import { fetchSingleOrder, updateOrderStatus } from "@/src/store/order/thunk";
import { ArrowLeft, User, CreditCard, ShoppingBag, MapPin, Calendar, Clock } from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function ViewOrderPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<any>();
  const { single, loading } = useSelector((s: RootState) => s.order);

  useEffect(() => {
    dispatch(fetchSingleOrder(id as string));
  }, [dispatch, id]);

  if (loading || !single) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 animate-pulse">
        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-medium tracking-tight">Loading order details...</p>
      </div>
    );
  }

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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-black hover:text-white transition-all shadow-sm group"
          >
            <ArrowLeft className="w-5 h-5 group-active:scale-90 transition-transform" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Order #{single._id.slice(-6).toUpperCase()}</h1>
            <div className="flex items-center gap-3 text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(single.createdAt).toLocaleDateString()}
              </span>
              <span className="w-1 h-1 bg-gray-200 rounded-full" />
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(single.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className={cn(
            "px-6 py-2 rounded-2xl text-xs font-black uppercase tracking-widest border shadow-sm",
            getStatusColor(single.orderStatus)
          )}>
            {single.orderStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Items */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-gray-400" />
              <h2 className="font-black text-gray-900 uppercase tracking-widest text-xs">Ordered Items</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {single.items.map((item: any) => (
                <div key={item.productId} className="p-6 flex items-center justify-between group transition-colors hover:bg-gray-50/50">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center p-2 shrink-0">
                      <img src={item.image || "/placeholder-img.png"} alt={item.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{item.name}</h4>
                      <p className="text-xs font-bold text-gray-400 mt-1">
                        SAR {item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-gray-900">SAR {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-8 bg-gray-50/50 border-t border-gray-100">
              <div className="flex flex-col gap-3 max-w-xs ml-auto">
                <div className="flex justify-between items-center text-sm font-bold text-gray-400 uppercase tracking-wider">
                  <span>Subtotal</span>
                  <span className="text-gray-900">SAR {(single.total - (single.shippingCost || 0)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-gray-400 uppercase tracking-wider">
                  <span>Shipping</span>
                  <span className="text-gray-900">SAR {(single.shippingCost || 0).toFixed(2)}</span>
                </div>
                <div className="h-px bg-gray-200 my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black uppercase tracking-widest text-gray-900">Grand Total</span>
                  <span className="text-2xl font-black text-green-600">SAR {single.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Actions */}
        <div className="space-y-8">
          {/* Customer Card */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-6">
              <User className="w-4 h-4" />
              Customer
            </h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center font-black">
                {single.contact.fullName[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-gray-900 truncate">{single.contact.fullName}</p>
                <p className="text-xs font-bold text-gray-400 truncate">{single.contact.email}</p>
              </div>
            </div>
            <div className="pt-6 border-t border-gray-50 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <p className="text-sm font-bold text-gray-600 line-clamp-3">
                  {single.shipping?.address}, {single.shipping?.city}, {single.shipping?.state}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Card */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 border-dashed">
            <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-6">
              <CreditCard className="w-4 h-4" />
              Payment Status
            </h3>
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm font-black text-gray-900 uppercase">{single.paymentStatus}</p>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Update Order Status</label>
              <select
                value={single.orderStatus}
                onChange={(e) =>
                  dispatch(updateOrderStatus({ id: single._id, status: e.target.value }))
                }
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 font-bold text-sm text-gray-900 focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none appearance-none"
              >
                <option value="placed">Placed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


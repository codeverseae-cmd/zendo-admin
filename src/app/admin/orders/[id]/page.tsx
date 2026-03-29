"use client";

import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "@/src/store";
import { fetchSingleOrder, updateOrderStatus, generatePaymentLink } from "@/src/store/order/thunk";
import { ArrowLeft, User, CreditCard, ShoppingBag, MapPin, Calendar, Clock, Link, Send, RefreshCw, Copy, Check } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useState } from "react";

export default function ViewOrderPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<any>();
  const { single, loading } = useSelector((s: RootState) => s.order);
  const [copying, setCopying] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    dispatch(fetchSingleOrder(id as string));
  }, [dispatch, id]);

  const handleGenerateLink = async () => {
    setGenerating(true);
    try {
      await dispatch(generatePaymentLink(id as string)).unwrap();
      dispatch(fetchSingleOrder(id as string));
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyLink = () => {
    if (single?.checkoutUrl) {
      navigator.clipboard.writeText(single.checkoutUrl);
      setCopying(true);
      setTimeout(() => setCopying(false), 2000);
    }
  };

  const handleShareLink = (type: 'whatsapp' | 'email') => {
    if (!single?.checkoutUrl) return;

    const message = `Payment link for your order #${single._id.slice(-6).toUpperCase()}: ${single.checkoutUrl}`;
    if (type === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    } else {
      window.location.href = `mailto:?subject=Order Payment Link&body=${encodeURIComponent(message)}`;
    }
  };

  const isLinkExpired = single?.paymentLinkExpiresAt
    ? new Date() > new Date(single.paymentLinkExpiresAt)
    : false;

  if (loading || !single) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin" />
        <p className="text-[#555555] font-medium tracking-tight text-sm">Loading order details...</p>
      </div>
    );
  }

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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-3 bg-[#0F0F0F] border border-[#222222] rounded-xl hover:bg-white hover:text-black hover:border-white transition-all group"
          >
            <ArrowLeft className="w-5 h-5 group-active:scale-90 transition-transform" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white">Order #{single._id.slice(-6).toUpperCase()}</h1>
            <div className="flex items-center gap-3 text-[0.625rem] font-semibold text-[#555555] mt-1 uppercase tracking-widest">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(single.createdAt).toLocaleDateString()}
              </span>
              <span className="w-1 h-1 bg-[#333333] rounded-full" />
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(single.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className={cn(
            "px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border",
            getStatusColor(single.orderStatus)
          )}>
            {single.orderStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {/* Items */}
          <div className="bg-[#0F0F0F] rounded-2xl border border-[#222222] overflow-hidden">
            <div className="p-5 md:p-6 border-b border-[#222222] flex items-center gap-3">
              <ShoppingBag className="w-4 h-4 text-[#555555]" />
              <h2 className="font-bold text-white uppercase tracking-widest text-[0.6875rem]">Ordered Items</h2>
            </div>
            <div className="divide-y divide-[#1A1A1A]">
              {single.items.map((item: any) => (
                <div key={item.productId} className="p-5 md:p-6 flex items-center justify-between group transition-colors hover:bg-[#1A1A1A]">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-[#0F0F0F] border border-[#222222] rounded-xl flex items-center justify-center p-2 shrink-0">
                      <img src={item.image || "/placeholder-img.png"} alt={item.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">{item.name}</h4>
                      <p className="text-xs font-medium text-[#555555] mt-1">
                        SAR {item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white text-sm">SAR {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 md:p-8 border-t border-[#222222] bg-[#0A0A0A]">
              <div className="flex flex-col gap-3 max-w-xs ml-auto">
                <div className="flex justify-between items-center text-sm font-medium text-[#555555] uppercase tracking-wider">
                  <span>Subtotal</span>
                  <span className="text-white">SAR {(single.total - (single.shippingCost || 0)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium text-[#555555] uppercase tracking-wider">
                  <span>Shipping</span>
                  <span className="text-white">SAR {(single.shippingCost || 0).toFixed(2)}</span>
                </div>
                <div className="h-px bg-[#222222] my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-[0.6875rem] font-bold uppercase tracking-widest text-white">Grand Total</span>
                  <span className="text-xl md:text-2xl font-bold text-emerald-400">SAR {single.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Actions */}
        <div className="space-y-6 md:space-y-8">
          {/* Customer Card */}
          <div className="bg-[#0F0F0F] rounded-2xl border border-[#222222] p-6 md:p-8">
            <h3 className="flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-widest text-[#555555] mb-6">
              <User className="w-4 h-4" />
              Customer
            </h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-11 h-11 bg-white text-black rounded-xl flex items-center justify-center font-bold">
                {single.contact.fullName[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white truncate text-sm">{single.contact.fullName}</p>
                <p className="text-xs font-medium text-[#555555] truncate">{single.contact.email}</p>
              </div>
            </div>
            <div className="pt-6 border-t border-[#222222] space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#555555] mt-0.5" />
                <p className="text-sm font-medium text-[#888888] line-clamp-3">
                  {single.shipping?.address}, {single.shipping?.city}, {single.shipping?.state}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Payment Link Actions */}
      {single.paymentStatus !== "paid" && (
        <div className="bg-[#0F0F0F] rounded-2xl border border-[#222222] p-6 md:p-8 space-y-6">
          <h3 className="flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-widest text-[#555555]">
            <Link className="w-4 h-4" />
            Payment Link
          </h3>

          {(single.paymentLinkStatus === "none" || isLinkExpired || single.paymentLinkStatus === "used" || single.paymentLinkStatus === "expired") ? (
            <button
              onClick={handleGenerateLink}
              disabled={generating}
              className="w-full bg-white text-black rounded-xl p-4 font-semibold text-sm hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              {single.paymentLinkStatus === "none" ? "Generate Payment Link" : "Generate New Link"}
            </button>
          ) : (
            <div className="space-y-3">
              <div className="flex gap-2">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 bg-[#1A1A1A] border border-[#222222] text-white rounded-xl p-4 font-semibold text-sm hover:bg-[#222222] transition-all flex items-center justify-center gap-2"
                >
                  {copying ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copying ? "Copied!" : "Copy Link"}
                </button>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleShareLink('whatsapp')}
                    className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl p-4 hover:bg-emerald-500/20 transition-all"
                    title="Share via WhatsApp"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShareLink('email')}
                    className="bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl p-4 hover:bg-blue-500/20 transition-all"
                    title="Share via Email"
                  >
                    <Send className="w-4 h-4 -rotate-45" />
                  </button>
                </div>
              </div>
              {single.paymentLinkExpiresAt && (
                <p className="text-[0.625rem] font-semibold text-[#555555] uppercase tracking-widest text-center">
                  Expires: {new Date(single.paymentLinkExpiresAt).toLocaleString()}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

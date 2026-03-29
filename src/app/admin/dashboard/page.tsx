"use client";
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store';
import { useAppDispatch } from '@/src/hooks/useDispatch';
import { fetchProducts } from '@/src/store/product/thunk';
import { fetchCategories } from '@/src/store/category/thunk';
import { fetchBrands } from '@/src/store/brand/thunk';
import { fetchOrders } from '@/src/store/order/thunk';
import {
  Package,
  FolderTree,
  Award,
  ShoppingCart,
  DollarSign,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

// ─── Stat Card ───
interface StatCardData {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

function StatCardComponent({ stat, index }: { stat: StatCardData; index: number }) {
  return (
    <div
      className="bg-[#0F0F0F] rounded-2xl border border-[#222222] p-6 hover:border-[#333333] transition-all duration-300 group animate-fade-in"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-center justify-between">
        <div className="w-11 h-11 bg-white text-black rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
          {stat.icon}
        </div>
      </div>
      <div className="mt-5">
        <h3 className="text-[#555555] text-[0.6875rem] font-semibold uppercase tracking-wider">{stat.title}</h3>
        <p className="text-2xl font-bold text-white mt-1 tracking-tight">{stat.value}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const dispatch = useAppDispatch();

  // ── Selectors (read from store) ──
  const { total: totalProducts, loading: loadingProducts } = useSelector(
    (s: RootState) => s.product
  );
  const { data: categories, loading: loadingCategories } = useSelector(
    (s: RootState) => s.category
  );
  const { data: brands, loading: loadingBrands } = useSelector(
    (s: RootState) => s.brand
  );
  const { list: orders, pagination: orderPagination, loading: loadingOrders } = useSelector(
    (s: RootState) => s.order
  );

  // ── Fetch all data on mount ──
  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 5 }));
    dispatch(fetchCategories());
    dispatch(fetchBrands());
    dispatch(fetchOrders({ page: 1, limit: 100 }));
  }, [dispatch]);

  const isLoading = loadingProducts || loadingCategories || loadingBrands || loadingOrders;

  // ── Compute real values ──
  const totalCategoriesCount = categories.length;
  const totalBrandsCount = brands.length;
  const totalOrdersCount = orderPagination.total || orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  const statsData: StatCardData[] = [
    {
      title: 'Total Products',
      value: totalProducts.toLocaleString(),
      icon: <Package className="w-5 h-5" />,
    },
    {
      title: 'Total Categories',
      value: totalCategoriesCount.toLocaleString(),
      icon: <FolderTree className="w-5 h-5" />,
    },
    {
      title: 'Total Brands',
      value: totalBrandsCount.toLocaleString(),
      icon: <Award className="w-5 h-5" />,
    },
    {
      title: 'Total Orders',
      value: totalOrdersCount.toLocaleString(),
      icon: <ShoppingCart className="w-5 h-5" />,
    },
    {
      title: 'Total Revenue',
      value: `SAR ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <DollarSign className="w-5 h-5" />,
    },
  ];

  // ── Loading state ──
  if (isLoading && totalProducts === 0 && totalCategoriesCount === 0) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 text-white animate-spin" />
          <p className="text-[#555555] font-medium text-sm">Preparing your dashboard...</p>
        </div>
      </div>
    );
  }

  // ── Recent orders for the table ──
  const recentOrders = orders.slice(0, 6);

  // ── Order status distribution for the visual bar ──
  const statusCounts: Record<string, number> = {};
  orders.forEach((o) => {
    const s = o.orderStatus.toLowerCase();
    statusCounts[s] = (statusCounts[s] || 0) + 1;
  });

  const statusColors: Record<string, string> = {
    processing: 'bg-blue-400',
    shipped: 'bg-purple-400',
    delivered: 'bg-emerald-400',
    cancelled: 'bg-red-400',
  };

  const statusLabelColors: Record<string, string> = {
    processing: 'text-blue-400',
    shipped: 'text-purple-400',
    delivered: 'text-emerald-400',
    cancelled: 'text-red-400',
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'processing': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'shipped': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-[#1A1A1A] text-[#888888] border-[#222222]';
    }
  };

  return (
    <div className="space-y-8 md:space-y-10 animate-fade-in pb-16 lg:pb-0">
      {/* Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-[#555555] font-medium mt-1 text-sm">
            Real-time system pulse and performance analytics.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-5">
        {statsData.map((stat, index) => (
          <StatCardComponent key={index} stat={stat} index={index} />
        ))}
      </div>

      {/* Bottom Section: Order Status + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

        {/* Order Status Distribution */}
        <div className="bg-[#0F0F0F] rounded-2xl border border-[#222222] p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-4 h-4 text-[#555555]" />
            <h3 className="text-sm font-bold text-white tracking-tight">Order Status</h3>
          </div>

          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <ShoppingCart className="w-8 h-8 text-[#333333] mb-3" />
              <p className="text-[#555555] text-sm font-medium">No order data yet</p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Visual bar */}
              <div className="flex w-full h-3 rounded-full overflow-hidden bg-[#1A1A1A]">
                {Object.entries(statusCounts).map(([status, count]) => {
                  const pct = (count / orders.length) * 100;
                  return (
                    <div
                      key={status}
                      className={cn("transition-all duration-700", statusColors[status] || 'bg-[#555555]')}
                      style={{ width: `${pct}%` }}
                    />
                  );
                })}
              </div>

              {/* Legend */}
              <div className="space-y-3">
                {Object.entries(statusCounts).map(([status, count]) => {
                  const pct = ((count / orders.length) * 100).toFixed(0);
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-2.5 h-2.5 rounded-full", statusColors[status] || 'bg-[#555555]')} />
                        <span className="text-sm font-medium text-[#888888] capitalize">{status}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-white">{count}</span>
                        <span className={cn("text-xs font-semibold", statusLabelColors[status] || 'text-[#555555]')}>{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total */}
              <div className="pt-4 border-t border-[#222222] flex items-center justify-between">
                <span className="text-[0.6875rem] font-semibold text-[#555555] uppercase tracking-wider">Total Orders</span>
                <span className="text-lg font-bold text-white">{orders.length}</span>
              </div>
            </div>
          )}
        </div>

        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-[#0F0F0F] rounded-2xl border border-[#222222] overflow-hidden">
          <div className="p-5 md:p-6 border-b border-[#222222] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-[#555555]" />
              <h3 className="text-sm font-bold text-white tracking-tight">Recent Orders</h3>
            </div>
            <span className="text-[0.625rem] font-semibold text-[#555555] uppercase tracking-widest">
              Last {recentOrders.length} orders
            </span>
          </div>

          {recentOrders.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center text-center">
              <ShoppingCart className="w-8 h-8 text-[#333333] mb-3" />
              <p className="text-[#555555] text-sm font-medium">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left responsive-table">
                <thead>
                  <tr className="border-b border-[#1A1A1A]">
                    <th className="px-5 py-3 text-[0.625rem] font-semibold text-[#555555] uppercase tracking-wider">Order</th>
                    <th className="px-5 py-3 text-[0.625rem] font-semibold text-[#555555] uppercase tracking-wider">Customer</th>
                    <th className="px-5 py-3 text-[0.625rem] font-semibold text-[#555555] uppercase tracking-wider">Total</th>
                    <th className="px-5 py-3 text-[0.625rem] font-semibold text-[#555555] uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1A1A]">
                  {recentOrders.map((o) => (
                    <tr key={o._id} className="hover:bg-[#1A1A1A] transition-colors">
                      <td className="px-5 py-3.5" data-label="Order">
                        <span className="font-semibold text-white text-sm">#{o._id.slice(-6).toUpperCase()}</span>
                      </td>
                      <td className="px-5 py-3.5" data-label="Customer">
                        <span className="text-sm text-[#888888] font-medium">{o.contact.fullName}</span>
                      </td>
                      <td className="px-5 py-3.5" data-label="Total">
                        <span className="text-sm font-semibold text-emerald-400">SAR {o.total.toFixed(2)}</span>
                      </td>
                      <td className="px-5 py-3.5" data-label="Status">
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-[0.6rem] font-semibold uppercase tracking-wider border",
                          getStatusBadge(o.orderStatus)
                        )}>
                          {o.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
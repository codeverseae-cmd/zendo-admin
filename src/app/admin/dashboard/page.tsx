"use client";
import { useState, useEffect } from 'react';
import {
  Package,
  FolderTree,
  Award,
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Calendar,
  Filter,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

// Types
interface StatCard {
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
}

// Mock Data
const statsData: StatCard[] = [
  {
    title: 'Total Products',
    value: '2,456',
    change: 12.5,
    changeType: 'increase',
    icon: <Package className="w-6 h-6" />,
  },
  {
    title: 'Total Categories',
    value: '48',
    change: 8.2,
    changeType: 'increase',
    icon: <FolderTree className="w-6 h-6" />,
  },
  {
    title: 'Total Brands',
    value: '156',
    change: 3.1,
    changeType: 'decrease',
    icon: <Award className="w-6 h-6" />,
  },
  {
    title: 'Total Revenue',
    value: 'SAR 124,563',
    change: 18.7,
    changeType: 'increase',
    icon: <DollarSign className="w-6 h-6" />,
  },
  {
    title: 'Total Orders',
    value: '1,893',
    change: 5.4,
    changeType: 'increase',
    icon: <ShoppingCart className="w-6 h-6" />,
  },
  {
    title: 'Total Customers',
    value: '8,234',
    change: 2.8,
    changeType: 'decrease',
    icon: <Users className="w-6 h-6" />,
  },
];

const topProducts = [
  { id: 1, name: 'iPhone 15 Pro', category: 'Electronics', sales: 1234, revenue: 1481800, stock: 45, trend: 'up' },
  { id: 2, name: 'MacBook Pro 16"', category: 'Computers', sales: 856, revenue: 2139144, stock: 23, trend: 'up' },
  { id: 3, name: 'AirPods Pro 2', category: 'Audio', sales: 2341, revenue: 584909, stock: 120, trend: 'down' },
];

const chartData = [
  { month: 'Jan', sales: 4000 },
  { month: 'Feb', sales: 3000 },
  { month: 'Mar', sales: 5000 },
  { month: 'Apr', sales: 4500 },
  { month: 'May', sales: 6000 },
  { month: 'Jun', sales: 5500 },
  { month: 'Jul', sales: 7000 },
];

function StatCardComponent({ stat }: { stat: StatCard }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-lg hover:shadow-black/5 transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300">
          {stat.icon}
        </div>
        <div
          className={cn(
            "flex items-center text-xs font-bold px-2 py-1 rounded-lg border",
            stat.changeType === 'increase'
              ? 'text-green-600 bg-green-50 border-green-100'
              : 'text-red-600 bg-red-50 border-red-100'
          )}
        >
          {stat.changeType === 'increase' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
          {stat.change}%
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">{stat.title}</h3>
        <p className="text-2xl font-black text-gray-900 mt-1">{stat.value}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-10 h-10 text-black animate-spin" />
          <p className="text-gray-500 font-medium">Preparing your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-gray-500 font-medium mt-1">
            System pulse and performance analytics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-black px-4 py-2.5 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm">
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsData.map((stat, index) => (
          <StatCardComponent key={index} stat={stat} />
        ))}
      </div>

      {/* Charts & Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">Revenue Stream</h3>
              <p className="text-sm text-gray-400 font-medium">Weekly sales performance</p>
            </div>
            <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
              <button className="px-4 py-1.5 text-xs bg-white text-black rounded-lg shadow-sm font-bold">Sales</button>
              <button className="px-4 py-1.5 text-xs text-gray-400 hover:text-black rounded-lg font-bold">Orders</button>
            </div>
          </div>

          <div className="flex items-end justify-between h-64 gap-3 px-2">
            {chartData.map((item, index) => {
              const maxVal = 7000;
              const height = (item.sales / maxVal) * 100;
              return (
                <div key={index} className="flex flex-col items-center flex-1 group">
                  <div className="w-full relative flex flex-col items-end justify-end h-full">
                    <div
                      className="w-full bg-gray-50 group-hover:bg-black transition-all duration-500 rounded-2xl relative"
                      style={{ height: `${height}%` }}
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.sales}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 mt-4 uppercase tracking-widest">{item.month}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <div className="flex items-center justify-between mt-2">
            <h3 className="text-3xl font-bold text-gray-900">Trending</h3>
            <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center">
              <Filter className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-6">
            {topProducts.map((p) => (
              <div key={p.id} className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-all duration-300">
                  <Package className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 truncate">{p.name}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{p.category}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-gray-900">SAR {p.sales}</p>
                  <p className="text-[10px] text-green-500 font-bold uppercase tracking-wider">+{p.trend} %</p>
                </div>
              </div>
            ))}

            <button className="w-full mt-4 flex items-center justify-center gap-2 py-4 rounded-2xl border border-dashed border-gray-200 text-gray-400 font-bold text-sm hover:border-black hover:text-black transition-all group">
              View All Analytics
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
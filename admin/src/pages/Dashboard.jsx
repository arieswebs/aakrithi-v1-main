import React, { useState, useEffect } from 'react';
import {
  IndianRupee,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import StatsCard from '../components/StatsCard';
import StatusBadge from '../components/StatusBadge';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setRecentOrders(data.recentOrders || []);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner spinner-lg" />
        <span>Loading dashboard…</span>
      </div>
    );
  }

  const formatCurrency = (val) =>
    '₹' + Number(val || 0).toLocaleString('en-IN');

  // Build chart data from monthly revenue if available
  const chartData = stats?.monthlyRevenue || [
    { month: 'Jan', revenue: 0 },
    { month: 'Feb', revenue: 0 },
    { month: 'Mar', revenue: 0 },
  ];

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="subtitle">Welcome back. Here's what's happening today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatsCard
          label="Total Revenue"
          value={formatCurrency(stats?.totalRevenue)}
          icon={IndianRupee}
          color="indigo"
          trend="up"
          trendValue={stats?.revenueTrend || '—'}
        />
        <StatsCard
          label="Total Orders"
          value={stats?.totalOrders || 0}
          icon={ShoppingCart}
          color="green"
          trend="up"
          trendValue={stats?.ordersTrend || '—'}
        />
        <StatsCard
          label="Customers"
          value={stats?.totalCustomers || 0}
          icon={Users}
          color="blue"
        />
        <StatsCard
          label="Products"
          value={stats?.totalProducts || 0}
          icon={Package}
          color="amber"
        />
      </div>

      {/* Chart + Recent Orders */}
      <div className="grid-2">
        {/* Revenue Chart */}
        <div className="chart-card">
          <div className="flex items-center justify-between mb-md">
            <h3>Revenue Overview</h3>
            <TrendingUp size={18} className="text-muted" />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="month"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  background: '#111631',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10,
                  color: '#f1f5f9',
                  fontSize: 13,
                }}
                formatter={(value) => [formatCurrency(value), 'Revenue']}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#revenueGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Orders */}
        <div className="table-container">
          <div className="table-header">
            <h3>Recent Orders</h3>
            <a href="/orders" className="btn btn-sm btn-secondary">
              View All <ArrowUpRight size={14} />
            </a>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="empty-state">
                    <p>No recent orders</p>
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.order_number}>
                    <td className="font-semibold" style={{ color: 'var(--accent-secondary)' }}>
                      {order.order_number}
                    </td>
                    <td>{order.customer_name}</td>
                    <td>{formatCurrency(order.total)}</td>
                    <td><StatusBadge status={order.status} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

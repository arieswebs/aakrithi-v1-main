@extends('layouts.admin')

@section('admin_title', 'Dashboard Overview')

@section('admin_content')
<div class="stats-grid">
    <div class="stat-card">
        <div class="stat-icon"><i data-lucide="shopping-cart"></i></div>
        <div class="stat-info">
            <h3>Total Orders</h3>
            <p>{{ number_format($stats['total_orders']) }}</p>
        </div>
    </div>
    <div class="stat-card">
        <div class="stat-icon"><i data-lucide="indian-rupee"></i></div>
        <div class="stat-info">
            <h3>Revenue</h3>
            <p>₹{{ number_format($stats['total_revenue']) }}</p>
        </div>
    </div>
    <div class="stat-card">
        <div class="stat-icon"><i data-lucide="users"></i></div>
        <div class="stat-info">
            <h3>Registered Users</h3>
            <p>{{ number_format($stats['total_users']) }}</p>
        </div>
    </div>
    <div class="stat-card">
        <div class="stat-icon"><i data-lucide="package"></i></div>
        <div class="stat-info">
            <h3>Active Products</h3>
            <p>{{ number_format($stats['total_products']) }}</p>
        </div>
    </div>
</div>

<div class="row" style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
    <div class="admin-table-container">
        <div style="padding: 1.5rem; border-bottom: 1px solid rgba(197, 160, 89, 0.1); display: flex; justify-content: space-between; align-items: center;">
            <h3 style="font-size: 1rem; font-weight: 600;">Recent Orders</h3>
            <a href="{{ route('admin.orders.index') }}" style="color: var(--color-accent); text-decoration: none; font-size: 0.8rem;">View All</a>
        </div>
        <table class="admin-table">
            <thead>
                <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                @forelse(\App\Models\Order::latest()->take(5)->get() as $order)
                <tr>
                    <td>#{{ $order->order_number }}</td>
                    <td>{{ $order->customer_name }}</td>
                    <td>
                        <span class="admin-badge {{ $order->status === 'delivered' ? 'badge-green' : 'badge-gold' }}">
                            {{ $order->status }}
                        </span>
                    </td>
                    <td>₹{{ number_format($order->total) }}</td>
                </tr>
                @empty
                <tr>
                    <td colspan="4" style="text-align: center; padding: 2rem; opacity: 0.5;">No orders found yet.</td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <div class="admin-table-container">
        <div style="padding: 1.5rem; border-bottom: 1px solid rgba(197, 160, 89, 0.1);">
            <h3 style="font-size: 1rem; font-weight: 600;">System Health</h3>
        </div>
        <div style="padding: 1.5rem;">
            <div style="margin-bottom: 1.5rem;">
                <p style="font-size: 0.8rem; opacity: 0.6; margin-bottom: 0.5rem;">Server Environment</p>
                <div style="display: flex; justify-content: space-between; font-weight: 600;">
                    <span>PHP Version</span>
                    <span>{{ PHP_VERSION }}</span>
                </div>
            </div>
            <div style="margin-bottom: 1.5rem;">
                <p style="font-size: 0.8rem; opacity: 0.6; margin-bottom: 0.5rem;">Database Engine</p>
                <div style="display: flex; justify-content: space-between; font-weight: 600;">
                    <span>Connection</span>
                    <span>PostgreSQL (Supabase)</span>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

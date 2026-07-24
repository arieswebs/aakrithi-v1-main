@extends('layouts.admin')

@section('admin_title', 'Order Management')

@section('admin_content')
<div style="margin-bottom: 2rem;">
    <p style="opacity: 0.7;">Track and fulfill boutique and wholesale orders.</p>
</div>

<div class="admin-table-container">
    <table class="admin-table">
        <thead>
            <tr>
                <th>Order #</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach($orders as $order)
            <tr>
                <td style="font-weight: 700;">#{{ $order->order_number }}</td>
                <td style="opacity: 0.7;">{{ $order->created_at->format('M d, Y') }}</td>
                <td>
                    <div style="font-weight: 600;">{{ $order->customer_name }}</div>
                    <div style="font-size: 0.75rem; opacity: 0.6;">{{ $order->customer_email }}</div>
                </td>
                <td>
                    <span class="admin-badge {{ $order->is_wholesale ? 'badge-gold' : 'badge-green' }}">
                        {{ $order->is_wholesale ? 'Wholesale' : 'Retail' }}
                    </span>
                </td>
                <td style="font-weight: 600;">₹{{ number_format($order->total_price) }}</td>
                <td>
                    <form action="{{ route('admin.orders.status', $order->id) }}" method="POST" style="margin: 0;">
                        @csrf
                        @method('PUT')
                        <select name="status" onchange="this.form.submit()" class="admin-badge" style="background: rgba(197, 160, 89, 0.1); color: var(--color-accent); border: 1px solid rgba(197, 160, 89, 0.2); cursor: pointer; outline: none;">
                            <option value="pending" {{ $order->status === 'pending' ? 'selected' : '' }}>Pending</option>
                            <option value="confirmed" {{ $order->status === 'confirmed' ? 'selected' : '' }}>Confirmed</option>
                            <option value="processing" {{ $order->status === 'processing' ? 'selected' : '' }}>Processing</option>
                            <option value="shipped" {{ $order->status === 'shipped' ? 'selected' : '' }}>Shipped</option>
                            <option value="delivered" {{ $order->status === 'delivered' ? 'selected' : '' }}>Delivered</option>
                            <option value="cancelled" {{ $order->status === 'cancelled' ? 'selected' : '' }}>Cancelled</option>
                        </select>
                    </form>
                </td>
                <td>
                    <a href="https://www.aakrithiclothings.in/order/{{ $order->order_number }}" target="_blank" style="color: var(--color-accent); text-decoration: none;"><i data-lucide="eye" style="width: 18px;"></i></a>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
    <div style="padding: 1rem;">
        {{ $orders->links() }}
    </div>
</div>
@endsection

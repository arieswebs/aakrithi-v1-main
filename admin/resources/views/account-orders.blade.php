@extends('layouts.app')
@section('title', 'Order History | Aakrithi')

@section('content')
<div class="dashboard-wrapper">
    {{-- Dashboard Header --}}
    <div class="dashboard-header-premium">
        <div class="header-main">
            <h1>Order History</h1>
            <p>Your complete wardrobe timeline.</p>
        </div>
        <div class="header-actions">
            <a href="{{ route('account.dashboard') }}" class="logout-btn-premium"><i data-lucide="arrow-left"></i> Back to Dashboard</a>
        </div>
    </div>

    {{-- Main Grid Area --}}
    <div class="dashboard-main-grid">
        {{-- Sidebar --}}
        <aside class="dashboard-sidebar">
            <div class="sidebar-user-card">
                <div class="user-avatar-premium">
                    {{ substr(Auth::user()->name, 0, 1) }}
                </div>
                <h3>{{ Auth::user()->name }}</h3>
                <p>{{ Auth::user()->email }}</p>
                
                {{-- Integrated Stats --}}
                <div class="sidebar-stats-premium">
                    <div class="stat-mini">
                        <span class="stat-value-mini">{{ $orders->total() }}</span>
                        <span class="stat-label-mini">Orders</span>
                    </div>
                    <div class="stat-divider"></div>
                    <div class="stat-mini">
                        <span class="stat-value-mini">{{ Auth::user()->addresses()->count() }}</span>
                        <span class="stat-label-mini">Locales</span>
                    </div>
                </div>

                <div class="member-since">Joined {{ Auth::user()->created_at->format('M Y') }}</div>
            </div>

            <nav class="sidebar-nav-premium">
                <a href="{{ route('account.dashboard') }}" class="{{ request()->routeIs('account.dashboard') ? 'active' : '' }}"><i data-lucide="user"></i> Profile Hub</a>
                <a href="{{ route('account.orders') }}" class="{{ request()->routeIs('account.orders') ? 'active' : '' }}"><i data-lucide="shopping-bag"></i> Order History</a>
                <a href="{{ route('account.addresses') }}"><i data-lucide="map-pin"></i> Saved Addresses</a>
                <a href="{{ route('account.profile') }}" class="{{ request()->routeIs('account.profile') ? 'active' : '' }}"><i data-lucide="settings"></i> Account Settings</a>
            </nav>
        </aside>

        {{-- Mobile Nav --}}
        <nav class="mobile-nav-premium">
            <a href="{{ route('account.dashboard') }}" class="{{ request()->routeIs('account.dashboard') ? 'active' : '' }}"><i data-lucide="user"></i></a>
            <a href="{{ route('account.orders') }}" class="{{ request()->routeIs('account.orders') ? 'active' : '' }}"><i data-lucide="shopping-bag"></i></a>
            <a href="{{ route('account.addresses') }}"><i data-lucide="map-pin"></i></a>
            <a href="{{ route('account.profile') }}" class="{{ request()->routeIs('account.profile') ? 'active' : '' }}"><i data-lucide="settings"></i></a>
        </nav>

        {{-- Main Content --}}
        <div class="dashboard-content-area">
            <section class="content-card-premium">
                <div class="card-header-premium">
                    <h2>Wardrobe History</h2>
                    <span class="badge-count">{{ $orders->total() }} Total</span>
                </div>
                
                @if($orders->isEmpty())
                    <div class="empty-state-premium">
                        <div class="empty-icon"><i data-lucide="shopping-cart"></i></div>
                        <p>No orders found yet. Time for a new addition?</p>
                        <a href="{{ route('shop') }}" class="btn-premium-gold">Explore Collection</a>
                    </div>
                @else
                    <div class="orders-list-premium">
                        @foreach($orders as $order)
                            <div class="order-item-premium">
                                <div class="order-main-info">
                                    <div class="order-id">
                                        <span class="label">ID</span>
                                        <span class="value">{{ $order->order_number }}</span>
                                    </div>
                                    <div class="order-date">
                                        <i data-lucide="calendar"></i> {{ $order->created_at->format('M d, Y') }}
                                    </div>
                                </div>
                                <div class="order-status-price">
                                    <div class="status-badge status-{{ strtolower($order->status) }}">{{ ucfirst($order->status) }}</div>
                                    <div class="price">₹{{ number_format($order->total) }}</div>
                                </div>
                                <div class="order-action">
                                    <a href="{{ route('order.show', $order->order_number) }}" class="btn-view-order">Details <i data-lucide="chevron-right"></i></a>
                                </div>
                            </div>
                        @endforeach
                    </div>
                    
                    <div class="pagination-premium">
                        {{ $orders->links() }}
                    </div>
                @endif
            </section>
        </div>
    </div>
</div>

{{-- Reuse styles from dashboard or import them --}}
<style>
    /* Same root variables and shared styles from dashboard-premium... I'll include the essential ones here */
    :root {
        --premium-bg: #FEFEE3;
        --premium-card: #ffffff;
        --premium-accent: #C5A059;
        --premium-text: #1a1a1a;
        --premium-text-light: #666666;
        --premium-border: rgba(197, 160, 89, 0.2);
        --premium-shadow: 0 10px 30px rgba(0,0,0,0.03);
    }

    body { background-color: var(--premium-bg); }

    .dashboard-wrapper {
        padding: calc(var(--header-height, 90px) + 3rem) 2rem 5rem;
        max-width: 1200px;
        margin: 0 auto;
        animation: fadeInUp 0.8s ease-out;
    }

    .dashboard-header-premium {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        margin-bottom: 4rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid var(--premium-border);
    }
    .dashboard-header-premium h1 { font-size: 3rem; font-weight: 800; color: var(--premium-text); letter-spacing: -2px; margin-bottom: 0.5rem; }
    .dashboard-header-premium p { color: var(--premium-text-light); font-size: 1.2rem; opacity: 0.8; }
    .header-actions { margin-top: 1.5rem; }
    .logout-btn-premium { background: none; border: 1.5px solid var(--premium-border); padding: 8px 24px; border-radius: 30px; color: var(--premium-text-light); font-weight: 600; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; gap: 10px; font-size: 0.9rem; text-decoration: none; }
    .logout-btn-premium:hover { border-color: var(--premium-accent); color: var(--premium-accent); transform: translateY(-2px); }

    .dashboard-main-grid { display: grid; grid-template-columns: 280px 1fr; gap: 3rem; }
    .dashboard-sidebar { position: sticky; top: calc(var(--header-height, 90px) + 2rem); }
    .sidebar-user-card { background: var(--premium-card); padding: 2.5rem 1.5rem; border-radius: 20px; box-shadow: var(--premium-shadow); text-align: center; margin-bottom: 1.5rem; border: 1px solid var(--premium-border); }
    .user-avatar-premium { width: 70px; height: 70px; background: linear-gradient(135deg, var(--premium-accent), #e2c88f); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; font-size: 1.75rem; font-weight: 700; box-shadow: 0 8px 20px rgba(197, 160, 89, 0.3); }
    .sidebar-user-card h3 { font-size: 1.2rem; font-weight: 700; margin-bottom: 0.25rem; }
    .sidebar-user-card p { font-size: 0.85rem; color: var(--premium-text-light); margin-bottom: 1rem; overflow: hidden; text-overflow: ellipsis; }

    .sidebar-stats-premium {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1.25rem;
        margin: 1.5rem 0;
        padding: 1.25rem 0;
        border-top: 1px solid var(--premium-border);
        border-bottom: 1px solid var(--premium-border);
    }
    .stat-mini { display: flex; flex-direction: column; align-items: center; }
    .stat-value-mini { font-size: 1.25rem; font-weight: 700; color: var(--premium-accent); }
    .stat-label-mini { font-size: 0.7rem; color: var(--premium-text-light); text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; margin-top: 2px; }
    .stat-divider { width: 1px; height: 30px; background: var(--premium-border); }
    .member-since { font-size: 0.75rem; color: var(--premium-accent); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.8; }

    .sidebar-nav-premium { display: flex; flex-direction: column; gap: 0.5rem; }
    .sidebar-nav-premium a { padding: 12px 20px; border-radius: 12px; text-decoration: none; color: var(--premium-text-light); font-weight: 600; display: flex; align-items: center; gap: 12px; transition: all 0.3s ease; }
    .sidebar-nav-premium a:hover, .sidebar-nav-premium a.active { background: var(--premium-card); color: var(--premium-accent); box-shadow: 2px 5px 15px rgba(0,0,0,0.03); }

    .content-card-premium { background: var(--premium-card); border-radius: 24px; padding: 3rem; box-shadow: var(--premium-shadow); margin-bottom: 2.5rem; border: 1px solid var(--premium-border); position: relative; overflow: hidden; }
    .card-header-premium { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; }
    .card-header-premium h2 { font-size: 1.75rem; font-weight: 700; color: var(--premium-text); letter-spacing: -0.5px; }
    .badge-count { background: rgba(197, 160, 89, 0.1); color: var(--premium-accent); padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 700; }

    .order-item-premium { display: grid; grid-template-columns: 2fr 1.5fr 1fr; align-items: center; padding: 1.5rem 0; border-bottom: 1px solid var(--premium-border); transition: transform 0.3s; }
    .order-item-premium:last-child { border-bottom: none; }
    .order-id .label { display: block; font-size: 0.7rem; color: var(--premium-text-light); font-weight: 700; text-transform: uppercase; margin-bottom: 2px; }
    .order-id .value { font-family: monospace; font-size: 1.1rem; font-weight: 700; color: var(--premium-accent); }
    .order-date { font-size: 0.9rem; color: var(--premium-text-light); margin-top: 4px; display: flex; align-items: center; gap: 6px; }
    .status-badge { display: inline-block; padding: 4px 14px; border-radius: 30px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; margin-bottom: 6px; }
    .status-confirmed { background: #e6fffa; color: #319795; }
    .price { font-size: 1.25rem; font-weight: 700; color: var(--premium-text); }
    .btn-view-order { color: var(--premium-text-light); text-decoration: none; font-weight: 700; font-size: 0.9rem; display: flex; align-items: center; gap: 4px; transition: color 0.3s; justify-content: flex-end; }
    .btn-view-order:hover { color: var(--premium-accent); }

    .pagination-premium { margin-top: 2rem; display: flex; justify-content: center; }

    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    /* Mobile Nav */
    .mobile-nav-premium { display: none; }

    @media (max-width: 992px) {
        .dashboard-wrapper { padding: calc(var(--header-height, 90px) + 1.5rem) 1rem 3rem; }
        .dashboard-header-premium h1 { font-size: 2.2rem; }
        .dashboard-header-premium p { font-size: 1rem; }
        .sidebar-user-card { margin-bottom: 0; border: none; background: none; box-shadow: none; padding: 1rem; }
        .dashboard-main-grid { grid-template-columns: 1fr; gap: 2rem; }
        .dashboard-sidebar { display: none; }
        
        .mobile-nav-premium { 
            display: flex; 
            justify-content: space-around; 
            background: var(--premium-card); 
            padding: 12px; 
            border-radius: 12px; 
            border: 1px solid var(--premium-border);
            margin-bottom: 2rem;
            position: sticky;
            top: calc(var(--header-height, 90px) + 5px);
            z-index: 10;
        }
        .mobile-nav-premium a { color: var(--premium-text-light); text-decoration: none; padding: 8px; border-radius: 8px; }
        .mobile-nav-premium a.active { color: var(--premium-accent); background: rgba(197, 160, 89, 0.05); }

        .content-card-premium { padding: 2rem 1.25rem; border-radius: 16px; }
        .card-header-premium h2 { font-size: 1.4rem; }
        .order-item-premium { 
            grid-template-columns: 1fr; 
            gap: 1.25rem; 
            padding: 2rem 0;
            text-align: left;
        }
        .order-main-info { display: flex; justify-content: space-between; align-items: flex-start; }
        .order-status-price { display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--premium-border); padding-top: 1rem; }
        .order-action { justify-content: flex-start; border-top: 1px dashed var(--premium-border); padding-top: 1rem; }
        .price { margin: 0; }
    }
</style>
@endsection

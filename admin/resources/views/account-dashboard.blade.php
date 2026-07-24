@extends('layouts.app')
@section('title', 'My Account | Aakrithi')

@section('content')
<div class="dashboard-wrapper">
    {{-- Dashboard Header --}}
    <div class="dashboard-header-premium">
        <div class="header-main">
            <h1>My Account</h1>
            <p>Welcome back, {{ explode(' ', Auth::user()->name)[0] }} — curated style awaits.</p>
        </div>
        <div class="header-actions">
            <form method="POST" action="{{ route('logout') }}">
                @csrf
                <button type="submit" class="logout-btn-premium"><i data-lucide="log-out"></i> Logout</button>
            </form>
        </div>
    </div>

    {{-- Main Grid Area --}}
    <div id="profile-top" class="dashboard-main-grid">
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
                        <span class="stat-value-mini">{{ $orderCount }}</span>
                        <span class="stat-label-mini">Orders</span>
                    </div>
                    <div class="stat-divider"></div>
                    <div class="stat-mini">
                        <span class="stat-value-mini">{{ $addressCount }}</span>
                        <span class="stat-label-mini">Locales</span>
                    </div>
                </div>

            </div>
<style>.member-since { display: none !important; }</style>
@php /* User requested removal of member status */ @endphp

            <nav class="sidebar-nav-premium">
                <a href="{{ route('account.dashboard') }}" class="{{ request()->routeIs('account.dashboard') ? 'active' : '' }}"><i data-lucide="user"></i> Profile Hub</a>
                <a href="{{ route('account.orders') }}"><i data-lucide="shopping-bag"></i> Order History</a>
                <a href="{{ route('account.addresses') }}"><i data-lucide="map-pin"></i> Saved Addresses</a>
                <a href="{{ route('account.profile') }}" class="{{ request()->routeIs('account.profile') ? 'active' : '' }}"><i data-lucide="settings"></i> Account Settings</a>
            </nav>
        </aside>

        {{-- Mobile Navigation (Visible only on mobile) --}}
        <nav class="mobile-nav-premium">
            <a href="{{ route('account.dashboard') }}" class="{{ request()->routeIs('account.dashboard') ? 'active' : '' }}"><i data-lucide="user"></i></a>
            <a href="{{ route('account.orders') }}"><i data-lucide="shopping-bag"></i></a>
            <a href="{{ route('account.addresses') }}"><i data-lucide="map-pin"></i></a>
            <a href="{{ route('account.profile') }}" class="{{ request()->routeIs('account.profile') ? 'active' : '' }}"><i data-lucide="settings"></i></a>
        </nav>

        {{-- Main Content: Unified Profile Hub --}}
        <div class="dashboard-content-area">
            <section class="content-card-premium">
                <div class="hub-hero">
                    <div class="hub-icon"><i data-lucide="user"></i></div>
                    <h2>Aakrithi Personal Hub</h2>
                    <p>Your curated account oversight, tailored to your distinct style.</p>
                </div>
                
                <div class="hub-grid">
                    <div class="hub-box" onclick="window.location='{{ route('account.orders') }}'">
                        <i data-lucide="package"></i>
                        <h4>Wardrobe Timeline</h4>
                        <span>{{ $orderCount }} Orders Processed</span>
                    </div>
                    <div class="hub-box" onclick="window.location='{{ route('account.addresses') }}'">
                        <i data-lucide="map-pin"></i>
                        <h4>Managed Locales</h4>
                        <span>{{ $addressCount }} Saved Points</span>
                    </div>
                </div>

@php /* Removed Member Perks as requested: it doesnt have memberships */ @endphp
            </section>
        </div>
    </div>
</div>

<style>
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

    /* Header Styling (Centered for better balance) */
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
    .logout-btn-premium { background: none; border: 1.5px solid var(--premium-border); padding: 8px 24px; border-radius: 30px; color: var(--premium-text-light); font-weight: 600; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; gap: 10px; font-size: 0.9rem; }
    .logout-btn-premium:hover { border-color: var(--premium-accent); color: var(--premium-accent); transform: translateY(-2px); }

    /* Sidebar Integrated Stats */
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

    /* Hub Styles */
    .hub-hero { text-align: center; margin-bottom: 3rem; }
    .hub-icon { font-size: 2.5rem; color: var(--premium-accent); margin-bottom: 1rem; }
    .hub-hero h2 { font-size: 2rem; font-weight: 800; color: var(--premium-text); margin-bottom: 0.5rem; }
    .hub-hero p { color: var(--premium-text-light); font-size: 1.1rem; }

    .hub-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 3rem; }
    .hub-box { background: #fff; border: 1.5px solid var(--premium-border); padding: 2.5rem; border-radius: 20px; text-align: center; cursor: pointer; transition: all 0.3s ease; }
    .hub-box:hover { transform: translateY(-5px); border-color: var(--premium-accent); box-shadow: 0 15px 35px rgba(197, 160, 89, 0.1); }
    .hub-box i { font-size: 2rem; color: var(--premium-accent); margin-bottom: 1rem; display: block; }
    .hub-box h4 { font-size: 1.2rem; font-weight: 700; margin-bottom: 0.5rem; }
    .hub-box span { font-size: 0.9rem; color: var(--premium-text-light); font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }

    .member-perks-premium { padding-top: 2rem; border-top: 1px solid var(--premium-border); }
    .member-perks-premium h3 { font-size: 1.2rem; font-weight: 700; margin-bottom: 1.5rem; color: var(--premium-text); }
    .member-perks-premium ul { list-style: none; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .member-perks-premium li { display: flex; align-items: center; gap: 10px; font-size: 0.95rem; color: var(--premium-text-light); font-weight: 600; }
    .member-perks-premium li i { color: var(--premium-accent); width: 18px; height: 18px; }

    /* Main Grid Layout */
    .dashboard-main-grid {
        display: grid;
        grid-template-columns: 280px 1fr;
        gap: 3rem;
    }

    /* Sidebar Styling */
    .dashboard-sidebar { position: sticky; top: calc(var(--header-height, 90px) + 2rem); }
    .sidebar-user-card { background: var(--premium-card); padding: 2.5rem 1.5rem; border-radius: 20px; box-shadow: var(--premium-shadow); text-align: center; margin-bottom: 1.5rem; border: 1px solid var(--premium-border); }
    .user-avatar-premium { width: 70px; height: 70px; background: linear-gradient(135deg, var(--premium-accent), #e2c88f); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; font-size: 1.75rem; font-weight: 700; box-shadow: 0 8px 20px rgba(197, 160, 89, 0.3); }
    .sidebar-user-card h3 { font-size: 1.2rem; font-weight: 700; margin-bottom: 0.25rem; }
    .sidebar-user-card p { font-size: 0.85rem; color: var(--premium-text-light); margin-bottom: 1rem; overflow: hidden; text-overflow: ellipsis; }
    .member-since { font-size: 0.75rem; color: var(--premium-accent); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.8; }

    .sidebar-nav-premium { display: flex; flex-direction: column; gap: 0.5rem; }
    .sidebar-nav-premium a { padding: 12px 20px; border-radius: 12px; text-decoration: none; color: var(--premium-text-light); font-weight: 600; display: flex; align-items: center; gap: 12px; transition: all 0.3s ease; }
    .sidebar-nav-premium a i { width: 18px; height: 18px; opacity: 0.7; }
    .sidebar-nav-premium a:hover, .sidebar-nav-premium a.active { background: var(--premium-card); color: var(--premium-accent); box-shadow: 2px 5px 15px rgba(0,0,0,0.03); }
    .sidebar-nav-premium a.active i { opacity: 1; }

    /* Content Area Styling */
    .content-card-premium { background: var(--premium-card); border-radius: 24px; padding: 3rem; box-shadow: var(--premium-shadow); margin-bottom: 2.5rem; border: 1px solid var(--premium-border); position: relative; overflow: hidden; }
    .card-header-premium { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; }
    .card-header-premium h2 { font-size: 1.75rem; font-weight: 700; color: var(--premium-text); letter-spacing: -0.5px; }
    .badge-count { background: rgba(197, 160, 89, 0.1); color: var(--premium-accent); padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 700; }

    /* Orders List */
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

    /* Address Cards */
    .address-grid-premium { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
    .address-premium-card { background: #fff; border: 1.5px solid var(--premium-border); border-radius: 16px; padding: 2rem; position: relative; transition: all 0.3s ease; }
    .address-premium-card:hover { border-color: var(--premium-accent); transform: scale(1.02); box-shadow: 0 15px 35px rgba(197, 160, 89, 0.08); }
    .address-premium-card.is-default { border-color: var(--premium-accent); background: rgba(197, 160, 89, 0.02); }
    .default-ribbon { position: absolute; top: 12px; right: 12px; background: var(--premium-accent); color: #fff; font-size: 0.65rem; padding: 4px 10px; border-radius: 8px; font-weight: 700; text-transform: uppercase; }
    .address-premium-card h3 { font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; letter-spacing: -0.3px; }
    .address-body p { margin-bottom: 0.5rem; font-size: 0.95rem; line-height: 1.6; }
    .address-body .phone { font-weight: 600; display: flex; align-items: center; gap: 8px; color: var(--premium-text-light); }
    .address-footer-premium { margin-top: 1.5rem; padding-top: 1rem; border-top: 1px dashed var(--premium-border); display: flex; align-items: center; gap: 1rem; }
    .btn-text-gold { background: none; border: none; color: var(--premium-accent); font-weight: 700; font-size: 0.85rem; cursor: pointer; padding: 0; }
    .btn-text-danger { background: none; border: none; color: #ff6b6b; font-size: 0.95rem; cursor: pointer; padding: 0; opacity: 0.6; transition: opacity 0.3s; }
    .btn-text-danger:hover { opacity: 1; }

    /* Form Styling */
    .new-address-form-wrapper { margin-top: 4rem; padding-top: 3rem; border-top: 1px solid var(--premium-border); }
    .form-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 2rem; letter-spacing: -0.5px; }
    .premium-form-grid { display: flex; flex-direction: column; gap: 1.5rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .triplet { grid-template-columns: 1fr 1fr 1fr; }
    .input-group-premium { display: flex; flex-direction: column; gap: 8px; }
    .input-group-premium label { font-size: 0.85rem; font-weight: 700; color: var(--premium-text-light); text-transform: uppercase; letter-spacing: 0.5px; }
    .input-group-premium input { background: #fff; border: 1.5px solid var(--premium-border); padding: 14px 18px; border-radius: 12px; font-size: 1rem; font-family: var(--font-family); transition: all 0.3s; }
    .input-group-premium input:focus { outline: none; border-color: var(--premium-accent); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(197, 160, 89, 0.1); }
    .btn-submit-premium { background: var(--premium-accent); color: #fff; border: none; padding: 18px; border-radius: 12px; font-weight: 700; font-size: 1.1rem; cursor: pointer; margin-top: 1rem; transition: all 0.4s; box-shadow: 0 10px 25px rgba(197, 160, 89, 0.2); }
    .btn-submit-premium:hover { transform: translateY(-3px); box-shadow: 0 15px 35px rgba(197, 160, 89, 0.3); background: #b08d4a; }

    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    /* Mobile Nav */
    .mobile-nav-premium { display: none; }

    @media (max-width: 992px) {
        .dashboard-wrapper { padding: calc(var(--header-height, 90px) + 1.5rem) 1rem 3rem; }
        .dashboard-header-premium h1 { font-size: 2.2rem; }
        .dashboard-header-premium p { font-size: 1rem; }
        
        .sidebar-user-card { margin-bottom: 0; border: none; background: none; box-shadow: none; padding: 1rem; }
        
        .quick-stats-grid { justify-content: center; }
        .stat-card-premium { min-width: 200px; padding: 1rem 1.5rem; justify-content: center; }

        .dashboard-main-grid { grid-template-columns: 1fr; gap: 2rem; }
        .dashboard-sidebar { display: none; }
        
        /* Show mobile nav */
        .mobile-nav-premium { 
            display: flex; 
            justify-content: space-around; 
            background: var(--premium-card); 
            padding: 12px; 
            border-radius: 12px; 
            box-shadow: var(--premium-shadow);
            border: 1px solid var(--premium-border);
            margin-bottom: 2rem;
            position: sticky;
            top: calc(var(--header-height, 90px) + 5px);
            z-index: 10;
        }
        .mobile-nav-premium a { color: var(--premium-text-light); text-decoration: none; padding: 8px; border-radius: 8px; }
        .mobile-nav-premium a.active { color: var(--premium-accent); background: rgba(197, 160, 89, 0.05); }

        .content-card-premium { padding: 2rem 1.25rem; border-radius: 16px; margin-top: 1rem; }
        .hub-hero h2 { font-size: 1.6rem; }
        .hub-hero p { font-size: 0.95rem; }
        .card-header-premium h2 { font-size: 1.4rem; }
        .hub-grid { grid-template-columns: 1fr; gap: 1rem; }
        .hub-box { padding: 1.75rem 1.25rem; }
        .order-item-premium { grid-template-columns: 1fr; gap: 1rem; text-align: center; }
        .order-action { justify-content: center; }
        .price { margin: 8px 0; }
        
        .form-row, .triplet { grid-template-columns: 1fr; }
    }
</style>
@endsection

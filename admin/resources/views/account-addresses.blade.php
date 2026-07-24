@extends('layouts.app')
@section('title', 'Saved Addresses | Aakrithi')

@section('content')
<div class="dashboard-wrapper">
    {{-- Dashboard Header --}}
    <div class="dashboard-header-premium">
        <div class="header-main">
            <h1>Saved Addresses</h1>
            <p>Your managed delivery locales.</p>
        </div>
        <div class="header-actions">
            <a href="{{ route('account.dashboard') }}" class="logout-btn-premium"><i data-lucide="arrow-left"></i> Back to Hub</a>
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
                
                <div class="sidebar-stats-premium">
                    <div class="stat-mini">
                        <span class="stat-value-mini">{{ $orderCount }}</span>
                        <span class="stat-label-mini">Orders</span>
                    </div>
                    <div class="stat-divider"></div>
                    <div class="stat-mini">
                        <span class="stat-value-mini">{{ $addresses->count() }}</span>
                        <span class="stat-label-mini">Locales</span>
                    </div>
                </div>

                <div class="member-since">Joined {{ Auth::user()->created_at->format('M Y') }}</div>
            </div>

            <nav class="sidebar-nav-premium">
                <a href="{{ route('account.dashboard') }}" class="{{ request()->routeIs('account.dashboard') ? 'active' : '' }}"><i data-lucide="user"></i> Profile Hub</a>
                <a href="{{ route('account.orders') }}"><i data-lucide="shopping-bag"></i> Order History</a>
                <a href="{{ route('account.addresses') }}" class="{{ request()->routeIs('account.addresses') ? 'active' : '' }}"><i data-lucide="map-pin"></i> Saved Addresses</a>
                <a href="{{ route('account.profile') }}" class="{{ request()->routeIs('account.profile') ? 'active' : '' }}"><i data-lucide="settings"></i> Account Settings</a>
            </nav>
        </aside>

        {{-- Mobile Nav --}}
        <nav class="mobile-nav-premium">
            <a href="{{ route('account.dashboard') }}" class="{{ request()->routeIs('account.dashboard') ? 'active' : '' }}"><i data-lucide="user"></i></a>
            <a href="{{ route('account.orders') }}"><i data-lucide="shopping-bag"></i></a>
            <a href="{{ route('account.addresses') }}" class="{{ request()->routeIs('account.addresses') ? 'active' : '' }}"><i data-lucide="map-pin"></i></a>
            <a href="{{ route('account.profile') }}" class="{{ request()->routeIs('account.profile') ? 'active' : '' }}"><i data-lucide="settings"></i></a>
        </nav>

        {{-- Main Content --}}
        <div class="dashboard-content-area">
            {{-- Saved Addresses Card --}}
            <section id="addresses-section" class="content-card-premium">
                <div class="card-header-premium">
                    <h2>Managed Delivery Points</h2>
                    <button class="btn-add-address" onclick="document.getElementById('new-address-form').scrollIntoView({behavior:'smooth'})">+ Add New Locale</button>
                </div>
                
                <div class="address-grid-premium">
                    @forelse($addresses as $address)
                        <div class="address-premium-card {{ $address->is_default ? 'is-default' : '' }}">
                            @if($address->is_default)
                                <div class="default-ribbon">Primary</div>
                            @endif
                            <div class="address-card-header">
                                <h3>{{ $address->name }}</h3>
                                <div class="address-icons">
                                    <i data-lucide="home"></i>
                                </div>
                            </div>
                            <div class="address-body">
                                <p class="phone"><i data-lucide="phone" style="width:14px; height:14px;"></i> {{ $address->phone }}</p>
                                <p class="location">{{ $address->address }}</p>
                                <p class="city-state">{{ $address->city }}, {{ $address->state }} — {{ $address->pincode }}</p>
                            </div>
                            <div class="address-footer-premium">
                                @if(!$address->is_default)
                                <form method="POST" action="{{ route('address.default', $address->id) }}">
                                    @csrf
                                    <button type="submit" class="btn-text-gold">Set Primary</button>
                                </form>
                                @endif
                                <form method="POST" action="{{ route('address.destroy', $address->id) }}" class="ms-auto">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn-text-danger"><i data-lucide="trash-2"></i></button>
                                </form>
                            </div>
                        </div>
                    @empty
                        <div class="empty-state-premium" style="grid-column: 1 / -1;">
                            <div class="empty-icon"><i data-lucide="map-pin"></i></div>
                            <p>No addresses saved yet. Add your first delivery point below.</p>
                        </div>
                    @endforelse
                </div>

                {{-- Add New Address Form --}}
                <div id="new-address-form" class="new-address-form-wrapper">
                    <h3 class="form-title">New Entry</h3>
                    <form method="POST" action="{{ route('address.store') }}" class="premium-form-grid">
                        @csrf
                        <div class="form-row">
                            <div class="input-group-premium">
                                <label>Recipient Name</label>
                                <input type="text" name="name" placeholder="Full Name" required>
                            </div>
                            <div class="input-group-premium">
                                <label>Phone Contact</label>
                                <input type="text" name="phone" placeholder="+91" required>
                            </div>
                        </div>
                        <div class="input-group-premium full">
                            <label>Street & Building</label>
                            <input type="text" name="address" placeholder="Address Details" required>
                        </div>
                        <div class="form-row triplet">
                            <div class="input-group-premium">
                                <label>City</label>
                                <input type="text" name="city" required>
                            </div>
                            <div class="input-group-premium">
                                <label>State</label>
                                <select name="state" required>
                                    <option value="" disabled selected>Select State</option>
                                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                                    <option value="Assam">Assam</option>
                                    <option value="Bihar">Bihar</option>
                                    <option value="Chhattisgarh">Chhattisgarh</option>
                                    <option value="Goa">Goa</option>
                                    <option value="Gujarat">Gujarat</option>
                                    <option value="Haryana">Haryana</option>
                                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                                    <option value="Jharkhand">Jharkhand</option>
                                    <option value="Karnataka">Karnataka</option>
                                    <option value="Kerala">Kerala</option>
                                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                                    <option value="Maharashtra">Maharashtra</option>
                                    <option value="Manipur">Manipur</option>
                                    <option value="Meghalaya">Meghalaya</option>
                                    <option value="Mizoram">Mizoram</option>
                                    <option value="Nagaland">Nagaland</option>
                                    <option value="Odisha">Odisha</option>
                                    <option value="Punjab">Punjab</option>
                                    <option value="Rajasthan">Rajasthan</option>
                                    <option value="Sikkim">Sikkim</option>
                                    <option value="Tamil Nadu">Tamil Nadu</option>
                                    <option value="Telangana">Telangana</option>
                                    <option value="Tripura">Tripura</option>
                                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                                    <option value="Uttarakhand">Uttarakhand</option>
                                    <option value="West Bengal">West Bengal</option>
                                    <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                                    <option value="Chandigarh">Chandigarh</option>
                                    <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
                                    <option value="Delhi">Delhi</option>
                                    <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                                    <option value="Ladakh">Ladakh</option>
                                    <option value="Lakshadweep">Lakshadweep</option>
                                    <option value="Puducherry">Puducherry</option>
                                </select>
                            </div>
                            <div class="input-group-premium">
                                <label>Pincode</label>
                                <input type="text" name="pincode" required>
                            </div>
                        </div>
                        <div class="checkbox-group-premium">
                            <input type="checkbox" name="is_default" id="is_default" value="1">
                            <label for="is_default">Set as primary delivery address</label>
                        </div>
                        <button class="btn-submit-premium" type="submit">Establish Locale</button>
                    </form>
                </div>
            </section>
        </div>
    </div>
</div>

<style>
    /* Premium Root Variables */
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
    .sidebar-nav-premium a.active { color: var(--premium-accent); }

    .content-card-premium { background: var(--premium-card); border-radius: 24px; padding: 3rem; box-shadow: var(--premium-shadow); margin-bottom: 2.5rem; border: 1px solid var(--premium-border); position: relative; overflow: hidden; }
    .card-header-premium { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; }
    .card-header-premium h2 { font-size: 1.75rem; font-weight: 700; color: var(--premium-text); letter-spacing: -0.5px; }

    /* Address Cards */
    .address-grid-premium { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
    .address-premium-card { background: #fff; border: 1.5px solid var(--premium-border); border-radius: 16px; padding: 2rem; position: relative; transition: all 0.3s ease; }
    .address-premium-card:hover { border-color: var(--premium-accent); transform: scale(1.02); box-shadow: 0 15px 35px rgba(197, 160, 89, 0.08); }
    .address-premium-card.is-default { border-color: var(--premium-accent); background: rgba(197, 160, 89, 0.01); }
    .btn-add-address { background: none; border: 1.5px solid var(--premium-accent); color: var(--premium-accent); padding: 8px 18px; border-radius: 30px; font-weight: 700; cursor: pointer; transition: all 0.3s; font-size: 0.85rem; }
    .btn-add-address:hover { background: var(--premium-accent); color: #fff; }

    .default-ribbon { position: absolute; top: 12px; right: 12px; background: var(--premium-accent); color: #fff; font-size: 0.65rem; padding: 4px 10px; border-radius: 8px; font-weight: 700; text-transform: uppercase; }
    .address-premium-card h3 { font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; letter-spacing: -0.3px; }
    .address-body p { margin-bottom: 0.5rem; font-size: 0.95rem; line-height: 1.6; color: var(--premium-text-light); }
    .address-body .phone { font-weight: 600; display: flex; align-items: center; gap: 8px; color: var(--premium-text); }
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
    .input-group-premium input, .input-group-premium select { background: #fff; border: 1.5px solid var(--premium-border); padding: 14px 18px; border-radius: 12px; font-size: 1rem; transition: all 0.3s; width: 100%; }
    .input-group-premium input:focus, .input-group-premium select:focus { outline: none; border-color: var(--premium-accent); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(197, 160, 89, 0.1); }
    .btn-submit-premium { background: var(--premium-accent); color: #fff; border: none; padding: 18px; border-radius: 12px; font-weight: 700; font-size: 1.1rem; cursor: pointer; margin-top: 1rem; transition: all 0.4s; box-shadow: 0 10px 25px rgba(197, 160, 89, 0.2); }
    .btn-submit-premium:hover { transform: translateY(-3px); box-shadow: 0 15px 35px rgba(197, 160, 89, 0.3); background: #b08d4a; }

    .empty-state-premium { text-align: center; padding: 4rem 2rem; }
    .empty-icon { font-size: 3rem; color: var(--premium-border); margin-bottom: 1.5rem; }

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

        .content-card-premium { padding: 2rem 1.25rem; border-radius: 16px; margin-top: 1rem; }
        .card-header-premium h2 { font-size: 1.5rem; }
        .address-grid-premium { grid-template-columns: 1fr; gap: 1rem; }
        .address-premium-card { padding: 1.5rem 1.25rem; }
        .form-row, .triplet { grid-template-columns: 1fr; }
    }
</style>
@endsection

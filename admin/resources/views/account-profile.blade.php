@extends('layouts.app')
@section('title', 'Account Settings | Aakrithi')

@section('content')
<div class="dashboard-wrapper">
    <div class="dashboard-header-premium">
        <div class="header-main">
            <h1>Account Settings</h1>
            <p>Refine your personal profile and security preferences.</p>
        </div>
    </div>

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
                        <span class="stat-value-mini">{{ $addressCount }}</span>
                        <span class="stat-label-mini">Locales</span>
                    </div>
                </div>
            </div>

            <nav class="sidebar-nav-premium">
                <a href="{{ route('account.dashboard') }}"><i data-lucide="user"></i> Profile Hub</a>
                <a href="{{ route('account.orders') }}"><i data-lucide="shopping-bag"></i> Order History</a>
                <a href="{{ route('account.addresses') }}"><i data-lucide="map-pin"></i> Saved Addresses</a>
                <a href="{{ route('account.profile') }}" class="active"><i data-lucide="settings"></i> Account Settings</a>
            </nav>
        </aside>

        {{-- Mobile Nav --}}
        <nav class="mobile-nav-premium">
            <a href="{{ route('account.dashboard') }}"><i data-lucide="user"></i></a>
            <a href="{{ route('account.orders') }}"><i data-lucide="shopping-bag"></i></a>
            <a href="{{ route('account.addresses') }}"><i data-lucide="map-pin"></i></a>
            <a href="{{ route('account.profile') }}" class="active"><i data-lucide="settings"></i></a>
        </nav>

        <div class="dashboard-content-area">
            <section class="content-card-premium">
                @if(session('success'))
                    <div class="alert-success-premium fade-in">
                        <i data-lucide="check-circle"></i> {{ session('success') }}
                    </div>
                @endif

                <form method="POST" action="{{ route('account.profile.update') }}" class="premium-form">
                    @csrf
                    
                    <div class="form-section">
                        <h3 class="section-title"><i data-lucide="user"></i> Basic Information</h3>
                        <div class="input-grid">
                            <div class="input-group-premium">
                                <label for="name">Full Name</label>
                                <input type="text" name="name" id="name" value="{{ old('name', $user->name) }}" required>
                                @error('name') <span class="error-msg">{{ $message }}</span> @enderror
                            </div>
                            <div class="input-group-premium">
                                <label for="email">Email Address</label>
                                <input type="email" name="email" id="email" value="{{ old('email', $user->email) }}" required>
                                @error('email') <span class="error-msg">{{ $message }}</span> @enderror
                            </div>
                            <div class="input-group-premium">
                                <label for="shop_name">Shop Name</label>
                                <input type="text" name="shop_name" id="shop_name" value="{{ old('shop_name', $user->shop_name) }}" required>
                                @error('shop_name') <span class="error-msg">{{ $message }}</span> @enderror
                            </div>
                            <div class="input-group-premium">
                                <label for="phone">Contact Number</label>
                                <input type="tel" name="phone" id="phone" value="{{ old('phone', $user->phone) }}" required>
                                @error('phone') <span class="error-msg">{{ $message }}</span> @enderror
                            </div>
                            <div class="input-group-premium full">
                                <label for="address">Shop Address</label>
                                <input type="text" name="address" id="address" value="{{ old('address', $user->address) }}" required>
                                @error('address') <span class="error-msg">{{ $message }}</span> @enderror
                            </div>
                            <div class="input-group-premium">
                                <label for="gst_number">GST Number (Optional)</label>
                                <input type="text" name="gst_number" id="gst_number" value="{{ old('gst_number', $user->gst_number) }}">
                                @error('gst_number') <span class="error-msg">{{ $message }}</span> @enderror
                            </div>
                        </div>
                    </div>

                    <div class="form-section" style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--premium-border);">
                        <h3 class="section-title"><i data-lucide="lock"></i> Security Update</h3>
                        <p class="section-desc">Leave password fields blank if you don't wish to change it.</p>
                        
                        <div class="input-grid">
                            <div class="input-group-premium full">
                                <label for="current_password">Current Password</label>
                                <input type="password" name="current_password" id="current_password" placeholder="Confirm current password to change email or password">
                                @error('current_password') <span class="error-msg">{{ $message }}</span> @enderror
                            </div>
                            <div class="input-group-premium">
                                <label for="new_password">New Password</label>
                                <input type="password" name="new_password" id="new_password">
                                @error('new_password') <span class="error-msg">{{ $message }}</span> @enderror
                            </div>
                            <div class="input-group-premium">
                                <label for="new_password_confirmation">Confirm New Password</label>
                                <input type="password" name="new_password_confirmation" id="new_password_confirmation">
                            </div>
                        </div>
                    </div>

                    <div class="form-actions" style="margin-top: 3rem;">
                        <button type="submit" class="btn-submit-premium" style="width: 100%;">Save Profile Changes</button>
                    </div>
                </form>
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

    .section-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 10px; color: var(--premium-text); }
    .section-title i { color: var(--premium-accent); width: 20px; height: 20px; }
    .section-desc { font-size: 0.9rem; color: var(--premium-text-light); margin-bottom: 2rem; margin-top: -1rem; }

    .input-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .input-group-premium.full { grid-column: span 2; }
    
    .alert-success-premium { background: #f6ffed; border: 1px solid #b7eb8f; color: #389e0d; padding: 1rem 1.5rem; border-radius: 12px; margin-bottom: 2rem; display: flex; align-items: center; gap: 12px; font-weight: 600; }
    .error-msg { color: #ff4d4f; font-size: 0.8rem; font-weight: 600; margin-top: 5px; }

    .fade-in { animation: fadeIn 0.5s ease; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    /* Reuse from Dashboard */
    .dashboard-wrapper { padding: calc(var(--header-height, 90px) + 3rem) 2rem 5rem; max-width: 1200px; margin: 0 auto; }
    .dashboard-header-premium { display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: 4rem; padding-bottom: 2rem; border-bottom: 1px solid var(--premium-border); }
    .dashboard-header-premium h1 { font-size: 3rem; font-weight: 800; color: var(--premium-text); letter-spacing: -2px; margin-bottom: 0.5rem; }
    .dashboard-main-grid { display: grid; grid-template-columns: 280px 1fr; gap: 3rem; }
    .sidebar-user-card { background: var(--premium-card); padding: 2.5rem 1.5rem; border-radius: 20px; box-shadow: var(--premium-shadow); text-align: center; margin-bottom: 1.5rem; border: 1px solid var(--premium-border); }
    .user-avatar-premium { width: 70px; height: 70px; background: linear-gradient(135deg, var(--premium-accent), #e2c88f); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; font-size: 1.75rem; font-weight: 700; box-shadow: 0 8px 20px rgba(197, 160, 89, 0.3); }
    .stat-mini { display: flex; flex-direction: column; align-items: center; }
    .stat-value-mini { font-size: 1.25rem; font-weight: 700; color: var(--premium-accent); }
    .stat-label-mini { font-size: 0.7rem; color: var(--premium-text-light); text-transform: uppercase; font-weight: 700; }
    .sidebar-stats-premium { display: flex; justify-content: center; gap: 1.25rem; margin: 1.5rem 0; padding: 1.25rem 0; border-top: 1px solid var(--premium-border); border-bottom: 1px solid var(--premium-border); }
    .sidebar-nav-premium { display: flex; flex-direction: column; gap: 0.5rem; }
    .sidebar-nav-premium a { padding: 12px 20px; border-radius: 12px; text-decoration: none; color: var(--premium-text-light); font-weight: 600; display: flex; align-items: center; gap: 12px; transition: all 0.3s ease; }
    .sidebar-nav-premium a:hover, .sidebar-nav-premium a.active { background: var(--premium-card); color: var(--premium-accent); box-shadow: 2px 5px 15px rgba(0,0,0,0.03); }
    .content-card-premium { background: var(--premium-card); border-radius: 24px; padding: 3rem; box-shadow: var(--premium-shadow); margin-bottom: 2.5rem; border: 1px solid var(--premium-border); }
    .input-group-premium { display: flex; flex-direction: column; gap: 8px; margin-bottom: 1rem; }
    .input-group-premium label { font-size: 0.85rem; font-weight: 700; color: var(--premium-text-light); text-transform: uppercase; }
    .input-group-premium input { background: #fff; border: 1.5px solid var(--premium-border); padding: 14px 18px; border-radius: 12px; font-size: 1rem; font-family: inherit; transition: all 0.3s; }
    .input-group-premium input:focus { outline: none; border-color: var(--premium-accent); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(197, 160, 89, 0.1); }
    .btn-submit-premium { background: var(--premium-accent); color: #fff; border: none; padding: 18px; border-radius: 12px; font-weight: 700; font-size: 1.1rem; cursor: pointer; transition: all 0.4s; box-shadow: 0 10px 25px rgba(197, 160, 89, 0.2); }
    .btn-submit-premium:hover { transform: translateY(-3px); box-shadow: 0 15px 35px rgba(197, 160, 89, 0.3); background: #b08d4a; }

    @media (max-width: 992px) {
        .dashboard-main-grid { grid-template-columns: 1fr; }
        .dashboard-sidebar { display: none; }
        .mobile-nav-premium { display: flex; justify-content: space-around; background: #fff; padding: 12px; border-radius: 12px; border: 1px solid var(--premium-border); margin-bottom: 2rem; position: sticky; top: calc(var(--header-height, 90px) + 5px); z-index: 10; }
        .mobile-nav-premium a { color: var(--premium-text-light); padding: 8px; }
        .mobile-nav-premium a.active { color: var(--premium-accent); }
        .input-grid { grid-template-columns: 1fr; }
        .input-group-premium.full { grid-column: auto; }
        .dashboard-header-premium h1 { font-size: 2rem; }
    }
</style>
@endsection

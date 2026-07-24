<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard | Aakrithi</title>
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    <link rel="stylesheet" href="{{ asset('css/admin.css') }}">
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="admin-body">
    <div class="admin-layout">
        <aside class="admin-sidebar">
            <div class="admin-logo">AAKRITHI</div>
            <nav class="admin-nav">
                <a href="{{ route('admin.dashboard') }}" class="admin-nav-link {{ Route::is('admin.dashboard') ? 'active' : '' }}">
                    <i data-lucide="layout-dashboard"></i>
                    <span>Dashboard</span>
                </a>
                <a href="{{ route('admin.products.index') }}" class="admin-nav-link {{ Route::is('admin.products.*') ? 'active' : '' }}">
                    <i data-lucide="package"></i>
                    <span>Products</span>
                </a>
                <a href="{{ route('admin.orders.index') }}" class="admin-nav-link {{ Route::is('admin.orders.*') ? 'active' : '' }}">
                    <i data-lucide="shopping-bag"></i>
                    <span>Orders</span>
                </a>
                <a href="{{ route('home') }}" class="admin-nav-link">
                    <i data-lucide="external-link"></i>
                    <span>View Store</span>
                </a>
            </nav>
            <div style="padding: 1rem; border-top: 1px solid rgba(197, 160, 89, 0.1);">
                <form action="{{ route('logout') }}" method="POST">
                    @csrf
                    <button type="submit" class="admin-nav-link" style="width: 100%; border: none; background: none; cursor: pointer;">
                        <i data-lucide="log-out"></i>
                        <span>Logout</span>
                    </button>
                </form>
            </div>
        </aside>

        <main class="admin-main">
            <header class="admin-header">
                <h2 style="font-size: 1.1rem; font-weight: 600;">@yield('admin_title')</h2>
                <div class="admin-user-info" style="display: flex; align-items: center; gap: 0.75rem;">
                    <div style="text-align: right;">
                        <p style="font-size: 0.85rem; font-weight: 600;">{{ Auth::user()->name }}</p>
                        <p style="font-size: 0.7rem; opacity: 0.6;">System Administrator</p>
                    </div>
                    <div style="width: 35px; height: 35px; background: var(--color-accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #072821; font-weight: 700;">
                        {{ substr(Auth::user()->name, 0, 1) }}
                    </div>
                </div>
            </header>

            <div class="admin-content">
                @yield('admin_content')
            </div>
        </main>
    </div>

    <script>
        lucide.createIcons();
    </script>
</body>
</html>

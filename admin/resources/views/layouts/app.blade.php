<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet">
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- CRITICAL PRELOADS -->
    <link rel="preload" as="image" href="{{ asset('images/bg_emerald.png') }}">

    <!-- CRITICAL PRELOADER CSS (MUST BE FIRST) -->
    <style>
        #global-loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 999999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            visibility: visible;
            opacity: 1;
            transition: opacity 0.2s ease, visibility 0.2s ease;
            background: #072821; /* Fallback */
        }
        
        .loader-backdrop {
            position: absolute;
            inset: 0;
            background-color: #072821;
            z-index: 0;
        }

        .loader-texture {
            position: absolute;
            inset: 0;
            background-image: url("{{ asset('images/bg_emerald.png') }}");
            background-size: 600px;
            background-repeat: repeat;
            background-attachment: fixed;
            opacity: 0.2;
            z-index: 1;
        }

        .loader-brand, .loader-text {
            position: relative;
            z-index: 2;
        }


        
        .loader-brand {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 140px;
            height: 140px;
            margin-bottom: 2.5rem;
        }

        .loader-logo-text {
            font-family: 'Playfair Display', serif;
            font-size: 1.4rem;
            font-weight: 700;
            color: #FEFEE3;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            z-index: 2;
            animation: pulse-logo 2s ease-in-out infinite;
        }

        .loader-ring {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: 4px solid transparent;
            border-top-color: #C5A059;
            border-bottom-color: #C5A059;
            border-radius: 50%;
            animation: spin 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
            opacity: 0.8;
        }
        
        .loader-ring-inner {
            position: absolute;
            top: 12px;
            left: 12px;
            width: calc(100% - 24px);
            height: calc(100% - 24px);
            border: 2px solid transparent;
            border-left-color: rgba(120, 120, 120, 0.2);
            border-right-color: rgba(120, 120, 120, 0.2);
            border-radius: 50%;
            animation: spin-reverse 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
        }

        .loader-text {
            color: #C5A059;
            font-size: 0.85rem;
            letter-spacing: 5px;
            text-transform: uppercase;
            font-weight: 500;
            animation: pulse-logo 2s ease-in-out infinite;
            padding-left: 5px;
        }

        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes spin-reverse { 100% { transform: rotate(-360deg); } }
        @keyframes pulse-logo {
            0%, 100% { transform: scale(0.95); opacity: 0.7; }
            50% { transform: scale(1.05); opacity: 1; }
        }
    </style>

    <!-- SEO Meta Tags Component -->
    <x-seo-meta 
        :title="trim($__env->yieldContent('meta_title')) ?: setting('site_title', 'Aakrithi | Premium Women\'s Ethnic Wear & Designer Kids clothing Boutique')"
        :description="trim($__env->yieldContent('meta_description')) ?: setting('site_description', 'Discover curated artisanal clothing, handcrafted sarees, and trendy kids\' party wear at Aakrithi – your destination for timeless family fashion.')"
        :keywords="trim($__env->yieldContent('meta_keywords')) ?: setting('meta_keywords', 'Aakrithi, women\'s ethnic wear online, designer sarees, kids party wear, traditional kids sets, Indian boutique, designer kurtis, sustainable fashion')"
        :image="trim($__env->yieldContent('og_image')) ?: (setting('og_image') ?: asset('images/logo.png'))"
        :is-noindex="trim($__env->yieldContent('is_noindex')) == 'true'"
    />

    <!-- Structured Data -->
    <script type="application/ld+json">
    {
        "@@context": "https://schema.org",
        "@@graph": [
            {
                "@@type": "Organization",
                "name": "{{ setting('site_title', 'Aakrithi') }}",
                "url": "{{ url('/') }}",
                "logo": "{{ asset('images/logo.png') }}",
                "sameAs": [
                    "{{ setting('instagram_url', '#') }}",
                    "{{ setting('facebook_url', '#') }}",
                    "{{ setting('twitter_url', '#') }}"
                ]
            },
            {
                "@@type": "WebSite",
                "name": "{{ setting('site_title', 'Aakrithi') }}",
                "url": "{{ url('/') }}"
            }
        ]
    }
    </script>
    @yield('structured_data')

    @if(setting('google_site_verification'))
    <!-- Google Search Console -->
    <meta name="google-site-verification" content="{{ setting('google_site_verification') }}" />
    @endif

    @if(setting('google_analytics_id'))
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id={{ setting('google_analytics_id') }}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '{{ setting('google_analytics_id') }}');
    </script>
    @endif

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/app.css') }}?v=1.1.6">
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        /* CRITICAL MOBILE FIX (BYPASS CACHE) */
        @media (max-width: 992px) {
            /* Force navbar above backdrop when menu is open */
            #navbar:has(#navLinks.open),
            .navbar:has(.navbar-links.open) {
                z-index: 10000 !important;
            }

            #navLinks.open {
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important; /* CENTERED */
                background: var(--color-background) !important; /* Page BG */
                z-index: 10001 !important;
                position: fixed !important;
                visibility: visible !important;
                opacity: 1 !important;
                border-right: 1px solid #E0E0C0 !important;
                box-shadow: 15px 0 40px rgba(0,0,0,0.08) !important;
                padding-top: 2rem !important;
            }
            .mobile-nav-logo-item {
                display: block !important;
                margin-bottom: 2rem !important;
                text-align: center !important;
            }
            .mobile-nav-logo-item img {
                height: 60px !important; /* BIGGER LOGO */
                width: auto !important;
            }
            #navLinks:not(.open) .mobile-nav-logo-item {
                display: none !important;
            }
            #navLinks.open li a {
                text-align: center !important;
                align-items: center !important;
            }
            #navLinks.open, #navLinks.open * {
                color: var(--color-text) !important;
                opacity: 1 !important;
                text-decoration: none !important;
                -webkit-font-smoothing: antialiased;
                text-shadow: none !important;
                backdrop-filter: none !important;
            }
            .navbar-links.open .nav-brand {
                opacity: 0.7 !important;
                text-align: center !important;
            }
            .mobile-menu-backdrop {
                z-index: 9000 !important; /* Backdrop stays below navbar-open */
                backdrop-filter: none !important;
                -webkit-backdrop-filter: none !important;
                background: rgba(0,0,0,0.3) !important;
            }
        }
        
        /* Search Overlay - Premium Discovery Hub */
        .search-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: var(--color-background); opacity: 0.98; backdrop-filter: blur(40px);
            z-index: 10000; display: none; opacity: 0; transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            align-items: center; justify-content: center;
        }
        .search-overlay.active { display: flex; opacity: 1; }
        .search-container { width: 90%; max-width: 900px; position: relative; text-align: center; }
        .search-close { position: absolute; top: -100px; right: 0; color: var(--color-text); cursor: pointer; border: 1.5px solid var(--color-border); border-radius: 50%; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; transition: all 0.4s; }
        .search-close:hover { border-color: var(--color-accent); color: var(--color-accent); transform: rotate(90deg) scale(1.1); }
        
        .search-input-wrapper { display: flex; align-items: center; border-bottom: 2px solid #C5A059; padding: 1.5rem 0; gap: 2rem; transform: translateY(20px); opacity: 0; transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1); }
        .search-overlay.active .search-input-wrapper { transform: translateY(0); opacity: 1; }
        
        .search-icon-inside { color: var(--color-accent); width: 40px; height: 40px; }
        .search-input-wrapper input { background: transparent; border: none; font-size: clamp(1.5rem, 4vw, 3.5rem); font-family: var(--font-family); color: var(--color-text); width: 100%; outline: none; font-weight: 300; letter-spacing: -1px; }
        .search-input-wrapper input::placeholder { color: var(--color-text-light); }

        .discovery-hub { margin-top: 4rem; text-align: left; transform: translateY(30px); opacity: 0; transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.1s; }
        .search-overlay.active .discovery-hub { transform: translateY(0); opacity: 1; }
        
        .discovery-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 4px; color: var(--color-accent); font-weight: 700; margin-bottom: 2rem; display: block; }
        
        .discovery-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
        .discovery-item { background: rgba(0,0,0,0.2); border: 1px solid var(--color-border); padding: 2rem 1rem; border-radius: 16px; text-align: center; transition: all 0.4s; cursor: pointer; text-decoration: none; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
        .discovery-item:hover { background: var(--color-surface); border-color: var(--color-accent); transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3); }
        .discovery-item i { width: 32px; height: 32px; color: var(--color-accent); }
        .discovery-item span { font-weight: 600; font-size: 0.9rem; color: var(--color-text); }

        .search-hints-premium { margin-top: 2rem; display: flex; gap: 1.5rem; align-items: center; font-size: 0.95rem; color: var(--color-text-light); opacity: 0; transition: opacity 1s ease 0.3s; }
        .search-overlay.active .search-hints-premium { opacity: 0.7; }
        .search-hint-link { text-decoration: none; color: var(--color-accent); font-weight: 600; cursor: pointer; border-bottom: 1px solid transparent; transition: all 0.3s; }
        .search-hint-link:hover { border-bottom-color: var(--color-accent); padding-bottom: 2px; }

        @media (max-width: 768px) {
            .discovery-grid { grid-template-columns: 1fr 1fr; }
            .search-close { top: -80px; }
            .search-input-wrapper { gap: 1rem; }
            .discovery-hub { margin-top: 3rem; }
        }

        /* Global Preloader - Premium Design - Moved to head for critical path */
    </style>
    @yield('styles')
</head>
<body class="@yield('body_class')">
    <!-- Premium Global Preloader -->
    <div id="global-loader">
        <div class="loader-backdrop"></div>
        <div class="loader-texture"></div>
        <div class="loader-brand">
            <div class="loader-ring"></div>
            <div class="loader-ring-inner"></div>
            <div class="loader-logo-text">AAKRITHI</div>
        </div>
        <div class="loader-text" style="color: rgba(254, 254, 227, 0.4); font-size: 0.6rem; margin-top: -1rem;">EST. 2024</div>
    </div>

    {{-- Search Overlay - Discovery Hub --}}
    <div class="search-overlay" id="searchOverlay">
        <div class="search-container">
            <button class="search-close" id="searchCloseBtn"><i data-lucide="x"></i></button>
            
            <div class="search-input-wrapper">
                <i data-lucide="search" class="search-icon-inside"></i>
                <input type="text" id="searchInputField" placeholder="Discover artisanal style..." autocomplete="off">
            </div>

            <div class="search-hints-premium">
                <span>Trending:</span>
                <a href="javascript:void(0)" class="search-hint-link" onclick="executeSearch('Silk Saree')">Silk Saree</a>
                <a href="javascript:void(0)" class="search-hint-link" onclick="executeSearch('Linen')">Linen</a>
                <a href="javascript:void(0)" class="search-hint-link" onclick="executeSearch('Home Decor')">Home Decor</a>
            </div>

            <div class="discovery-hub">
                <span class="discovery-label">Curated Collections</span>
                <div class="discovery-grid">
                    <a href="{{ route('category', 'apparels') }}" class="discovery-item">
                        <i data-lucide="shirt"></i>
                        <span>Apparels</span>
                    </a>
                    <a href="{{ route('category', 'kutties') }}" class="discovery-item">
                        <i data-lucide="baby"></i>
                        <span>Kutties</span>
                    </a>
                    <a href="{{ route('category', 'decors') }}" class="discovery-item">
                        <i data-lucide="home"></i>
                        <span>Decors</span>
                    </a>
                </div>
            </div>
        </div>
    </div>

    @if(!Route::is('landing'))
    {{-- Navbar --}}
    <nav class="navbar" id="navbar">
        <div class="container navbar-content">
            <button class="mobile-menu-toggle" id="menuToggle">
                <i data-lucide="menu" id="menuIcon"></i>
            </button>

            <a href="{{ route('landing') }}" class="navbar-logo">AAKRITHI</a>

            <ul class="navbar-links" id="navLinks">
                <li class="mobile-nav-logo-item"><a href="{{ route('landing') }}">AAKRITHI</a></li>
                <li><a href="{{ route('category', 'apparels') }}"><span class="nav-brand">Aakrithi</span><span class="nav-category">Apparels</span></a></li>
                <li><a href="{{ route('category', 'kutties') }}"><span class="nav-brand">Aakrithi</span><span class="nav-category">Kutties</span></a></li>
                <li><a href="{{ route('category', 'decors') }}"><span class="nav-brand">Aakrithi</span><span class="nav-category">Decors</span></a></li>
            </ul>

            <div class="navbar-actions">
                <button class="nav-action-btn" id="searchToggleBtn" title="Search Collection"><i data-lucide="search"></i></button>
                @auth
                    <div class="nav-user-dropdown">
                        <a href="{{ route('account') }}" class="nav-action-btn"><i data-lucide="user"></i></a>
                        <div class="dropdown-content">
                            <span class="user-greeting">Hi, {{ Auth::user()->name }}</span>
                            @if(Auth::user()->is_admin)
                                <a href="{{ route('admin.dashboard') }}" class="dropdown-item"><i data-lucide="layout-dashboard" style="width:14px; margin-right:8px;"></i> Admin Panel</a>
                            @endif
                            <hr>
                            <form method="POST" action="{{ route('logout') }}">
                                @csrf
                                <button type="submit" class="logout-btn"><i data-lucide="log-out"></i> Logout</button>
                            </form>
                        </div>
                    </div>
                @else
                    <a href="{{ route('account') }}" class="nav-action-btn hide-mobile"><i data-lucide="user"></i></a>
                @endauth
                <a href="{{ route('wishlist') }}" class="nav-action-btn wishlist-icon hide-mobile" style="position:relative">
                    <i data-lucide="heart"></i>
                    @php($wishlist_count = session('wishlist') ? count(session('wishlist')) : 0)
                    <span class="cart-count" id="wishlistCount" style="background: var(--color-accent); display: {{ $wishlist_count > 0 ? 'flex' : 'none' }};">{{ $wishlist_count }}</span>
                </a>


                <a href="{{ request()->is('wholesale*') ? route('wholesale.cart') : route('cart') }}" class="nav-action-btn cart-icon" style="position:relative">
                    <i data-lucide="shopping-bag"></i>
                    @php($cart_count = session('cart') ? count(session('cart')) : 0)
                    <span class="cart-count" id="cartCount">{{ $cart_count }}</span>
                </a>
            </div>
        </div>
    </nav>
    <div class="mobile-menu-backdrop" id="menuBackdrop"></div>
    @endif

    {{-- Main Content --}}
    <main style="@if(Route::is('landing')) padding-top: 0; @else padding-top: var(--header-height); @endif">
        @yield('content')
    </main>

    {{-- Footer --}}
    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <h3>AAKRITHI</h3>
                    <p>Curated artisanal clothing designed for comfort and elegance. Blending traditional Indian craftsmanship with modern silhouettes.</p>
                    <div class="social-links">
                        <a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg></a>
                        <a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
                        <a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16zM4 20l6.768 -6.768M15.232 10.232l4.768 -6.232"/></svg></a>
                    </div>
                </div>
                <div class="footer-links">
                    <h4>Shop</h4>
                    <ul>
                        <li><a href="{{ route('category', 'apparels') }}">Apparels</a></li>
                        <li><a href="{{ route('category', 'kutties') }}">Kutties</a></li>
                        <li><a href="{{ route('category', 'decors') }}">Decors</a></li>
                    </ul>
                </div>
                <div class="footer-links">
                    <h4>Info</h4>
                    <ul>
                        <li><a href="{{ route('about') }}">Our Story</a></li>
                        <li><a href="{{ route('contact') }}">Contact</a></li>
                        <li><a href="#">Shipping</a></li>
                        <li><a href="#">Returns</a></li>
                    </ul>
                </div>
                <div>
                    <h4>Newsletter</h4>
                    <p style="color:#A0A5AB; font-size:0.875rem; margin-bottom:1rem;">Subscribe for exclusive updates and offers.</p>
                    <form class="newsletter-form">
                        <input type="email" placeholder="Your email address">
                        <button type="submit"><i data-lucide="arrow-right"></i></button>
                    </form>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; {{ date('Y') }} Aakrithi. All rights reserved.</p>
                <div class="payment-icons">
                    <span>Visa</span> <span>Mastercard</span> <span>UPI</span> <span>Net Banking</span>
                </div>
            </div>
        </div>
    </footer>

    <script src="{{ asset('js/app.js') }}?v=1.0.6"></script>
    <script>
        lucide.createIcons();

        // Search Interface - Premium Integration
        const searchOverlay = document.getElementById('searchOverlay');
        const searchToggleBtn = document.getElementById('searchToggleBtn');
        const searchCloseBtn = document.getElementById('searchCloseBtn');
        const searchInputField = document.getElementById('searchInputField');

        function toggleSearch(show) {
            if (show) {
                searchOverlay.style.display = 'flex';
                setTimeout(() => {
                    searchOverlay.classList.add('active');
                    searchInputField.focus();
                }, 10);
            } else {
                searchOverlay.classList.remove('active');
                setTimeout(() => searchOverlay.style.display = 'none', 400);
            }
        }

        searchToggleBtn.addEventListener('click', () => toggleSearch(true));
        searchCloseBtn.addEventListener('click', () => toggleSearch(false));
        
        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) toggleSearch(false);
        });

        // Search Logic
        function executeSearch(query) {
            const q = query || searchInputField.value.trim();
            if (q) window.location.href = `/shop?category=all&sort=latest&search=${encodeURIComponent(q)}`;
        }

        searchInputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') executeSearch();
        });
    </script>
    
    <!-- Preloader Script -->
    <script>
        (function() {
            const loader = document.getElementById('global-loader');
            
            function hideLoader() {
                if (loader) {
                    loader.style.opacity = '0';
                    setTimeout(() => {
                        loader.style.visibility = 'hidden';
                        loader.style.display = 'none';
                    }, 200);
                }
            }

            function showLoader() {
                if (loader) {
                    loader.style.display = 'flex';
                    loader.style.visibility = 'visible';
                    loader.style.opacity = '1';
                }
            }

            // Hide on initial load
            window.addEventListener('load', hideLoader);

            // CRITICAL: Hide when navigating back (bfcache restoration)
            window.addEventListener('pageshow', (event) => {
                if (event.persisted) {
                    // Page was restored from cache, hide loader immediately
                    if (loader) {
                        loader.style.display = 'none';
                        loader.style.visibility = 'hidden';
                        loader.style.opacity = '0';
                    }
                }
            });

            // Show on navigation
            document.addEventListener('DOMContentLoaded', () => {
                // Handle internal links
                document.querySelectorAll('a').forEach(link => {
                    link.addEventListener('click', function(e) {
                        const href = this.getAttribute('href');
                        const target = this.getAttribute('target');
                        
                        // Ignore hashes, javascript, external targets, and modifier keys
                        if (href && 
                            !href.startsWith('#') && 
                            !href.startsWith('javascript') && 
                            !href.startsWith('tel:') && 
                            !href.startsWith('mailto:') && 
                            target !== '_blank' && 
                            !e.ctrlKey && 
                            !e.metaKey && 
                            !e.shiftKey) {
                            showLoader();
                        }
                    });
                });

                // Handle form submissions
                document.querySelectorAll('form').forEach(form => {
                    form.addEventListener('submit', function(e) {
                        const target = this.getAttribute('target');
                        if (target !== '_blank') {
                            showLoader();
                        }
                    });
                });
            });

            // Handle browser refresh & generic navigation (less intrusive than beforeunload for bfcache)
            // But we keep it if they want that "immediate" feel on reload
            window.addEventListener('beforeunload', () => {
                // Small delay to check if navigation wasn't cancelled
                // but usually showing it here is fine as long as we hide it on pageshow
                showLoader();
            });
        })();
    </script>
    
    @yield('scripts')
    
    <script>
        function addToWishlist(id) {
            fetch(`/add-to-wishlist/${id}`)
                .then(response => response.json())
                .then(data => {
                    const countSpan = document.getElementById('wishlistCount');
                    if (countSpan) {
                        countSpan.innerText = data.count;
                        countSpan.style.display = 'flex';
                    }
                    alert(data.message);
                });
        }
    </script>
</body>
</html>

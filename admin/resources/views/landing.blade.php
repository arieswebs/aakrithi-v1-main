@extends('layouts.app')

@section('meta_title', 'Aakrithi | Cinematic Artisanal Boutique')

@section('body_class', 'landing-page home-page')

@section('content')
{{-- 1. Cinematic Dual-Path Hero --}}
<section class="hero-fullscreen">
    <img src="{{ asset('images/landing-hero.png') }}" alt="Aakrithi Cinematic Background" class="hero-bg-media">
    <div class="hero-overlay"></div>
    
    <div class="container h-100 d-flex flex-column align-items-center justify-content-center text-center">
        <div class="brand-reveal" style="position: relative; z-index: 10;">
            <h1 class="landing-title reveal-up" style="font-family: var(--font-serif); font-size: clamp(3rem, 15vw, 8rem); font-weight: 700; letter-spacing: 0.15em; color: #FEFEE3; text-shadow: 0 10px 30px rgba(0,0,0,0.3);">AAKRITHI</h1>
            <p class="landing-subtitle reveal-up reveal-delay-1" style="letter-spacing: 0.6em; text-transform: uppercase; color: #FEFEE3; font-size: 1rem;">IT SUITS YOU BETTER</p>
        </div>

        <div class="portal-container mt-5" style="gap: clamp(2rem, 5vw, 4rem); flex-wrap: wrap; justify-content: center;">
            {{-- Retail Portal --}}
            <a href="{{ route('home') }}" class="portal-card reveal-up reveal-delay-2" style="text-decoration: none; color: inherit;">
                <div class="portal-icon">
                    <i data-lucide="shopping-bag" style="width: 40px; height: 40px; color: var(--color-accent);"></i>
                </div>
                <h3 style="font-family: var(--font-serif); font-size: 2rem; margin: 1.5rem 0;">Retail Boutique</h3>
                <p style="opacity: 0.7; font-size: 0.95rem; line-height: 1.6;">Experience curated artisanal fashion, bespoke tailoring, and luxury ethnic wear for the modern individual.</p>
                <div class="portal-cta mt-4" style="font-weight: 700; letter-spacing: 2px; text-transform: uppercase; font-size: 0.8rem; color: var(--color-accent);">Entrance <i data-lucide="arrow-right" style="width: 16px;"></i></div>
            </a>

            {{-- Wholesale Portal --}}
            <a href="{{ route('wholesale') }}" class="portal-card reveal-up reveal-delay-3" style="text-decoration: none; color: inherit;">
                <div class="portal-icon">
                    <i data-lucide="factory" style="width: 40px; height: 40px; color: var(--color-accent);"></i>
                </div>
                <h3 style="font-family: var(--font-serif); font-size: 2rem; margin: 1.5rem 0;">Wholesale Hub</h3>
                <p style="opacity: 0.7; font-size: 0.95rem; line-height: 1.6;">Premium bulk ordering, B2B artisanal partnerships, and global supply chain excellence for fashion houses.</p>
                <div class="portal-cta mt-4" style="font-weight: 700; letter-spacing: 2px; text-transform: uppercase; font-size: 0.8rem; color: var(--color-accent);">B2B Portal <i data-lucide="arrow-right" style="width: 16px;"></i></div>
            </a>
        </div>
    </div>

    <div class="landing-scroll-hint">
        <span>Scroll to Discover</span>
        <div class="mouse-icon">
            <div class="wheel"></div>
        </div>
    </div>
</section>

{{-- 2. Artisanal Heritage Section --}}
<section class="heritage-section" style="padding: 8rem 0;">
    {{-- Floating Motifs --}}
    <img src="{{ asset('images/logo.png') }}" class="motif-float" style="top: 10%; left: 5%; width: 150px;">
    <img src="{{ asset('images/logo.png') }}" class="motif-float" style="bottom: 20%; right: 10%; width: 200px;">

    <div class="container">
        <div class="heritage-grid">
            <div class="heritage-content reveal-up">
                <span class="highlight-text" style="color: var(--color-accent); font-weight: 700; letter-spacing: 3px; text-transform: uppercase; font-size: 0.8rem;">Every Stitch Tells a Tale</span>
                <h2 style="font-family: var(--font-serif); font-size: 3.5rem; margin: 1.5rem 0; line-height: 1.1;">Crafting Heritage for the Modern Soul</h2>
                <p style="font-size: 1.1rem; opacity: 0.8; line-height: 1.8; margin-bottom: 2.5rem;">At Aakrithi, we bridge the gap between ancient artisanal craftsmanship and contemporary fashion silhouettes. Each piece is hand-stitched by master craftsmen, ensuring that the legacy of Indian textiles lives on in every fold.</p>
                <div class="heritage-stats d-flex gap-5">
                    <div>
                        <h4 style="color: var(--color-accent); font-size: 2rem;">20+</h4>
                        <p style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px;">Master Artisans</p>
                    </div>
                    <div>
                        <h4 style="color: var(--color-accent); font-size: 2rem;">100%</h4>
                        <p style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px;">Sustainably Sourced</p>
                    </div>
                </div>
            </div>
            <div class="heritage-image-wrapper reveal-scale">
                <img src="{{ asset('images/craftsmanship.png') }}" alt="Artisanal Embroidery Details">
            </div>
        </div>
    </div>
</section>

{{-- 3. B2B Excellence Snapshot --}}
<section class="b2b-excellence" style="padding: 8rem 0; border-top: 1px solid rgba(197, 160, 89, 0.2);">
    <div class="premium-grid-bg"></div>
    <div class="container py-5 position-relative" style="z-index: 2;">
        <div class="text-center mb-5 reveal-up">
            <h2 style="font-family: var(--font-serif); font-size: clamp(2rem, 8vw, 3.5rem); color: #FEFEE3;">Global Wholesale Excellence</h2>
            <p style="opacity: 0.7; max-width: 600px; margin: 0 auto;">Powering boutiques and retailers across the globe with premium, quality-checked artisanal collections.</p>
        </div>
        
        <div class="row g-5 reveal-up reveal-delay-2 justify-content-center">
            <div class="col-lg-4 col-md-6">
                <div class="feature-card glass-card premium-card h-100 p-4 text-center">
                    <span class="feature-number">01</span>
                    <div class="spirit-circle">
                        <i data-lucide="truck" style="width: 24px; height: 24px; color: var(--color-accent);"></i>
                    </div>
                    <h4 style="font-family: var(--font-serif); font-size: 1.4rem; color: #FEFEE3; margin-bottom: 1rem;">Global Logistics</h4>
                    <p style="font-size: 0.9rem; opacity: 0.7; line-height: 1.6; margin: 0;">Secured priority shipping to over 25+ countries with real-time tracking and white-glove handling.</p>
                </div>
            </div>
            <div class="col-lg-4 col-md-6">
                <div class="feature-card glass-card premium-card h-100 p-4 text-center">
                    <span class="feature-number">02</span>
                    <div class="spirit-circle">
                        <i data-lucide="shield-check" style="width: 24px; height: 24px; color: var(--color-accent);"></i>
                    </div>
                    <h4 style="font-family: var(--font-serif); font-size: 1.4rem; color: #FEFEE3; margin-bottom: 1rem;">Quality Verified</h4>
                    <p style="font-size: 0.9rem; opacity: 0.7; line-height: 1.6; margin: 0;">Rigorous multi-stage QC process for every bulk shipment, ensuring artisanal perfection in every piece.</p>
                </div>
            </div>
            <div class="col-lg-4 col-md-6">
                <div class="feature-card glass-card premium-card h-100 p-4 text-center">
                    <span class="feature-number">03</span>
                    <div class="spirit-circle">
                        <i data-lucide="refresh-ccw" style="width: 24px; height: 24px; color: var(--color-accent);"></i>
                    </div>
                    <h4 style="font-family: var(--font-serif); font-size: 1.4rem; color: #FEFEE3; margin-bottom: 1rem;">Quick Restock</h4>
                    <p style="font-size: 0.9rem; opacity: 0.7; line-height: 1.6; margin: 0;">Dedicated B2B dashboard for recurring inventory fulfillment and seasonal collection previews.</p>
                </div>
            </div>
        </div>
    </div>
</section>

{{-- 4. Signature Collections Preview --}}
<section style="padding: 8rem 0; background: #0B332A;">
    <div class="container py-5">
        <div class="section-header reveal-up d-flex justify-content-between align-items-end mb-5">
            <div>
                <h2 style="font-family: var(--font-serif); font-size: 3rem;">Signature Collections</h2>
                <p style="opacity: 0.7;">Handpicked artisanal masterpieces for the discerning individual.</p>
            </div>
            <a href="{{ route('home') }}" class="btn-outline-light px-4 py-2" style="text-decoration:none;">View All</a>
        </div>

        <div class="row g-4 reveal-up reveal-delay-2">
            <div class="col-md-4">
                <a href="{{ route('category', 'apparels') }}" class="category-card" style="text-decoration:none; display:block; height: 400px; position:relative; overflow:hidden; border-radius:30px;">
                    <img src="{{ asset('images/cat_dresses.png') }}" alt="Designer Apparels" style="width:100%; height:100%; object-fit:cover; transition: transform 0.8s;">
                    <div style="position:absolute; bottom:0; left:0; width:100%; padding:2rem; background:linear-gradient(transparent, rgba(7,40,33,0.9)); color:white;">
                        <h4 style="font-family: var(--font-serif); font-size: 1.5rem; margin:0;">Handcrafted Apparels</h4>
                        <p style="font-size:0.8rem; opacity:0.7; margin:0.5rem 0 0;">Designer Kurties & Ethnic Tops</p>
                    </div>
                </a>
            </div>
            <div class="col-md-4">
                <a href="{{ route('category', 'kutties') }}" class="category-card" style="text-decoration:none; display:block; height: 400px; position:relative; overflow:hidden; border-radius:30px;">
                    <img src="{{ asset('images/cat_sets.png') }}" alt="Traditional Kerala Sets" style="width:100%; height:100%; object-fit:cover; transition: transform 0.8s;">
                    <div style="position:absolute; bottom:0; left:0; width:100%; padding:2rem; background:linear-gradient(transparent, rgba(7,40,33,0.9)); color:white;">
                        <h4 style="font-family: var(--font-serif); font-size: 1.5rem; margin:0;">Artisanal Kutties</h4>
                        <p style="font-size:0.8rem; opacity:0.7; margin:0.5rem 0 0;">Kerala Handloom & Party Wear</p>
                    </div>
                </a>
            </div>
            <div class="col-md-4">
                <a href="{{ route('category', 'decors') }}" class="category-card" style="text-decoration:none; display:block; height: 400px; position:relative; overflow:hidden; border-radius:30px;">
                    <img src="{{ asset('images/cat_sarees.png') }}" alt="Embroidered Sarees" style="width:100%; height:100%; object-fit:cover; transition: transform 0.8s;">
                    <div style="position:absolute; bottom:0; left:0; width:100%; padding:2rem; background:linear-gradient(transparent, rgba(7,40,33,0.9)); color:white;">
                        <h4 style="font-family: var(--font-serif); font-size: 1.5rem; margin:0;">Signature Sarees</h4>
                        <p style="font-size:0.8rem; opacity:0.7; margin:0.5rem 0 0;">Exquisite Embroidered Collections</p>
                    </div>
                </a>
            </div>
        </div>
    </div>
</section>

<script>
    // Portal Card & Feature Card Interactive Background
    document.querySelectorAll('.portal-card, .category-card, .feature-card').forEach(card => {
        card.onmousemove = e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        }
    });
</script>

<style>
    /* Final Polish Styles */
    .navbar { background: transparent !important; border: none !important; }
    .landing-logo { filter: drop-shadow(0 0 20px rgba(197, 160, 89, 0.4)); }
    .highlight-text { letter-spacing: 4px; }
    .feature-card:hover { border-color: var(--color-accent); transform: translateY(-10px); }
    .category-card:hover img { transform: scale(1.1); }
</style>
@endsection

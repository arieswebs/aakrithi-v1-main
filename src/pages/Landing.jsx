import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, ArrowRight, Star, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import { useApp } from '../context/AppContext';
import './LandingPremium.css';

export default function Landing() {
    const { addToCart, toggleWishlist, wishlist } = useApp();
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    // Scroll reveal logic
    const revealRefs = useRef([]);
    const addToRefs = (el) => {
        if (el && !revealRefs.current.includes(el)) {
            revealRefs.current.push(el);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.15 });

        revealRefs.current.forEach(ref => observer.observe(ref));
        return () => observer.disconnect();
    }, [featuredProducts]); // Re-run when products load

    // Testimonials Data
    const testimonials = useMemo(() => [
        {
            quote: "Aakrithi's design language is sheer poetry. The antique gold hues and handloom textures feel like wearing legacy.",
            author: "Aishwarya Sen",
            role: "Fashion Curator",
            rating: 5
        },
        {
            quote: "The wholesale ordering process is seamless. The low MOQ allowed us to test their premium linen collection with zero risk.",
            author: "Devendra Mehta",
            role: "Boutique Owner, Mumbai",
            rating: 5
        },
        {
            quote: "Extremely premium customer experience. The sizing is generous and the custom embroidery work is immaculate.",
            author: "Malini Krishnan",
            role: "Retail Customer",
            rating: 5
        }
    ], []);

    // Fetch featured products
    useEffect(() => {
        setLoadingProducts(true);
        fetch('/api/products?category=all&sort=latest')
            .then(res => res.json())
            .then(data => {
                if (data.products) {
                    setFeaturedProducts(data.products.slice(0, 4));
                }
                setLoadingProducts(false);
            })
            .catch(err => {
                console.error("Error fetching featured products:", err);
                setLoadingProducts(false);
            });
    }, []);

    // Auto-cycle testimonials
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial(prev => (prev + 1) % testimonials.length);
        }, 8000);
        return () => clearInterval(interval);
    }, [testimonials.length]);

    const isProductInWishlist = (id) => wishlist.some(item => item.id === id);

    return (
        <AppLayout>
            {/* 1. Responsive Hero Showcase (Desktop Split / Mobile Direct Overlay) */}
            <section className="position-relative overflow-hidden hero-responsive-section" style={{ 
                minHeight: '100vh', 
                background: 'var(--color-background)', 
                paddingTop: '7rem', 
                paddingBottom: '5rem' 
            }}>
                {/* Mobile-Only Light Gradient Overlay */}
                <div className="hero-mobile-overlay-bg d-lg-none"></div>

                {/* Ambient Warm Gold Glows (Desktop) */}
                <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(197, 160, 89, 0.12) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 2 }}></div>

                <div className="container position-relative" style={{ zIndex: 10 }}>
                    <div className="row align-items-center g-5">
                        
                        {/* Left Column: Typography & Gold CTAs */}
                        <div className="col-lg-6 text-center text-lg-start">
                            <div className="text-reveal d-flex align-items-center justify-content-center justify-content-lg-start gap-3 mb-4">
                                <span style={{ width: '30px', height: '1.5px', background: 'linear-gradient(90deg, #1A120D, transparent)' }}></span>
                                <span className="hero-badge-text" style={{ color: '#1A120D', fontWeight: 600, letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.78rem' }}>
                                    The Artisanal Heritage Collection
                                </span>
                            </div>

                            <h1 
                                className="text-reveal delay-300 hero-royal-title hero-royal-title-premium"
                                style={{
                                    fontFamily: 'var(--font-serif)',
                                    fontSize: 'clamp(3.8rem, 7vw, 6.5rem)',
                                    fontWeight: 400,
                                    letterSpacing: '0.08em',
                                    lineHeight: 1.05,
                                    textTransform: 'uppercase',
                                    marginBottom: '1.2rem'
                                }}
                            >
                                Aakrithi
                            </h1>
                            
                            <p 
                                className="text-reveal delay-500 hero-tagline-text"
                                style={{
                                    letterSpacing: '0.25em',
                                    textTransform: 'uppercase',
                                    color: '#1A120D',
                                    fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
                                    fontWeight: 600,
                                    marginBottom: '1.5rem',
                                    lineHeight: 1.8
                                }}
                            >
                                It Suits You Better
                            </p>

                            <p 
                                className="text-reveal delay-500 hero-desc-text mx-auto mx-lg-0"
                                style={{
                                    color: 'rgba(44, 30, 22, 0.78)',
                                    fontSize: '1rem',
                                    lineHeight: 1.8,
                                    maxWidth: '520px',
                                    marginBottom: '2.5rem'
                                }}
                            >
                                Hand-woven masterpieces crafted by generations of master weavers. Where centuries of textile heritage meet contemporary golden elegance.
                            </p>

                            {/* Royal Ivory & Gold Action Buttons */}
                            <div className="d-flex flex-column flex-sm-row justify-content-center justify-content-lg-start gap-4 mb-5 text-reveal delay-700">
                                <Link to="/boutique" className="btn-ivory-gold">
                                    <span>Explore Boutique</span>
                                </Link>
                                <Link to="/shop?is_wholesale=true" className="btn-ivory-outline">
                                    <span>Wholesale Portal</span>
                                </Link>
                            </div>

                            {/* Trust Stats Bar */}
                            <div className="row g-3 pt-4 text-reveal delay-700 mx-auto mx-lg-0" style={{ borderTop: '1px solid rgba(197, 160, 89, 0.35)', maxWidth: '540px' }}>
                                <div className="col-4">
                                    <h4 className="hero-stat-number-premium">100%</h4>
                                    <p className="hero-stat-label" style={{ color: 'rgba(44, 30, 22, 0.65)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', margin: 0, marginTop: '4px' }}>Artisanal Sourced</p>
                                </div>
                                <div className="col-4">
                                    <h4 className="hero-stat-number-premium">30+</h4>
                                    <p className="hero-stat-label" style={{ color: 'rgba(44, 30, 22, 0.65)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', margin: 0, marginTop: '4px' }}>Handcraft Hours</p>
                                </div>
                                <div className="col-4">
                                    <h4 className="hero-stat-number-premium">50+</h4>
                                    <p className="hero-stat-label" style={{ color: 'rgba(44, 30, 22, 0.65)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', margin: 0, marginTop: '4px' }}>Master Weavers</p>
                                </div>
                            </div>

                        </div>

                        {/* Right Column: Desktop Dual Model Collage Showcase */}
                        <div className="col-lg-6 position-relative mt-5 mt-lg-0 d-none d-lg-block">
                            <div className="royal-collage-wrapper position-relative mx-auto" style={{ maxWidth: '540px' }}>
                                
                                {/* Main Model Showcase Card */}
                                <div className="royal-card-primary premium-frame" style={{ borderRadius: '24px' }}>
                                    <div className="premium-frame-inner" style={{ borderRadius: 'inherit', height: '100%' }}>
                                        <img 
                                            src="/images/hero_banner.png" 
                                            alt="Aakrithi Heritage Model Couture" 
                                            style={{ width: '100%', height: '520px', objectFit: 'cover', objectPosition: 'center top', display: 'block' }} 
                                        />
                                    </div>
                                </div>

                                {/* Overlapping Secondary Model Accent Card */}
                                <div className="royal-card-accent premium-frame position-absolute" style={{ width: '220px', height: '280px', bottom: '-30px', left: '-30px', borderRadius: '20px', zIndex: 12 }}>
                                    <div className="premium-frame-inner" style={{ borderRadius: 'inherit', height: '100%' }}>
                                        <img 
                                            src="/images/cat_sets.png" 
                                            alt="Artisanal Floral Silk Saree" 
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} 
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 2. Brand Ethos with Parallax Scroll */}
            <section style={{ padding: '10rem 0', background: 'var(--color-background)', position: 'relative', overflow: 'hidden' }}>
                {/* Decorative Elements */}
                <div style={{ position: 'absolute', top: '10%', left: '-10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(197, 160, 89, 0.05) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%' }}></div>
                <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(197, 160, 89, 0.05) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%' }}></div>

                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-5 mb-5 mb-lg-0 pe-lg-5 fade-up-scroll" ref={addToRefs}>
                            <span style={{ color: 'var(--color-accent)', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.85rem', display: 'block', marginBottom: '1.5rem' }}>
                                // The Craft Philosophy
                            </span>
                            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--color-text)', lineHeight: 1.1, marginBottom: '2.5rem', fontWeight: 500 }}>
                                Elegant Simplicity.<br />Hand-Woven Masterpieces.
                            </h2>
                            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-light)', lineHeight: 1.8, marginBottom: '3rem' }}>
                                We partner with generations of weaver families across handloom regions in India to bring you authentic, meticulously constructed ethnic wear. By preserving traditional loom work and updating silhouettes for modern sensibilities, Aakrithi represents a timeless celebration of luxury textile heritage.
                            </p>
                            <div className="row g-4" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '2.5rem' }}>
                                <div className="col-6 fade-up-scroll delay-100" ref={addToRefs}>
                                    <h3 style={{ color: 'var(--color-accent)', fontSize: '3rem', fontFamily: 'var(--font-serif)', fontWeight: 400, marginBottom: '0.5rem' }}>100%</h3>
                                    <p style={{ fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-text)', fontWeight: 600, margin: 0 }}>Artisanal Weaver Sourced</p>
                                </div>
                                <div className="col-6 fade-up-scroll delay-300" ref={addToRefs}>
                                    <h3 style={{ color: 'var(--color-accent)', fontSize: '3rem', fontFamily: 'var(--font-serif)', fontWeight: 400, marginBottom: '0.5rem' }}>30+</h3>
                                    <p style={{ fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-text)', fontWeight: 600, margin: 0 }}>Hours of Handcrafting</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-7 fade-up-scroll delay-300" ref={addToRefs}>
                            <div className="position-relative" style={{ padding: '2rem 2rem 2rem 0' }}>
                                <div style={{
                                    position: 'absolute',
                                    top: 0, right: 0,
                                    width: '80%', height: '100%',
                                    border: '1px solid var(--color-accent)',
                                    borderRadius: '2px',
                                    zIndex: 1
                                }}></div>
                                <div className="glass-card" style={{ position: 'relative', zIndex: 2, padding: '1rem' }}>
                                    <img
                                        src="/images/premium-craftsmanship.png"
                                        alt="Artisanal Handloom"
                                        style={{ width: '100%', height: 'auto', display: 'block', filter: 'contrast(1.05) sepia(0.1)' }}
                                    />
                                </div>
                                <div className="glass-card-dark position-absolute bottom-0 start-0 p-4" style={{ zIndex: 3, maxWidth: '300px', transform: 'translateY(20px) translateX(-20px)' }}>
                                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--color-accent)', fontWeight: 700 }}>Featured Process</span>
                                    <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, color: '#ffffff', marginTop: '0.5rem', marginBottom: '0.5rem' }}>Zari Perfection</h4>
                                    <p style={{ fontSize: '0.9rem', color: 'rgba(255, 254, 240, 0.8)', margin: 0, lineHeight: 1.5 }}>Hand-tailored by master artisans over days of meticulous focus.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Immersive Featured Collections */}
            <section style={{ padding: '8rem 0', background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)' }}>
                <div className="container">
                    <div className="d-flex justify-content-between align-items-end mb-5 flex-wrap gap-4 fade-up-scroll" ref={addToRefs}>
                        <div>
                            <span style={{ color: 'var(--color-accent)', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.85rem', display: 'block', marginBottom: '1rem' }}>
                                // Exquisite Collections
                            </span>
                            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', color: 'var(--color-text)', margin: 0, fontWeight: 500 }}>
                                Seasonal Masterpieces
                            </h2>
                        </div>
                        <Link to="/shop" className="d-flex align-items-center gap-2 text-decoration-none" style={{ color: 'var(--color-accent)', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
                            View All Designs <ArrowRight size={18} />
                        </Link>
                    </div>

                    {loadingProducts ? (
                        <div className="text-center py-5">
                            <div className="spinner-border" style={{ color: 'var(--color-accent)' }} role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : featuredProducts.length === 0 ? (
                        <div className="text-center py-5 glass-card">
                            <p style={{ color: 'var(--color-text-light)', fontSize: '1.1rem' }}>Featured products are currently being curated.</p>
                        </div>
                    ) : (
                        <div className="row g-4 mt-2">
                            {featuredProducts.map((product, idx) => {
                                const inWish = isProductInWishlist(product.id);
                                return (
                                    <div key={product.id} className="col-12 col-sm-6 col-lg-3 fade-up-scroll" ref={addToRefs} style={{ transitionDelay: `${idx * 150}ms` }}>
                                        <Link to={`/product/${product.slug}`} className="premium-product-card text-decoration-none">

                                            <div className="premium-product-img-wrap">
                                                {product.badge && (
                                                    <span style={{
                                                        position: 'absolute', top: '16px', left: '16px', zIndex: 10,
                                                        background: 'var(--color-surface)', color: 'var(--color-text)',
                                                        padding: '4px 12px', fontSize: '0.7rem', textTransform: 'uppercase',
                                                        fontWeight: 600, letterSpacing: '1px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                                                    }}>
                                                        {product.badge}
                                                    </span>
                                                )}

                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        toggleWishlist(product);
                                                    }}
                                                    className="premium-wishlist-btn"
                                                >
                                                    <Heart size={18} fill={inWish ? '#D32F2F' : 'none'} color={inWish ? '#D32F2F' : 'currentColor'} strokeWidth={1.5} />
                                                </button>

                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="premium-product-img"
                                                />

                                                <button
                                                    className="premium-add-btn"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        addToCart(product, 'Free Size');
                                                        alert(`${product.name} added to bag!`);
                                                    }}
                                                >
                                                    <ShoppingBag size={16} /> Add to Bag
                                                </button>
                                            </div>

                                            <div style={{ padding: '1.5rem 0 0.5rem', textAlign: 'center' }}>
                                                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-accent)', letterSpacing: '2px', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                                                    {product.category}
                                                </span>
                                                <h3 style={{
                                                    fontSize: '1.1rem', fontFamily: 'var(--font-serif)', color: 'var(--color-text)',
                                                    margin: '0 0 8px 0', fontWeight: 400, lineHeight: '1.4'
                                                }}>
                                                    {product.name}
                                                </h3>
                                                <span style={{ fontWeight: 500, fontSize: '1.05rem', color: 'var(--color-text)' }}>
                                                    ₹{new Intl.NumberFormat('en-IN').format(product.price)}
                                                </span>
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* 4. Interactive Split Portal */}
            <section className="split-accordion-container">
                <div className="split-panel retail">
                    <div className="split-panel-bg" style={{ backgroundImage: 'url(/images/boutique-hero.png)' }}></div>
                    <div className="split-panel-overlay"></div>
                    <div className="split-panel-content">
                        <span className="d-flex align-items-center gap-3 mb-4" style={{ color: 'var(--color-accent)', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', fontSize: '0.85rem' }}>
                            <span style={{ width: '50px', height: '1.5px', background: 'var(--color-accent)' }}></span>
                            The Retail Collection
                        </span>
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(3rem, 5vw, 4.5rem)', color: 'var(--color-text)', margin: '0 0 1.5rem', fontWeight: 400, lineHeight: 1.1 }}>
                            Personal Elegance
                        </h2>
                        <p style={{ color: '#4A3D36', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '3rem', maxWidth: '500px' }}>
                            Discover handpicked custom kurtis, designer traditional apparels, and curated ethnic home decors built to elevate your personal spaces and wardrobes.
                        </p>
                        <div>
                            <Link to="/boutique" className="btn-gold-solid">
                                Shop Boutique
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="split-panel wholesale">
                    <div className="split-panel-bg" style={{ backgroundImage: 'url(/images/workshop.png)' }}></div>
                    <div className="split-panel-overlay"></div>
                    <div className="split-panel-content align-items-lg-end text-lg-end">
                        <span className="d-flex align-items-center gap-3 mb-4 justify-content-lg-end" style={{ color: '#C5A059', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', fontSize: '0.85rem' }}>
                            The Wholesale Portal
                            <span className="d-none d-lg-block" style={{ width: '50px', height: '1.5px', background: '#C5A059' }}></span>
                        </span>
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(3rem, 5vw, 4.5rem)', color: '#C5A059', margin: '0 0 1.5rem', fontWeight: 500, lineHeight: 1.1, textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
                            Bulk Excellence
                        </h2>
                        <p style={{ color: '#FFFDF0', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '3rem', maxWidth: '500px' }}>
                            Access premium wholesale pricing catalog, fast container packaging, and verified logistics integration. Designed for global boutiques and multi-brand retailers.
                        </p>
                        <div>
                            <Link to="/shop?is_wholesale=true" className="btn-ivory-gold">
                                Access B2B Portal
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Minimalist Testimonials */}
            <section style={{ padding: '8rem 0', background: 'var(--color-background)', position: 'relative' }}>
                <div className="container fade-up-scroll" ref={addToRefs} style={{ maxWidth: '900px', textAlign: 'center' }}>
                    <span style={{ color: 'var(--color-accent)', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.85rem', display: 'block', marginBottom: '3rem' }}>
                        // Voices of Elegance
                    </span>

                    <div style={{ position: 'relative', minHeight: '250px' }}>
                        {testimonials.map((testi, idx) => (
                            <div
                                key={idx}
                                style={{
                                    position: 'absolute', inset: 0,
                                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                                    opacity: activeTestimonial === idx ? 1 : 0,
                                    transform: activeTestimonial === idx ? 'translateY(0)' : 'translateY(20px)',
                                    transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                                    pointerEvents: activeTestimonial === idx ? 'auto' : 'none'
                                }}
                            >
                                <p style={{
                                    fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                                    color: 'var(--color-text)', lineHeight: 1.5, fontStyle: 'italic', margin: '0 0 2rem'
                                }}>
                                    "{testi.quote}"
                                </p>

                                <div className="d-flex justify-content-center gap-2 mb-3" style={{ color: 'var(--color-accent)' }}>
                                    {Array.from({ length: testi.rating }).map((_, i) => (
                                        <Star key={i} size={18} fill="currentColor" />
                                    ))}
                                </div>

                                <h4 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    {testi.author}
                                </h4>
                                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', marginTop: '6px', display: 'block' }}>
                                    {testi.role}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="d-flex justify-content-center align-items-center gap-4 mt-5">
                        <button
                            onClick={() => setActiveTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length)}
                            style={{ background: 'transparent', border: '1px solid var(--color-border)', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justify: 'center', cursor: 'pointer', color: 'var(--color-text-light)', transition: 'all 0.3s' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.color = 'var(--color-accent)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-light)'; }}
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <div className="d-flex gap-3">
                            {testimonials.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveTestimonial(idx)}
                                    style={{
                                        width: '40px', height: '2px', padding: 0, border: 'none',
                                        background: activeTestimonial === idx ? 'var(--color-accent)' : 'var(--color-border)',
                                        transition: 'all 0.3s', cursor: 'pointer'
                                    }}
                                />
                            ))}
                        </div>

                        <button
                            onClick={() => setActiveTestimonial(prev => (prev + 1) % testimonials.length)}
                            style={{ background: 'transparent', border: '1px solid var(--color-border)', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justify: 'center', cursor: 'pointer', color: 'var(--color-text-light)', transition: 'all 0.3s' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.color = 'var(--color-accent)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-light)'; }}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </section>

            {/* 6. Newsletter Hook */}
            <section style={{ padding: '8rem 0', background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)' }}>
                <div className="container fade-up-scroll" ref={addToRefs} style={{ maxWidth: '600px', textAlign: 'center' }}>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--color-text)', marginBottom: '1rem', fontWeight: 400 }}>
                        Join the Inner Circle
                    </h2>
                    <p style={{ color: 'var(--color-text-light)', fontSize: '1.05rem', marginBottom: '3rem', lineHeight: 1.6 }}>
                        Receive collection announcements, handloom artisan interviews, and early access code notifications straight to your inbox.
                    </p>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            alert("Thank you! You have successfully subscribed to Aakrithi's newsletters.");
                            e.target.reset();
                        }}
                        className="d-flex flex-column gap-4"
                    >
                        <input
                            type="email"
                            required
                            className="premium-input"
                            placeholder="EMAIL ADDRESS"
                        />
                        <button
                            type="submit"
                            className="btn-gold-solid"
                            style={{ width: '100%' }}
                        >
                            Subscribe to Elegance
                        </button>
                    </form>
                </div>
            </section>

        </AppLayout>
    );
}

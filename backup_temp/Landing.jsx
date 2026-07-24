import React, { useEffect } from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';

export default function Landing() {
    // Re-initialize Lucide icons after rendering
    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }

        // Editorial split hover background tracking logic
        const cards = document.querySelectorAll('.split-pane, .category-card, .feature-card');
        cards.forEach(card => {
            card.onmousemove = e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--x', `${x}px`);
                card.style.setProperty('--y', `${y}px`);
            };
        });
    }, []);

    return (
        <AppLayout>
            {/* 1. Cinematic Dual-Path Hero */}
            <section className="hero-fullscreen">
                <img 
                    src="/images/landing-hero.png" 
                    alt="Aakrithi Cinematic Background" 
                    className="hero-bg-media"
                />
                <div className="hero-overlay"></div>
                
                <div className="container h-100 d-flex flex-column align-items-center justify-content-center text-center">
                    <div className="brand-reveal" style={{ position: 'relative', zIndex: 10 }}>
                        <h1 
                            className="landing-title reveal-up" 
                            style={{
                                fontFamily: 'var(--font-serif)',
                                fontSize: 'clamp(3.5rem, 12vw, 8rem)',
                                fontWeight: 400,
                                letterSpacing: '0.25em',
                                marginRight: '-0.25em',
                                color: '#A88548'
                            }}
                        >
                            AAKRITHI
                        </h1>
                        <p 
                            className="landing-subtitle reveal-up reveal-delay-1 mt-3" 
                            style={{
                                letterSpacing: '0.6em',
                                marginRight: '-0.6em',
                                textTransform: 'uppercase',
                                color: '#AC8A4C',
                                fontSize: '0.85rem',
                                fontWeight: 500
                            }}
                        >
                            IT SUITS YOU BETTER
                        </p>
                    </div>
                </div>

                <div className="landing-scroll-hint">
                    <span>Scroll to Discover</span>
                    <div className="mouse-icon">
                        <div className="wheel"></div>
                    </div>
                </div>
            </section>

            {/* 1.5. Editorial Split (Boutique & Wholesale) */}
            <section id="discover" className="editorial-split d-flex flex-column flex-md-row w-100">
                <div className="split-pane retail-pane w-100 w-md-50 d-flex flex-column justify-content-end p-5">
                    <div className="pane-content reveal-up" style={{ zIndex: 1 }}>
                        <span className="pane-label" style={{ color: '#C5A059', fontSize: '0.8rem', letterSpacing: '3px', fontWeight: 700, textTransform: 'uppercase' }}>01 // Retail</span>
                        <h2 className="pane-title mt-3 mb-4" style={{ fontFamily: 'var(--font-serif)', fontSize: '3.5rem', color: '#2C1E16', lineHeight: 1.1 }}>Curated<br />Artisanal Fashion</h2>
                        <p className="pane-desc mb-5" style={{ color: 'rgba(44, 30, 22, 0.7)', maxWidth: '400px', lineHeight: 1.6 }}>Bespoke tailoring, intricate embroideries, and luxury ethnic wear crafted for the modern individual.</p>
                        <Link href="/boutique" className="btn-elegant d-inline-flex align-items-center justify-content-center text-decoration-none">
                            Enter Boutique <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ms-2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </Link>
                    </div>
                </div>
                
                <div className="split-pane wholesale-pane w-100 w-md-50 d-flex flex-column justify-content-end p-5">
                    <div className="pane-content reveal-up reveal-delay-1" style={{ zIndex: 1 }}>
                        <span className="pane-label" style={{ color: '#C5A059', fontSize: '0.8rem', letterSpacing: '3px', fontWeight: 700, textTransform: 'uppercase' }}>02 // B2B</span>
                        <h2 className="pane-title mt-3 mb-4" style={{ fontFamily: 'var(--font-serif)', fontSize: '3.5rem', color: '#FFFEF0', lineHeight: 1.1 }}>Wholesale<br />Excellence</h2>
                        <p className="pane-desc mb-5" style={{ color: 'rgba(255, 254, 240, 0.7)', maxWidth: '400px', lineHeight: 1.6 }}>Premium bulk ordering and global supply chain partnerships for discerning fashion houses globally.</p>
                        <Link href="/wholesale" className="btn-elegant-light d-inline-flex align-items-center justify-content-center text-decoration-none">
                            Access Portal <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ms-2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* 2. Artisanal Heritage Section */}
            <section className="heritage-section position-relative" style={{ padding: '12rem 0', overflow: 'hidden', background: '#FFFEF0' }}>
                <div className="container position-relative">
                    <div className="row align-items-center">
                        <div className="col-lg-7 position-relative z-1">
                            <div className="heritage-image-wrapper reveal-scale" style={{ position: 'relative' }}>
                                <img src="/images/craftsmanship.png" alt="Artisanal Embroidery" className="img-fluid" style={{ borderRadius: '20px', maxHeight: '800px', objectFit: 'cover', width: '100%', boxShadow: '0 30px 60px rgba(13, 94, 79, 0.1)' }} />
                                <div style={{ position: 'absolute', bottom: '-50px', right: '-50px', background: '#FFFEF0', padding: '3rem', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', maxWidth: '300px' }} className="d-none d-lg-block reveal-up reveal-delay-2">
                                    <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: '#2C1E16', fontStyle: 'italic', lineHeight: 1.4, margin: 0 }}>"Every stitch tells a story of ancient looms."</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-lg-5 ps-lg-5 mt-5 mt-lg-0 z-2">
                            <div className="heritage-content reveal-up">
                                <span className="highlight-text" style={{ color: '#C5A059', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.8rem', display: 'block', marginBottom: '2rem' }}>Our Heritage</span>
                                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', margin: '0 0 2rem', lineHeight: 1.1, color: '#2C1E16' }}>Crafting<br />Legacy for the<br />Modern Soul</h2>
                                <p style={{ fontSize: '1.1rem', color: 'rgba(44, 30, 22, 0.7)', lineHeight: 1.8, marginBottom: '3rem', maxWidth: '450px' }}>At Aakrithi, we bridge the gap between ancient artisanal craftsmanship and contemporary fashion silhouettes. Each piece is hand-stitched by master craftsmen, ensuring that the legacy of Indian textiles lives on in every fold.</p>
                                
                                <div className="heritage-stats d-flex gap-5 border-top pt-4" style={{ borderColor: 'rgba(13, 94, 79, 0.1)' }}>
                                    <div>
                                        <h4 style={{ color: '#C5A059', fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '0.5rem' }}>20+</h4>
                                        <p style={{ fontSize: '0.75rem', color: '#2C1E16', textTransform: 'uppercase', letterSpacing: '2px', margin: 0 }}>Master Artisans</p>
                                    </div>
                                    <div>
                                        <h4 style={{ color: '#C5A059', fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '0.5rem' }}>100%</h4>
                                        <p style={{ fontSize: '0.75rem', color: '#2C1E16', textTransform: 'uppercase', letterSpacing: '2px', margin: 0 }}>Sustainable</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. B2B Excellence Snapshot */}
            <section className="b2b-excellence" style={{ padding: '8rem 0', borderTop: '1px solid rgba(255, 254, 240, 0.2)' }}>
                <div className="premium-grid-bg"></div>
                <div className="container py-5 position-relative" style={{ zIndex: 2 }}>
                    <div className="text-center mb-5 reveal-up">
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 8vw, 3.5rem)', color: '#2C1E16' }}>Global Wholesale Excellence</h2>
                        <p style={{ opacity: 0.7, maxWidth: '600px', margin: '0 auto' }}>Powering boutiques and retailers across the globe with premium, quality-checked artisanal collections.</p>
                    </div>
                    
                    <div className="row g-5 reveal-up reveal-delay-2 justify-content-center">
                        <div className="col-lg-4 col-md-6">
                            <div className="feature-card glass-card premium-card h-100 p-4 text-center">
                                <span className="feature-number">01</span>
                                <div className="spirit-circle">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C5A059" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2" ry="2"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                                </div>
                                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#2C1E16', marginBottom: '1rem' }}>Global Logistics</h4>
                                <p style={{ fontSize: '0.9rem', opacity: 0.7, lineHeight: 1.6, margin: 0 }}>Secured priority shipping to over 25+ countries with real-time tracking and white-glove handling.</p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="feature-card glass-card premium-card h-100 p-4 text-center">
                                <span className="feature-number">02</span>
                                <div className="spirit-circle">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C5A059" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                                </div>
                                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#2C1E16', marginBottom: '1rem' }}>Quality Verified</h4>
                                <p style={{ fontSize: '0.9rem', opacity: 0.7, lineHeight: 1.6, margin: 0 }}>Rigorous multi-stage QC process for every bulk shipment, ensuring artisanal perfection in every piece.</p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="feature-card glass-card premium-card h-100 p-4 text-center">
                                <span className="feature-number">03</span>
                                <div className="spirit-circle">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C5A059" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path></svg>
                                </div>
                                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#2C1E16', marginBottom: '1rem' }}>Quick Restock</h4>
                                <p style={{ fontSize: '0.9rem', opacity: 0.7, lineHeight: 1.6, margin: 0 }}>Dedicated B2B dashboard for recurring inventory fulfillment and seasonal collection previews.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Signature Collections Preview */}
            <section style={{ padding: '12rem 0', background: '#FFFEF0' }}>
                <div className="container py-5">
                    <div className="section-header reveal-up d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 border-bottom pb-4" style={{ borderColor: 'rgba(13, 94, 79, 0.1)' }}>
                        <div>
                            <span style={{ color: '#C5A059', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', fontSize: '0.8rem', display: 'block', marginBottom: '1rem' }}>Curated For You</span>
                            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#2C1E16', margin: 0 }}>Signature Collections</h2>
                        </div>
                        <Link href="/boutique" className="btn-elegant mt-4 mt-md-0 text-decoration-none">Explore All</Link>
                    </div>

                    <div className="row g-4 mt-5">
                        <div className="col-md-4 mt-md-0">
                            <Link href="/category/apparels" className="category-card reveal-up" style={{ textDecoration: 'none', display: 'block', height: '500px', position: 'relative', overflow: 'hidden', borderRadius: '20px' }}>
                                <img src="/images/cat_dresses.png" alt="Designer Apparels" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s' }} />
                                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '3rem 2rem', background: 'linear-gradient(transparent, rgba(26, 60, 52, 0.95))', color: 'white' }}>
                                    <span style={{ fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', color: '#FFFEF0', opacity: 0.8 }}>Category</span>
                                    <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', margin: '0.5rem 0 0', color: '#FFFEF0' }}>Handcrafted Apparels</h4>
                                </div>
                            </Link>
                        </div>
                        <div className="col-md-4 mt-md-5 pt-md-4">
                            <Link href="/category/kutties" className="category-card reveal-up reveal-delay-1" style={{ textDecoration: 'none', display: 'block', height: '600px', position: 'relative', overflow: 'hidden', borderRadius: '20px' }}>
                                <img src="/images/cat_sets.png" alt="Traditional Kerala Sets" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s' }} />
                                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '3rem 2rem', background: 'linear-gradient(transparent, rgba(26, 60, 52, 0.95))', color: 'white' }}>
                                    <span style={{ fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', color: '#FFFEF0', opacity: 0.8 }}>Category</span>
                                    <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', margin: '0.5rem 0 0', color: '#FFFEF0' }}>Artisanal Kutties</h4>
                                </div>
                            </Link>
                        </div>
                        <div className="col-md-4 mt-md-3">
                            <Link href="/category/decors" className="category-card reveal-up reveal-delay-2" style={{ textDecoration: 'none', display: 'block', height: '450px', position: 'relative', overflow: 'hidden', borderRadius: '20px' }}>
                                <img src="/images/cat_sarees.png" alt="Embroidered Sarees" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s' }} />
                                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '3rem 2rem', background: 'linear-gradient(transparent, rgba(26, 60, 52, 0.95))', color: 'white' }}>
                                    <span style={{ fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', color: '#FFFEF0', opacity: 0.8 }}>Category</span>
                                    <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', margin: '0.5rem 0 0', color: '#FFFEF0' }}>Signature Sarees</h4>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}

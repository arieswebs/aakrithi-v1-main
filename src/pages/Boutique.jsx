import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, ArrowRight, Instagram, Sparkles } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import { useApp } from '../context/AppContext';

export default function Boutique() {
    const { addToCart, toggleWishlist, wishlist } = useApp();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/products?is_wholesale=false&sort=latest')
            .then(res => res.json())
            .then(data => {
                if (data.products) {
                    setProducts(data.products.slice(0, 8));
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading products:", err);
                setLoading(false);
            });
    }, []);

    const isProductInWishlist = (productId) => {
        return wishlist.some(item => item.id === productId);
    };

    return (
        <AppLayout>
            {/* Custom Embedded CSS Styles for Boutique Micro-interactions */}
            <style>{`
                .boutique-hero {
                    position: relative;
                    height: calc(100vh - var(--header-height, 70px));
                    min-height: 500px;
                    background: url('/images/boutique-hero.png') no-repeat center center;
                    background-size: cover;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }
                .boutique-hero-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(180deg, rgba(44, 30, 22, 0.3) 0%, rgba(44, 30, 22, 0.8) 70%, var(--color-background) 100%);
                    z-index: 1;
                }
                .hero-border-frame {
                    position: absolute;
                    inset: 1rem;
                    border: 1px solid rgba(197, 160, 89, 0.3);
                    pointer-events: none;
                    z-index: 2;
                }
                @media (min-width: 768px) {
                    .hero-border-frame {
                        inset: 2.5rem;
                    }
                    .boutique-grid-section {
                        padding-top: 8rem !important;
                        padding-bottom: 8rem !important;
                    }
                }
                .boutique-grid-section {
                    padding-top: 4rem !important;
                    padding-bottom: 5rem !important;
                }
                .category-card-premium {
                    position: relative;
                    display: block;
                    height: 480px;
                    border-radius: 20px;
                    overflow: hidden;
                    text-decoration: none;
                    border: 1px solid var(--color-border);
                    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .category-card-premium img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .category-card-premium:hover img {
                    transform: scale(1.08);
                }
                .category-card-premium:hover {
                    transform: translateY(-8px);
                    border-color: var(--color-accent);
                    box-shadow: 0 25px 50px rgba(197, 160, 89, 0.12);
                }
                .category-text-box {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    padding: 2.5rem 2rem;
                    background: linear-gradient(0deg, rgba(44, 30, 22, 0.95) 0%, rgba(44, 30, 22, 0.6) 60%, rgba(44, 30, 22, 0) 100%);
                    color: var(--color-primary);
                    z-index: 2;
                    transition: all 0.4s;
                }
                .category-card-premium:hover .category-text-box {
                    padding-bottom: 3rem;
                }
                .product-card-premium {
                    text-decoration: none;
                    color: inherit;
                    background: transparent !important;
                    border: none !important;
                    box-shadow: none !important;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }
                .product-image-container-wrap {
                    position: relative;
                    overflow: hidden;
                    aspect-ratio: 2/3;
                    background: #f9f9f9;
                    border-radius: 12px;
                }
                .hover-scale-img {
                    transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .product-card-premium:hover .hover-scale-img {
                    transform: scale(1.05);
                }
                .insta-item-premium {
                    position: relative;
                    overflow: hidden;
                    border-radius: 16px;
                    aspect-ratio: 1/1;
                    border: 1px solid var(--color-border);
                    cursor: pointer;
                }
                .insta-item-premium img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .insta-item-premium:hover img {
                    transform: scale(1.1);
                }
                .insta-hover-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(197, 160, 89, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    color: var(--color-primary);
                    transition: opacity 0.4s ease;
                    z-index: 2;
                }
                .insta-item-premium:hover .insta-hover-overlay {
                    opacity: 1;
                }
                .btn-boutique-primary {
                    background: var(--color-accent);
                    color: var(--color-primary) !important;
                    border: 1.5px solid var(--color-accent);
                    border-radius: 30px;
                    padding: 14px 38px;
                    font-weight: 600;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    font-size: 0.85rem;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    text-decoration: none;
                }
                .btn-boutique-primary:hover {
                    background: transparent;
                    color: var(--color-accent) !important;
                    box-shadow: 0 8px 24px rgba(197, 160, 89, 0.2);
                }
                .btn-boutique-link {
                    color: var(--color-accent);
                    font-weight: 700;
                    font-size: 0.85rem;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    transition: gap 0.3s;
                }
                .btn-boutique-link:hover {
                    gap: 12px;
                }
            `}</style>

            {/* 1. Cinematic Hero Section with Frame Border */}
            <section className="boutique-hero">
                <div className="boutique-hero-overlay"></div>
                <div className="hero-border-frame"></div>
                
                <div className="container h-100 d-flex flex-column align-items-center justify-content-center text-center position-relative" style={{ zIndex: 10, padding: '0 1.5rem' }}>
                    <span style={{ color: 'var(--color-accent)', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                        <Sparkles size={14} /> The Retail Experience
                    </span>
                    <h1 
                        style={{ 
                            fontFamily: 'var(--font-serif)', 
                            fontSize: 'clamp(2.5rem, 8vw, 4.8rem)', 
                            lineHeight: 1.1, 
                            color: 'var(--color-primary)', 
                            textTransform: 'uppercase', 
                            letterSpacing: '0.12em',
                            fontWeight: 400
                        }}
                    >
                        it suits you better
                    </h1>
                    <p style={{ fontSize: '1.05rem', maxWidth: '620px', margin: '1rem auto 2rem', color: 'var(--color-primary)', opacity: 0.85, lineHeight: 1.6 }}>
                        Step into a realm of bespoke tailoring, antique weaves, and luxury silhouettes crafted meticulously for your personal stories.
                    </p>
                    <Link to="/shop" className="btn-boutique-primary">
                        Explore Collection
                    </Link>
                </div>
            </section>

            {/* 2. Main Page Grid Section */}
            <div className="container boutique-grid-section">
                
                {/* Categories Header */}
                <div className="d-flex justify-content-between align-items-end mb-5 flex-wrap gap-3">
                    <div>
                        <span style={{ color: 'var(--color-accent)', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', fontSize: '0.75rem', display: 'block', marginBottom: '0.5rem' }}>
                            // Curated Collections
                        </span>
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 2.8rem)', color: 'var(--color-text)', margin: 0, fontWeight: 500 }}>
                            Shop by Category
                        </h2>
                    </div>
                    <Link to="/shop" className="btn-boutique-link">
                        View All Collections <ArrowRight size={16} />
                    </Link>
                </div>
                
                {/* Categories Grid */}
                <div className="row g-4 mb-6">
                    <div className="col-md-4">
                        <Link to="/category/apparels" className="category-card-premium">
                            <img src="/images/cat_dresses.png" alt="Designer Apparels" />
                            <div className="category-text-box">
                                <span style={{ color: 'var(--color-accent)', fontSize: '0.75rem', letterSpacing: '2px', fontWeight: 700, textTransform: 'uppercase' }}>Collection 01</span>
                                <h3 style={{ fontSize: '1.45rem', fontFamily: 'var(--font-serif)', marginTop: '0.25rem', marginBottom: '0.5rem' }}>Designer Apparels</h3>
                                <p style={{ fontSize: '0.8rem', opacity: 0.7, margin: 0 }}>Elegant custom silhouettes and modern wear.</p>
                            </div>
                        </Link>
                    </div>
                    <div className="col-md-4">
                        <Link to="/category/kutties" className="category-card-premium">
                            <img src="/images/cat_sets.png" alt="Kerala Traditional Sets" />
                            <div className="category-text-box">
                                <span style={{ color: 'var(--color-accent)', fontSize: '0.75rem', letterSpacing: '2px', fontWeight: 700, textTransform: 'uppercase' }}>Collection 02</span>
                                <h3 style={{ fontSize: '1.45rem', fontFamily: 'var(--font-serif)', marginTop: '0.25rem', marginBottom: '0.5rem' }}>Kerala Traditional Sets</h3>
                                <p style={{ fontSize: '0.8rem', opacity: 0.7, margin: 0 }}>Classic handloom cream gold styles.</p>
                            </div>
                        </Link>
                    </div>
                    <div className="col-md-4">
                        <Link to="/category/decors" className="category-card-premium">
                            <img src="/images/cat_sarees.png" alt="Embroidered Sarees" />
                            <div className="category-text-box">
                                <span style={{ color: 'var(--color-accent)', fontSize: '0.75rem', letterSpacing: '2px', fontWeight: 700, textTransform: 'uppercase' }}>Collection 03</span>
                                <h3 style={{ fontSize: '1.45rem', fontFamily: 'var(--font-serif)', marginTop: '0.25rem', marginBottom: '0.5rem' }}>Embroidered Sarees</h3>
                                <p style={{ fontSize: '0.8rem', opacity: 0.7, margin: 0 }}>Exquisite traditional loom weaves.</p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Signature Collections Header */}
                <div className="d-flex justify-content-between align-items-end mb-5 flex-wrap gap-3 mt-5">
                    <div>
                        <span style={{ color: 'var(--color-accent)', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', fontSize: '0.75rem', display: 'block', marginBottom: '0.5rem' }}>
                            // Seasonal Highlights
                        </span>
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 2.8rem)', color: 'var(--color-text)', margin: 0, fontWeight: 500 }}>
                            Signature Designs
                        </h2>
                    </div>
                    <Link to="/shop" className="btn-boutique-link">
                        View All Products <ArrowRight size={16} />
                    </Link>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-warning" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div className="row g-4 mb-6">
                        {products.map((product) => {
                            const inWishlist = isProductInWishlist(product.id);
                            return (
                                <div key={product.id} className="col-6 col-md-6 col-lg-3">
                                    <Link to={`/product/${product.slug}`} className="product-card-premium">
                                        
                                        {/* Image Container with Hover Zoom and Overlay */}
                                        <div className="product-image-container-wrap">
                                            {/* Badge */}
                                            {product.badge && (
                                                <span style={{
                                                    position: 'absolute',
                                                    top: '12px',
                                                    left: '12px',
                                                    zIndex: 3,
                                                    color: 'var(--color-text)',
                                                    fontSize: '0.65rem',
                                                    textTransform: 'uppercase',
                                                    fontWeight: 500,
                                                    letterSpacing: '1px'
                                                }}>
                                                    {product.badge}
                                                </span>
                                            )}

                                            {/* Wishlist Button (Minimalist stroke) */}
                                            <button 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    toggleWishlist(product);
                                                }}
                                                style={{
                                                    position: 'absolute',
                                                    top: '12px',
                                                    right: '12px',
                                                    zIndex: 3,
                                                    border: 'none',
                                                    background: 'transparent',
                                                    color: inWishlist ? 'red' : 'var(--color-text)',
                                                    width: '24px',
                                                    height: '24px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'transform 0.2s ease'
                                                }}
                                            >
                                                <Heart size={16} fill={inWishlist ? 'red' : 'none'} strokeWidth={1.5} />
                                            </button>

                                            <img src={product.image} alt={product.name} className="hover-scale-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>

                                        {/* Product Info (Ultra-Minimalist Layout) */}
                                        <div style={{ padding: '1rem 0', textAlign: 'left', flexGrow: 1, display: 'flex', flexDirection: 'column', justify: 'space-between' }}>
                                            <div>
                                                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'rgba(44, 30, 22, 0.6)', letterSpacing: '2px', display: 'block', marginBottom: '4px' }}>
                                                    {product.category}
                                                </span>
                                                <h3 style={{ 
                                                    fontSize: '0.9rem', 
                                                    fontFamily: 'var(--font-family)', 
                                                    color: 'var(--color-text)', 
                                                    margin: '0 0 4px 0', 
                                                    fontWeight: 400,
                                                    lineHeight: '1.4',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 1,
                                                    WebkitBoxOrient: 'vertical'
                                                }}>
                                                    {product.name}
                                                </h3>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
                                                <span style={{ fontWeight: 400, fontSize: '0.9rem', color: 'var(--color-text)', display: 'block' }}>
                                                    ₹{new Intl.NumberFormat('en-IN').format(product.price)}
                                                </span>
                                                <button 
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        addToCart(product, 'Free Size');
                                                        alert(`${product.name} added to bag!`);
                                                    }}
                                                    style={{
                                                        width: '100%',
                                                        background: 'var(--color-text)',
                                                        border: '1px solid var(--color-text)',
                                                        borderRadius: '30px',
                                                        padding: '10px',
                                                        fontSize: '0.75rem',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '1.5px',
                                                        color: 'var(--color-primary)',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                                                        fontWeight: 600,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '8px',
                                                        marginTop: '4px'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.background = 'transparent';
                                                        e.target.style.color = 'var(--color-text)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.background = 'var(--color-text)';
                                                        e.target.style.color = 'var(--color-primary)';
                                                    }}
                                                >
                                                    <ShoppingBag size={14} />
                                                    Add to Bag
                                                </button>
                                            </div>
                                        </div>

                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Instagram Header */}
                <div className="text-center mb-5 mt-5 pt-5">
                    <span style={{ color: 'var(--color-accent)', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', fontSize: '0.75rem', display: 'block', marginBottom: '0.5rem' }}>
                        // The Lookbook
                    </span>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 2.8rem)', color: 'var(--color-text)', margin: 0, fontWeight: 500 }}>
                        Follow @aakrithiclothing
                    </h2>
                    <p style={{ color: 'var(--color-text-light)', fontSize: '0.95rem', marginTop: '0.5rem' }}>Inspired by our community around the globe</p>
                </div>

                {/* Instagram Grid Redesign */}
                <div className="row g-3">
                    <div className="col-6 col-md-4 col-lg-2">
                        <div className="insta-item-premium">
                            <img src="/images/insta_1.png" alt="Insta 1" />
                            <div className="insta-hover-overlay">
                                <Instagram size={24} />
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-2">
                        <div className="insta-item-premium">
                            <img src="/images/prod_1.png" alt="Insta 2" />
                            <div className="insta-hover-overlay">
                                <Instagram size={24} />
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-2">
                        <div className="insta-item-premium">
                            <img src="/images/prod_2.png" alt="Insta 3" />
                            <div className="insta-hover-overlay">
                                <Instagram size={24} />
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-2">
                        <div className="insta-item-premium">
                            <img src="/images/prod_3.png" alt="Insta 4" />
                            <div className="insta-hover-overlay">
                                <Instagram size={24} />
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-2">
                        <div className="insta-item-premium">
                            <img src="/images/cat_dresses.png" alt="Insta 5" />
                            <div className="insta-hover-overlay">
                                <Instagram size={24} />
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-2">
                        <div className="insta-item-premium">
                            <img src="/images/cat_sets.png" alt="Insta 6" />
                            <div className="insta-hover-overlay">
                                <Instagram size={24} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}

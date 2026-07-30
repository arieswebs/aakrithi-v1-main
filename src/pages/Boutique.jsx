import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, ArrowRight, Instagram, Sparkles } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import { useApp } from '../context/AppContext';
import './LandingPremium.css';

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
            {/* 1. Cinematic Hero Section with Frame Border */}
            <section className="boutique-hero fade-up-scroll is-visible">
                <div className="boutique-hero-overlay"></div>
                <div className="hero-border-frame"></div>
                
                <div className="container h-100 d-flex flex-column align-items-center justify-content-center text-center position-relative" style={{ zIndex: 10, padding: '0 1.5rem', marginTop: '4rem' }}>
                    <span className="text-gold-accent mb-4 text-reveal delay-100" style={{ letterSpacing: '6px', fontSize: '0.8rem' }}>
                        <Sparkles size={14} style={{ marginRight: '8px' }} /> THE RETAIL EXPERIENCE
                    </span>
                    <h1 className="hero-royal-title-premium text-reveal delay-300" style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', fontFamily: 'var(--font-serif)', lineHeight: 1.0, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text)', fontWeight: 400 }}>
                        It Suits You <br/> Better
                    </h1>
                    <p className="text-reveal delay-500" style={{ fontSize: '1.1rem', maxWidth: '550px', margin: '2rem auto 3rem', color: 'var(--color-text-light)', lineHeight: 1.8, letterSpacing: '0.5px', fontWeight: 300 }}>
                        Step into a realm of bespoke tailoring, antique weaves, and luxury silhouettes crafted meticulously for your personal stories.
                    </p>
                    <div className="text-reveal delay-700">
                        <Link to="/shop" className="btn-gold-outline" style={{ padding: '16px 42px', fontSize: '0.8rem', letterSpacing: '3px' }}>
                            Explore Collection
                        </Link>
                    </div>
                </div>
            </section>

            {/* 2. Main Page Grid Section */}
            <div className="container boutique-grid-section">
                
                {/* Categories Header */}
                <div className="d-flex justify-content-between align-items-end mb-5 flex-wrap gap-3 fade-up-scroll is-visible">
                    <div>
                        <span className="text-gold-accent mb-2">
                            // Curated Collections
                        </span>
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--color-text)', margin: 0, fontWeight: 500 }}>
                            Shop by Category
                        </h2>
                    </div>
                    <Link to="/shop" className="btn-boutique-link">
                        View All Collections <ArrowRight size={18} />
                    </Link>
                </div>
                
                {/* Categories Grid */}
                <div className="row g-4 mb-6">
                    <div className="col-md-4 fade-up-scroll is-visible delay-100">
                        <Link to="/category/apparels" className="category-card-premium">
                            <div className="category-img-container">
                                <img src="/images/cat_dresses.png" alt="Designer Apparels" />
                            </div>
                            <div className="category-text-box">
                                <span className="text-gold-accent mb-1">Collection 01</span>
                                <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', margin: '0 0 0.25rem 0', color: 'var(--color-text)' }}>Designer Apparels</h3>
                                <p style={{ fontSize: '0.85rem', color: 'rgba(44, 30, 22, 0.6)', margin: 0 }}>Elegant custom silhouettes and modern wear.</p>
                            </div>
                        </Link>
                    </div>
                    <div className="col-md-4 fade-up-scroll is-visible delay-300">
                        <Link to="/category/kutties" className="category-card-premium">
                            <div className="category-img-container">
                                <img src="/images/cat_sets.png" alt="Kerala Traditional Sets" />
                            </div>
                            <div className="category-text-box">
                                <span className="text-gold-accent mb-1">Collection 02</span>
                                <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', margin: '0 0 0.25rem 0', color: 'var(--color-text)' }}>Kerala Traditional Sets</h3>
                                <p style={{ fontSize: '0.85rem', color: 'rgba(44, 30, 22, 0.6)', margin: 0 }}>Classic handloom cream gold styles.</p>
                            </div>
                        </Link>
                    </div>
                    <div className="col-md-4 fade-up-scroll is-visible delay-500">
                        <Link to="/category/decors" className="category-card-premium">
                            <div className="category-img-container">
                                <img src="/images/cat_sarees.png" alt="Embroidered Sarees" />
                            </div>
                            <div className="category-text-box">
                                <span className="text-gold-accent mb-1">Collection 03</span>
                                <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', margin: '0 0 0.25rem 0', color: 'var(--color-text)' }}>Embroidered Sarees</h3>
                                <p style={{ fontSize: '0.85rem', color: 'rgba(44, 30, 22, 0.6)', margin: 0 }}>Exquisite traditional loom weaves.</p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Signature Collections Header */}
                <div className="d-flex justify-content-between align-items-end mb-5 flex-wrap gap-3 mt-5 pt-4 fade-up-scroll is-visible">
                    <div>
                        <span className="text-gold-accent mb-2">
                            // Seasonal Highlights
                        </span>
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--color-text)', margin: 0, fontWeight: 500 }}>
                            Signature Designs
                        </h2>
                    </div>
                    <Link to="/shop" className="btn-boutique-link">
                        View All Products <ArrowRight size={18} />
                    </Link>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border" style={{ color: 'var(--color-accent)' }} role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div className="row g-4 mb-6">
                        {products.map((product, index) => {
                            const inWishlist = isProductInWishlist(product.id);
                            const delayClass = `delay-${(index % 4) * 100}`;
                            return (
                                <div key={product.id} className={`col-6 col-md-4 col-lg-3 fade-up-scroll is-visible ${delayClass}`}>
                                    <Link to={`/product/${product.slug}`} className="premium-product-card">
                                        
                                        {/* Image Container */}
                                        <div className="premium-product-img-wrap">
                                            {/* Badge */}
                                            {product.badge && (
                                                <span style={{
                                                    position: 'absolute',
                                                    top: '12px',
                                                    left: '12px',
                                                    zIndex: 3,
                                                    background: 'rgba(255, 255, 255, 0.9)',
                                                    backdropFilter: 'blur(4px)',
                                                    padding: '4px 10px',
                                                    color: 'var(--color-text)',
                                                    fontSize: '0.65rem',
                                                    textTransform: 'uppercase',
                                                    fontWeight: 600,
                                                    letterSpacing: '1px'
                                                }}>
                                                    {product.badge}
                                                </span>
                                            )}

                                            {/* Wishlist Button */}
                                            <button 
                                                className="premium-wishlist-btn"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    toggleWishlist(product);
                                                }}
                                            >
                                                <Heart size={18} fill={inWishlist ? 'red' : 'none'} stroke={inWishlist ? 'red' : 'currentColor'} strokeWidth={1.5} />
                                            </button>

                                            <img src={product.image} alt={product.name} className="premium-product-img" />

                                            {/* Slide-up Add Button */}
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

                                        {/* Product Info */}
                                        <div style={{ padding: '1.25rem 0', textAlign: 'center' }}>
                                            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-accent)', letterSpacing: '2px', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                                                {product.category}
                                            </span>
                                            <h3 style={{ 
                                                fontSize: '1.05rem', 
                                                fontFamily: 'var(--font-serif)', 
                                                color: 'var(--color-text)', 
                                                margin: '0 0 8px 0', 
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
                                            <span style={{ fontWeight: 500, fontSize: '0.95rem', color: 'rgba(44, 30, 22, 0.8)' }}>
                                                ₹{new Intl.NumberFormat('en-IN').format(product.price)}
                                            </span>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Instagram Header */}
                <div className="text-center mb-5 mt-5 pt-5 fade-up-scroll is-visible">
                    <span className="text-gold-accent justify-content-center mb-3">
                        // The Lookbook
                    </span>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--color-text)', margin: 0, fontWeight: 500 }}>
                        Follow @aakrithiclothing
                    </h2>
                    <p style={{ color: 'rgba(44, 30, 22, 0.6)', fontSize: '1rem', marginTop: '1rem' }}>Inspired by our community around the globe</p>
                </div>

                {/* Instagram Grid */}
                <div className="row g-3 fade-up-scroll is-visible">
                    <div className="col-6 col-md-4 col-lg-2">
                        <div className="insta-item-premium">
                            <img src="/images/insta_1.png" alt="Insta 1" />
                            <div className="insta-hover-overlay">
                                <Instagram size={32} />
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-2">
                        <div className="insta-item-premium">
                            <img src="/images/prod_1.png" alt="Insta 2" />
                            <div className="insta-hover-overlay">
                                <Instagram size={32} />
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-2">
                        <div className="insta-item-premium">
                            <img src="/images/prod_2.png" alt="Insta 3" />
                            <div className="insta-hover-overlay">
                                <Instagram size={32} />
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-2">
                        <div className="insta-item-premium">
                            <img src="/images/prod_3.png" alt="Insta 4" />
                            <div className="insta-hover-overlay">
                                <Instagram size={32} />
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-2">
                        <div className="insta-item-premium">
                            <img src="/images/cat_dresses.png" alt="Insta 5" />
                            <div className="insta-hover-overlay">
                                <Instagram size={32} />
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-2">
                        <div className="insta-item-premium">
                            <img src="/images/cat_sets.png" alt="Insta 6" />
                            <div className="insta-hover-overlay">
                                <Instagram size={32} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}

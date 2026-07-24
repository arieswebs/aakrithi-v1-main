import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import { useApp } from '../context/AppContext';

export default function Wishlist() {
    const { wishlist, toggleWishlist, addToCart } = useApp();

    return (
        <AppLayout>
            <div className="container wishlist-page animate-fade-in" style={{ paddingTop: '4rem', paddingBottom: '7rem', minHeight: '80vh' }}>
                <div className="wishlist-header mb-5">
                    <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text)', fontSize: '2.5rem', fontWeight: 500, margin: 0 }}>
                        My Wishlist
                    </h1>
                    <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                        {wishlist.length === 1 ? '1 Item saved' : `${wishlist.length} Items saved`}
                    </p>
                </div>

                {wishlist.length === 0 ? (
                    <div className="empty-wishlist text-center py-5" style={{ background: 'var(--color-surface)', borderRadius: '16px', border: '1px solid var(--color-border)', padding: '4rem 2rem' }}>
                        <Heart size={48} style={{ opacity: 0.15, color: 'var(--color-text)', marginBottom: '1.5rem' }} />
                        <p style={{ fontSize: '1.2rem', color: 'var(--color-text-light)', marginBottom: '2.5rem' }}>Your wishlist is empty.</p>
                        <Link to="/shop" className="btn btn-dark" style={{ background: 'var(--color-accent)', border: 'none', padding: '12px 30px', borderRadius: '30px', fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}>
                            Explore Collection
                        </Link>
                    </div>
                ) : (
                    <div className="wishlist-grid-container">
                        <style>{`
                            .wishlist-grid {
                                display: grid;
                                grid-template-columns: repeat(2, 1fr);
                                gap: 20px;
                            }
                            @media (min-width: 768px) {
                                .wishlist-grid {
                                    grid-template-columns: repeat(3, 1fr);
                                    gap: 30px;
                                }
                            }
                            @media (min-width: 992px) {
                                .wishlist-grid {
                                    grid-template-columns: repeat(4, 1fr);
                                    gap: 40px;
                                }
                            }
                            .wishlist-product-card {
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
                            .wishlist-product-card:hover .hover-scale-img {
                                transform: scale(1.05);
                            }
                            }
                        `}</style>
                        <div className="wishlist-grid">
                            {wishlist.map((product) => (
                                <div key={product.id} className="product-card-wrapper position-relative">
                                    <Link to={`/product/${product.slug}`} className="wishlist-product-card">
                                        
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

                                            {/* Trash/Remove Button (Minimalist stroke) */}
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
                                                    color: '#dc3545',
                                                    width: '24px',
                                                    height: '24px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'transform 0.2s ease'
                                                }}
                                                title="Remove from wishlist"
                                            >
                                                <Trash2 size={16} strokeWidth={1.5} />
                                            </button>

                                            <img 
                                                src={product.image} 
                                                alt={product.name} 
                                                className="hover-scale-img"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
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
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

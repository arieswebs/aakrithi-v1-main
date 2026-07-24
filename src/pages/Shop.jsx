import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ShoppingBag, Heart, SlidersHorizontal } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import { useApp } from '../context/AppContext';

export default function Shop() {
    const { addToCart, toggleWishlist, wishlist } = useApp();
    const [searchParams, setSearchParams] = useSearchParams();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const category = searchParams.get('category') || 'all';
    const sort = searchParams.get('sort') || 'latest';
    const search = searchParams.get('search') || '';

    // Fetch filtered products when search parameters change
    useEffect(() => {
        setLoading(true);
        const queryParams = new URLSearchParams({
            category,
            sort,
            search,
            is_wholesale: 'false'
        });

        fetch(`/api/products?${queryParams.toString()}`)
            .then(res => res.json())
            .then(data => {
                if (data.products) {
                    setProducts(data.products);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading products:", err);
                setLoading(false);
            });
    }, [category, sort, search]);

    const handleSortChange = (newSort) => {
        const params = new URLSearchParams(searchParams);
        params.set('sort', newSort);
        setSearchParams(params);
    };

    const isProductInWishlist = (productId) => {
        return wishlist.some(item => item.id === productId);
    };

    return (
        <AppLayout>
            <div className="container shop-page animate-fade-in" style={{ padding: '4rem 1rem', minHeight: '80vh' }}>
                <div className="shop-header mb-4">
                    <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text)', fontSize: '3rem', textTransform: 'capitalize' }}>
                        {category === 'all' ? 'All Shop' : category}
                    </h1>
                    <p className="product-count" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
                        {loading ? 'Loading...' : `${products.length} Products`}
                    </p>
                </div>

                <div className="shop-toolbar d-flex justify-content-between align-items-center mb-5 p-3" style={{ background: 'var(--color-surface)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                    <button className="filter-toggle btn bg-transparent border-0 d-flex align-items-center gap-2" style={{ color: 'var(--color-text)', fontWeight: 600 }}>
                        <SlidersHorizontal size={18} /> Filters
                    </button>
                    <div className="shop-controls">
                        <div className="sort-control d-flex align-items-center gap-2">
                            <span style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>Sort by:</span>
                            <select 
                                id="price-sort" 
                                value={sort} 
                                onChange={(e) => handleSortChange(e.target.value)}
                                style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-primary)', color: 'var(--color-text)', fontWeight: 500 }}
                            >
                                <option value="latest">Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="newest">Newest</option>
                            </select>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-warning" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div className="products-grid-container">
                        <style>{`
                            .products-grid {
                                display: grid;
                                grid-template-columns: repeat(2, 1fr);
                                gap: 20px;
                            }
                            @media (min-width: 768px) {
                                .products-grid {
                                    grid-template-columns: repeat(3, 1fr);
                                    gap: 30px;
                                }
                            }
                            @media (min-width: 992px) {
                                .products-grid {
                                    grid-template-columns: repeat(4, 1fr);
                                    gap: 40px;
                                }
                            }
                            .shop-product-card {
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
                            .shop-product-card:hover .hover-scale-img {
                                transform: scale(1.05);
                            }
                            }
                        `}</style>
                        <div className="products-grid">
                            {products.map((product) => {
                                const inWishlist = isProductInWishlist(product.id);
                                return (
                                    <div key={product.id} className="product-card-wrapper position-relative">
                                        <Link to={`/product/${product.slug}`} className="shop-product-card">
                                            
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
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
    Star, Heart, ShoppingBag, Zap, MapPin, Loader, 
    CheckCircle, XCircle, ChevronRight, X, User, Mail, Lock, Share2, Info
} from 'lucide-react';
import AppLayout from '../components/AppLayout';
import { useApp } from '../context/AppContext';

export default function ProductDetails() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { addToCart, toggleWishlist, wishlist, user, login } = useApp();

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [mainImage, setMainImage] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [activeTab, setActiveTab] = useState('description');
    
    // Pincode check states
    const [pincode, setPincode] = useState('');
    const [checkingPincode, setCheckingPincode] = useState(false);
    const [pincodeResult, setPincodeResult] = useState(null);

    // Auth modal states
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState('signup'); // 'signup' or 'login'
    const [authName, setAuthName] = useState('');
    const [authEmail, setAuthEmail] = useState('');
    const [authPassword, setAuthPassword] = useState('');
    const [authConfirmPassword, setAuthConfirmPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [authLoading, setAuthLoading] = useState(false);
    const [shareCopied, setShareCopied] = useState(false);

    // Fetch product details
    useEffect(() => {
        setLoading(true);
        setError(null);
        fetch(`/api/products/details/${slug}`)
            .then(res => {
                if (!res.ok) {
                    if (res.status === 404) {
                        throw new Error('Product not found');
                    }
                    throw new Error('Failed to load product details');
                }
                return res.json();
            })
            .then(data => {
                if (data.product) {
                    setProduct(data.product);
                    setMainImage(data.product.image);
                    setRelatedProducts(data.relatedProducts || []);
                } else {
                    throw new Error('Product not found');
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading product:", err);
                setError(err.message);
                setLoading(false);
            });
    }, [slug]);

    // Parse gallery images
    const galleryImages = useMemo(() => {
        if (!product) return [];
        const images = [product.image];
        if (product.gallery) {
            if (Array.isArray(product.gallery)) {
                images.push(...product.gallery);
            } else if (typeof product.gallery === 'string') {
                try {
                    const parsed = JSON.parse(product.gallery);
                    if (Array.isArray(parsed)) {
                        images.push(...parsed);
                    }
                } catch (e) {
                    // Ignore
                }
            }
        }
        return [...new Set(images.filter(Boolean))];
    }, [product]);

    // Parse sizes
    const sizes = useMemo(() => {
        if (!product) return ['Free Size'];
        if (!product.sizes) return ['Free Size'];
        if (Array.isArray(product.sizes)) return product.sizes;
        if (typeof product.sizes === 'string') {
            try {
                const parsed = JSON.parse(product.sizes);
                if (Array.isArray(parsed)) return parsed;
            } catch (e) {
                // Ignore
            }
        }
        return ['Free Size'];
    }, [product]);

    // Set initial size
    useEffect(() => {
        if (sizes.length > 0) {
            setSelectedSize(sizes[0]);
        }
    }, [sizes]);

    const isProductInWishlist = (id) => wishlist.some(item => item.id === id);

    const handleAddToCart = () => {
        if (!product) return;
        addToCart(product, selectedSize);
        alert(`${product.name} (${selectedSize}) added to bag!`);
    };

    const handleBuyNow = () => {
        if (!product) return;
        if (user) {
            addToCart(product, selectedSize);
            navigate('/checkout');
        } else {
            setAuthModalOpen(true);
        }
    };

    const handleGuestCheckout = () => {
        if (!product) return;
        addToCart(product, selectedSize);
        setAuthModalOpen(false);
        navigate('/checkout');
    };

    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        setAuthError('');
        setAuthLoading(true);

        const url = authMode === 'signup' ? '/api/auth/register' : '/api/auth/login';
        const bodyData = authMode === 'signup' ? {
            name: authName,
            email: authEmail,
            password: authPassword,
            password_confirmation: authConfirmPassword
        } : {
            email: authEmail,
            password: authPassword
        };

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            });
            const data = await res.json();
            if (res.ok && data.success) {
                login(data.user);
                addToCart(product, selectedSize);
                setAuthModalOpen(false);
                navigate('/checkout');
            } else {
                setAuthError(data.message || 'Authentication failed. Please check details.');
            }
        } catch (err) {
            console.error(err);
            setAuthError('Connection error. Please try again.');
        } finally {
            setAuthLoading(false);
        }
    };

    const checkPincode = async () => {
        if (!pincode || pincode.length !== 6 || isNaN(pincode)) {
            setPincodeResult({
                success: false,
                message: 'Please enter a valid 6-digit pincode.'
            });
            return;
        }

        setCheckingPincode(true);
        setPincodeResult(null);

        try {
            const res = await fetch(`/api/shipping/check-pincode?pincode=${pincode}&type=retail`);
            const data = await res.json();
            if (data.success) {
                setPincodeResult({
                    success: true,
                    message: data.message
                });
            } else {
                setPincodeResult({
                    success: false,
                    message: data.message || 'Delivery not available for this pincode.'
                });
            }
        } catch (error) {
            setPincodeResult({
                success: false,
                message: 'Unable to verify pincode at this time. Please try again.'
            });
        } finally {
            setCheckingPincode(false);
        }
    };

    const shareProduct = async () => {
        if (!product) return;
        const shareData = {
            title: `${product.name} | Aakrithi`,
            text: `Check out this beautiful ${product.name} from Aakrithi!`,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                setShareCopied(true);
                setTimeout(() => setShareCopied(false), 2000);
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    if (loading) {
        return (
            <AppLayout>
                <div className="container text-center py-5" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="spinner-border text-warning" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (error || !product) {
        return (
            <AppLayout>
                <div className="container text-center py-5" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text)', marginBottom: '1rem' }}>
                        {error || 'Product Not Found'}
                    </h2>
                    <p style={{ color: 'var(--color-text-light)', marginBottom: '2rem' }}>
                        The requested product could not be found or failed to load.
                    </p>
                    <Link to="/shop" className="btn btn-dark" style={{ background: 'var(--color-accent)', border: 'none', color: 'var(--color-primary)', padding: '10px 24px', borderRadius: '30px' }}>
                        Back to Shop
                    </Link>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="container product-detail-page animate-fade-in" style={{ padding: '4rem 1rem' }}>
                {/* Breadcrumbs */}
                <nav className="breadcrumb d-flex align-items-center gap-1 mb-4" style={{ fontSize: '0.85rem', color: 'var(--color-text-light)' }}>
                    <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link> 
                    <ChevronRight size={14} />
                    <Link to={`/shop?category=${product.category}`} style={{ color: 'inherit', textDecoration: 'none' }}>{product.category}</Link> 
                    <ChevronRight size={14} />
                    <span style={{ color: 'var(--color-accent)', fontWeight: 500 }}>{product.name}</span>
                </nav>

                <div className="product-layout" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3.5rem', alignItems: 'start' }}>
                    {/* Gallery */}
                    <div className="product-gallery">
                        <div className="main-image" style={{ borderRadius: '16px', overflow: 'hidden', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', marginBottom: '1rem', aspectRatio: '3/4' }}>
                            <img 
                                src={mainImage} 
                                alt={product.name} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                        </div>
                        {galleryImages.length > 1 && (
                            <div className="thumbnail-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem' }}>
                                {galleryImages.map((img, idx) => (
                                    <div 
                                        key={idx} 
                                        onClick={() => setMainImage(img)}
                                        className={`thumbnail ${mainImage === img ? 'active' : ''}`} 
                                        style={{ 
                                            borderRadius: '8px', 
                                            overflow: 'hidden', 
                                            cursor: 'pointer', 
                                            aspectRatio: '3/4',
                                            border: mainImage === img ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                                            opacity: mainImage === img ? 1 : 0.7,
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <img src={img} alt={`View ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Information Panel */}
                    <div className="product-info-panel" style={{ padding: '0 0.5rem' }}>
                        <div className="product-header" style={{ marginBottom: '1.5rem' }}>
                            <p className="category" style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-accent)', letterSpacing: '2px', fontWeight: 600, marginBottom: '0.5rem' }}>
                                {product.category}
                            </p>
                            <h1 className="name" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text)', fontSize: '2.5rem', fontWeight: 500, lineHeight: 1.2, marginBottom: '0.75rem' }}>
                                {product.name}
                            </h1>
                            <div className="rating d-flex align-items-center gap-1 mb-3" style={{ color: 'var(--color-accent)' }}>
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} />
                                <span style={{ color: 'var(--color-text-light)', fontSize: '0.85rem', marginLeft: '6px' }}>(12 Reviews)</span>
                            </div>
                            <div className="d-flex align-items-baseline gap-3">
                                <p className="price" style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
                                    ₹{new Intl.NumberFormat('en-IN').format(product.price)}
                                </p>
                                {product.mrp && product.mrp > product.price && (
                                    <p style={{ fontSize: '1.2rem', textDecoration: 'line-through', color: 'var(--color-text-light)', margin: 0 }}>
                                        ₹{new Intl.NumberFormat('en-IN').format(product.mrp)}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="product-selection" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem', marginBottom: '2.5rem' }}>
                            <div className="selection-group" style={{ marginBottom: '1.5rem' }}>
                                <div className="label-row d-flex justify-content-between align-items-center mb-3">
                                    <span className="label" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text)' }}>Select Size</span>
                                    <button className="size-guide bg-transparent border-0 p-0" style={{ color: 'var(--color-accent)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'underline' }}>Size Guide</button>
                                </div>
                                <div className="size-options d-flex gap-2 flex-wrap">
                                    {sizes.map((sz, index) => (
                                        <button 
                                            key={index}
                                            onClick={() => setSelectedSize(sz)}
                                            className={`size-option btn ${selectedSize === sz ? 'active' : ''}`}
                                            style={{
                                                border: '1px solid var(--color-border)',
                                                background: selectedSize === sz ? 'var(--color-accent)' : 'var(--color-primary)',
                                                color: selectedSize === sz ? 'var(--color-primary)' : 'var(--color-text)',
                                                padding: '8px 20px',
                                                borderRadius: '6px',
                                                fontWeight: 500,
                                                fontSize: '0.9rem',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {sz}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="action-buttons d-flex gap-3 align-items-stretch" style={{ height: '52px' }}>
                                <button 
                                    onClick={handleAddToCart}
                                    className="add-to-cart-btn btn flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                                    style={{
                                        background: 'var(--color-primary)',
                                        border: '2px solid var(--color-accent)',
                                        color: 'var(--color-accent)',
                                        fontWeight: 700,
                                        borderRadius: '30px',
                                        textTransform: 'uppercase',
                                        fontSize: '0.9rem',
                                        letterSpacing: '1px'
                                    }}
                                >
                                    <ShoppingBag size={18} /> Add to Bag
                                </button>
                                <button 
                                    onClick={handleBuyNow}
                                    className="buy-now-btn btn flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                                    style={{
                                        background: 'var(--color-accent)',
                                        border: 'none',
                                        color: 'var(--color-primary)',
                                        fontWeight: 700,
                                        borderRadius: '30px',
                                        textTransform: 'uppercase',
                                        fontSize: '0.9rem',
                                        letterSpacing: '1px'
                                    }}
                                >
                                    <Zap size={18} /> Buy Now
                                </button>
                                <button 
                                    onClick={() => toggleWishlist(product)}
                                    className="wishlist-btn btn d-flex align-items-center justify-content-center"
                                    style={{
                                        width: '52px',
                                        borderRadius: '50%',
                                        border: '1px solid var(--color-border)',
                                        background: 'var(--color-primary)',
                                        color: isProductInWishlist(product.id) ? 'red' : 'var(--color-text-light)',
                                        padding: 0
                                    }}
                                >
                                    <Heart size={20} fill={isProductInWishlist(product.id) ? 'red' : 'none'} />
                                </button>
                            </div>
                        </div>

                        {/* Shipping Delivery Availability Pincode Checker */}
                        <div className="delivery-check" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem', marginBottom: '2.5rem' }}>
                            <span className="label" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '1rem' }}>Check Delivery Availability</span>
                            <div className="d-flex gap-2">
                                <div style={{ position: 'relative', flex: 1 }}>
                                    <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                                    <input 
                                        type="text" 
                                        placeholder="Enter 6-digit Pincode" 
                                        maxLength={6} 
                                        value={pincode}
                                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                                        style={{
                                            width: '100%',
                                            border: '1px solid var(--color-border)',
                                            borderRadius: '6px',
                                            padding: '12px 12px 12px 40px',
                                            fontFamily: 'inherit',
                                            fontSize: '0.95rem',
                                            background: 'transparent',
                                            color: 'inherit',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                                <button 
                                    onClick={checkPincode}
                                    disabled={checkingPincode}
                                    style={{
                                        background: 'var(--color-text)',
                                        color: 'var(--color-surface)',
                                        padding: '0 24px',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'opacity 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minWidth: '90px'
                                    }}
                                >
                                    {checkingPincode ? <Loader size={18} className="spin" /> : 'Check'}
                                </button>
                            </div>

                            {pincodeResult && (
                                <div 
                                    className="d-flex align-items-start gap-2 mt-3"
                                    style={{
                                        fontSize: '0.85rem',
                                        color: pincodeResult.success ? '#22c55e' : '#ef4444',
                                        lineHeight: 1.4
                                    }}
                                >
                                    {pincodeResult.success ? (
                                        <CheckCircle size={18} style={{ flexShrink: 0 }} />
                                    ) : (
                                        <XCircle size={18} style={{ flexShrink: 0 }} />
                                    )}
                                    <span dangerouslySetInnerHTML={{ __html: pincodeResult.message }} />
                                </div>
                            )}
                        </div>

                        {/* Description Tabs */}
                        <div className="product-details-tabs" style={{ marginBottom: '2rem' }}>
                            <div className="tabs-header d-flex border-bottom mb-3" style={{ gap: '1.5rem' }}>
                                <button 
                                    className={`pb-2 border-0 bg-transparent font-weight-bold ${activeTab === 'description' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('description')}
                                    style={{
                                        borderBottom: activeTab === 'description' ? '2px solid var(--color-accent)' : 'none',
                                        color: activeTab === 'description' ? 'var(--color-accent)' : 'var(--color-text-light)',
                                        fontWeight: 600,
                                        fontSize: '0.95rem'
                                    }}
                                >
                                    Description
                                </button>
                                <button 
                                    className={`pb-2 border-0 bg-transparent font-weight-bold ${activeTab === 'details' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('details')}
                                    style={{
                                        borderBottom: activeTab === 'details' ? '2px solid var(--color-accent)' : 'none',
                                        color: activeTab === 'details' ? 'var(--color-accent)' : 'var(--color-text-light)',
                                        fontWeight: 600,
                                        fontSize: '0.95rem'
                                    }}
                                >
                                    Details
                                </button>
                                <button 
                                    className={`pb-2 border-0 bg-transparent font-weight-bold ${activeTab === 'shipping' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('shipping')}
                                    style={{
                                        borderBottom: activeTab === 'shipping' ? '2px solid var(--color-accent)' : 'none',
                                        color: activeTab === 'shipping' ? 'var(--color-accent)' : 'var(--color-text-light)',
                                        fontWeight: 600,
                                        fontSize: '0.95rem'
                                    }}
                                >
                                    Shipping
                                </button>
                            </div>
                            <div className="tab-content" style={{ fontSize: '0.95rem', color: 'var(--color-text-light)', lineHeight: 1.6 }}>
                                {activeTab === 'description' && (
                                    <p style={{ margin: 0 }}>{product.description || 'No description available for this product.'}</p>
                                )}
                                {activeTab === 'details' && (
                                    <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                                        <li>100% Sustainably sourced fabric</li>
                                        <li>Relaxed fit</li>
                                        <li>Gentle hand wash recommended</li>
                                        <li>Made in India</li>
                                    </ul>
                                )}
                                {activeTab === 'shipping' && (
                                    <p style={{ margin: 0 }}>Free standard shipping on all orders over ₹10,000. Estimated delivery: 3-5 business days.</p>
                                )}
                            </div>
                        </div>

                        {/* Share Buttons */}
                        <div className="utility-links d-flex gap-4 border-top pt-3">
                            <button onClick={shareProduct} className="utility-link bg-transparent border-0 p-0 d-flex align-items-center gap-2" style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                                <Share2 size={16} />
                                {shareCopied ? 'Link Copied!' : 'Share'}
                            </button>
                            <button className="utility-link bg-transparent border-0 p-0 d-flex align-items-center gap-2" style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                                <Info size={16} /> Contact Support
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div style={{ marginTop: '5rem' }}>
                        <style>{`
                            .product-card-premium {
                                text-decoration: none;
                                color: inherit;
                                background: transparent !important;
                                border: none !important;
                                box-shadow: none !important;
                                transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                                display: flex;
                                flex-direction: column;
                                height: 100%;
                            }
                            .product-card-premium:hover {
                                transform: translateY(-4px);
                            }
                            .product-image-container-wrap {
                                position: relative;
                                overflow: hidden;
                                aspect-ratio: 3/4;
                                background: var(--color-surface);
                                border: 1px solid rgba(197, 160, 89, 0.12) !important;
                                transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                            }
                            .product-card-premium:hover .product-image-container-wrap {
                                border-color: var(--color-accent) !important;
                                box-shadow: 0 10px 25px rgba(197, 160, 89, 0.08);
                            }
                            .hover-scale-img {
                                transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
                            }
                            .product-card-premium:hover .hover-scale-img {
                                transform: scale(1.08);
                            }
                            .product-quick-add {
                                position: absolute;
                                bottom: 0;
                                left: 0;
                                width: 100%;
                                height: 44px;
                                background: var(--color-accent);
                                color: var(--color-primary);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                transform: translateY(100%);
                                transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
                                z-index: 2;
                                font-weight: 600;
                                font-size: 0.75rem;
                                letter-spacing: 2px;
                                text-transform: uppercase;
                                cursor: pointer;
                            }
                            .product-card-premium:hover .product-quick-add {
                                transform: translateY(0);
                            }
                        `}</style>
                        <div className="section-header mb-4">
                            <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text)', fontSize: '1.8rem', fontWeight: 500 }}>Related Products</h2>
                            <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem', marginTop: '0.25rem' }}>You might also like these similar styles</p>
                        </div>
                        <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '2rem' }}>
                            {relatedProducts.map((related) => {
                                const inWish = isProductInWishlist(related.id);
                                return (
                                    <div key={related.id} className="product-card-wrapper position-relative animate-fade-in">
                                        <Link to={`/product/${related.slug}`} className="product-card-premium">
                                            
                                            {/* Image Container with Hover Zoom and Overlay */}
                                            <div className="product-image-container-wrap">
                                                {/* Badge */}
                                                {related.badge && (
                                                    <span style={{
                                                        position: 'absolute',
                                                        top: '12px',
                                                        left: '12px',
                                                        zIndex: 3,
                                                        background: 'rgba(44, 30, 22, 0.85)',
                                                        backdropFilter: 'blur(4px)',
                                                        color: 'var(--color-accent)',
                                                        border: '1px solid rgba(197, 160, 89, 0.4)',
                                                        fontSize: '0.62rem',
                                                        padding: '4px 10px',
                                                        textTransform: 'uppercase',
                                                        fontWeight: 700,
                                                        letterSpacing: '1.5px',
                                                        borderRadius: '3px'
                                                    }}>
                                                        {related.badge}
                                                    </span>
                                                )}

                                                {/* Wishlist Button (Always visible on top-right, clean glassmorphism) */}
                                                <button 
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        toggleWishlist(related);
                                                    }}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '12px',
                                                        right: '12px',
                                                        zIndex: 3,
                                                        border: 'none',
                                                        background: 'rgba(255, 255, 255, 0.8)',
                                                        backdropFilter: 'blur(4px)',
                                                        color: inWish ? 'red' : 'var(--color-text)',
                                                        width: '32px',
                                                        height: '32px',
                                                        borderRadius: '50%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        transition: 'all 0.3s ease',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                                                    }}
                                                >
                                                    <Heart size={14} fill={inWish ? 'red' : 'none'} />
                                                </button>

                                                <img 
                                                    src={related.image} 
                                                    alt={related.name} 
                                                    className="hover-scale-img"
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                                
                                                {/* Hover Overlay Button (Quick Add bar) */}
                                                <div 
                                                    className="product-quick-add"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        addToCart(related, 'Free Size');
                                                        alert(`${related.name} added to cart!`);
                                                    }}
                                                >
                                                    Quick Add +
                                                </div>
                                            </div>

                                            {/* Product Info (Centered Luxury Layout) */}
                                            <div style={{ padding: '1.25rem 0.5rem', textAlign: 'center', flexGrow: 1, display: 'flex', flexDirection: 'column', justify: 'space-between' }}>
                                                <div>
                                                    <span style={{ fontSize: '0.62rem', textTransform: 'uppercase', color: 'var(--color-accent)', fontWeight: 700, letterSpacing: '3px', display: 'block', marginBottom: '6px' }}>
                                                        {related.category}
                                                    </span>
                                                    <h3 style={{ 
                                                        fontSize: '0.96rem', 
                                                        fontFamily: 'var(--font-serif)', 
                                                        color: 'var(--color-text)', 
                                                        margin: '0 0 6px 0', 
                                                        fontWeight: 400,
                                                        lineHeight: '1.45',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        height: '2.9em'
                                                    }}>
                                                        {related.name}
                                                    </h3>
                                                </div>
                                                <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-accent)', letterSpacing: '1px', display: 'block', marginTop: '6px' }}>
                                                    ₹{new Intl.NumberFormat('en-IN').format(related.price)}
                                                </span>
                                            </div>

                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Auth Modal Overlay for Buy Now Guest Checkout */}
                {authModalOpen && (
                    <div 
                        className="auth-modal-overlay active" 
                        onClick={(e) => e.target === e.currentTarget && setAuthModalOpen(false)}
                        style={{
                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                            background: 'rgba(0,0,0,0.5)', zIndex: 99999,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            backdropFilter: 'blur(4px)'
                        }}
                    >
                        <div 
                            className="auth-modal-card" 
                            style={{
                                background: 'var(--color-surface)', padding: '2.5rem', borderRadius: '12px',
                                width: '90%', maxWidth: '450px', position: 'relative',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.1)', border: '1px solid var(--color-border)'
                            }}
                        >
                            <button 
                                className="auth-modal-close bg-transparent border-0" 
                                onClick={() => setAuthModalOpen(false)}
                                style={{ position: 'absolute', top: '15px', right: '15px', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--color-text-light)' }}
                            >
                                <X size={20} />
                            </button>
                            
                            <div className="auth-header" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', color: 'var(--color-text)' }}>
                                    {authMode === 'signup' ? 'Create an Account' : 'Sign In to Continue'}
                                </h2>
                                <p style={{ color: 'var(--color-text-light)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                    {authMode === 'signup' ? 'Sign up to complete your purchase and save orders.' : 'Sign in to access your saved addresses.'}
                                </p>
                            </div>

                            {authError && (
                                <div className="alert alert-danger py-2 px-3" style={{ fontSize: '0.85rem', borderRadius: '6px', marginBottom: '1rem' }}>
                                    {authError}
                                </div>
                            )}
                            
                            <form onSubmit={handleAuthSubmit} className="auth-form d-flex flex-column gap-3">
                                {authMode === 'signup' && (
                                    <div className="input-group" style={{ position: 'relative' }}>
                                        <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                                        <input 
                                            type="text" 
                                            placeholder="Full Name" 
                                            required 
                                            value={authName}
                                            onChange={(e) => setAuthName(e.target.value)}
                                            style={{ width: '100%', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '12px 12px 12px 40px', outline: 'none' }}
                                        />
                                    </div>
                                )}
                                <div className="input-group" style={{ position: 'relative' }}>
                                    <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                                    <input 
                                        type="email" 
                                        placeholder="Email address" 
                                        required 
                                        value={authEmail}
                                        onChange={(e) => setAuthEmail(e.target.value)}
                                        style={{ width: '100%', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '12px 12px 12px 40px', outline: 'none' }}
                                    />
                                </div>
                                <div className="input-group" style={{ position: 'relative' }}>
                                    <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                                    <input 
                                        type="password" 
                                        placeholder="Password" 
                                        required 
                                        value={authPassword}
                                        onChange={(e) => setAuthPassword(e.target.value)}
                                        style={{ width: '100%', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '12px 12px 12px 40px', outline: 'none' }}
                                    />
                                </div>
                                {authMode === 'signup' && (
                                    <div className="input-group" style={{ position: 'relative' }}>
                                        <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                                        <input 
                                            type="password" 
                                            placeholder="Confirm Password" 
                                            required 
                                            value={authConfirmPassword}
                                            onChange={(e) => setAuthConfirmPassword(e.target.value)}
                                            style={{ width: '100%', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '12px 12px 12px 40px', outline: 'none' }}
                                        />
                                    </div>
                                )}
                                
                                <button 
                                    type="submit" 
                                    disabled={authLoading}
                                    className="btn btn-dark" 
                                    style={{
                                        width: '100%', marginTop: '0.5rem', padding: '12px', borderRadius: '30px', fontSize: '1rem',
                                        background: 'var(--color-accent)', border: 'none', color: 'var(--color-primary)', fontWeight: 600
                                    }}
                                >
                                    {authLoading ? <Loader size={18} className="spin" /> : (authMode === 'signup' ? 'Sign Up & Checkout' : 'Sign In & Checkout')}
                                </button>
                            </form>

                            <div className="d-flex align-items-center my-3" style={{ color: 'var(--color-border)' }}>
                                <hr className="flex-grow-1" />
                                <span className="mx-2" style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>or</span>
                                <hr className="flex-grow-1" />
                            </div>

                            <button 
                                onClick={handleGuestCheckout}
                                className="btn btn-outline-secondary w-100" 
                                style={{
                                    padding: '12px', borderRadius: '30px', fontSize: '0.95rem', fontWeight: 500,
                                    border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text)'
                                }}
                            >
                                Checkout as Guest
                            </button>
                            
                            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--color-text)' }}>
                                {authMode === 'signup' ? (
                                    <>Already have an account? <button onClick={() => setAuthMode('login')} className="bg-transparent border-0 p-0" style={{ fontWeight: 700, color: 'var(--color-accent)', textDecoration: 'underline' }}>Sign In</button></>
                                ) : (
                                    <>Don't have an account? <button onClick={() => setAuthMode('signup')} className="bg-transparent border-0 p-0" style={{ fontWeight: 700, color: 'var(--color-accent)', textDecoration: 'underline' }}>Sign Up</button></>
                                )}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

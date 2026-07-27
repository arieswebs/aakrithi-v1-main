import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, User, Heart, ShoppingBag, X, Menu, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AppLayout({ children }) {
    const { user, cartCount, wishlistCount, logout } = useApp();
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Trigger preloader transition on page load and navigation
    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
            setMobileMenuOpen(false);
        }, 500);
        
        return () => clearTimeout(timer);
    }, [pathname]);

    // Scroll Reveal Observer for premium entrance animations
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const delay = (index % 4) * 100;
                    setTimeout(() => {
                        entry.target.classList.add('active');
                        observer.unobserve(entry.target);
                    }, delay);
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px' 
        });

        const timeoutId = setTimeout(() => {
            const elements = document.querySelectorAll('.reveal, .reveal-up, .reveal-blur, .reveal-scale, .product-card, .category-item, .value-card, .feature-card, .landing-option');
            elements.forEach(el => {
                if (!el.classList.contains('active')) {
                    observer.observe(el);
                }
            });
        }, 200);

        return () => {
            clearTimeout(timeoutId);
            observer.disconnect();
        };
    }, [pathname]);

    // Handle ESC key for search overlay
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setSearchOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const executeSearch = (query) => {
        const q = query || searchQuery.trim();
        if (q) {
            setSearchOpen(false);
            navigate(`/shop?category=all&sort=latest&search=${encodeURIComponent(q)}`);
        }
    };

    return (
        <div className="min-h-screen d-flex flex-column" style={{ backgroundColor: 'var(--color-background)' }}>
            {/* Premium Minimalist Preloader */}
            <div 
                id="global-loader" 
                style={{
                    position: 'fixed',
                    top: 0, left: 0, width: '100%', height: '100%',
                    zIndex: 999999,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    background: 'var(--color-surface, #FDF8F1)',
                    transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    opacity: loading ? 1 : 0,
                    visibility: loading ? 'visible' : 'hidden',
                    pointerEvents: loading ? 'all' : 'none'
                }}
            >
                <div style={{
                    animation: 'pulse-opacity 2s ease-in-out infinite',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <img src="/images/new_logo.png" alt="Aakrithi Logo" style={{ height: '42px', width: 'auto', display: 'block', filter: 'brightness(0.1)' }} />
                </div>
            </div>

            {/* Premium Discovery Search Overlay */}
            <div className={`search-overlay ${searchOpen ? 'active' : ''}`} style={{ display: searchOpen ? 'flex' : 'none' }}>
                <div className="search-container">
                    <button className="search-close" onClick={() => setSearchOpen(false)}>
                        <X size={20} />
                    </button>
                    
                    <div className="search-input-wrapper">
                        <Search className="search-icon-inside" />
                        <input 
                            type="text" 
                            placeholder="Discover artisanal style..." 
                            autoComplete="off"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && executeSearch()}
                        />
                    </div>

                    <div className="search-hints-premium">
                        <span>Trending:</span>
                        <button className="search-hint-link bg-transparent border-0 p-0" onClick={() => executeSearch('Silk Saree')}>Silk Saree</button>
                        <button className="search-hint-link bg-transparent border-0 p-0" onClick={() => executeSearch('Linen')}>Linen</button>
                        <button className="search-hint-link bg-transparent border-0 p-0" onClick={() => executeSearch('Home Decor')}>Home Decor</button>
                    </div>

                    <div className="discovery-hub">
                        <span className="discovery-label">Curated Collections</span>
                        <div className="discovery-grid">
                            <Link to="/category/apparels" className="discovery-item" onClick={() => setSearchOpen(false)}>
                                <Shirt />
                                <span>Apparels</span>
                            </Link>
                            <Link to="/category/kutties" className="discovery-item" onClick={() => setSearchOpen(false)}>
                                <Baby />
                                <span>Kutties</span>
                            </Link>
                            <Link to="/category/decors" className="discovery-item" onClick={() => setSearchOpen(false)}>
                                <HomeIcon />
                                <span>Decors</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navbar Header */}
            {pathname !== '/' && (
                <>
                    <nav className="navbar" id="navbar">
                        <div className="container navbar-content">
                            <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                                <Menu id="menuIcon" />
                            </button>

                            <Link to="/" className="navbar-logo">AAKRITHI</Link>

                            <ul className={`navbar-links ${mobileMenuOpen ? 'open' : ''}`} id="navLinks">
                                <li className="mobile-nav-logo-item"><Link to="/" onClick={() => setMobileMenuOpen(false)}>AAKRITHI</Link></li>
                                <li>
                                    <Link to="/category/apparels" onClick={() => setMobileMenuOpen(false)}>
                                        <span className="nav-brand">Aakrithi</span>
                                        <span className="nav-category">Apparels</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/category/kutties" onClick={() => setMobileMenuOpen(false)}>
                                        <span className="nav-brand">Aakrithi</span>
                                        <span className="nav-category">Kutties</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/category/decors" onClick={() => setMobileMenuOpen(false)}>
                                        <span className="nav-brand">Aakrithi</span>
                                        <span className="nav-category">Decors</span>
                                    </Link>
                                </li>
                            </ul>

                            <div className="navbar-actions">
                                <button className="nav-action-btn" onClick={() => setSearchOpen(true)} title="Search Collection">
                                    <Search size={20} />
                                </button>
                                
                                <div className="nav-user-dropdown">
                                    <Link to="/account" className="nav-action-btn"><User size={20} /></Link>
                                    {user && (
                                        <div className="dropdown-content">
                                            <span className="user-greeting">Hi, {user.name}</span>
                                            {user.is_admin && (
                                                <a href="/admin/dashboard" className="dropdown-item">Admin Panel</a>
                                            )}
                                            <hr />
                                            <button onClick={logout} className="logout-btn w-100 text-start border-0 bg-transparent p-0">Logout</button>
                                        </div>
                                    )}
                                </div>

                                <Link to="/wishlist" className="nav-action-btn wishlist-icon hide-mobile" style={{ position: 'relative' }}>
                                    <Heart size={20} />
                                    {wishlistCount > 0 && (
                                        <span className="cart-count" id="wishlistCount" style={{ background: 'var(--color-accent)', display: 'flex' }}>
                                            {wishlistCount}
                                        </span>
                                    )}
                                </Link>

                                <Link to="/cart" className="nav-action-btn cart-icon" style={{ position: 'relative' }}>
                                    <ShoppingBag size={20} />
                                    <span className="cart-count" id="cartCount">{cartCount}</span>
                                </Link>
                            </div>
                        </div>
                    </nav>
                    <div 
                        className="mobile-menu-backdrop" 
                        id="menuBackdrop" 
                        style={{ display: mobileMenuOpen ? 'block' : 'none' }}
                        onClick={() => setMobileMenuOpen(false)}
                    ></div>
                </>
            )}

            {/* Main Content Area */}
            <main 
                className="flex-grow-1"
                style={{ 
                    paddingTop: pathname === '/' ? 0 : 'var(--header-height)' 
                }}
            >
                {children}
            </main>

            {/* Footer */}
            <footer className="footer mt-auto">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-brand">
                            <h3 style={{ margin: '0 0 1rem 0' }}><img src="/images/new_logo.png" alt="Aakrithi Logo" style={{ height: '40px', width: 'auto' }} /></h3>
                            <p>Curated artisanal clothing designed for comfort and elegance. Blending traditional Indian craftsmanship with modern silhouettes.</p>
                            <div className="social-links">
                                <a href="#" aria-label="Instagram">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                                </a>
                                <a href="#" aria-label="Facebook">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                                </a>
                                <a href="#" aria-label="Twitter">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16zM4 20l6.768 -6.768M15.232 10.232l4.768 -6.232"/></svg>
                                </a>
                            </div>
                        </div>
                        <div className="footer-links">
                            <h4>Shop</h4>
                            <ul>
                                <li><Link to="/category/apparels">Apparels</Link></li>
                                <li><Link to="/category/kutties">Kutties</Link></li>
                                <li><Link to="/category/decors">Decors</Link></li>
                            </ul>
                        </div>
                        <div className="footer-links">
                            <h4>Info</h4>
                            <ul>
                                <li><Link to="/about">Our Story</Link></li>
                                <li><Link to="/contact">Contact</Link></li>
                                <li><Link to="/policy/shipping">Shipping</Link></li>
                                <li><Link to="/policy/returns">Returns</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4>Newsletter</h4>
                            <p style={{ color: '#A0A5AB', fontSize: '0.875rem', marginBottom: '1rem' }}>Subscribe for exclusive updates and offers.</p>
                            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                                <input type="email" placeholder="Your email address" required />
                                <button type="submit"><ArrowRight size={16} /></button>
                            </form>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; {new Date().getFullYear()} Aakrithi. All rights reserved.</p>
                        <div className="payment-icons">
                            <span>Visa</span> <span>Mastercard</span> <span>UPI</span> <span>Net Banking</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// Minimal icons helper mapping
function Shirt() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46 16 1.7a2 2 0 0 0-1.48 0l-4.38 1.76a2 2 0 0 1-1.48 0L4.28 1.7A2 2 0 0 0 2.8 2.03L1 4.54a2 2 0 0 0-.25 1.76L3.48 20.3a2 2 0 0 0 2 1.7h13.1a2 2 0 0 0 2-1.7l2.7-14a2 2 0 0 0-.25-1.76l-1.8-2.51a2 2 0 0 0-1.85-.91z"/></svg>;
}
function Baby() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 5 6.3c1.7-1.7 4-2.3 7-2.3s5.3.6 7 2.3z"/></svg>;
}
function HomeIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
}

import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import { useApp } from '../context/AppContext';

export default function Cart() {
    const { cart, removeFromCart, updateCartQuantity } = useApp();

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <AppLayout>
            <div className="container cart-page animate-fade-in" id="cartPage" style={{ paddingTop: '4rem', paddingBottom: '7rem', minHeight: '80vh' }}>
                <h1 className="cart-title" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text)', fontSize: '2.5rem', marginBottom: '2.5rem', fontWeight: 500 }}>
                    Your Cart
                </h1>

                {cart.length === 0 ? (
                    <div className="empty-cart-message text-center py-5" style={{ background: 'var(--color-surface)', borderRadius: '16px', border: '1px solid var(--color-border)', padding: '4rem 2rem' }}>
                        <ShoppingBag size={48} style={{ opacity: 0.2, color: 'var(--color-text)', marginBottom: '1.5rem' }} />
                        <p style={{ fontSize: '1.2rem', color: 'var(--color-text-light)', marginBottom: '2rem' }}>Your cart is empty.</p>
                        <Link to="/shop" className="btn btn-dark" style={{ background: 'var(--color-accent)', border: 'none', padding: '12px 30px', borderRadius: '30px', fontWeight: 600, color: 'var(--color-primary)' }}>
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="cart-layout" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '3.5rem', alignItems: 'start' }}>
                        {/* Cart Items List */}
                        <div className="cart-items d-flex flex-column gap-3">
                            {cart.map((item) => (
                                <div 
                                    key={item.cartKey} 
                                    className="cart-item animate-fade-in" 
                                    style={{
                                        display: 'flex',
                                        gap: '1.5rem',
                                        background: 'var(--color-surface)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: '16px',
                                        padding: '1.5rem',
                                        alignItems: 'center'
                                    }}
                                >
                                    <div className="item-image" style={{ width: '90px', borderRadius: '10px', overflow: 'hidden', aspectRatio: '3/4', flexShrink: 0 }}>
                                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div className="item-details flex-grow-1">
                                        <div className="item-header d-flex justify-content-between align-items-start gap-3">
                                            <div>
                                                <p className="product-category" style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-accent)', letterSpacing: '1px', marginBottom: '0.25rem', fontWeight: 600 }}>
                                                    {item.category}
                                                </p>
                                                <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-serif)', color: 'var(--color-text)', margin: 0, fontWeight: 600 }}>
                                                    {item.name}
                                                </h3>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', display: 'block', marginTop: '0.25rem' }}>Size: {item.size}</span>
                                            </div>
                                            <p className="item-price" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
                                                ₹{new Intl.NumberFormat('en-IN').format(item.price)}
                                            </p>
                                        </div>
                                        <div className="item-controls d-flex justify-content-between align-items-center mt-3">
                                            {/* Quantity Picker */}
                                            <div 
                                                className="quantity-selector-premium d-flex align-items-center" 
                                                style={{
                                                    border: '1.5px solid var(--color-accent)',
                                                    borderRadius: '6px',
                                                    overflow: 'hidden',
                                                    background: '#fff',
                                                    height: '36px'
                                                }}
                                            >
                                                <button 
                                                    onClick={() => updateCartQuantity(item.cartKey, item.quantity - 1)}
                                                    className="qty-btn-premium minus bg-transparent border-0 d-flex align-items-center justify-content-center"
                                                    style={{ width: '36px', height: '100%', color: 'var(--color-accent)', cursor: 'pointer' }}
                                                    type="button"
                                                >
                                                    <Minus size={14} strokeWidth={3} />
                                                </button>
                                                <input 
                                                    type="text" 
                                                    value={item.quantity} 
                                                    readOnly 
                                                    className="qty-input-premium text-center border-0" 
                                                    style={{ width: '36px', fontWeight: 700, fontSize: '0.95rem', height: '100%', outline: 'none' }}
                                                />
                                                <button 
                                                    onClick={() => updateCartQuantity(item.cartKey, item.quantity + 1)}
                                                    className="qty-btn-premium plus bg-transparent border-0 d-flex align-items-center justify-content-center"
                                                    style={{ width: '36px', height: '100%', color: 'var(--color-accent)', cursor: 'pointer' }}
                                                    type="button"
                                                >
                                                    <Plus size={14} strokeWidth={3} />
                                                </button>
                                            </div>

                                            {/* Remove Button */}
                                            <button 
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to remove this item?')) {
                                                        removeFromCart(item.cartKey);
                                                    }
                                                }}
                                                className="cart-item-remove bg-transparent border-0 d-flex align-items-center gap-1"
                                                style={{
                                                    border: '1px solid rgba(220, 53, 69, 0.2)',
                                                    color: '#dc3545',
                                                    fontSize: '0.75rem',
                                                    cursor: 'pointer',
                                                    padding: '6px 12px',
                                                    borderRadius: '20px',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.5px',
                                                    fontWeight: 600
                                                }}
                                            >
                                                <Trash2 size={14} /> Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div 
                            className="cart-summary animate-fade-in" 
                            style={{
                                background: 'var(--color-surface)',
                                border: '1px solid var(--color-border)',
                                borderRadius: '24px',
                                padding: '2.5rem',
                                position: 'sticky',
                                top: 'calc(var(--header-height) + 2rem)'
                            }}
                        >
                            <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '1.5rem', fontWeight: 600 }}>
                                Order Summary
                            </h2>
                            <div className="summary-row d-flex justify-content-between mb-3" style={{ fontSize: '0.95rem', color: 'var(--color-text)' }}>
                                <span>Subtotal</span>
                                <span>₹{new Intl.NumberFormat('en-IN').format(subtotal)}</span>
                            </div>
                            <div className="summary-row d-flex justify-content-between mb-3" style={{ fontSize: '0.95rem', color: 'var(--color-text)' }}>
                                <span>Shipping</span>
                                <span style={{ color: '#22c55e', fontWeight: 600 }}>FREE</span>
                            </div>
                            <div className="summary-divider my-4" style={{ height: '1px', borderTop: '1px dashed var(--color-border)' }}></div>
                            <div className="summary-row total d-flex justify-content-between mb-4" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text)', fontFamily: 'var(--font-serif)' }}>
                                <span>Total</span>
                                <span>₹{new Intl.NumberFormat('en-IN').format(subtotal)}</span>
                            </div>
                            
                            <Link 
                                to="/checkout" 
                                className="btn btn-dark w-100 py-3"
                                style={{
                                    background: 'var(--color-accent)',
                                    color: 'var(--color-primary)',
                                    border: 'none',
                                    fontWeight: 700,
                                    borderRadius: '30px',
                                    textTransform: 'uppercase',
                                    fontSize: '0.9rem',
                                    letterSpacing: '1px',
                                    textAlign: 'center',
                                    display: 'block',
                                    textDecoration: 'none'
                                }}
                            >
                                Proceed to Checkout
                            </Link>

                            <p style={{ fontSize: '10px', textAlign: 'center', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '1.5rem', margin: '1.5rem 0 0 0' }}>
                                Secure checkout • Free returns
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

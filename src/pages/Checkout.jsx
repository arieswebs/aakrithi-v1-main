import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Loader, MapPin, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

const STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
    "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", 
    "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", 
    "Lakshadweep", "Puducherry"
];

export default function Checkout() {
    const { cart, user, updateCart } = useApp();
    const navigate = useNavigate();

    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [loadingAddresses, setLoadingAddresses] = useState(false);

    // Form inputs
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
    const [saveAddress, setSaveAddress] = useState(false);

    // Submission states
    const [placingOrder, setPlacingOrder] = useState(false);
    const [successOrderNumber, setSuccessOrderNumber] = useState(null);
    const [countdown, setCountdown] = useState(5);

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Redirect if cart empty (but only after mount check)
    useEffect(() => {
        if (cart.length === 0 && !successOrderNumber) {
            navigate('/cart');
        }
    }, [cart, successOrderNumber, navigate]);

    // Load user addresses if logged in
    useEffect(() => {
        if (user && user.id) {
            setLoadingAddresses(true);
            fetch(`/api/user/addresses?userId=${user.id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.addresses) {
                        setAddresses(data.addresses);
                        // Auto-fill default address
                        const def = data.addresses.find(a => a.is_default);
                        if (def) {
                            fillAddress(def);
                        }
                    }
                    setLoadingAddresses(false);
                })
                .catch(err => {
                    console.error('Failed to load user addresses', err);
                    setLoadingAddresses(false);
                });
        }
    }, [user]);

    const fillAddress = (addr) => {
        setSelectedAddressId(addr.id);
        setCustomerName(addr.name || '');
        setCustomerEmail(addr.email || '');
        setCustomerPhone(addr.phone || '');
        // Split address line 1 & 2 if stored together
        const parts = addr.address.split(', ');
        setAddressLine1(parts[0] || '');
        setAddressLine2(parts.slice(1).join(', ') || '');
        setCity(addr.city || '');
        setState(addr.state || '');
        setPincode(addr.pincode || '');
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (cart.length === 0) return;

        // Basic validation
        if (!customerName || !customerEmail || !customerPhone || !addressLine1 || !city || !state || !pincode) {
            alert('Please fill out all required fields.');
            return;
        }

        setPlacingOrder(true);

        try {
            // 1. Call Secure Checkout API to generate Razorpay Order ID
            const checkoutRes = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cart })
            });

            const checkoutData = await checkoutRes.json();
            if (!checkoutRes.ok || !checkoutData.success) {
                alert(checkoutData.message || 'Failed to create payment order. Try again.');
                setPlacingOrder(false);
                return;
            }

            const { razorpayOrderId, razorpayKey } = checkoutData;

            // 2. Configure and open Razorpay Payment Gateway
            const options = {
                key: razorpayKey,
                amount: Math.round(subtotal * 100), // paise
                currency: "INR",
                name: "Aakrithi",
                description: "Order Payment",
                order_id: razorpayOrderId,
                handler: async function(paymentResponse) {
                    // 3. Payment succeeded in popup, send back details to record order
                    try {
                        const orderData = {
                            customer_name: customerName,
                            customer_email: customerEmail,
                            customer_phone: customerPhone,
                            address_line_1: addressLine1,
                            address_line_2: addressLine2,
                            city,
                            state,
                            pincode,
                            save_address: saveAddress,
                            payment_method: 'razorpay',
                            payment_id: paymentResponse.razorpay_payment_id,
                            razorpay_signature: paymentResponse.razorpay_signature,
                            razorpay_order_id: razorpayOrderId,
                            cart,
                            user_id: user ? user.id : null
                        };

                        const orderRes = await fetch('/api/order/place', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(orderData)
                        });

                        const orderResult = await orderRes.json();
                        if (orderRes.ok && orderResult.success) {
                            // Empty local cart
                            updateCart([]);
                            // Start victory confetti and overlay
                            triggerSuccessCelebration(orderResult.order_number);
                        } else {
                            alert('Order recording failed: ' + (orderResult.message || 'Unknown error'));
                            setPlacingOrder(false);
                        }
                    } catch (err) {
                        console.error('Order recording exception:', err);
                        alert('Something went wrong. Please check your network.');
                        setPlacingOrder(false);
                    }
                },
                prefill: {
                    name: customerName,
                    email: customerEmail,
                    contact: customerPhone
                },
                theme: {
                    color: "#C5A059"
                },
                modal: {
                    ondismiss: function() {
                        setPlacingOrder(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function(response) {
                alert('Payment failed. Reason: ' + response.error.description);
                setPlacingOrder(false);
            });
            rzp.open();

        } catch (error) {
            console.error('Razorpay process exception:', error);
            alert('Failed to initialize Razorpay checkout. Please check configuration.');
            setPlacingOrder(false);
        }
    };

    const triggerSuccessCelebration = (orderNumber) => {
        setSuccessOrderNumber(orderNumber);
        setPlacingOrder(false);

        // Fire Confetti!
        const duration = 3 * 1000;
        const end = Date.now() + duration;
        (function frame() {
            confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#C5A059', '#22c55e', '#ffffff'] });
            confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#C5A059', '#22c55e', '#ffffff'] });
            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    };

    // Countdown and Redirect on Successful checkout
    useEffect(() => {
        if (successOrderNumber) {
            const timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        navigate(`/order/${successOrderNumber}`);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [successOrderNumber, navigate]);

    return (
        <AppLayout>
            <div className="checkout-container container animate-fade-in" style={{ paddingTop: '4rem', paddingBottom: '7rem', minHeight: '80vh' }}>
                <div className="checkout-header text-center mb-5">
                    <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text)', fontSize: '2.5rem', fontWeight: 500 }}>Checkout</h1>
                    <div className="checkout-steps d-flex justify-content-center align-items-center gap-3 mt-3" style={{ fontSize: '0.85rem' }}>
                        <span className="step active" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>Shipping</span>
                        <span className="separator" style={{ width: '40px', height: '1px', background: 'var(--color-border)' }}></span>
                        <span className="step" style={{ color: 'var(--color-text-light)' }}>Payment</span>
                        <span className="separator" style={{ width: '40px', height: '1px', background: 'var(--color-border)' }}></span>
                        <span className="step" style={{ color: 'var(--color-text-light)' }}>Confirmation</span>
                    </div>
                </div>

                <div className="checkout-layout" style={{ display: 'grid', gridTemplateColumns: '1.45fr 1fr', gap: '3.5rem', alignItems: 'start' }}>
                    <div className="checkout-form-section">
                        {/* Saved Addresses (if logged in) */}
                        {user && addresses.length > 0 && (
                            <div className="checkout-card mb-4" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '2rem' }}>
                                <p style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-text-light)' }}>Select a Saved Address</p>
                                {loadingAddresses ? (
                                    <div className="text-center py-3">
                                        <Loader className="spin" size={24} style={{ color: 'var(--color-accent)' }} />
                                    </div>
                                ) : (
                                    <div className="address-selector-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                                        {addresses.map((addr) => (
                                            <div 
                                                key={addr.id}
                                                onClick={() => fillAddress(addr)}
                                                className={`address-card ${selectedAddressId === addr.id ? 'active' : ''}`}
                                                style={{
                                                    border: selectedAddressId === addr.id ? '2px solid var(--color-accent)' : '1.5px solid var(--color-border)',
                                                    background: selectedAddressId === addr.id ? 'rgba(197, 160, 89, 0.05)' : '#fff',
                                                    borderRadius: '10px',
                                                    padding: '1rem',
                                                    cursor: 'pointer',
                                                    position: 'relative',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                {addr.is_default && (
                                                    <span className="badge" style={{ position: 'absolute', top: '8px', right: '8px', background: 'var(--color-accent)', color: '#fff', fontSize: '0.6rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 600, textTransform: 'uppercase' }}>
                                                        Default
                                                    </span>
                                                )}
                                                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.25rem' }}>{addr.name}</h3>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', lineHeight: '1.4', margin: 0 }}>{addr.address}</p>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', margin: 0 }}>{addr.city}, {addr.pincode}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Shipping Form */}
                        <div className="checkout-card mb-4" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '2rem' }}>
                            <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.8rem', marginBottom: '1.5rem', fontWeight: 600 }}>
                                Shipping Information
                            </h2>
                            <form id="checkout-form" onSubmit={handlePlaceOrder}>
                                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                                    <div className="form-group full" style={{ gridColumn: 'span 2' }}>
                                        <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--color-accent)', marginBottom: '0.5rem', fontWeight: 600 }}>Full Name</label>
                                        <input type="text" placeholder="Your Name" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} style={{ width: '100%', background: '#fff', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '12px', outline: 'none' }} />
                                    </div>
                                    <div className="form-group">
                                        <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--color-accent)', marginBottom: '0.5rem', fontWeight: 600 }}>Email Address</label>
                                        <input type="email" placeholder="email@example.com" required value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} style={{ width: '100%', background: '#fff', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '12px', outline: 'none' }} />
                                    </div>
                                    <div className="form-group">
                                        <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--color-accent)', marginBottom: '0.5rem', fontWeight: 600 }}>Phone Number</label>
                                        <input type="tel" placeholder="+91 XXX XXX XXXX" required value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} style={{ width: '100%', background: '#fff', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '12px', outline: 'none' }} />
                                    </div>
                                    <div className="form-group full" style={{ gridColumn: 'span 2' }}>
                                        <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--color-accent)', marginBottom: '0.5rem', fontWeight: 600 }}>Address Line 1</label>
                                        <input type="text" placeholder="House No, Building Name, Street" required value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} style={{ width: '100%', background: '#fff', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '12px', outline: 'none' }} />
                                    </div>
                                    <div className="form-group full" style={{ gridColumn: 'span 2' }}>
                                        <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--color-accent)', marginBottom: '0.5rem', fontWeight: 600 }}>Address Line 2 (Optional)</label>
                                        <input type="text" placeholder="Locality, Landmark" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} style={{ width: '100%', background: '#fff', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '12px', outline: 'none' }} />
                                    </div>
                                    <div className="form-group">
                                        <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--color-accent)', marginBottom: '0.5rem', fontWeight: 600 }}>City</label>
                                        <input type="text" placeholder="City" required value={city} onChange={(e) => setCity(e.target.value)} style={{ width: '100%', background: '#fff', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '12px', outline: 'none' }} />
                                    </div>
                                    <div className="form-group">
                                        <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--color-accent)', marginBottom: '0.5rem', fontWeight: 600 }}>State</label>
                                        <select required value={state} onChange={(e) => setState(e.target.value)} style={{ width: '100%', background: '#fff', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '12px', outline: 'none' }}>
                                            <option value="" disabled>Select State</option>
                                            {STATES.map((s, idx) => (
                                                <option key={idx} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--color-accent)', marginBottom: '0.5rem', fontWeight: 600 }}>Pincode</label>
                                        <input type="text" placeholder="682001" maxLength={6} required value={pincode} onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))} style={{ width: '100%', background: '#fff', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '12px', outline: 'none' }} />
                                    </div>
                                    <div className="form-group">
                                        <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--color-accent)', marginBottom: '0.5rem', fontWeight: 600 }}>Country</label>
                                        <select required disabled style={{ width: '100%', background: '#fff', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '12px', outline: 'none' }}>
                                            <option value="IN">India</option>
                                        </select>
                                    </div>
                                </div>
                                {user && (
                                    <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px dashed var(--color-border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <input 
                                            type="checkbox" 
                                            id="save_address" 
                                            checked={saveAddress}
                                            onChange={(e) => setSaveAddress(e.target.checked)}
                                            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--color-accent)' }} 
                                        />
                                        <label htmlFor="save_address" style={{ fontSize: '0.9rem', color: 'var(--color-text)', cursor: 'pointer', fontWeight: 500 }}>
                                            Save this address for future use
                                        </label>
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Payment Method */}
                        <div className="checkout-card mb-4" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '2rem' }}>
                            <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.8rem', marginBottom: '1.5rem', fontWeight: 600 }}>
                                Payment Method
                            </h2>
                            <div className="payment-options">
                                <label className="payment-option d-block" style={{ border: '1.5px solid var(--color-accent)', background: 'rgba(197, 160, 89, 0.03)', borderRadius: '12px', padding: '1.25rem', cursor: 'pointer' }}>
                                    <input type="radio" name="payment" value="razorpay" defaultChecked style={{ display: 'none' }} />
                                    <div className="payment-content" style={{ width: '100%' }}>
                                        <span style={{ fontWeight: 600, display: 'block', marginBottom: '0.25rem', color: 'var(--color-text)' }}>Secure Online Payment</span>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>UPI, All Cards, Net Banking, and Wallets are supported via Razorpay.</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="order-summary-section">
                        <div className="checkout-card summary-card" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '24px', padding: '2.5rem', position: 'sticky', top: 'calc(var(--header-height) + 2rem)' }}>
                            <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '1.5rem', fontWeight: 600 }}>
                                Order Summary
                            </h2>
                            <div className="summary-items d-flex flex-column gap-3 mb-4" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                                {cart.map((item) => (
                                    <div key={item.cartKey} className="summary-item d-flex justify-content-between align-items-center">
                                        <div className="item-info">
                                            <span className="item-name" style={{ fontWeight: 600, color: 'var(--color-text)', display: 'block', fontSize: '0.95rem' }}>{item.name}</span>
                                            <span className="item-meta" style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>Qty: {item.quantity} • Size: {item.size}</span>
                                        </div>
                                        <span className="item-price" style={{ fontWeight: 600 }}>₹{new Intl.NumberFormat('en-IN').format(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="summary-totals" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                                <div className="total-row d-flex justify-content-between mb-3">
                                    <span>Subtotal</span>
                                    <span>₹{new Intl.NumberFormat('en-IN').format(subtotal)}</span>
                                </div>
                                <div className="total-row d-flex justify-content-between mb-3">
                                    <span>Shipping</span>
                                    <span style={{ color: '#22c55e', fontWeight: 600 }}>FREE</span>
                                </div>
                                <div className="summary-divider my-4" style={{ height: '1px', borderTop: '1px dashed var(--color-border)' }}></div>
                                <div className="total-row grand-total d-flex justify-content-between mb-4" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text)', fontFamily: 'var(--font-serif)' }}>
                                    <span>Total Payable</span>
                                    <span>₹{new Intl.NumberFormat('en-IN').format(subtotal)}</span>
                                </div>
                            </div>

                            <button 
                                type="button" 
                                onClick={handlePlaceOrder}
                                disabled={placingOrder || cart.length === 0}
                                className="place-order-btn btn w-100 py-3"
                                style={{
                                    background: 'var(--color-accent)',
                                    color: 'var(--color-primary)',
                                    border: 'none',
                                    fontWeight: 700,
                                    borderRadius: '30px',
                                    textTransform: 'uppercase',
                                    fontSize: '0.95rem',
                                    letterSpacing: '1px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                            >
                                {placingOrder ? <Loader size={18} className="spin" /> : 'Place Order'}
                            </button>
                            
                            <p className="secure-checkout text-center d-flex align-items-center justify-content-center gap-1 mt-4 mb-0" style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>
                                <ShieldCheck size={16} style={{ color: 'var(--color-accent)' }} /> 100% Secure Checkout — Powered by Razorpay
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Overlay Modal */}
            {successOrderNumber && (
                <div 
                    style={{
                        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                        background: 'rgba(17, 24, 39, 0.7)', backdropFilter: 'blur(8px)', zIndex: 99999,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        transition: 'opacity 0.5s ease'
                    }}
                >
                    <div 
                        className="success-card"
                        style={{
                            background: 'var(--color-surface)', borderRadius: '12px', padding: '3rem 2.5rem', width: '90%', maxWidth: '420px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.05)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center',
                            position: 'relative', overflow: 'hidden', border: '1px solid var(--color-border)'
                        }}
                    >
                        <div 
                            className="success-icon-wrapper mb-4 d-flex align-items-center justify-content-center"
                            style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}
                        >
                            <Check size={36} strokeWidth={2.5} />
                        </div>
                        <h2 style={{ fontSize: '1.8rem', color: 'var(--color-text)', marginBottom: '0.75rem', letterSpacing: '-0.5px' }}>Payment Successful!</h2>
                        <p style={{ fontSize: '1rem', color: 'var(--color-text-light)', marginBottom: '2rem', lineHeight: '1.5' }}>
                            Your order <strong style={{ color: 'var(--color-accent)', fontWeight: 700 }}>{successOrderNumber}</strong> has been confirmed securely.
                        </p>
                        
                        <div className="loading-bar-container" style={{ width: '100%', height: '3px', background: 'rgba(197, 160, 89, 0.1)', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem' }}>
                            <div className="loading-bar" style={{ height: '100%', background: 'var(--color-accent)', width: `${(countdown / 5) * 100}%`, transition: 'width 1s linear' }}></div>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', fontWeight: 500, margin: 0 }}>
                            Redirecting to order details in <span style={{ fontWeight: 700, color: 'var(--color-accent)' }}>{countdown}</span>s...
                        </p>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}

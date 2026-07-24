import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { Check, ClipboardCheck, Package, Truck, Home, ShieldCheck, Loader } from 'lucide-react';

export default function OrderDetails() {
    const { orderNumber } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        fetch(`/api/order/details/${orderNumber}`)
            .then(res => {
                if (!res.ok) {
                    if (res.status === 404) {
                        throw new Error('Order not found');
                    }
                    throw new Error('Failed to load order details');
                }
                return res.json();
            })
            .then(data => {
                if (data.order) {
                    setOrder(data.order);
                } else {
                    throw new Error('Order not found');
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching order details:", err);
                setError(err.message);
                setLoading(false);
            });
    }, [orderNumber]);

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

    if (error || !order) {
        return (
            <AppLayout>
                <div className="container text-center py-5" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text)', marginBottom: '1rem' }}>
                        {error || 'Order Not Found'}
                    </h2>
                    <p style={{ color: 'var(--color-text-light)', marginBottom: '2rem' }}>
                        The requested order details could not be found.
                    </p>
                    <Link to="/shop" className="btn btn-dark" style={{ background: 'var(--color-accent)', border: 'none', color: 'var(--color-primary)', padding: '10px 24px', borderRadius: '30px', textDecoration: 'none' }}>
                        Continue Shopping
                    </Link>
                </div>
            </AppLayout>
        );
    }

    const statusList = ['confirmed', 'processing', 'shipped', 'delivered'];
    const currentStatusIndex = statusList.indexOf(order.status.toLowerCase()) !== -1 
        ? statusList.indexOf(order.status.toLowerCase()) 
        : 0;

    const timelineSteps = [
        { key: 'confirmed', label: 'Order Confirmed', icon: ClipboardCheck },
        { key: 'processing', label: 'Processing', icon: Package },
        { key: 'shipped', label: 'Shipped', icon: Truck },
        { key: 'delivered', label: 'Delivered', icon: Home }
    ];

    const formattedDate = new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).format(new Date(order.created_at));

    return (
        <AppLayout>
            <div className="container animate-fade-in" style={{ maxWidth: '800px', margin: '4rem auto', padding: '0 1.5rem', fontFamily: 'var(--font-family)', minHeight: '80vh' }}>
                {/* Success Banner */}
                <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderTop: '5px solid var(--color-accent)', borderRadius: '12px', padding: '3rem 2rem', textAlign: 'center', marginBottom: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                    <div style={{ width: '70px', height: '70px', background: 'rgba(197, 160, 89, 0.1)', color: 'var(--color-accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <Check size={36} />
                    </div>
                    <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', color: 'var(--color-text)', marginBottom: '0.75rem', fontWeight: 600 }}>Order Confirmed!</h1>
                    <p style={{ color: 'var(--color-text-light)', fontSize: '1.05rem', margin: 0 }}>Thank you for shopping with Aakrithi. Your elegance is on its way.</p>
                </div>

                {/* Order Summary Info */}
                <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '2rem', marginBottom: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                        <div>
                            <p style={{ color: 'var(--color-text-light)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem', margin: 0 }}>Order Number</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-accent)', letterSpacing: '1px', margin: 0 }}>{order.order_number}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ color: 'var(--color-text-light)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', margin: 0 }}>Status</p>
                            <span style={{ background: 'rgba(197, 160, 89, 0.1)', color: 'var(--color-accent)', padding: '6px 16px', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 600, border: '1px solid rgba(197, 160, 89, 0.2)' }}>
                                {order.status}
                            </span>
                        </div>
                    </div>
                    <div className="d-flex flex-wrap gap-4 pt-3" style={{ borderTop: '1px dashed var(--color-border)', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ color: 'var(--color-text-light)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.25rem', margin: 0 }}>Date</p>
                            <p style={{ fontWeight: 500, color: 'var(--color-text)', margin: 0 }}>{formattedDate}</p>
                        </div>
                        <div>
                            <p style={{ color: 'var(--color-text-light)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.25rem', margin: 0 }}>Payment</p>
                            <p style={{ fontWeight: 500, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                                {order.payment_method === 'razorpay' ? 'Paid Online' : 'Cash on Delivery'}
                                {order.payment_status === 'verified' && (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#16a34a', fontSize: '0.7rem', fontWeight: 700, background: 'rgba(22, 163, 74, 0.1)', padding: '2px 8px', borderRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        <ShieldCheck size={12} /> Verified
                                    </span>
                                )}
                            </p>
                        </div>
                        {order.payment_id && (
                            <div>
                                <p style={{ color: 'var(--color-text-light)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.25rem', margin: 0 }}>Payment ID</p>
                                <p style={{ fontWeight: 500, fontSize: '0.9rem', color: 'var(--color-text)', margin: 0 }}>{order.payment_id}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Track Status Timeline */}
                <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '2rem 1.5rem', marginBottom: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '2rem', color: 'var(--color-text)', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>Track Your Order</h2>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', width: '100%', paddingBottom: '1rem' }}>
                        <div style={{ position: 'absolute', top: '22px', left: '12.5%', right: '12.5%', height: '3px', background: 'var(--color-border)', zIndex: 1 }}></div>
                        <div style={{ position: 'absolute', top: '22px', left: '12.5%', height: '3px', background: 'var(--color-accent)', zIndex: 2, width: `${(currentStatusIndex / (statusList.length - 1)) * 75}%`, transition: 'width 0.5s ease' }}></div>
                        
                        {timelineSteps.map((step, idx) => {
                            const isCompleted = idx <= currentStatusIndex;
                            const isActive = idx === currentStatusIndex;
                            const IconComponent = step.icon;

                            return (
                                <div key={step.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 3 }}>
                                    <div 
                                        style={{ 
                                            width: '44px', 
                                            height: '44px', 
                                            borderRadius: '50%', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center', 
                                            marginBottom: '0.5rem', 
                                            background: isCompleted ? 'var(--color-accent)' : '#fff', 
                                            border: isCompleted ? '2px solid var(--color-accent)' : '2px solid var(--color-border)',
                                            color: isCompleted ? '#fff' : 'var(--color-text-light)',
                                            boxShadow: isActive ? '0 0 0 4px rgba(197, 160, 89, 0.2)' : 'none'
                                        }}
                                    >
                                        <IconComponent size={20} />
                                    </div>
                                    <p 
                                        style={{ 
                                            fontSize: '0.8rem', 
                                            textAlign: 'center', 
                                            fontWeight: isActive ? '700' : '500', 
                                            color: isCompleted ? 'var(--color-text)' : 'var(--color-text-light)', 
                                            margin: 0,
                                            lineHeight: 1.2
                                        }}
                                    >
                                        {step.label}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Items Section */}
                <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '2rem', marginBottom: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--color-text)', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>Items Ordered</h2>
                    {order.items.map((item, idx) => (
                        <div 
                            key={idx} 
                            style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center', 
                                padding: '1rem 0', 
                                borderBottom: idx !== order.items.length - 1 ? '1px solid var(--color-border)' : 'none' 
                            }}
                        >
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                {item.image && (
                                    <img src={item.image} alt={item.name} style={{ width: '60px', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
                                )}
                                <div>
                                    <p style={{ fontWeight: 500, color: 'var(--color-text)', fontSize: '1.05rem', margin: '0 0 0.25rem 0' }}>{item.name}</p>
                                    <p style={{ color: 'var(--color-text-light)', fontSize: '0.85rem', margin: 0 }}>Qty: {item.quantity} • Size: {item.size || 'Free Size'}</p>
                                </div>
                            </div>
                            <p style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '1.1rem', margin: 0 }}>
                                ₹{new Intl.NumberFormat('en-IN').format(item.price * item.quantity)}
                            </p>
                        </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', marginTop: '0.5rem', borderTop: '2px solid var(--color-border)' }}>
                        <p style={{ fontWeight: 600, fontSize: '1.25rem', color: 'var(--color-text)', margin: 0 }}>Total</p>
                        <p style={{ fontWeight: 700, fontSize: '1.4rem', color: 'var(--color-accent)', margin: 0 }}>
                            ₹{new Intl.NumberFormat('en-IN').format(order.total)}
                        </p>
                    </div>
                </div>

                {/* Shipping Address Section */}
                <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '2rem', marginBottom: '2.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--color-text)', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>Shipping Details</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <p style={{ color: 'var(--color-text-light)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.25rem', margin: 0 }}>Name</p>
                            <p style={{ fontWeight: 500, color: 'var(--color-text)', margin: 0 }}>{order.customer_name}</p>
                        </div>
                        <div>
                            <p style={{ color: 'var(--color-text-light)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.25rem', margin: 0 }}>Phone</p>
                            <p style={{ fontWeight: 500, color: 'var(--color-text)', margin: 0 }}>{order.customer_phone}</p>
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <p style={{ color: 'var(--color-text-light)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.25rem', margin: 0 }}>Delivery Address</p>
                            <p style={{ fontWeight: 500, color: 'var(--color-text)', lineHeight: 1.6, margin: 0 }}>
                                {order.shipping_address}<br />{order.city}, {order.state} - {order.pincode}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Keep Shopping Button */}
                <div className="text-center">
                    <Link 
                        to="/shop" 
                        className="btn"
                        style={{
                            display: 'inline-block',
                            padding: '14px 40px',
                            background: 'var(--color-accent)',
                            color: 'var(--color-primary)',
                            borderRadius: '30px',
                            fontWeight: 700,
                            fontSize: '1rem',
                            letterSpacing: '1px',
                            textDecoration: 'none',
                            textTransform: 'uppercase',
                            transition: 'opacity 0.2s'
                        }}
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}

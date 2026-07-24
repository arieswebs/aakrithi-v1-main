import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { useApp } from '../context/AppContext';
import { 
    User, Mail, Lock, ShoppingBag, MapPin, Settings, LogOut, 
    ChevronRight, Loader, Plus, Trash2 
} from 'lucide-react';

const STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
    "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", 
    "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", 
    "Lakshadweep", "Puducherry"
];

export default function Account() {
    const { user, login, logout } = useApp();
    
    // Auth Panel states
    const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
    const [authName, setAuthName] = useState('');
    const [authEmail, setAuthEmail] = useState('');
    const [authPassword, setAuthPassword] = useState('');
    const [authConfirmPassword, setAuthConfirmPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [authLoading, setAuthLoading] = useState(false);

    // Dashboard navigation tab
    const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'orders', 'addresses', 'profile'

    // Data lists
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [loadingAddresses, setLoadingAddresses] = useState(false);

    // New Address Form states
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [newAddrName, setNewAddrName] = useState('');
    const [newAddrEmail, setNewAddrEmail] = useState('');
    const [newAddrPhone, setNewAddrPhone] = useState('');
    const [newAddrLine1, setNewAddrLine1] = useState('');
    const [newAddrLine2, setNewAddrLine2] = useState('');
    const [newAddrCity, setNewAddrCity] = useState('');
    const [newAddrState, setNewAddrState] = useState('');
    const [newAddrPincode, setNewAddrPincode] = useState('');
    const [newAddrDefault, setNewAddrDefault] = useState(false);
    const [savingAddress, setSavingAddress] = useState(false);

    // Fetch user details when logged in
    useEffect(() => {
        if (user && user.id) {
            // Load Orders
            setLoadingOrders(true);
            fetch(`/api/user/orders?email=${user.email}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) setOrders(data.orders);
                    setLoadingOrders(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoadingOrders(false);
                });

            // Load Addresses
            loadAddresses();
        }
    }, [user]);

    const loadAddresses = () => {
        if (!user) return;
        setLoadingAddresses(true);
        fetch(`/api/user/addresses?userId=${user.id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) setAddresses(data.addresses);
                setLoadingAddresses(false);
            })
            .catch(err => {
                console.error(err);
                setLoadingAddresses(false);
            });
    };

    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        setAuthError('');
        setAuthLoading(true);

        const url = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
        const bodyData = authMode === 'login' ? {
            email: authEmail,
            password: authPassword
        } : {
            name: authName,
            email: authEmail,
            password: authPassword,
            password_confirmation: authConfirmPassword
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
            } else {
                setAuthError(data.message || 'Authentication failed. Please check credentials.');
            }
        } catch (err) {
            console.error(err);
            setAuthError('Connection failed. Please try again.');
        } finally {
            setAuthLoading(false);
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        if (!user) return;

        setSavingAddress(true);
        try {
            const fullAddress = newAddrLine1 + (newAddrLine2 ? ', ' + newAddrLine2 : '');
            const res = await fetch('/api/user/addresses/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    name: newAddrName,
                    email: newAddrEmail,
                    phone: newAddrPhone,
                    address: fullAddress,
                    city: newAddrCity,
                    state: newAddrState,
                    pincode: newAddrPincode,
                    is_default: newAddrDefault
                })
            });

            const data = await res.json();
            if (res.ok && data.success) {
                setShowAddressForm(false);
                // Reset form
                setNewAddrName('');
                setNewAddrEmail('');
                setNewAddrPhone('');
                setNewAddrLine1('');
                setNewAddrLine2('');
                setNewAddrCity('');
                setNewAddrState('');
                setNewAddrPincode('');
                setNewAddrDefault(false);
                // Reload list
                loadAddresses();
            } else {
                alert(data.message || 'Failed to add address.');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to save address.');
        } finally {
            setSavingAddress(false);
        }
    };

    const handleDeleteAddress = async (addressId) => {
        if (!user || !confirm('Are you sure you want to delete this address?')) return;

        try {
            const res = await fetch('/api/user/addresses/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ addressId, userId: user.id })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                loadAddresses();
            } else {
                alert(data.message || 'Failed to delete address.');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to delete address.');
        }
    };

    if (!user) {
        // Authenticate form panel
        return (
            <AppLayout>
                <div className="container animate-fade-in" style={{ padding: '6rem 1rem', display: 'flex', justifyContent: 'center', minHeight: '80vh' }}>
                    <div 
                        className="auth-card" 
                        style={{
                            background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px',
                            width: '100%', maxWidth: '440px', padding: '3rem 2.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.03)'
                        }}
                    >
                        <div className="text-center mb-4">
                            <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text)', fontSize: '2.2rem', fontWeight: 500 }}>
                                {authMode === 'login' ? 'Sign In' : 'Create Account'}
                            </h1>
                            <p style={{ color: 'var(--color-text-light)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                {authMode === 'login' ? 'Enter your details to log in to your account.' : 'Create an account to track orders and save addresses.'}
                            </p>
                        </div>

                        {authError && (
                            <div className="alert alert-danger py-2 px-3 mb-3" style={{ fontSize: '0.85rem', borderRadius: '6px' }}>
                                {authError}
                            </div>
                        )}

                        <form onSubmit={handleAuthSubmit} className="d-flex flex-column gap-3">
                            {authMode === 'register' && (
                                <div style={{ position: 'relative' }}>
                                    <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                                    <input 
                                        type="text" 
                                        placeholder="Full Name" 
                                        required 
                                        value={authName}
                                        onChange={(e) => setAuthName(e.target.value)}
                                        style={{ width: '100%', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '12px 12px 12px 40px', outline: 'none' }}
                                    />
                                </div>
                            )}
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                                <input 
                                    type="email" 
                                    placeholder="Email address" 
                                    required 
                                    value={authEmail}
                                    onChange={(e) => setAuthEmail(e.target.value)}
                                    style={{ width: '100%', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '12px 12px 12px 40px', outline: 'none' }}
                                />
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                                <input 
                                    type="password" 
                                    placeholder="Password" 
                                    required 
                                    value={authPassword}
                                    onChange={(e) => setAuthPassword(e.target.value)}
                                    style={{ width: '100%', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '12px 12px 12px 40px', outline: 'none' }}
                                />
                            </div>
                            {authMode === 'register' && (
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                                    <input 
                                        type="password" 
                                        placeholder="Confirm Password" 
                                        required 
                                        value={authConfirmPassword}
                                        onChange={(e) => setAuthConfirmPassword(e.target.value)}
                                        style={{ width: '100%', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '12px 12px 12px 40px', outline: 'none' }}
                                    />
                                </div>
                            )}

                            <button 
                                type="submit" 
                                disabled={authLoading}
                                style={{
                                    width: '100%', marginTop: '0.5rem', padding: '12px', borderRadius: '30px', fontSize: '1rem',
                                    background: 'var(--color-accent)', border: 'none', color: 'var(--color-primary)', fontWeight: 600,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}
                            >
                                {authLoading ? <Loader size={18} className="spin" /> : (authMode === 'login' ? 'Sign In' : 'Register Account')}
                            </button>
                        </form>

                        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--color-text)' }}>
                            {authMode === 'login' ? (
                                <>Don't have an account? <button onClick={() => setAuthMode('register')} className="bg-transparent border-0 p-0" style={{ fontWeight: 700, color: 'var(--color-accent)', textDecoration: 'underline' }}>Sign Up</button></>
                            ) : (
                                <>Already have an account? <button onClick={() => setAuthMode('login')} className="bg-transparent border-0 p-0" style={{ fontWeight: 700, color: 'var(--color-accent)', textDecoration: 'underline' }}>Sign In</button></>
                            )}
                        </p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    // Authenticated Dashboard Portal
    return (
        <AppLayout>
            <div className="container animate-fade-in" style={{ paddingTop: '4rem', paddingBottom: '7rem', minHeight: '80vh' }}>
                <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text)', fontSize: '2.5rem', marginBottom: '3rem', fontWeight: 500 }}>
                    My Account
                </h1>

                <div className="account-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '3.5rem', alignItems: 'start' }}>
                    {/* Navigation Sidebar */}
                    <div 
                        className="account-sidebar"
                        style={{
                            background: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem'
                        }}
                    >
                        <button 
                            onClick={() => setActiveTab('dashboard')}
                            className={`btn text-start d-flex align-items-center gap-2 p-3 ${activeTab === 'dashboard' ? 'active' : ''}`}
                            style={{
                                border: 'none', background: activeTab === 'dashboard' ? 'rgba(197, 160, 89, 0.08)' : 'transparent',
                                color: activeTab === 'dashboard' ? 'var(--color-accent)' : 'var(--color-text)',
                                fontWeight: activeTab === 'dashboard' ? 700 : 500, borderRadius: '8px', width: '100%'
                            }}
                        >
                            <User size={18} /> Overview
                        </button>
                        <button 
                            onClick={() => setActiveTab('orders')}
                            className={`btn text-start d-flex align-items-center gap-2 p-3 ${activeTab === 'orders' ? 'active' : ''}`}
                            style={{
                                border: 'none', background: activeTab === 'orders' ? 'rgba(197, 160, 89, 0.08)' : 'transparent',
                                color: activeTab === 'orders' ? 'var(--color-accent)' : 'var(--color-text)',
                                fontWeight: activeTab === 'orders' ? 700 : 500, borderRadius: '8px', width: '100%'
                            }}
                        >
                            <ShoppingBag size={18} /> Order History
                        </button>
                        <button 
                            onClick={() => setActiveTab('addresses')}
                            className={`btn text-start d-flex align-items-center gap-2 p-3 ${activeTab === 'addresses' ? 'active' : ''}`}
                            style={{
                                border: 'none', background: activeTab === 'addresses' ? 'rgba(197, 160, 89, 0.08)' : 'transparent',
                                color: activeTab === 'addresses' ? 'var(--color-accent)' : 'var(--color-text)',
                                fontWeight: activeTab === 'addresses' ? 700 : 500, borderRadius: '8px', width: '100%'
                            }}
                        >
                            <MapPin size={18} /> Saved Addresses
                        </button>
                        <button 
                            onClick={() => setActiveTab('profile')}
                            className={`btn text-start d-flex align-items-center gap-2 p-3 ${activeTab === 'profile' ? 'active' : ''}`}
                            style={{
                                border: 'none', background: activeTab === 'profile' ? 'rgba(197, 160, 89, 0.08)' : 'transparent',
                                color: activeTab === 'profile' ? 'var(--color-accent)' : 'var(--color-text)',
                                fontWeight: activeTab === 'profile' ? 700 : 500, borderRadius: '8px', width: '100%'
                            }}
                        >
                            <Settings size={18} /> Profile Settings
                        </button>
                        <hr style={{ borderColor: 'var(--color-border)' }} />
                        <button 
                            onClick={logout}
                            className="btn text-start d-flex align-items-center gap-2 p-3"
                            style={{ border: 'none', background: 'transparent', color: '#dc3545', fontWeight: 500, borderRadius: '8px', width: '100%' }}
                        >
                            <LogOut size={18} /> Sign Out
                        </button>
                    </div>

                    {/* Active Tab Panel */}
                    <div className="account-panel">
                        {/* 1. Dashboard Tab */}
                        {activeTab === 'dashboard' && (
                            <div className="d-flex flex-column gap-4">
                                <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '2.5rem' }}>
                                    <h2 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-serif)', color: 'var(--color-text)', marginBottom: '0.5rem', fontWeight: 500 }}>
                                        Welcome, {user.name}!
                                    </h2>
                                    <p style={{ color: 'var(--color-text-light)', margin: 0, fontSize: '0.95rem' }}>
                                        From your account dashboard, you can view your recent orders, manage your shipping addresses, and edit password and profile configurations.
                                    </p>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                    {/* Recent Order Summary */}
                                    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '2rem' }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '1.25rem' }}>Recent Order</h3>
                                        {loadingOrders ? (
                                            <Loader size={20} className="spin" />
                                        ) : orders.length > 0 ? (
                                            <div>
                                                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>
                                                    Order <strong style={{ color: 'var(--color-accent)' }}>{orders[0].order_number}</strong> on {new Intl.DateTimeFormat('en-IN').format(new Date(orders[0].created_at))}
                                                </p>
                                                <p style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0.5rem 0' }}>
                                                    ₹{new Intl.NumberFormat('en-IN').format(orders[0].total)}
                                                </p>
                                                <Link to={`/order/${orders[0].order_number}`} style={{ color: 'var(--color-accent)', textDecoration: 'underline', fontSize: '0.85rem', fontWeight: 600 }}>
                                                    View Receipt Details
                                                </Link>
                                            </div>
                                        ) : (
                                            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', margin: 0 }}>You have not placed any orders yet.</p>
                                        )}
                                    </div>

                                    {/* Default Address Summary */}
                                    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '2rem' }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '1.25rem' }}>Default Address</h3>
                                        {loadingAddresses ? (
                                            <Loader size={20} className="spin" />
                                        ) : addresses.length > 0 ? (
                                            <div>
                                                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, margin: '0 0 0.25rem 0' }}>{addresses[0].name}</h4>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', margin: 0 }}>{addresses[0].address}</p>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', margin: '0 0 1rem 0' }}>{addresses[0].city}, {addresses[0].state} - {addresses[0].pincode}</p>
                                                <button onClick={() => setActiveTab('addresses')} style={{ color: 'var(--color-accent)', border: 'none', background: 'transparent', textDecoration: 'underline', fontSize: '0.85rem', fontWeight: 600, padding: 0 }}>
                                                    Manage Addresses
                                                </button>
                                            </div>
                                        ) : (
                                            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', margin: 0 }}>You have not saved any addresses yet.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 2. Orders Tab */}
                        {activeTab === 'orders' && (
                            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '2.5rem' }}>
                                <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', color: 'var(--color-text)', marginBottom: '1.5rem', fontWeight: 600 }}>
                                    Order History
                                </h2>

                                {loadingOrders ? (
                                    <div className="text-center py-4"><Loader size={24} className="spin" /></div>
                                ) : orders.length === 0 ? (
                                    <p style={{ color: 'var(--color-text-light)', margin: 0 }}>You have not placed any orders yet.</p>
                                ) : (
                                    <div className="d-flex flex-column gap-3">
                                        {orders.map((ord) => (
                                            <div 
                                                key={ord.id}
                                                style={{
                                                    border: '1px solid var(--color-border)', borderRadius: '10px', padding: '1.5rem',
                                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'
                                                }}
                                            >
                                                <div>
                                                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-light)', letterSpacing: '0.5px' }}>
                                                        {new Intl.DateTimeFormat('en-IN').format(new Date(ord.created_at))}
                                                    </span>
                                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-accent)', margin: '0.25rem 0' }}>
                                                        {ord.order_number}
                                                    </h3>
                                                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text)' }}>
                                                        {ord.items.length} {ord.items.length === 1 ? 'item' : 'items'} • ₹{new Intl.NumberFormat('en-IN').format(ord.total)}
                                                    </span>
                                                </div>
                                                <div className="d-flex align-items-center gap-3">
                                                    <span style={{ background: 'rgba(197, 160, 89, 0.1)', color: 'var(--color-accent)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                                                        {ord.status}
                                                    </span>
                                                    <Link to={`/order/${ord.order_number}`} style={{ color: 'var(--color-text)', display: 'flex', alignItems: 'center' }}>
                                                        <ChevronRight size={20} />
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 3. Addresses Tab */}
                        {activeTab === 'addresses' && (
                            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '2.5rem' }}>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', color: 'var(--color-text)', margin: 0, fontWeight: 600 }}>
                                        Saved Addresses
                                    </h2>
                                    {!showAddressForm && (
                                        <button 
                                            onClick={() => setShowAddressForm(true)}
                                            className="btn btn-dark btn-sm d-flex align-items-center gap-1"
                                            style={{ background: 'var(--color-accent)', border: 'none', color: 'var(--color-primary)', borderRadius: '20px', padding: '8px 16px', fontSize: '0.85rem', fontWeight: 600 }}
                                        >
                                            <Plus size={16} /> Add Address
                                        </button>
                                    )}
                                </div>

                                {showAddressForm && (
                                    <div className="mb-4 p-4" style={{ border: '1px solid var(--color-border)', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.5)' }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem' }}>Add Shipping Destination</h3>
                                        <form onSubmit={handleAddAddress}>
                                            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                                <div className="form-group full" style={{ gridColumn: 'span 2' }}>
                                                    <input type="text" placeholder="Receiver's Name" required value={newAddrName} onChange={(e) => setNewAddrName(e.target.value)} style={{ width: '100%', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '10px', outline: 'none' }} />
                                                </div>
                                                <div>
                                                    <input type="email" placeholder="Email Address" required value={newAddrEmail} onChange={(e) => setNewAddrEmail(e.target.value)} style={{ width: '100%', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '10px', outline: 'none' }} />
                                                </div>
                                                <div>
                                                    <input type="tel" placeholder="Phone Number" required value={newAddrPhone} onChange={(e) => setNewAddrPhone(e.target.value)} style={{ width: '100%', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '10px', outline: 'none' }} />
                                                </div>
                                                <div className="form-group full" style={{ gridColumn: 'span 2' }}>
                                                    <input type="text" placeholder="Address Line 1" required value={newAddrLine1} onChange={(e) => setNewAddrLine1(e.target.value)} style={{ width: '100%', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '10px', outline: 'none' }} />
                                                </div>
                                                <div className="form-group full" style={{ gridColumn: 'span 2' }}>
                                                    <input type="text" placeholder="Address Line 2 (Optional)" value={newAddrLine2} onChange={(e) => setNewAddrLine2(e.target.value)} style={{ width: '100%', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '10px', outline: 'none' }} />
                                                </div>
                                                <div>
                                                    <input type="text" placeholder="City" required value={newAddrCity} onChange={(e) => setNewAddrCity(e.target.value)} style={{ width: '100%', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '10px', outline: 'none' }} />
                                                </div>
                                                <div>
                                                    <select required value={newAddrState} onChange={(e) => setNewAddrState(e.target.value)} style={{ width: '100%', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '10px', outline: 'none', background: '#fff' }}>
                                                        <option value="" disabled>Select State</option>
                                                        {STATES.map((s, idx) => <option key={idx} value={s}>{s}</option>)}
                                                    </select>
                                                </div>
                                                <div>
                                                    <input type="text" placeholder="Pincode" maxLength={6} required value={newAddrPincode} onChange={(e) => setNewAddrPincode(e.target.value.replace(/\D/g, ''))} style={{ width: '100%', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '10px', outline: 'none' }} />
                                                </div>
                                                <div className="d-flex align-items-center gap-2">
                                                    <input type="checkbox" id="addr_default" checked={newAddrDefault} onChange={(e) => setNewAddrDefault(e.target.checked)} style={{ cursor: 'pointer', width: '16px', height: '16px' }} />
                                                    <label htmlFor="addr_default" style={{ fontSize: '0.85rem', cursor: 'pointer', margin: 0, fontWeight: 500 }}>Make default address</label>
                                                </div>
                                            </div>
                                            <div className="d-flex gap-2">
                                                <button type="submit" disabled={savingAddress} className="btn btn-dark" style={{ background: 'var(--color-accent)', border: 'none', color: 'var(--color-primary)', borderRadius: '20px', padding: '8px 24px', fontSize: '0.9rem', fontWeight: 600 }}>
                                                    {savingAddress ? <Loader size={18} className="spin" /> : 'Save Address'}
                                                </button>
                                                <button type="button" onClick={() => setShowAddressForm(false)} className="btn btn-outline-secondary" style={{ borderRadius: '20px', padding: '8px 24px', fontSize: '0.9rem' }}>
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {loadingAddresses ? (
                                    <div className="text-center py-4"><Loader size={24} className="spin" /></div>
                                ) : addresses.length === 0 ? (
                                    <p style={{ color: 'var(--color-text-light)', margin: 0 }}>You have not saved any addresses yet.</p>
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
                                        {addresses.map((addr) => (
                                            <div 
                                                key={addr.id}
                                                style={{
                                                    border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1.25rem',
                                                    position: 'relative', background: '#fff'
                                                }}
                                            >
                                                {addr.is_default && (
                                                    <span className="badge mb-2" style={{ background: 'var(--color-accent)', color: '#fff', fontSize: '0.6rem', padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 700 }}>
                                                        Default
                                                    </span>
                                                )}
                                                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginTop: addr.is_default ? '0.5rem' : '0' }}>{addr.name}</h3>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', margin: '0.5rem 0 0 0', lineHeight: 1.4 }}>{addr.address}</p>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', margin: 0 }}>{addr.city}, {addr.state} - {addr.pincode}</p>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', margin: '0.25rem 0 0 0' }}>Phone: {addr.phone}</p>
                                                
                                                <button 
                                                    onClick={() => handleDeleteAddress(addr.id)}
                                                    style={{ position: 'absolute', bottom: '1rem', right: '1rem', border: 'none', background: 'transparent', color: '#dc3545', cursor: 'pointer', padding: 0 }}
                                                    title="Delete address"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 4. Profile Tab */}
                        {activeTab === 'profile' && (
                            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '2.5rem' }}>
                                <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', color: 'var(--color-text)', marginBottom: '1.5rem', fontWeight: 600 }}>
                                    Profile Details
                                </h2>

                                <div className="d-flex flex-column gap-3" style={{ maxWidth: '400px' }}>
                                    <div className="p-3" style={{ border: '1px solid var(--color-border)', borderRadius: '8px', background: '#fff' }}>
                                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-light)' }}>Full Name</span>
                                        <p style={{ fontWeight: 600, color: 'var(--color-text)', margin: '0.25rem 0 0 0' }}>{user.name}</p>
                                    </div>
                                    <div className="p-3" style={{ border: '1px solid var(--color-border)', borderRadius: '8px', background: '#fff' }}>
                                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-light)' }}>Email Address</span>
                                        <p style={{ fontWeight: 600, color: 'var(--color-text)', margin: '0.25rem 0 0 0' }}>{user.email}</p>
                                    </div>
                                    <div className="p-3" style={{ border: '1px solid var(--color-border)', borderRadius: '8px', background: '#fff' }}>
                                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-light)' }}>Account Type</span>
                                        <p style={{ fontWeight: 600, color: 'var(--color-text)', margin: '0.25rem 0 0 0' }}>
                                            {user.is_admin ? 'Store Administrator' : 'Retail Customer'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

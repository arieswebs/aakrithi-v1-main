@extends('layouts.app')

@section('meta_title', 'Wholesale Checkout | Aakrithi B2B')
@section('body_class', 'home-page')

@section('content')
<div class="checkout-container wholesale-checkout reveal-up">
    <div class="checkout-header">
        <span class="badge-premium">B2B Order Portal</span>
        <h1>Partner Checkout</h1>
        <div class="checkout-status-bar">
            <div class="status-item active"><i data-lucide="truck"></i> Logistics</div>
            <div class="status-item"><i data-lucide="file-text"></i> B2B Details</div>
            <div class="status-item"><i data-lucide="check-square"></i> Confirmation</div>
        </div>
    </div>

    <div class="checkout-layout">
        <div class="checkout-form-section">
            {{-- Business Information --}}
            <div class="checkout-card glass-card reveal-up">
                <h2>Business Information</h2>
                <form id="wholesale-checkout-form" class="premium-form">
                    <div class="form-grid">
                        <div class="form-group full">
                            <label>Registered Business Name</label>
                            <input type="text" id="biz_name" name="business_name" placeholder="Legal Entity Name" required>
                        </div>
                        <div class="form-group">
                            <label>Tax ID / GST Number</label>
                            <input type="text" id="tax_id" name="tax_id" placeholder="Optional for inquiry">
                        </div>
                        <div class="form-group">
                            <label>Business Type</label>
                            <select name="biz_type">
                                <option value="boutique">Boutique / Retail Store</option>
                                <option value="online">Online Retailer</option>
                                <option value="distributor">Distributor</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>

            {{-- Shipping --}}
            <div class="checkout-card glass-card reveal-up" style="margin-top: 2rem;">
                <h2>Bulk Shipping Address</h2>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Contact Person</label>
                        <input type="text" id="contact_name" placeholder="Full Name" required>
                    </div>
                    <div class="form-group">
                        <label>Primary Phone</label>
                        <input type="tel" id="contact_phone" placeholder="Phone Number" required>
                    </div>
                    <div class="form-group full">
                        <label>Warehouse / Store Address</label>
                        <input type="text" id="addr1" placeholder="Building, Street, Area" required>
                    </div>
                    <div class="form-group">
                        <label>City</label>
                        <input type="text" id="city" placeholder="City" required>
                    </div>
                    <div class="form-group">
                        <label>Pincode / ZIP</label>
                        <input type="text" id="zip" placeholder="Pincode" required>
                    </div>
                </div>
            </div>
        </div>

        <div class="order-summary-section">
            <div class="checkout-card summary-card glass-card reveal-blur">
                <h2>Wholesale Summary</h2>
                <div class="moq-badge-mini">
                    <i data-lucide="check-circle"></i> MOQ Met ({{ $totalQuantity }} Pcs)
                </div>

                <div class="summary-items">
                    @foreach($cart as $id => $details)
                    <div class="summary-item">
                        <div class="item-info">
                            <span class="item-name">{{ $details['name'] }}</span>
                            <span class="item-meta">Bulk Qty: {{ $details['quantity'] }}</span>
                        </div>
                        <span class="item-price">₹{{ number_format($details['price'] * $details['quantity']) }}</span>
                    </div>
                    @endforeach
                </div>

                <div class="summary-totals">
                    <div class="total-row">
                        <span>Wholesale Subtotal</span>
                        <span>₹{{ number_format($total) }}</span>
                    </div>
                    <div class="total-row">
                        <span>B2B Logistics</span>
                        <span class="highlight">To be quoted</span>
                    </div>
                    <div class="total-row grand-total">
                        <span>Order Total</span>
                        <span>₹{{ number_format($total) }}</span>
                    </div>
                </div>

                <button type="button" id="submitWholesaleBtn" class="btn-primary w-100 mt-4" style="padding: 1.2rem;">
                    Confirm Wholesale Order
                </button>
                
                <p class="b2b-note">
                    <i data-lucide="info"></i> A representative will contact you within 24h to finalize shipping logistics and bulk discounts.
                </p>
            </div>
        </div>
    </div>
</div>

<script>
    document.getElementById('submitWholesaleBtn').addEventListener('click', function() {
        alert('Wholesale Order Received! Your dedicated partnership manager will contact you shortly with the final proforma invoice including bulk shipping rates.');
        window.location.href = "{{ route('landing') }}";
    });
</script>

<style>
    .wholesale-checkout { padding-top: 4rem; padding-bottom: 8rem; }
    
    .checkout-header { text-align: center; margin-bottom: 4rem; }
    
    .checkout-status-bar {
        display: flex;
        justify-content: center;
        gap: 3rem;
        margin-top: 2rem;
    }

    .status-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.85rem;
        color: var(--color-text-light);
        opacity: 0.5;
    }

    .status-item.active { opacity: 1; color: var(--color-accent); font-weight: 700; }

    .glass-card {
        background: rgba(10, 47, 39, 0.4);
        border: 1px solid var(--color-border);
        border-radius: 24px;
        padding: 3rem;
        backdrop-filter: blur(10px);
    }

    .moq-badge-mini {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: rgba(80, 200, 120, 0.1);
        color: var(--color-accent);
        padding: 0.5rem 1rem;
        border-radius: 8px;
        font-size: 0.8rem;
        font-weight: 700;
        margin-bottom: 2rem;
    }

    .checkout-layout {
        display: grid;
        grid-template-columns: 1.5fr 1fr;
        gap: 4rem;
        align-items: start;
    }

    .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
    }

    .form-group.full { grid-column: span 2; }

    .form-group label {
        display: block;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 2px;
        color: var(--color-accent);
        margin-bottom: 0.75rem;
        font-weight: 600;
    }

    .premium-form input, .premium-form select {
        width: 100%;
        background: rgba(255,255,255,0.05);
        border: 1px solid var(--color-border);
        border-radius: 12px;
        padding: 1rem;
        color: var(--color-text);
        outline: none;
        transition: border-color 0.3s;
    }

    .premium-form input:focus { border-color: var(--color-accent); }

    .summary-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px dashed rgba(255,255,255,0.1);
    }

    .item-name { display: block; font-weight: 600; color: var(--color-text); }
    .item-meta { font-size: 0.8rem; color: var(--color-accent); }

    .summary-totals { margin-top: 2rem; }
    
    .total-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.75rem;
        font-size: 0.95rem;
    }

    .total-row.grand-total {
        margin-top: 1.5rem;
        padding-top: 1.5rem;
        border-top: 1px solid var(--color-border);
        font-size: 1.4rem;
        font-weight: 700;
        font-family: var(--font-serif);
    }

    .highlight { color: var(--color-accent); font-weight: 700; }

    .b2b-note {
        margin-top: 2rem;
        font-size: 0.8rem;
        color: var(--color-text-light);
        line-height: 1.6;
        display: flex;
        gap: 0.75rem;
        background: rgba(255,255,255,0.03);
        padding: 1rem;
        border-radius: 12px;
    }

    .b2b-note i { color: var(--color-accent); width: 20px; flex-shrink: 0; }

    @media (max-width: 992px) {
        .checkout-layout { grid-template-columns: 1fr; }
    }
</style>
@endsection

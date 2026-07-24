@extends('layouts.app')

@section('meta_title', 'Wholesale: ' . $product->name . ' | Aakrithi B2B')

@section('body_class', 'home-page')

@section('content')
<div class="container product-detail-page wholesale-detail fade-in">
    <nav class="breadcrumb">
        <a href="{{ route('landing') }}">Home</a> <i data-lucide="chevron-right"></i>
        <a href="{{ route('wholesale') }}">Wholesale Hub</a> <i data-lucide="chevron-right"></i>
        <span>{{ $product->name }}</span>
    </nav>

    <div class="product-layout reveal-up">
        <div class="product-gallery">
            <div class="main-image glass-effect">
                <img src="{{ $product->image }}" alt="{{ $product->name }}" loading="eager">
                <span class="badge moq-detail-badge">MOQ: 6 Pcs Total</span>
            </div>
        </div>

        <div class="product-info-panel">
            <div class="product-header">
                <p class="category highlight-text">{{ $product->category }} • Wholesale Exclusive</p>
                <h1 class="name reveal-blur">{{ $product->name }}</h1>
                <p class="price">₹{{ number_format($product->price) }} <span class="unit">/ unit</span></p>
                <div class="wholesale-pricing-box reveal-scale">
                    <i data-lucide="info"></i>
                    <p>Standard retail price shown. Tiered wholesale discounts will be applied automatically based on total cart volume (Min 6 Pcs).</p>
                </div>
            </div>

            <div class="product-selection">
                <div class="selection-group">
                    <span class="label">Available Sizes in Bulk</span>
                    <div class="size-options">
                        @foreach($product->sizes as $size)
                        <button class="size-option active" disabled>{{ $size }}</button>
                        @endforeach
                    </div>
                    <p class="helper-text">Wholesale orders include a balanced assortment of sizes by default. Contact us for custom size ratios.</p>
                </div>

                <div class="action-buttons mt-4">
                    <div class="wholesale-qty-selector mb-3">
                        <span class="label">Wholesale Quantity:</span>
                        <div class="qty-controls">
                            <button onclick="decrementWholesaleQty()">-</button>
                            <input type="number" id="wqty" value="6" min="6" readonly>
                            <button onclick="incrementWholesaleQty()">+</button>
                        </div>
                    </div>
                    <a href="javascript:void(0)" onclick="addToWholesalePack()" class="add-to-cart-btn btn-primary w-100 reveal-up" style="text-decoration:none; text-align:center; padding: 1.2rem;">
                        <i data-lucide="shopping-bag"></i> Add to Wholesale Pack
                    </a>
                    <p class="moq-reminder">Initial pack starts at 6 pieces.</p>
                </div>

                <div class="delivery-check" style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--color-border); margin-bottom: 1rem;">
                    <span class="label" style="display:block; margin-bottom: 1rem; font-weight: 500;">Check B2B Bulk Delivery Availability</span>
                    <div style="display:flex; gap:0.5rem; margin-bottom: 0.5rem;">
                        <div style="position:relative; flex:1;">
                            <i data-lucide="map-pin" style="position:absolute; left:12px; top:50%; transform:translateY(-50%); width:18px; height:18px; color:var(--color-text-light);"></i>
                            <input type="text" id="pincodeInput" placeholder="Enter 6-digit Pincode" maxlength="6" style="width:100%; border:1px solid var(--color-border); border-radius:6px; padding:12px 12px 12px 40px; font-family:inherit; font-size:0.95rem; background:transparent; color:inherit;">
                        </div>
                        <button onclick="checkPincode()" style="background:var(--color-text); color:var(--color-surface); padding:0 24px; border:none; border-radius:6px; font-weight:600; cursor:pointer; transition: opacity 0.2s;">Verify</button>
                    </div>
                    <div id="pincodeResult" style="font-size: 0.85rem; display:none; align-items:flex-start; gap: 8px; margin-top: 1rem; line-height: 1.4;"></div>
                </div>

                <script>
                    function incrementWholesaleQty() {
                        const input = document.getElementById('wqty');
                        input.value = parseInt(input.value) + 1;
                    }
                    function decrementWholesaleQty() {
                        const input = document.getElementById('wqty');
                        if (parseInt(input.value) > 6) {
                            input.value = parseInt(input.value) - 1;
                        }
                    }
                    function addToWholesalePack() {
                        const qty = document.getElementById('wqty').value;
                        window.location.href = "{{ route('wholesale.cart.add', $product->id) }}?quantity=" + qty;
                    }

                    function checkPincode() {
                        const input = document.getElementById('pincodeInput').value.trim();
                        const result = document.getElementById('pincodeResult');
                        
                        if(!input || input.length !== 6 || isNaN(input)) {
                            result.style.display = 'flex';
                            result.style.color = '#ef4444';
                            result.innerHTML = '<i data-lucide="x-circle" style="width:18px;height:18px; flex-shrink:0;"></i> <span>Please enter a valid 6-digit pincode.</span>';
                            if (typeof lucide !== 'undefined') lucide.createIcons();
                            return;
                        }
                        
                        result.style.display = 'flex';
                        result.style.color = 'var(--color-text-light)';
                        result.innerHTML = '<i data-lucide="loader" class="spin" style="width:18px;height:18px; flex-shrink:0;"></i> <span>Verifying B2B freight routes...</span>';
                        if (typeof lucide !== 'undefined') lucide.createIcons();
                        
                        fetch(`/shipping/check-pincode?pincode=${input}&type=wholesale`)
                            .then(response => response.json())
                            .then(data => {
                                if (data.success) {
                                    result.style.color = '#22c55e'; // Green
                                    result.innerHTML = `<i data-lucide="truck" style="width:18px;height:18px; flex-shrink:0;"></i> <span>${data.message}</span>`;
                                } else {
                                    result.style.color = '#ef4444'; // Red error
                                    result.innerHTML = `<i data-lucide="map-pin-off" style="width:18px;height:18px; flex-shrink:0;"></i> <span>${data.message}</span>`;
                                }
                                if (typeof lucide !== 'undefined') lucide.createIcons();
                            })
                            .catch(error => {
                                console.error('Error fetching freight options:', error);
                                result.style.color = '#ef4444';
                                result.innerHTML = `<i data-lucide="alert-circle" style="width:18px;height:18px; flex-shrink:0;"></i> <span>Unable to verify B2B freight at this time. Please try again.</span>`;
                                if (typeof lucide !== 'undefined') lucide.createIcons();
                            });
                    }
                </script>
            </div>

            <div class="product-details-tabs reveal-up">
                <div class="tabs-header">
                    <button class="active">Wholesale Specs</button>
                    <button>Bulk Logistics</button>
                </div>
                <div class="tab-content">
                    <p><strong>Fabric:</strong> Handcrafted {{ $product->category }} with premium artisanal stitching.</p>
                    <p><strong>Packaging:</strong> Each piece individually packed in eco-friendly Aakrithi branded mailers. Master cartons available for international transit.</p>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .wholesale-detail .glass-effect {
        background: rgba(10, 47, 39, 0.4);
        border: 1px solid var(--color-border);
        border-radius: 20px;
        overflow: hidden;
        position: relative;
    }

    .moq-detail-badge {
        position: absolute;
        top: 2rem;
        right: 2rem;
        background: var(--color-accent) !important;
        color: var(--color-primary) !important;
        padding: 0.75rem 1.5rem !important;
        font-weight: 800 !important;
        border-radius: 40px !important;
        box-shadow: 0 10px 20px rgba(0,0,0,0.3);
    }

    .wholesale-pricing-box {
        display: flex;
        gap: 1rem;
        background: rgba(80, 200, 120, 0.05);
        border: 1px solid rgba(80, 200, 120, 0.2);
        padding: 1.5rem;
        border-radius: 12px;
        margin: 1.5rem 0;
        font-size: 0.9rem;
        color: var(--color-text-light);
        line-height: 1.6;
    }

    .wholesale-pricing-box i {
        color: var(--color-accent);
        flex-shrink: 0;
    }

    .highlight-text {
        color: var(--color-accent);
        text-transform: uppercase;
        letter-spacing: 2px;
        font-weight: 700;
        font-size: 0.8rem;
    }

    .moq-reminder {
        text-align: center;
        font-size: 0.8rem;
        color: var(--color-accent);
        margin-top: 1rem;
        font-weight: 600;
    }

    .helper-text {
        font-size: 0.8rem;
        opacity: 0.6;
        margin-top: 1rem;
    }

    .price .unit {
        font-size: 1rem;
        opacity: 0.5;
        font-weight: 400;
    }
</style>
@endsection

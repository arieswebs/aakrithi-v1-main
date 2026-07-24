@extends('layouts.app')
@section('meta_title', $product->meta_title ?? $product->name . ' | Aakrithi')
@section('meta_description', $product->meta_description ?? \Illuminate\Support\Str::limit($product->description, 160))
@section('meta_keywords', '')
@section('og_image', $product->og_image ?? asset($product->image))
@section('is_noindex', $product->is_noindex ? 'true' : 'false')

@section('structured_data')
<script type="application/ld+json">
{
    "@@context": "https://schema.org/",
    "@@graph": [
        {
            "@@type": "Product",
            "@id": "{{ url()->current() }}#product",
            "name": "{{ $product->name }}",
            "image": [
                "{{ $product->og_image ?? asset($product->image) }}"
            ],
            "description": "{{ $product->meta_description ?? \Illuminate\Support\Str::limit($product->description, 160) }}",
            "sku": "AAK-{{ $product->id }}",
            "brand": {
                "@@type": "Brand",
                "name": "Aakrithi"
            },
            "offers": {
                "@@type": "Offer",
                "url": "{{ url()->current() }}",
                "priceCurrency": "INR",
                "price": "{{ $product->price }}",
                "priceValidUntil": "{{ now()->addYear()->format('Y-m-d') }}",
                "itemCondition": "https://schema.org/NewCondition",
                "availability": "https://schema.org/InStock",
                "hasMerchantReturnPolicy": {
                    "@@type": "MerchantReturnPolicy",
                    "applicableCountry": "IN",
                    "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnPeriod",
                    "merchantReturnDays": 7,
                    "returnMethod": "https://schema.org/ReturnByMail",
                    "returnFees": "https://schema.org/FreeReturn"
                },
                "shippingDetails": {
                    "@@type": "OfferShippingDetails",
                    "shippingRate": {
                        "@@type": "MonetaryAmount",
                        "value": 0,
                        "currency": "INR"
                    },
                    "deliveryTime": {
                        "@@type": "ShippingDeliveryTime",
                        "handlingTime": {
                            "@@type": "QuantitativeValue",
                            "minValue": 1,
                            "maxValue": 2,
                            "unitCode": "DAY"
                        },
                        "transitTime": {
                            "@@type": "ShippingDeliveryTime",
                            "minValue": 3,
                            "maxValue": 5,
                            "unitCode": "DAY"
                        }
                    }
                }
            }
        },
        {
            "@@type": "BreadcrumbList",
            "itemListElement": [{
                "@@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "{{ route('home') }}"
            },{
                "@@type": "ListItem",
                "position": 2,
                "name": "{{ $product->category }}",
                "item": "{{ route('category', strtolower(str_replace(' ', '-', $product->category))) }}"
            },{
                "@@type": "ListItem",
                "position": 3,
                "name": "{{ $product->name }}",
                "item": "{{ url()->current() }}"
            }]
        }
    ]
}
</script>
@endsection

@section('content')
<div class="container product-detail-page fade-in">
    <nav class="breadcrumb">
        <a href="{{ route('home') }}">Home</a> <i data-lucide="chevron-right" style="width:14px;height:14px;"></i>
        <a href="{{ route('category', strtolower(str_replace(' ', '-', $product->category))) }}">{{ $product->category }}</a> <i data-lucide="chevron-right" style="width:14px;height:14px;"></i>
        <span>{{ $product->name }}</span>
    </nav>

    <div class="product-layout">
        <div class="product-gallery">
            <div class="main-image">
                <img src="{{ $product->image }}" alt="{{ $product->name }}" loading="eager">
            </div>
            <div class="thumbnail-grid">
                <div class="thumbnail"><img src="{{ $product->image }}" alt="{{ $product->name }} view 1" loading="lazy"></div>
                <div class="thumbnail"><img src="{{ $product->image }}" alt="{{ $product->name }} view 2" loading="lazy"></div>
                <div class="thumbnail"><img src="{{ $product->image }}" alt="{{ $product->name }} view 3" loading="lazy"></div>
            </div>
        </div>

        <div class="product-info-panel">
            <div class="product-header">
                <p class="category">{{ $product->category }}</p>
                <h1 class="name">{{ $product->name }}</h1>
                <div class="rating">
                    <i data-lucide="star" style="width:16px;height:16px;fill:currentColor;"></i>
                    <i data-lucide="star" style="width:16px;height:16px;fill:currentColor;"></i>
                    <i data-lucide="star" style="width:16px;height:16px;fill:currentColor;"></i>
                    <i data-lucide="star" style="width:16px;height:16px;fill:currentColor;"></i>
                    <i data-lucide="star" style="width:16px;height:16px;"></i>
                    <span>(12 Reviews)</span>
                </div>
                <p class="price">₹{{ number_format($product->price) }}</p>
            </div>

            <div class="product-selection">
                <div class="selection-group">
                    <div class="label-row">
                        <span class="label">Select Size</span>
                        <button class="size-guide">Size Guide</button>
                    </div>
                    <div class="size-options">
                        @foreach($product->sizes as $size)
                        <button class="size-option" onclick="selectSize(this)">{{ $size }}</button>
                        @endforeach
                    </div>
                </div>

                <div class="action-buttons">
                    <a href="{{ route('cart.add', $product->id) }}" class="add-to-cart-btn" style="text-decoration:none; text-align:center;">
                        <i data-lucide="shopping-bag"></i> Add to Bag
                    </a>
                    <a href="{{ route('cart.add', $product->id) }}?redirect=checkout" class="buy-now-btn" style="text-decoration:none; text-align:center;">
                        <i data-lucide="zap"></i> Buy Now
                    </a>
                    <button class="wishlist-btn" onclick="addToWishlist({{ $product->id }})">
                        <i data-lucide="heart"></i>
                    </button>
                </div>
            </div>

            <div class="delivery-check" style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--color-border); margin-bottom: 2rem;">
                <span class="label" style="display:block; margin-bottom: 1rem; font-weight: 500;">Check Delivery Availability</span>
                <div style="display:flex; gap:0.5rem; margin-bottom: 0.5rem;">
                    <div style="position:relative; flex:1;">
                        <i data-lucide="map-pin" style="position:absolute; left:12px; top:50%; transform:translateY(-50%); width:18px; height:18px; color:var(--color-text-light);"></i>
                        <input type="text" id="pincodeInput" placeholder="Enter 6-digit Pincode" maxlength="6" style="width:100%; border:1px solid var(--color-border); border-radius:6px; padding:12px 12px 12px 40px; font-family:inherit; font-size:0.95rem; background:transparent; color:inherit;">
                    </div>
                    <button onclick="checkPincode()" style="background:var(--color-text); color:var(--color-surface); padding:0 24px; border:none; border-radius:6px; font-weight:600; cursor:pointer; transition: opacity 0.2s;">Check</button>
                </div>
                <div id="pincodeResult" style="font-size: 0.85rem; display:none; align-items:flex-start; gap: 8px; margin-top: 1rem; line-height: 1.4;"></div>
            </div>

            <div class="product-details-tabs">
                <div class="tabs-header">
                    <button class="active" onclick="switchTab(this, 'description')">Description</button>
                    <button onclick="switchTab(this, 'details')">Details</button>
                    <button onclick="switchTab(this, 'shipping')">Shipping</button>
                </div>
                <div class="tab-content" id="tab-description">
                    <p>{{ $product->description }}</p>
                </div>
                <div class="tab-content" id="tab-details" style="display:none;">
                    <ul>
                        <li>100% Sustainably sourced fabric</li>
                        <li>Relaxed fit</li>
                        <li>Gentle hand wash recommended</li>
                        <li>Made in India</li>
                    </ul>
                </div>
                <div class="tab-content" id="tab-shipping" style="display:none;">
                    <p>Free standard shipping on all orders over ₹10,000. Estimated delivery: 3-5 business days.</p>
                </div>
            </div>

            <div class="utility-links">
                <button class="utility-link" id="shareProductBtn" onclick="shareProduct()"><i data-lucide="share-2" style="width:16px;height:16px;"></i> Share</button>
                <button class="utility-link"><i data-lucide="info" style="width:16px;height:16px;"></i> Contact Support</button>
            </div>
        </div>
    </div>

    {{-- Related Products Internal Linking --}}
    @php
        $relatedProducts = App\Models\Product::where('category', $product->category)->where('id', '!=', $product->id)->take(4)->get();
    @endphp
    @if($relatedProducts->count() > 0)
    <div class="section-header" style="margin-top: 4rem;">
        <div>
            <h2 style="font-size: 1.5rem; font-weight: 600;">Related Products</h2>
            <p>You might also like these similar styles</p>
        </div>
    </div>
    <div class="products-grid">
        @foreach($relatedProducts as $related)
        <a href="{{ route('product', $related->slug) }}" class="product-card" style="text-decoration:none; color:inherit;">
            <div class="product-image-container">
                <img src="{{ $related->image }}" alt="{{ $related->name }}" class="product-image" loading="lazy">
                <div class="product-overlay">
                    <span class="overlay-btn primary"><i data-lucide="shopping-bag"></i></span>
                    <button class="overlay-btn" onclick="event.preventDefault(); addToWishlist({{ $related->id }});"><i data-lucide="heart"></i></button>
                </div>
            </div>
            <div class="product-info">
                <p class="product-category">{{ $related->category }}</p>
                <h3 class="product-name">{{ $related->name }}</h3>
                <p class="product-price">₹{{ number_format($related->price) }}</p>
            </div>
        </a>
        @endforeach
    </div>
    @endif

    @guest
    <style>
    .auth-modal-overlay {
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.5); z-index: 9999;
        display: none; align-items: center; justify-content: center;
        backdrop-filter: blur(4px);
    }
    .auth-modal-overlay.active { display: flex; }
    .auth-modal-card {
        background: var(--color-surface); padding: 2.5rem; border-radius: 12px;
        width: 90%; max-width: 450px; position: relative;
        box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }
    .auth-modal-close {
        position: absolute; top: 15px; right: 15px; background: none; border: none;
        font-size: 1.5rem; cursor: pointer; color: var(--color-text-light);
    }
    .auth-modal-card .input-group {
        position: relative; margin-bottom: 1rem;
    }
    .auth-modal-card .input-group input {
        width: 100%; border: 1px solid var(--color-border); border-radius: 6px; padding: 12px 12px 12px 40px; font-family: inherit; font-size: 0.95rem;
    }
    .auth-modal-card .input-group i {
        position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--color-text-light); width: 18px; height: 18px;
    }
    </style>

    <div class="auth-modal-overlay" id="buyNowAuthModal">
        <div class="auth-modal-card">
            <button class="auth-modal-close" onclick="closeBuyNowModal()">&times;</button>
            <div class="auth-header" style="text-align:center; margin-bottom:1.5rem;">
                <h2 style="font-size:1.5rem;">Sign Up to Continue</h2>
                <p style="color:var(--color-text-light); font-size:0.875rem; margin-top:0.5rem;">Create an account to complete your purchase.</p>
            </div>
            
            <form class="auth-form" method="POST" action="{{ route('register') }}">
                @csrf
                <input type="hidden" name="redirect_to" value="{{ route('cart.add', $product->id) }}?redirect=checkout">
                
                <div class="input-group">
                    <i data-lucide="user"></i>
                    <input type="text" name="name" placeholder="Full Name" required>
                </div>
                <div class="input-group">
                    <i data-lucide="mail"></i>
                    <input type="email" name="email" placeholder="Email address" required>
                </div>
                <div class="input-group">
                    <i data-lucide="lock"></i>
                    <input type="password" name="password" placeholder="Password" required>
                </div>
                <div class="input-group">
                    <i data-lucide="lock"></i>
                    <input type="password" name="password_confirmation" placeholder="Confirm Password" required>
                </div>
                
                <button type="submit" class="btn-dark" style="width:100%; margin-top:0.5rem; padding:12px; border-radius:30px; font-size:1rem;">Sign Up & Checkout</button>
            </form>
            
            <p style="text-align:center; margin-top:1.5rem; font-size:0.875rem;">
                Already have an account? <a href="{{ route('account') }}?redirect_to={{ urlencode(route('cart.add', $product->id) . '?redirect=checkout') }}" style="font-weight:700; color:var(--color-accent);">Sign In</a>
            </p>
        </div>
    </div>
    
    <script>
    function openBuyNowModal() {
        document.getElementById('buyNowAuthModal').classList.add('active');
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
    function closeBuyNowModal() {
        document.getElementById('buyNowAuthModal').classList.remove('active');
    }
    // Close modal if clicking outside the card
    document.getElementById('buyNowAuthModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeBuyNowModal();
        }
    });
    </script>
    @endguest
</div>
@endsection

@section('scripts')
<script>
function selectSize(btn) {
    document.querySelectorAll('.size-option').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}
// Select first size by default
document.querySelector('.size-option')?.classList.add('active');

function switchTab(btn, tab) {
    document.querySelectorAll('.tabs-header button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
    document.getElementById('tab-' + tab).style.display = 'block';
}

// Re-init lucide icons for this page
if (typeof lucide !== 'undefined') lucide.createIcons();

function checkPincode() {
    const input = document.getElementById('pincodeInput').value.trim();
    const result = document.getElementById('pincodeResult');
    
    if(!input || input.length !== 6 || isNaN(input)) {
        result.style.display = 'flex';
        result.style.color = '#ef4444'; // Red for dark mode compatibility
        result.innerHTML = '<i data-lucide="x-circle" style="width:18px;height:18px; flex-shrink:0;"></i> <span>Please enter a valid 6-digit pincode.</span>';
        if (typeof lucide !== 'undefined') lucide.createIcons();
        return;
    }
    
    // Simulate loading state
    result.style.display = 'flex';
    result.style.color = 'var(--color-text-light)';
    result.innerHTML = '<i data-lucide="loader" class="spin" style="width:18px;height:18px; flex-shrink:0;"></i> <span>Checking precise delivery options...</span>';
    if (typeof lucide !== 'undefined') lucide.createIcons();
    
    // Real API Call
    fetch(`/shipping/check-pincode?pincode=${input}&type=retail`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                result.style.color = '#22c55e'; // Green for success
                result.innerHTML = `<i data-lucide="check-circle" style="width:18px;height:18px; flex-shrink:0;"></i> <span>${data.message}</span>`;
            } else {
                result.style.color = '#ef4444'; // Red error
                result.innerHTML = `<i data-lucide="map-pin-off" style="width:18px;height:18px; flex-shrink:0;"></i> <span>${data.message}</span>`;
            }
            if (typeof lucide !== 'undefined') lucide.createIcons();
        })
        .catch(error => {
            console.error('Error fetching delivery options:', error);
            result.style.color = '#ef4444';
            result.innerHTML = `<i data-lucide="alert-circle" style="width:18px;height:18px; flex-shrink:0;"></i> <span>Unable to verify pincode at this time. Please try again.</span>`;
            if (typeof lucide !== 'undefined') lucide.createIcons();
        });
}

async function shareProduct() {
    const shareData = {
        title: '{{ $product->name }} | Aakrithi',
        text: 'Check out this beautiful {{ $product->name }} from Aakrithi!',
        url: window.location.href
    };

    const btn = document.getElementById('shareProductBtn');
    const originalContent = btn.innerHTML;

    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            await navigator.clipboard.writeText(window.location.href);
            btn.innerHTML = '<i data-lucide="check" style="width:16px;height:16px;"></i> Link Copied!';
            if (typeof lucide !== 'undefined') lucide.createIcons();
            setTimeout(() => {
                btn.innerHTML = originalContent;
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }, 2000);
        }
    } catch (err) {
        console.error('Error sharing:', err);
    }
}
</script>
@endsection

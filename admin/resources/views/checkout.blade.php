@extends('layouts.app')

@section('meta_title', 'Checkout | Aakrithi')
@section('meta_description', 'Complete your order at Aakrithi.')

@section('content')
<div class="checkout-container">
    <div class="checkout-header">
        <h1>Checkout</h1>
        <div class="checkout-steps">
            <span class="step active">Shipping</span>
            <span class="separator"></span>
            <span class="step">Payment</span>
            <span class="separator"></span>
            <span class="step">Confirmation</span>
        </div>
    </div>

    <div class="checkout-layout">
        <div class="checkout-form-section">
            <div class="checkout-card">
                <h2>Shipping Information</h2>
                
                @if(auth()->check() && $addresses->count() > 0)
                <div style="margin-bottom: 1.5rem;">
                    <p style="font-size: 0.9rem; font-weight: 600; margin-bottom: 1rem; color:var(--color-text-light);">Select a Saved Address</p>
                    <div class="address-selector-grid">
                        @foreach($addresses as $addr)
                        <div class="address-card {{ $addr->is_default ? 'active' : '' }}" 
                             onclick="fillAddress(this)"
                             data-name="{{ $addr->name }}"
                             data-email="{{ $addr->email }}"
                             data-phone="{{ $addr->phone }}"
                             data-address="{{ $addr->address }}"
                             data-city="{{ $addr->city }}"
                             data-state="{{ $addr->state }}"
                             data-pincode="{{ $addr->pincode }}">
                            @if($addr->is_default) <span class="badge">Default</span> @endif
                            <h3>{{ $addr->name }}</h3>
                            <p>{{ Str::limit($addr->address, 30) }}</p>
                            <p>{{ $addr->city }}, {{ $addr->pincode }}</p>
                        </div>
                        @endforeach
                    </div>
                </div>
                @endif

                <form id="checkout-form">
                    <div class="form-grid">
                        <div class="form-group full">
                            <label>Full Name</label>
                            <input type="text" id="cust_name" placeholder="Your Name" required>
                        </div>
                        <div class="form-group">
                            <label>Email Address</label>
                            <input type="email" id="cust_email" placeholder="email@example.com" required>
                        </div>
                        <div class="form-group">
                            <label>Phone Number</label>
                            <input type="tel" id="cust_phone" placeholder="+91 XXX XXX XXXX" required>
                        </div>
                        <div class="form-group full">
                            <label>Address Line 1</label>
                            <input type="text" id="addr1" placeholder="House No, Building Name, Street" required>
                        </div>
                        <div class="form-group full">
                            <label>Address Line 2 (Optional)</label>
                            <input type="text" id="addr2" placeholder="Locality, Landmark">
                        </div>
                        <div class="form-group">
                            <label>City</label>
                            <input type="text" id="city" placeholder="City" required>
                        </div>
                        <div class="form-group">
                            <label>State</label>
                            <select id="state" required>
                                <option value="" disabled selected>Select State</option>
                                <option value="Andhra Pradesh">Andhra Pradesh</option>
                                <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                                <option value="Assam">Assam</option>
                                <option value="Bihar">Bihar</option>
                                <option value="Chhattisgarh">Chhattisgarh</option>
                                <option value="Goa">Goa</option>
                                <option value="Gujarat">Gujarat</option>
                                <option value="Haryana">Haryana</option>
                                <option value="Himachal Pradesh">Himachal Pradesh</option>
                                <option value="Jharkhand">Jharkhand</option>
                                <option value="Karnataka">Karnataka</option>
                                <option value="Kerala">Kerala</option>
                                <option value="Madhya Pradesh">Madhya Pradesh</option>
                                <option value="Maharashtra">Maharashtra</option>
                                <option value="Manipur">Manipur</option>
                                <option value="Meghalaya">Meghalaya</option>
                                <option value="Mizoram">Mizoram</option>
                                <option value="Nagaland">Nagaland</option>
                                <option value="Odisha">Odisha</option>
                                <option value="Punjab">Punjab</option>
                                <option value="Rajasthan">Rajasthan</option>
                                <option value="Sikkim">Sikkim</option>
                                <option value="Tamil Nadu">Tamil Nadu</option>
                                <option value="Telangana">Telangana</option>
                                <option value="Tripura">Tripura</option>
                                <option value="Uttar Pradesh">Uttar Pradesh</option>
                                <option value="Uttarakhand">Uttarakhand</option>
                                <option value="West Bengal">West Bengal</option>
                                <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                                <option value="Chandigarh">Chandigarh</option>
                                <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
                                <option value="Delhi">Delhi</option>
                                <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                                <option value="Ladakh">Ladakh</option>
                                <option value="Lakshadweep">Lakshadweep</option>
                                <option value="Puducherry">Puducherry</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Pincode</label>
                            <input type="text" id="zip" placeholder="682001" required>
                        </div>
                        <div class="form-group">
                            <label>Country</label>
                            <select required>
                                <option value="IN">India</option>
                            </select>
                        </div>
                    </div>
                    @if(auth()->check())
                    <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px dashed var(--color-border); display: flex; align-items: center; gap: 0.75rem;">
                        <input type="checkbox" id="save_address" style="width: 18px; height: 18px; cursor: pointer; accent-color: var(--color-accent);">
                        <label for="save_address" style="font-size: 0.9rem; color: var(--color-text); cursor: pointer; font-weight: 500;">Save this address for future use</label>
                    </div>
                    @endif
                </form>
            </div>

            <div class="checkout-card">
                <h2>Payment Method</h2>
                <div class="payment-options">
                    <label class="payment-option">
                        <input type="radio" name="payment" value="razorpay" checked style="display:none;">
                        <div class="payment-content" style="width:100%;">
                            <span style="font-weight:600; display:block; margin-bottom:0.25rem;">Secure Online Payment</span>
                            <span style="font-size:0.8rem; color:var(--color-text-light);">UPI, All Cards, Net Banking, and Wallets are supported via Razorpay.</span>
                        </div>
                    </label>
                </div>
            </div>
        </div>

        <div class="order-summary-section">
            <div class="checkout-card summary-card">
                <h2>Order Summary</h2>
                <div class="summary-items">
                    @foreach($cart as $id => $details)
                    <div class="summary-item">
                        <div class="item-info">
                            <span class="item-name">{{ $details['name'] }}</span>
                            <span class="item-meta">Qty: {{ $details['quantity'] }}</span>
                        </div>
                        <span class="item-price">₹{{ number_format($details['price'] * $details['quantity']) }}</span>
                    </div>
                    @endforeach
                </div>

                <div class="summary-totals">
                    <div class="total-row">
                        <span>Subtotal</span>
                        <span>₹{{ number_format($total) }}</span>
                    </div>
                    <div class="total-row">
                        <span>Shipping</span>
                        <span class="free">FREE</span>
                    </div>
                    <div class="total-row grand-total">
                        <span>Total Payable</span>
                        <span>₹{{ number_format($total) }}</span>
                    </div>
                </div>

                <button type="button" id="placeOrderBtn" class="place-order-btn">
                    Place Order
                </button>
                
                <p class="secure-checkout">
                    <i data-lucide="shield-check"></i> 100% Secure Checkout — Powered by Razorpay
                </p>
            </div>
        </div>
    </div>
</div>
@endsection

@section('scripts')
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
<script>
// Address Auto-fill Logic
function fillAddress(card) {
    // UI Update
    document.querySelectorAll('.address-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');

    // Fill Form
    document.getElementById('cust_name').value = card.dataset.name;
    document.getElementById('cust_email').value = card.dataset.email;
    document.getElementById('cust_phone').value = card.dataset.phone;
    document.getElementById('addr1').value = card.dataset.address;
    document.getElementById('city').value = card.dataset.city;
    document.getElementById('state').value = card.dataset.state;
    document.getElementById('zip').value = card.dataset.pincode;
}

// Auto-fill default address on load
document.addEventListener('DOMContentLoaded', () => {
    const defaultCard = document.querySelector('.address-card.active');
    if (defaultCard) {
        fillAddress(defaultCard);
    }
});

document.getElementById('placeOrderBtn').addEventListener('click', function() {
    // Validate the form first
    const form = document.getElementById('checkout-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    const orderData = {
        _token: '{{ csrf_token() }}',
        customer_name: document.getElementById('cust_name').value,
        customer_email: document.getElementById('cust_email').value,
        customer_phone: document.getElementById('cust_phone').value,
        address_line_1: document.getElementById('addr1').value,
        address_line_2: document.getElementById('addr2').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        pincode: document.getElementById('zip').value,
        save_address: document.getElementById('save_address')?.checked || false,
        payment_method: paymentMethod
    };

    function submitOrder(data) {
        document.getElementById('placeOrderBtn').disabled = true;
        document.getElementById('placeOrderBtn').innerHTML = '<i data-lucide="loader" class="spin"></i> Processing...';
        
        fetch('{{ route("order.store") }}', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': '{{ csrf_token() }}',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(res => {
            if(res.success) {
                showSuccessAndRedirect(res.order_number);
            } else {
                alert('Error placing order: ' + (res.error || 'Unknown error'));
                document.getElementById('placeOrderBtn').disabled = false;
                document.getElementById('placeOrderBtn').innerHTML = '<i data-lucide="lock"></i> Place Order';
            }
        })
        .catch(err => {
            console.error(err);
            alert('Something went wrong. Please try again.');
            document.getElementById('placeOrderBtn').disabled = false;
            document.getElementById('placeOrderBtn').innerHTML = '<i data-lucide="lock"></i> Place Order';
        });
    }

    function showSuccessAndRedirect(orderNumber) {
        // Fire Confetti!
        var duration = 3 * 1000;
        var end = Date.now() + duration;
        (function frame() {
            confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#C5A059', '#16a34a', '#ffffff'] });
            confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#C5A059', '#16a34a', '#ffffff'] });
            if (Date.now() < end) { requestAnimationFrame(frame); }
        }());

        // Create full screen overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(17, 24, 39, 0.7); backdrop-filter: blur(8px); z-index: 9999;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            opacity: 0; transition: opacity 0.5s ease;
        `;
        
        overlay.innerHTML = `
            <div class="success-card">
                <div class="success-icon-wrapper">
                    <svg class="success-icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h2>Payment Successful!</h2>
                <p class="order-text">Your order <strong>${orderNumber}</strong> has been confirmed securely.</p>
                <div class="loading-bar-container">
                    <div class="loading-bar"></div>
                </div>
                <p class="redirect-text">Redirecting to order details in <span id="countdown">5</span>s...</p>
            </div>
            <style>
                @keyframes cardFadeIn { from { opacity: 0; transform: translateY(30px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }
                @keyframes loadingBar { 0% { width: 0%; } 100% { width: 100%; } }
                
                .success-card {
                    background: var(--color-surface); border-radius: var(--border-radius); padding: 3rem 2.5rem; width: 90%; max-width: 420px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05); text-align: center; display: flex; flex-direction: column; align-items: center;
                    animation: cardFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; position: relative; overflow: hidden;
                    border: 1px solid var(--color-border); font-family: var(--font-family);
                }
                .success-card::before {
                    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px;
                    background: linear-gradient(90deg, var(--color-accent), #e2c88f, var(--color-accent));
                    background-size: 200% 200%; animation: shimmer 3s infinite linear;
                }
                @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
                
                .success-icon-wrapper {
                    width: 70px; height: 70px; border-radius: 50%; background: var(--color-secondary); color: var(--color-accent);
                    display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem;
                }
                .success-card h2 { font-family: var(--font-family); font-size: 1.8rem; color: var(--color-text); margin-bottom: 0.75rem; letter-spacing: -0.5px; }
                .success-card .order-text { font-size: 1rem; color: var(--color-text-light); margin-bottom: 2rem; line-height: 1.5; }
                .success-card strong { color: var(--color-accent); font-weight: 700; letter-spacing: 0.5px; font-size: 1.1rem; }
                
                .loading-bar-container { width: 100%; height: 3px; background: var(--color-secondary); border-radius: 4px; overflow: hidden; margin-bottom: 1rem; }
                .loading-bar { height: 100%; background: var(--color-accent); animation: loadingBar 5s linear forwards; }
                .redirect-text { font-size: 0.85rem; color: var(--color-text-light); font-weight: 500; font-family: var(--font-family);}
                
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
                .address-selector-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
                .address-card { 
                    border: 1.5px solid var(--color-border); border-radius: 10px; padding: 1rem; cursor: pointer; transition: all 0.2s ease;
                    position: relative; background: #fff;
                }
                .address-card:hover { border-color: var(--color-accent); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
                .address-card.active { border-color: var(--color-accent); background: rgba(197, 160, 89, 0.05); border-width: 2px; }
                .address-card h3 { font-size: 0.95rem; font-weight: 600; margin-bottom: 0.25rem; }
                .address-card p { font-size: 0.8rem; color: var(--color-text-light); line-height: 1.4; margin: 0; }
                .address-card .badge { 
                    position: absolute; top: 8px; right: 8px; background: var(--color-accent); color: #fff; 
                    font-size: 0.6rem; padding: 2px 6px; border-radius: 4px; font-weight: 600; text-transform: uppercase;
                }
            </style>
        `;
        
        document.body.appendChild(overlay);
        
        // Trigger fade in
        setTimeout(() => overlay.style.opacity = '1', 50);
        
        // Countdown & Redirect
        let count = 5;
        const interval = setInterval(() => {
            count--;
            const countSpan = document.getElementById('countdown');
            if (countSpan) countSpan.innerText = count;
            if (count <= 0) {
                clearInterval(interval);
                window.location.href = "{{ url('/order') }}/" + orderNumber;
            }
        }, 1000);
    }
    
    // Razorpay Checkout is now the only method
    const options = {
        key: "{{ $razorpayKey }}",
        amount: {{ $total * 100 }}, // Amount in paise
        currency: "INR",
        name: "Aakrithi",
        description: "Order Payment",
        @if(isset($razorpayOrderId))
        order_id: "{{ $razorpayOrderId }}", // Server-side validated order id
        @endif
        handler: function(response) {
            orderData.payment_id = response.razorpay_payment_id;
            orderData.razorpay_signature = response.razorpay_signature; // Pass signature back
            submitOrder(orderData);
        },
        prefill: {
            name: orderData.customer_name,
            email: orderData.customer_email,
            contact: orderData.customer_phone
        },
        theme: {
            color: "#C5A059"
        },
        modal: {
            ondismiss: function() {
                // User closed the popup
            }
        }
    };

    const rzp = new Razorpay(options);
    rzp.on('payment.failed', function(response) {
        alert('Payment failed. Please try again.\n\nReason: ' + response.error.description);
    });
    rzp.open();
});
</script>
@endsection

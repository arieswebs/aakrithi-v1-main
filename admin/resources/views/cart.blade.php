@extends('layouts.app')
@section('title', 'Cart - Aakrithi')

@section('styles')
<style>
    .quantity-selector-premium {
        display: flex;
        align-items: stretch;
        border: 1.5px solid var(--premium-accent, #C5A059);
        border-radius: 6px;
        overflow: hidden;
        background: #fff;
        max-width: 120px;
        height: 40px;
    }
    .qty-btn-premium {
        background: none;
        border: none;
        width: 40px;
        height: 100%;
        color: var(--premium-accent, #C5A059);
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
    }
    .qty-btn-premium:hover { background: rgba(197, 160, 89, 0.1); }
    .qty-btn-premium i { width: 14px; height: 14px; stroke-width: 3px; }
    
    .qty-input-premium {
        width: 40px;
        border-left: 1px solid rgba(197, 160, 89, 0.2);
        border-right: 1px solid rgba(197, 160, 89, 0.2);
        border-top: none;
        border-bottom: none;
        text-align: center;
        font-weight: 700;
        font-size: 1rem;
        background: transparent;
        color: #1a1a1a;
        padding: 0;
        margin: 0;
        height: 100%;
        outline: none;
    }
    .qty-input-premium::-webkit-outer-spin-button,
    .qty-input-premium::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }

    .cart-item-remove { 
        background: none; 
        border: 1px solid rgba(220, 53, 69, 0.2); 
        color: #dc3545; 
        font-size: 0.75rem; 
        cursor: pointer; 
        display: flex; 
        align-items: center; 
        gap: 6px; 
        padding: 4px 12px;
        border-radius: 20px;
        transition: all 0.2s;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: 600;
    }
    .cart-item-remove:hover { background: #dc3545; color: #fff; }
</style>
@endsection

@section('content')
<div class="container cart-page" id="cartPage" style="padding-top: 2rem; padding-bottom: 5rem;">
    <h1 class="cart-title">Your Cart</h1>
    <div class="cart-layout" id="cartContent">
        <div class="cart-items" id="cartItems">
            @if(session('cart'))
                @foreach(session('cart') as $id => $details)
                    <div class="cart-item" data-id="{{ $id }}">
                        <div class="item-image">
                            <img src="{{ $details['image'] }}" alt="{{ $details['name'] }}">
                        </div>
                        <div class="item-details">
                            <div class="item-header">
                                <div>
                                    <p class="product-category" style="font-size: 12px; color: var(--color-text-light); margin-bottom: 4px;">{{ $details['category'] }}</p>
                                    <h3>{{ $details['name'] }}</h3>
                                </div>
                                <p class="item-price">₹{{ number_format($details['price']) }}</p>
                            </div>
                            <div class="item-controls" style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
                                <div class="quantity-selector-premium">
                                    <button class="qty-btn-premium minus" type="button"><i data-lucide="minus"></i></button>
                                    <input type="number" value="{{ $details['quantity'] }}" class="qty-input-premium update-cart" readonly>
                                    <button class="qty-btn-premium plus" type="button"><i data-lucide="plus"></i></button>
                                </div>
                                <button class="cart-item-remove remove-from-cart"><i data-lucide="trash-2" style="width: 16px; height: 16px;"></i> Remove</button>
                            </div>
                        </div>
                    </div>
                @endforeach
            @else
                <div class="empty-cart-message">
                    <i data-lucide="shopping-bag" style="width: 48px; height: 48px; opacity: 0.2;"></i>
                    <p>Your cart is empty.</p>
                    <a href="{{ route('shop') }}" class="btn-primary" style="display: inline-block; margin-top: 1.5rem;">Start Shopping</a>
                </div>
            @endif
        </div>
        
        @if(session('cart'))
        <div class="cart-summary">
            <h2>Order Summary</h2>
            <div class="summary-row"><span>Subtotal</span><span>₹{{ number_format($total) }}</span></div>
            <div class="summary-row"><span>Shipping</span><span>Free</span></div>
            <div class="summary-divider"></div>
            <div class="summary-row total"><span>Total</span><span>₹{{ number_format($total) }}</span></div>
            <a href="{{ route('checkout') }}" class="btn-dark" style="margin-top:2rem; width: 100%; text-align: center; display: block;">Proceed to Checkout</a>
            <p style="font-size:10px; text-align:center; color:var(--color-text-light); text-transform:uppercase; letter-spacing:1px; margin-top:1rem;">Secure checkout • Free returns</p>
        </div>
        @endif
    </div>
</div>
@endsection

@section('scripts')
<script type="text/javascript">
  
    function updateCart(id, qty) {
        fetch('{{ route('cart.update') }}', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': '{{ csrf_token() }}'
            },
            body: JSON.stringify({ id: id, quantity: qty })
        }).then(response => {
            window.location.reload();
        });
    }

    document.querySelectorAll(".qty-btn-premium").forEach(btn => {
        btn.addEventListener("click", function() {
            const container = this.closest(".quantity-selector-premium");
            const input = container.querySelector(".qty-input-premium");
            const itemId = this.closest(".cart-item").getAttribute("data-id");
            let currentVal = parseInt(input.value);
            
            if (this.classList.contains("plus")) {
                currentVal++;
            } else if (this.classList.contains("minus") && currentVal > 1) {
                currentVal--;
            }
            
            input.value = currentVal;
            updateCart(itemId, currentVal);
        });
    });
  
    document.querySelectorAll(".remove-from-cart").forEach(button => {
        button.addEventListener("click", function (e) {
            e.preventDefault();
            var ele = this;
            if(confirm("Are you sure you want to remove?")) {
                fetch('{{ route('cart.remove') }}', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': '{{ csrf_token() }}'
                    },
                    body: JSON.stringify({
                        id: ele.closest(".cart-item").getAttribute("data-id")
                    })
                }).then(response => {
                    window.location.reload();
                });
            }
        });
    });
  
</script>
@endsection


@extends('layouts.app')
@section('meta_title', 'Track Your Order | Aakrithi')
@section('meta_description', 'Track the status of your Aakrithi order.')

@section('content')
<div class="container" style="max-width:600px; margin:4rem auto; padding:0 1.5rem; font-family:var(--font-family);">
    
    <div style="background:var(--color-surface); border:1px solid var(--color-border); border-top:5px solid var(--color-accent); border-radius:var(--border-radius); padding:3rem 2.5rem; box-shadow:0 10px 30px rgba(0,0,0,0.03);">
        <div style="text-align:center; margin-bottom:2rem;">
            <div style="width:64px; height:64px; background:var(--color-secondary); color:var(--color-accent); border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 1.5rem;">
                <i data-lucide="package-search" style="width:32px; height:32px;"></i>
            </div>
            <h1 style="font-size:2rem; font-weight:600; color:var(--color-text); margin-bottom:0.5rem; font-family:var(--font-family);">Track Your Order</h1>
            <p style="color:var(--color-text-light); text-align:center; font-size:1rem; line-height:1.5;">Enter your Order Number and phone number to see your order status.</p>
        </div>

        @if(session('error'))
        <div style="background:#fee2e2; border:1px solid #fca5a5; color:#b91c1c; padding:1rem; border-radius:8px; margin-bottom:1.5rem; font-size:0.95rem; display:flex; align-items:center; gap:0.5rem;">
            <i data-lucide="alert-circle" style="width:20px; height:20px;"></i>
            {{ session('error') }}
        </div>
        @endif

        <form action="{{ route('track.order.post') }}" method="POST">
            @csrf
            <div style="margin-bottom:1.5rem;">
                <label style="display:block; margin-bottom:0.5rem; font-size:0.85rem; font-weight:600; color:var(--color-text); letter-spacing:0.5px;">ORDER NUMBER</label>
                <input type="text" name="order_number" placeholder="AAK-XXXXXXXX" required
                    style="width:100%; padding:14px 16px; border:1px solid var(--color-border); border-radius:8px; font-size:1rem; outline:none; font-family:var(--font-family); transition: border-color 0.2s;"
                    onfocus="this.style.borderColor='var(--color-accent)'" onblur="this.style.borderColor='var(--color-border)'">
            </div>

            <div style="margin-bottom:2rem;">
                <label style="display:block; margin-bottom:0.5rem; font-size:0.85rem; font-weight:600; color:var(--color-text); letter-spacing:0.5px;">PHONE NUMBER</label>
                <input type="tel" name="phone" placeholder="Phone used during checkout" required
                    style="width:100%; padding:14px 16px; border:1px solid var(--color-border); border-radius:8px; font-size:1rem; outline:none; font-family:var(--font-family); transition: border-color 0.2s;"
                    onfocus="this.style.borderColor='var(--color-accent)'" onblur="this.style.borderColor='var(--color-border)'">
            </div>

            <button type="submit" style="width:100%; padding:16px; background:var(--color-accent); color:white; border:none; border-radius:8px; font-size:1.05rem; font-weight:600; letter-spacing:1px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:0.5rem; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
                <i data-lucide="search" style="width:20px; height:20px;"></i>
                TRACK ORDER
            </button>
        </form>
    </div>
</div>
@endsection

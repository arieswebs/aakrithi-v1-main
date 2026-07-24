@extends('layouts.app')
@section('title', 'My Wishlist | Aakrithi')

@section('styles')
<style>
    .wishlist-page { padding-top: 4rem; padding-bottom: 7rem; min-height: 80vh; background: linear-gradient(180deg, #fff 0%, #faf9f6 100%); }
    .wishlist-header { text-align: center; margin-bottom: 5rem; position: relative; }
    .wishlist-header h1 { font-size: 4rem; font-weight: 900; color: #1a1a1a; letter-spacing: -3px; margin-bottom: 1rem; text-transform: uppercase; }
    .wishlist-header p { font-size: 1.1rem; color: #888; letter-spacing: 2px; text-transform: uppercase; font-weight: 500; }
    .wishlist-header::after { content: ''; position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); width: 40px; height: 3px; background: var(--premium-accent, #C5A059); }
    
    .wishlist-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1.5rem; }
    
    .wishlist-item { 
        background: rgba(255, 255, 255, 0.8); 
        backdrop-filter: blur(15px);
        border-radius: 20px; 
        overflow: hidden; 
        border: 1px solid rgba(197, 160, 89, 0.1); 
        transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); 
        display: flex; 
        flex-direction: column;
        box-shadow: 0 10px 40px rgba(0,0,0,0.03);
        position: relative;
        opacity: 0;
        transform: translateY(20px);
        animation: cardAppear 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    
    @keyframes cardAppear {
        to { opacity: 1; transform: translateY(0); }
    }
    
    .wishlist-item:hover { 
        transform: translateY(-15px); 
        border-color: var(--premium-accent, #C5A059); 
        box-shadow: 0 30px 60px rgba(197, 160, 89, 0.15); 
    }
    
    .wishlist-img-wrapper { position: relative; padding-top: 110%; overflow: hidden; border-radius: 20px 20px 0 0; }
    .wishlist-img-wrapper img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1); }
    .wishlist-item:hover .wishlist-img-wrapper img { transform: scale(1.1) rotate(1deg); }
    
    .wishlist-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.05) 100%);
        pointer-events: none;
    }

    .wishlist-toggle {
        position: absolute;
        top: 15px;
        right: 15px;
        z-index: 10;
        background: rgba(255, 255, 255, 1);
        backdrop-filter: blur(8px);
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        color: #ff4d4d;
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        opacity: 0;
        transform: scale(0.6);
    }
    .wishlist-item:hover .wishlist-toggle { opacity: 1; transform: scale(1); }
    .wishlist-toggle:hover { transform: scale(1.1) !important; color: #ff0000; }
    .wishlist-toggle.unselecting { color: #ccc; }
    .wishlist-toggle svg { fill: currentColor; }

    .wishlist-details { padding: 1.5rem; flex-grow: 1; display: flex; flex-direction: column; background: #fff; }
    .wishlist-category { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 2px; color: #999; margin-bottom: 0.5rem; font-weight: 600; }
    .wishlist-name { font-size: 0.9rem; font-weight: 800; margin-bottom: 0.5rem; color: #1a1a1a; line-height: 1.2; }
    .wishlist-price { font-size: 1rem; font-weight: 900; color: var(--premium-accent, #C5A059); margin-bottom: 1.5rem; }
    
    .add-to-cart-from-wishlist { 
        background: #1a1a1a; 
        color: #fff; 
        border: none; 
        padding: 12px; 
        border-radius: 50px; 
        font-weight: 700; 
        cursor: pointer; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        gap: 10px; 
        transition: all 0.3s; 
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    .add-to-cart-from-wishlist:hover { background: var(--premium-accent, #C5A059); transform: translateY(-2px); box-shadow: 0 10px 20px rgba(197, 160, 89, 0.2); }
    
    .empty-wishlist { 
        text-align: center; 
        padding: 8rem 2rem; 
        background: #fff; 
        border-radius: 40px; 
        border: 1px solid rgba(197, 160, 89, 0.1);
        box-shadow: 0 40px 100px rgba(0,0,0,0.03);
    }
    .empty-icon-wrapper {
        width: 120px;
        height: 120px;
        background: #fafaf8;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 2rem;
    }
    .empty-wishlist i { font-size: 3rem; color: var(--premium-accent); }
    .empty-wishlist h2 { font-size: 2.5rem; font-weight: 900; margin-bottom: 1rem; color: #1a1a1a; }
    .empty-wishlist p { font-size: 1.1rem; color: #888; margin-bottom: 3rem; max-width: 400px; margin-left: auto; margin-right: auto; }

    @media (max-width: 768px) {
        .wishlist-header h1 { font-size: 2.5rem; }
        .wishlist-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
        .wishlist-details { padding: 1.25rem; }
        .wishlist-name { font-size: 0.85rem; }
        .wishlist-price { font-size: 0.95rem; }
        .remove-badge { opacity: 1; transform: scale(1); width: 30px; height: 30px; }
    }
    @media (max-width: 400px) {
        .wishlist-grid { grid-template-columns: repeat(2, 1fr); }
    }
</style>
@endsection

@section('content')
<div class="container wishlist-page">
    <div class="wishlist-header">
        <h1>Your Wishlist</h1>
        <p>Your curated selection of timeless pieces.</p>
    </div>

    @if(count($wishlist) > 0)
        <div class="wishlist-grid">
            @php $delay = 0; @endphp
            @foreach($wishlist as $id => $details)
                <div class="wishlist-item" style="animation-delay: {{ $delay }}s">
                    @php $delay += 0.1; @endphp
                    <div class="wishlist-img-wrapper">
                        <img src="{{ $details['image'] }}" alt="{{ $details['name'] }}">
                        <div class="wishlist-overlay"></div>
                        <button class="wishlist-toggle" onclick="removeFromWishlist(this, {{ $id }})" title="Remove from wishlist">
                            <i data-lucide="heart"></i>
                        </button>
                    </div>
                    <div class="wishlist-details">
                        <span class="wishlist-category">{{ $details['category'] }}</span>
                        <h3 class="wishlist-name">{{ $details['name'] }}</h3>
                        <p class="wishlist-price">₹{{ number_format($details['price']) }}</p>
                        
                        <div class="wishlist-actions">
                            <a href="{{ route('cart.add', $id) }}" class="add-to-cart-from-wishlist">
                                <i data-lucide="shopping-bag"></i> Add to Cart
                            </a>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
    @else
        <div class="empty-wishlist">
            <div class="empty-icon-wrapper">
                <i data-lucide="heart"></i>
            </div>
            <h2>Empty Treasures</h2>
            <p>Your wishlist is currently a blank canvas. Start curating your personal collection of timeless pieces.</p>
            <a href="{{ route('shop') }}" class="btn-primary">Explore Collections</a>
        </div>
    @endif
</div>
@endsection

@section('scripts')
<script>
function removeFromWishlist(btn, id) {
    btn.classList.add('unselecting');
    btn.querySelector('svg').style.fill = 'none';
    
    // Immediate UI feedback
    const item = btn.closest('.wishlist-item');
    item.style.opacity = '0.5';
    item.style.pointerEvents = 'none';

    fetch('{{ route('wishlist.remove') }}', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify({ id: id })
    }).then(response => response.json())
      .then(data => {
        item.style.transform = 'scale(0.8)';
        item.style.opacity = '0';
        setTimeout(() => {
            window.location.reload();
        }, 300);
    });
}
</script>
@endsection

@extends('layouts.app')
@section('title', ($title ?? 'Shop') . ' - Aakrithi')
@section('meta_title', $title ?? 'Shop Our Collection | Aakrithi Premium Boutique')
@section('meta_description', $meta_description ?? 'Browse our exclusive range of Designer Kurthies, Kerala Sets, and Embroidered Sarees. Quality artisanal wear for every occasion.')
@section('meta_keywords', $meta_keywords ?? 'Aakrithi shop, designer apparel, ethnic wear online, boutique sarees')

@section('structured_data')
<script type="application/ld+json">
{
    "@@context": "https://schema.org",
    "@@type": "BreadcrumbList",
    "itemListElement": [{
        "@@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "{{ route('home') }}"
    }, {
        "@@type": "ListItem",
        "position": 2,
        "name": "{{ $title ?? 'Shop' }}",
        "item": "{{ url()->current() }}"
    }]
}
</script>
@endsection

@section('content')
<div class="container shop-page">
    <div class="shop-header">
        <h1>{{ $title ?? 'All Shop' }}</h1>
        <p class="product-count">{{ count($products) }} Products</p>
    </div>

    <div class="shop-toolbar">
        <button class="filter-toggle"><i data-lucide="sliders-horizontal"></i> Filters</button>
        <div class="shop-controls">
            <div class="sort-control">
                <span>Sort by:</span>
                <select id="price-sort" onchange="sortProducts(this.value)">
                    <option value="latest" {{ request('sort') == 'latest' ? 'selected' : '' }}>Featured</option>
                    <option value="price-low" {{ request('sort') == 'price-low' ? 'selected' : '' }}>Price: Low to High</option>
                    <option value="price-high" {{ request('sort') == 'price-high' ? 'selected' : '' }}>Price: High to Low</option>
                    <option value="newest" {{ request('sort') == 'newest' ? 'selected' : '' }}>Newest</option>
                </select>
            </div>
        </div>
    </div>

    <div class="products-grid">
        @foreach($products as $product)
        <a href="{{ route('product', $product->slug) }}" class="product-card" style="text-decoration:none; color:inherit;">
            <div class="product-image-container">
                @if($product->badge)
                <span class="badge">{{ $product->badge }}</span>
                @endif
                <img src="{{ $product->image }}" alt="{{ $product->name }}" class="product-image" loading="lazy">
                <div class="product-overlay">
                    <span class="overlay-btn primary">
                        <i data-lucide="shopping-bag"></i>
                    </span>
                    <button class="overlay-btn" onclick="event.preventDefault(); addToWishlist({{ $product->id }});"><i data-lucide="heart"></i></button>
                </div>
            </div>
            <div class="product-info">
                <p class="product-category">{{ $product->category }}</p>
                <h3 class="product-name">{{ $product->name }}</h3>
                <p class="product-price">₹{{ number_format($product->price) }}</p>
            </div>
        </a>
        @endforeach
    </div>
</div>
@endsection

@section('scripts')
<script>
function sortProducts(value) {
    const url = new URL(window.location.href);
    url.searchParams.set('sort', value);
    window.location.href = url.toString();
}
</script>
@endsection

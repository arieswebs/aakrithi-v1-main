@extends('layouts.admin')

@section('admin_title', 'Edit Product')

@section('admin_content')
<div class="admin-table-container" style="max-width: 800px; margin: 0 auto; padding: 2.5rem;">
    <form action="{{ route('admin.products.update', $product->id) }}" method="POST" enctype="multipart/form-data">
        @csrf
        @method('PUT')
        <div class="stats-grid" style="grid-template-columns: 1fr 1fr; margin-bottom: 2rem;">
            <div class="form-group">
                <label style="display: block; margin-bottom: 0.5rem; opacity: 0.7;">Product Name</label>
                <input type="text" name="name" value="{{ $product->name }}" required style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(197, 160, 89, 0.2); border-radius: 8px; color: #FEFEE3;">
            </div>
            <div class="form-group">
                <label style="display: block; margin-bottom: 0.5rem; opacity: 0.7;">Category</label>
                <select name="category" required style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(197, 160, 89, 0.2); border-radius: 8px; color: #FEFEE3;">
                    @foreach($categories as $cat)
                    <option value="{{ $cat->slug }}" {{ $product->category == $cat->slug ? 'selected' : '' }}>{{ $cat->name }}</option>
                    @endforeach
                </select>
            </div>
        </div>

        <div class="stats-grid" style="grid-template-columns: 1fr 1fr; margin-bottom: 2rem;">
            <div class="form-group">
                <label style="display: block; margin-bottom: 0.5rem; opacity: 0.7;">Price (₹)</label>
                <input type="number" name="price" value="{{ $product->price }}" required style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(197, 160, 89, 0.2); border-radius: 8px; color: #FEFEE3;">
            </div>
            <div class="form-group">
                <label style="display: block; margin-bottom: 0.5rem; opacity: 0.7;">Product Type</label>
                <div style="display: flex; align-items: center; gap: 1rem; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(197, 160, 89, 0.2); border-radius: 8px;">
                    <input type="checkbox" name="is_wholesale" value="1" id="is_wholesale" {{ $product->is_wholesale ? 'checked' : '' }} style="width: 18px; height: 18px; cursor: pointer;">
                    <label for="is_wholesale" style="cursor: pointer; color: #C5A059; font-weight: 600;">Is Wholesale Product</label>
                </div>
            </div>
        </div>

        <div class="stats-grid" style="grid-template-columns: 1fr; margin-bottom: 2rem;">
            <div class="form-group">
                <label style="display: block; margin-bottom: 0.5rem; opacity: 0.7;">Main Image (Keep empty to stay same)</label>
                <input type="file" name="image" accept="image/*" style="width: 100%; padding: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(197, 160, 89, 0.2); border-radius: 8px; color: #FEFEE3;">
            </div>
        </div>

        <div class="form-group" style="margin-bottom: 2rem;">
            <label style="display: block; margin-bottom: 1rem; opacity: 0.7;">Inventory & Sizes (Update stock for each size)</label>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem; background: rgba(255,255,255,0.02); padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(197, 160, 89, 0.1);">
                @php
                    $currentSizes = is_array($product->sizes) ? $product->sizes : [];
                @endphp
                @foreach(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'] as $size)
                <div style="display: flex; flex-direction: column; gap: 0.5rem; padding: 0.75rem; background: rgba(255,255,255,0.03); border-radius: 8px;">
                    <label style="color: #C5A059; font-weight: 600; font-size: 0.85rem;">{{ $size }}</label>
                    <input type="number" name="sizes[{{ $size }}]" value="{{ $currentSizes[$size] ?? '' }}" placeholder="Stock" min="0" style="width: 100%; padding: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(197, 160, 89, 0.2); border-radius: 6px; color: #FEFEE3; font-size: 0.9rem;">
                </div>
                @endforeach
            </div>
        </div>

        <div class="form-group" style="margin-bottom: 2rem;">
            <label style="display: block; margin-bottom: 0.5rem; opacity: 0.7;">Product Gallery (Add more images)</label>
            <input type="file" name="gallery[]" accept="image/*" multiple style="width: 100%; padding: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(197, 160, 89, 0.2); border-radius: 8px; color: #FEFEE3;">
            
            @if($product->gallery)
            <div style="display: flex; gap: 1rem; margin-top: 1rem; flex-wrap: wrap;">
                @foreach($product->gallery as $img)
                <div style="position: relative; width: 80px; height: 80px;">
                    <img src="{{ $img }}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;">
                </div>
                @endforeach
            </div>
            @endif
        </div>

        <div class="form-group" style="margin-bottom: 2rem;">
            <label style="display: block; margin-bottom: 0.5rem; opacity: 0.7;">Description</label>
            <textarea name="description" rows="5" required style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(197, 160, 89, 0.2); border-radius: 8px; color: #FEFEE3; resize: vertical;">{{ $product->description }}</textarea>
        </div>

        <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 3rem; padding-bottom: 2rem;">
            <a href="{{ route('admin.products.index') }}" class="admin-nav-link" style="margin: 0; background: rgba(255,255,255,0.05); min-width: 120px; justify-content: center;">Cancel</a>
            <button type="submit" class="btn-auth" style="margin: 0; padding: 12px 40px; min-width: 180px; box-shadow: 0 10px 20px rgba(197, 160, 89, 0.2);">Update Product</button>
        </div>
    </form>
</div>
@endsection

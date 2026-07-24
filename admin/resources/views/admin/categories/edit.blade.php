@extends('layouts.admin')

@section('admin_title', 'Edit Category')

@section('admin_content')
<div class="admin-table-container" style="max-width: 800px; margin: 0 auto; padding: 2.5rem;">
    <form action="{{ route('admin.categories.update', $category->id) }}" method="POST" enctype="multipart/form-data">
        @csrf
        @method('PUT')
        <div class="form-group" style="margin-bottom: 2rem;">
            <label>Category Name</label>
            <input type="text" name="name" value="{{ $category->name }}" required>
        </div>

        <div class="form-group" style="margin-bottom: 2rem;">
            <label>Thumbnail Image (Keep empty to stay same)</label>
            <input type="file" name="image" accept="image/*">
            @if($category->image)
            <img src="{{ $category->image }}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px; margin-top: 1rem;">
            @endif
        </div>

        <div class="form-group" style="margin-bottom: 2rem;">
            <label>Description</label>
            <textarea name="description" rows="5">{{ $category->description }}</textarea>
        </div>

        <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 3rem; padding-bottom: 2rem;">
            <a href="{{ route('admin.categories.index') }}" class="admin-nav-link" style="margin: 0; background: rgba(255,255,255,0.05); min-width: 120px; justify-content: center;">Cancel</a>
            <button type="submit" class="btn-auth" style="margin: 0; padding: 12px 40px; min-width: 180px; box-shadow: 0 10px 20px rgba(197, 160, 89, 0.2);">Update Category</button>
        </div>
    </form>
</div>
@endsection

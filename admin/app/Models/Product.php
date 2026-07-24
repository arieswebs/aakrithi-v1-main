<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'price',
        'category',
        'badge',
        'image',
        'sizes',
        'description',
        'meta_title',
        'meta_description',
        'og_image',
        'is_noindex',
        'gallery',
        'is_wholesale',
    ];

    protected $casts = [
        'sizes' => 'array',
        'gallery' => 'array',
        'is_wholesale' => 'boolean',
    ];

    /**
     * Get the product image as a root-relative path.
     */
    protected function image(): \Illuminate\Database\Eloquent\Casts\Attribute
    {
        return \Illuminate\Database\Eloquent\Casts\Attribute::make(
            get: fn ($value) => $value,
        );
    }
}

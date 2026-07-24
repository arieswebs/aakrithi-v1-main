<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            ['name' => 'Embroidered Kasavu Saree', 'slug' => 'embroidered-kasavu-saree', 'price' => 1, 'category' => 'Handloom Home Decors & Embroidered Sarees', 'badge' => 'New', 'image' => '/aakriti-laravel/public/images/prod_1.png', 'sizes' => ['S', 'M', 'L', 'XL'], 'description' => 'A stunning Kasavu saree with intricate embroidery work. Handcrafted by skilled artisans using traditional techniques and premium quality thread.'],
            ['name' => 'Designer Kerala Kurthi', 'slug' => 'designer-kerala-kurthi', 'price' => 1, 'category' => 'Designer Apparels & Ethnic Wear', 'badge' => 'New', 'image' => '/aakriti-laravel/public/images/prod_2.png', 'sizes' => ['S', 'M', 'L'], 'description' => 'Elegant Kerala-style kurthi with vibrant embroidery and comfortable fit. Perfect for festivals and special occasions.'],
            ['name' => 'Embroidered Set-Dhavani', 'slug' => 'embroidered-set-dhavani', 'price' => 1, 'category' => 'Kutties Collection - Traditional Kids Wear', 'badge' => null, 'image' => '/aakriti-laravel/public/images/prod_3.png', 'sizes' => ['M', 'L', 'XL'], 'description' => 'Traditional set-dhavani with modern embroidery patterns. Includes matching blouse piece and dupatta.'],
            ['name' => 'Premium Kasavu Saree', 'slug' => 'premium-kasavu-saree', 'price' => 1, 'category' => 'Handloom Home Decors & Embroidered Sarees', 'badge' => null, 'image' => '/aakriti-laravel/public/images/prod_4.png', 'sizes' => ['Universal'], 'description' => 'Premium quality Kasavu saree with golden zari border. A timeless piece for your ethnic wardrobe.'],
            ['name' => 'Traditional Kerala Set', 'slug' => 'traditional-kerala-set', 'price' => 1, 'category' => 'Kutties Collection - Traditional Kids Wear', 'badge' => null, 'image' => '/aakriti-laravel/public/images/prod_5.png', 'sizes' => ['S', 'M', 'L'], 'description' => 'Classic Kerala set mundu with traditional motifs. Comfortable and elegant for everyday wear.'],
            ['name' => 'Classic Embroidered Saree', 'slug' => 'classic-embroidered-saree', 'price' => 1, 'category' => 'Handloom Home Decors & Embroidered Sarees', 'badge' => null, 'image' => '/aakriti-laravel/public/images/prod_6.png', 'sizes' => ['Universal'], 'description' => 'Beautifully embroidered saree with detailed peacock motifs. A masterpiece of traditional craftsmanship.'],
            ['name' => 'Royal Maroon Silk Kurthi', 'slug' => 'royal-maroon-silk-kurthi', 'price' => 2499, 'category' => 'Designer Apparels & Ethnic Wear', 'badge' => 'Premium', 'image' => '/aakriti-laravel/public/images/prod_7.png', 'sizes' => ['S', 'M', 'L', 'XL'], 'description' => 'Premium silk kurthi in rich maroon, featuring exquisite hand-embroidery on the neckline and cuffs. Perfect for grand occasions.'],
            ['name' => 'Little Princess Pattu Pavadai', 'slug' => 'little-princess-pattu-pavadai', 'price' => 1899, 'category' => 'Kutties Collection - Traditional Kids Wear', 'badge' => 'Trending', 'image' => '/aakriti-laravel/public/images/prod_8.png', 'sizes' => ['2-4Y', '4-6Y', '6-8Y'], 'description' => 'Classic traditional South Indian Pattu Pavadai for your little one. Hand-woven with premium silk and vibrant golden zari.'],
            ['name' => 'Hand-Painted Floral Saree', 'slug' => 'hand-painted-floral-saree', 'price' => 3599, 'category' => 'Handloom Home Decors & Embroidered Sarees', 'badge' => 'New Arrival', 'image' => '/aakriti-laravel/public/images/prod_9.png', 'sizes' => ['Universal'], 'description' => 'Exquisite hand-painted floral motifs on pure handloom cotton. A blend of modern art and traditional weaving.'],
        ];

        foreach ($products as $product) {
            \App\Models\Product::updateOrCreate(['slug' => $product['slug']], $product);
        }
    }
}

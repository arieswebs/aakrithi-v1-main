<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index()
    {
        // Exclude products that carry an is_noindex true flag
        $products = Product::where('is_noindex', false)->get();
        // Since categories are static strings
        $categories = ['apparels', 'kutties', 'decors', 'boutique'];
        
        $urls = [];
        $urls[] = ['url' => route('home'), 'priority' => 1.0, 'freq' => 'daily'];
        $urls[] = ['url' => route('shop'), 'priority' => 0.9, 'freq' => 'daily'];
        $urls[] = ['url' => route('about'), 'priority' => 0.5, 'freq' => 'monthly'];
        $urls[] = ['url' => route('contact'), 'priority' => 0.5, 'freq' => 'monthly'];

        foreach ($categories as $cat) {
            $urls[] = ['url' => route('category', $cat), 'priority' => 0.8, 'freq' => 'weekly'];
        }

        foreach ($products as $product) {
            $urls[] = [
                'url' => route('product', $product->slug),
                'priority' => 0.7,
                'freq' => 'weekly',
                'lastmod' => $product->updated_at->tz('UTC')->toAtomString()
            ];
        }

        return response()->view('sitemap', compact('urls'))
            ->header('Content-Type', 'text/xml');
    }
}

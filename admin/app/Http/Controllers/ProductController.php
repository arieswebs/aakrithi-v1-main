<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function home()
    {
        $products = Product::whereRaw('is_wholesale = false')->take(4)->get();
        return view('home', compact('products'));
    }

    public function wholesale()
    {
        $products = Product::whereRaw('is_wholesale = true')->get();
        $title = 'Wholesale Hub | Aakrithi Artisanal B2B';
        return view('wholesale', compact('products', 'title'));
    }

    public function wholesaleShow($slug)
    {
        $product = Product::where('slug', $slug)->firstOrFail();
        return view('wholesale-product', compact('product'));
    }

    public function shop(Request $request)
    {
        $category = $request->get('category');
        $sort = $request->get('sort', 'latest');
        $query = Product::whereRaw('is_wholesale = false');
        $title = 'All Shop';

        if ($category) {
            $categoryMap = [
                'apparels' => 'Designer Apparels & Ethnic Wear',
                'kutties' => 'Kutties Collection - Traditional Kids Wear',
                'decors' => 'Handloom Home Decors & Embroidered Sarees',
            ];
            $catName = $categoryMap[$category] ?? ucfirst($category);
            $query->where('category', $catName);
            $title = "$catName | Aakrithi Boutique";
            $meta_description = "Shop the latest $catName at Aakrithi. Our selection features designer ethnic wear, handcrafted sarees, and trendy children's outfits.";
        } else {
            $meta_description = "Explore Aakrithi's full range of designer women's ethnic wear, handcrafted sarees, and stylish kids' clothing. Find traditional and modern styles.";
        }

        $meta_keywords = "Aakrithi shop, designer women's wear, kids ethnic outfits, boutique sarees online, traditional Indian fashion, handcrafted clothing";

        // Apply Sorting
        $this->applySorting($query, $sort);

        $products = $query->get();
        return view('shop', compact('products', 'title', 'meta_description', 'meta_keywords'));
    }

    public function category(Request $request, $slug)
    {
        $sort = $request->get('sort', 'latest');
        $query = Product::whereRaw('is_wholesale = false');
        
        $categoryMap = [
            'apparels' => 'Designer Apparels & Ethnic Wear',
            'kutties' => 'Kutties Collection - Traditional Kids Wear',
            'decors' => 'Handloom Home Decors & Embroidered Sarees',
        ];
        $catName = $categoryMap[strtolower($slug)] ?? ucfirst(str_replace('-', ' ', $slug));
        
        $query->where('category', $catName);
        $title = "$catName | Aakrithi Premium Collection";
        $meta_description = "Discover our exclusive $catName collection at Aakrithi. Handcrafted ethnic wear and designer children's clothing for every special occasion.";
        $meta_keywords = "$catName, Aakrithi designer boutique, traditional women's wear, festive kids clothing, artisanal sarees, Indian ethnic fashion online";

        // Apply Sorting
        $this->applySorting($query, $sort);

        $products = $query->get();
        return view('shop', compact('products', 'title', 'meta_description', 'meta_keywords'));
    }

    private function applySorting($query, $sort)
    {
        switch ($sort) {
            case 'price-low':
                $query->orderBy('price', 'asc');
                break;
            case 'price-high':
                $query->orderBy('price', 'desc');
                break;
            case 'newest':
                $query->orderBy('created_at', 'desc');
                break;
            case 'latest':
            default:
                $query->orderBy('id', 'desc');
                break;
        }
    }

    public function show($slug)
    {
        // First try to find by slug
        $product = Product::where('slug', $slug)->first();

        // If not found AND the value is numeric, try finding by ID and redirect to slug URL
        if (!$product && is_numeric($slug)) {
            $product = Product::find($slug);
            if ($product && $product->slug) {
                return redirect()->route('product', $product->slug, 301);
            }
        }

        if (!$product) {
            abort(404);
        }

        return view('product', compact('product'));
    }
}

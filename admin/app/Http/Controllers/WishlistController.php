<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class WishlistController extends Controller
{
    public function index()
    {
        $wishlist = session()->get('wishlist', []);
        return view('wishlist', compact('wishlist'));
    }

    public function add($id)
    {
        $product = DB::table('products')->where('id', $id)->first();
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $wishlist = session()->get('wishlist', []);

        if (isset($wishlist[$id])) {
            return response()->json(['message' => 'Already in wishlist', 'count' => count($wishlist)]);
        }

        $wishlist[$id] = [
            "name" => $product->name ?? 'Product',
            "quantity" => 1,
            "price" => $product->price ?? 0,
            "image" => $product->image ?? '',
            "category" => $product->category ?? 'Category'
        ];

        session()->put('wishlist', $wishlist);
        return response()->json(['message' => 'Added to wishlist', 'count' => count($wishlist)]);
    }

    public function remove(Request $request)
    {
        if($request->id) {
            $wishlist = session()->get('wishlist');
            if(isset($wishlist[$request->id])) {
                unset($wishlist[$request->id]);
                session()->put('wishlist', $wishlist);
            }
            return response()->json(['message' => 'Removed from wishlist', 'count' => count($wishlist)]);
        }
    }
}

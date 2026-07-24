<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CartController extends Controller
{
    public function index()
    {
        $cart = session()->get('cart', []);
        
        // Sync session images with current DB state to ensure new assets are picked up
        if (!empty($cart)) {
            $updated = false;
            foreach ($cart as $id => &$details) {
                $product = \App\Models\Product::find($id);
                if ($product && $details['image'] !== $product->image) {
                    $details['image'] = $product->image;
                    $updated = true;
                }
            }
            if ($updated) {
                session()->put('cart', $cart);
            }
        }

        $total = array_reduce($cart, function($carry, $item) {
            return $carry + ($item['price'] * $item['quantity']);
        }, 0);

        return view('cart', compact('cart', 'total'));
    }

    public function checkout()
    {
        $cart = session()->get('cart', []);
        $total = array_reduce($cart, function($carry, $item) {
            return $carry + ($item['price'] * $item['quantity']);
        }, 0);

        if (empty($cart)) {
            return redirect()->route('cart')->with('error', 'Your cart is empty!');
        }

        $razorpayKey = config('services.razorpay.key') ?? env('RAZORPAY_KEY_ID');
        $razorpaySecret = config('services.razorpay.secret') ?? env('RAZORPAY_KEY_SECRET');
        $addresses = auth()->check() ? auth()->user()->addresses()->orderBy('is_default', 'desc')->get() : collect([]);

        // Create Razorpay Order Server-Side
        $razorpayOrderId = null;
        if ($total > 0 && $razorpayKey && $razorpaySecret) {
            try {
                $response = Http::withBasicAuth($razorpayKey, $razorpaySecret)
                    ->post('https://api.razorpay.com/v1/orders', [
                        'amount' => $total * 100, // paise
                        'currency' => 'INR',
                        'receipt' => 'rcpt_' . uniqid()
                    ]);
                if ($response->successful()) {
                    $razorpayOrderId = $response->json('id');
                    session()->put('razorpay_order_id', $razorpayOrderId);
                } else {
                    Log::error('Razorpay Order Creation Failed', $response->json());
                }
            } catch (\Exception $e) {
                Log::error('Razorpay API Exception: ' . $e->getMessage());
            }
        }

        return view('checkout', compact('cart', 'total', 'razorpayKey', 'addresses', 'razorpayOrderId'));
    }

    public function add(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $cart = session()->get('cart', []);

        if(isset($cart[$id])) {
            $cart[$id]['quantity']++;
        } else {
            $cart[$id] = [
                "name" => $product->name,
                "quantity" => 1,
                "price" => $product->price,
                "image" => $product->image,
                "category" => $product->category
            ];
        }

        session()->put('cart', $cart);

        if ($request->query('redirect') === 'checkout') {
            return redirect()->route('checkout')->with('success', 'Ready for checkout!');
        }

        if ($request->query('redirect') === 'cart') {
            return redirect()->route('cart')->with('success', 'Product added — ready to checkout!');
        }

        return redirect()->back()->with('success', 'Product added to cart successfully!');
    }

    public function remove(Request $request)
    {
        if($request->id) {
            $cart = session()->get('cart');
            if(isset($cart[$request->id])) {
                unset($cart[$request->id]);
                session()->put('cart', $cart);
            }
            session()->flash('success', 'Product removed successfully');
        }
    }

    public function update(Request $request)
    {
        if($request->id && $request->quantity){
            $cart = session()->get('cart');
            $cart[$request->id]["quantity"] = $request->quantity;
            session()->put('cart', $cart);
            session()->flash('success', 'Cart updated successfully');
        }
    }

    public function wholesaleIndex()
    {
        $cart = session()->get('wholesale_cart', []);
        $total = array_reduce($cart, function($carry, $item) {
            return $carry + ($item['price'] * $item['quantity']);
        }, 0);
        $totalQuantity = array_reduce($cart, function($carry, $item) {
            return $carry + $item['quantity'];
        }, 0);

        return view('wholesale-cart', compact('cart', 'total', 'totalQuantity'));
    }

    public function wholesaleAdd(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $cart = session()->get('wholesale_cart', []);
        $qtyToAdd = (int)$request->query('quantity', 6);

        if ($qtyToAdd < 6) {
            return redirect()->back()->with('error', 'Minimum 6 pieces of a single product are required for wholesale.');
        }

        if(isset($cart[$id])) {
            $cart[$id]['quantity'] += $qtyToAdd;
        } else {
            $cart[$id] = [
                "name" => $product->name,
                "quantity" => (int)$qtyToAdd,
                "price" => $product->price,
                "image" => $product->image,
                "category" => $product->category
            ];
        }

        session()->put('wholesale_cart', $cart);

        return redirect()->route('wholesale.cart')->with('success', 'Item added to wholesale cart!');
    }

    public function wholesaleRemove(Request $request)
    {
        if($request->id) {
            $cart = session()->get('wholesale_cart');
            if(isset($cart[$request->id])) {
                unset($cart[$request->id]);
                session()->put('wholesale_cart', $cart);
            }
            session()->flash('success', 'Product removed successfully');
        }
    }

    public function wholesaleUpdate(Request $request)
    {
        if($request->id && $request->quantity){
            if ($request->quantity < 6) {
                session()->flash('error', 'Minimum 6 pieces required per product for wholesale.');
                return response()->json(['success' => false, 'message' => 'Minimum 6 pieces required.']);
            }
            $cart = session()->get('wholesale_cart');
            $cart[$request->id]["quantity"] = $request->quantity;
            session()->put('wholesale_cart', $cart);
            session()->flash('success', 'Cart updated successfully');
        }
    }

    public function wholesaleCheckout()
    {
        $cart = session()->get('wholesale_cart', []);
        
        foreach ($cart as $id => $item) {
            if ($item['quantity'] < 6) {
                return redirect()->route('wholesale.cart')->with('error', 'Each product in your wholesale cart must have at least 6 pieces.');
            }
        }

        $totalQuantity = array_reduce($cart, function($carry, $item) {
            return $carry + $item['quantity'];
        }, 0);

        $total = array_reduce($cart, function($carry, $item) {
            return $carry + ($item['price'] * $item['quantity']);
        }, 0);

        $addresses = auth()->check() ? auth()->user()->addresses()->orderBy('is_default', 'desc')->get() : collect([]);

        return view('wholesale-checkout', compact('cart', 'total', 'totalQuantity', 'addresses'));
    }
}

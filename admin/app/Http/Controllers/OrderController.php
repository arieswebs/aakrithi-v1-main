<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $cart = session()->get('cart', []);
        
        if (empty($cart)) {
            return response()->json(['error' => 'Cart is empty'], 400);
        }

        $total = 0;
        foreach ($cart as $details) {
            $total += $details['price'] * $details['quantity'];
        }

        // Verify Razorpay Payment (Server-side via HMAC Signature)
        $paymentStatus = 'pending';
        $razorpaySignature = $request->razorpay_signature;
        $razorpayOrderId = session()->get('razorpay_order_id');

        if ($request->payment_method === 'razorpay' && $request->payment_id && $razorpaySignature && $razorpayOrderId) {
            $keySecret = env('RAZORPAY_KEY_SECRET');
            
            try {
                // Official Razorpay Signature Verification
                $generatedSignature = hash_hmac('sha256', $razorpayOrderId . "|" . $request->payment_id, $keySecret);
                
                if (hash_equals($generatedSignature, $razorpaySignature)) {
                    $paymentStatus = 'verified';
                } else {
                    Log::error('Razorpay signature verification failed', [
                        'payment_id' => $request->payment_id,
                        'order_id' => $razorpayOrderId
                    ]);
                }
            } catch (\Exception $e) {
                Log::error('Razorpay Verification Exception: ' . $e->getMessage());
            }
        }


        $order = Order::create([
            'order_number' => 'AAK-' . strtoupper(Str::random(8)),
            'customer_name' => $request->customer_name,
            'customer_email' => $request->customer_email,
            'customer_phone' => $request->customer_phone,
            'shipping_address' => $request->address_line_1 . ($request->address_line_2 ? ', ' . $request->address_line_2 : ''),
            'city' => $request->city,
            'state' => $request->state,
            'pincode' => $request->pincode,
            'payment_method' => $request->payment_method,
            'payment_id' => $request->payment_id,
            'payment_status' => $paymentStatus,
            'razorpay_signature' => $razorpaySignature,
            'status' => 'confirmed',
            'items' => $cart,
            'total' => $total,
        ]);

        // Save address to user_addresses if requested
        if (auth()->check() && $request->save_address) {
            $user = auth()->user();
            // Check if address already exists (simple match)
            $exists = \App\Models\UserAddress::where('user_id', $user->id)
                ->where('address', $request->address_line_1)
                ->where('pincode', $request->pincode)
                ->exists();

            if (!$exists) {
                \App\Models\UserAddress::create([
                    'user_id' => $user->id,
                    'name' => $request->customer_name,
                    'email' => $request->customer_email,
                    'phone' => $request->customer_phone,
                    'address' => $request->address_line_1 . ($request->address_line_2 ? ', ' . $request->address_line_2 : ''),
                    'city' => $request->city,
                    'state' => $request->state,
                    'pincode' => $request->pincode,
                    'is_default' => $user->addresses()->count() === 0,
                ]);
            }
        }

        // Clear the cart and payment session data
        session()->forget('cart');
        session()->forget('razorpay_order_id');

        return response()->json([
            'success' => true,
            'order_number' => $order->order_number,
            'order_id' => $order->id,
        ]);
    }

    public function show($orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)->firstOrFail();
        return view('order-details', compact('order'));
    }

    public function trackForm()
    {
        return view('track-order');
    }

    public function track(Request $request)
    {
        $request->validate([
            'order_number' => 'required|string',
            'phone' => 'required|string'
        ]);

        $order = Order::where('order_number', trim($request->order_number))
                      ->where('customer_phone', trim($request->phone))
                      ->first();

        if ($order) {
            return redirect()->route('order.show', $order->order_number);
        }

        return back()->with('error', 'Order not found. Please check your tracking details and try again.');
    }
}

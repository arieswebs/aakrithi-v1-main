<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function dashboard()
    {
        $stats = [
            'total_users' => \App\Models\User::count(),
            'total_orders' => \App\Models\Order::count(),
            'total_products' => \App\Models\Product::count(),
            'total_revenue' => \App\Models\Order::sum('total_price'),
        ];

        return view('admin.dashboard', compact('stats'));
    }

    public function products()
    {
        $products = \App\Models\Product::latest()->paginate(20);
        return view('admin.products.index', compact('products'));
    }

    public function orders()
    {
        $orders = \App\Models\Order::latest()->paginate(20);
        return view('admin.orders.index', compact('orders'));
    }
}

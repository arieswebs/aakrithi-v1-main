<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function dashboard()
    {
        $stats = cache()->remember('admin_dashboard_stats', 60, function() {
            return [
                'total_users' => \App\Models\User::count(),
                'total_orders' => \App\Models\Order::count(),
                'total_products' => \App\Models\Product::count(),
                'total_revenue' => \App\Models\Order::sum('total'),
            ];
        });

        return view('admin.dashboard', compact('stats'));
    }

    public function products()
    {
        $products = \App\Models\Product::latest()->paginate(20);
        return view('admin.products.index', compact('products'));
    }

    public function createProduct()
    {
        $categories = \App\Models\Category::all();
        return view('admin.products.create', compact('categories'));
    }

    public function storeProduct(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string',
            'price' => 'required|numeric',
            'description' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
            'gallery.*' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'is_wholesale' => 'nullable|boolean',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $imagePath = '/storage/' . $path;
        }

        $galleryPaths = [];
        if ($request->hasFile('gallery')) {
            foreach ($request->file('gallery') as $file) {
                $path = $file->store('products', 'public');
                $galleryPaths[] = '/storage/' . $path;
            }
        }

        // Handle Sizes with Stock
        $sizes = [];
        if ($request->has('sizes')) {
            foreach ($request->sizes as $size => $stock) {
                if ($stock !== null && $stock !== '') {
                    $sizes[$size] = (int)$stock;
                }
            }
        }

        \App\Models\Product::create([
            'name' => $validated['name'],
            'category' => $validated['category'],
            'price' => $validated['price'],
            'description' => $validated['description'],
            'image' => $imagePath,
            'gallery' => $galleryPaths,
            'sizes' => $sizes,
            'is_wholesale' => $request->has('is_wholesale'),
            'slug' => \Illuminate\Support\Str::slug($validated['name']),
        ]);

        return redirect()->route('admin.products.index')->with('success', 'Product created successfully.');
    }

    public function editProduct(\App\Models\Product $product)
    {
        $categories = \App\Models\Category::all();
        return view('admin.products.edit', compact('product', 'categories'));
    }

    public function updateProduct(Request $request, \App\Models\Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string',
            'price' => 'required|numeric',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'gallery.*' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'is_wholesale' => 'nullable|boolean',
        ]);

        $data = [
            'name' => $validated['name'],
            'category' => $validated['category'],
            'price' => $validated['price'],
            'description' => $validated['description'],
            'is_wholesale' => $request->has('is_wholesale'),
            'slug' => \Illuminate\Support\Str::slug($validated['name']),
        ];

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $data['image'] = '/storage/' . $path;
        }

        if ($request->hasFile('gallery')) {
            $galleryPaths = $product->gallery ?? [];
            foreach ($request->file('gallery') as $file) {
                $path = $file->store('products', 'public');
                $galleryPaths[] = '/storage/' . $path;
            }
            $data['gallery'] = $galleryPaths;
        }

        // Handle Sizes with Stock
        $sizes = [];
        if ($request->has('sizes')) {
            foreach ($request->sizes as $size => $stock) {
                if ($stock !== null && $stock !== '') {
                    $sizes[$size] = (int)$stock;
                }
            }
        }
        $data['sizes'] = $sizes;

        $product->update($data);

        return redirect()->route('admin.products.index')->with('success', 'Product updated successfully.');
    }

    public function destroyProduct(\App\Models\Product $product)
    {
        $product->delete();
        return redirect()->route('admin.products.index')->with('success', 'Product deleted successfully.');
    }

    public function users()
    {
        $users = \App\Models\User::latest()->paginate(20);
        return view('admin.users.index', compact('users'));
    }

    public function destroyUser(\App\Models\User $user)
    {
        // Prevent deleting yourself
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot delete your own account.');
        }
        
        $user->delete();
        return back()->with('success', 'User removed successfully.');
    }

    public function messages()
    {
        $messages = \App\Models\ContactMessage::latest()->paginate(20);
        return view('admin.messages.index', compact('messages'));
    }

    public function toggleMessageRead($id)
    {
        $message = \App\Models\ContactMessage::findOrFail($id);
        $message->is_read = !$message->is_read;
        $message->save();
        return back()->with('success', 'Message status updated.');
    }

    public function orders()
    {
        $orders = \App\Models\Order::latest()->paginate(20);
        return view('admin.orders.index', compact('orders'));
    }

    public function updateOrderStatus(Request $request, \App\Models\Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:pending,confirmed,processing,shipped,delivered,cancelled',
        ]);

        $order->status = $validated['status'];
        $order->save();

        return back()->with('success', 'Order status updated successfully.');
    }

    // Category Management
    public function categories()
    {
        $categories = \App\Models\Category::latest()->paginate(20);
        return view('admin.categories.index', compact('categories'));
    }

    public function createCategory()
    {
        return view('admin.categories.create');
    }

    public function storeCategory(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('categories', 'public');
            $imagePath = '/storage/' . $path;
        }

        \App\Models\Category::create([
            'name' => $validated['name'],
            'slug' => \Illuminate\Support\Str::slug($validated['name']),
            'description' => $validated['description'],
            'image' => $imagePath,
            'is_active' => true,
        ]);

        return redirect()->route('admin.categories.index')->with('success', 'Category created successfully.');
    }

    public function editCategory(\App\Models\Category $category)
    {
        return view('admin.categories.edit', compact('category'));
    }

    public function updateCategory(Request $request, \App\Models\Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $data = [
            'name' => $validated['name'],
            'slug' => \Illuminate\Support\Str::slug($validated['name']),
            'description' => $validated['description'],
        ];

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('categories', 'public');
            $data['image'] = '/storage/' . $path;
        }

        $category->update($data);

        return redirect()->route('admin.categories.index')->with('success', 'Category updated successfully.');
    }

    public function destroyCategory(\App\Models\Category $category)
    {
        $category->delete();
        return redirect()->route('admin.categories.index')->with('success', 'Category deleted successfully.');
    }
}

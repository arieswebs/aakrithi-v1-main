<?php $__env->startSection('admin_title', 'Dashboard Overview'); ?>

<?php $__env->startSection('admin_content'); ?>
<div class="stats-grid">
    <div class="stat-card">
        <div class="stat-icon"><i data-lucide="shopping-cart"></i></div>
        <div class="stat-info">
            <h3>Total Orders</h3>
            <p><?php echo e(number_format($stats['total_orders'])); ?></p>
        </div>
    </div>
    <div class="stat-card">
        <div class="stat-icon"><i data-lucide="indian-rupee"></i></div>
        <div class="stat-info">
            <h3>Revenue</h3>
            <p>₹<?php echo e(number_format($stats['total_revenue'])); ?></p>
        </div>
    </div>
    <div class="stat-card">
        <div class="stat-icon"><i data-lucide="users"></i></div>
        <div class="stat-info">
            <h3>Registered Users</h3>
            <p><?php echo e(number_format($stats['total_users'])); ?></p>
        </div>
    </div>
    <div class="stat-card">
        <div class="stat-icon"><i data-lucide="package"></i></div>
        <div class="stat-info">
            <h3>Active Products</h3>
            <p><?php echo e(number_format($stats['total_products'])); ?></p>
        </div>
    </div>
</div>

<div class="row" style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
    <div class="admin-table-container">
        <div style="padding: 1.5rem; border-bottom: 1px solid rgba(197, 160, 89, 0.1); display: flex; justify-content: space-between; align-items: center;">
            <h3 style="font-size: 1rem; font-weight: 600;">Recent Orders</h3>
            <a href="<?php echo e(route('admin.orders.index')); ?>" style="color: var(--color-accent); text-decoration: none; font-size: 0.8rem;">View All</a>
        </div>
        <table class="admin-table">
            <thead>
                <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                <?php $__empty_1 = true; $__currentLoopData = \App\Models\Order::latest()->take(5)->get(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $order): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
                <tr>
                    <td>#<?php echo e($order->order_number); ?></td>
                    <td><?php echo e($order->customer_name); ?></td>
                    <td>
                        <span class="admin-badge <?php echo e($order->status === 'delivered' ? 'badge-green' : 'badge-gold'); ?>">
                            <?php echo e($order->status); ?>

                        </span>
                    </td>
                    <td>₹<?php echo e(number_format($order->total)); ?></td>
                </tr>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
                <tr>
                    <td colspan="4" style="text-align: center; padding: 2rem; opacity: 0.5;">No orders found yet.</td>
                </tr>
                <?php endif; ?>
            </tbody>
        </table>
    </div>

    <div class="admin-table-container">
        <div style="padding: 1.5rem; border-bottom: 1px solid rgba(197, 160, 89, 0.1);">
            <h3 style="font-size: 1rem; font-weight: 600;">System Health</h3>
        </div>
        <div style="padding: 1.5rem;">
            <div style="margin-bottom: 1.5rem;">
                <p style="font-size: 0.8rem; opacity: 0.6; margin-bottom: 0.5rem;">Server Environment</p>
                <div style="display: flex; justify-content: space-between; font-weight: 600;">
                    <span>PHP Version</span>
                    <span><?php echo e(PHP_VERSION); ?></span>
                </div>
            </div>
            <div style="margin-bottom: 1.5rem;">
                <p style="font-size: 0.8rem; opacity: 0.6; margin-bottom: 0.5rem;">Database Engine</p>
                <div style="display: flex; justify-content: space-between; font-weight: 600;">
                    <span>Connection</span>
                    <span>PostgreSQL (Supabase)</span>
                </div>
            </div>
        </div>
    </div>
</div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.admin', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH E:\aries\aakrithi-v1-main\admin\resources\views/admin/dashboard.blade.php ENDPATH**/ ?>
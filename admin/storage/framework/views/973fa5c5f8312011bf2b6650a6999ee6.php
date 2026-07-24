<?php $__env->startSection('admin_title', 'Order Management'); ?>

<?php $__env->startSection('admin_content'); ?>
<div style="margin-bottom: 2rem;">
    <p style="opacity: 0.7;">Track and fulfill boutique and wholesale orders.</p>
</div>

<div class="admin-table-container">
    <table class="admin-table">
        <thead>
            <tr>
                <th>Order #</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php $__currentLoopData = $orders; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $order): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <tr>
                <td style="font-weight: 700;">#<?php echo e($order->order_number); ?></td>
                <td style="opacity: 0.7;"><?php echo e($order->created_at->format('M d, Y')); ?></td>
                <td>
                    <div style="font-weight: 600;"><?php echo e($order->customer_name); ?></div>
                    <div style="font-size: 0.75rem; opacity: 0.6;"><?php echo e($order->customer_email); ?></div>
                </td>
                <td>
                    <span class="admin-badge <?php echo e($order->is_wholesale ? 'badge-gold' : 'badge-green'); ?>">
                        <?php echo e($order->is_wholesale ? 'Wholesale' : 'Retail'); ?>

                    </span>
                </td>
                <td style="font-weight: 600;">₹<?php echo e(number_format($order->total_price)); ?></td>
                <td>
                    <select class="admin-badge" style="background: rgba(197, 160, 89, 0.1); color: var(--color-accent); border: 1px solid rgba(197, 160, 89, 0.2); cursor: pointer;">
                        <option value="pending" <?php echo e($order->status === 'pending' ? 'selected' : ''); ?>>Pending</option>
                        <option value="processing" <?php echo e($order->status === 'processing' ? 'selected' : ''); ?>>Processing</option>
                        <option value="shipped" <?php echo e($order->status === 'shipped' ? 'selected' : ''); ?>>Shipped</option>
                        <option value="delivered" <?php echo e($order->status === 'delivered' ? 'selected' : ''); ?>>Delivered</option>
                        <option value="cancelled" <?php echo e($order->status === 'cancelled' ? 'selected' : ''); ?>>Cancelled</option>
                    </select>
                </td>
                <td>
                    <a href="https://www.aakrithiclothings.in/order/<?php echo e($order->order_number); ?>" target="_blank" style="color: var(--color-accent); text-decoration: none;"><i data-lucide="eye" style="width: 18px;"></i></a>
                </td>
            </tr>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </tbody>
    </table>
    <div style="padding: 1rem;">
        <?php echo e($orders->links()); ?>

    </div>
</div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.admin', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH E:\aries\aakrithi-v1-main\admin\resources\views/admin/orders/index.blade.php ENDPATH**/ ?>
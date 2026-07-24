<?php $__env->startSection('admin_title', 'Product Management'); ?>

<?php $__env->startSection('admin_content'); ?>
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
    <p style="opacity: 0.7;">Manage your artisanal collections and inventory.</p>
    <a href="<?php echo e(route('admin.products.create')); ?>" class="btn-dark" style="padding: 10px 20px; font-size: 0.9rem; text-decoration: none; background: var(--color-accent); color: #072821; border-radius: 8px; font-weight: 600;">+ Add New Product</a>
</div>

<div class="admin-table-container">
    <table class="admin-table">
        <thead>
            <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php $__currentLoopData = $products; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $product): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <tr>
                <td><img src="<?php echo e($product->image); ?>" style="width: 40px; height: 40px; border-radius: 6px; object-fit: cover;"></td>
                <td style="font-weight: 600;"><?php echo e($product->name); ?></td>
                <td><?php echo e($product->category); ?></td>
                <td>₹<?php echo e(number_format($product->price)); ?></td>
                <td>
                    <span class="admin-badge <?php echo e($product->is_wholesale ? 'badge-accent' : 'badge-green'); ?>" style="<?php echo e($product->is_wholesale ? 'background: rgba(197, 160, 89, 0.1); color: #C5A059; border: 1px solid rgba(197, 160, 89, 0.2);' : ''); ?>">
                        <?php echo e($product->is_wholesale ? 'Wholesale' : 'Retail'); ?>

                    </span>
                </td>
                <td>
                    <span class="admin-badge badge-green">Active</span>
                </td>
                <td>
                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                        <a href="<?php echo e(route('admin.products.edit', $product->id)); ?>" style="color: var(--color-accent); text-decoration: none;" title="Edit">
                            <i data-lucide="edit-3" style="width: 18px;"></i>
                        </a>
                        <form id="delete-form-<?php echo e($product->id); ?>" action="<?php echo e(route('admin.products.destroy', $product->id)); ?>" method="POST" style="display: none;">
                            <?php echo csrf_field(); ?>
                            <?php echo method_field('DELETE'); ?>
                        </form>
                        <button type="button" onclick="confirmDelete('<?php echo e($product->id); ?>')" style="background: none; border: none; color: #ff4d4f; cursor: pointer; padding: 0;" title="Delete">
                            <i data-lucide="trash-2" style="width: 18px;"></i>
                        </button>
                    </div>
                </td>
            </tr>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </tbody>
    </table>
    <div style="padding: 1rem;">
        <?php echo e($products->links()); ?>

    </div>
</div>

<script>
function confirmDelete(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "This product will be permanently removed from your collection.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ff4d4f',
        cancelButtonColor: '#C5A059',
        confirmButtonText: 'Yes, delete it!',
        background: '#072821',
        color: '#FEFEE3',
        backdrop: `rgba(7, 40, 33, 0.8)`
    }).then((result) => {
        if (result.isConfirmed) {
            document.getElementById('delete-form-' + id).submit();
        }
    })
}
</script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.admin', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH E:\aries\aakrithi-v1-main\admin\resources\views/admin/products/index.blade.php ENDPATH**/ ?>
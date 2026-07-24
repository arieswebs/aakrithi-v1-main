<?php $__env->startSection('admin_title', 'Add New Product'); ?>

<?php $__env->startSection('admin_content'); ?>
<div class="admin-table-container" style="max-width: 800px; margin: 0 auto; padding: 2.5rem;">
    <form action="<?php echo e(route('admin.products.store')); ?>" method="POST" enctype="multipart/form-data">
        <?php echo csrf_field(); ?>
        <div class="stats-grid" style="grid-template-columns: 1fr 1fr; margin-bottom: 2rem;">
            <div class="form-group">
                <label style="display: block; margin-bottom: 0.5rem; opacity: 0.7;">Product Name</label>
                <input type="text" name="name" required style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(197, 160, 89, 0.2); border-radius: 8px; color: #FEFEE3;">
            </div>
            <div class="form-group">
                <label style="display: block; margin-bottom: 0.5rem; opacity: 0.7;">Category</label>
                <select name="category" required style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(197, 160, 89, 0.2); border-radius: 8px; color: #FEFEE3;">
                    <?php $__currentLoopData = $categories; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $cat): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <option value="<?php echo e($cat->slug); ?>"><?php echo e($cat->name); ?></option>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                </select>
            </div>
        </div>

        <div class="stats-grid" style="grid-template-columns: 1fr 1fr; margin-bottom: 2rem;">
            <div class="form-group">
                <label style="display: block; margin-bottom: 0.5rem; opacity: 0.7;">Price (₹)</label>
                <input type="number" name="price" required style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(197, 160, 89, 0.2); border-radius: 8px; color: #FEFEE3;">
            </div>
            <div class="form-group">
                <label style="display: block; margin-bottom: 0.5rem; opacity: 0.7;">Product Type</label>
                <div style="display: flex; align-items: center; gap: 1rem; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(197, 160, 89, 0.2); border-radius: 8px;">
                    <input type="checkbox" name="is_wholesale" value="1" id="is_wholesale" style="width: 18px; height: 18px; cursor: pointer;">
                    <label for="is_wholesale" style="cursor: pointer; color: #C5A059; font-weight: 600;">Is Wholesale Product</label>
                </div>
            </div>
        </div>

        <div class="stats-grid" style="grid-template-columns: 1fr; margin-bottom: 2rem;">
            <div class="form-group">
                <label style="display: block; margin-bottom: 0.5rem; opacity: 0.7;">Product Image</label>
                <input type="file" name="image" accept="image/*" required style="width: 100%; padding: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(197, 160, 89, 0.2); border-radius: 8px; color: #FEFEE3;">
            </div>
        </div>

        <div class="form-group" style="margin-bottom: 2rem;">
            <label style="display: block; margin-bottom: 0.5rem; opacity: 0.7;">Product Gallery (Additional Images)</label>
            <input type="file" name="gallery[]" accept="image/*" multiple style="width: 100%; padding: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(197, 160, 89, 0.2); border-radius: 8px; color: #FEFEE3;">
        </div>

        <div class="form-group" style="margin-bottom: 2rem;">
            <label style="display: block; margin-bottom: 0.5rem; opacity: 0.7;">Description</label>
            <textarea name="description" rows="5" required style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(197, 160, 89, 0.2); border-radius: 8px; color: #FEFEE3; resize: vertical;"></textarea>
        </div>

        <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 3rem; padding-bottom: 2rem;">
            <a href="<?php echo e(route('admin.products.index')); ?>" class="admin-nav-link" style="margin: 0; background: rgba(255,255,255,0.05); min-width: 120px; justify-content: center;">Cancel</a>
            <button type="submit" class="btn-auth" style="margin: 0; padding: 12px 40px; min-width: 180px; box-shadow: 0 10px 20px rgba(197, 160, 89, 0.2);">Save Product</button>
        </div>
    </form>
</div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.admin', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH E:\aries\aakrithi-v1-main\admin\resources\views/admin/products/create.blade.php ENDPATH**/ ?>
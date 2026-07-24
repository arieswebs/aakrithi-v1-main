<?php $__env->startSection('admin_title', 'Edit Category'); ?>

<?php $__env->startSection('admin_content'); ?>
<div class="admin-table-container" style="max-width: 800px; margin: 0 auto; padding: 2.5rem;">
    <form action="<?php echo e(route('admin.categories.update', $category->id)); ?>" method="POST" enctype="multipart/form-data">
        <?php echo csrf_field(); ?>
        <?php echo method_field('PUT'); ?>
        <div class="form-group" style="margin-bottom: 2rem;">
            <label>Category Name</label>
            <input type="text" name="name" value="<?php echo e($category->name); ?>" required>
        </div>

        <div class="form-group" style="margin-bottom: 2rem;">
            <label>Thumbnail Image (Keep empty to stay same)</label>
            <input type="file" name="image" accept="image/*">
            <?php if($category->image): ?>
            <img src="<?php echo e($category->image); ?>" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px; margin-top: 1rem;">
            <?php endif; ?>
        </div>

        <div class="form-group" style="margin-bottom: 2rem;">
            <label>Description</label>
            <textarea name="description" rows="5"><?php echo e($category->description); ?></textarea>
        </div>

        <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 3rem; padding-bottom: 2rem;">
            <a href="<?php echo e(route('admin.categories.index')); ?>" class="admin-nav-link" style="margin: 0; background: rgba(255,255,255,0.05); min-width: 120px; justify-content: center;">Cancel</a>
            <button type="submit" class="btn-auth" style="margin: 0; padding: 12px 40px; min-width: 180px; box-shadow: 0 10px 20px rgba(197, 160, 89, 0.2);">Update Category</button>
        </div>
    </form>
</div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.admin', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH E:\aries\aakrithi-v1-main\admin\resources\views/admin/categories/edit.blade.php ENDPATH**/ ?>
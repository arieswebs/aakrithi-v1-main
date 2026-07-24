<?php $__env->startSection('admin_title', 'Category Management'); ?>

<?php $__env->startSection('admin_content'); ?>
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
    <p style="opacity: 0.7;">Organize your collections into logical categories.</p>
    <a href="<?php echo e(route('admin.categories.create')); ?>" class="btn-dark" style="padding: 10px 20px; font-size: 0.9rem; text-decoration: none; background: var(--color-accent); color: #072821; border-radius: 8px; font-weight: 600;">+ Add New Category</a>
</div>

<div class="admin-table-container">
    <table class="admin-table">
        <thead>
            <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php $__currentLoopData = $categories; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $category): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <tr>
                <td>
                    <?php if($category->image): ?>
                    <img src="<?php echo e($category->image); ?>" style="width: 40px; height: 40px; border-radius: 6px; object-fit: cover;">
                    <?php else: ?>
                    <div style="width: 40px; height: 40px; background: rgba(255,255,255,0.05); border-radius: 6px; display: flex; align-items: center; justify-content: center;">
                        <i data-lucide="image" style="width: 20px; opacity: 0.3;"></i>
                    </div>
                    <?php endif; ?>
                </td>
                <td style="font-weight: 600;"><?php echo e($category->name); ?></td>
                <td><?php echo e($category->slug); ?></td>
                <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"><?php echo e($category->description); ?></td>
                <td>
                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                        <a href="<?php echo e(route('admin.categories.edit', $category->id)); ?>" style="color: var(--color-accent); text-decoration: none;" title="Edit">
                            <i data-lucide="edit-3" style="width: 18px;"></i>
                        </a>
                        <form id="delete-form-<?php echo e($category->id); ?>" action="<?php echo e(route('admin.categories.destroy', $category->id)); ?>" method="POST" style="display: none;">
                            <?php echo csrf_field(); ?>
                            <?php echo method_field('DELETE'); ?>
                        </form>
                        <button type="button" onclick="confirmDelete('<?php echo e($category->id); ?>')" style="background: none; border: none; color: #ff4d4f; cursor: pointer; padding: 0;" title="Delete">
                            <i data-lucide="trash-2" style="width: 18px;"></i>
                        </button>
                    </div>
                </td>
            </tr>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </tbody>
    </table>
    <div style="padding: 1rem;">
        <?php echo e($categories->links()); ?>

    </div>
</div>

<script>
function confirmDelete(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "Deleting this category might affect products linked to it.",
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

<?php echo $__env->make('layouts.admin', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH E:\aries\aakrithi-v1-main\admin\resources\views/admin/categories/index.blade.php ENDPATH**/ ?>
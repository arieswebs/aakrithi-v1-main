<?php $__env->startSection('admin_title', 'User Management'); ?>

<?php $__env->startSection('admin_content'); ?>
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
    <p style="opacity: 0.7;">View and manage your registered customers.</p>
</div>

<div class="admin-table-container">
    <table class="admin-table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Registered At</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php $__currentLoopData = $users; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $user): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <tr>
                <td>#<?php echo e($user->id); ?></td>
                <td style="font-weight: 600;"><?php echo e($user->name); ?></td>
                <td><?php echo e($user->email); ?></td>
                <td>
                    <span class="admin-badge <?php echo e($user->is_admin ? 'badge-accent' : 'badge-green'); ?>" style="<?php echo e($user->is_admin ? 'background: rgba(197, 160, 89, 0.1); color: #C5A059; border: 1px solid rgba(197, 160, 89, 0.2);' : ''); ?>">
                        <?php echo e($user->is_admin ? 'Admin' : 'Customer'); ?>

                    </span>
                </td>
                <td><?php echo e($user->created_at->format('M d, Y')); ?></td>
                <td>
                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                        <a href="mailto:<?php echo e($user->email); ?>" style="color: var(--color-accent); text-decoration: none;" title="Email User">
                            <i data-lucide="mail" style="width: 18px;"></i>
                        </a>
                        <?php if($user->id !== auth()->id()): ?>
                        <form id="delete-user-form-<?php echo e($user->id); ?>" action="<?php echo e(route('admin.users.destroy', $user->id)); ?>" method="POST" style="display: none;">
                            <?php echo csrf_field(); ?>
                            <?php echo method_field('DELETE'); ?>
                        </form>
                        <button type="button" onclick="confirmUserDelete('<?php echo e($user->id); ?>')" style="background: none; border: none; color: #ff4d4f; cursor: pointer; padding: 0;" title="Delete User">
                            <i data-lucide="trash-2" style="width: 18px;"></i>
                        </button>
                        <?php endif; ?>
                    </div>
                </td>
            </tr>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </tbody>
    </table>
    <div style="padding: 1rem;">
        <?php echo e($users->links()); ?>

    </div>
</div>

<script>
function confirmUserDelete(id) {
    Swal.fire({
        title: 'Delete User?',
        text: "This will permanently remove the user's account and history.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ff4d4f',
        cancelButtonColor: '#C5A059',
        confirmButtonText: 'Yes, delete!',
        background: '#072821',
        color: '#FEFEE3',
        backdrop: `rgba(7, 40, 33, 0.8)`
    }).then((result) => {
        if (result.isConfirmed) {
            document.getElementById('delete-user-form-' + id).submit();
        }
    })
}
</script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.admin', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH E:\aries\aakrithi-v1-main\admin\resources\views/admin/users/index.blade.php ENDPATH**/ ?>
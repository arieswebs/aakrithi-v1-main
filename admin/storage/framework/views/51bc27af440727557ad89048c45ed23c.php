<?php $__env->startSection('admin_title', 'Inquiries & Requests'); ?>

<?php $__env->startSection('admin_content'); ?>
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
    <p style="opacity: 0.7;">Manage customer feedback, inquiries, and custom bulk requests.</p>
</div>

<div class="admin-table-container">
    <table class="admin-table">
        <thead>
            <tr>
                <th>Type</th>
                <th>Sender</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php $__currentLoopData = $messages; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $msg): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <tr style="<?php echo e(!$msg->is_read ? 'background: rgba(197, 160, 89, 0.05);' : ''); ?>">
                <td>
                    <span class="admin-badge" style="background: <?php echo e($msg->type === 'bulk_request' ? 'rgba(197, 160, 89, 0.2)' : 'rgba(255,255,255,0.05)'); ?>; color: <?php echo e($msg->type === 'bulk_request' ? '#C5A059' : 'inherit'); ?>;">
                        <?php echo e(ucfirst(str_replace('_', ' ', $msg->type))); ?>

                    </span>
                </td>
                <td>
                    <div style="font-weight: 600;"><?php echo e($msg->name); ?></div>
                    <div style="font-size: 0.75rem; opacity: 0.7;"><?php echo e($msg->email); ?></div>
                </td>
                <td><?php echo e($msg->subject); ?></td>
                <td style="max-width: 300px;">
                    <div style="font-size: 0.85rem; line-height: 1.4; opacity: 0.9;">
                        <?php echo e(Str::limit($msg->message, 100)); ?>

                    </div>
                </td>
                <td><?php echo e($msg->created_at->format('M d, H:i')); ?></td>
                <td>
                    <span class="admin-badge <?php echo e($msg->is_read ? 'badge-green' : ''); ?>" style="<?php echo e(!$msg->is_read ? 'background: #ff4d4f; color: white;' : ''); ?>">
                        <?php echo e($msg->is_read ? 'Read' : 'New'); ?>

                    </span>
                </td>
                <td>
                    <div style="display: flex; gap: 0.5rem;">
                        <form action="<?php echo e(route('admin.messages.toggle-read', $msg->id)); ?>" method="POST">
                            <?php echo csrf_field(); ?>
                            <button type="submit" class="admin-nav-link" style="margin: 0; padding: 5px; height: auto; background: rgba(255,255,255,0.05);" title="<?php echo e($msg->is_read ? 'Mark as Unread' : 'Mark as Read'); ?>">
                                <i data-lucide="<?php echo e($msg->is_read ? 'eye-off' : 'eye'); ?>" style="width: 16px;"></i>
                            </button>
                        </form>
                        <a href="mailto:<?php echo e($msg->email); ?>?subject=Re: <?php echo e($msg->subject); ?>" class="admin-nav-link" style="margin: 0; padding: 5px; height: auto; background: rgba(197, 160, 89, 0.1); color: #C5A059;" title="Reply">
                            <i data-lucide="reply" style="width: 16px;"></i>
                        </a>
                    </div>
                </td>
            </tr>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </tbody>
    </table>
    <div style="padding: 1rem;">
        <?php echo e($messages->links()); ?>

    </div>
</div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.admin', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH E:\aries\aakrithi-v1-main\admin\resources\views/admin/messages/index.blade.php ENDPATH**/ ?>
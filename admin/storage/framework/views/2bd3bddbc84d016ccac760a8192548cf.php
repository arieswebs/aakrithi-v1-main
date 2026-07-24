<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login | Aakrithi</title>
    <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">
    <link rel="stylesheet" href="<?php echo e(env('STORE_URL', 'https://www.aakrithiclothings.in')); ?>/css/app.css">
    <style>
        body {
            background: #051612;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            font-family: 'Inter', sans-serif;
        }
        .auth-container {
            width: 100%;
            max-width: 450px;
            padding: 2rem;
        }
        .auth-card {
            background: #072821;
            padding: 3rem;
            border-radius: 20px;
            border: 1px solid rgba(197, 160, 89, 0.1);
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        .auth-logo {
            text-align: center;
            font-size: 2rem;
            font-weight: 700;
            color: #C5A059;
            letter-spacing: 4px;
            margin-bottom: 2rem;
        }
        .form-group {
            margin-bottom: 1.5rem;
        }
        .form-group label {
            display: block;
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 0.5rem;
            opacity: 0.7;
        }
        .form-group input {
            width: 100%;
            padding: 12px 15px;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(197, 160, 89, 0.2);
            border-radius: 8px;
            color: #FEFEE3;
            outline: none;
            transition: all 0.3s;
        }
        .form-group input:focus {
            border-color: #C5A059;
            background: rgba(255,255,255,0.08);
        }
        .btn-auth {
            width: 100%;
            padding: 14px;
            background: #C5A059;
            color: #072821;
            border: none;
            border-radius: 8px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
            cursor: pointer;
            transition: all 0.3s;
            margin-top: 1rem;
        }
        .btn-auth:hover {
            background: #D4B478;
            transform: translateY(-2px);
        }
        .auth-footer {
            margin-top: 2rem;
            text-align: center;
            font-size: 0.85rem;
            opacity: 0.6;
        }
        .auth-footer a {
            color: #C5A059;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="auth-container">
        <div class="auth-logo">AAKRITHI</div>
        <div class="auth-card">
            <?php echo $__env->yieldContent('content'); ?>
        </div>
        <div class="auth-footer">
            &copy; <?php echo e(date('Y')); ?> Aakrithi Admin Portal. All rights reserved.
        </div>
    </div>
</body>
</html>
<?php /**PATH E:\Aries\aakrithi-v1-main\admin\resources\views/layouts/auth.blade.php ENDPATH**/ ?>
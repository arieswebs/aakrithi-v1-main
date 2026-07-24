<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

if (isset($_SERVER['VERCEL_URL']) || isset($_ENV['VERCEL_URL'])) {
    $storagePath = '/tmp/storage';
    if (!is_dir($storagePath . '/framework/views')) {
        mkdir($storagePath . '/framework/views', 0755, true);
    }
    putenv("LARAVEL_STORAGE_PATH=$storagePath");
    $_ENV['LARAVEL_STORAGE_PATH'] = $storagePath;
    $_SERVER['LARAVEL_STORAGE_PATH'] = $storagePath;
}

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->trustProxies(at: '*');
        $middleware->redirectTo(
            guests: '/account',
            users: '/'
        );
        $middleware->alias([
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })
    ->registered(function ($app) {
        if (isset($_SERVER['VERCEL_URL'])) {
            $app->useStoragePath('/tmp/storage');
            $app->useBootstrapPath('/tmp/storage/bootstrap');
            
            // Re-register the package manifest to use the new writable path
            $app->singleton(\Illuminate\Foundation\PackageManifest::class, function () use ($app) {
                return new \Illuminate\Foundation\PackageManifest(
                    new \Illuminate\Filesystem\Filesystem, 
                    $app->basePath(), 
                    $app->getCachedPackagesPath()
                );
            });

            // Force logging to stderr and use cookie sessions for Vercel
            config([
                'logging.default' => 'stderr',
                'view.compiled' => '/tmp/storage/framework/views',
                'cache.stores.file.path' => '/tmp/storage/framework/cache/data',
                'session.driver' => 'cookie',
                'session.secure' => true,
                'session.same_site' => 'lax',
                'session.files' => '/tmp/storage/framework/sessions',
            ]);
        }
    })
    ->create();

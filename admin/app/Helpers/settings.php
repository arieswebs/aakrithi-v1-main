<?php

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;

if (!function_exists('setting')) {
    function setting($key, $default = null)
    {
        return Cache::rememberForever('setting.' . $key, function () use ($key, $default) {
            $setting = Setting::where('key', $key)->first();
            
            // Check DB first, then ENV, then default
            return $setting ? $setting->value : env(strtoupper($key), $default);
        });
    }
}

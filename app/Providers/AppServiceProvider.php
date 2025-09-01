<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Override asset URL generation for MAMP subdirectory
        if (app()->environment('local')) {
            // Force Vite to use the correct base URL
            Vite::useBuildDirectory('build');

            // Override the asset URL generation
            Vite::macro('asset', function ($path) {
                return 'http://localhost:8888/pmec2/public/build/' . $path;
            });
        }
    }
}

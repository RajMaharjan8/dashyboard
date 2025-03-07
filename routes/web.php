<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use  App\Http\Controllers\Admin\BlogController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');


Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('blog/paginate',[BlogController::class, 'paginate'])->name('blog.paginate');
    Route::resource('blog', BlogController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

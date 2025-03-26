<?php

use App\Http\Controllers\Admin\VideoController;
use App\Http\Controllers\Admin\HelperController;
use App\Http\Controllers\Admin\LetterController;

use App\Http\Controllers\Admin\UserController;

use App\Http\Controllers\Admin\RoleController;

use App\Http\Controllers\Admin\PermissionController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use  App\Http\Controllers\Admin\BlogController;
use App\Http\Controllers\Front\BlogController as FrontBlogController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/articles', [FrontBlogController::class, 'index'])->name('blog.index');

Route::middleware(['auth'])->prefix('admin')->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('blog/paginate', [BlogController::class, 'paginate'])->name('blog.paginate');
    Route::resource('blog', BlogController::class);

    Route::get('permissions/paginate', [PermissionController::class, 'paginate'])->name('permissions.paginate');
    Route::resource('permissions', PermissionController::class);

    Route::get('roles/paginate', [RoleController::class, 'paginate'])->name('roles.paginate');
    Route::resource('roles', RoleController::class);

    Route::get('users/paginate', [UserController::class, 'paginate'])->name('users.paginate');
    Route::resource('users', UserController::class);

});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

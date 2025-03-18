<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Models\Admin\Blog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlogController extends Controller
{
    private $blog;
    public function __construct(Blog $blog){
        $this->blog = $blog;
    }

    public function index(){
        return Inertia::render('front/blogs/list');
    }
}

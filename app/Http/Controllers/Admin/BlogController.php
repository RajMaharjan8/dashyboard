<?php

namespace App\Http\Controllers\Admin;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreBlogRequest;
use App\Models\Admin\Blog;
use App\CrudTrait;
use App\Helpers\FileUploadHelper;

class BlogController extends Controller
{
    use CrudTrait;

    public $model;
    public $fileuploader;
    public $route;
    public $store_rules;

    public function __construct(Blog $blog, FileUploadHelper $fileuploader){
        $this->model = $blog;
        $this->fileuploader = $fileuploader;
        $this->route = 'blog.index';

        $this->store_rules = StoreBlogRequest::class;
    }

    public function index(){
        return Inertia::render('blogs/list');
    }

    public function create(){
        return Inertia::render('blogs/create');
    }

    public function edit($id){
        $blog = $this->model->findOrFail($id);
        if(isset($blog->media)){
            $blog->media = env('APP_URL').$blog->media;
        }
        return Inertia::render('blogs/edit',[
            'blog'=> $blog
        ]);
    }

}

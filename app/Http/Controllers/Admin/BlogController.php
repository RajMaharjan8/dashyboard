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


    protected $index_path, $store_rules, $route, $fileuploader, $model, $form_path;

    public function __construct(Blog $model, FileUploadHelper $fileuploader){
        $this->model = $model;
        $this->fileuploader = $fileuploader;
        $this->route = 'blog.index';
        $this->index_path = 'blogs/list';
        $this->form_path = 'blogs/create';
        $this->store_rules = StoreBlogRequest::class;
    }

 

}

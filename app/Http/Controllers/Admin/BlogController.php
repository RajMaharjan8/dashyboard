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

    // public $model;

    public function __construct(Blog $blog, FileUploadHelper $fileuploader){
        $this->model = $blog;
        $this->fileuploader = $fileuploader;
        $this->route = 'blog.index';

        $this->store_rules = StoreBlogRequest::class;
    }

    public function index(){
        return Inertia::render('blogs/list');
    }

    // public function paginate(Request $request){
    //     $title = $request->get('title');
    //     $blogs = $this->blog;
    //     if(isset($title)){
    //         $blogs = $this->blog->where('title', 'ilike', '%'. $title .'%');
    //     }
    //     $data = $blogs->orderByDesc('id')->paginate(2);
    //     return response()->json($data);
    // }

    public function create(){
        return Inertia::render('blogs/create');
    }

    // public function store(StoreBlogRequest $request){
    //     $image = $request->file("blog_image");
    //     $blog_title = $request->get('blog_title');
    //     $blog_description = $request->get('blog_description');

    //     if($image){
    //         $image_name = time().'.'. $image->getClientOriginalExtension();
    //         $image_path = $image->storeAs('public/blog_images', $image_name);
    //         $blog_image = str_replace('public/', 'storage/', $image_path);
    //     }

    //     $this->blog->create([
    //         'blog_title' => $blog_title,
    //         'blog_description'=> $blog_description,
    //         'blog_image'=> $blog_image
    //     ]);

    //     return redirect()->route('blog.index')->with('toasterInfo', [
    //         'show' => true,
    //         'type' => 'success',
    //         'title' => 'Success',
    //         'subtitle' => 'Blog has been created successfully!'
    //     ]);;

    // }
}

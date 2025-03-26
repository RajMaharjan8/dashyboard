<?php

namespace App\Http\Controllers\Admin;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StorePermissionRequest;
use App\CrudTrait;
use App\Helpers\FileUploadHelper;
use App\Http\Requests\UpdatePermissionRequest;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    use CrudTrait;


    protected $index_path, $store_rules, $route, $fileuploader, $model, $form_path, $update_rules;


    public function __construct(Permission $model, FileUploadHelper $fileuploader){
        $this->model = $model;
        $this->fileuploader = $fileuploader;
        $this->route = 'permissions.index';
        $this->index_path = 'admin/permissions/list';
        $this->form_path = 'admin/permissions/edit-add';
        $this->store_rules = StorePermissionRequest::class;
        $this->update_rules = UpdatePermissionRequest::class;

    }

    public function index(){
        return Inertia::render($this->index_path);

    }
    public function paginate(Request $request)
    {
        $title = $request->get('name');
        $model = $this->model;
        if (isset($title)) {
            $model = $this->model->where('name', 'like', '%' . $title . '%');
        }
        $data = $model->orderByDesc('id')->paginate(5);
        return response()->json($data);
    }
 

}

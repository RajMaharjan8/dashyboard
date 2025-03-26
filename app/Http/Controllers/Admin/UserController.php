<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\UpdateUserRequest;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreUserRequest;
use App\Models\User;
use App\CrudTrait;
use App\Helpers\FileUploadHelper;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    use CrudTrait;


    protected $index_path, $store_rules, $route, $fileuploader, $model, $form_path, $role, $update_rules, $user;
    public function __construct(User $model, FileUploadHelper $fileuploader, Role $role, User $user)
    {
        $this->model = $model;
        $this->fileuploader = $fileuploader;
        $this->route = 'users.index';
        $this->index_path = 'admin/users/list';
        $this->form_path = 'admin/users/edit-add';
        $this->store_rules = StoreUserRequest::class;
        $this->update_rules = UpdateUserRequest::class;
        $this->role = $role;
        $this->user = $user;
    }

    public function index()
    {
        $admin = $this->user->whereHas('roles', function ($query) {
            $query->where('roles.name', 'Admin');
        })->pluck('id')->toArray();
        $user = Auth::user();

        if (isset($admin)) {
            if (in_array($user->id, $admin)) {
                return Inertia::render($this->index_path);
            }
        }

        if ($user->can('Edit Users') && $user->can('Add Users') && $user->can('Delete Users') && $user->can('Update Users')) {
            return Inertia::render($this->index_path);
        }

        return Inertia::render('noPermission');
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

    public function create()
    {
        $roles = $this->role->select('id', 'name')->get()->toArray();
        return Inertia::render($this->form_path, [
            'roles' => $roles ?? []
        ]);
    }

    public function edit($id)
    {
        $model = $this->model->findOrFail($id);
        $assigned_roles = $model->roles->isNotEmpty() ? $model->roles->toQuery()->orderBy('created_at', 'desc')->pluck('name') : "";
        $model->role = $assigned_roles;
        $roles = $this->role->select('id', 'name')->get()->toArray();
        if (isset($model->media)) {
            $model->media = env('APP_URL') . $model->media;
        }
        return Inertia::render($this->form_path, [
            'model' => $model,
            'roles' => $roles ?? []
        ]);
    }
}

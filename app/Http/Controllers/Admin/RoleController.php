<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreRoleRequest;
use App\CrudTrait;
use App\Helpers\FileUploadHelper;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Exceptions\RoleAlreadyExists;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleController extends Controller
{
    use CrudTrait;


    protected $index_path, $store_rules, $route, $fileuploader, $model, $form_path, $permission, $user;

    public function __construct(Role $model, FileUploadHelper $fileuploader, Permission $permission, User $user)
    {
        $this->model = $model;
        $this->fileuploader = $fileuploader;
        $this->route = 'roles.index';
        $this->index_path = 'admin/roles/list';
        $this->form_path = 'admin/roles/edit-add';
        $this->store_rules = StoreRoleRequest::class;
        $this->permission = $permission;
        $this->user = $user;
    }

    public function create()
    {
        $permissions = $this->permission->all()->toArray();
        return Inertia::render($this->form_path, [
            'permissions' => $permissions
        ]);
    }

    public function edit($id)
    {
        $model = $this->model->findOrFail($id);
        $selected_permissions = $model->permissions->pluck('id')->toArray() ?? [];
        $permissions = $this->permission->all()->toArray();
        $model->permission = $selected_permissions;
        return Inertia::render($this->form_path, [
            'model' => $model,
            'permissions'=> $permissions
        ]);
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

        if ($user->can('Edit Roles') && $user->can('Add Roles') && $user->can('Delete Roles') && $user->can('Update Roles')) {
            return Inertia::render($this->index_path);
        }

        return Inertia::render('noPermission');
    }
    public static function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role = \Spatie\Permission\Models\Role::create([
            'name' => $validated['name'],
        ]);

        if (!empty($validated['permissions'])) {
            $permissions = Permission::whereIn('id', $validated['permissions'])->get();
            $role->syncPermissions($permissions);
        }

        return redirect()->route('roles.index')->with('toasterInfo', [
            'show' => true,
            'type' => 'success',
            'title' => 'Success',
            'subtitle' => 'Roles has been created successfully!'
        ]);
    }

    public static function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role = \Spatie\Permission\Models\Role::findOrFail($id);
        $role->update([
            'name'=> $validated['name'],
        ]);

        if (!empty($validated['permissions'])) {
            $permissions = Permission::whereIn('id', $validated['permissions'])->get();
            $role->syncPermissions($permissions);
        }

        return redirect()->route('roles.index')->with('toasterInfo', [
            'show' => true,
            'type' => 'success',
            'title' => 'Success',
            'subtitle' => 'Roles has been updated successfully!'
        ]);
    }


   
}

<?php

namespace App;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

trait CrudTrait
{


    public function getPermissions()
    {
        $permission_model = ucwords($this->model->getTable());
        $permissions = [
            'Edit ' . $permission_model,
            'Add ' . $permission_model,
            'Update ' . $permission_model,
            'Delete ' . $permission_model
        ];
        return $permissions;
    }

    public function checkPermissions($permissions)
    {
        $user = Auth::user();

        if (!$user) {
            return Inertia::render('noPermission');
        }

        foreach ($permissions as $permission) {
            if ($user->can($permission)) {
                return true;
            }
        }
        return Inertia::render('noPermission');
    }

    public function index()
    {
        $permissions = $this->getPermissions();
        $permissionCheck = $this->checkPermissions($permissions);

        if ($permissionCheck === true) {
            return Inertia::render($this->index_path);
        }

        // If we get here, checkPermissions returned the noPermission render
        return $permissionCheck;
    }

    public function create()
    {
        return Inertia::render($this->form_path);
    }

    public function edit($id)
    {
        $model = $this->model->findOrFail($id);
        if (isset($model->media)) {
            $model->media = env('APP_URL') . $model->media;
        }
        return Inertia::render($this->form_path, [
            'model' => $model
        ]);
    }


    public function store(Request $request)
    {
        $request_class = $this->store_rules;
        $validate_request = app($request_class);
        $validator = validator($request->all(), $validate_request->rules());
        $validated = $validator->validated();

        if ($request->hasFile('media')) {
            $file = $request->file('media');
            $file_upload = $this->fileuploader->storeFile($file, $this->model);
            if ($file_upload) {
                $validated['media'] = $file_upload;
            } else {
                $validated['media'] = null;
            }
        }

        $store_data = $this->model->create($validated);

        return redirect()->route($this->route)->with('toasterInfo', [
            'show' => true,
            'type' => 'success',
            'title' => 'Success',
            'subtitle' => 'Data has been created successfully!'
        ]);
    }

    public function update(Request $request, $id)
    {
        $request_class = $this->update_rules;
        $validate_request = app($request_class);
        $validator = validator($request->all(), $validate_request->rules());
        $validated = $validator->validated();



        if ($request->hasFile('media')) {
            $file = $request->file('media');
            $file_upload = $this->fileuploader->storeFile($file, $this->model);
            if ($file_upload) {
                $validated['media'] = $file_upload;
            } else {
                $validated['media'] = null;
            }
        }
        $model = $this->model->findOrFail($id);
        $model->update($validated);

        if (isset($validated['role'])) {
            $model->syncRoles($validated['role']);
        }
        if ($model->save()) {


            return redirect()->route($this->route)->with('toasterInfo', [
                'show' => true,
                'type' => 'success',
                'title' => 'Success',
                'subtitle' => 'Data has been updated successfully!'
            ]);
        } else {
            return redirect()->back()->with('toasterInfo', [
                'show' => true,
                'type' => 'fail',
                'title' => 'Failed',
                'subtitle' => 'Fail to update the data!'
            ]);
        }
    }

    public function destroy($id)
    {
        $model = $this->model->findOrFail($id);
        $model->delete();
        return redirect()->route($this->route)->with('toasterInfo', [
            'show' => true,
            'type' => 'success',
            'title' => 'Success',
            'subtitle' => 'Deleted Successully!'
        ]);
    }
    public function paginate(Request $request)
    {
        $title = $request->get('title');
        $model = $this->model;
        if (isset($title)) {
            $model = $this->model->where('title', 'like', '%' . $title . '%');
        }
        $data = $model->orderByDesc('id')->paginate(5);
        return response()->json($data);
    }
}

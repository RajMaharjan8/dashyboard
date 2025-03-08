<?php

namespace App;
use Illuminate\Http\Request;

trait CrudTrait
{

    public function store(Request $request){
        $request_class = $this->store_rules;
        $validate_request = app($request_class);
        $validator = validator($request->all(), $validate_request->rules());
        $validated = $validator->validated();

        if($request->hasFile('media')){
            $file = $request->file('media');
            $file_upload = $this->fileuploader->storeFile($file, $this->model);
            if($file_upload){
                $validated['media'] = $file_upload;
            }else{
                $validated['media'] = null;
            }
        }

        $store_data = $this->model->create($validated);

        return redirect()->route($this->route)->with('toasterInfo', [
                    'show' => true,
                    'type' => 'success',
                    'title' => 'Success',
                    'subtitle' => 'Blog has been created successfully!'
                ]);

    }

    public function update(Request $request){

    }

    public function paginate(Request $request){
        $title = $request->get('title');
        $model = $this->model;
        if(isset($title)){
            $model = $this->model->where('title', 'ilike', '%'. $title .'%');
        }
        $data = $model->orderByDesc('id')->paginate(5);
        return response()->json($data);
    }


}

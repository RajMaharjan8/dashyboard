<?php

namespace App;
use App\Helpers\FileUploadHelper;
use Illuminate\Http\Request;

trait CrudTrait
{

    public function store(){
        // $validate = $request->validate($this->store_rules);

        $request= $this->store_rules->validated();
        dd($request);
        $file = $request->hasFile('media');

        if($file){
            $file = $request->file('media');
            $file_upload = $this->fileuploader->storeFile($file, $this->model);
            if($file_upload){
                $request->media = $file_upload;
            }else{
                $request->media = null;
            }

        }

        $store_data = $this->model->create($validate);

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
        $data = $model->orderByDesc('id')->paginate(10);
        return response()->json($data);
    }


}

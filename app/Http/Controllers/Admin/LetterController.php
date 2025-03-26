<?php

namespace App\Http\Controllers\Admin;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreLetterRequest;
use App\Models\Letter;
use App\CrudTrait;
use App\Helpers\FileUploadHelper;

class LetterController extends Controller
{
    use CrudTrait;


    protected $index_path, $store_rules, $route, $fileuploader, $model, $form_path;

    public function __construct(Letter $model, FileUploadHelper $fileuploader){
        $this->model = $model;
        $this->fileuploader = $fileuploader;
        $this->route = 'model.index';
        $this->index_path = 'model/list';
        $this->form_path = 'model/create';
        $this->store_rules = StoreLetterRequest::class;
    }

 

}

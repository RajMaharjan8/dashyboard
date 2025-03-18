<?php

namespace App\Helpers;
use Illuminate\Support\Str;

class FileUploadHelper {
    public function storeFile($file, $model){

        $file_name = time().'.'. $file->getClientOriginalExtension();
        $destinationPath = public_path(Str::plural(strtolower(class_basename($model))));
        $file->move($destinationPath, $file_name);
        $file_path = Str::plural(strtolower(class_basename($model))) . '/' . $file_name;
        // $file_path = $file->storeAs(Str::plural(strtolower(class_basename($model))).'', $file_name);
        $file_actual_path = str_replace('public/', '/storage/', $file_path);
        return $file_actual_path;
    }
}

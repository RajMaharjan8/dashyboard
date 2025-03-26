<?php

namespace App\Models\Admin;

use App\Models\BlogCategory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Blog extends Model
{
    // use SoftDeletes;
    protected $table = "blogs";
    public $fillable = ["blog_title", "blog_description", "media", "category_id", "meta_title", "meta_description", "meta_keywords"];

 
}

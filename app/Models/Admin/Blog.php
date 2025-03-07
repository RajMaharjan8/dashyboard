<?php

namespace App\Models\Admin;

use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    protected $table = "blogs";
    public $fillable = ["blog_title", "blog_description", "blog_image", "category_id", "meta_title", "meta_description", "meta_keywords"];
}

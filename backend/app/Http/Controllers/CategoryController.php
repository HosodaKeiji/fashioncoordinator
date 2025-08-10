<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Resources\CategoryResource;

class CategoryController extends Controller {

    // 一覧取得
    public function index() {
        $categories = Category::all();
        return CategoryResource::collection($categories);
    }

    // 登録
    public function store(Request $request) {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
        ]);

        $category = Category::create([
            'name' => $request->name,
        ]);

        return new CategoryResource($category);
    }
}
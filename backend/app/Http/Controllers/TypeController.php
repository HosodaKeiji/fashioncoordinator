<?php

namespace App\Http\Controllers;

use App\Models\Type;
use Illuminate\Http\Request;
use App\Http\Resources\TypeResource;

class TypeController extends Controller {

    // 一覧取得
    public function index() {
        $types = Type::all();
        return TypeResource::collection($types);
    }

    // 登録
    public function store(Request $request) {
        $request->validate([
            'name' => 'required|string|max:255|unique:types,name',
        ]);

        $type = Type::create([
            'name' => $request->name,
        ]);

        return new TypeResource($type);
    }
}
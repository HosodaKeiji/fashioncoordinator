<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\ClothesResource;
use Illuminate\Support\Facades\Auth;
use App\Models\Clothes;
use Illuminate\Support\Facades\Log;

class ClothesController extends Controller
{
    // 一覧取得
    public function index() {
        $clothes = Clothes::where('user_id', Auth::id())
        -> with(['category', 'type'])
        -> get();

        return ClothesResource::collection($clothes);
    }

    // 登録
    public function store(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type_id' => 'required|exists:types,id',
            'category_id' => 'required|exists:categories,id',
            'color' => 'nullable|string|max:50',
            'season' => 'nullable|array',
        ]);

        $validated['user_id'] = Auth::id();

        $clothes = Clothes::create($validated);

        return new ClothesResource($clothes->load(['category', 'type']));
    }

     // 詳細取得
    public function show(Clothes $clothing)
    {
        $this->authorizeOwner($clothing);

        return new ClothesResource($clothing->load(['category', 'type']));
    }

    // 更新
    public function update(Request $request, $id)
    {
        // 自分の服だけを取得。なければ404
        $clothing = Clothes::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $validated = $request->validate([
            'name'        => 'sometimes|required|string|max:255',
            'type_id'     => 'sometimes|required|exists:types,id',
            'category_id' => 'sometimes|required|exists:categories,id',
            'color'       => 'nullable|string|max:50',
            'season'      => 'nullable|array',
        ]);

        $clothing->update($validated);

        return new ClothesResource($clothing->load(['category', 'type']));
    }


    // 削除
    public function destroy($id)
    {
        $clothing = Clothes::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $clothing->delete();

        return response()->json(['message' => 'Deleted successfully']);
    }

    // 自分の服か確認
    private function authorizeOwner(Clothes $clothing)
    {
        if ($clothing->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }
    }   

}

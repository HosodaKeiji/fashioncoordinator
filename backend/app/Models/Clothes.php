<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Clothes extends Model
{
    protected $fillable = [
        'user_id',
        'type_id',
        'category_id',
        'name',
        'type',
        'category',
        'color',
        'season',
    ];

    protected $casts = [
        'season' => 'array', // JSON⇔配列を自動変換
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function type()
    {
        return $this->belongsTo(Type::class);
    }
}

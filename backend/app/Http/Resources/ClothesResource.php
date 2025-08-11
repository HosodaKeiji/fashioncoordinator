<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClothesResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name'       => $this->name,
            'type_id'    => $this->type_id,
            'type'       => $this->type?->name,
            'category_id'=> $this->category_id,
            'category'   => $this->category?->name,
            'color'      => $this->color,
            'season'     => $this->season,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

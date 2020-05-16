<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $table = 'posts';

    protected $fillable = [
        'group_id',
        'post_id',
    ];

    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    public function counters()
    {
        return $this->hasMany(Counter::class);
    }

    public function getGroupIdAttribute($id)
    {
        return Group::find($id)->group_id;
    }
}

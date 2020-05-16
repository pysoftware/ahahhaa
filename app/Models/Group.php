<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    public $timestamps = false;
    protected $table = 'groups';

    protected $fillable = [
        'group_id'
    ];

    public function posts()
    {
        return $this->hasMany(Post::class);
    }
}

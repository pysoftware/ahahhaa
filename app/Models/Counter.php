<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class Counter extends Model
{
    protected $table = 'counters';

    protected $fillable = [
        'post_id',
        'likes_count',
        'views_count',
    ];

    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}

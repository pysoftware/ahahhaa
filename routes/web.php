<?php

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;

Route::group(['namespace' => 'WEB'], function () {
    Route::get('/', 'IndexController@index');
    Route::get('/groups/{groupID}/posts/{postID}', 'IndexController@postAnalysis');
});


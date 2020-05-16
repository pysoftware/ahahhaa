<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::group(['namespace' => 'API'], function () {
    Route::get('groups/{groupId}/posts', 'GroupsAPIController@groupPostsAnalysis')
        ->name('api.groups.posts.analysis');

    Route::get('groups/{groupId}/posts/{postId}', 'GroupsAPIController@groupPostAnalysis')
        ->name('api.groups.post.analysis');

    Route::apiResource('groups', 'GroupsAPIController');
});


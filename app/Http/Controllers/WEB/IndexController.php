<?php

namespace App\Http\Controllers\WEB;

use App\Http\Controllers\Controller;
use JavaScript;

class IndexController extends Controller
{
    public function index()
    {
        return view('search');
    }

    public function postAnalysis($groupID, $postID)
    {
        JavaScript::put([
            'groupID' => $groupID,
            'postID' => $postID
        ]);
        return view('post');
    }
}

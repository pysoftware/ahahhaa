<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateGroupRequest;
use App\Models\Group;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Response;
use App\Constants\VKConstants as VK;

class GroupsAPIController extends Controller
{
    public function index(Request $request)
    {
        $groups = Group::all('group_id');

        return Response::json([
            'success' => true,
            'data' => $groups
        ]);
    }

    public function store(CreateGroupRequest $request)
    {
        $groupID = $request->group_id;
        // Если 0, значит нам прислали имя в uri - надо получить айди
        if ((int)$groupID === 0) {
            $res = json_decode(Http::withHeaders([
                'origin' => 'http://v258027.hosted-by-vdsina.ru',
            ])->get(VK::VK_DEFAULT_URI . VK::VK_METHOD_GET_GROUP_INFO, [
                'v' => VK::VK_VERSION,
                'access_token' => VK::VK_API_ACCESS_TOKEN,
                'group_id' => $groupID,
            ]), true);
            if (!empty($res['error'])) {
                return Response::json([
                    'success' => false,
                    'message' => 'Сообщества с таким именем не существует'
                ]);
            }
            $groupID = $res['response'][0]['id'];
        }
        if (Group::where('group_id', $groupID)->first()) {
            return Response::json([
                'success' => false,
                'message' => 'Такая группа уже находится под наблюдением'
            ]);
        }

        /** @var Group $group */
        $group = Group::create([
            'group_id' => $groupID
        ]);

        return Response::json([
            'success' => true,
            'data' => $group
        ]);
    }

    public function show($groupID)
    {
        // Если 0, значит нам прислали имя в uri - надо получить айди
        if ((int)$groupID === 0) {
            $res = json_decode(Http::withHeaders([
                'origin' => 'http://v258027.hosted-by-vdsina.ru',
            ])->get(VK::VK_DEFAULT_URI . VK::VK_METHOD_GET_GROUP_INFO, [
                'v' => VK::VK_VERSION,
                'access_token' => VK::VK_API_ACCESS_TOKEN,
                'group_id' => $groupID,
            ]), true);
            if (!empty($res['error']) || !$res) {
                return Response::json([
                    'success' => false,
                    'message' => 'Сообщества с таким именем не существует'
                ]);
            }
            $groupID = $res['response'][0]['id'];
        }
        if (!$group = Group::where('group_id', $groupID)->first()) {
            return Response::json([
                'success' => false,
                'message' => 'Информации по данному сообществу не найдено'
            ]);
        }

        return Response::json([
            'success' => true,
            'data' => $group
                ->posts()
                ->get()
                ->toArray()
        ]);
    }

    /**
     * Получение всех постов с группы с анализом
     * @param $groupID
     * @return \Illuminate\Http\JsonResponse
     */
    public function groupPostsAnalysis($groupID)
    {
        // Если 0, значит нам прислали имя в uri - надо получить айди
        if ((int)$groupID === 0) {
            $res = json_decode(Http::withHeaders([
                'origin' => 'http://v258027.hosted-by-vdsina.ru',
            ])->get(VK::VK_DEFAULT_URI . VK::VK_METHOD_GET_GROUP_INFO, [
                'v' => VK::VK_VERSION,
                'access_token' => VK::VK_API_ACCESS_TOKEN,
                'group_id' => $groupID,
            ]), true);
            if (!empty($res['error'])) {
                return Response::json([
                    'success' => false,
                    'message' => 'Сообщества с таким именем не существует'
                ]);
            }
            $groupID = $res['response'][0]['id'];
        }
        if (!$group = Group::where('group_id', $groupID)->first()) {
            return Response::json([
                'success' => false,
                'message' => 'Информации по данному сообществу не найдено'
            ]);
        }

        $posts = $group
            ->posts()
            ->with('counters')
            ->get()
            ->toArray();

        return Response::json([
            'success' => true,
            'data' => $posts
        ]);
    }

    public function groupPostAnalysis($groupID, $postID)
    {
        if ((int)$groupID === 0) {
            $res = json_decode(Http::withHeaders([
                'origin' => 'http://v258027.hosted-by-vdsina.ru',
            ])->get(VK::VK_DEFAULT_URI . VK::VK_METHOD_GET_GROUP_INFO, [
                'v' => VK::VK_VERSION,
                'access_token' => VK::VK_API_ACCESS_TOKEN,
                'group_id' => $groupID,
            ]), true);
            if (!empty($res['error'])) {
                return Response::json([
                    'success' => false,
                    'message' => 'Сообщества с таким именем не существует'
                ]);
            }
            $groupID = $res['response'][0]['id'];
        }
        $group = Group::where('group_id', $groupID)
            ->first();

        if (!$post = Post::with('counters')->where('group_id', $group->id)->where('post_id', $postID)->first()) {
            return Response::json([
                'success' => false,
                'message' => 'Такого поста не найдено.'
            ]);
        }

        return Response::json([
            'success' => true,
            'data' => $post
        ]);
    }
}

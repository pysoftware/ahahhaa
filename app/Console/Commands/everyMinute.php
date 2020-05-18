<?php

namespace App\Console\Commands;

use App\Models\Counter;
use App\Models\Group;
use App\Models\Post;
use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Constants\VKConstants as VK;

class everyMinute extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:test';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        // На сайте есть инупт с группами, которые надо отследить
        // В таблице лежат айдишки каждой из групп, за которыми надо следить
        // Проверка, если группа только что добавлена (ее не существует в таблице) значит создаем
        $groups = Group::all();
        foreach ($groups as $group) {
            // Получение последней записи с стены сообщества
            $res = json_decode(Http::withHeaders([
                'origin' => 'http://v258027.hosted-by-vdsina.ru',
            ])->get(VK::VK_DEFAULT_URI . "wall.get", [
                'v' => VK::VK_VERSION,
                'access_token' => VK::VK_API_ACCESS_TOKEN,
                'owner_id' => -$group->group_id,
                // Прибавляем +1, потому что апишка как последний пост возвращает закрепленку
                'count' => $group->posts()->count() > 0 ? ($group->posts()->count() + 1) : 2,
            ]), true);
            if (empty($res['error'])) {
                $posts = $res['response']['items'];
                foreach ($posts as $post) {
                    if (empty($post['is_pinned'])) {
                        $newPost = Post::updateOrCreate([
                            'post_id' => $post['id'],
                            'group_id' => $group->id
                        ]);
                        $likesCount = !empty($post['likes'])
                            ? $post['likes']['count']
                            : 0;
                        $viewsCount = !empty($post['views'])
                            ? $post['views']['count']
                            : 0;
                        Counter::create([
                            'post_id' => $newPost->id,
                            'likes_count' => $likesCount,
                            'views_count' => $viewsCount,
                        ]);
                    }
                }
            }
        }
    }
}

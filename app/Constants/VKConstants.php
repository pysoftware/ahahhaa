<?php


namespace App\Constants;


final class VKConstants
{
    const PROXY_URI = 'https://cors-anywhere.herokuapp.com/';
    const VK_DEFAULT_URI = self::PROXY_URI . 'https://api.vk.com/method/';

    const VK_API_ACCESS_TOKEN = '7a5bb9127a5bb9127a5bb912b07a2a362377a5b7a5bb91224f0ba1ceacbef1cf9e473bf';
    const VK_VERSION = '5.103';

    const VK_METHOD_GET_GROUP_INFO = 'groups.getById';

}

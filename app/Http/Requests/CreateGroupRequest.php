<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateGroupRequest extends BaseAPIRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'group_id' => 'required'
        ];
    }

    public function messages()
    {
        return [
            'group_id.required' => 'ID группы обязательное поле',
        ];
    }
}

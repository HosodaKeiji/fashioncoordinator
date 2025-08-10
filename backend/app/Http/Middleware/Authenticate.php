<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    protected function redirectTo($request)
    {
        // APIリクエストのときはnull（リダイレクトしない）
        if ($request->expectsJson()) {
            return null;
        }

        // 通常のリクエストならloginルートにリダイレクト
        return route('login');  // ここが問題なので、もしloginルートがなければnullにするか作成する
    }
}

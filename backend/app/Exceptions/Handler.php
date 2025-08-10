<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Illuminate\Auth\AuthenticationException;

class Handler extends ExceptionHandler
{
    // 既存のコード ...

    /**
     * 未認証時のレスポンスをカスタマイズ
     */
    protected function unauthenticated($request, AuthenticationException $exception)
    {
        if ($request->expectsJson()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // API以外の未認証時のリダイレクトなど
        return redirect()->guest(route('login'));
    }

    // 既存のコード ...
}

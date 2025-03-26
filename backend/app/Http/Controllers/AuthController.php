<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use App\Services\SlackNotificationService;


class AuthController extends Controller
{
    function login(Request $request){
        $credentials = [
            "email" => $request["email"],
            "password"=> $request["password"]
        ];

        if (! $token = Auth::attempt($credentials)) {
            return response()->json([
                "success" => false,
                "error" => "Unauthorized"
            ], 401);
        }

        $user = Auth::user();
        $user->token = $token;

        $message = $user->first_name . " " . $user->last_name . " logged in";
        SlackNotificationService::sendNotification($message, env("SLACK_LOGIN_WEBHOOK"));

        return response()->json([
            "success" => true,
            "user" => $user
        ]);
    }

    function signup(Request $request) {
        $user = new User;
        $user->first_name = $request['first_name'];
        $user->last_name = $request['last_name'];
        $user->status =$request['status'];
        $user->account_type =$request['account_type'];
        $user->email = $request['email'];
        $user->password = bcrypt($request['password']);
        $user->save();

        return response()->json([
            "success" => true
        ]);
    }

    //Google Auth
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->with(['approval_prompt' => 'force'])->redirect();
    }
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
            $user = User::where('email', $googleUser->email)->first();

            if (!$user) {
                return redirect('http://localhost:5173/auth/google/callback?error=error');

            }

            if (!$token = Auth::login($user)) {
                return redirect('http://localhost:5173/auth/google/callback?error=error');
            }
            $user->token = $token;
            $message = $user->first_name . " " . $user->last_name . " logged in using Google";
            SlackNotificationService::sendNotification($message, env("SLACK_LOGIN_WEBHOOK"));

            return redirect("http://localhost:5173/auth/google/callback?token={$token}");

        } catch (\Throwable $e) {
            return redirect('http://localhost:5173/auth/google/callback?error=error');

        }
    }

}

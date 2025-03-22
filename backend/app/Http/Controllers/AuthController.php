<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;


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
        return response()->json([
            "success" => true,
            "user" => $user
        ]);

        $user->token = $token;

        return response()->json([
            "success" => true,
            "user" => $user
        ]);
    }

    function signup(Request $request){
        $user = new User;
        $user->first_name = "Rawan";
        $user->last_name = "Ghobar";
        $user->status="active";
        $user->account_type="employee";
        $user->email = $request["email"];
        $user->password = bcrypt($request["password"]);
        $user->save();

        return response()->json([
            "success" => true
        ]);
    }
}

<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    function getUsers($count, $page, $id = null){

        if($id == null){
            $users = User::paginate($count, ['*'], 'page', $page);
            return response()->json([
                "success" => "true",
                "users" => $users
            ]);
        }

        $user = User::find($id);

        if($user){
            return response()->json([
                "success" => "true",
                "user" => $user
            ]);
        }

        return response()->json([
            "success" => "false",
            "user" => null
        ]);
    }

    function addOrUpdateUser(Request $request, $id = "add") {
        if ($id == "add") {
            $user = new User;

        } else {
            $user = User::find($id);
            if (!$user) {
                return response()->json([
                    "success" => false,
                    "message" => "User not found"
                ]) ;
            }
        }

        $user->email       = $request['email'];
        $user->first_name  = $request['first_name'];
        $user->last_name   = $request['last_name'];
        $user->phone_number     = $request['phone_number'] ?? null;
        $user->account_type= $request['account_type'];
        $user->status      = 'active';
        $user->password    = bcrypt($request['password']);
        $user->save();

        return response()->json([
            "success" => true,
            "user"    => $user
        ]);
    }

    public function deleteUser($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ]);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully'
        ]);
    }

}

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
                "questions" => $users
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
    
        $validationRules = [
            'email'       => 'required|email|unique:users,email' . ($id !== "add" ? ",{$id},user_id" : ''),
            'first_name'  => 'required|string|max:255',
            'last_name'   => 'required|string|max:255',
            'phoneNb'     => 'nullable|string|max:20',
            'account_type'=> 'required|in:employee,hr',
            'hr_position' => 'nullable|in:"HR Specialist","HR Lead"',
        ];
        $validatedData = $request->validate($validationRules);
    
        $user->email       = $validatedData['email'];
        $user->first_name  = $validatedData['first_name'];
        $user->last_name   = $validatedData['last_name'];
        $user->phoneNb     = $validatedData['phoneNb'] ?? null;
        $user->account_type= $validatedData['account_type'];
        $user->hr_position = $validatedData['hr_position'] ?? null;
        $user->save();
    
        return response()->json([
            "success" => true,
            "user"    => $user
        ]);
    }
    
}

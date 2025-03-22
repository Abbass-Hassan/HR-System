<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    function addOrUpdateUser(Request $request, $id = "add"){
        if($id == "add"){
            $question = new User;
        }else{
            $question = User::find($id);
            if(!$question){
                return response()->json([
                    "success" => "false",
                    "questions" => null
                ]);
            }
        }

        $question->title = $request["title"];
        $question->answer = $request["answer"];
        $question->save();

        return response()->json([
            "success" => "true",
            "questions" => $question
        ]);
    }
}

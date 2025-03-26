<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

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

    function userProfile(Request $request)
    {
        try {
            $user = User::find(Auth::id());
            return response()->json([
                "success" => true,
                "user" => $user
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                "success" => false,
                "message" => $e->getMessage()
            ]);
        }
    }

    function employeeEditProfile(Request $request)
    {
        $chagngePassword = $request["change_password"];
        $user = Auth::user();
        $newEmail = request("email");
        if ($user->email !== $newEmail) {
            $found = User::where("email", $newEmail)->first();
            if ($found) {
                return response()->json([
                    "success" => false,
                    "message" => "Email is already used by other user"
                ],401);
            }
        }

        $user->email = $newEmail;
        $user->first_name = request("first_name");
        $user->last_name = request("last_name");
        $user->phone_number = request("phone_number");
        if ($chagngePassword) {
            $user->password = bcrypt(request("password"));
        }
        $user->save();
        return response()->json([
            "success" => true,
            "message" => "user Update Successfully"
        ],200);
    }

    public function updateProfileImage(Request $request)
    {
        try {
            $request->validate([
                'image' => 'required|image'
            ]);

            $user = Auth::user();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            if ($request->hasFile('image')) {
                $fileName = time() . '_' . $request->file('image')->getClientOriginalName();

                $filePath = $request->file('image')->storeAs('profile_images', $fileName, 'public');

                $user->profile_image = 'storage/' . $filePath;
                $user->save();

                return response()->json([
                    'success' => true,
                    'message' => 'Profile image updated successfully',
                    'profile_image' => $user->profile_image

                ]);
            }

            return response()->json(['error' => 'Image upload failed'], 401);

        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 401);

        }
    }
}

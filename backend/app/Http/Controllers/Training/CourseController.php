<?php

namespace App\Http\Controllers\Training;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class CourseController extends Controller
{
    function index (Request $request){
        $count = $request->query('count', 10);
        $page = $request->query('page', 1);

        $courses = Course::with(['modules'])->active()->paginate($count, ['*'], 'page', $page);

        return response()->json([
            "success" => true,
            "courses" => $courses
        ]);
    }

    function show($id){
        $course = Course::with(['modules'])->find($id);

        if($course){
            return response()->json([
                "success" => true,
                "course" => $course
            ]);
        }

        return response()->json([
            "success" => false,
            "message" => "Course not found"
        ], 404);
    }

    function search(Request $request){
        $query = $request->query('q');
         $count = $request->query('count', 10);
        $page = $request->query('page', 1);
        
        $courses = Course::where('course_name', 'LIKE', "%{$query}%")
            ->orWhere('description', 'LIKE', "%{$query}%")
            ->orWhere('provider', 'LIKE', "%{$query}%")
            ->active()
            ->paginate($count, ['*'], 'page', $page);
            
        return response()->json([
            "success" => true,
            "courses" => $courses
        ]);
    }
    
    function featured()
    {
        $featuredCourses = Course::active()
            ->take(5)
            ->get();
            
        return response()->json([
            "success" => true,
            "courses" => $featuredCourses
        ]);
    }
}
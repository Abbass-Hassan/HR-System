<?php

namespace App\Http\Controllers\Training;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CourseEnrollment;
use App\Models\Course;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class EnrollmentController extends Controller
{
    function index(Request $request)
    {
        $count = $request->query('count', 10);
        $page = $request->query('page', 1);
        $status = $request->query('status');

        $user = Auth::user();
        $query = CourseEnrollment::with(['course'])->where('user_id', $user->id);

        if ($status) {
            $query->where('status', $status);
        }

        $enrollments = $query->orderBy('enrollment_date', 'desc')
            ->paginate($count, ['*'], 'page', $page);

        return response()->json([
            "success" => true,
            "enrollments" => $enrollments
        ]);
    }

    function show($id)
    {
        $user = Auth::user();
        $enrollment = CourseEnrollment::with(['course', 'moduleProgress.module'])
            ->where('user_id', $user->id)
            ->find($id);

        if ($enrollment) {
            return response()->json([
                "success" => true,
                "enrollment" => $enrollment
            ]);
        }

        return response()->json([
            "success" => false,
            "message" => "Enrollment not found"
        ], 404);
    }

    function enroll(Request $request, $id)
    {
        $course = Course::find($id);

        if (!$course) {
            return response()->json([
                "success" => false,
                "message" => "Course not found"
            ], 404);
        }

        $user = Auth::user();

        $existingEnrollment = CourseEnrollment::where('user_id', $user->id)
            ->where('course_id', $id)
            ->where('status', '!=', 'withdrawn')
            ->first();

        if ($existingEnrollment) {
            return response()->json([
                "success" => false,
                "message" => "You are already enrolled in this course",
                "enrollment" => $existingEnrollment
            ], 400);
        }

        $enrollment = new CourseEnrollment;
        $enrollment->user_id = $user->id;
        $enrollment->course_id = $id;
        $enrollment->enrollment_date = Carbon::now();
        $enrollment->status = 'enrolled';
        $enrollment->completion_percentage = 0;
        $enrollment->save();

        return response()->json([
            "success" => true,
            "message" => "Successfully enrolled in course",
            "enrollment" => $enrollment
        ]);
    }
}

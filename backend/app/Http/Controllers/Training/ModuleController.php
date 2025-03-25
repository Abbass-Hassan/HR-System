<?php

namespace App\Http\Controllers\Training;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CourseModule;
use App\Models\ModuleProgress;
use App\Models\CourseEnrollment;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class ModuleController extends Controller
{
    function show($id)
    {
        $module = CourseModule::with(['course', 'assessment'])->find($id);
        
        if(!$module){
            return response()->json([
                "success" => "false",
                "module" => null
            ]);
        }
        
        $user = Auth::user();
        $enrollment = CourseEnrollment::where('user_id', $user->id)
            ->where('course_id', $module->course_id)
            ->first();
            
        if(!$enrollment){
            return response()->json([
                "success" => "false",
                "message" => "Not enrolled in this course"
            ]);
        }
        
        $progress = ModuleProgress::firstOrCreate(
            [
                'enrollment_id' => $enrollment->id,
                'module_id' => $id
            ],
            [
                'is_completed' => false,
                'last_accessed' => Carbon::now()
            ]
        );
        
        $progress->last_accessed = Carbon::now();
        $progress->save();
        
        return response()->json([
            "success" => "true",
            "module" => $module,
            "progress" => $progress
        ]);
    }
    
    function markComplete($id)
    {
        $module = CourseModule::find($id);
        
        if(!$module){
            return response()->json([
                "success" => "false",
                "module" => null
            ]);
        }
        
        $user = Auth::user();
        $enrollment = CourseEnrollment::where('user_id', $user->id)
            ->where('course_id', $module->course_id)
            ->first();
            
        if(!$enrollment){
            return response()->json([
                "success" => "false",
                "message" => "Not enrolled in this course"
            ]);
        }
        
        $progress = ModuleProgress::where('enrollment_id', $enrollment->id)
            ->where('module_id', $id)
            ->first();
            
        if(!$progress){
            $progress = new ModuleProgress;
            $progress->enrollment_id = $enrollment->id;
            $progress->module_id = $id;
            $progress->last_accessed = Carbon::now();
        }
        
        $progress->is_completed = true;
        $progress->completion_date = Carbon::now();
        $progress->save();
        
        $this->updateEnrollmentProgress($enrollment);
        
        return response()->json([
            "success" => "true",
            "progress" => $progress
        ]);
    }
    
    function trackAccess($id)
    {
        $module = CourseModule::find($id);
        
        if(!$module){
            return response()->json([
                "success" => "false",
                "module" => null
            ]);
        }
        
        $user = Auth::user();
        $enrollment = CourseEnrollment::where('user_id', $user->id)
            ->where('course_id', $module->course_id)
            ->first();
            
        if(!$enrollment){
            return response()->json([
                "success" => "false",
                "message" => "Not enrolled in this course"
            ]);
        }
        
        $progress = ModuleProgress::where('enrollment_id', $enrollment->id)
            ->where('module_id', $id)
            ->first();
            
        if(!$progress){
            $progress = new ModuleProgress;
            $progress->enrollment_id = $enrollment->id;
            $progress->module_id = $id;
            $progress->is_completed = false;
        }
        
        $progress->last_accessed = Carbon::now();
        $progress->save();
        
        return response()->json([
            "success" => "true",
            "progress" => $progress
        ]);
    }
    
    private function updateEnrollmentProgress($enrollment)
    {
        $totalModules = CourseModule::where('course_id', $enrollment->course_id)->count();
        $completedModules = ModuleProgress::where('enrollment_id', $enrollment->id)
            ->where('is_completed', true)
            ->count();
            
        if($totalModules > 0){
            $percentage = ($completedModules / $totalModules) * 100;
            $enrollment->completion_percentage = $percentage;
            
            if($percentage == 100){
                $enrollment->status = 'completed';
                $enrollment->completion_date = Carbon::now();
            } else {
                $enrollment->status = 'in_progress';
            }
            
            $enrollment->save();
        }
    }
}
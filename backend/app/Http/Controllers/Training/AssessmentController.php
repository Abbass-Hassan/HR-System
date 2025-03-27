<?php

namespace App\Http\Controllers\Training;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ModuleAssessment;
use App\Models\AssessmentQuestion;
use App\Models\ModuleProgress;
use App\Models\CourseEnrollment;
use App\Models\CourseModule;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth; 

class AssessmentController extends Controller
{
    public function show($id)
    {
        return $this->getAssessment($id);
    }

    public function submit(Request $request, $id)
    {
        return $this->submitAssessment($request, $id);
    }
    
    public function result($id)
    {
        return $this->getResult($id);
    }

    function getAssessment($id)
    {
        $assessment = ModuleAssessment::with(['module.course'])->find($id);
        
        if(!$assessment){
            return response()->json([
                "success" => "false",
                "assessment" => null
            ]);
        }
        
        $user = Auth::user();
        $enrollment = CourseEnrollment::where('user_id', $user->id)
            ->where('course_id', $assessment->module->course_id)
            ->first();
            
        if(!$enrollment){
            return response()->json([
                "success" => "false",
                "message" => "Not enrolled in this course"
            ]);
        }
        
        $questions = AssessmentQuestion::where('assessment_id', $id)
            ->select(['id', 'question_text', 'question_type', 'options', 'points'])
            ->get();
            
        $progress = ModuleProgress::where('enrollment_id', $enrollment->id)
            ->where('module_id', $assessment->module_id)
            ->first();
            
        $canTake = true;
        if($progress && $progress->assessment_passed){
            $canTake = false;
        } else if($progress && $assessment->max_attempts && 
                 $progress->assessment_attempts >= $assessment->max_attempts){
            $canTake = false;
        }
        
        return response()->json([
            "success" => "true",
            "assessment" => $assessment,
            "questions" => $questions,
            "can_take" => $canTake
        ]);
    }
    
    function submitAssessment(Request $request, $id)
    {
        $assessment = ModuleAssessment::with(['module.course', 'questions'])->find($id);
        
        if(!$assessment){
            return response()->json([
                "success" => "false",
                "assessment" => null
            ]);
        }
        
        $user = Auth::user();
        $enrollment = CourseEnrollment::where('user_id', $user->id)
            ->where('course_id', $assessment->module->course_id)
            ->first();
            
        if(!$enrollment){
            return response()->json([
                "success" => "false",
                "message" => "Not enrolled in this course"
            ]);
        }
        
        $progress = ModuleProgress::where('enrollment_id', $enrollment->id)
            ->where('module_id', $assessment->module_id)
            ->first();
            
        if(!$progress){
            $progress = new ModuleProgress;
            $progress->enrollment_id = $enrollment->id;
            $progress->module_id = $assessment->module_id;
            $progress->is_completed = false;
            $progress->assessment_attempts = 0;
        }
        
        if($assessment->max_attempts && $progress->assessment_attempts >= $assessment->max_attempts){
            return response()->json([
                "success" => "false",
                "message" => "No attempts left"
            ]);
        }
    
        $answers = $request["answers"];
        $totalPoints = 0;
        $earnedPoints = 0;
        $results = [];
        
        foreach($assessment->questions as $question){
            $totalPoints += $question->points;
            $isCorrect = false;
            $answer = null;
            
            foreach($answers as $submittedAnswer){
                if($submittedAnswer["question_id"] == $question->id){
                    $answer = $submittedAnswer["answer"];
                    break;
                }
            }
            
            if($answer){
                if($question->question_type == 'multiple_choice' || $question->question_type == 'true_false'){
                    $isCorrect = $answer == $question->correct_answer;
                } else if($question->question_type == 'short_answer'){
                    $isCorrect = strtolower(trim($answer)) == strtolower(trim($question->correct_answer));
                }
                
                if($isCorrect){
                    $earnedPoints += $question->points;
                }
            }
            
            $results[] = [
                'question_id' => $question->id,
                'correct' => $isCorrect,
                'points' => $isCorrect ? $question->points : 0
            ];
        }
        
        $score = ($totalPoints > 0) ? ($earnedPoints / $totalPoints) * 100 : 0;
        $passed = $score >= $assessment->passing_score;
        
        $progress->assessment_completed = true;
        $progress->assessment_score = $score;
        $progress->assessment_passed = $passed;
        $progress->assessment_date = Carbon::now();
        $progress->assessment_attempts = ($progress->assessment_attempts ?? 0) + 1;
        $progress->assessment_results = json_encode($results);
        
        if($passed && !$progress->is_completed){
            $progress->is_completed = true;
            $progress->completion_date = Carbon::now();
        }
        
        $progress->save();
        
        if($passed){
            $this->updateEnrollmentProgress($enrollment);
        }
        
        return response()->json([
            "success" => "true",
            "score" => $score,
            "passed" => $passed,
            "results" => $results
        ]);
    }
    
    function getResult($id)
    {
        $assessment = ModuleAssessment::find($id);
        
        if(!$assessment){
            return response()->json([
                "success" => "false",
                "assessment" => null
            ]);
        }
        
        $user = Auth::user();
        $enrollment = CourseEnrollment::where('user_id', $user->id)
            ->where('course_id', $assessment->module->course_id)
            ->first();
            
        if(!$enrollment){
            return response()->json([
                "success" => "false",
                "message" => "Not enrolled in this course"
            ]);
        }
        
        $progress = ModuleProgress::where('enrollment_id', $enrollment->id)
            ->where('module_id', $assessment->module_id)
            ->first();
            
        if(!$progress || !$progress->assessment_completed){
            return response()->json([
                "success" => "false",
                "message" => "Assessment not taken yet"
            ]);
        }
        
        return response()->json([
            "success" => "true",
            "score" => $progress->assessment_score,
            "passed" => $progress->assessment_passed,
            "attempts" => $progress->assessment_attempts,
            "max_attempts" => $assessment->max_attempts,
            "date" => $progress->assessment_date,
            "results" => json_decode($progress->assessment_results)
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

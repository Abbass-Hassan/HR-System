<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ModuleAssessment;
use App\Models\CourseModule;

class ModuleAssessmentSeeder extends Seeder
{
    public function run()
    {
        $modules = CourseModule::where('has_assessment', true)->get();
        
        foreach ($modules as $module) {
            ModuleAssessment::create([
                'module_id' => $module->id,
                'title' => $module->module_name . ' Assessment',
                'instructions' => 'Please complete all questions. You need 70% to pass this assessment. You have 3 attempts available.',
                'time_limit' => 30, // 30 minutes
                'passing_score' => 70,
                'max_attempts' => 3
            ]);
        }
    }
}
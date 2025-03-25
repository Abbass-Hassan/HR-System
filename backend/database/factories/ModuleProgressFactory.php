<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\CourseEnrollment;
use App\Models\CourseModule;
use App\Models\ModuleProgress;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ModuleProgress>
 */
class ModuleProgressFactory extends Factory
{
    protected $model = ModuleProgress::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(){
        $isCompleted = fake()->boolean(50);
        $lastAccessed = fake()->dateTimeBetween('-3 months', 'now');
        $completionDate = $isCompleted ? fake()->dateTimeBetween($lastAccessed, 'now') : null;

        $assessmentCompleted = $isCompleted ? fake()->boolean(80) : fake()->boolean(20);
        $assessmentScore = null;
        $assessmentPassed = false;
        $assessmentDate = null;
        
        if ($assessmentCompleted) {
            $assessmentScore = fake()->numberBetween(0, 100);
            $assessmentPassed = $assessmentScore >= 70;
            $assessmentDate = fake()->dateTimeBetween($lastAccessed, $completionDate ?: 'now');
        }

        return [
            'enrollment_id' => CourseEnrollment::factory(),
            'module_id' => CourseModule::factory(),
            'is_completed' => $isCompleted,
            'last_accessed' => $lastAccessed,
            'completion_date' => $completionDate,
            'assessment_completed' => $assessmentCompleted,
            'assessment_score' => $assessmentScore,
            'assessment_passed' => $assessmentPassed,
            'assessment_date' => $assessmentDate,
            'created_at' => fake()->dateTimeBetween('-1 year', $lastAccessed),
            'updated_at' => fake()->dateTimeBetween($lastAccessed, 'now'),
        ];
    }

    public function completed(){
        return $this->state(function (array $attributes){
            $lastAccessed = fake()->dateTimeBetween('-3 months', '-1 day');
            $completionDate = fake()->dateTimeBetween($lastAccessed, 'now');

            return[
                'is_completed' => true,
                'last_accessed' => $lastAccessed,
                'completion_date' => $completionDate,
            ];
        });
    }

    public function assessmentPassed(){
        return $this->state(function (array $attributes){
            $lastAccessed = fake()->dateTimeBetween('-3 months', '-1 day');
            $assessmentDate = fake()->dateTimeBetween($lastAccessed, 'now');

            return [
                'assessment_completed' => true,
                'assessment_score' => fake()->numberBetween(70, 100),
                'assessment_passed' => true,
                'assessment_date' => $assessmentDate,
            ];
        });
    }
}

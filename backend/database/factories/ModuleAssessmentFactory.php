<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\CourseModule;
use App\Models\ModuleAssessment;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ModuleAssessment>
 */
class ModuleAssessmentFactory extends Factory
{
    protected $model = ModuleAssessment::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(){
        return [
            'module_id' => CourseModule::factory()->withAssessment(),
            'title' => fake()->sentence(4),
            'instructions' => fake()->paragraph(),
            'time_limit' => fake()->randomElement([15, 20, 30, 45, 60, 90, 120]),
            'passing_score' => fake()->numberBetween(60, 80),
            'max_attempts' => fake()->randomElement([1, 2, 3, 5, 10]),
            'created_at' => fake()->dateTimeBetween('-1 year', 'now'),
            'updated_at' => function (array $attributes) {
                return fake()->dateTimeBetween($attributes['created_at'], 'now');
            }
        ];
    }

    public function difficult(){
        return $this->state(function (array $attributes){
            return[
                'passing_score' => fake()->numberBetween(75, 90),
                "time_limit" => fake()->randomElement ([20, 30, 45]),
            ];
        });
    }

    public function easy(){
        return $this->state(function (array $attributes){
            return[
                'passing_score' => fake()->numberBetween(50, 65),
                'time_limit' => fake()->randomElement([60, 90, 120]),
            ];
        });
    }
}

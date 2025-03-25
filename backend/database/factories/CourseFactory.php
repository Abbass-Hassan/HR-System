<?php

namespace Database\Factories;

use App\Models\Course;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Course>
 */
class CourseFactory extends Factory
{
    protected $model = Course::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(){
        $statuses = ['active', 'inactive', 'development', 'archived'];
        
        return [
            'course_name' => fake()->unique()->sentence(4),
            'description' => fake()->paragraph(3),
            'provider' => fake()->company(),
            'duration' => fake()->randomElement(['1 hour', '2 hours', '4 hours', '1 day', '2 days', '1 week']),
            'status' => fake()->randomElement($statuses),
            'created_at' => fake()->dateTimeBetween('-1 year', 'now'),
            'updated_at' => function (array $attributes) {
                return fake()->dateTimeBetween($attributes['created_at'], 'now');
            }
        ];
    }

    public function active (){
        return $this->state(function(array $attributes){
            return [
                'status' => 'active',
            ];
        });
    }
}

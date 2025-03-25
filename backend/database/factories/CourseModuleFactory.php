<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\CourseModule;
use Illuminate\Database\Eloquent\Factories\Factory;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CourseModule>
 */
class CourseModuleFactory extends Factory
{
    protected $model = CourseModule::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $contentTypes = ['video', 'tetx', 'presentation', 'quiz', 'assignment', 'interactive'];
        $selectedType = fake()->randomElement($contentTypes);

        return [
            'course_id' => Course::factory(),
            'module_name' => fake()->sentence(3),
            'description' => fake()->paragraph(),
            'content_type' => $selectedType,
            'content' => $selectedType === 'text' ? fake()->paragraphs(3, true) : null,
            'content_url' => $selectedType !== 'text' ? fake()->url() : null,
            'has_assessment' => fake()->boolean(70),
            'created_at' => fake()->dateTimeBetween('-1 year', 'now'),
            'updated_at' => function (array $attributes) {
                return fake()->dateTimeBetween($attributes['created_at'], 'now');
            }
        ];
    }

    public function withAssessment(){
        return $this->state(function (array $attributes){
            return[
                'has_assessment' => true,
            ];
        });
    }

    public function withoutAssessment(){
        return $this->state(function (array $attributes){
            return [
                'has_assessment' => false,
            ];
        });
    }

    public function videoType()
    {
        return $this->state(function (array $attributes) {
            return [
                'content_type' => 'video',
                'content' => null,
                'content_url' => fake()->url(),
            ];
        });
    }
}

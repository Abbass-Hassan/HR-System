<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\AssessmentQuestion;
use App\Models\ModuleAssessment;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AssessmentQuestion>
 */
class AssessmentQuestionFactory extends Factory
{
    protected $model = AssessmentQuestion::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $questionTypes = ['multiple_choice', 'true_false', 'short_answer', 'essay', 'matching'];
        $questionType = fake()->randomElement($questionTypes);
        
        $options = null;
        $correctAnswer = null;
        
        switch ($questionType) {
            case 'multiple_choice':
                $choices = [
                    fake()->sentence(),
                    fake()->sentence(),
                    fake()->sentence(),
                    fake()->sentence()
                ];
                $options = $choices;
                $correctAnswer = $choices[rand(0, 3)];
                break;
                
            case 'true_false':
                $options = ['True', 'False'];
                $correctAnswer = fake()->boolean() ? 'True' : 'False';
                break;
                
            case 'matching':
                $options = [
                    ['left' => fake()->word(), 'right' => fake()->word()],
                    ['left' => fake()->word(), 'right' => fake()->word()],
                    ['left' => fake()->word(), 'right' => fake()->word()],
                ];
                $correctAnswer = json_encode($options);
                break;
                
            default:
                $correctAnswer = fake()->sentence();
                break;
        }
        
        return [
            'assessment_id' => ModuleAssessment::factory(),
            'question_text' => fake()->paragraph(),
            'question_type' => $questionType,
            'options' => $options,
            'correct_answer' => $correctAnswer,
            'points' => fake()->randomElement([1, 2, 3, 5, 10]),
            'created_at' => fake()->dateTimeBetween('-1 year', 'now'),
            'updated_at' => function (array $attributes) {
                return fake()->dateTimeBetween($attributes['created_at'], 'now');
            }
        ];
    }

    public function multipleChoice()
    {
        return $this->state(function (array $attributes) {
            $choices = [
                fake()->sentence(),
                fake()->sentence(),
                fake()->sentence(),
                fake()->sentence()
            ];
            
            return [
                'question_type' => 'multiple_choice',
                'options' => $choices,
                'correct_answer' => $choices[rand(0, 3)],
            ];
        });
    }

    public function trueFalse()
    {
        return $this->state(function (array $attributes) {
            return [
                'question_type' => 'true_false',
                'options' => ['True', 'False'],
                'correct_answer' => fake()->boolean() ? 'True' : 'False',
            ];
        });
    }
}

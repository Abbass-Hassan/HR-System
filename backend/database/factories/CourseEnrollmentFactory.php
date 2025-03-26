<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Models\User;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CourseEnrollment>
 */
class CourseEnrollmentFactory extends Factory
{
    protected $model = CourseEnrollment::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(){
        $enrollmentDate = fake()->dateTimeBetween('-6 months', 'now');
        $completionPercentage = fake()->numberBetween(0,100);
        $status = 'enrolled';

        if($completionPercentage > 0 && $completionPercentage < 100){
            $status = 'in_progress';
        } else if ($completionPercentage == 100){
            $status = fake()->randomElement(['completed', 'failed']);
        }

        $completionDate = null;
        if ($status === 'completed' || $status === 'failed'){
            $completionDate = fake()->dateTimeBetween($enrollmentDate, 'now');
        }

        $renewalRequired = fake()->boolean(30);
        $renewalDate = null;
        $expiryDate = null;

        if ($status === 'completed' && $renewalRequired){
            $expiryDate = fake()->dateTimeBetween('+1 month', '+1 year');
            $renewalDate = clone $expiryDate;
            $renewalDate->modify('-1 month');
        }

        return [
            'user_id' => User::factory(),
            'course_id' => Course::factory(),
            'enrollment_date' => $enrollmentDate,
            'completion_percentage' => $completionPercentage,
            'status' => $status,
            'completion_date' => $completionDate,
            'expiry_date' => $expiryDate,
            'renewal_required' => $renewalRequired,
            'renewal_date' => $renewalDate,
            'score' => $status === 'completed' ? fake()->randomFloat(2, 70, 100) : null,
            'feedback' => $status === 'completed' ? fake()->paragraph() : null,
            'certificate_url' => ($status === 'completed') ? 'certificates/' . fake()->uuid() . '.pdf' : null,
            'created_at' => $enrollmentDate,
            'updated_at' => fake()->dateTimeBetween($enrollmentDate, 'now'),
        ];
    }

    public function completed(){
        return $this->state(function (array $attributes){
            $enrollmentDate = fake()->dateTimeBetween('-6 months', '-1 week');
            $completionDate = fake()->dateTimeBetween($enrollmentDate, 'now');

            return [
                'completion_percentage' => 100,
                'status' => 'completed',
                'completion_date' => $completionDate,
                'score' => fake()->randomFloat(2, 70, 100),
                'feedback' => fake()->paragraph(),
                'certificate_url' => 'certificates/' . fake()->uuid() . '.pdf',
            ];
        });
    }

    public function inProgress(){
        return $this->state(function (array $attributes){
            return [
                'completion_percentage' => fake()->numberBetween(10, 90),
                'status' => 'in_progress',
                'completion_date' => null,
            ];
        });
    }
}

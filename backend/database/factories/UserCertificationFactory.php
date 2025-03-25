<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Certification;
use App\Models\User;
use App\Models\UserCertification;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserCertification>
 */
class UserCertificationFactory extends Factory
{
    protected $model = UserCertification::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(){
        $issueDate = fake()->dateTimeBetween('-3 years', 'now');

        $hasExpiry = fake()->boolean(70);
        $expiryDate = null;

        if ($hasExpiry){
            $expiryDate = clone $issueDate;
            $expiryDate->modify('+' . fake()->numberBetween(1, 3) . 'years');
        }

        $verificationStatus = fake()->randomElement(['pending', 'verified', 'rejected']);

        return [
            'user_id' => User::factory(),
            'certification_id' => Certification::factory(),
            'document_id' => null,
            'issue_date' => $issueDate,
            'expiry_date' => $expiryDate,
            'certificate_number' => fake()->bothify('CERT-####-????-####'),
            'verification_status' => $verificationStatus,
            'created_at' => $issueDate,
            'updated_at' => fake()->dateTimeBetween($issueDate, 'now'),
        ];
    }

    public function active (){
        return $this->state(function (array $attributes){
            $issueDate = fake()->dateTimeBetween('-1 year', 'now');
            $expiryDate = clone $issueDate;
            $expiryDate->modify('+' . fake()->numberBetween(2, 5) . 'years');

            return [
                'issue_date' => $issueDate,
                'expiry_date' => $expiryDate,
                'verification_status' => 'verified',
            ];
        });
    }
}

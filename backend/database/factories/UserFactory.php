<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition():array
    {
        $accountType = fake()->randomElement(['employee', 'hr']);

        return [
            'department_id' => null,
            'position_id' => null,
            'manager_id' => null,
            'email' => fake()->unique()->safeEmail,
            'password' => function (array $attributes) {
                return Hash::make($attributes['first_name'] . '.' . $attributes['last_name']);
            },
            'first_name' => fake()->firstName,
            'last_name' => fake()->lastName,
            'phoneNb' => fake()->phoneNumber,
            'status' => fake()->randomElement(['active', 'inactive', 'on_leave', 'terminated']),
            'account_type' => $accountType,
            'hr_position' => $accountType === 'hr' ? fake()->randomElement(['HR Specialist', 'HR Lead']) : null,
            'employee_number' => fake()->unique()->numerify('EMP#####'),
            'hire_date' => fake()->date(),
            'termination_date' => null,
            'created_by' => null,
            'updated_by' => null,
            'remember_token' => Str::random(10),
        ];
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}

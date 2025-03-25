<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create HR user
        User::create([
            'email' => 'hr@gmail.com',
            'password' => Hash::make('123456789'),
            'first_name' => 'HR',
            'last_name' => 'Admin',
            'status' => 'active',
            'account_type' => 'hr',
            'created_by' => 'Seeder',
        ]);

        // Create Employee user
        User::create([
            'email' => 'employee@gmail.com',
            'password' => Hash::make('123456789'),
            'first_name' => 'Test',
            'last_name' => 'Employee',
            'status' => 'active',
            'account_type' => 'employee',
            'employee_number' => 'EMP001',
            'hire_date' => now(),
            'created_by' => 'Seeder',
        ]);
    }
}
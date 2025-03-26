<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Course;

class CourseSeeder extends Seeder
{
    public function run()
    {
        $courses = [
            [
                'course_name' => 'Cybersecurity Fundamentals',
                'description' => 'This course provides essential knowledge and skills to protect organizational data and systems from cyber threats. Learn about common vulnerabilities, security protocols, and best practices for maintaining digital security.',
                'provider' => 'TechShield Academy',
                'duration' => '12 hours',
                'status' => 'active'
            ],
            [
                'course_name' => 'Project Management Essentials',
                'description' => 'Master the core principles of project management including planning, execution, monitoring, and closing. This course covers key methodologies, documentation, and tools needed to successfully manage projects of various sizes.',
                'provider' => 'Business Excellence Institute',
                'duration' => '16 hours',
                'status' => 'active'
            ]
        ];

        foreach ($courses as $course) {
            Course::create($course);
        }
    }
}
<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Course;
use App\Models\CourseModule;
use App\Models\ModuleAssessment;
use App\Models\AssessmentQuestion;
use App\Models\Certification;

class TrainingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->call([
            CourseSeeder::class,
            CourseModuleSeeder::class,
            ModuleAssessmentSeeder::class,
            AssessmentQuestionSeeder::class,
            CertificationSeeder::class,
            CourseEnrollmentSeeder::class,
            ModuleProgressSeeder::class,
            UserCertificationSeeder::class,
        ]);
    }
}

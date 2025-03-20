<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTrainingAndDevelopmentTablesForHRSystem extends Migration
{

    public function up()
    {
        // Courses Table
        Schema::create('courses', function (Blueprint $table) {
            $table->id('course_id');
            $table->string('course_name');
            $table->text('description')->nullable();
            $table->string('provider')->nullable();
            $table->string('duration')->nullable();
            $table->enum('status', ['active', 'inactive', 'development', 'archived']);
            $table->timestamps();
        });

        // Course Modules Table
        Schema::create('course_modules', function (Blueprint $table) {
            $table->id('module_id');
            $table->foreignId('course_id')->constrained('courses', 'course_id');
            $table->string('module_name');
            $table->text('description')->nullable();
            $table->enum('content_type', ['video', 'text', 'presentation', 'quiz', 'assignment', 'interactive']);
            $table->text('content')->nullable();
            $table->string('content_url')->nullable();
            $table->boolean('has_assessment')->default(false);
            $table->timestamps();
        });

        // Module Assessments Table
        Schema::create('module_assessments', function (Blueprint $table) {
            $table->id('assessment_id');
            $table->foreignId('module_id')->constrained('course_modules', 'module_id');
            $table->string('title');
            $table->text('instructions')->nullable();
            $table->integer('time_limit')->nullable();
            $table->integer('passing_score');
            $table->integer('max_attempts')->default(1);
            $table->timestamps();
        });

        // Assessment Questions Table
        Schema::create('assessment_questions', function (Blueprint $table) {
            $table->id('question_id');
            $table->foreignId('assessment_id')->constrained('module_assessments', 'assessment_id');
            $table->text('question_text');
            $table->enum('question_type', ['multiple_choice', 'true_false', 'short_answer', 'essay', 'matching']);
            $table->json('options')->nullable();
            $table->text('correct_answer')->nullable();
            $table->integer('points')->default(1);
            $table->timestamps();
        });

        // Course Enrollments Table
        Schema::create('course_enrollments', function (Blueprint $table) {
            $table->id('enrollment_id');
            $table->foreignId('user_id')->constrained('users', 'user_id');
            $table->foreignId('course_id')->constrained('courses', 'course_id');
            $table->date('enrollment_date');
            $table->decimal('completion_percentage', 5, 2)->default(0);
            $table->enum('status', ['enrolled', 'in_progress', 'completed', 'failed', 'withdrawn']);
            $table->date('completion_date')->nullable();
            $table->date('expiry_date')->nullable();
            $table->boolean('renewal_required')->default(false);
            $table->date('renewal_date')->nullable();
            $table->decimal('score', 5, 2)->nullable();
            $table->text('feedback')->nullable();
            $table->string('certificate_url')->nullable();
            $table->timestamps();
        });

        // Module Progress Table
        Schema::create('module_progress', function (Blueprint $table) {
            $table->id('progress_id');
            $table->foreignId('enrollment_id')->constrained('course_enrollments', 'enrollment_id');
            $table->foreignId('module_id')->constrained('course_modules', 'module_id');
            $table->boolean('is_completed')->default(false);
            $table->timestamp('last_accessed')->nullable();
            $table->timestamp('completion_date')->nullable();
            $table->boolean('assessment_completed')->default(false);
            $table->integer('assessment_score')->nullable();
            $table->boolean('assessment_passed')->default(false);
            $table->timestamp('assessment_date')->nullable();
            $table->timestamps();
        });

        // Certifications Table
        Schema::create('certifications', function (Blueprint $table) {
            $table->id('certification_id');
            $table->string('certification_name');
            $table->string('issuing_organization')->nullable();
            $table->string('validity_period')->nullable();
            $table->timestamps();
        });

        // User Certifications Table
        Schema::create('user_certifications', function (Blueprint $table) {
            $table->id('user_certification_id');
            $table->foreignId('user_id')->constrained('users', 'user_id');
            $table->foreignId('certification_id')->constrained('certifications', 'certification_id');
            $table->foreignId('document_id')->nullable()->constrained('user_documents', 'document_id');
            $table->date('issue_date');
            $table->date('expiry_date')->nullable();
            $table->string('certificate_number')->nullable();
            $table->string('verification_status')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('user_certifications');
        Schema::dropIfExists('certifications');
        Schema::dropIfExists('module_progress');
        Schema::dropIfExists('course_enrollments');
        Schema::dropIfExists('assessment_questions');
        Schema::dropIfExists('module_assessments');
        Schema::dropIfExists('course_modules');
        Schema::dropIfExists('courses');
    }
}
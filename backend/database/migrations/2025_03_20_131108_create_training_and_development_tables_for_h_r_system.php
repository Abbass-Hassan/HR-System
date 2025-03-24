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
            $table->id();
            $table->string('course_name');
            $table->text('description')->nullable();
            $table->string('provider')->nullable();
            $table->string('duration')->nullable();
            $table->enum('status', ['active', 'inactive', 'development', 'archived']);
            $table->timestamps();
            $table->softDeletes();

            $table->index('course_name');
            $table->index('status');
        });

        // Course Modules Table
        Schema::create('course_modules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->string('module_name');
            $table->text('description')->nullable();
            $table->enum('content_type', ['video', 'text', 'presentation', 'quiz', 'assignment', 'interactive']);
            $table->text('content')->nullable();
            $table->string('content_url')->nullable();
            $table->boolean('has_assessment')->default(false);
            $table->timestamps();
            $table->softDeletes();

            $table->index('course_id');
            $table->index('module_name');
            $table->index('content_type');
            $table->index('has_assessment');
        });

        // Module Assessments Table
        Schema::create('module_assessments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('module_id')->constrained('course_modules')->onDelete('cascade');
            $table->string('title');
            $table->text('instructions')->nullable();
            $table->integer('time_limit')->nullable();
            $table->integer('passing_score');
            $table->integer('max_attempts')->default(1);
            $table->timestamps();
            $table->softDeletes();

            $table->index('module_id');
            $table->index('title');
        });

        // Assessment Questions Table
        Schema::create('assessment_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assessment_id')->constrained('module_assessments')->onDelete('cascade');
            $table->text('question_text');
            $table->enum('question_type', ['multiple_choice', 'true_false', 'short_answer', 'essay', 'matching']);
            $table->json('options')->nullable();
            $table->text('correct_answer')->nullable();
            $table->integer('points')->default(1);
            $table->timestamps();
            $table->softDeletes();

            $table->index('assessment_id');
            $table->index('question_type');
        });

        // Course Enrollments Table
        Schema::create('course_enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses')->onDelete('restrict');
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
            $table->softDeletes();

            $table->index('user_id');
            $table->index('course_id');
            $table->index('enrollment_date');
            $table->index('status');
            $table->index('completion_date');
            $table->index('expiry_date');
            $table->index('renewal_required');
        });

        // Module Progress Table
        Schema::create('module_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('enrollment_id')->constrained('course_enrollments')->onDelete('cascade');
            $table->foreignId('module_id')->constrained('course_modules')->onDelete('cascade');
            $table->boolean('is_completed')->default(false);
            $table->timestamp('last_accessed')->nullable();
            $table->timestamp('completion_date')->nullable();
            $table->boolean('assessment_completed')->default(false);
            $table->integer('assessment_score')->nullable();
            $table->boolean('assessment_passed')->default(false);
            $table->timestamp('assessment_date')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('enrollment_id');
            $table->index('module_id');
            $table->index('is_completed');
            $table->index('assessment_completed');
            $table->index('assessment_passed');
            $table->unique(['enrollment_id', 'module_id']);
        });

        // Certifications Table
        Schema::create('certifications', function (Blueprint $table) {
            $table->id();
            $table->string('certification_name');
            $table->string('issuing_organization')->nullable();
            $table->string('validity_period')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('certification_name');
            $table->index('issuing_organization');
        });

        // User Certifications Table
        Schema::create('user_certifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('certification_id')->constrained('certifications')->onDelete('restrict');
            $table->foreignId('document_id')->nullable()->constrained('user_documents')->onDelete('set null');
            $table->date('issue_date');
            $table->date('expiry_date')->nullable();
            $table->string('certificate_number')->nullable();
            $table->string('verification_status')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('user_id');
            $table->index('certification_id');
            $table->index('document_id');
            $table->index('issue_date');
            $table->index('expiry_date');
            $table->index('verification_status');
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

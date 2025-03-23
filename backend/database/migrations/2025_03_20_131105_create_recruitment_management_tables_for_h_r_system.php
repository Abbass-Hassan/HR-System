<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRecruitmentManagementTablesForHRSystem extends Migration
{
    public function up()
    {
        // Job Postings Table
        Schema::create('job_postings', function (Blueprint $table) {
            $table->id('posting_id');
            $table->foreignId('position_id')->constrained('positions', 'position_id');
            $table->foreignId('department_id')->constrained('departments', 'department_id');
            $table->foreignId('created_by')->constrained('users', 'user_id');
            $table->string('title');
            $table->text('description');
            $table->text('requirements');
            $table->date('posting_date');
            $table->date('closing_date');
            $table->enum('status', ['draft', 'published', 'closed', 'cancelled']);
            $table->timestamps();
        });

        // Applicants Table
        Schema::create('applicants', function (Blueprint $table) {
            $table->id('applicant_id');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('zip_code')->nullable();
            $table->date('application_date');
            $table->string('source')->nullable();
            $table->enum('status', ['new', 'screening', 'interview', 'offer', 'hired', 'rejected']);
            $table->boolean('converted_to_employee')->default(false);
            $table->foreignId('converted_user_id')->nullable()->constrained('users', 'user_id');
            $table->integer('retention_period')->nullable();
            $table->date('retention_expiry_date')->nullable();
            $table->boolean('is_archived')->default(false);
            $table->date('archive_date')->nullable();
            $table->timestamps();
        });

        // Applications Table
        Schema::create('applications', function (Blueprint $table) {
            $table->id('application_id');
            $table->foreignId('applicant_id')->constrained('applicants', 'applicant_id');
            $table->foreignId('posting_id')->constrained('job_postings', 'posting_id');
            $table->date('application_date');
            $table->enum('status', ['submitted', 'screening', 'interview', 'offer', 'hired', 'rejected']);
            $table->text('review_notes')->nullable();
            $table->string('interview_status')->nullable();
            $table->string('final_decision')->nullable();
            $table->foreignId('reviewer_id')->nullable()->constrained('users', 'user_id');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('applications');
        Schema::dropIfExists('applicants');
        Schema::dropIfExists('job_postings');
    }
}
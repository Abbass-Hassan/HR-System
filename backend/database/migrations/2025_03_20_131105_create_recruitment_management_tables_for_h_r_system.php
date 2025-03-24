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
            $table->id();
            $table->foreignId('position_id')->constrained('positions')->onDelete('restrict');
            $table->foreignId('department_id')->constrained('departments')->onDelete('restrict');
            $table->foreignId('created_by_id')->constrained('users')->onDelete('restrict');
            $table->foreignId('updated_by_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('title');
            $table->text('description');
            $table->text('requirements');
            $table->date('posting_date');
            $table->date('closing_date');
            $table->enum('status', ['draft', 'published', 'closed', 'cancelled']);
            $table->timestamps();
            $table->softDeletes();
        
            $table->index('position_id');
            $table->index('department_id');
            $table->index('created_by_id');
            $table->index('title');
            $table->index('posting_date');
            $table->index('closing_date');
            $table->index('status');
        });

        // Applicants Table
        Schema::create('applicants', function (Blueprint $table) {
            $table->id();
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
            $table->foreignId('converted_user_id')->nullable()->constrained('users')->onDelete('restrict');
            $table->boolean('is_archived')->default(false);
            $table->date('archive_date')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('email');
            $table->index('application_date');
            $table->index('status');
            $table->index('converted_to_employee');
            $table->index('converted_user_id');
        });

        // Applications Table
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('applicant_id')->constrained('applicants')->onDelete('restrict');
            $table->foreignId('posting_id')->constrained('job_postings')->onDelete('restrict');
            $table->date('application_date');
            $table->enum('status', ['submitted', 'screening', 'interview', 'offer', 'hired', 'rejected']);
            $table->text('review_notes')->nullable();
            $table->string('interview_status')->nullable();
            $table->string('final_decision')->nullable();
            $table->foreignId('reviewer_id')->nullable()->constrained('users')->onDelete('restrict');
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('applicant_id');
            $table->index('posting_id');
            $table->index('application_date');
            $table->index('status');
            $table->index('reviewer_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('applications');
        Schema::dropIfExists('applicants');
        Schema::dropIfExists('job_postings');
    }
}
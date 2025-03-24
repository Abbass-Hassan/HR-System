<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSurveyManagementTablesForHRSystem extends Migration
{

    public function up()
    {
        // Surveys Table
        Schema::create('surveys', function (Blueprint $table) {
            $table->id();
            $table->foreignId('created_by_id')->constrained('users')->onDelete('restrict');
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('survey_type', ['engagement', 'pulse', 'onboarding', 'exit', 'training', 'benefits', 'custom']);
            $table->date('start_date');
            $table->date('end_date');
            $table->boolean('is_anonymous')->default(false);
            $table->enum('status', ['draft', 'active', 'closed', 'archived']);
            $table->timestamps();
            $table->softDeletes();

            $table->index('created_by_id');
            $table->index('title');
            $table->index('survey_type');
            $table->index('status');
            $table->index('deleted_at');
        });

        // Survey Questions Table
        Schema::create('survey_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('survey_id')->constrained('surveys')->onDelete('cascade');
            $table->text('question_text');
            $table->enum('question_type', ['multiple_choice', 'rating', 'text', 'yes_no', 'dropdown', 'matrix']);
            $table->json('options')->nullable();
            $table->boolean('is_required')->default(false);
            $table->timestamps();
            $table->softDeletes();

            $table->index('survey_id');
            $table->index('question_type');
            $table->index('deleted_at');
        });

        // Survey Responses Table
        Schema::create('survey_responses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('survey_id')->constrained('surveys')->onDelete('restrict');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->date('response_date');
            $table->enum('completion_status', ['started', 'partial', 'completed']);
            $table->timestamps();
            $table->softDeletes();

            $table->index('survey_id');
            $table->index('user_id');
            $table->index('deleted_at');
        });

        // Survey Answers Table
        Schema::create('survey_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('response_id')->constrained('survey_responses')->onDelete('restrict');
            $table->foreignId('question_id')->constrained('survey_questions')->onDelete('restrict');
            $table->text('answer_value')->nullable();
            $table->decimal('answer_numeric', 5, 2)->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('response_id');
            $table->index('question_id');
            $table->index('deleted_at');
        });
    }

    public function down()
    {
        Schema::dropIfExists('survey_answers');
        Schema::dropIfExists('survey_responses');
        Schema::dropIfExists('survey_questions');
        Schema::dropIfExists('surveys');
    }
}
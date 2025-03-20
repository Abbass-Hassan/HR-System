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
            $table->id('survey_id');
            $table->foreignId('created_by')->constrained('users', 'user_id');
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('survey_type', ['engagement', 'pulse', 'onboarding', 'exit', 'training', 'benefits', 'custom']);
            $table->date('start_date');
            $table->date('end_date');
            $table->boolean('is_anonymous')->default(false);
            $table->enum('status', ['draft', 'active', 'closed', 'archived']);
            $table->timestamps();
        });

        // Survey Questions Table
        Schema::create('survey_questions', function (Blueprint $table) {
            $table->id('question_id');
            $table->foreignId('survey_id')->constrained('surveys', 'survey_id');
            $table->text('question_text');
            $table->enum('question_type', ['multiple_choice', 'rating', 'text', 'yes_no', 'dropdown', 'matrix']);
            $table->json('options')->nullable();
            $table->boolean('is_required')->default(false);
            $table->timestamps();
        });

        // Survey Responses Table
        Schema::create('survey_responses', function (Blueprint $table) {
            $table->id('response_id');
            $table->foreignId('survey_id')->constrained('surveys', 'survey_id');
            $table->foreignId('user_id')->nullable()->constrained('users', 'user_id');
            $table->date('response_date');
            $table->enum('completion_status', ['started', 'partial', 'completed']);
            $table->timestamps();
        });

        // Survey Answers Table
        Schema::create('survey_answers', function (Blueprint $table) {
            $table->id('answer_id');
            $table->foreignId('response_id')->constrained('survey_responses', 'response_id');
            $table->foreignId('question_id')->constrained('survey_questions', 'question_id');
            $table->text('answer_value')->nullable();
            $table->decimal('answer_numeric', 5, 2)->nullable();
            $table->timestamps();
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
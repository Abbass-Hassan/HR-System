<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePerformanceManagementTablesForHRSystem extends Migration
{
 
    public function up()
    {
        // Performance Reviews Table
        Schema::create('performance_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('restrict');
            $table->foreignId('reviewer_id')->constrained('users')->onDelete('restrict');
            $table->foreignId('created_by_id')->constrained('users')->onDelete('restrict');
            $table->date('review_date');
            $table->json('performance_criteria')->nullable();
            $table->enum('overall_rating', ['1', '2', '3', '4', '5']);
            $table->text('feedback')->nullable();
            $table->enum('status', ['draft', 'submitted', 'reviewed', 'acknowledged', 'completed']);
            $table->timestamps();
            $table->softDeletes();

            $table->index('user_id');
            $table->index('reviewer_id');
            $table->index('created_by_id');
            $table->index('review_date');
            $table->index('status');
        });

        // Performance Goals Table
        Schema::create('performance_goals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('review_id')->constrained('performance_reviews')->onDelete('restrict');
            $table->foreignId('user_id')->constrained('users')->onDelete('restrict');
            $table->foreignId('created_by_id')->constrained('users')->onDelete('restrict');
            $table->foreignId('updated_by_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('title');
            $table->text('description');
            $table->date('due_date');
            $table->enum('status', ['pending', 'in_progress', 'completed', 'cancelled']);
            $table->decimal('progress_percentage', 5, 2)->default(0);
            $table->timestamps();

            $table->index('review_id');
            $table->index('user_id');
            $table->index('created_by_id');
            $table->index('updated_by_id');
            $table->index('status');
        });
    }

    public function down()
    {
        Schema::dropIfExists('performance_goals');
        Schema::dropIfExists('performance_reviews');
    }
}
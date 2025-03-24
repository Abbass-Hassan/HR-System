<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrganizationStructureTablesForHRSystem extends Migration
{

    public function up()
    {
        // Teams Table
        Schema::create('teams', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team_lead_id')->constrained('users');
            $table->foreignId('created_by_id')->constrained('users');
            $table->string('team_name');
            $table->text('description')->nullable();
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('team_lead_id');
            $table->index('created_by_id');
            $table->index('team_name');
            $table->index('is_active');
        });

        // Team Members Table
        Schema::create('team_members', function (Blueprint $table) {
            $table->foreignId('team_id')->constrained('teams')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('role_in_team');
            $table->date('join_date');
            $table->date('leave_date')->nullable();
            $table->timestamps();
            
            // Composite primary key
            $table->primary(['team_id', 'user_id']);

            $table->index('role_in_team');
        });

        // Position History Table
        Schema::create('position_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('position_id')->constrained('positions')->onDelete('restrict');
            $table->foreignId('department_id')->constrained('departments')->onDelete('restrict');
            $table->foreignId('previous_position_id')->nullable()->constrained('positions')->onDelete('set null');
            $table->foreignId('approved_by')->constrained('users')->onDelete('restrict');
            $table->date('effective_date');
            $table->date('end_date')->nullable();
            $table->enum('change_reason', ['hire', 'promotion', 'transfer', 'demotion', 'restructure']);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('position_id');
            $table->index('department_id');
            $table->index('previous_position_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('position_history');
        Schema::dropIfExists('team_members');
        Schema::dropIfExists('teams');
    }
}
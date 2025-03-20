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
            $table->id('team_id');
            $table->foreignId('team_lead_id')->constrained('users', 'user_id');
            $table->foreignId('created_by')->constrained('users', 'user_id');
            $table->string('team_name');
            $table->text('description')->nullable();
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Team Members Table
        Schema::create('team_members', function (Blueprint $table) {
            $table->foreignId('team_id')->constrained('teams', 'team_id');
            $table->foreignId('user_id')->constrained('users', 'user_id');
            $table->string('role_in_team');
            $table->date('join_date');
            $table->date('leave_date')->nullable();
            $table->timestamps();
            
            // Composite primary key
            $table->primary(['team_id', 'user_id']);
        });

        // Position History Table
        Schema::create('position_history', function (Blueprint $table) {
            $table->id('history_id');
            $table->foreignId('user_id')->constrained('users', 'user_id');
            $table->foreignId('position_id')->constrained('positions', 'position_id');
            $table->foreignId('department_id')->constrained('departments', 'department_id');
            $table->foreignId('previous_position_id')->nullable()->constrained('positions', 'position_id');
            $table->foreignId('approved_by')->constrained('users', 'user_id');
            $table->date('effective_date');
            $table->date('end_date')->nullable();
            $table->enum('change_reason', ['hire', 'promotion', 'transfer', 'demotion', 'restructure']);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('position_history');
        Schema::dropIfExists('team_members');
        Schema::dropIfExists('teams');
    }
}
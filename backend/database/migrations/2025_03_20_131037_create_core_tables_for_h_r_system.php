<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCoreTablesForHRSystem extends Migration
{

    public function up()
    {
        // Departments Table
        Schema::create('departments', function (Blueprint $table) {
            $table->id('department_id');
            $table->string('department_name');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Positions Table
        Schema::create('positions', function (Blueprint $table) {
            $table->id('position_id');
            $table->foreignId('department_id')->constrained('departments', 'department_id');
            $table->string('title');
            $table->text('description')->nullable();
            $table->decimal('salary', 12, 2);
            $table->json('required_skills')->nullable();
            $table->timestamps();
        });

        // Users Table
        Schema::create('users', function (Blueprint $table) {
            $table->id('user_id');
            $table->foreignId('department_id')->nullable()->constrained('departments', 'department_id');
            $table->foreignId('position_id')->nullable()->constrained('positions', 'position_id');
            $table->foreignId('manager_id')->nullable()->references('user_id')->on('users');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('phoneNb')->nullable();
            $table->enum('status', ['active', 'inactive', 'on_leave', 'terminated']);
            $table->enum('account_type', ['employee', 'hr']);
            $table->enum('hr_position', ['HR Specialist', 'HR Lead'])->nullable();
            $table->string('employee_number')->nullable();
            $table->date('hire_date')->nullable();
            $table->date('termination_date')->nullable();
            $table->string('created_by')->nullable();
            $table->string('updated_by')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        // User Details Table
        Schema::create('user_details', function (Blueprint $table) {
            $table->id('user_details_id');
            $table->foreignId('user_id')->constrained('users', 'user_id');
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('zip_code')->nullable();
            $table->timestamps();
        });

        // User Login History Table
        Schema::create('user_login_history', function (Blueprint $table) {
            $table->id('login_id');
            $table->foreignId('user_id')->constrained('users', 'user_id');
            $table->timestamp('login_timestamp');
            $table->timestamp('logout_timestamp')->nullable();
            $table->enum('login_status', ['success', 'failed']);
            $table->string('token_identifier')->nullable();
            $table->timestamps();
        });

        // Social Auths Table
        Schema::create('social_auths', function (Blueprint $table) {
            $table->id('auth_id');
            $table->foreignId('user_id')->constrained('users', 'user_id');
            $table->string('provider');
            $table->string('provider_user_id');
            $table->text('access_token');
            $table->text('refresh_token')->nullable();
            $table->timestamp('token_expires_at')->nullable();
            $table->timestamps();
        });
    }


    public function down()
    {
        Schema::dropIfExists('social_auths');
        Schema::dropIfExists('user_login_history');
        Schema::dropIfExists('user_details');
        Schema::dropIfExists('users');
        Schema::dropIfExists('positions');
        Schema::dropIfExists('departments');
    }
}
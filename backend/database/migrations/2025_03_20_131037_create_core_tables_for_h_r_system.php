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
            $table->id();
            $table->string('department_name');
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('department_name');
            $table->index('deleted_at');
        });

        // Positions Table
        Schema::create('positions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('department_id')->constrained('departments')->onDelete('restrict');
            $table->string('title');
            $table->text('description')->nullable();
            $table->decimal('salary', 12, 2);
            $table->json('required_skills')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('department_id');
            $table->index('title');
            $table->index('salary');
        });

        // Users Table
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('department_id')->nullable()->constrained('departments')->onDelete('set null');
            $table->foreignId('position_id')->nullable()->constrained('positions')->onDelete('set null');
            $table->foreignId('manager_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('google_id')->nullable();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('phone_number')->nullable();
            $table->enum('status', ['active', 'inactive', 'on_leave', 'terminated']);
            $table->enum('account_type', ['employee', 'hr']);
            $table->string('employee_number')->nullable()->unique();
            $table->date('hire_date')->nullable();
            $table->date('termination_date')->nullable();
            $table->string('created_by')->nullable();
            $table->string('updated_by')->nullable();
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();

            $table->index('department_id');
            $table->index('position_id');
            $table->index('manager_id');
            $table->index('email');
            $table->index('status');
            $table->index('account_type');
            $table->index('hire_date');
            $table->index('termination_date');
            $table->index('employee_number');
            $table->index('deleted_at');
            $table->index(['last_name', 'first_name']);
            $table->index(['department_id', 'status']);
        });

        // User Details Table
        Schema::create('user_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('zip_code')->nullable();
            $table->timestamps();

            $table->index('user_id');
        });

        // User Login History Table
        Schema::create('user_login_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->timestamp('login_timestamp');
            $table->timestamp('logout_timestamp')->nullable();
            $table->enum('login_status', ['success', 'failed']);
            $table->string('token_identifier')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('login_timestamp');
            $table->index('login_status');
        });
    }


    public function down()
    {
        Schema::dropIfExists('user_login_history');
        Schema::dropIfExists('user_details');
        Schema::dropIfExists('users');
        Schema::dropIfExists('positions');
        Schema::dropIfExists('departments');
    }
}
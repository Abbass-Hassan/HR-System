<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBenefitsManagementTablesForHRSystem extends Migration
{

    public function up()
    {
        // Benefits Plans Table
        Schema::create('benefits_plans', function (Blueprint $table) {
            $table->id('plan_id');
            $table->string('plan_name');
            $table->enum('benefit_type', ['health', 'dental', 'vision', 'life', 'retirement', 'other']);
            $table->string('provider');
            $table->text('coverage_details')->nullable();
            $table->text('cost_structure')->nullable();
            $table->decimal('employee_contribution_percentage', 5, 2)->default(0);
            $table->decimal('employer_contribution_percentage', 5, 2)->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // User Benefits Table
        Schema::create('user_benefits', function (Blueprint $table) {
            $table->id('user_benefit_id');
            $table->foreignId('user_id')->constrained('users', 'user_id');
            $table->foreignId('plan_id')->constrained('benefits_plans', 'plan_id');
            $table->date('enrollment_date');
            $table->string('coverage_level')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Benefit Claims Table
        Schema::create('benefit_claims', function (Blueprint $table) {
            $table->id('claim_id');
            $table->foreignId('user_benefit_id')->constrained('user_benefits', 'user_benefit_id');
            $table->date('claim_date');
            $table->decimal('amount', 12, 2);
            $table->text('description')->nullable();
            $table->enum('status', ['submitted', 'under_review', 'approved', 'rejected', 'paid']);
            $table->json('approval_info')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('benefit_claims');
        Schema::dropIfExists('user_benefits');
        Schema::dropIfExists('benefits_plans');
    }
}
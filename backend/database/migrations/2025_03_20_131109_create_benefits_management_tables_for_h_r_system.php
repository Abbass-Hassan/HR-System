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
            $table->id();
            $table->string('plan_name');
            $table->enum('benefit_type', ['health', 'dental', 'vision', 'life', 'retirement', 'other']);
            $table->string('provider');
            $table->text('coverage_details')->nullable();
            $table->text('cost_structure')->nullable();
            $table->decimal('employee_contribution_percentage', 5, 2)->default(0);
            $table->decimal('employer_contribution_percentage', 5, 2)->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('plan_name');
            $table->index('benefit_type');
            $table->index('provider');
            $table->index('is_active');
        });

        // User Benefits Table
        Schema::create('user_benefits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('plan_id')->constrained('benefits_plans')->onDelete('restrict');
            $table->date('enrollment_date');
            $table->string('coverage_level')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('user_id');
            $table->index('plan_id');
            $table->index('enrollment_date');
            $table->index('is_active');
            $table->unique(['user_id', 'plan_id']);
        });

        // Benefit Claims Table
        Schema::create('benefit_claims', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_benefit_id')->constrained('user_benefits')->onDelete('cascade');
            $table->date('claim_date');
            $table->decimal('amount', 12, 2);
            $table->text('description')->nullable();
            $table->enum('status', ['submitted', 'under_review', 'approved', 'rejected', 'paid']);
            $table->json('approval_info')->nullable();
            $table->timestamps();

            $table->index('user_benefit_id');
            $table->index('claim_date');
            $table->index('status');
            $table->index('amount');
        });
    }

    public function down()
    {
        Schema::dropIfExists('benefit_claims');
        Schema::dropIfExists('user_benefits');
        Schema::dropIfExists('benefits_plans');
    }
}

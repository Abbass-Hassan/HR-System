<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSalaryAndPayrollTablesForHRSystem extends Migration
{

    public function up()
    {
        // Salary Policies Table
        Schema::create('salary_policies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('created_by_id')->constrained('users')->onDelete('restrict');
            $table->string('policy_name');
            $table->text('description')->nullable();
            $table->enum('criteria_field', ['education', 'tenure', 'performance', 'role', 'certification']);
            $table->string('criteria_value');
            $table->enum('increase_type', ['percentage', 'fixed']);
            $table->decimal('increase_value', 8, 2);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index('created_by_id');
            $table->index('policy_name');
            $table->index('criteria_field');
            $table->index('is_active');
            $table->index('deleted_at');
        });

        // Salaries Table
        Schema::create('salaries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('restrict');
            $table->foreignId('approved_by_id')->constrained('users')->onDelete('restrict');
            $table->decimal('base_salary', 12, 2);
            $table->date('effective_date');
            $table->date('end_date')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('user_id');
            $table->index('base_salary');
            $table->index('deleted_at');
        });

        // Payrolls Table
        Schema::create('payrolls', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('restrict');
            $table->foreignId('salary_id')->constrained('salaries')->onDelete('restrict');
            $table->foreignId('created_by_id')->constrained('users')->onDelete('restrict');
            $table->foreignId('updated_by_id')->nullable()->constrained('users')->onDelete('set null');
            $table->date('pay_period_start');
            $table->date('pay_period_end');
            $table->date('payment_date');
            $table->decimal('overtime_hours', 8, 2)->default(0);
            $table->decimal('overtime_rate', 8, 2)->default(0);
            $table->decimal('overtime_amount', 12, 2)->default(0);
            $table->decimal('bonus_amount', 12, 2)->default(0);
            $table->decimal('gross_salary', 12, 2);
            $table->decimal('tax_deductions', 12, 2)->default(0);
            $table->decimal('benefits_deductions', 12, 2)->default(0);
            $table->decimal('other_deductions', 12, 2)->default(0);
            $table->decimal('net_salary', 12, 2);
            $table->json('calculation_details')->nullable();
            $table->enum('status', ['pending', 'processed', 'paid']);
            $table->string('payment_method')->nullable();
            $table->string('payment_reference')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('user_id');
            $table->index('salary_id');
            $table->index('created_by_id');
            $table->index('updated_by_id');
            $table->index('pay_period_start');
            $table->index('pay_period_end');
            $table->index('payment_date');
            $table->index('gross_salary');
            $table->index('net_salary');
            $table->index('status');
            $table->index('payment_method');
            $table->index('deleted_at');
        });
    }

    public function down()
    {
        Schema::dropIfExists('payrolls');
        Schema::dropIfExists('salaries');
        Schema::dropIfExists('salary_policies');
    }
}
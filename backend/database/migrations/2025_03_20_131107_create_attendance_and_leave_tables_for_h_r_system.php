<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAttendanceAndLeaveTablesForHRSystem extends Migration
{

    public function up()
    {
        // Attendance Table
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->date('date');
            $table->timestamp('clock_in')->nullable();
            $table->timestamp('clock_out')->nullable();
            $table->decimal('total_hours', 5, 2)->default(0);
            $table->string('location_status')->nullable();
            $table->string('status')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('user_id');
            $table->index('date');
            $table->index('status');

        });

        // Leave Requests Table
        Schema::create('leave_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('approver_id')->nullable()->constrained('users')->onDelete('set null');
            $table->enum('leave_type', ['vacation', 'sick', 'personal', 'maternity', 'paternity', 'bereavement', 'other']);
            $table->date('start_date');
            $table->date('end_date');
            $table->decimal('total_days', 5, 1);
            $table->decimal('balance', 5, 1)->default(14.0);
            $table->date('requested_date');
            $table->enum('status', ['pending', 'approved', 'rejected', 'cancelled']);
            $table->text('reason')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->date('approval_date')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('user_id');
            $table->index('approver_id');
            $table->index('leave_type');
            $table->index('start_date');
            $table->index('end_date');
            $table->index('status');
            $table->index('balance');
        });
    }

    public function down()
    {
        Schema::dropIfExists('leave_requests');
        Schema::dropIfExists('attendances');
    }
}
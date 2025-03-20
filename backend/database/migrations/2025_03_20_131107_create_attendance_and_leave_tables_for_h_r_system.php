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
            $table->id('attendance_id');
            $table->foreignId('user_id')->constrained('users', 'user_id');
            $table->date('date');
            $table->timestamp('clock_in')->nullable();
            $table->timestamp('clock_out')->nullable();
            $table->decimal('total_hours', 5, 2)->default(0);
            $table->string('location_status')->nullable();
            $table->string('status')->nullable();
            $table->timestamps();
        });

        // Leave Requests Table
        Schema::create('leave_requests', function (Blueprint $table) {
            $table->id('request_id');
            $table->foreignId('user_id')->constrained('users', 'user_id');
            $table->foreignId('approver_id')->nullable()->constrained('users', 'user_id');
            $table->enum('leave_type', ['vacation', 'sick', 'personal', 'maternity', 'paternity', 'bereavement', 'other']);
            $table->date('start_date');
            $table->date('end_date');
            $table->enum('status', ['pending', 'approved', 'rejected', 'cancelled']);
            $table->text('reason')->nullable();
            $table->date('approved_date')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('leave_requests');
        Schema::dropIfExists('attendances');
    }
}
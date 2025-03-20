<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDocumentManagementTablesForHRSystem extends Migration
{

    public function up()
    {
        // Document Types Table
        Schema::create('document_types', function (Blueprint $table) {
            $table->id('type_id');
            $table->string('type_name');
            $table->text('description')->nullable();
            $table->integer('max_size')->nullable();
            $table->boolean('is_required_for_onboarding')->default(false);
            $table->boolean('is_sensitive')->default(false);
            $table->timestamps();
        });

        // Document Folders Table
        Schema::create('document_folders', function (Blueprint $table) {
            $table->id('folder_id');
            $table->string('folder_name');
            $table->foreignId('owner_id')->constrained('users', 'user_id');
            $table->string('folder_path');
            $table->timestamps();
        });

        // User Documents Table
        Schema::create('user_documents', function (Blueprint $table) {
            $table->id('document_id');
            $table->foreignId('user_id')->constrained('users', 'user_id');
            $table->foreignId('folder_id')->constrained('document_folders', 'folder_id');
            $table->foreignId('type_id')->constrained('document_types', 'type_id');
            $table->string('document_name');
            $table->string('document_path');
            $table->integer('document_size');
            $table->timestamp('upload_date');
            $table->timestamp('expiration_date')->nullable();
            $table->integer('reference_id')->nullable();
            $table->string('reference_type')->nullable();
            $table->timestamps();
        });

        // Approvals Table
        Schema::create('approvals', function (Blueprint $table) {
            $table->id('approval_id');
            $table->enum('approval_type', ['salary_change', 'position_change', 'leave_request', 'expense', 'training']);
            $table->enum('status', ['pending', 'approved', 'rejected', 'cancelled']);
            $table->foreignId('requestor_id')->constrained('users', 'user_id');
            $table->foreignId('approver_id')->constrained('users', 'user_id');
            $table->date('request_date');
            $table->date('response_date')->nullable();
            $table->integer('reference_id');
            $table->string('reference_type');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('approvals');
        Schema::dropIfExists('user_documents');
        Schema::dropIfExists('document_folders');
        Schema::dropIfExists('document_types');
    }
}
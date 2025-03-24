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
            $table->id();
            $table->string('type_name');
            $table->text('description')->nullable();
            $table->integer('max_size')->nullable();
            $table->boolean('is_required_for_onboarding')->default(false);
            $table->boolean('is_sensitive')->default(false);
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('type_name');
            $table->index('is_required_for_onboarding');
            $table->index('is_sensitive');
            $table->index('deleted_at');

        });

        // Document Folders Table
        Schema::create('document_folders', function (Blueprint $table) {
            $table->id();
            $table->string('folder_name');
            $table->foreignId('owner_id')->constrained('users')->onDelete('restrict');
            $table->string('folder_path');
            $table->timestamps();
            $table->softDeletes();

            $table->index('folder_name');
            $table->index('owner_id');
            $table->index('folder_path');
            $table->index('deleted_at');
        });

        // User Documents Table
        Schema::create('user_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('folder_id')->constrained('document_folders')->onDelete('restrict');
            $table->foreignId('type_id')->constrained('document_types')->onDelete('restrict');
            $table->foreignId('uploaded_by_id')->constrained('users')->onDelete('restrict');
            $table->string('document_name');
            $table->string('document_path');
            $table->integer('document_size');
            $table->timestamp('upload_date');
            $table->timestamp('expiration_date')->nullable();
            $table->integer('reference_id')->nullable();
            $table->string('reference_type')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('user_id');
            $table->index('folder_id');
            $table->index('type_id');
            $table->index('uploaded_by_id');
            $table->index('document_name');
            $table->index('upload_date');
            $table->index('expiration_date');
        });

        // Approvals Table
        Schema::create('approvals', function (Blueprint $table) {
            $table->id();
            $table->enum('approval_type', ['salary_change', 'position_change', 'leave_request', 'expense', 'training']);
            $table->enum('status', ['pending', 'approved', 'rejected', 'cancelled']);
            $table->foreignId('requestor_id')->constrained('users')->onDelete('restrict');
            $table->foreignId('approver_id')->constrained('users')->onDelete('restrict');
            $table->date('request_date');
            $table->date('response_date')->nullable();
            $table->integer('reference_id');
            $table->string('reference_type');
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('approval_type');
            $table->index('status');
            $table->index('requestor_id');
            $table->index('approver_id');
            $table->index('request_date');
            $table->index('response_date');
            $table->index('deleted_at');
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
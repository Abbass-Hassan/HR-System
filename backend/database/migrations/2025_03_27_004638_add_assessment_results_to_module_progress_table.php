<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAssessmentResultsToModuleProgressTable extends Migration
{
    public function up()
    {
        Schema::table('module_progress', function (Blueprint $table) {
            $table->text('assessment_results')->nullable()->after('assessment_date');
        });
    }

    public function down()
    {
        Schema::table('module_progress', function (Blueprint $table) {
            $table->dropColumn('assessment_results');
        });
    }
}
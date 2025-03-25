<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ModuleProgress extends Model
{
    /** @use HasFactory<\Database\Factories\ModuleAssessmentFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'enrollment_id',
        'module_id',
        'is_completed',
        'last_accessed',
        'completion_date',
        'assessment_completed',
        'assessment_score',
        'assessment_passed',
        'assessment_date'
    ];

    protected $casts = [
        'is_completed' => 'boolean',
        'last_accessed' => 'datetime',
        'completion_date' => 'datetime',
        'assessment_completed' => 'boolean',
        'assessment_score' => 'integer',
        'assessment_passed' => 'boolean',
        'assessment_date' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function enrollment(){
        return $this->belongsTo(CourseEnrollment::class, 'enrollment_id');
    }

    public function module(){
        return $this->belongsTo(CourseModule::class, 'module_id');
    }

    public function scopeCompleted($query){
        return $query->where('is_completed', true);
    }
    
    public function scopeAssessmentPassed($query){
        return $query->where('assessment_passed', true);
    }
    
    public function scopeRecentlyAccessed($query, $hours = 24){
        return $query->whereNotNull('last_accessed')
                    ->where('last_accessed', '>=', now()->subHours($hours));
    }

}

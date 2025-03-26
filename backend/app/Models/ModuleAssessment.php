<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ModuleAssessment extends Model
{
    /** @use HasFactory<\Database\Factories\ModuleAssessmentFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'module_id',
        'title',
        'instructions',
        'time_limit',
        'passing_score',
        'max_attempts'
    ];

    protected $casts = [
        'time_limit' => 'integer',
        'passing_score' => 'integer',
        'max_attempts' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function module(){
        return $this->belongsTo(CourseModule::class, 'module_id');
    }

    public function questions(){
        return $this->hasMany(AssessmentQuestion::class, 'assessment_id');
    }

    public function scopeByPassingScore($query, $score){
        return $query->where('passing_score', '>=', $score);
    }
}

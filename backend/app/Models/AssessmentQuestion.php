<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AssessmentQuestion extends Model
{
    /** @use HasFactory<\Database\Factories\ModuleAssessmentFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'assessment_id',
        'question_text',
        'question_type',
        'options',
        'correct_answer',
        'points'
    ];

    protected $casts = [
        'options' => 'json',
        'points' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function assessment(){
        return $this->belongsTo(ModuleAssessment::class, 'assessment_id');
    }

    public function scopeByType($query, $type){
        return $query->where('question_type', $type);
    }

    public function scopeByPointValue($query, $points) {
        return $query->where('points', $points);
    }
}

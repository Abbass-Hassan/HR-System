<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CourseModule extends Model
{
    /** @use HasFactory<\Database\Factories\CourseModuleFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'course_id',
        'module_name',
        'description',
        'content_type',
        'content',
        'content_url',
        'has_assessment'
    ];

    protected $casts = [
        'has_assessment' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function course(){
        return $this->belongsTo(Course::class);
    }

    public function assessment(){
        return $this->hasOne(ModuleAssessment::class, 'module_id');
    }

    public function progress (){
        return $this->hasMany(ModuleProgress::class, 'module_id');
    }

    public function scopeByCOntentType($query, $type){
        return $query->where('Content_type', $type);
    }


}

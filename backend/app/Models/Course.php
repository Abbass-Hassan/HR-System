<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Course extends Model
{
    /** @use HasFactory<\Database\Factories\CourseFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'course_name',
        'description',
        'provider',
        'duration',
        'status'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function modules(){
        return $this->hasMany(CourseModule::class);
    }

    public function enrollments(){
        return $this->hasMany(CourseEnrollment::class);
    }

    public function scopeActive($query){
        return $query->where('status', 'active');
    }

    public function scopeByProvider($query, $provider){
        return $query->where('provider', $provider);
    }
}

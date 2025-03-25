<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CourseEnrollment extends Model
{
    /** @use HasFactory<\Database\Factories\ModuleAssessmentFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'course_id',
        'enrollment_date',
        'completion_percentage',
        'status',
        'completion_date',
        'expiry_date',
        'renewal_required',
        'renewal_date',
        'score',
        'feedback',
        'certificate_url'
    ];

    protected $casts = [
        'enrollment_date' => 'date',
        'completion_date' => 'date',
        'expiry_date' => 'date',
        'renewal_required' => 'boolean',
        'renewal_date' => 'date',
        'completion_percentage' => 'decimal:2',
        'score' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }
    
    public function course(){
        return $this->belongsTo(Course::class);
    }

    public function moduleProgress(){
        return $this->belongsTo(ModuleProgress::class, 'enrollment_id');
    }

    public function scopeCompleted($query){
        return $query->where('status', 'completed');
    }

    public function scopeInProgress($query){
        return $query->where('status', 'in_progress');
    }

    public function scopeEnrollmentRecently($query, $days=30){
        return $query->whereDate('enrollment_date', '>=', Carbon::now()->subDays($days));
    }

    public function scopeRequiringRenewal($query){
        return $query->where('renewal_required', true)
                    ->whereDate('renewal_date', '<=', Carbon::now()->addDays(30));
    }
}

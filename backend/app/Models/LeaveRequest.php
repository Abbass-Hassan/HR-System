<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class LeaveRequest extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'approver_id',
        'leave_type',
        'start_date',
        'end_date',
        'total_days',
        'balance',
        'requested_date',
        'status',
        'reason',
        'rejection_reason',
        'approval_date'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'requested_date' => 'date',
        'approval_date' => 'date',
        'total_days' => 'decimal:1',
        'balance' => 'decimal:1'
    ];

    // Relationship with User (the employee)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relationship with Approver (usually HR or manager)
    public function approver()
    {
        return $this->belongsTo(User::class, 'approver_id');
    }

    // Scope for pending requests
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    // Scope for approved requests
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    // Scope for rejected requests
    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    // Scope for leave within a date range
    public function scopeWithinDateRange($query, $startDate, $endDate)
    {
        return $query->where(function($q) use ($startDate, $endDate) {
            $q->whereBetween('start_date', [$startDate, $endDate])
              ->orWhereBetween('end_date', [$startDate, $endDate])
              ->orWhere(function($q2) use ($startDate, $endDate) {
                  $q2->where('start_date', '<=', $startDate)
                     ->where('end_date', '>=', $endDate);
              });
        });
    }

    // Scope for upcoming leaves
    public function scopeUpcoming($query)
    {
        return $query->where('start_date', '>', Carbon::now())
                     ->where('status', 'approved');
    }

    // Scope for ongoing leaves
    public function scopeOngoing($query)
    {
        $today = Carbon::now()->toDateString();
        return $query->where('start_date', '<=', $today)
                     ->where('end_date', '>=', $today)
                     ->where('status', 'approved');
    }

    // Scope for leave by type
    public function scopeByType($query, $type)
    {
        return $query->where('leave_type', $type);
    }

    public static function calculateBusinessDays($startDate, $endDate)
    {
        $days = 0;
        $current = Carbon::parse($startDate)->copy();
        
        while ($current->lte($endDate)) {
            if ($current->dayOfWeek !== 0 && $current->dayOfWeek !== 6) {
                $days++;
            }
            $current->addDay();
        }
        
        return $days;
    }

    public static function getUserLeaveBalance($userId)
    {
        $defaultBalance = 14.0;

        $usedLeave = self::where('user_id', $userId)
            ->where('status', 'approved')
            ->where('leave_type', 'vacation')
            ->whereYear('start_date', Carbon::now()->year)
            ->sum('total_days');
        
        return $defaultBalance - $usedLeave;
    }

    public function hasOverlap()
    {
        if (!$this->user_id || !$this->start_date || !$this->end_date) {
            return false;
        }
        
        $query = self::where('user_id', $this->user_id)
                     ->where('status', 'approved');

        if ($this->id) {
            $query->where('id', '!=', $this->id);
        }
                     
        return $query->where(function($q) {
                $q->whereBetween('start_date', [$this->start_date, $this->end_date])
                  ->orWhereBetween('end_date', [$this->start_date, $this->end_date])
                  ->orWhere(function($q2) {
                      $q2->where('start_date', '<=', $this->start_date)
                         ->where('end_date', '>=', $this->end_date);
                  });
            })->exists();
    }
}
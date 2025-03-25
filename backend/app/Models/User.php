<?php

namespace App\Models;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\UserDetails;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;


class User extends Authenticatable implements JWTSubject{
    use HasFactory, Notifiable;

    protected $hidden = [
        'password',
        'email',
        'remember_token',
    ];

    protected function casts(): array{
        return [
            'email_verified_at' => 'datetime',
        ];
    }

    public function getJWTIdentifier(){
        return $this->getKey();
    }

    public function getJWTCustomClaims(){
        return [
        'id'=> $this->id,
        'email' => $this->email,
        'account_type' => $this->account_type,
        "department_id"=> $this->department_id,
        "position_id"=> $this->position_id,
        "manager_id"=> $this->manager_id,
        "first_name"=> $this->first_name,
        "last_name"=> $this->last_name,
        "phone_number"=> $this->phone_number,
        "status"=> $this->status,
        "employee_number"=>$this->employee_number,
        "hire_date"=> $this->hire_date,
        "termination_date"=> $this->termination_date,
        "created_by"=> $this->created_by,
        "updated_by"=> $this->updated_by,
        ];
    }

    public function userdetail(){
        return $this->hasOne(UserDetail::class);
    }

    public function userLoginHistorys(){
        return $this->hasMany(UserLoginHistory::class);
    }

    public function department(){
        return $this->belongsTo(Department::class);
    }

    public function position(){
        return $this->belongsTo(Position::class);
    }

    /**
     * Get the attendances for the user.
     */
    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    /**
     * Get today's attendance record for the user.
     */
    public function todayAttendance()
    {
        return $this->hasOne(Attendance::class)
            ->whereDate('date', now()->toDateString());
    }


    /**
     * Get the documents uploaded by the user.
     */
    public function documents()
    {
        return $this->hasMany(Document::class);
    }

    /**
     * Get the documents reviewed by the user.
     */
    public function reviewedDocuments()
    {
        return $this->hasMany(Document::class, 'reviewed_by');
    }
}
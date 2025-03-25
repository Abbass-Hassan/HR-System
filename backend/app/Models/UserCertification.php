<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserCertification extends Model
{
    /** @use HasFactory<\Database\Factories\ModuleAssessmentFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'certification_id',
        'document_id',
        'issue_date',
        'expiry_date',
        'certificate_number',
        'verification_status'
    ];

    protected $casts = [
        'issue_date' => 'date',
        'expiry_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function certification(){
        return $this->belongsTo(Certification::class);
    }

    public function document(){
        // return $this->belongsTo(UserDocument::class, 'document_id');
        return $this->belongsTo(Model::class, 'document_id')->where('deleted_at', null);
    }

    public function scopeActive($query){
        return $query->whereDate('expiry_date', '>', Carbon::now())
                    ->orWhereNull('expiry_date');
    }
    
    public function scopeExpiring($query, $days = 30){
        return $query->whereNotNull('expiry_date')
                    ->whereDate('expiry_date', '<=', Carbon::now()->addDays($days))
                    ->whereDate('expiry_date', '>', Carbon::now());
    }
    
    public function scopeVerified($query){
        return $query->where('verification_status', 'verified');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Certification extends Model
{
    /** @use HasFactory<\Database\Factories\ModuleAssessmentFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'ceertification_name',
        'issuing_organization',
        'validity_period'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function userCertification(){
        return $this->hasMany(UserCertification::class);
    }

    public function scopeByOrganization($query, $organization){
        return $query->where('issuing_organization', $organization);
    }
}

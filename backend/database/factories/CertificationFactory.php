<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Certification;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Certification>
 */
class CertificationFactory extends Factory
{
    protected $model = Certification::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(){
        $organizations = [
            'Microsoft', 'Oracle', 'Cisco', 'CompTIA', 'AWS', 'Google', 
            'PMI', 'Salesforce', 'Adobe', 'IBM', 'HubSpot', 'HR Certification Institute'
        ];
        
        $validityPeriods = ['1 year', '2 years', '3 years', '5 years', 'Lifetime'];
        
        return [
            'certification_name' => fake()->unique()->sentence(3),
            'issuing_organization' => fake()->randomElement($organizations),
            'validity_period' => fake()->randomElement($validityPeriods),
            'created_at' => fake()->dateTimeBetween('-2 years', 'now'),
            'updated_at' => function (array $attributes) {
                return fake()->dateTimeBetween($attributes['created_at'], 'now');
            }
        ];
    }

    public function technical(){
        return $this->state(function (array $attributes){
            $techs = ['AWS Certified Solutions Architect', 'Microsoft Certified: Azure Administrator', 
                     'Google Cloud Certified Professional', 'Cisco Certified Network Professional',
                     'CompTIA Security+', 'Oracle Certified Professional'];

            $techOrgs = ['AWS', 'Microsoft', 'Google', 'Cisco', 'CompTIA', 'Oracle'];
            
            return [
                'certification_name' => fake()->randomElement($techs),
                'issuing_organization' => fake()->randomElement($techOrgs),
            ];
        });
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RentalCompany;
use App\Models\CompanyVehicle;
use App\Models\CompanyContact;

class RentalCompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create sample rental company
        $company = RentalCompany::create([
            'name' => 'Emirates Premier Rentals',
            'description' => 'Premium vehicle rental service in Dubai with luxury and economy options.',
            'primary_email' => 'info@emiratespremier.ae',
            'primary_phone' => '+971-4-123-4567',
            'website' => 'https://emiratespremier.ae',
            'address' => 'Sheikh Zayed Road, Financial District',
            'city' => 'Dubai',
            'state' => 'Dubai',
            'country' => 'UAE',
            'services_offered' => ['car_rental', 'luxury_rental', 'chauffeur_service'],
            'coverage_areas' => ['Dubai', 'Abu Dhabi', 'Sharjah'],
            'offers_insurance' => true,
            'offers_delivery' => true,
            'delivery_fee' => 50.00,
            'security_deposit' => 1000.00,
            'payment_methods' => ['cash', 'card', 'bank_transfer'],
            'currency' => 'AED',
            'business_hours' => [
                'monday' => '08:00-20:00',
                'tuesday' => '08:00-20:00',
                'wednesday' => '08:00-20:00',
                'thursday' => '08:00-20:00',
                'friday' => '08:00-20:00',
                'saturday' => '09:00-18:00',
                'sunday' => '09:00-18:00',
            ],
            'rating' => 4.8,
            'total_reviews' => 245,
            'is_active' => true,
            'is_verified' => true,
            'is_featured' => true,
        ]);

        // Add sample vehicle
        CompanyVehicle::create([
            'rental_company_id' => $company->id,
            'vehicle_type' => 'Luxury',
            'brand' => 'Mercedes',
            'model' => 'S-Class',
            'year' => '2024',
            'color' => 'Black',
            'seats' => 5,
            'fuel_type' => 'Gasoline',
            'transmission' => 'Automatic',
            'features' => ['GPS Navigation', 'Leather Seats', 'Sunroof'],
            'daily_rate' => 800.00,
            'weekly_rate' => 5000.00,
            'monthly_rate' => 18000.00,
            'security_deposit' => 2000.00,
            'status' => 'available',
            'is_active' => true,
        ]);

        // Add sample contact
        CompanyContact::create([
            'rental_company_id' => $company->id,
            'name' => 'Ahmed Al Mansouri',
            'title' => 'General Manager',
            'contact_type' => 'primary',
            'email' => 'ahmed.mansouri@emiratespremier.ae',
            'phone' => '+971-4-123-4567',
            'mobile' => '+971-50-123-4567',
            'languages_spoken' => ['English', 'Arabic'],
            'is_active' => true,
            'is_primary' => true,
            'priority_level' => 1,
        ]);
    }
}

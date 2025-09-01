<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\AssetLocation;

class AssetLocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $locations = [
            [
                'name' => 'Main Office',
                'description' => 'Primary office building and headquarters',
                'building' => 'Main Building',
                'floor' => 'Ground Floor',
                'area' => 'Office Area',
                'sort_order' => 1,
            ],
            [
                'name' => 'Training Center',
                'description' => 'Main training and conference facility',
                'building' => 'Training Building',
                'floor' => '1st Floor',
                'area' => 'Conference Halls',
                'sort_order' => 2,
            ],
            [
                'name' => 'Computer Lab',
                'description' => 'IT training and computer laboratory',
                'building' => 'Training Building',
                'floor' => '2nd Floor',
                'area' => 'Computer Lab',
                'sort_order' => 3,
            ],
            [
                'name' => 'Kitchen & Dining',
                'description' => 'Catering kitchen and dining facilities',
                'building' => 'Main Building',
                'floor' => 'Ground Floor',
                'area' => 'Kitchen Area',
                'sort_order' => 4,
            ],
            [
                'name' => 'Storage Room A',
                'description' => 'General storage and supplies',
                'building' => 'Main Building',
                'floor' => 'Basement',
                'area' => 'Storage',
                'sort_order' => 5,
            ],
            [
                'name' => 'Storage Room B',
                'description' => 'Equipment and furniture storage',
                'building' => 'Main Building',
                'floor' => 'Basement',
                'area' => 'Storage',
                'sort_order' => 6,
            ],
            [
                'name' => 'Maintenance Workshop',
                'description' => 'Equipment maintenance and repair area',
                'building' => 'Service Building',
                'floor' => 'Ground Floor',
                'area' => 'Workshop',
                'sort_order' => 7,
            ],
            [
                'name' => 'Parking Garage',
                'description' => 'Vehicle parking and storage',
                'building' => 'Parking Structure',
                'floor' => 'All Levels',
                'area' => 'Parking',
                'sort_order' => 8,
            ],
            [
                'name' => 'Reception Area',
                'description' => 'Main reception and waiting area',
                'building' => 'Main Building',
                'floor' => 'Ground Floor',
                'area' => 'Reception',
                'sort_order' => 9,
            ],
            [
                'name' => 'Executive Office',
                'description' => 'Executive and management offices',
                'building' => 'Main Building',
                'floor' => '1st Floor',
                'area' => 'Executive Suite',
                'sort_order' => 10,
            ],
        ];

        foreach ($locations as $location) {
            AssetLocation::create($location);
        }
    }
}

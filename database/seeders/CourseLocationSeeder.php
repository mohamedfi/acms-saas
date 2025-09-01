<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\CourseLocation;

class CourseLocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $locations = [
            [
                'name' => 'PMEC Main Training Center',
                'type' => 'training_center',
                'description' => 'Primary training facility with modern equipment and multiple classrooms',
                'address' => '123 Training Street',
                'city' => 'Cairo',
                'country' => 'Egypt',
                'building' => 'Main Building',
                'floor' => '1st Floor',
                'room' => 'Training Hall A',
                'capacity' => 50,
                'facilities' => ['Projector', 'Whiteboard', 'Audio System', 'WiFi', 'Coffee Station'],
                'contact_person' => 'Training Coordinator',
                'contact_email' => 'training@pmec.com',
                'contact_phone' => '+20-2-1234-5678',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'PMEC Executive Office',
                'type' => 'office',
                'description' => 'Main administrative office for management and coordination',
                'address' => '456 Business Avenue',
                'city' => 'Cairo',
                'country' => 'Egypt',
                'building' => 'Executive Tower',
                'floor' => '15th Floor',
                'room' => 'Suite 1501',
                'capacity' => 25,
                'facilities' => ['Conference Room', 'Meeting Rooms', 'Executive Lounge', 'WiFi'],
                'contact_person' => 'Office Manager',
                'contact_email' => 'office@pmec.com',
                'contact_phone' => '+20-2-1234-5679',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Alexandria Training Center',
                'type' => 'training_center',
                'description' => 'Regional training facility serving Alexandria and surrounding areas',
                'address' => '789 Coastal Road',
                'city' => 'Alexandria',
                'country' => 'Egypt',
                'building' => 'Coastal Building',
                'floor' => 'Ground Floor',
                'room' => 'Main Hall',
                'capacity' => 40,
                'facilities' => ['Projector', 'Whiteboard', 'Audio System', 'WiFi', 'Parking'],
                'contact_person' => 'Regional Coordinator',
                'contact_email' => 'alexandria@pmec.com',
                'contact_phone' => '+20-3-1234-5678',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Luxor Conference Center',
                'type' => 'conference_room',
                'description' => 'Premium conference facility for high-profile events and workshops',
                'address' => '321 Nile View Street',
                'city' => 'Luxor',
                'country' => 'Egypt',
                'building' => 'Nile View Complex',
                'floor' => '2nd Floor',
                'room' => 'Conference Hall',
                'capacity' => 100,
                'facilities' => ['Large Projector', 'Sound System', 'Stage', 'Catering Kitchen', 'WiFi'],
                'contact_person' => 'Event Manager',
                'contact_email' => 'events@pmec.com',
                'contact_phone' => '+20-97-1234-5678',
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'Hilton Cairo Hotel',
                'type' => 'hotel',
                'description' => 'Premium hotel venue for executive training and international events',
                'address' => '654 Nile Corniche',
                'city' => 'Cairo',
                'country' => 'Egypt',
                'building' => 'Hilton Cairo',
                'floor' => 'Conference Level',
                'room' => 'Grand Ballroom',
                'capacity' => 200,
                'facilities' => ['Professional AV', 'Catering', 'Accommodation', 'WiFi', 'Valet Parking'],
                'contact_person' => 'Sales Manager',
                'contact_email' => 'sales@hiltoncairo.com',
                'contact_phone' => '+20-2-2345-6789',
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'name' => 'Client Site - PetroTech HQ',
                'type' => 'client_site',
                'description' => 'On-site training at client headquarters for specialized programs',
                'address' => '987 Industrial Zone',
                'city' => 'Suez',
                'country' => 'Egypt',
                'building' => 'PetroTech Building',
                'floor' => 'Training Floor',
                'room' => 'Corporate Training Room',
                'capacity' => 30,
                'facilities' => ['Client Equipment', 'Projector', 'Whiteboard', 'WiFi'],
                'contact_person' => 'Training Manager',
                'contact_email' => 'training@petrotech.com',
                'contact_phone' => '+20-62-1234-5678',
                'is_active' => true,
                'sort_order' => 6,
            ],
        ];

        foreach ($locations as $location) {
            CourseLocation::create($location);
        }

        $this->command->info('Course locations seeded successfully!');
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\MealBreakPlan;
use App\Models\MealBreakPlanItem;
use App\Models\Course;
use App\Models\User;
use Carbon\Carbon;

class MealBreakPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first user as creator
        $user = User::first();

        if (!$user) {
            $this->command->info('No users found. Please run UserSeeder first.');
            return;
        }

        // Get some courses for the meal items
        $courses = Course::take(5)->get();
        
        if ($courses->isEmpty()) {
            $this->command->info('No courses found. Please run CourseSeeder first.');
            return;
        }

        // Create a comprehensive 7-day meal break plan
        $mealPlan = MealBreakPlan::create([
            'name' => 'Weekly Training Program - August 2025',
            'description' => 'Complete 7-day meal plan with breakfast, lunch, and dinner for intensive training week',
            'start_date' => '2025-08-18', // Monday
            'end_date' => '2025-08-24',   // Sunday
            'total_days' => 7,
            'total_delivery_cost' => 0,
            'total_food_cost' => 0,
            'grand_total' => 0,
            'status' => 'draft',
            'created_by' => $user->id,
            'notes' => 'Comprehensive weekly meal plan with 3 meals per day. Includes dietary considerations and cost optimization.',
        ]);

        // Define the week structure
        $weekDays = [
            'Monday' => ['Breakfast', 'Lunch', 'Dinner'],
            'Tuesday' => ['Breakfast', 'Lunch', 'Dinner'],
            'Wednesday' => ['Breakfast', 'Lunch', 'Dinner'],
            'Thursday' => ['Breakfast', 'Lunch', 'Dinner'],
            'Friday' => ['Breakfast', 'Lunch', 'Dinner'],
            'Saturday' => ['Breakfast', 'Lunch', 'Dinner'],
            'Sunday' => ['Breakfast', 'Lunch', 'Dinner'],
        ];

        // Sample meal data
        $mealData = [
            'Breakfast' => [
                'courses' => ['Basic Training Course', 'Leadership Skills', 'Project Management'],
                'costs' => [25.00, 30.00, 35.00],
                'participants' => [15, 12, 18],
                'suppliers' => ['Café Alexandria', 'Morning Delights', 'Sunrise Catering'],
                'locations' => ['مكانك إسكندرية', 'مكانك مدينة نصر', 'الدقي'],
                'departments' => ['إدارة الموارد', 'المشروعات', 'إدارة المواد'],
            ],
            'Lunch' => [
                'courses' => ['Advanced Training Course', 'Team Building', 'Communication Skills'],
                'costs' => [45.00, 40.00, 38.00],
                'participants' => [20, 25, 22],
                'suppliers' => ['Al-Azhar Restaurant', 'Business Square Café', 'Training Center Kitchen'],
                'locations' => ['Business Square', 'BDC', 'الرحاب'],
                'departments' => ['التمريض', 'إدارة المشروعات', 'تنمية مهارات وادارية'],
            ],
            'Dinner' => [
                'courses' => ['Evening Workshop', 'Networking Session', 'Skill Assessment'],
                'costs' => [35.00, 28.00, 32.00],
                'participants' => [18, 20, 16],
                'suppliers' => ['Evening Delights', 'Professional Catering', 'Quality Meals'],
                'locations' => ['الطارق العلي', 'مكانك إسكندرية', 'الدقي'],
                'departments' => ['إدارة الموارد', 'المشروعات', 'إدارة المواد'],
            ],
        ];

        $totalFoodCost = 0;
        $totalDeliveryCost = 0;

        // Create meal items for each day and meal
        foreach ($weekDays as $day => $meals) {
            foreach ($meals as $mealIndex => $mealType) {
                $mealInfo = $mealData[$mealType];
                $courseIndex = $mealIndex % count($mealInfo['courses']);
                $course = $courses[$courseIndex % $courses->count()];
                
                $cost = $mealInfo['costs'][$courseIndex % count($mealInfo['costs'])];
                $participants = $mealInfo['participants'][$courseIndex % count($mealInfo['participants'])];
                $supplier = $mealInfo['suppliers'][$courseIndex % count($mealInfo['suppliers'])];
                $location = $mealInfo['locations'][$courseIndex % count($mealInfo['locations'])];
                $department = $mealInfo['departments'][$courseIndex % count($mealInfo['departments'])];
                
                // Calculate delivery cost (one per supplier per day)
                $deliveryCost = ($mealIndex === 0) ? 15.00 : 0; // Only charge delivery once per day
                
                $total = ($cost * $participants) + $deliveryCost;
                
                MealBreakPlanItem::create([
                    'meal_break_plan_id' => $mealPlan->id,
                    'name' => $mealInfo['courses'][$courseIndex % count($mealInfo['courses'])],
                    'cost' => $cost,
                    'delivery_cost' => $deliveryCost,
                    'location' => $location,
                    'department' => $department,
                    'course_id' => $course->id,
                    'quantity' => $participants,
                    'supplier' => $supplier,
                    'day' => $day,
                    'total' => $total,
                ]);
                
                $totalFoodCost += ($cost * $participants);
                $totalDeliveryCost += $deliveryCost;
            }
        }

        // Update the meal plan with calculated totals
        $mealPlan->update([
            'total_food_cost' => $totalFoodCost,
            'total_delivery_cost' => $totalDeliveryCost,
            'grand_total' => $totalFoodCost + $totalDeliveryCost,
        ]);

        // Create additional sample plans
        MealBreakPlan::create([
            'name' => 'September 2025 Workshop Series',
            'description' => 'Monthly workshop meal planning with focus on healthy options',
            'start_date' => '2025-09-01',
            'end_date' => '2025-09-07',
            'total_days' => 7,
            'total_delivery_cost' => 105.00,
            'total_food_cost' => 2100.00,
            'grand_total' => 2205.00,
            'status' => 'active',
            'created_by' => $user->id,
            'notes' => 'Weekly workshop series with balanced meal options and dietary accommodations.',
        ]);

        MealBreakPlan::create([
            'name' => 'October 2025 Executive Training',
            'description' => 'Premium meal service for executive leadership program',
            'start_date' => '2025-10-06',
            'end_date' => '2025-10-12',
            'total_days' => 7,
            'total_delivery_cost' => 140.00,
            'total_food_cost' => 3500.00,
            'grand_total' => 3640.00,
            'status' => 'draft',
            'created_by' => $user->id,
            'notes' => 'Executive-level meal planning with premium catering and special dietary requirements.',
        ]);

        $this->command->info('✅ Sample meal break plans created successfully!');
        $this->command->info('📊 Created 7-day meal plan with 21 meals (3 per day)');
        $this->command->info('💰 Total Food Cost: EGP ' . number_format($totalFoodCost, 2));
        $this->command->info('🚚 Total Delivery Cost: EGP ' . number_format($totalDeliveryCost, 2));
        $this->command->info('💵 Grand Total: EGP ' . number_format($totalFoodCost + $totalDeliveryCost, 2));
    }
}

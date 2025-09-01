<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Transaction;
use App\Models\Account;
use App\Models\FinancialCategory;
use App\Models\User;
use Carbon\Carbon;

class CourseTransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first user (admin) for user_id
        $user = User::first();
        if (!$user) {
            $this->command->error('No users found. Please run UserSeeder first.');
            return;
        }

        // Get the main business account
        $mainAccount = Account::where('name', 'Main Business Account')->first();
        if (!$mainAccount) {
            $this->command->error('Main Business Account not found. Please run AccountSeeder first.');
            return;
        }

        // Get financial categories
        $courseFees = FinancialCategory::where('name', 'course_fees')->first();
        $consulting = FinancialCategory::where('name', 'consulting')->first();
        $personnel = FinancialCategory::where('name', 'personnel')->first();
        $trainingMaterials = FinancialCategory::where('name', 'training_materials')->first();
        $travel = FinancialCategory::where('name', 'travel')->first();
        $utilities = FinancialCategory::where('name', 'utilities')->first();
        $catering = FinancialCategory::where('name', 'catering_costs')->first();

        if (!$courseFees || !$consulting || !$personnel || !$trainingMaterials || !$travel || !$utilities || !$catering) {
            $this->command->error('Required financial categories not found. Please run FinancialCategorySeeder first.');
            return;
        }

        $transactions = [
            // ===== COURSE INCOME TRANSACTIONS =====

            // Sample 1: Course Fee Income
            [
                'reference_number' => 'INV-2024-001',
                'type' => 'income',
                'amount' => 5000.00,
                'currency' => 'USD',
                'transaction_date' => Carbon::now()->subDays(5),
                'description' => 'Advanced Project Management Course - Dubai Batch 2024',
                'notes' => 'Full payment received for 20 participants',
                'account_id' => $mainAccount->id,
                'category_id' => $courseFees->id,
                'user_id' => $user->id,
                'related_type' => 'course',
                'related_id' => 1,
                'status' => 'completed',
                'metadata' => json_encode([
                    'participants' => 20,
                    'course_duration' => '3 days',
                    'location' => 'Dubai',
                    'course_type' => 'Project Management'
                ])
            ],

            // Sample 2: Consulting Income
            [
                'reference_number' => 'INV-2024-002',
                'type' => 'income',
                'amount' => 3500.00,
                'currency' => 'USD',
                'transaction_date' => Carbon::now()->subDays(3),
                'description' => 'Corporate Training Consultation - ABC Company',
                'notes' => 'Strategic planning consultation for training department',
                'account_id' => $mainAccount->id,
                'category_id' => $consulting->id,
                'user_id' => $user->id,
                'related_type' => 'consulting',
                'related_id' => 1,
                'status' => 'completed',
                'metadata' => json_encode([
                    'client' => 'ABC Company',
                    'consultation_hours' => 14,
                    'service_type' => 'Training Strategy'
                ])
            ],

            // ===== COURSE EXPENSE TRANSACTIONS =====

            // Sample 3: Trainer Salary Expense
            [
                'reference_number' => 'EXP-2024-001',
                'type' => 'expense',
                'amount' => 2000.00,
                'currency' => 'USD',
                'transaction_date' => Carbon::now()->subDays(4),
                'description' => 'Trainer salary for Project Management Course',
                'notes' => 'Payment for certified PMP trainer',
                'account_id' => $mainAccount->id,
                'category_id' => $personnel->id,
                'user_id' => $user->id,
                'related_type' => 'course',
                'related_id' => 1,
                'status' => 'completed',
                'metadata' => json_encode([
                    'trainer_name' => 'Dr. Sarah Johnson',
                    'certification' => 'PMP',
                    'course_id' => 1,
                    'payment_type' => 'salary'
                ])
            ],

            // Sample 4: Training Materials Expense
            [
                'reference_number' => 'EXP-2024-002',
                'type' => 'expense',
                'amount' => 450.00,
                'currency' => 'USD',
                'transaction_date' => Carbon::now()->subDays(6),
                'description' => 'Course materials and workbooks for PM Course',
                'notes' => '50 workbooks, project templates, and case studies',
                'account_id' => $mainAccount->id,
                'category_id' => $trainingMaterials->id,
                'user_id' => $user->id,
                'related_type' => 'course',
                'related_id' => 1,
                'status' => 'completed',
                'metadata' => json_encode([
                    'materials_count' => 50,
                    'item_types' => ['workbooks', 'templates', 'case_studies'],
                    'supplier' => 'Training Materials Plus',
                    'course_id' => 1
                ])
            ],

            // Sample 5: Travel & Accommodation Expense
            [
                'reference_number' => 'EXP-2024-003',
                'type' => 'expense',
                'amount' => 800.00,
                'currency' => 'USD',
                'transaction_date' => Carbon::now()->subDays(7),
                'description' => 'Trainer travel to Dubai for PM Course',
                'notes' => 'Flight tickets and 2 nights hotel accommodation',
                'account_id' => $mainAccount->id,
                'category_id' => $travel->id,
                'user_id' => $user->id,
                'related_type' => 'course',
                'related_id' => 1,
                'status' => 'completed',
                'metadata' => json_encode([
                    'traveler' => 'Dr. Sarah Johnson',
                    'destination' => 'Dubai',
                    'duration' => '2 nights',
                    'transportation' => 'Flight',
                    'course_id' => 1
                ])
            ],

            // Sample 6: Venue Rental Expense
            [
                'reference_number' => 'EXP-2024-004',
                'type' => 'expense',
                'amount' => 1200.00,
                'currency' => 'USD',
                'transaction_date' => Carbon::now()->subDays(8),
                'description' => 'Training venue rental - Dubai Business Center',
                'notes' => 'Conference room for 3 days, includes AV equipment',
                'account_id' => $mainAccount->id,
                'category_id' => $utilities->id,
                'user_id' => $user->id,
                'related_type' => 'course',
                'related_id' => 1,
                'status' => 'completed',
                'metadata' => json_encode([
                    'venue' => 'Dubai Business Center',
                    'room_type' => 'Conference Room',
                    'duration' => '3 days',
                    'includes' => ['AV equipment', 'WiFi', 'Coffee service'],
                    'course_id' => 1
                ])
            ],

            // Sample 7: Catering Expense
            [
                'reference_number' => 'EXP-2024-005',
                'type' => 'expense',
                'amount' => 300.00,
                'currency' => 'USD',
                'transaction_date' => Carbon::now()->subDays(5),
                'description' => 'Lunch and coffee breaks for PM Course participants',
                'notes' => 'Daily catering for 20 participants, 3 days',
                'account_id' => $mainAccount->id,
                'category_id' => $catering->id,
                'user_id' => $user->id,
                'related_type' => 'course',
                'related_id' => 1,
                'status' => 'completed',
                'metadata' => json_encode([
                    'participants' => 20,
                    'duration' => '3 days',
                    'meals' => ['lunch', 'coffee_breaks'],
                    'supplier' => 'Dubai Catering Services',
                    'course_id' => 1
                ])
            ],

            // Additional sample transactions for variety

            // Sample 8: Another Course Income
            [
                'reference_number' => 'INV-2024-003',
                'type' => 'income',
                'amount' => 3200.00,
                'currency' => 'USD',
                'transaction_date' => Carbon::now()->subDays(10),
                'description' => 'Leadership Skills Workshop - Riyadh',
                'notes' => 'Payment for 15 participants in leadership workshop',
                'account_id' => $mainAccount->id,
                'category_id' => $courseFees->id,
                'user_id' => $user->id,
                'related_type' => 'course',
                'related_id' => 2,
                'status' => 'completed',
                'metadata' => json_encode([
                    'participants' => 15,
                    'course_duration' => '2 days',
                    'location' => 'Riyadh',
                    'course_type' => 'Leadership Skills'
                ])
            ],

            // Sample 9: Marketing Expense
            [
                'reference_number' => 'EXP-2024-006',
                'type' => 'expense',
                'amount' => 250.00,
                'currency' => 'USD',
                'transaction_date' => Carbon::now()->subDays(12),
                'description' => 'Digital marketing for Dubai PM Course',
                'notes' => 'Social media ads and email campaigns',
                'account_id' => $mainAccount->id,
                'category_id' => FinancialCategory::where('name', 'marketing')->first()->id,
                'user_id' => $user->id,
                'related_type' => 'course',
                'related_id' => 1,
                'status' => 'completed',
                'metadata' => json_encode([
                    'marketing_type' => 'Digital',
                    'channels' => ['social_media', 'email'],
                    'target_audience' => 'Project Managers',
                    'course_id' => 1
                ])
            ],

            // Sample 10: Equipment Maintenance
            [
                'reference_number' => 'EXP-2024-007',
                'type' => 'expense',
                'amount' => 180.00,
                'currency' => 'USD',
                'transaction_date' => Carbon::now()->subDays(15),
                'description' => 'Projector maintenance for training room',
                'notes' => 'Regular maintenance and bulb replacement',
                'account_id' => $mainAccount->id,
                'category_id' => FinancialCategory::where('name', 'maintenance')->first()->id,
                'user_id' => $user->id,
                'related_type' => 'equipment',
                'related_id' => 1,
                'status' => 'completed',
                'metadata' => json_encode([
                    'equipment' => 'Projector',
                    'maintenance_type' => 'Regular',
                    'service_provider' => 'Tech Support Plus',
                    'location' => 'Training Room'
                ])
            ]
        ];

        foreach ($transactions as $transaction) {
            Transaction::create($transaction);
        }

        // Update account balance after transactions
        $this->updateAccountBalance($mainAccount);

        $this->command->info('Course transactions seeded successfully!');
        $this->command->info('Created ' . count($transactions) . ' sample transactions.');
        $this->command->info('Updated account balance for Main Business Account.');
    }

    /**
     * Update account balance based on transactions
     */
    private function updateAccountBalance(Account $account)
    {
        $totalIncome = Transaction::where('account_id', $account->id)
            ->where('type', 'income')
            ->sum('amount');

        $totalExpenses = Transaction::where('account_id', $account->id)
            ->where('type', 'expense')
            ->sum('amount');

        $newBalance = $account->opening_balance + $totalIncome - $totalExpenses;

        $account->update(['current_balance' => $newBalance]);
    }
}

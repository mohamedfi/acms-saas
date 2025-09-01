<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Account;

class AccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $accounts = [
            [
                'name' => 'Main Business Account',
                'account_number' => '1234-5678-9012-3456',
                'type' => 'bank',
                'opening_balance' => 50000.00,
                'current_balance' => 50000.00,
                'currency' => 'USD',
                'description' => 'Primary business checking account for daily operations',
            ],
            [
                'name' => 'Petty Cash',
                'account_number' => null,
                'type' => 'cash',
                'opening_balance' => 1000.00,
                'current_balance' => 1000.00,
                'currency' => 'USD',
                'description' => 'Cash on hand for small expenses and emergencies',
            ],
            [
                'name' => 'Business Credit Card',
                'account_number' => '9876-5432-1098-7654',
                'type' => 'credit',
                'opening_balance' => 0.00,
                'current_balance' => 0.00,
                'currency' => 'USD',
                'description' => 'Corporate credit card for business expenses',
            ],
            [
                'name' => 'Investment Portfolio',
                'account_number' => null,
                'type' => 'investment',
                'opening_balance' => 25000.00,
                'current_balance' => 25000.00,
                'currency' => 'USD',
                'description' => 'Long-term investment account for business growth',
            ],
            [
                'name' => 'Savings Account',
                'account_number' => '1111-2222-3333-4444',
                'type' => 'bank',
                'opening_balance' => 15000.00,
                'current_balance' => 15000.00,
                'currency' => 'USD',
                'description' => 'High-yield savings account for emergency funds',
            ],
        ];

        foreach ($accounts as $account) {
            Account::create($account);
        }

        $this->command->info('Financial accounts seeded successfully!');
    }
}

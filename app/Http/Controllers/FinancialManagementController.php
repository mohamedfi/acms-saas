<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Transaction;
use App\Models\FinancialCategory;
use App\Models\Budget;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class FinancialManagementController extends Controller
{
    /**
     * Display the financial dashboard
     */
    public function index()
    {
        // Get current month and year
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;

        // Financial overview statistics
        $stats = [
            'total_income' => Transaction::income()
                ->whereYear('transaction_date', $currentYear)
                ->whereMonth('transaction_date', $currentMonth)
                ->sum('amount'),
            'total_expenses' => Transaction::expense()
                ->whereYear('transaction_date', $currentYear)
                ->whereMonth('transaction_date', $currentMonth)
                ->sum('amount'),
            'net_profit' => Transaction::income()
                ->whereYear('transaction_date', $currentYear)
                ->whereMonth('transaction_date', $currentMonth)
                ->sum('amount') - Transaction::expense()
                ->whereYear('transaction_date', $currentYear)
                ->whereMonth('transaction_date', $currentMonth)
                ->sum('amount'),
            'total_accounts' => Account::active()->count(),
            'total_transactions' => Transaction::count(),
            'total_budgets' => Budget::active()->count(),
        ];

        // Recent transactions
        $recentTransactions = Transaction::with(['account', 'category', 'user'])
            ->orderBy('transaction_date', 'desc')
            ->limit(10)
            ->get();

        // Top expense categories
        $topExpenseCategories = Transaction::expense()
            ->whereYear('transaction_date', $currentYear)
            ->whereMonth('transaction_date', $currentMonth)
            ->with('category')
            ->select('category_id', DB::raw('SUM(amount) as total_amount'))
            ->groupBy('category_id')
            ->orderBy('total_amount', 'desc')
            ->limit(5)
            ->get();

        // Account balances
        $accountBalances = Account::active()
            ->with('transactions')
            ->get()
            ->map(function ($account) {
                $account->recent_balance = $account->transactions()
                    ->orderBy('transaction_date', 'desc')
                    ->first();
                return $account;
            });

        return Inertia::render('FinancialManagement/Index', [
            'stats' => $stats,
            'recentTransactions' => $recentTransactions,
            'topExpenseCategories' => $topExpenseCategories,
            'accountBalances' => $accountBalances,
        ]);
    }

    /**
     * Display all accounts
     */
    public function accounts()
    {
        $accounts = Account::with('transactions')
            ->orderBy('name')
            ->paginate(20);

        return Inertia::render('FinancialManagement/Accounts', [
            'accounts' => $accounts,
        ]);
    }

    /**
     * Show the form for creating a new account
     */
    public function createAccount()
    {
        return Inertia::render('FinancialManagement/CreateAccount');
    }

    /**
     * Store a newly created account
     */
    public function storeAccount(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'account_number' => 'nullable|string|max:255|unique:accounts',
            'type' => 'required|in:bank,cash,credit,investment,other',
            'opening_balance' => 'required|numeric|min:0',
            'currency' => 'required|string|max:3',
            'description' => 'nullable|string',
        ]);

        $account = Account::create([
            'name' => $validated['name'],
            'account_number' => $validated['account_number'],
            'type' => $validated['type'],
            'opening_balance' => $validated['opening_balance'],
            'current_balance' => $validated['opening_balance'],
            'currency' => $validated['currency'],
            'description' => $validated['description'],
        ]);

        return redirect()->route('financial-management.accounts')
            ->with('success', 'Account created successfully!');
    }

    /**
     * Show the form for editing an account
     */
    public function editAccount(Account $account)
    {
        return Inertia::render('FinancialManagement/EditAccount', [
            'account' => $account,
        ]);
    }

    /**
     * Update the specified account
     */
    public function updateAccount(Request $request, Account $account)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'account_number' => 'nullable|string|max:255|unique:accounts,account_number,' . $account->id,
            'type' => 'required|in:bank,cash,credit,investment,other',
            'currency' => 'required|string|max:3',
            'description' => 'nullable|string',
        ]);

        $account->update($validated);

        return redirect()->route('financial-management.accounts')
            ->with('success', 'Account updated successfully!');
    }

    /**
     * Display all transactions
     */
    public function transactions()
    {
        $transactions = Transaction::with(['account', 'category', 'user'])
            ->orderBy('transaction_date', 'desc')
            ->paginate(20);

        $accounts = Account::active()->get();
        $categories = FinancialCategory::active()->get();

        return Inertia::render('FinancialManagement/Transactions', [
            'transactions' => $transactions,
            'accounts' => $accounts,
            'categories' => $categories,
        ]);
    }

    /**
     * Show the form for creating a new transaction
     */
    public function createTransaction()
    {
        $accounts = Account::active()->get();
        $categories = FinancialCategory::active()->get();

        return Inertia::render('FinancialManagement/CreateTransaction', [
            'accounts' => $accounts,
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created transaction
     */
    public function storeTransaction(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:income,expense,transfer',
            'amount' => 'required|numeric|min:0.01',
            'currency' => 'required|string|max:3',
            'transaction_date' => 'required|date',
            'description' => 'required|string|max:255',
            'notes' => 'nullable|string',
            'account_id' => 'required|exists:accounts,id',
            'category_id' => 'required|exists:financial_categories,id',
            'related_type' => 'nullable|string',
            'related_id' => 'nullable|integer',
            'status' => 'required|in:pending,completed,cancelled',
        ]);

        // Generate unique reference number
        $validated['reference_number'] = 'TXN-' . date('Ymd') . '-' . strtoupper(uniqid());

        $transaction = Transaction::create($validated);

        // Update account balance
        $account = Account::find($validated['account_id']);
        if ($validated['type'] === 'income') {
            $account->increment('current_balance', $validated['amount']);
        } elseif ($validated['type'] === 'expense') {
            $account->decrement('current_balance', $validated['amount']);
        }

        return redirect()->route('financial-management.transactions')
            ->with('success', 'Transaction created successfully!');
    }

    /**
     * Display the specified transaction
     */
    public function showTransaction(Transaction $transaction)
    {
        $transaction->load(['account', 'category', 'user']);

        return Inertia::render('FinancialManagement/ShowTransaction', [
            'transaction' => $transaction,
        ]);
    }

    /**
     * Show the form for editing the specified transaction
     */
    public function editTransaction(Transaction $transaction)
    {
        $transaction->load(['account', 'category']);

        $accounts = Account::active()->ordered()->get();
        $categories = FinancialCategory::active()->ordered()->get();

        return Inertia::render('FinancialManagement/EditTransaction', [
            'transaction' => $transaction,
            'accounts' => $accounts,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified transaction
     */
    public function updateTransaction(Request $request, Transaction $transaction)
    {
        $validated = $request->validate([
            'type' => 'required|in:income,expense,transfer',
            'amount' => 'required|numeric|min:0.01',
            'currency' => 'required|string|max:3',
            'transaction_date' => 'required|date',
            'description' => 'required|string|max:255',
            'notes' => 'nullable|string',
            'account_id' => 'required|exists:accounts,id',
            'category_id' => 'required|exists:financial_categories,id',
            'related_type' => 'nullable|string',
            'related_id' => 'nullable|integer',
            'status' => 'required|in:pending,completed,cancelled',
        ]);

        // Store old values for balance adjustment
        $oldAmount = $transaction->amount;
        $oldType = $transaction->type;
        $oldAccountId = $transaction->account_id;

        // Update transaction
        $transaction->update($validated);

        // Adjust account balances
        $this->adjustAccountBalances($transaction, $oldAmount, $oldType, $oldAccountId, $validated['amount'], $validated['type'], $validated['account_id']);

        return redirect()->route('financial-management.transactions')
            ->with('success', 'Transaction updated successfully!');
    }

    /**
     * Remove the specified transaction
     */
    public function destroyTransaction(Transaction $transaction)
    {
        // Store values for balance adjustment
        $amount = $transaction->amount;
        $type = $transaction->type;
        $accountId = $transaction->account_id;

        // Delete transaction
        $transaction->delete();

        // Adjust account balance
        $account = Account::find($accountId);
        if ($account) {
            if ($type === 'income') {
                $account->decrement('current_balance', $amount);
            } elseif ($type === 'expense') {
                $account->increment('current_balance', $amount);
            }
        }

        return redirect()->route('financial-management.transactions')
            ->with('success', 'Transaction deleted successfully!');
    }

    /**
     * Helper method to adjust account balances when updating transactions
     */
    private function adjustAccountBalances($transaction, $oldAmount, $oldType, $oldAccountId, $newAmount, $newType, $newAccountId)
    {
        // Revert old transaction effects
        $oldAccount = Account::find($oldAccountId);
        if ($oldAccount) {
            if ($oldType === 'income') {
                $oldAccount->decrement('current_balance', $oldAmount);
            } elseif ($oldType === 'expense') {
                $oldAccount->increment('current_balance', $oldAmount);
            }
        }

        // Apply new transaction effects
        $newAccount = Account::find($newAccountId);
        if ($newAccount) {
            if ($newType === 'income') {
                $newAccount->increment('current_balance', $newAmount);
            } elseif ($newType === 'expense') {
                $newAccount->decrement('current_balance', $newAmount);
            }
        }
    }

    /**
     * Display all categories
     */
    public function categories()
    {
        $categories = FinancialCategory::withCount(['transactions', 'budgets'])
            ->ordered()
            ->paginate(20);

        return Inertia::render('FinancialManagement/Categories', [
            'categories' => $categories,
        ]);
    }

    /**
     * Show the form for creating a new category
     */
    public function createCategory()
    {
        return Inertia::render('FinancialManagement/CreateCategory');
    }

    /**
     * Store a newly created category
     */
    public function storeCategory(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'display_name' => 'nullable|string|max:255',
            'type' => 'required|in:income,expense',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:20',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        FinancialCategory::create($validated);

        return redirect()->route('financial-management.categories')
            ->with('success', 'Category created successfully!');
    }

    /**
     * Display all budgets
     */
    public function budgets()
    {
        $budgets = Budget::with('category')
            ->ordered()
            ->paginate(20);

        $categories = FinancialCategory::active()->get();

        return Inertia::render('FinancialManagement/Budgets', [
            'budgets' => $budgets,
            'categories' => $categories,
        ]);
    }

    /**
     * Show the form for creating a new budget
     */
    public function createBudget()
    {
        $categories = FinancialCategory::active()->get();

        return Inertia::render('FinancialManagement/CreateBudget', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created budget
     */
    public function storeBudget(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'period' => 'required|in:monthly,quarterly,yearly',
            'fiscal_year' => 'required|integer|min:2000|max:2100',
            'period_name' => 'nullable|string|max:255',
            'category_id' => 'required|exists:financial_categories,id',
            'budgeted_amount' => 'required|numeric|min:0.01',
        ]);

        Budget::create($validated);

        return redirect()->route('financial-management.budgets')
            ->with('success', 'Budget created successfully!');
    }

    /**
     * Display financial reports
     */
    public function reports()
    {
        $currentYear = Carbon::now()->year;
        $currentMonth = Carbon::now()->month;

        // Monthly income/expense data for charts
        $monthlyData = [];
        for ($month = 1; $month <= 12; $month++) {
            $income = Transaction::income()
                ->whereYear('transaction_date', $currentYear)
                ->whereMonth('transaction_date', $month)
                ->sum('amount');

            $expenses = Transaction::expense()
                ->whereYear('transaction_date', $currentYear)
                ->whereMonth('transaction_date', $month)
                ->sum('amount');

            $monthlyData[] = [
                'month' => Carbon::createFromDate($currentYear, $month, 1)->format('M'),
                'income' => $income,
                'expenses' => $expenses,
                'profit' => $income - $expenses,
            ];
        }

        // Category breakdown
        $categoryBreakdown = Transaction::with('category')
            ->whereYear('transaction_date', $currentYear)
            ->whereMonth('transaction_date', $currentMonth)
            ->select('category_id', 'type', DB::raw('SUM(amount) as total_amount'))
            ->groupBy('category_id', 'type')
            ->get()
            ->groupBy('type');

        return Inertia::render('FinancialManagement/Reports', [
            'monthlyData' => $monthlyData,
            'categoryBreakdown' => $categoryBreakdown,
            'currentYear' => $currentYear,
            'currentMonth' => $currentMonth,
        ]);
    }
}

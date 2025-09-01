import React from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";

export default function CreateTransaction({ auth, accounts, categories }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        type: "",
        amount: "",
        currency: "USD",
        transaction_date: new Date().toISOString().split('T')[0],
        description: "",
        notes: "",
        account_id: "",
        category_id: "",
        related_type: "",
        related_id: "",
        status: "completed",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("financial-management.transactions.store"));
    };

    const getCategoryOptions = (type) => {
        if (!categories) return [];
        if (!type || type === "") return categories || []; return categories.filter(cat => cat.type === type || cat.type === "both");
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    ➕ Create New Transaction
                </h2>
            }
        >
            <Head title="Create New Transaction" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            Create New Financial Transaction
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Record a new income, expense, or transfer transaction.
                        </p>
                    </div>

                    {/* Form */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6 space-y-6">
                            {/* Transaction Type */}
                            <div>
                                <InputLabel htmlFor="type" value="Transaction Type *" />
                                <select
                                    id="type"
                                    name="type"
                                    value={data.type}
                                    onChange={(e) => setData("type", e.target.value)}
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    required
                                >
                                    <option value="expense">📉 Expense</option>
                                    <option value="income">📈 Income</option>
                                    <option value="transfer">🔄 Transfer</option>
                                </select>
                                <InputError message={errors.type} className="mt-2" />
                            </div>

                            {/* Amount */}
                            <div>
                                <InputLabel htmlFor="amount" value="Amount *" />
                                <TextInput
                                    id="amount"
                                    type="number"
                                    name="amount"
                                    value={data.amount}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData("amount", e.target.value)}
                                    step="0.01"
                                    min="0.01"
                                    required
                                    placeholder="0.00"
                                />
                                <InputError message={errors.amount} className="mt-2" />
                            </div>

                            {/* Currency */}
                            <div>
                                <InputLabel htmlFor="currency" value="Currency *" />
                                <select
                                    id="currency"
                                    name="currency"
                                    value={data.currency}
                                    onChange={(e) => setData("currency", e.target.value)}
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    required
                                >
                                    <option value="USD">🇺🇸 USD - US Dollar</option>
                                    <option value="EUR">🇪🇺 EUR - Euro</option>
                                    <option value="GBP">🇬🇧 GBP - British Pound</option>
                                    <option value="JPY">🇯🇵 JPY - Japanese Yen</option>
                                    <option value="CAD">🇨🇦 CAD - Canadian Dollar</option>
                                    <option value="AUD">🇦🇺 AUD - Australian Dollar</option>
                                    <option value="CHF">🇨🇭 CHF - Swiss Franc</option>
                                    <option value="CNY">🇨🇳 CNY - Chinese Yuan</option>
                                    <option value="EGP">🇪🇬 EGP - Egyptian Pound</option>                                </select>
                                <InputError message={errors.currency} className="mt-2" />
                            </div>

                            {/* Transaction Date */}
                            <div>
                                <InputLabel htmlFor="transaction_date" value="Transaction Date *" />
                                <TextInput
                                    id="transaction_date"
                                    type="date"
                                    name="transaction_date"
                                    value={data.transaction_date}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData("transaction_date", e.target.value)}
                                    required
                                />
                                <InputError message={errors.transaction_date} className="mt-2" />
                            </div>

                            {/* Description */}
                            <div>
                                <InputLabel htmlFor="description" value="Description *" />
                                <TextInput
                                    id="description"
                                    type="text"
                                    name="description"
                                    value={data.description}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData("description", e.target.value)}
                                    required
                                    placeholder="e.g., Office supplies, Client payment, etc."
                                />
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            {/* Account */}
                            <div>
                                <InputLabel htmlFor="account_id" value="Account *" />
                                <select
                                    id="account_id"
                                    name="account_id"
                                    value={data.account_id}
                                    onChange={(e) => setData("account_id", e.target.value)}
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    required
                                >
                                    <option value="">Select an account</option>
                                    {accounts && accounts.map((account) => (
                                        <option key={account.id} value={account.id}>
                                            {account.name} ({account.type_label}) - {account.currency}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.account_id} className="mt-2" />
                            </div>

                            {/* Category */}
                            <div>
                                <InputLabel htmlFor="category_id" value="Category *" />
                                <select
                                    id="category_id"
                                    name="category_id"
                                    value={data.category_id}
                                    onChange={(e) => setData("category_id", e.target.value)}
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    required
                                >
                                    <option value="">{data.type ? "Select a category for " + data.type : "Select transaction type first"}</option>
                                    {getCategoryOptions(data.type).map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.display_name || category.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.category_id} className="mt-2" />
                            </div>

                            {/* Status */}
                            <div>
                                <InputLabel htmlFor="status" value="Status *" />
                                <select
                                    id="status"
                                    name="status"
                                    value={data.status}
                                    onChange={(e) => setData("status", e.target.value)}
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    required
                                >
                                    <option value="completed">✅ Completed</option>
                                    <option value="pending">⏳ Pending</option>
                                    <option value="cancelled">❌ Cancelled</option>
                                </select>
                                <InputError message={errors.status} className="mt-2" />
                            </div>

                            {/* Notes */}
                            <div>
                                <InputLabel htmlFor="notes" value="Notes" />
                                <textarea
                                    id="notes"
                                    name="notes"
                                    value={data.notes}
                                    onChange={(e) => setData("notes", e.target.value)}
                                    rows="3"
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    placeholder="Additional notes or details..."
                                />
                                <InputError message={errors.notes} className="mt-2" />
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-between pt-6">
                                <Link
                                    href={route("financial-management.transactions")}
                                    className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    ← Cancel
                                </Link>
                                <PrimaryButton disabled={processing}>
                                    {processing ? "Creating..." : "Create Transaction"}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>

                    {/* Help Text */}
                    <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                            💡 Transaction Guidelines
                        </h3>
                        <ul className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
                            <li>• <strong>Expense:</strong> Money going out (purchases, bills, fees)</li>
                            <li>• <strong>Income:</strong> Money coming in (sales, payments, refunds)</li>
                            <li>• <strong>Transfer:</strong> Moving money between accounts</li>
                            <li>• <strong>Description:</strong> Be specific for better tracking</li>
                            <li>• <strong>Category:</strong> Choose the most appropriate category for reporting</li>
                        </ul>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

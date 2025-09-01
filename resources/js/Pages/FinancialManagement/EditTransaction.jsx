import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";

export default function EditTransaction({ auth, transaction, accounts, categories }) {
    const { data, setData, put, processing, errors } = useForm({
        type: transaction.type || "expense",
        amount: transaction.amount || "",
        currency: transaction.currency || "USD",
        transaction_date: transaction.transaction_date || "",
        description: transaction.description || "",
        notes: transaction.notes || "",
        account_id: transaction.account_id || "",
        category_id: transaction.category_id || "",
        status: transaction.status || "completed",
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("financial-management.transactions.update", transaction.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    ✏️ Edit Transaction
                </h2>
            }
        >
            <Head title="Edit Transaction" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                    Edit Transaction
                                </h1>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    Update the details of this financial transaction.
                                </p>
                            </div>
                            <Link
                                href={route("financial-management.transactions")}
                                className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                            >
                                ← Back to Transactions
                            </Link>
                        </div>
                    </div>

                    {/* Edit Form */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                Transaction #{transaction.id} - {transaction.reference_number}
                            </h3>
                        </div>

                        <form onSubmit={submit} className="px-6 py-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-6">
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
                                            <option value="income">📈 Income</option>
                                            <option value="expense">📉 Expense</option>
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
                                            step="0.01"
                                            min="0.01"
                                            value={data.amount}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData("amount", e.target.value)}
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
                                            <option value="EGP">🇪🇬 EGP - Egyptian Pound</option>                                        </select>
                                        <InputError message={errors.currency} className="mt-2" />
                                    </div>

                                    {/* Transaction Date */}
                                    <div>
                                        <InputLabel htmlFor="transaction_date" value="Transaction Date *" />
                                        <TextInput
                                            id="transaction_date"
                                            type="date"
                                            value={data.transaction_date}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData("transaction_date", e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.transaction_date} className="mt-2" />
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-6">
                                    {/* Description */}
                                    <div>
                                        <InputLabel htmlFor="description" value="Description *" />
                                        <TextInput
                                            id="description"
                                            type="text"
                                            value={data.description}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData("description", e.target.value)}
                                            required
                                            placeholder="Brief description of the transaction"
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
                                            {accounts.map((account) => (
                                                <option key={account.id} value={account.id}>
                                                    {account.name} - {account.type}
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
                                            <option value="">Select a category</option>
                                            {categories
                                                .filter((category) => category.type === data.type || category.type === "both")
                                                .map((category) => (
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
                                            <option value="pending">⏳ Pending</option>
                                            <option value="completed">✅ Completed</option>
                                            <option value="cancelled">❌ Cancelled</option>
                                        </select>
                                        <InputError message={errors.status} className="mt-2" />
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="mt-6">
                                <InputLabel htmlFor="notes" value="Notes" />
                                <textarea
                                    id="notes"
                                    name="notes"
                                    value={data.notes}
                                    onChange={(e) => setData("notes", e.target.value)}
                                    rows="3"
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    placeholder="Additional notes about this transaction..."
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
                                    {processing ? "Updating..." : "Update Transaction"}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>

                    {/* Back to Dashboard */}
                    <div className="mt-8">
                        <Link
                            href={route("financial-management.index")}
                            className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                        >
                            ← Back to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

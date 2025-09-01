import React from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";

export default function EditAccount({ auth, account }) {
    const { data, setData, put, processing, errors } = useForm({
        name: account.name || "",
        account_number: account.account_number || "",
        type: account.type || "bank",
        currency: account.currency || "USD",
        description: account.description || "",
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("financial-management.accounts.update", account.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    ✏️ Edit Account
                </h2>
            }
        >
            <Head title="Edit Account" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            Edit Financial Account
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Update your account information and settings.
                        </p>
                    </div>

                    {/* Form */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6 space-y-6">
                            {/* Account Name */}
                            <div>
                                <InputLabel
                                    htmlFor="name"
                                    value="Account Name *"
                                />
                                <TextInput
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    required
                                    placeholder="e.g., Main Business Account"
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            {/* Account Number */}
                            <div>
                                <InputLabel
                                    htmlFor="account_number"
                                    value="Account Number"
                                />
                                <TextInput
                                    id="account_number"
                                    type="text"
                                    name="account_number"
                                    value={data.account_number}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData(
                                            "account_number",
                                            e.target.value
                                        )
                                    }
                                    placeholder="e.g., 1234-5678-9012-3456"
                                />
                                <InputError
                                    message={errors.account_number}
                                    className="mt-2"
                                />
                            </div>

                            {/* Account Type */}
                            <div>
                                <InputLabel
                                    htmlFor="type"
                                    value="Account Type *"
                                />
                                <select
                                    id="type"
                                    name="type"
                                    value={data.type}
                                    onChange={(e) =>
                                        setData("type", e.target.value)
                                    }
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    required
                                >
                                    <option value="bank">
                                        🏦 Bank Account
                                    </option>
                                    <option value="cash">💵 Cash</option>
                                    <option value="credit">
                                        💳 Credit Card
                                    </option>
                                    <option value="investment">
                                        📈 Investment
                                    </option>
                                    <option value="other">📊 Other</option>
                                </select>
                                <InputError
                                    message={errors.type}
                                    className="mt-2"
                                />
                            </div>

                            {/* Current Balance Display */}
                            <div>
                                <InputLabel value="Current Balance" />
                                <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        {new Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: account.currency || "USD",
                                        }).format(account.current_balance || 0)}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                                        (Current balance cannot be edited
                                        directly)
                                    </span>
                                </div>
                            </div>

                            {/* Currency */}
                            <div>
                                <InputLabel
                                    htmlFor="currency"
                                    value="Currency *"
                                />
                                <select
                                    id="currency"
                                    name="currency"
                                    value={data.currency}
                                    onChange={(e) =>
                                        setData("currency", e.target.value)
                                    }
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    required
                                >
                                    <option value="USD">
                                        🇺🇸 USD - US Dollar
                                    </option>
                                    <option value="EUR">🇪🇺 EUR - Euro</option>
                                    <option value="GBP">
                                        🇬🇧 GBP - British Pound
                                    </option>
                                    <option value="JPY">
                                        🇯🇵 JPY - Japanese Yen
                                    </option>
                                    <option value="CAD">
                                        🇨🇦 CAD - Canadian Dollar
                                    </option>
                                    <option value="AUD">
                                        🇦🇺 AUD - Australian Dollar
                                    </option>
                                    <option value="CHF">
                                        🇨🇭 CHF - Swiss Franc
                                    </option>
                                    <option value="CNY">
                                    <option value="EGP">🇪🇬 EGP - Egyptian Pound</option>                                        🇨🇳 CNY - Chinese Yuan
                                    </option>
                                </select>
                                <InputError
                                    message={errors.currency}
                                    className="mt-2"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <InputLabel
                                    htmlFor="description"
                                    value="Description"
                                />
                                <textarea
                                    id="description"
                                    name="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    rows="3"
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    placeholder="Optional description of the account's purpose..."
                                />
                                <InputError
                                    message={errors.description}
                                    className="mt-2"
                                />
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-between pt-6">
                                <Link
                                    href={route(
                                        "financial-management.accounts"
                                    )}
                                    className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    ← Cancel
                                </Link>
                                <PrimaryButton disabled={processing}>
                                    {processing
                                        ? "Updating..."
                                        : "Update Account"}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>

                    {/* Account Info */}
                    <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                            ℹ️ Account Information
                        </h3>
                        <div className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
                            <p>
                                <strong>Account ID:</strong> {account.id}
                            </p>
                            <p>
                                <strong>Created:</strong>{" "}
                                {new Date(
                                    account.created_at
                                ).toLocaleDateString()}
                            </p>
                            <p>
                                <strong>Last Updated:</strong>{" "}
                                {new Date(
                                    account.updated_at
                                ).toLocaleDateString()}
                            </p>
                            <p>
                                <strong>Status:</strong>{" "}
                                {account.is_active
                                    ? "✅ Active"
                                    : "❌ Inactive"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

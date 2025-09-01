import React from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";

export default function Create({ employees }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        description: "",
        code: "",
        manager_id: "",
        is_active: true,
        sort_order: 0,
        budget: "",
        location: "",
        contact_email: "",
        contact_phone: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("departments.store"));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        ➕ Create New Department
                    </h2>
                    <Link
                        href={route("departments.index")}
                        className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                    >
                        ⬅️ Back to Departments
                    </Link>
                </div>
            }
        >
            <Head title="Create Department" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                    Department Information
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Add a new department to the system. All fields marked with * are required.
                                </p>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                {/* Basic Information */}
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6">
                                    <h4 className="text-md font-semibold mb-4 text-blue-800 dark:text-blue-200">
                                        📋 Basic Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel htmlFor="name" value="Department Name *" />
                                            <TextInput
                                                id="name"
                                                type="text"
                                                name="name"
                                                value={data.name}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData("name", e.target.value)}
                                                placeholder="e.g., Information Technology"
                                                required
                                            />
                                            <InputError message={errors.name} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="code" value="Department Code" />
                                            <TextInput
                                                id="code"
                                                type="text"
                                                name="code"
                                                value={data.code}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData("code", e.target.value.toUpperCase())}
                                                placeholder="e.g., IT"
                                                maxLength="10"
                                            />
                                            <InputError message={errors.code} className="mt-2" />
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <InputLabel htmlFor="description" value="Description" />
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={data.description}
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                            rows="3"
                                            onChange={(e) => setData("description", e.target.value)}
                                            placeholder="Brief description of the department's purpose and responsibilities..."
                                        />
                                        <InputError message={errors.description} className="mt-2" />
                                    </div>
                                </div>

                                {/* Management & Organization */}
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6">
                                    <h4 className="text-md font-semibold mb-4 text-green-800 dark:text-green-200">
                                        👨‍💼 Management & Organization
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel htmlFor="manager_id" value="Department Manager" />
                                            <select
                                                id="manager_id"
                                                name="manager_id"
                                                value={data.manager_id}
                                                onChange={(e) => setData("manager_id", e.target.value)}
                                                className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                            >
                                                <option value="">Select a manager (optional)</option>
                                                {employees.map((employee) => (
                                                    <option key={employee.id} value={employee.id}>
                                                        {employee.first_name} {employee.last_name} - {employee.employee_id}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError message={errors.manager_id} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="sort_order" value="Sort Order" />
                                            <TextInput
                                                id="sort_order"
                                                type="number"
                                                name="sort_order"
                                                value={data.sort_order}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData("sort_order", e.target.value)}
                                                placeholder="0"
                                                min="0"
                                            />
                                            <InputError message={errors.sort_order} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* Financial Information */}
                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6">
                                    <h4 className="text-md font-semibold mb-4 text-purple-800 dark:text-purple-200">
                                        💰 Financial Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel htmlFor="budget" value="Annual Budget (EGP)" />
                                            <TextInput
                                                id="budget"
                                                type="number"
                                                name="budget"
                                                value={data.budget}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData("budget", e.target.value)}
                                                placeholder="e.g., 500000"
                                                min="0"
                                                step="0.01"
                                            />
                                            <InputError message={errors.budget} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="location" value="Department Location" />
                                            <TextInput
                                                id="location"
                                                type="text"
                                                name="location"
                                                value={data.location}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData("location", e.target.value)}
                                                placeholder="e.g., Main Building, 2nd Floor"
                                            />
                                            <InputError message={errors.location} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-6">
                                    <h4 className="text-md font-semibold mb-4 text-orange-800 dark:text-orange-200">
                                        📞 Contact Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel htmlFor="contact_email" value="Contact Email" />
                                            <TextInput
                                                id="contact_email"
                                                type="email"
                                                name="contact_email"
                                                value={data.contact_email}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData("contact_email", e.target.value)}
                                                placeholder="e.g., it@pmec.com"
                                            />
                                            <InputError message={errors.contact_email} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="contact_phone" value="Contact Phone" />
                                            <TextInput
                                                id="contact_phone"
                                                type="text"
                                                name="contact_phone"
                                                value={data.contact_phone}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData("contact_phone", e.target.value)}
                                                placeholder="e.g., +20-2-1234-5678"
                                            />
                                            <InputError message={errors.contact_phone} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                    <h4 className="text-md font-semibold mb-4 text-gray-800 dark:text-gray-200">
                                        📊 Status
                                    </h4>
                                    <div className="flex items-center">
                                        <input
                                            id="is_active"
                                            type="checkbox"
                                            name="is_active"
                                            checked={data.is_active}
                                            onChange={(e) => setData("is_active", e.target.checked)}
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                                            Department is active
                                        </label>
                                    </div>
                                    <InputError message={errors.is_active} className="mt-2" />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end space-x-4">
                                    <Link
                                        href={route("departments.index")}
                                        className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                    >
                                        ❌ Cancel
                                    </Link>
                                    <PrimaryButton
                                        disabled={processing}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        {processing ? "Creating..." : "✅ Create Department"}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

import React from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        code: "",
        description: "",
        address: "",
        city: "",
        capacity: 30,
        facilities: [],
        contact_person: "",
        contact_phone: "",
        contact_email: "",
        is_active: true,
        sort_order: 0,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("training-halls.store"));
    };

    const addFacility = () => {
        const facility = prompt("Enter facility name:");
        if (facility && facility.trim()) {
            setData("facilities", [...data.facilities, facility.trim()]);
        }
    };

    const removeFacility = (index) => {
        setData("facilities", data.facilities.filter((_, i) => i !== index));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        ➕ Create New Training Hall
                    </h2>
                    <Link
                        href={route("training-halls.index")}
                        className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                    >
                        ⬅️ Back to Training Halls
                    </Link>
                </div>
            }
        >
            <Head title="Create Training Hall" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                    Training Hall Information
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Add a new training hall to the system. All fields marked with * are required.
                                </p>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                {/* Basic Information */}
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6">
                                    <h4 className="text-md font-semibold mb-4 text-blue-800 dark:text-blue-200">
                                        🏢 Basic Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel htmlFor="name" value="Hall Name *" />
                                            <TextInput
                                                id="name"
                                                type="text"
                                                name="name"
                                                value={data.name}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData("name", e.target.value)}
                                                placeholder="e.g., مكانك اسكندرية"
                                                required
                                            />
                                            <InputError message={errors.name} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="code" value="Hall Code *" />
                                            <TextInput
                                                id="code"
                                                type="text"
                                                name="code"
                                                value={data.code}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData("code", e.target.value.toUpperCase())}
                                                placeholder="e.g., ALEX"
                                                maxLength="10"
                                                required
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
                                            onChange={(e) => setData("description", e.target.value)}
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            rows="3"
                                            placeholder="Brief description of the training hall and its purpose"
                                        />
                                        <InputError message={errors.description} className="mt-2" />
                                    </div>
                                </div>

                                {/* Location Information */}
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6">
                                    <h4 className="text-md font-semibold mb-4 text-green-800 dark:text-green-200">
                                        📍 Location Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel htmlFor="city" value="City *" />
                                            <TextInput
                                                id="city"
                                                type="text"
                                                name="city"
                                                value={data.city}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData("city", e.target.value)}
                                                placeholder="e.g., الإسكندرية"
                                                required
                                            />
                                            <InputError message={errors.city} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="address" value="Address" />
                                            <TextInput
                                                id="address"
                                                type="text"
                                                name="address"
                                                value={data.address}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData("address", e.target.value)}
                                                placeholder="e.g., Alexandria, Egypt"
                                            />
                                            <InputError message={errors.address} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* Capacity and Facilities */}
                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6">
                                    <h4 className="text-md font-semibold mb-4 text-purple-800 dark:text-purple-200">
                                        👥 Capacity & Facilities
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel htmlFor="capacity" value="Maximum Capacity *" />
                                            <TextInput
                                                id="capacity"
                                                type="number"
                                                name="capacity"
                                                value={data.capacity}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData("capacity", e.target.value)}
                                                min="1"
                                                max="1000"
                                                required
                                            />
                                            <InputError message={errors.capacity} className="mt-2" />
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
                                                min="0"
                                                placeholder="0"
                                            />
                                            <InputError message={errors.sort_order} className="mt-2" />
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <InputLabel value="Available Facilities" />
                                        <div className="mt-2 space-y-2">
                                            {data.facilities.map((facility, index) => (
                                                <div key={index} className="flex items-center space-x-2">
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                                        {facility}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFacility(index)}
                                                        className="text-red-600 hover:text-red-800 text-sm"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={addFacility}
                                                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                            >
                                                ➕ Add Facility
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-6">
                                    <h4 className="text-md font-semibold mb-4 text-yellow-800 dark:text-yellow-200">
                                        📞 Contact Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <InputLabel htmlFor="contact_person" value="Contact Person" />
                                            <TextInput
                                                id="contact_person"
                                                type="text"
                                                name="contact_person"
                                                value={data.contact_person}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData("contact_person", e.target.value)}
                                                placeholder="e.g., Ahmed Hassan"
                                            />
                                            <InputError message={errors.contact_person} className="mt-2" />
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
                                                placeholder="e.g., +20-3-1234-5678"
                                            />
                                            <InputError message={errors.contact_phone} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="contact_email" value="Contact Email" />
                                            <TextInput
                                                id="contact_email"
                                                type="email"
                                                name="contact_email"
                                                value={data.contact_email}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData("contact_email", e.target.value)}
                                                placeholder="e.g., hall@company.com"
                                            />
                                            <InputError message={errors.contact_email} className="mt-2" />
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="is_active"
                                                checked={data.is_active}
                                                onChange={(e) => setData("is_active", e.target.checked)}
                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                                Training hall is active
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                {/* Form Actions */}
                                <div className="flex justify-end space-x-4">
                                    <Link
                                        href={route("training-halls.index")}
                                        className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                    >
                                        Cancel
                                    </Link>
                                    <PrimaryButton
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                    >
                                        {processing ? "Creating..." : "Create Training Hall"}
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

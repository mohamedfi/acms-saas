import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { useState } from "react";

export default function Edit({ trainer }) {
    const [imagePreview, setImagePreview] = useState(trainer.profile_image_url);
    const [cvPreview, setCvPreview] = useState(trainer.cv_document_url ? 'Current CV' : null);

    const { data, setData, put, processing, errors } = useForm({
        full_name: trainer.full_name,
        email: trainer.email,
        phone: trainer.phone || "",
        position: trainer.position || "",
        bio: trainer.bio || "",
        expertise_areas: trainer.expertise_areas || "",
        qualifications: trainer.qualifications || "",
        years_experience: trainer.years_experience || "",
        profile_image: null,
        cv_document: null,
        status: trainer.status,
        hourly_rate: trainer.hourly_rate || "",
        currency: trainer.currency || "EGP",
        notes: trainer.notes || "",
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("profile_image", file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleCvChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("cv_document", file);
            setCvPreview(file.name);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("trainers.update", trainer.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        ✏️ Edit Trainer: {trainer.full_name}
                    </h2>
                    <div className="flex space-x-3">
                        <Link
                            href={route("trainers.show", trainer.id)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                            👁️ View Trainer
                        </Link>
                        <Link
                            href={route("trainers.index")}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                            ← Back to Trainers
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Edit Trainer: ${trainer.full_name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Basic Information */}
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    📋 Basic Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.full_name}
                                            onChange={(e) => setData("full_name", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                        {errors.full_name && (
                                            <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData("email", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Phone
                                        </label>
                                        <input
                                            type="text"
                                            value={data.phone}
                                            onChange={(e) => setData("phone", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                        />
                                        {errors.phone && (
                                            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Position
                                        </label>
                                        <input
                                            type="text"
                                            value={data.position}
                                            onChange={(e) => setData("position", e.target.value)}
                                            placeholder="e.g., Senior Trainer, Lead Instructor"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                        />
                                        {errors.position && (
                                            <p className="mt-1 text-sm text-red-600">{errors.position}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Professional Details */}
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    🎓 Professional Details
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Bio
                                        </label>
                                        <textarea
                                            value={data.bio}
                                            onChange={(e) => setData("bio", e.target.value)}
                                            rows={3}
                                            placeholder="Professional background and experience..."
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                        />
                                        {errors.bio && (
                                            <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Expertise Areas
                                        </label>
                                        <textarea
                                            value={data.expertise_areas}
                                            onChange={(e) => setData("expertise_areas", e.target.value)}
                                            rows={2}
                                            placeholder="e.g., Leadership, Management, Strategic Planning, Team Building"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                        />
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            Separate multiple areas with commas
                                        </p>
                                        {errors.expertise_areas && (
                                            <p className="mt-1 text-sm text-red-600">{errors.expertise_areas}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Qualifications
                                            </label>
                                            <input
                                                type="text"
                                                value={data.qualifications}
                                                onChange={(e) => setData("qualifications", e.target.value)}
                                                placeholder="e.g., PhD, MBA, Certified Trainer"
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                            />
                                            {errors.qualifications && (
                                                <p className="mt-1 text-sm text-red-600">{errors.qualifications}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Years of Experience
                                            </label>
                                            <input
                                                type="number"
                                                value={data.years_experience}
                                                onChange={(e) => setData("years_experience", e.target.value)}
                                                min="0"
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                            />
                                            {errors.years_experience && (
                                                <p className="mt-1 text-sm text-red-600">{errors.years_experience}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Status & Rates */}
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    ⚙️ Status & Rates
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Status *
                                        </label>
                                        <select
                                            value={data.status}
                                            onChange={(e) => setData("status", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                            <option value="on_leave">On Leave</option>
                                        </select>
                                        {errors.status && (
                                            <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Hourly Rate
                                        </label>
                                        <input
                                            type="number"
                                            value={data.hourly_rate}
                                            onChange={(e) => setData("hourly_rate", e.target.value)}
                                            min="0"
                                            step="0.01"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                        />
                                        {errors.hourly_rate && (
                                            <p className="mt-1 text-sm text-red-600">{errors.hourly_rate}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Currency
                                        </label>
                                        <select
                                            value={data.currency}
                                            onChange={(e) => setData("currency", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="EGP">EGP (Egyptian Pound)</option>
                                            <option value="USD">USD (US Dollar)</option>
                                            <option value="EUR">EUR (Euro)</option>
                                        </select>
                                        {errors.currency && (
                                            <p className="mt-1 text-sm text-red-600">{errors.currency}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Files Upload */}
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    📁 Files Upload
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Profile Image
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                        />
                                        {imagePreview && (
                                            <div className="mt-2">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                                                />
                                            </div>
                                        )}
                                        {errors.profile_image && (
                                            <p className="mt-1 text-sm text-red-600">{errors.profile_image}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            CV Document
                                        </label>
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleCvChange}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                        />
                                        {cvPreview && (
                                            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                                📄 {cvPreview}
                                            </div>
                                        )}
                                        {errors.cv_document && (
                                            <p className="mt-1 text-sm text-red-600">{errors.cv_document}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    📝 Additional Notes
                                </h3>
                                <textarea
                                    value={data.notes}
                                    onChange={(e) => setData("notes", e.target.value)}
                                    rows={3}
                                    placeholder="Any additional information about the trainer..."
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                />
                                {errors.notes && (
                                    <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
                                )}
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex justify-end space-x-3">
                                <Link
                                    href={route("trainers.show", trainer.id)}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md text-sm font-medium"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2 rounded-md text-sm font-medium"
                                >
                                    {processing ? "Updating..." : "Update Trainer"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

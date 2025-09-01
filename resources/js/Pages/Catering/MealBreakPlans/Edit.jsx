import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";

export default function Edit({ mealBreakPlan }) {
    console.log("Edit component rendering with data:", mealBreakPlan);

    const { data, setData, put, processing, errors } = useForm({
        name: mealBreakPlan?.name || "",
        description: mealBreakPlan?.description || "",
        start_date: mealBreakPlan?.start_date
            ? mealBreakPlan.start_date.split("T")[0]
            : "",
        end_date: mealBreakPlan?.end_date
            ? mealBreakPlan.end_date.split("T")[0]
            : "",
        notes: mealBreakPlan?.notes || "",
        status: mealBreakPlan?.status || "draft",
    });

    const submit = (e) => {
        e.preventDefault();
        // Use direct URL instead of route() helper
        put(`/pmec2/public/catering/meal-break-plans/${mealBreakPlan.id}`);
    };

    const calculateDays = () => {
        if (data.start_date && data.end_date) {
            const start = new Date(data.start_date);
            const end = new Date(data.end_date);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            return diffDays;
        }
        return 0;
    };

    if (!mealBreakPlan) {
        return (
            <AuthenticatedLayout>
                <Head title="Meal Break Plan Not Found" />
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-center">
                                <div className="text-6xl mb-4">❌</div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                    Plan Not Found
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">
                                    The meal break plan you're trying to edit
                                    doesn't exist.
                                </p>
                                <a
                                    href="/pmec2/public/catering/meal-break-plans"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                                >
                                    Back to Plans
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title={`Edit Meal Break Plan: ${mealBreakPlan.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-semibold">
                                    ✏️ Edit Meal Break Plan:{" "}
                                    {mealBreakPlan.name}
                                </h2>
                                <a
                                    href={`/pmec2/public/catering/meal-break-plans/${mealBreakPlan.id}`}
                                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                                >
                                    ← Back to Plan
                                </a>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Plan Name */}
                                    <div>
                                        <InputLabel
                                            htmlFor="name"
                                            value="Plan Name"
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
                                            placeholder="e.g., August 2025 Meal Break Plan"
                                            required
                                        />
                                        <InputError
                                            message={errors.name}
                                            className="mt-2"
                                        />
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <InputLabel
                                            htmlFor="status"
                                            value="Status"
                                        />
                                        <select
                                            id="status"
                                            name="status"
                                            value={data.status}
                                            onChange={(e) =>
                                                setData(
                                                    "status",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        >
                                            <option value="draft">Draft</option>
                                            <option value="active">
                                                Active
                                            </option>
                                            <option value="completed">
                                                Completed
                                            </option>
                                            <option value="cancelled">
                                                Cancelled
                                            </option>
                                        </select>
                                        <InputError
                                            message={errors.status}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Start Date */}
                                    <div>
                                        <InputLabel
                                            htmlFor="start_date"
                                            value="Start Date"
                                        />
                                        <TextInput
                                            id="start_date"
                                            type="date"
                                            name="start_date"
                                            value={data.start_date}
                                            className="mt-1 block w-full"
                                            onChange={(e) =>
                                                setData(
                                                    "start_date",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.start_date}
                                            className="mt-2"
                                        />
                                    </div>

                                    {/* End Date */}
                                    <div>
                                        <InputLabel
                                            htmlFor="end_date"
                                            value="End Date"
                                        />
                                        <TextInput
                                            id="end_date"
                                            type="date"
                                            name="end_date"
                                            value={data.end_date}
                                            className="mt-1 block w-full"
                                            onChange={(e) =>
                                                setData(
                                                    "end_date",
                                                    e.target.value
                                                )
                                            }
                                            min={data.start_date}
                                            required
                                        />
                                        <InputError
                                            message={errors.end_date}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <InputLabel
                                        htmlFor="description"
                                        value="Description (Optional)"
                                    />
                                    <TextInput
                                        id="description"
                                        type="text"
                                        name="description"
                                        value={data.description}
                                        className="mt-1 block w-full"
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Brief description of the plan"
                                    />
                                    <InputError
                                        message={errors.description}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Days Calculation */}
                                {calculateDays() > 0 && (
                                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                        <div className="flex items-center">
                                            <div className="text-blue-600 dark:text-blue-400 text-lg mr-2">
                                                📅
                                            </div>
                                            <div>
                                                <div className="text-blue-800 dark:text-blue-200 font-medium">
                                                    Period Duration:{" "}
                                                    {calculateDays()} days
                                                </div>
                                                <div className="text-blue-600 dark:text-blue-400 text-sm">
                                                    From {data.start_date} to{" "}
                                                    {data.end_date}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Notes */}
                                <div>
                                    <InputLabel
                                        htmlFor="notes"
                                        value="Notes (Optional)"
                                    />
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        value={data.notes}
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        rows="4"
                                        onChange={(e) =>
                                            setData("notes", e.target.value)
                                        }
                                        placeholder="Additional notes or special instructions..."
                                    />
                                    <InputError
                                        message={errors.notes}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="flex items-center justify-end space-x-3">
                                    <a
                                        href={`/pmec2/public/catering/meal-break-plans/${mealBreakPlan.id}`}
                                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </a>
                                    <PrimaryButton
                                        className="ml-4"
                                        disabled={
                                            processing ||
                                            !data.name ||
                                            !data.start_date ||
                                            !data.end_date
                                        }
                                    >
                                        {processing
                                            ? "Updating..."
                                            : "Update Meal Break Plan"}
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

import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";

export default function Create({ employees, courses }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: "",
        description: "",
        assigned_to: "",
        assigned_by: "",
        priority: "normal",
        status: "pending",
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default to 7 days from now
        task_type: "general",
        course_id: "",
        notes: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("tasks.store"), {
            onSuccess: () => reset(),
        });
    };

    const taskTypes = [
        {
            value: "course-related",
            label: "🎓 Course Related",
            description: "Tasks related to course management",
        },
        {
            value: "administrative",
            label: "📋 Administrative",
            description: "General administrative tasks",
        },
        {
            value: "financial",
            label: "💰 Financial",
            description: "Financial and budgeting tasks",
        },
        {
            value: "general",
            label: "📝 General",
            description: "Other general tasks",
        },
    ];

    const priorities = [
        { value: "low", label: "🔽 Low", color: "text-gray-600" },
        { value: "normal", label: "➖ Normal", color: "text-blue-600" },
        { value: "high", label: "🔺 High", color: "text-orange-600" },
    ];

    const statuses = [
        { value: "pending", label: "⏳ Pending", color: "text-yellow-600" },
        {
            value: "in_progress",
            label: "🔄 In Progress",
            color: "text-blue-600",
        },
        { value: "completed", label: "✅ Completed", color: "text-green-600" },
        { value: "cancelled", label: "❌ Cancelled", color: "text-red-600" },
        { value: "done", label: "✅ Done", color: "text-green-600" },
        { value: "blocked", label: "🚫 Blocked", color: "text-gray-600" },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        ➕ Create New Task
                    </h2>
                    <Link
                        href={route("tasks.index")}
                        className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                    >
                        ⬅️ Back to Tasks
                    </Link>
                </div>
            }
        >
            <Head title="Create Task" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                    Task Information
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Create a new task and assign it to an
                                    employee. All fields marked with * are
                                    required.
                                </p>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                {/* Basic Task Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Title */}
                                    <div className="md:col-span-2">
                                        <InputLabel
                                            htmlFor="title"
                                            value="Task Title *"
                                        />
                                        <TextInput
                                            id="title"
                                            name="title"
                                            value={data.title}
                                            className="mt-1 block w-full"
                                            isFocused={true}
                                            onChange={(e) =>
                                                setData("title", e.target.value)
                                            }
                                            placeholder="Enter task title..."
                                        />
                                        <InputError
                                            message={errors.title}
                                            className="mt-2"
                                        />
                                    </div>
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
                                            setData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        rows={4}
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        placeholder="Describe the task in detail..."
                                    />
                                    <InputError
                                        message={errors.description}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Assignment and Type */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Assigned To */}
                                    <div>
                                        <InputLabel
                                            htmlFor="assigned_to"
                                            value="Assign To *"
                                        />
                                        <select
                                            id="assigned_to"
                                            name="assigned_to"
                                            value={data.assigned_to}
                                            onChange={(e) =>
                                                setData(
                                                    "assigned_to",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        >
                                            <option value="">
                                                Select employee
                                            </option>
                                            {employees.map((employee) => (
                                                <option
                                                    key={employee.id}
                                                    value={employee.id}
                                                >
                                                    👤{" "}
                                                    {employee.full_name ||
                                                        `${employee.first_name} ${employee.last_name}`}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError
                                            message={errors.assigned_to}
                                            className="mt-2"
                                        />
                                        {data.assigned_to && (
                                            <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                                {(() => {
                                                    const selectedEmployee =
                                                        employees.find(
                                                            (emp) =>
                                                                emp.id ==
                                                                data.assigned_to
                                                        );
                                                    if (selectedEmployee) {
                                                        return (
                                                            <div className="text-sm text-blue-800 dark:text-blue-200">
                                                                <div className="font-medium">
                                                                    👤{" "}
                                                                    {selectedEmployee.full_name ||
                                                                        `${selectedEmployee.first_name} ${selectedEmployee.last_name}`}
                                                                </div>
                                                                <div className="text-blue-600 dark:text-blue-300">
                                                                    🎭{" "}
                                                                    {
                                                                        selectedEmployee
                                                                            .role
                                                                            ?.display_name
                                                                    }{" "}
                                                                    • 🏢{" "}
                                                                    {selectedEmployee.department ||
                                                                        "No Department"}
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                })()}
                                            </div>
                                        )}
                                    </div>

                                    {/* Task Type */}
                                    <div>
                                        <InputLabel
                                            htmlFor="task_type"
                                            value="Task Type *"
                                        />
                                        <select
                                            id="task_type"
                                            name="task_type"
                                            value={data.task_type}
                                            onChange={(e) =>
                                                setData(
                                                    "task_type",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        >
                                            {taskTypes.map((type) => (
                                                <option
                                                    key={type.value}
                                                    value={type.value}
                                                >
                                                    {type.label}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError
                                            message={errors.task_type}
                                            className="mt-2"
                                        />
                                        <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                            {
                                                taskTypes.find(
                                                    (type) =>
                                                        type.value ===
                                                        data.task_type
                                                )?.description
                                            }
                                        </div>
                                    </div>
                                </div>

                                {/* Priority and Status */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Priority */}
                                    <div>
                                        <InputLabel
                                            htmlFor="priority"
                                            value="Priority *"
                                        />
                                        <select
                                            id="priority"
                                            name="priority"
                                            value={data.priority}
                                            onChange={(e) =>
                                                setData(
                                                    "priority",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        >
                                            {priorities.map((priority) => (
                                                <option
                                                    key={priority.value}
                                                    value={priority.value}
                                                >
                                                    {priority.label}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError
                                            message={errors.priority}
                                            className="mt-2"
                                        />
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <InputLabel
                                            htmlFor="status"
                                            value="Status *"
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
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        >
                                            {statuses.map((status) => (
                                                <option
                                                    key={status.value}
                                                    value={status.value}
                                                >
                                                    {status.label}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError
                                            message={errors.status}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                {/* Due Date and Course */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Due Date */}
                                    <div>
                                        <InputLabel
                                            htmlFor="due_date"
                                            value="Due Date *"
                                        />
                                        <TextInput
                                            id="due_date"
                                            type="date"
                                            name="due_date"
                                            value={data.due_date}
                                            className="mt-1 block w-full"
                                            required
                                            min={new Date().toISOString().split('T')[0]}
                                            onChange={(e) =>
                                                setData(
                                                    "due_date",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <InputError
                                            message={errors.due_date}
                                            className="mt-2"
                                        />
                                    </div>

                                    {/* Course (if course-related) */}
                                    <div>
                                        <InputLabel
                                            htmlFor="course_id"
                                            value="Related Course"
                                        />
                                        <select
                                            id="course_id"
                                            name="course_id"
                                            value={data.course_id}
                                            onChange={(e) =>
                                                setData(
                                                    "course_id",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                            disabled={
                                                data.task_type !==
                                                "course-related"
                                            }
                                        >
                                            <option value="">
                                                Select course (optional)
                                            </option>
                                            {courses.map((course) => (
                                                <option
                                                    key={course.id}
                                                    value={course.id}
                                                >
                                                    {course.course_name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError
                                            message={errors.course_id}
                                            className="mt-2"
                                        />
                                        {data.task_type !==
                                            "course-related" && (
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                Course selection is only
                                                available for course-related
                                                tasks
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Notes */}
                                <div>
                                    <InputLabel
                                        htmlFor="notes"
                                        value="Additional Notes"
                                    />
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        value={data.notes}
                                        onChange={(e) =>
                                            setData("notes", e.target.value)
                                        }
                                        rows={3}
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        placeholder="Any additional notes or instructions..."
                                    />
                                    <InputError
                                        message={errors.notes}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <Link
                                        href={route("tasks.index")}
                                        className="inline-flex items-center px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 text-sm font-medium rounded-lg transition-colors duration-200"
                                    >
                                        ❌ Cancel
                                    </Link>

                                    <PrimaryButton
                                        className="inline-flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <>
                                                <svg
                                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                Creating...
                                            </>
                                        ) : (
                                            <>✅ Create Task</>
                                        )}
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

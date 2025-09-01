import React, { useState, useEffect } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";

export default function Edit({ booking }) {
    const [trainingPrograms, setTrainingPrograms] = useState([]);
    const [trainingHalls, setTrainingHalls] = useState([]);
    const [trainers, setTrainers] = useState([]);

    const { data, setData, put, processing, errors } = useForm({
        training_program_id: booking.training_program_id || "",
        training_hall_id: booking.training_hall_id || "",
        trainer_id: booking.trainer_id || "",
        start_date: booking.start_date || "",
        end_date: booking.end_date || "",
        start_time: booking.start_time || "",
        end_time: booking.end_time || "",
        max_participants: booking.max_participants || 30,
        current_participants: booking.current_participants || 0,
        price_per_participant: booking.price_per_participant || "",
        notes: booking.notes || "",
        status: booking.status || "scheduled",
        is_recurring: booking.is_recurring || false,
        recurring_pattern: booking.recurring_pattern || {
            days_of_week: [],
            frequency: "weekly",
        },
    });

    // Fetch data for dropdowns
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = document
                    .querySelector('meta[name="csrf-token"]')
                    ?.getAttribute("content");
                const baseUrl = window.location.origin + "/pmec2/public";

                // Fetch training programs
                const programsResponse = await fetch(
                    `${baseUrl}/api/training-programs`,
                    {
                        headers: {
                            "X-CSRF-TOKEN": token,
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                        credentials: "same-origin",
                    }
                );
                if (programsResponse.ok) {
                    const programsData = await programsResponse.json();
                    setTrainingPrograms(programsData.data || []);
                }

                // Fetch training halls
                const hallsResponse = await fetch(
                    `${baseUrl}/api/training-halls`,
                    {
                        headers: {
                            "X-CSRF-TOKEN": token,
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                        credentials: "same-origin",
                    }
                );
                if (hallsResponse.ok) {
                    const hallsData = await hallsResponse.json();
                    setTrainingHalls(hallsData.data || []);
                }

                // Fetch trainers (employees)
                const trainersResponse = await fetch(
                    `${baseUrl}/api/trainers`,
                    {
                        headers: {
                            "X-CSRF-TOKEN": token,
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                        credentials: "same-origin",
                    }
                );
                if (trainersResponse.ok) {
                    const trainersData = await trainersResponse.json();
                    setTrainers(trainersData.data || []);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const submit = (e) => {
        e.preventDefault();
        put(route("hall-bookings.update", booking.id));
    };

    const handleProgramChange = (programId) => {
        setData("training_program_id", programId);
        // Auto-fill end date based on program duration if start date is set
        if (programId && data.start_date) {
            const program = trainingPrograms.find((p) => p.id == programId);
            if (program && program.total_sessions) {
                const startDate = new Date(data.start_date);
                const endDate = new Date(startDate);
                endDate.setDate(
                    startDate.getDate() + program.total_sessions * 7
                ); // Assume weekly sessions
                setData("end_date", endDate.toISOString().split("T")[0]);
            }
        }
    };

    const handleStartDateChange = (startDate) => {
        setData("start_date", startDate);
        // Auto-fill end date if program is selected
        if (data.training_program_id && startDate) {
            const program = trainingPrograms.find(
                (p) => p.id == data.training_program_id
            );
            if (program && program.total_sessions) {
                const start = new Date(startDate);
                const end = new Date(start);
                end.setDate(start.getDate() + program.total_sessions * 7); // Assume weekly sessions
                setData("end_date", end.toISOString().split("T")[0]);
            }
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        ✏️ Edit Hall Booking
                    </h2>
                    <div className="flex space-x-3">
                        <Link
                            href={route("hall-bookings.show", booking.id)}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                        >
                            👁️ View Booking
                        </Link>
                        <Link
                            href={route("hall-bookings.index")}
                            className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                        >
                            ⬅️ Back to Bookings
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Edit Booking ${booking.booking_reference}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                    Edit Hall Booking Information
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Update the details for booking #{booking.booking_reference}. All fields marked with * are required.
                                </p>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                {/* Course and Hall Selection */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel
                                            htmlFor="training_program_id"
                                            value="📚 Training Program *"
                                        />
                                        <select
                                            id="training_program_id"
                                            value={data.training_program_id}
                                            onChange={(e) =>
                                                handleProgramChange(e.target.value)
                                            }
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="">
                                                Select a training program
                                            </option>
                                            {trainingPrograms.map((program) => (
                                                <option
                                                    key={program.id}
                                                    value={program.id}
                                                >
                                                    {program.name} (
                                                    {program.code}) -{" "}
                                                    {program.duration} days
                                                </option>
                                            ))}
                                        </select>
                                        <InputError
                                            message={errors.training_program_id}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="training_hall_id"
                                            value="🏢 Training Hall *"
                                        />
                                        <select
                                            id="training_hall_id"
                                            value={data.training_hall_id}
                                            onChange={(e) =>
                                                setData(
                                                    "training_hall_id",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="">
                                                Select a training hall
                                            </option>
                                            {trainingHalls.map((hall) => (
                                                <option
                                                    key={hall.id}
                                                    value={hall.id}
                                                >
                                                    {hall.name} - {hall.city}{" "}
                                                    (Capacity: {hall.capacity})
                                                </option>
                                            ))}
                                        </select>
                                        <InputError
                                            message={errors.training_hall_id}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                {/* Trainer Selection */}
                                <div>
                                    <InputLabel
                                        htmlFor="trainer_id"
                                        value="👨‍🏫 Trainer *"
                                    />
                                    <select
                                        id="trainer_id"
                                        value={data.trainer_id}
                                        onChange={(e) =>
                                            setData(
                                                "trainer_id",
                                                e.target.value
                                            )
                                        }
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="">
                                            Select a trainer
                                        </option>
                                        {trainers.map((trainer) => (
                                            <option
                                                key={trainer.id}
                                                value={trainer.id}
                                            >
                                                {trainer.full_name} -{" "}
                                                {trainer.position}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError
                                        message={errors.trainer_id}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Status Selection */}
                                <div>
                                    <InputLabel
                                        htmlFor="status"
                                        value="📊 Status *"
                                    />
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) =>
                                            setData("status", e.target.value)
                                        }
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="scheduled">📅 Scheduled</option>
                                        <option value="in_progress">🔄 In Progress</option>
                                        <option value="completed">✅ Completed</option>
                                        <option value="cancelled">❌ Cancelled</option>
                                    </select>
                                    <InputError
                                        message={errors.status}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Schedule Section */}
                                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                        📅 Schedule & Timing
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel
                                                htmlFor="start_date"
                                                value="📅 Start Date *"
                                            />
                                            <TextInput
                                                id="start_date"
                                                type="date"
                                                value={data.start_date}
                                                onChange={(e) =>
                                                    handleStartDateChange(e.target.value)
                                                }
                                                className="mt-1 block w-full"
                                            />
                                            <InputError
                                                message={errors.start_date}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div>
                                            <InputLabel
                                                htmlFor="end_date"
                                                value="📅 End Date *"
                                            />
                                            <TextInput
                                                id="end_date"
                                                type="date"
                                                value={data.end_date}
                                                onChange={(e) =>
                                                    setData(
                                                        "end_date",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full"
                                            />
                                            <InputError
                                                message={errors.end_date}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                        <div>
                                            <InputLabel
                                                htmlFor="start_time"
                                                value="⏰ Start Time *"
                                            />
                                            <TextInput
                                                id="start_time"
                                                type="time"
                                                value={data.start_time}
                                                onChange={(e) =>
                                                    setData(
                                                        "start_time",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full"
                                            />
                                            <InputError
                                                message={errors.start_time}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div>
                                            <InputLabel
                                                htmlFor="end_time"
                                                value="⏰ End Time *"
                                            />
                                            <TextInput
                                                id="end_time"
                                                type="time"
                                                value={data.end_time}
                                                onChange={(e) =>
                                                    setData(
                                                        "end_time",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full"
                                            />
                                            <InputError
                                                message={errors.end_time}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Participants Section */}
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                        👥 Participants & Capacity
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel
                                                htmlFor="max_participants"
                                                value="👥 Maximum Participants *"
                                            />
                                            <TextInput
                                                id="max_participants"
                                                type="number"
                                                min="1"
                                                max="1000"
                                                value={data.max_participants}
                                                onChange={(e) =>
                                                    setData(
                                                        "max_participants",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full"
                                            />
                                            <InputError
                                                message={
                                                    errors.max_participants
                                                }
                                                className="mt-2"
                                            />
                                        </div>

                                        <div>
                                            <InputLabel
                                                htmlFor="current_participants"
                                                value="👥 Current Participants"
                                            />
                                            <TextInput
                                                id="current_participants"
                                                type="number"
                                                min="0"
                                                value={
                                                    data.current_participants
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "current_participants",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full"
                                            />
                                            <InputError
                                                message={
                                                    errors.current_participants
                                                }
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Options */}
                                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                        ⚙️ Additional Options
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel
                                                htmlFor="price_per_participant"
                                                value="💰 Price per Participant"
                                            />
                                            <TextInput
                                                id="price_per_participant"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={
                                                    data.price_per_participant
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "price_per_participant",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full"
                                                placeholder="0.00"
                                            />
                                            <InputError
                                                message={
                                                    errors.price_per_participant
                                                }
                                                className="mt-2"
                                            />
                                        </div>

                                        <div className="flex items-center">
                                            <input
                                                id="is_recurring"
                                                type="checkbox"
                                                checked={data.is_recurring}
                                                onChange={(e) =>
                                                    setData(
                                                        "is_recurring",
                                                        e.target.checked
                                                    )
                                                }
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            />
                                            <label
                                                htmlFor="is_recurring"
                                                className="ml-2 block text-sm text-gray-900 dark:text-white"
                                            >
                                                🔄 Recurring Session
                                            </label>
                                        </div>
                                    </div>

                                    {data.is_recurring && (
                                        <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded border">
                                            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                                                🔄 Recurring Pattern
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Frequency
                                                    </label>
                                                    <select
                                                        value={
                                                            data
                                                                .recurring_pattern
                                                                .frequency
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "recurring_pattern",
                                                                {
                                                                    ...data.recurring_pattern,
                                                                    frequency:
                                                                        e.target
                                                                            .value,
                                                                }
                                                            )
                                                        }
                                                        className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    >
                                                        <option value="daily">
                                                            Daily
                                                        </option>
                                                        <option value="weekly">
                                                            Weekly
                                                        </option>
                                                        <option value="monthly">
                                                            Monthly
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Notes */}
                                <div>
                                    <InputLabel
                                        htmlFor="notes"
                                        value="📝 Additional Notes"
                                    />
                                    <textarea
                                        id="notes"
                                        rows="4"
                                        value={data.notes}
                                        onChange={(e) =>
                                            setData("notes", e.target.value)
                                        }
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="Any additional information about this booking..."
                                    />
                                    <InputError
                                        message={errors.notes}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end space-x-3">
                                    <Link
                                        href={route("hall-bookings.show", booking.id)}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                                    >
                                        ❌ Cancel
                                    </Link>
                                    <PrimaryButton disabled={processing}>
                                        {processing
                                            ? "🔄 Updating..."
                                            : "✅ Update Booking"}
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

import React, { useState, useEffect } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";

export default function CreateUnified() {
    const [trainingPrograms, setTrainingPrograms] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [showBookingSection, setShowBookingSection] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        // Hall Information
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
        assigned_employee_id: "",
        assigned_role: "",
        assignment_date: "",
        assignment_notes: "",
        specialized_courses: [],
        is_general_purpose: true,
        is_active: true,
        sort_order: 0,

        // Booking Information
        training_program_id: "",
        trainer_id: "",
        start_date: "",
        end_date: "",
        start_time: "",
        end_time: "",
        max_participants: 30,
        current_participants: 0,
        price_per_participant: "",
        notes: "",
        is_recurring: false,
        recurring_pattern: {
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
        post(route("training-halls.store-unified"));
    };

    const addFacility = () => {
        const facility = prompt("Enter facility name:");
        if (facility && facility.trim()) {
            setData("facilities", [...data.facilities, facility.trim()]);
        }
    };

    const removeFacility = (index) => {
        setData(
            "facilities",
            data.facilities.filter((_, i) => i !== index)
        );
    };

    const generatePDF = () => {
        // Create a preview of what the PDF would contain
        const previewData = {
            hall: {
                name: data.name || "Sample Hall",
                code: data.code || "SAMPLE",
                city: data.city || "Sample City",
                capacity: data.capacity || 30,
                facilities: data.facilities,
                contact_person: data.contact_person || "Not specified",
                contact_phone: data.contact_phone || "Not specified",
                contact_email: data.contact_email || "Not specified",
                is_active: data.is_active,
            },
            booking: showBookingSection
                ? {
                      training_program: trainingPrograms.find(
                          (p) => p.id == data.training_program_id
                      ),
                      trainer: trainers.find((t) => t.id == data.trainer_id),
                      start_date: data.start_date,
                      end_date: data.end_date,
                      start_time: data.start_time,
                      end_time: data.end_time,
                      max_participants: data.max_participants,
                      current_participants: data.current_participants,
                      price_per_participant: data.price_per_participant,
                  }
                : null,
        };

        // Show preview in a modal or alert
        const previewText = `📄 PDF Report Preview:

🏢 Hall Information:
- Name: ${previewData.hall.name}
- Code: ${previewData.hall.code}
- City: ${previewData.hall.city}
- Capacity: ${previewData.hall.capacity} participants
- Status: ${previewData.hall.is_active ? "Active" : "Inactive"}

${
    showBookingSection
        ? `📅 Booking Information:
- Course: ${previewData.booking.training_program?.name || "Not selected"}
- Trainer: ${previewData.booking.trainer?.full_name || "Not assigned"}
- Dates: ${previewData.booking.start_date} to ${previewData.booking.end_date}
- Time: ${previewData.booking.start_time} - ${previewData.booking.end_time}
- Participants: ${previewData.booking.current_participants}/${
              previewData.booking.max_participants
          }`
        : "No booking information provided"
}

✨ This is a preview. After saving, you can generate the actual PDF from the Training Halls list.`;

        alert(previewText);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        🚀 Create Training Hall & Booking (Unified)
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
            <Head title="Create Training Hall & Booking" />

            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                    🎯 Complete Training Hall & Booking Setup
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Create a new training hall and optionally
                                    schedule your first training session - all
                                    in one place!
                                </p>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                {/* Hall Information Section */}
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                                            🏢 Training Hall Information
                                        </h4>
                                        <span className="text-sm text-blue-600 dark:text-blue-400">
                                            Required
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel
                                                htmlFor="name"
                                                value="Hall Name *"
                                            />
                                            <TextInput
                                                id="name"
                                                type="text"
                                                name="name"
                                                value={data.name}
                                                className="mt-1 block w-full"
                                                onChange={(e) =>
                                                    setData(
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="e.g., مكانك اسكندرية"
                                                required
                                            />
                                            <InputError
                                                message={errors.name}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div>
                                            <InputLabel
                                                htmlFor="code"
                                                value="Hall Code *"
                                            />
                                            <TextInput
                                                id="code"
                                                type="text"
                                                name="code"
                                                value={data.code}
                                                className="mt-1 block w-full"
                                                onChange={(e) =>
                                                    setData(
                                                        "code",
                                                        e.target.value.toUpperCase()
                                                    )
                                                }
                                                placeholder="e.g., ALEX"
                                                maxLength="10"
                                                required
                                            />
                                            <InputError
                                                message={errors.code}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6">
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
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            rows="3"
                                            placeholder="Brief description of the training hall and its purpose"
                                        />
                                        <InputError
                                            message={errors.description}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                        <div>
                                            <InputLabel
                                                htmlFor="city"
                                                value="City *"
                                            />
                                            <TextInput
                                                id="city"
                                                type="text"
                                                name="city"
                                                value={data.city}
                                                className="mt-1 block w-full"
                                                onChange={(e) =>
                                                    setData(
                                                        "city",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="e.g., الإسكندرية"
                                                required
                                            />
                                            <InputError
                                                message={errors.city}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div>
                                            <InputLabel
                                                htmlFor="address"
                                                value="Address"
                                            />
                                            <TextInput
                                                id="address"
                                                type="text"
                                                name="address"
                                                value={data.address}
                                                className="mt-1 block w-full"
                                                onChange={(e) =>
                                                    setData(
                                                        "address",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="e.g., Alexandria, Egypt"
                                            />
                                            <InputError
                                                message={errors.address}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                        <div>
                                            <InputLabel
                                                htmlFor="capacity"
                                                value="Maximum Capacity *"
                                            />
                                            <TextInput
                                                id="capacity"
                                                type="number"
                                                name="capacity"
                                                value={data.capacity}
                                                className="mt-1 block w-full"
                                                onChange={(e) =>
                                                    setData(
                                                        "capacity",
                                                        e.target.value
                                                    )
                                                }
                                                min="1"
                                                max="1000"
                                                required
                                            />
                                            <InputError
                                                message={errors.capacity}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div>
                                            <InputLabel
                                                htmlFor="sort_order"
                                                value="Sort Order"
                                            />
                                            <TextInput
                                                id="sort_order"
                                                type="number"
                                                name="sort_order"
                                                value={data.sort_order}
                                                className="mt-1 block w-full"
                                                onChange={(e) =>
                                                    setData(
                                                        "sort_order",
                                                        e.target.value
                                                    )
                                                }
                                                min="0"
                                                placeholder="0"
                                            />
                                            <InputError
                                                message={errors.sort_order}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <InputLabel value="Available Facilities" />
                                        <div className="mt-2 space-y-2">
                                            {data.facilities.map(
                                                (facility, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center space-x-2"
                                                    >
                                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                                            {facility}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeFacility(
                                                                    index
                                                                )
                                                            }
                                                            className="text-red-600 hover:text-red-800 text-sm"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                )
                                            )}
                                            <button
                                                type="button"
                                                onClick={addFacility}
                                                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                            >
                                                ➕ Add Facility
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                        <div>
                                            <InputLabel
                                                htmlFor="contact_person"
                                                value="Contact Person"
                                            />
                                            <TextInput
                                                id="contact_person"
                                                type="text"
                                                name="contact_person"
                                                value={data.contact_person}
                                                className="mt-1 block w-full"
                                                onChange={(e) =>
                                                    setData(
                                                        "contact_person",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="e.g., Ahmed Hassan"
                                            />
                                            <InputError
                                                message={errors.contact_person}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div>
                                            <InputLabel
                                                htmlFor="contact_phone"
                                                value="Contact Phone"
                                            />
                                            <TextInput
                                                id="contact_phone"
                                                type="text"
                                                name="contact_phone"
                                                value={data.contact_phone}
                                                className="mt-1 block w-full"
                                                onChange={(e) =>
                                                    setData(
                                                        "contact_phone",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="e.g., +20-3-1234-5678"
                                            />
                                            <InputError
                                                message={errors.contact_phone}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div>
                                            <InputLabel
                                                htmlFor="contact_email"
                                                value="Contact Email"
                                            />
                                            <TextInput
                                                id="contact_email"
                                                type="email"
                                                name="contact_email"
                                                value={data.contact_email}
                                                className="mt-1 block w-full"
                                                onChange={(e) =>
                                                    setData(
                                                        "contact_email",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="e.g., hall@company.com"
                                            />
                                            <InputError
                                                message={errors.contact_email}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="is_active"
                                                checked={data.is_active}
                                                onChange={(e) =>
                                                    setData(
                                                        "is_active",
                                                        e.target.checked
                                                    )
                                                }
                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                                Training hall is active
                                            </span>
                                        </label>
                                    </div>

                                    {/* Employee Assignment Section */}
                                    <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                        <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-4">
                                            👤 Employee Assignment
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <InputLabel
                                                    htmlFor="assigned_employee_id"
                                                    value="Assigned Employee"
                                                />
                                                <select
                                                    id="assigned_employee_id"
                                                    name="assigned_employee_id"
                                                    value={
                                                        data.assigned_employee_id
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "assigned_employee_id",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                >
                                                    <option value="">
                                                        Select an employee
                                                    </option>
                                                    {trainers.map((trainer) => (
                                                        <option
                                                            key={trainer.id}
                                                            value={trainer.id}
                                                        >
                                                            {trainer.full_name}{" "}
                                                            - {trainer.position}
                                                        </option>
                                                    ))}
                                                </select>
                                                <InputError
                                                    message={
                                                        errors.assigned_employee_id
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor="assigned_role"
                                                    value="Assignment Role"
                                                />
                                                <select
                                                    id="assigned_role"
                                                    name="assigned_role"
                                                    value={data.assigned_role}
                                                    onChange={(e) =>
                                                        setData(
                                                            "assigned_role",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                >
                                                    <option value="">
                                                        Select a role
                                                    </option>
                                                    <option value="manager">
                                                        Manager
                                                    </option>
                                                    <option value="coordinator">
                                                        Coordinator
                                                    </option>
                                                    <option value="supervisor">
                                                        Supervisor
                                                    </option>
                                                    <option value="assistant">
                                                        Assistant
                                                    </option>
                                                </select>
                                                <InputError
                                                    message={
                                                        errors.assigned_role
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                            <div>
                                                <InputLabel
                                                    htmlFor="assignment_date"
                                                    value="Assignment Date"
                                                />
                                                <input
                                                    id="assignment_date"
                                                    type="date"
                                                    name="assignment_date"
                                                    value={data.assignment_date}
                                                    onChange={(e) =>
                                                        setData(
                                                            "assignment_date",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                />
                                                <InputError
                                                    message={
                                                        errors.assignment_date
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor="assignment_notes"
                                                    value="Assignment Notes"
                                                />
                                                <textarea
                                                    id="assignment_notes"
                                                    name="assignment_notes"
                                                    value={
                                                        data.assignment_notes
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "assignment_notes",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    rows="2"
                                                    placeholder="Notes about this employee assignment..."
                                                />
                                                <InputError
                                                    message={
                                                        errors.assignment_notes
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Course Specialization Section */}
                                    <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                        <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-4">
                                            📚 Course Specialization
                                        </h4>
                                        <div className="mb-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    name="is_general_purpose"
                                                    checked={
                                                        data.is_general_purpose
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "is_general_purpose",
                                                            e.target.checked
                                                        )
                                                    }
                                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                />
                                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                                    This hall can host any type
                                                    of course (General Purpose)
                                                </span>
                                            </label>
                                        </div>
                                        {!data.is_general_purpose && (
                                            <div>
                                                <InputLabel value="Specialized Courses" />
                                                <div className="mt-2 space-y-2">
                                                    {data.specialized_courses.map(
                                                        (courseId, index) => {
                                                            const course =
                                                                trainingPrograms.find(
                                                                    (p) =>
                                                                        p.id ==
                                                                        courseId
                                                                );
                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className="flex items-center space-x-2"
                                                                >
                                                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                                                        {course?.name ||
                                                                            `Course ID: ${courseId}`}
                                                                    </span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            setData(
                                                                                "specialized_courses",
                                                                                data.specialized_courses.filter(
                                                                                    (
                                                                                        _,
                                                                                        i
                                                                                    ) =>
                                                                                        i !==
                                                                                        index
                                                                                )
                                                                            )
                                                                        }
                                                                        className="text-red-600 hover:text-red-800 text-sm"
                                                                    >
                                                                        ✕
                                                                    </button>
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                    <select
                                                        onChange={(e) => {
                                                            if (
                                                                e.target
                                                                    .value &&
                                                                !data.specialized_courses.includes(
                                                                    e.target
                                                                        .value
                                                                )
                                                            ) {
                                                                setData(
                                                                    "specialized_courses",
                                                                    [
                                                                        ...data.specialized_courses,
                                                                        e.target
                                                                            .value,
                                                                    ]
                                                                );
                                                                e.target.value =
                                                                    "";
                                                            }
                                                        }}
                                                        className="mt-2 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    >
                                                        <option value="">
                                                            Add a specialized
                                                            course
                                                        </option>
                                                        {trainingPrograms.map(
                                                            (program) => (
                                                                <option
                                                                    key={
                                                                        program.id
                                                                    }
                                                                    value={
                                                                        program.id
                                                                    }
                                                                >
                                                                    {
                                                                        program.name
                                                                    }{" "}
                                                                    (
                                                                    {
                                                                        program.code
                                                                    }
                                                                    )
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Booking Section Toggle */}
                                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-6">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
                                            📅 Training Session Booking
                                            (Optional)
                                        </h4>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={showBookingSection}
                                                onChange={(e) =>
                                                    setShowBookingSection(
                                                        e.target.checked
                                                    )
                                                }
                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                                Schedule training session now
                                            </span>
                                        </label>
                                    </div>

                                    {showBookingSection && (
                                        <div className="mt-6 space-y-6">
                                            {/* Course and Trainer Selection */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <InputLabel
                                                        htmlFor="training_program_id"
                                                        value="Course Name *"
                                                    />
                                                    <select
                                                        id="training_program_id"
                                                        name="training_program_id"
                                                        value={
                                                            data.training_program_id
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "training_program_id",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                        required
                                                    >
                                                        <option value="">
                                                            Select a course
                                                        </option>
                                                        {trainingPrograms.map(
                                                            (program) => (
                                                                <option
                                                                    key={
                                                                        program.id
                                                                    }
                                                                    value={
                                                                        program.id
                                                                    }
                                                                >
                                                                    {
                                                                        program.name
                                                                    }{" "}
                                                                    (
                                                                    {
                                                                        program.code
                                                                    }
                                                                    ) -{" "}
                                                                    {
                                                                        program.duration_hours
                                                                    }
                                                                    h
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                    <InputError
                                                        message={
                                                            errors.training_program_id
                                                        }
                                                        className="mt-2"
                                                    />
                                                </div>

                                                <div>
                                                    <InputLabel
                                                        htmlFor="trainer_id"
                                                        value="Trainer"
                                                    />
                                                    <select
                                                        id="trainer_id"
                                                        name="trainer_id"
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
                                                        {trainers.map(
                                                            (trainer) => (
                                                                <option
                                                                    key={
                                                                        trainer.id
                                                                    }
                                                                    value={
                                                                        trainer.id
                                                                    }
                                                                >
                                                                    {
                                                                        trainer.full_name
                                                                    }{" "}
                                                                    -{" "}
                                                                    {
                                                                        trainer.position
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                    <InputError
                                                        message={
                                                            errors.trainer_id
                                                        }
                                                        className="mt-2"
                                                    />
                                                </div>
                                            </div>

                                            {/* Dates and Times */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <InputLabel
                                                        htmlFor="start_date"
                                                        value="Start Date *"
                                                    />
                                                    <input
                                                        id="start_date"
                                                        type="date"
                                                        name="start_date"
                                                        value={data.start_date}
                                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                        onChange={(e) =>
                                                            setData(
                                                                "start_date",
                                                                e.target.value
                                                            )
                                                        }
                                                        min={
                                                            new Date()
                                                                .toISOString()
                                                                .split("T")[0]
                                                        }
                                                        required
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.start_date
                                                        }
                                                        className="mt-2"
                                                    />
                                                </div>

                                                <div>
                                                    <InputLabel
                                                        htmlFor="end_date"
                                                        value="End Date *"
                                                    />
                                                    <input
                                                        id="end_date"
                                                        type="date"
                                                        name="end_date"
                                                        value={data.end_date}
                                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                        onChange={(e) =>
                                                            setData(
                                                                "end_date",
                                                                e.target.value
                                                            )
                                                        }
                                                        min={
                                                            data.start_date ||
                                                            new Date()
                                                                .toISOString()
                                                                .split("T")[0]
                                                        }
                                                        required
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.end_date
                                                        }
                                                        className="mt-2"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <InputLabel
                                                        htmlFor="start_time"
                                                        value="Start Time *"
                                                    />
                                                    <input
                                                        id="start_time"
                                                        type="time"
                                                        name="start_time"
                                                        value={data.start_time}
                                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                        onChange={(e) =>
                                                            setData(
                                                                "start_time",
                                                                e.target.value
                                                            )
                                                        }
                                                        required
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.start_time
                                                        }
                                                        className="mt-2"
                                                    />
                                                </div>

                                                <div>
                                                    <InputLabel
                                                        htmlFor="end_time"
                                                        value="End Time *"
                                                    />
                                                    <input
                                                        id="end_time"
                                                        type="time"
                                                        name="end_time"
                                                        value={data.end_time}
                                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                        onChange={(e) =>
                                                            setData(
                                                                "end_time",
                                                                e.target.value
                                                            )
                                                        }
                                                        required
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.end_time
                                                        }
                                                        className="mt-2"
                                                    />
                                                </div>
                                            </div>

                                            {/* Participants and Pricing */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div>
                                                    <InputLabel
                                                        htmlFor="max_participants"
                                                        value="Max Participants *"
                                                    />
                                                    <TextInput
                                                        id="max_participants"
                                                        type="number"
                                                        name="max_participants"
                                                        value={
                                                            data.max_participants
                                                        }
                                                        className="mt-1 block w-full"
                                                        onChange={(e) =>
                                                            setData(
                                                                "max_participants",
                                                                e.target.value
                                                            )
                                                        }
                                                        min="1"
                                                        max={data.capacity}
                                                        required
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
                                                        value="Current Participants"
                                                    />
                                                    <TextInput
                                                        id="current_participants"
                                                        type="number"
                                                        name="current_participants"
                                                        value={
                                                            data.current_participants
                                                        }
                                                        className="mt-1 block w-full"
                                                        onChange={(e) =>
                                                            setData(
                                                                "current_participants",
                                                                e.target.value
                                                            )
                                                        }
                                                        min="0"
                                                        max={
                                                            data.max_participants
                                                        }
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.current_participants
                                                        }
                                                        className="mt-2"
                                                    />
                                                </div>

                                                <div>
                                                    <InputLabel
                                                        htmlFor="price_per_participant"
                                                        value="Price per Participant"
                                                    />
                                                    <TextInput
                                                        id="price_per_participant"
                                                        type="number"
                                                        name="price_per_participant"
                                                        value={
                                                            data.price_per_participant
                                                        }
                                                        className="mt-1 block w-full"
                                                        onChange={(e) =>
                                                            setData(
                                                                "price_per_participant",
                                                                e.target.value
                                                            )
                                                        }
                                                        min="0"
                                                        step="0.01"
                                                        placeholder="0.00"
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.price_per_participant
                                                        }
                                                        className="mt-2"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <InputLabel
                                                    htmlFor="notes"
                                                    value="Session Notes"
                                                />
                                                <textarea
                                                    id="notes"
                                                    name="notes"
                                                    value={data.notes}
                                                    onChange={(e) =>
                                                        setData(
                                                            "notes",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    rows="3"
                                                    placeholder="Additional notes about this training session..."
                                                />
                                                <InputError
                                                    message={errors.notes}
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Form Actions */}
                                <div className="flex justify-between items-center">
                                    <div className="flex space-x-4">
                                        <button
                                            type="button"
                                            onClick={generatePDF}
                                            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                        >
                                            📄 Generate PDF Report
                                        </button>
                                    </div>

                                    <div className="flex space-x-4">
                                        <Link
                                            href={route("training-halls.index")}
                                            className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                        >
                                            Cancel
                                        </Link>
                                        <PrimaryButton
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-medium rounded-lg transition-colors duration-200"
                                        >
                                            {processing
                                                ? "Creating..."
                                                : "🚀 Create Hall & Booking"}
                                        </PrimaryButton>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

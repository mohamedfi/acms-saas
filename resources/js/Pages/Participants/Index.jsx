import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function Index() {
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);
    const [qrModalOpen, setQrModalOpen] = useState(false);
    const [selectedParticipant, setSelectedParticipant] = useState(null);
    const [filterNationality, setFilterNationality] = useState("");
    const [filterCourse, setFilterCourse] = useState("");
    const [filterCountry, setFilterCountry] = useState("");
    const [courses, setCourses] = useState([]);
    const { delete: deleteParticipant } = useForm();

    // Comprehensive list of nationalities
    const nationalities = [
        "Afghan",
        "Albanian",
        "Algerian",
        "American",
        "Andorran",
        "Angolan",
        "Antiguans",
        "Argentinean",
        "Armenian",
        "Australian",
        "Austrian",
        "Azerbaijani",
        "Bahamian",
        "Bahraini",
        "Bangladeshi",
        "Barbadian",
        "Barbudans",
        "Batswana",
        "Belarusian",
        "Belgian",
        "Belizean",
        "Beninese",
        "Bhutanese",
        "Bolivian",
        "Bosnian",
        "Brazilian",
        "British",
        "Bruneian",
        "Bulgarian",
        "Burkinabe",
        "Burmese",
        "Burundian",
        "Cambodian",
        "Cameroonian",
        "Canadian",
        "Cape Verdean",
        "Central African",
        "Chadian",
        "Chilean",
        "Chinese",
        "Colombian",
        "Comoran",
        "Congolese",
        "Costa Rican",
        "Croatian",
        "Cuban",
        "Cypriot",
        "Czech",
        "Danish",
        "Djibouti",
        "Dominican",
        "Dutch",
        "East Timorese",
        "Ecuadorean",
        "Egyptian",
        "Emirian",
        "Equatorial Guinean",
        "Eritrean",
        "Estonian",
        "Ethiopian",
        "Fijian",
        "Filipino",
        "Finnish",
        "French",
        "Gabonese",
        "Gambian",
        "Georgian",
        "German",
        "Ghanaian",
        "Greek",
        "Grenadian",
        "Guatemalan",
        "Guinea-Bissauan",
        "Guinean",
        "Guyanese",
        "Haitian",
        "Herzegovinian",
        "Honduran",
        "Hungarian",
        "I-Kiribati",
        "Icelander",
        "Indian",
        "Indonesian",
        "Iranian",
        "Iraqi",
        "Irish",
        "Israeli",
        "Italian",
        "Ivorian",
        "Jamaican",
        "Japanese",
        "Jordanian",
        "Kazakhstani",
        "Kenyan",
        "Kittian and Nevisian",
        "Kuwaiti",
        "Kyrgyz",
        "Laotian",
        "Latvian",
        "Lebanese",
        "Liberian",
        "Libyan",
        "Liechtensteiner",
        "Lithuanian",
        "Luxembourger",
        "Macedonian",
        "Malagasy",
        "Malawian",
        "Malaysian",
        "Maldivan",
        "Malian",
        "Maltese",
        "Marshallese",
        "Mauritanian",
        "Mauritian",
        "Mexican",
        "Micronesian",
        "Moldovan",
        "Monacan",
        "Mongolian",
        "Moroccan",
        "Mosotho",
        "Motswana",
        "Mozambican",
        "Namibian",
        "Nauruan",
        "Nepalese",
        "New Zealander",
        "Ni-Vanuatu",
        "Nicaraguan",
        "Nigerian",
        "Nigerien",
        "North Korean",
        "Northern Irish",
        "Norwegian",
        "Omani",
        "Pakistani",
        "Palauan",
        "Panamanian",
        "Papua New Guinean",
        "Paraguayan",
        "Peruvian",
        "Polish",
        "Portuguese",
        "Qatari",
        "Romanian",
        "Russian",
        "Rwandan",
        "Saint Lucian",
        "Salvadoran",
        "Samoan",
        "San Marinese",
        "Sao Tomean",
        "Saudi",
        "Scottish",
        "Senegalese",
        "Serbian",
        "Seychellois",
        "Sierra Leonean",
        "Singaporean",
        "Slovakian",
        "Slovenian",
        "Solomon Islander",
        "Somali",
        "South African",
        "South Korean",
        "Spanish",
        "Sri Lankan",
        "Sudanese",
        "Surinamer",
        "Swazi",
        "Swedish",
        "Swiss",
        "Syrian",
        "Taiwanese",
        "Tajik",
        "Tanzanian",
        "Thai",
        "Togolese",
        "Tongan",
        "Trinidadian or Tobagonian",
        "Tunisian",
        "Turkish",
        "Tuvaluan",
        "Ugandan",
        "Ukrainian",
        "Uruguayan",
        "Uzbekistani",
        "Venezuelan",
        "Vietnamese",
        "Welsh",
        "Yemenite",
        "Zambian",
        "Zimbabwean",
    ];

    useEffect(() => {
        // Use the correct URL for MAMP
        const baseUrl = window.location.origin;

        // Fetch participants
        fetch(`${baseUrl}/api/participants`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("Debug - Participants data received:", data);
                setParticipants(data.data || []);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching participants:", error);
                setLoading(false);
            });

        // Fetch courses for filter
        fetch(`${baseUrl}/api/courses`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("Debug - Courses data received:", data);
                setCourses(data.data || []);
            })
            .catch((error) => {
                console.error("Error fetching courses:", error);
            });
    }, []);

    const handleDelete = (participantId) => {
        if (confirm("Are you sure you want to delete this participant?")) {
            deleteParticipant(route("participants.destroy", participantId), {
                onSuccess: () => {
                    // Refresh the participants list after successful deletion
                    const baseUrl = window.location.origin;
                    fetch(`${baseUrl}/api/participants`)
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error(
                                    `HTTP error! status: ${response.status}`
                                );
                            }
                            return response.json();
                        })
                        .then((data) => {
                            setParticipants(data.data || []);
                        })
                        .catch((error) => {
                            console.error(
                                "Error refreshing participants:",
                                error
                            );
                        });
                },
            });
        }
    };

    const openQrModal = (participant) => {
        setSelectedParticipant(participant);
        setQrModalOpen(true);
    };

    const closeQrModal = () => {
        setQrModalOpen(false);
        setSelectedParticipant(null);
    };

    const getFilteredParticipants = () => {
        return participants.filter((participant) => {
            const matchesNationality =
                !filterNationality ||
                participant.nationality
                    ?.toLowerCase()
                    .includes(filterNationality.toLowerCase());

            const matchesCountry =
                !filterCountry ||
                participant.organization
                    ?.toLowerCase()
                    .includes(filterCountry.toLowerCase());

            let matchesCourse = true;
            if (filterCourse === "enrolled") {
                matchesCourse = participant.enrolled_courses_count > 0;
            } else if (filterCourse === "not-enrolled") {
                matchesCourse = participant.enrolled_courses_count === 0;
            }

            return matchesNationality && matchesCountry && matchesCourse;
        });
    };

    const clearFilters = () => {
        setFilterNationality("");
        setFilterCountry("");
        setFilterCourse("");
    };

    const getVisaStatusBadge = (status, nationality) => {
        const baseClasses =
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";

        // If Egyptian, no visa needed
        if (nationality && nationality.toLowerCase() === "egyptian") {
            return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`;
        }

        // For non-Egyptians, visa is required
        return `${baseClasses} bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200`;
    };

    const getVisaStatusText = (status, nationality) => {
        // If Egyptian, no visa needed
        if (nationality && nationality.toLowerCase() === "egyptian") {
            return "Not Required";
        }

        // For non-Egyptians, visa is required
        return "Required";
    };

    const getInitials = (name) => {
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        👥 Participants Management
                    </h2>
                    <Link
                        href={route("participants.create")}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                        + Add New Participant
                    </Link>
                </div>
            }
        >
            <Head title="Participants" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {loading ? (
                                <div className="flex justify-center items-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                    <span className="ml-2">
                                        Loading participants...
                                    </span>
                                </div>
                            ) : participants.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-gray-400 text-6xl mb-4">
                                        👥
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                        No participants found
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Get started by adding your first
                                        participant.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Filters */}
                                    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="flex flex-col sm:flex-row gap-4 items-end">
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    🌍 Nationality
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Filter by nationality..."
                                                    value={filterNationality}
                                                    onChange={(e) =>
                                                        setFilterNationality(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-600 dark:text-white dark:focus:ring-indigo-600 dark:focus:border-indigo-600"
                                                />
                                            </div>

                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    🏢 Organization/Country
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Filter by organization or country..."
                                                    value={filterCountry}
                                                    onChange={(e) =>
                                                        setFilterCountry(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-600 dark:text-white dark:focus:ring-indigo-600 dark:focus:border-indigo-600"
                                                />
                                            </div>

                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    📚 Course Enrollment
                                                </label>
                                                <select
                                                    value={filterCourse}
                                                    onChange={(e) =>
                                                        setFilterCourse(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-600 dark:text-white dark:focus:ring-indigo-600 dark:focus:border-indigo-600"
                                                >
                                                    <option value="">
                                                        All Participants
                                                    </option>
                                                    <option value="enrolled">
                                                        Enrolled in Courses
                                                    </option>
                                                    <option value="not-enrolled">
                                                        Not Enrolled
                                                    </option>
                                                </select>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={clearFilters}
                                                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md text-sm font-medium transition-colors"
                                                >
                                                    🗑️ Clear
                                                </button>
                                            </div>
                                        </div>

                                        {/* Filter Summary */}
                                        {(filterNationality ||
                                            filterCountry ||
                                            filterCourse) && (
                                            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-sm text-blue-700 dark:text-blue-300">
                                                        <span className="font-medium">
                                                            Active Filters:
                                                        </span>
                                                        {filterNationality && (
                                                            <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-800 rounded text-xs">
                                                                Nationality:{" "}
                                                                {
                                                                    filterNationality
                                                                }
                                                            </span>
                                                        )}
                                                        {filterCountry && (
                                                            <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-800 rounded text-xs">
                                                                Country:{" "}
                                                                {filterCountry}
                                                            </span>
                                                        )}
                                                        {filterCourse && (
                                                            <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-800 rounded text-xs">
                                                                Course:{" "}
                                                                {filterCourse ===
                                                                "enrolled"
                                                                    ? "Enrolled"
                                                                    : "Not Enrolled"}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-blue-600 dark:text-blue-400">
                                                        Showing{" "}
                                                        {
                                                            getFilteredParticipants()
                                                                .length
                                                        }{" "}
                                                        of {participants.length}{" "}
                                                        participants
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-700">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Name
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Email
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Phone
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Nationality
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        ID/Passport
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Visa Status
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Courses
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        QR Code
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                                {getFilteredParticipants()
                                                    .length === 0 ? (
                                                    <tr>
                                                        <td
                                                            colSpan="9"
                                                            className="px-6 py-8 text-center"
                                                        >
                                                            <div className="text-gray-500 dark:text-gray-400">
                                                                <div className="text-4xl mb-2">
                                                                    🔍
                                                                </div>
                                                                <p className="text-lg font-medium">
                                                                    No
                                                                    participants
                                                                    match your
                                                                    filters
                                                                </p>
                                                                <p className="text-sm">
                                                                    Try
                                                                    adjusting
                                                                    your search
                                                                    criteria or
                                                                    clear all
                                                                    filters
                                                                </p>
                                                                <button
                                                                    onClick={
                                                                        clearFilters
                                                                    }
                                                                    className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors"
                                                                >
                                                                    Clear All
                                                                    Filters
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    getFilteredParticipants().map(
                                                        (participant) => (
                                                            <tr
                                                                key={
                                                                    participant.id
                                                                }
                                                                className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                                            >
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="flex items-center">
                                                                        <div className="h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center overflow-hidden">
                                                                            {participant.thumbnail_url ? (
                                                                                <img
                                                                                    src={
                                                                                        participant.thumbnail_url
                                                                                    }
                                                                                    alt={
                                                                                        participant.full_name
                                                                                    }
                                                                                    className="h-full w-full object-cover"
                                                                                />
                                                                            ) : (
                                                                                <span className="text-white font-medium text-sm">
                                                                                    {getInitials(
                                                                                        participant.full_name
                                                                                    )}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <div className="ml-4">
                                                                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                                {
                                                                                    participant.full_name
                                                                                }
                                                                            </div>
                                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                                ID:{" "}
                                                                                {
                                                                                    participant.id
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm text-gray-900 dark:text-gray-100">
                                                                        {
                                                                            participant.email
                                                                        }
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm text-gray-900 dark:text-gray-100">
                                                                        {participant.phone ||
                                                                            "N/A"}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm text-gray-900 dark:text-gray-100">
                                                                        {participant.nationality ||
                                                                            "N/A"}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm text-gray-900 dark:text-gray-100">
                                                                        {participant.passport_no ||
                                                                            "N/A"}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <span
                                                                        className={getVisaStatusBadge(
                                                                            participant.visa_status ||
                                                                                "active",
                                                                            participant.nationality
                                                                        )}
                                                                    >
                                                                        {getVisaStatusText(
                                                                            participant.visa_status ||
                                                                                "active",
                                                                            participant.nationality
                                                                        )}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm text-gray-900 dark:text-gray-100">
                                                                        {participant.enrolled_courses_count ||
                                                                            "0"}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm text-gray-900 dark:text-gray-100">
                                                                        {participant.qr_code ? (
                                                                            <button
                                                                                onClick={() =>
                                                                                    openQrModal(
                                                                                        participant
                                                                                    )
                                                                                }
                                                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
                                                                            >
                                                                                📱
                                                                                View
                                                                                QR
                                                                            </button>
                                                                        ) : (
                                                                            "N/A"
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                    <div className="flex space-x-2">
                                                                        <Link
                                                                            href={route(
                                                                                "participants.show",
                                                                                participant.id
                                                                            )}
                                                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                                        >
                                                                            View
                                                                        </Link>
                                                                        <Link
                                                                            href={route(
                                                                                "participants.edit",
                                                                                participant.id
                                                                            )}
                                                                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                                                                        >
                                                                            Edit
                                                                        </Link>
                                                                        <button
                                                                            onClick={() =>
                                                                                handleDelete(
                                                                                    participant.id
                                                                                )
                                                                            }
                                                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* QR Code Modal */}
            {qrModalOpen && selectedParticipant && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                📱 QR Code - {selectedParticipant.full_name}
                            </h3>
                            <button
                                onClick={closeQrModal}
                                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div className="text-center space-y-4">
                            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                <img
                                    src={route(
                                        "participants.qr-code",
                                        selectedParticipant.id
                                    )}
                                    alt={`QR Code for ${selectedParticipant.full_name}`}
                                    className="w-48 h-48 mx-auto border border-gray-300 dark:border-gray-600 rounded-lg"
                                />
                            </div>

                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                <p>
                                    <strong>QR Code:</strong>{" "}
                                    {selectedParticipant.qr_code}
                                </p>
                                <p className="mt-2">
                                    Scan this QR code for attendance tracking
                                    and participant identification.
                                </p>
                            </div>

                            <div className="flex justify-center space-x-3">
                                <button
                                    onClick={closeQrModal}
                                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md text-sm font-medium transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        const link =
                                            document.createElement("a");
                                        link.href = route(
                                            "participants.qr-code",
                                            selectedParticipant.id
                                        );
                                        link.download = `qr-code-${selectedParticipant.full_name}.svg`;
                                        link.click();
                                    }}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors"
                                >
                                    Download QR
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function Create() {
    const [imagePreview, setImagePreview] = useState(null);
    const [courses, setCourses] = useState([]);

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

    const { data, setData, post, processing, errors } = useForm({
        full_name: "",
        email: "",
        phone: "",
        nationality: "",
        passport_no: "",
        visa_status: "required",
        profile_image: null,
        passport_id_document: null,
        course_ids: [],
    });

    useEffect(() => {
        // Fetch available courses
        const baseUrl = window.location.origin + "/pmec2/public";
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("profile_image", file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDocumentChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("passport_id_document", file);
        }
    };

    const handleCourseSelection = (courseId) => {
        const currentCourseIds = [...data.course_ids];
        const index = currentCourseIds.indexOf(courseId);

        if (index > -1) {
            currentCourseIds.splice(index, 1);
        } else {
            currentCourseIds.push(courseId);
        }

        setData("course_ids", currentCourseIds);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("participants.store"));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        👤 Add New Participant
                    </h2>
                    <Link
                        href={route("participants.index")}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                        ← Back to List
                    </Link>
                </div>
            }
        >
            <Head title="Add New Participant" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Profile Image Upload */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        📸 Profile Image
                                    </h3>
                                    <div className="flex items-center space-x-6">
                                        <div className="flex-shrink-0">
                                            {imagePreview ? (
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="h-24 w-24 rounded-full object-cover border-2 border-gray-300"
                                                />
                                            ) : (
                                                <div className="h-24 w-24 rounded-full bg-gray-300 flex items-center justify-center">
                                                    <span className="text-gray-500 text-2xl">
                                                        👤
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <label
                                                htmlFor="profile_image"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                            >
                                                Upload Profile Image
                                            </label>
                                            <input
                                                type="file"
                                                id="profile_image"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900 dark:file:text-indigo-300"
                                            />
                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                JPG, PNG, GIF up to 5MB
                                            </p>
                                            {errors.profile_image && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.profile_image}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Passport/ID Document Upload */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        🛂 Passport/ID Document
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label
                                                htmlFor="passport_id_document"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                            >
                                                Upload Passport or ID Document *
                                            </label>
                                            <input
                                                type="file"
                                                id="passport_id_document"
                                                accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx"
                                                onChange={handleDocumentChange}
                                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900 dark:file:text-indigo-300"
                                                required
                                            />
                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                📄 PDF, JPG, PNG, GIF, DOC, DOCX
                                                up to 10MB
                                            </p>
                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                💡 <strong>Required:</strong>{" "}
                                                Upload a clear copy of passport,
                                                national ID, or other official
                                                identification document
                                            </p>
                                            {errors.passport_id_document && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {
                                                        errors.passport_id_document
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Personal Information */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        📋 Personal Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label
                                                htmlFor="full_name"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="full_name"
                                                value={data.full_name}
                                                onChange={(e) =>
                                                    setData(
                                                        "full_name",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm shadow-sm"
                                                required
                                            />
                                            {errors.full_name && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.full_name}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="email"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData(
                                                        "email",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm shadow-sm"
                                                required
                                            />
                                            {errors.email && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="phone"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                value={data.phone}
                                                onChange={(e) =>
                                                    setData(
                                                        "phone",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm shadow-sm"
                                            />
                                            {errors.phone && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.phone}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Travel Information */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        🛂 Travel Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label
                                                htmlFor="nationality"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                Nationality *
                                            </label>
                                            <select
                                                id="nationality"
                                                value={data.nationality}
                                                onChange={(e) =>
                                                    setData(
                                                        "nationality",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm shadow-sm"
                                                required
                                            >
                                                <option value="">
                                                    Select Nationality
                                                </option>
                                                {nationalities.map(
                                                    (nationality) => (
                                                        <option
                                                            key={nationality}
                                                            value={nationality}
                                                        >
                                                            {nationality}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                            {errors.nationality && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.nationality}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="passport_no"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                ID/Passport Number *
                                            </label>
                                            <input
                                                type="text"
                                                id="passport_no"
                                                value={data.passport_no}
                                                onChange={(e) =>
                                                    setData(
                                                        "passport_no",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="National ID or Passport Number"
                                                className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm shadow-sm"
                                                required
                                            />
                                            {errors.passport_no && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.passport_no}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="visa_status"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                Visa Status
                                            </label>
                                            <div className="mt-1 p-3 bg-gray-100 dark:bg-gray-600 rounded-md">
                                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                                    💡{" "}
                                                    <strong>Automatic:</strong>{" "}
                                                    Visa status is automatically
                                                    determined based on
                                                    nationality.
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    🇪🇬{" "}
                                                    <strong>Egyptian:</strong>{" "}
                                                    Not Required
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    🌍{" "}
                                                    <strong>
                                                        Other Nationalities:
                                                    </strong>{" "}
                                                    Required
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Course Selection */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        📚 Enroll in Courses
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Select Courses
                                            </label>
                                            <select
                                                multiple
                                                value={data.course_ids}
                                                onChange={(e) => {
                                                    const selectedOptions =
                                                        Array.from(
                                                            e.target
                                                                .selectedOptions,
                                                            (option) =>
                                                                parseInt(
                                                                    option.value
                                                                )
                                                        );
                                                    setData(
                                                        "course_ids",
                                                        selectedOptions
                                                    );
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-600 dark:focus:border-indigo-600"
                                                size="4"
                                            >
                                                {courses.map((course) => (
                                                    <option
                                                        key={course.id}
                                                        value={course.id}
                                                    >
                                                        {course.name} -{" "}
                                                        {course.code ||
                                                            "No Code"}
                                                    </option>
                                                ))}
                                            </select>
                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                Hold Ctrl (or Cmd on Mac) to
                                                select multiple courses
                                            </p>
                                        </div>

                                        {/* Selected Courses Display */}
                                        {data.course_ids.length > 0 && (
                                            <div className="mt-4">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Selected Courses:
                                                </label>
                                                <div className="flex flex-wrap gap-2">
                                                    {data.course_ids.map(
                                                        (courseId) => {
                                                            const course =
                                                                courses.find(
                                                                    (c) =>
                                                                        c.id ===
                                                                        courseId
                                                                );
                                                            return course ? (
                                                                <span
                                                                    key={
                                                                        courseId
                                                                    }
                                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                                                                >
                                                                    {
                                                                        course.name
                                                                    }
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const newCourseIds =
                                                                                data.course_ids.filter(
                                                                                    (
                                                                                        id
                                                                                    ) =>
                                                                                        id !==
                                                                                        courseId
                                                                                );
                                                                            setData(
                                                                                "course_ids",
                                                                                newCourseIds
                                                                            );
                                                                        }}
                                                                        className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 dark:hover:bg-indigo-800 dark:hover:text-indigo-300"
                                                                    >
                                                                        ×
                                                                    </button>
                                                                </span>
                                                            ) : null;
                                                        }
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {errors.course_ids && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.course_ids}
                                        </p>
                                    )}
                                </div>

                                {/* Form Actions */}
                                <div className="flex justify-end space-x-3">
                                    <Link
                                        href={route("participants.index")}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                    >
                                        {processing
                                            ? "Creating..."
                                            : "Create Participant"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

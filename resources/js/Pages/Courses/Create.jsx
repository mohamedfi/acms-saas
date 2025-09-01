import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import { useState, useEffect } from "react";

export default function Create() {
    const [trainers, setTrainers] = useState([]);
    const [trainersLoading, setTrainersLoading] = useState(true);
    const [trainersError, setTrainersError] = useState(null);
    const [locations, setLocations] = useState([]);
    const [locationsLoading, setLocationsLoading] = useState(true);
    const [locationsError, setLocationsError] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        name: "",
        code: "",
        description: "",
        delivery_type: "office",
        country: "",
        city: "",
        trainer_id: "",
        coordinator_id: "",
        location_id: "",
        location_details: "",
    });

    // Fetch trainers for dropdown
    useEffect(() => {
        setTrainersLoading(true);
        setTrainersError(null);

        // Construct the correct URL for MAMP - always use the public directory
        const baseUrl = window.location.origin;
        const apiUrl = `${baseUrl}/api/trainers`;

        console.log("Debug - Current location:", window.location.href);
        console.log("Debug - Base URL:", baseUrl);
        console.log("Debug - API URL:", apiUrl);

        fetch(apiUrl)
            .then((response) => {
                console.log("Debug - Response status:", response.status);
                console.log("Debug - Response ok:", response.ok);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("Debug - Response data:", data);
                if (data && data.data && Array.isArray(data.data)) {
                    console.log("Debug - Setting trainers:", data.data);
                    setTrainers(data.data);
                } else {
                    console.log("Debug - Invalid data structure:", data);
                    setTrainers([]);
                    setTrainersError("Invalid trainer data received");
                }
            })
            .catch((error) => {
                console.error("Error fetching trainers:", error);
                setTrainersError("Failed to load trainers");
                setTrainers([]);
            })
            .finally(() => {
                setTrainersLoading(false);
            });
    }, []);

    // Fetch locations for dropdown
    useEffect(() => {
        setLocationsLoading(true);
        setLocationsError(null);

        // Construct the correct URL for MAMP - always use the public directory
        const baseUrl = window.location.origin;
        const apiUrl = `${baseUrl}/api/training-halls`;

        console.log("Debug - Fetching locations from:", apiUrl);

        fetch(apiUrl)
            .then((response) => {
                console.log(
                    "Debug - Locations response status:",
                    response.status
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("Debug - Locations response data:", data);
                if (data && data.data && Array.isArray(data.data)) {
                    console.log("Debug - Setting locations:", data.data);
                    setLocations(data.data);
                } else {
                    console.log(
                        "Debug - Invalid locations data structure:",
                        data
                    );
                    setLocations([]);
                    setLocationsError("Invalid location data received");
                }
            })
            .catch((error) => {
                console.error("Error fetching locations:", error);
                setLocationsError("Failed to load locations");
                setLocations([]);
            })
            .finally(() => {
                setLocationsLoading(false);
            });
    }, []);

    const submit = (e) => {
        e.preventDefault();
        console.log("Debug - Submitting course data:", data);

        // Use the correct URL for MAMP instead of route helper
        const baseUrl = window.location.origin;
        const submitUrl = `${baseUrl}/courses`;

        console.log("Debug - Submitting to URL:", submitUrl);

        // Create FormData for Laravel form submission
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("code", data.code);
        formData.append("description", data.description);
        formData.append("delivery_type", data.delivery_type);
        formData.append("country", data.country);
        formData.append("city", data.city);
        formData.append("trainer_id", data.trainer_id);
        formData.append("coordinator_id", data.coordinator_id);
        formData.append("location_id", data.location_id);
        formData.append("location_details", data.location_details);

        // Submit the form data manually
        fetch(submitUrl, {
            method: "POST",
            headers: {
                "X-CSRF-TOKEN":
                    document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute("content") || "",
            },
            body: formData,
        })
            .then((response) => {
                console.log("Debug - Submit response status:", response.status);
                console.log(
                    "Debug - Submit response headers:",
                    response.headers
                );
                if (response.redirected) {
                    window.location.href = response.url;
                } else if (response.ok) {
                    return response.text();
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            })
            .then((result) => {
                console.log("Debug - Submit result:", result);
                // Redirect to courses index on success
                window.location.href = `${baseUrl}/courses`;
            })
            .catch((error) => {
                console.error("Error submitting course:", error);
                // Handle error - you might want to show an error message to the user
            });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    📚 Create New Course
                </h2>
            }
        >
            <Head title="Create Course" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <InputLabel
                                            htmlFor="name"
                                            value="Course Name"
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
                                        />
                                        {errors.name && (
                                            <div className="mt-2 text-sm text-red-600">
                                                {errors.name}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="code"
                                            value="Course Code"
                                        />
                                        <TextInput
                                            id="code"
                                            type="text"
                                            name="code"
                                            value={data.code}
                                            className="mt-1 block w-full"
                                            onChange={(e) =>
                                                setData("code", e.target.value)
                                            }
                                            placeholder="e.g., PMC2024"
                                        />
                                        {errors.code && (
                                            <div className="mt-2 text-sm text-red-600">
                                                {errors.code}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="description"
                                        value="Description"
                                    />
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                                        rows={3}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Brief description of the course..."
                                    />
                                    {errors.description && (
                                        <div className="mt-2 text-sm text-red-600">
                                            {errors.description}
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    <div>
                                        <InputLabel
                                            htmlFor="delivery_type"
                                            value="Delivery Type"
                                        />
                                        <select
                                            id="delivery_type"
                                            name="delivery_type"
                                            value={data.delivery_type}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                                            onChange={(e) =>
                                                setData(
                                                    "delivery_type",
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="office">
                                                Office
                                            </option>
                                            <option value="offsite">
                                                Offsite
                                            </option>
                                            <option value="abroad">
                                                Abroad
                                            </option>
                                        </select>
                                        {errors.delivery_type && (
                                            <div className="mt-2 text-sm text-red-600">
                                                {errors.delivery_type}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="country"
                                            value="Country"
                                        />
                                        <TextInput
                                            id="country"
                                            type="text"
                                            name="country"
                                            value={data.country}
                                            className="mt-1 block w-full"
                                            onChange={(e) =>
                                                setData(
                                                    "country",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="e.g., France"
                                        />
                                        {errors.country && (
                                            <div className="mt-2 text-sm text-red-600">
                                                {errors.country}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="city"
                                            value="City"
                                        />
                                        <TextInput
                                            id="city"
                                            type="text"
                                            name="city"
                                            value={data.city}
                                            className="mt-1 block w-full"
                                            onChange={(e) =>
                                                setData("city", e.target.value)
                                            }
                                            placeholder="e.g., Paris"
                                        />
                                        {errors.city && (
                                            <div className="mt-2 text-sm text-red-600">
                                                {errors.city}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Location Assignment Section */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        📍 Course Location
                                    </h3>

                                    {locationsLoading && (
                                        <div className="text-center py-4">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Loading locations...
                                            </p>
                                        </div>
                                    )}

                                    {locationsError && (
                                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                                            <p className="text-sm text-red-600 dark:text-red-400">
                                                ⚠️ {locationsError}. Please
                                                refresh the page or try again
                                                later.
                                            </p>
                                        </div>
                                    )}

                                    {!locationsLoading && !locationsError && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <InputLabel
                                                    htmlFor="location_id"
                                                    value="Training Location"
                                                />
                                                <select
                                                    id="location_id"
                                                    name="location_id"
                                                    value={data.location_id}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                                                    onChange={(e) =>
                                                        setData(
                                                            "location_id",
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="">
                                                        Select Training Location
                                                    </option>
                                                    {Array.isArray(locations) &&
                                                        locations.map(
                                                            (location) => (
                                                                <option
                                                                    key={
                                                                        location.id
                                                                    }
                                                                    value={
                                                                        location.id
                                                                    }
                                                                >
                                                                    📍{" "}
                                                                    {
                                                                        location.name
                                                                    }{" "}
                                                                    -{" "}
                                                                    {
                                                                        location.city
                                                                    }
                                                                    ,{" "}
                                                                    {
                                                                        location.country
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                </select>
                                                {errors.location_id && (
                                                    <div className="mt-2 text-sm text-red-600">
                                                        {errors.location_id}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor="location_details"
                                                    value="Additional Location Details"
                                                />
                                                <TextInput
                                                    id="location_details"
                                                    type="text"
                                                    name="location_details"
                                                    value={
                                                        data.location_details
                                                    }
                                                    className="mt-1 block w-full"
                                                    onChange={(e) =>
                                                        setData(
                                                            "location_details",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="e.g., Building A, Floor 3, Room 301"
                                                />
                                                {errors.location_details && (
                                                    <div className="mt-2 text-sm text-red-600">
                                                        {
                                                            errors.location_details
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                        💡 Select a training location from your
                                        configured locations. You can also add
                                        specific details like room numbers or
                                        building information.
                                    </p>
                                </div>

                                {/* Trainer Assignment Section */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        👨‍🏫 Trainer Assignment
                                    </h3>

                                    {trainersLoading && (
                                        <div className="text-center py-4">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Loading trainers...
                                            </p>
                                        </div>
                                    )}

                                    {trainersError && (
                                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                                            <p className="text-sm text-red-600 dark:text-red-400">
                                                ⚠️ {trainersError}. Please
                                                refresh the page or try again
                                                later.
                                            </p>
                                        </div>
                                    )}

                                    {!trainersLoading && !trainersError && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <InputLabel
                                                    htmlFor="trainer_id"
                                                    value="Main Trainer"
                                                />
                                                <select
                                                    id="trainer_id"
                                                    name="trainer_id"
                                                    value={data.trainer_id}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                                                    onChange={(e) =>
                                                        setData(
                                                            "trainer_id",
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="">
                                                        Select Main Trainer
                                                    </option>
                                                    {Array.isArray(trainers) &&
                                                        trainers.map(
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
                                                {errors.trainer_id && (
                                                    <div className="mt-2 text-sm text-red-600">
                                                        {errors.trainer_id}
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <InputLabel
                                                    htmlFor="coordinator_id"
                                                    value="Course Coordinator"
                                                />
                                                <select
                                                    id="coordinator_id"
                                                    name="coordinator_id"
                                                    value={data.coordinator_id}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                                                    onChange={(e) =>
                                                        setData(
                                                            "coordinator_id",
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="">
                                                        Select Coordinator
                                                        (Optional)
                                                    </option>
                                                    {Array.isArray(trainers) &&
                                                        trainers.map(
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
                                                {errors.coordinator_id && (
                                                    <div className="mt-2 text-sm text-red-600">
                                                        {errors.coordinator_id}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                        💡 Assign trainers to this course. The
                                        main trainer will lead the course, while
                                        the coordinator handles logistics and
                                        administration.
                                    </p>
                                </div>

                                <div className="flex items-center justify-end space-x-4">
                                    <a
                                        href={route("courses.index")}
                                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gray-700 shadow-sm transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-500 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-800"
                                    >
                                        Cancel
                                    </a>

                                    <PrimaryButton disabled={processing}>
                                        {processing
                                            ? "Creating..."
                                            : "Create Course"}
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

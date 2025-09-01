import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function Edit({ course }) {
    const [trainers, setTrainers] = useState([]);
    const [trainersLoading, setTrainersLoading] = useState(true);
    const [trainersError, setTrainersError] = useState(null);
    const [locations, setLocations] = useState([]);
    const [locationsLoading, setLocationsLoading] = useState(true);
    const [locationsError, setLocationsError] = useState(null);

    const { data, setData, put, processing, errors } = useForm({
        name: course.name || "",
        code: course.code || "",
        description: course.description || "",
        delivery_type: course.delivery_type || "office",
        country: course.country || "",
        city: course.city || "",
        trainer_id: course.trainer_id || "",
        coordinator_id: course.coordinator_id || "",
        location_id: course.location_id || "",
        location_details: course.location_details || "",
    });

    // Fetch trainers for dropdown
    useEffect(() => {
        setTrainersLoading(true);
        setTrainersError(null);

        fetch("/api/trainers")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (data && data.data && Array.isArray(data.data)) {
                    setTrainers(data.data);
                } else {
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

        fetch("/course-location-management/api/list")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (data && data.data && Array.isArray(data.data)) {
                    setLocations(data.data);
                } else {
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

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("courses.update", course.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        ✏️ Edit Course: {course.name}
                    </h2>
                </div>
            }
        >
            <Head title="Edit Course" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        Course Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="code"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        Course Code
                                    </label>
                                    <input
                                        type="text"
                                        id="code"
                                        value={data.code}
                                        onChange={(e) =>
                                            setData("code", e.target.value)
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                    />
                                    {errors.code && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.code}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="description"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        rows={3}
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="delivery_type"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        Delivery Type *
                                    </label>
                                    <select
                                        id="delivery_type"
                                        value={data.delivery_type}
                                        onChange={(e) =>
                                            setData(
                                                "delivery_type",
                                                e.target.value
                                            )
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        required
                                    >
                                        <option value="office">Office</option>
                                        <option value="offsite">Offsite</option>
                                        <option value="abroad">Abroad</option>
                                    </select>
                                    {errors.delivery_type && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.delivery_type}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label
                                            htmlFor="country"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Country
                                        </label>
                                        <input
                                            type="text"
                                            id="country"
                                            value={data.country}
                                            onChange={(e) =>
                                                setData(
                                                    "country",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        />
                                        {errors.country && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.country}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="city"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            id="city"
                                            value={data.city}
                                            onChange={(e) =>
                                                setData("city", e.target.value)
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                        />
                                        {errors.city && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.city}
                                            </p>
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
                                                <label
                                                    htmlFor="location_id"
                                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                                >
                                                    Training Location
                                                </label>
                                                <select
                                                    id="location_id"
                                                    value={data.location_id}
                                                    onChange={(e) =>
                                                        setData(
                                                            "location_id",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
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
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors.location_id}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="location_details"
                                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                                >
                                                    Additional Location Details
                                                </label>
                                                <input
                                                    type="text"
                                                    id="location_details"
                                                    value={
                                                        data.location_details
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "location_details",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                                    placeholder="e.g., Building A, Floor 3, Room 301"
                                                    disabled={!data.location_id}
                                                />
                                                {errors.location_details && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {
                                                            errors.location_details
                                                        }
                                                    </p>
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
                                                <label
                                                    htmlFor="trainer_id"
                                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                                >
                                                    Main Trainer
                                                </label>
                                                <select
                                                    id="trainer_id"
                                                    value={data.trainer_id}
                                                    onChange={(e) =>
                                                        setData(
                                                            "trainer_id",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
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
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors.trainer_id}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="coordinator_id"
                                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                                >
                                                    Course Coordinator
                                                </label>
                                                <select
                                                    id="coordinator_id"
                                                    value={data.coordinator_id}
                                                    onChange={(e) =>
                                                        setData(
                                                            "coordinator_id",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
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
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors.coordinator_id}
                                                    </p>
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

                                <div className="flex justify-end space-x-3">
                                    <a
                                        href={route("courses.index")}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                                    >
                                        Cancel
                                    </a>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                    >
                                        {processing
                                            ? "Updating..."
                                            : "Update Course"}
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

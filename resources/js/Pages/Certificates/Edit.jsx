import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function Edit({
  certificate,
  participants,
  courses,
  companies,
  backgroundImages,
  currentCourse,
  currentCompany,
}) {
  // Helper function to format date for HTML input
  const formatDateForInput = (dateValue) => {
    if (!dateValue) return "";

    // Handle both string and Date object inputs
    let date;
    if (typeof dateValue === "string") {
      date = new Date(dateValue);
    } else if (dateValue instanceof Date) {
      date = dateValue;
    } else {
      return "";
    }

    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  };

  const { data, setData, put, processing, errors } = useForm({
    course_id: currentCourse?.id || "",
    participant_name: certificate.participant_name || "",
    participant_email: certificate.participant_email || "",
    company_id: currentCompany?.id || "",
    completion_date: formatDateForInput(certificate.completion_date),
    issue_date: formatDateForInput(certificate.issue_date),
    description: certificate.description || "",
    background_image: null,
    selected_background_image: certificate.background_image || "",
    orientation: certificate.orientation || "landscape",
    status: certificate.status || "active",
    notes: certificate.notes || "",
  });

  const [selectedParticipant, setSelectedParticipant] = useState(
    participants.find((p) => p.full_name === certificate.participant_name) ||
      null
  );
  const [selectedCourse, setSelectedCourse] = useState(currentCourse || null);
  const [selectedCompany, setSelectedCompany] = useState(
    currentCompany || null
  );

  const [previewImage, setPreviewImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    put(route("certificates.update", certificate.id));
  };

  const handleParticipantSelect = (participant) => {
    setSelectedParticipant(participant);
    setData("participant_name", participant.full_name);
    setData("participant_email", participant.email);
    setData("company_id", participant.organization || "");
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setData("course_id", course.id);
  };

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    setData("company_id", company.id);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData("background_image", file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          ✏️ Edit Certificate
        </h2>
      }
    >
      <Head title={`Edit Certificate ${certificate.certificate_number}`} />

      <div className="py-12">
        <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  ✏️ Edit Certificate {certificate.certificate_number}
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Update certificate information
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Participant Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Participant
                  </label>
                  <select
                    value={selectedParticipant?.id || ""}
                    onChange={(e) => {
                      const participant = participants.find(
                        (p) => p.id == e.target.value
                      );
                      if (participant) {
                        handleParticipantSelect(participant);
                      }
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Select a participant...</option>
                    {participants.map((participant) => (
                      <option key={participant.id} value={participant.id}>
                        {participant.full_name} - {participant.email}
                      </option>
                    ))}
                  </select>
                  {errors.participant_name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.participant_name}
                    </p>
                  )}
                </div>

                {/* Course Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Course *
                  </label>
                  <select
                    value={data.course_id || ""}
                    onChange={(e) => {
                      const course = courses.find(
                        (c) => c.id == e.target.value
                      );
                      if (course) {
                        handleCourseSelect(course);
                      }
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="">Select a course...</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name} {course.code && `(${course.code})`}
                      </option>
                    ))}
                  </select>
                  {errors.course_id && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.course_id}
                    </p>
                  )}
                </div>

                {/* Course Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Participant Name *
                    </label>
                    <input
                      type="text"
                      value={data.participant_name}
                      onChange={(e) =>
                        setData("participant_name", e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Enter participant name"
                      required
                    />
                    {errors.participant_name && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.participant_name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Participant Email
                    </label>
                    <input
                      type="email"
                      value={data.participant_email}
                      onChange={(e) =>
                        setData("participant_email", e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Enter participant email"
                    />
                    {errors.participant_email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.participant_email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Company
                    </label>
                    <select
                      value={data.company_id || ""}
                      onChange={(e) => {
                        const company = companies.find(
                          (c) => c.id == e.target.value
                        );
                        if (company) {
                          handleCompanySelect(company);
                        }
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">Select a company...</option>
                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                    {errors.company_id && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.company_id}
                      </p>
                    )}
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Completion Date *
                    </label>
                    <input
                      type="date"
                      value={data.completion_date}
                      onChange={(e) =>
                        setData("completion_date", e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    />
                    {errors.completion_date && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.completion_date}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Issue Date *
                    </label>
                    <input
                      type="date"
                      value={data.issue_date}
                      onChange={(e) => setData("issue_date", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    />
                    {errors.issue_date && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.issue_date}
                      </p>
                    )}
                  </div>
                </div>

                {/* Orientation Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Certificate Orientation *
                  </label>
                  <select
                    value={data.orientation}
                    onChange={(e) => setData("orientation", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="landscape">Landscape (Wide)</option>
                    <option value="portrait">Portrait (Tall)</option>
                  </select>
                  {errors.orientation && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.orientation}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status *
                  </label>
                  <select
                    value={data.status}
                    onChange={(e) => setData("status", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="revoked">Revoked</option>
                    <option value="expired">Expired</option>
                  </select>
                  {errors.status && (
                    <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                  )}
                </div>

                {/* Background Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Background Image
                  </label>

                  {/* Current Background Image Preview */}
                  {certificate.background_image && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Current Background Image
                      </label>
                      <div className="relative w-full max-w-md">
                        <img
                          src={
                            certificate.background_image.startsWith("http")
                              ? certificate.background_image
                              : `${window.location.origin}/storage/${certificate.background_image}`
                          }
                          alt="Current Background"
                          className="w-full h-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-600"
                          onError={(e) => {
                            e.target.src = `${window.location.origin}/images/default-certificate-bg.jpg`;
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Upload New Image */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Upload New Background Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-gray-700 dark:file:text-gray-300"
                    />
                    {previewImage && (
                      <div className="mt-2">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="h-32 w-auto rounded-lg border border-gray-300 dark:border-gray-600"
                        />
                      </div>
                    )}
                  </div>

                  {/* Or Select Existing Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Or Select Existing Background Image
                    </label>
                    <select
                      value={data.selected_background_image || ""}
                      onChange={(e) => {
                        setData("selected_background_image", e.target.value);
                        setData("background_image", null); // Clear file upload when selecting existing
                        setPreviewImage(null); // Clear preview when selecting existing
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">
                        Select existing background image...
                      </option>
                      {backgroundImages.map((image) => (
                        <option
                          key={image.filename}
                          value={
                            image.type === "uploaded"
                              ? `certificate-backgrounds/${image.filename}`
                              : image.filename
                          }
                        >
                          {image.name} ({image.type})
                        </option>
                      ))}
                    </select>
                  </div>

                  {errors.background_image && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.background_image}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={data.description}
                    onChange={(e) => setData("description", e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter certificate description"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={data.notes}
                    onChange={(e) => setData("notes", e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter any additional notes"
                  />
                  {errors.notes && (
                    <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <a
                    href={route("certificates.show", certificate.id)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    Cancel
                  </a>
                  <button
                    type="submit"
                    disabled={processing}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {processing ? "Updating..." : "Update Certificate"}
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

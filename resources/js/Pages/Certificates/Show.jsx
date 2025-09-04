import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Show({ certificate }) {
  const getStatusColor = (status) => {
    const colors = {
      active:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      revoked: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      expired:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    };
    return (
      colors[status] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    );
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          🏆 Certificate Details
        </h2>
      }
    >
      <Head title={`Certificate ${certificate.certificate_number}`} />

      <div className="py-12">
        <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  🏆 Certificate {certificate.certificate_number}
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Training completion certificate details
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex space-x-3">
                <Link
                  href={route("certificates.view", certificate.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  👁️ View Certificate
                </Link>
                <Link
                  href={route("certificates.customize", certificate.id)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
                >
                  🎨 Customize
                </Link>
                <Link
                  href={route("certificates.edit", certificate.id)}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors cursor-pointer"
                >
                  ✏️ Edit
                </Link>
                <Link
                  href={route("certificates.index")}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  ← Back to List
                </Link>
              </div>
            </div>
          </div>

          {/* Certificate Details */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Certificate Number & Status */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                      Certificate Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                          Certificate Number
                        </label>
                        <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {certificate.certificate_number}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                          Status
                        </label>
                        <span
                          className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                            certificate.status
                          )}`}
                        >
                          {certificate.status_display}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                          Orientation
                        </label>
                        <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {certificate.orientation === "landscape"
                            ? "Landscape (Wide)"
                            : "Portrait (Tall)"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Participant Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                      Participant Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                          Participant Name
                        </label>
                        <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {certificate.participant_name}
                        </p>
                      </div>
                      {certificate.participant_email && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                            Email
                          </label>
                          <p className="mt-1 text-gray-900 dark:text-gray-100">
                            {certificate.participant_email}
                          </p>
                        </div>
                      )}
                      {certificate.company_name && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                            Company
                          </label>
                          <p className="mt-1 text-gray-900 dark:text-gray-100">
                            {certificate.company_name}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Course Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                      Course Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                          Course Name
                        </label>
                        <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {certificate.course_name}
                        </p>
                      </div>
                      {certificate.description && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                            Description
                          </label>
                          <p className="mt-1 text-gray-900 dark:text-gray-100">
                            {certificate.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dates */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                      Important Dates
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                          Completion Date
                        </label>
                        <p className="mt-1 text-gray-900 dark:text-gray-100">
                          {new Date(
                            certificate.completion_date
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                          Issue Date
                        </label>
                        <p className="mt-1 text-gray-900 dark:text-gray-100">
                          {new Date(certificate.issue_date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                          Created At
                        </label>
                        <p className="mt-1 text-gray-900 dark:text-gray-100">
                          {new Date(certificate.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              {certificate.notes && (
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    Notes
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                      {certificate.notes}
                    </p>
                  </div>
                </div>
              )}

              {/* Background Image Info */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                  Background Image
                </h3>
                {certificate.background_image ? (
                  <div className="space-y-4">
                    <div className="relative w-full max-w-md">
                      <img
                        src={
                          certificate.background_image.startsWith("http")
                            ? certificate.background_image
                            : `${window.location.origin}/storage/${certificate.background_image}`
                        }
                        alt="Certificate Background"
                        className="w-full h-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-600"
                        onError={(e) => {
                          e.target.src = `${window.location.origin}/images/default-certificate-bg.jpg`;
                        }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Filename: {certificate.background_image}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative w-full max-w-md">
                      <img
                        src={`${window.location.origin}/images/default-certificate-bg.jpg`}
                        alt="Default Certificate Background"
                        className="w-full h-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-600"
                      />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Using default background image
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

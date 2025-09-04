import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function CertificatesIndex({
  certificates,
  stats,
  courses,
  filters,
}) {
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [statusFilter, setStatusFilter] = useState(filters.status || "all");
  const [courseFilter, setCourseFilter] = useState(filters.course || "all");
  const [selectedCertificates, setSelectedCertificates] = useState([]);

  const { data, setData, post, processing } = useForm({
    search: searchTerm,
    status: statusFilter,
    course: courseFilter,
    sort: filters.sort || "created_at",
    order: filters.order || "desc",
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setData("search", searchTerm);
    setData("status", statusFilter);
    setData("course", courseFilter);
    post(route("certificates.index"), {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleBulkAction = (action) => {
    console.log("Bulk action triggered:", action);
    console.log("Selected certificates:", selectedCertificates);

    if (selectedCertificates.length === 0) {
      alert("Please select certificates to perform bulk action.");
      return;
    }

    if (
      confirm(`Are you sure you want to ${action} the selected certificates?`)
    ) {
      console.log("Sending bulk action request:", {
        action: action,
        certificate_ids: selectedCertificates,
      });

      router.post(
        route("certificates.bulk-action"),
        {
          action: action,
          certificate_ids: selectedCertificates,
        },
        {
          onSuccess: () => {
            console.log("Bulk action completed successfully");
            setSelectedCertificates([]);
          },
          onError: (errors) => {
            console.error("Bulk action failed:", errors);
            alert("Bulk action failed. Please try again.");
          },
        }
      );
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCertificates(certificates.data.map((cert) => cert.id));
    } else {
      setSelectedCertificates([]);
    }
  };

  const handleSelectCertificate = (certificateId) => {
    setSelectedCertificates((prev) =>
      prev.includes(certificateId)
        ? prev.filter((id) => id !== certificateId)
        : [...prev, certificateId]
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      revoked: "bg-red-100 text-red-800",
      expired: "bg-yellow-100 text-yellow-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          🏆 Certificates Management
        </h2>
      }
    >
      <Head title="Certificates" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  🏆 Certificates
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Manage training certificates and completion records
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex space-x-3">
                <Link
                  href={route("certificates.create")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  ➕ Create Certificate
                </Link>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">🏆</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Total
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      {stats.total}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">✅</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Active
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      {stats.active}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">❌</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Revoked
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      {stats.revoked}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">⏰</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Expired
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      {stats.expired}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">📅</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      This Month
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      {stats.this_month}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-6">
            <div className="p-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Search
                    </label>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search certificates..."
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="all">All Statuses</option>
                      <option value="active">Active</option>
                      <option value="revoked">Revoked</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Course
                    </label>
                    <select
                      value={courseFilter}
                      onChange={(e) => setCourseFilter(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="all">All Courses</option>
                      {courses.map((course) => (
                        <option key={course} value={course}>
                          {course}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer disabled:opacity-50"
                    >
                      🔍 Search
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedCertificates.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-blue-800 dark:text-blue-200">
                  {selectedCertificates.length} certificate(s) selected
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleBulkAction("activate")}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 cursor-pointer"
                  >
                    ✅ Activate
                  </button>
                  <button
                    onClick={() => handleBulkAction("revoke")}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 cursor-pointer"
                  >
                    ❌ Revoke
                  </button>
                  <button
                    onClick={() => handleBulkAction("delete")}
                    className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 cursor-pointer"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Certificates Table */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={
                          selectedCertificates.length ===
                            certificates.data.length &&
                          certificates.data.length > 0
                        }
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Certificate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Participant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {certificates.data.map((certificate) => (
                    <tr
                      key={certificate.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedCertificates.includes(
                            certificate.id
                          )}
                          onChange={() =>
                            handleSelectCertificate(certificate.id)
                          }
                          className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                              <span className="text-lg">🏆</span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {certificate.certificate_number}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {certificate.company_name || "No Company"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {certificate.participant_name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {certificate.participant_email || "No Email"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {certificate.course_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            certificate.status
                          )}`}
                        >
                          {certificate.status_display}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div>
                          Completed:{" "}
                          {new Date(
                            certificate.completion_date
                          ).toLocaleDateString()}
                        </div>
                        <div>
                          Issued:{" "}
                          {new Date(
                            certificate.issue_date
                          ).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            href={route("certificates.view", certificate.id)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                          >
                            👁️ View
                          </Link>
                          <Link
                            href={route("certificates.show", certificate.id)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 cursor-pointer"
                          >
                            📋 Details
                          </Link>
                          <Link
                            href={route("certificates.edit", certificate.id)}
                            className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 cursor-pointer"
                          >
                            ✏️ Edit
                          </Link>
                          <button
                            onClick={() => {
                              if (
                                confirm(
                                  "Are you sure you want to delete this certificate?"
                                )
                              ) {
                                // Create a form to submit the delete request
                                const form = document.createElement("form");
                                form.method = "POST";
                                form.action = route(
                                  "certificates.destroy",
                                  certificate.id
                                );

                                // Add CSRF token
                                const csrfToken = document.querySelector(
                                  'meta[name="csrf-token"]'
                                );
                                if (csrfToken) {
                                  const csrfInput =
                                    document.createElement("input");
                                  csrfInput.type = "hidden";
                                  csrfInput.name = "_token";
                                  csrfInput.value =
                                    csrfToken.getAttribute("content");
                                  form.appendChild(csrfInput);
                                }

                                // Add method override for DELETE
                                const methodInput =
                                  document.createElement("input");
                                methodInput.type = "hidden";
                                methodInput.name = "_method";
                                methodInput.value = "DELETE";
                                form.appendChild(methodInput);

                                document.body.appendChild(form);
                                form.submit();
                                document.body.removeChild(form);
                              }
                            }}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 cursor-pointer"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {certificates.data.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 dark:text-gray-400">
                  <div className="text-6xl mb-4">🏆</div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    No certificates found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Get started by creating your first certificate.
                  </p>
                  <Link
                    href={route("certificates.create")}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    ➕ Create First Certificate
                  </Link>
                </div>
              </div>
            )}

            {/* Pagination */}
            {certificates.links && certificates.links.length > 3 && (
              <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Showing {certificates.from} to {certificates.to} of{" "}
                    {certificates.total} results
                  </div>
                  <div className="flex space-x-1">
                    {certificates.links.map((link, index) => (
                      <Link
                        key={index}
                        href={link.url}
                        className={`px-3 py-2 text-sm rounded-md ${
                          link.active
                            ? "bg-indigo-600 text-white"
                            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        } ${
                          !link.url
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

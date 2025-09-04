import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function ShowPotentialClient({ potentialClient }) {
  const getStatusColor = (status) => {
    const colors = {
      new: "bg-blue-100 text-blue-800",
      contacted: "bg-yellow-100 text-yellow-800",
      qualified: "bg-green-100 text-green-800",
      proposal_sent: "bg-purple-100 text-purple-800",
      negotiating: "bg-orange-100 text-orange-800",
      closed_won: "bg-green-100 text-green-800",
      closed_lost: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getSourceIcon = (source) => {
    const icons = {
      website: "🌐",
      referral: "👥",
      social_media: "📱",
      cold_call: "📞",
      email_campaign: "📧",
      event: "🎪",
      other: "❓",
    };
    return icons[source] || "❓";
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          💡 Lead Details
        </h2>
      }
    >
      <Head title={`Lead: ${potentialClient.name}`} />

      <div className="py-12">
        <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link
              href={route("potential-clients.index")}
              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
            >
              ← Back to Potential Clients
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Information */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <span className="text-3xl">💡</span>
                      </div>
                      <div className="ml-4">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {potentialClient.name}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                          {potentialClient.position} at{" "}
                          {potentialClient.company || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href={route(
                          "potential-clients.edit",
                          potentialClient.id
                        )}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
                      >
                        ✏️ Edit
                      </Link>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                      📞 Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                          Email
                        </label>
                        <p className="text-sm text-gray-900 dark:text-gray-100">
                          {potentialClient.email || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                          Phone
                        </label>
                        <p className="text-sm text-gray-900 dark:text-gray-100">
                          {potentialClient.phone || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                          Country
                        </label>
                        <p className="text-sm text-gray-900 dark:text-gray-100">
                          {potentialClient.country || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                          Industry
                        </label>
                        <p className="text-sm text-gray-900 dark:text-gray-100">
                          {potentialClient.industry || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Lead Status */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                      📊 Lead Status
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                          Status
                        </label>
                        <span
                          className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                            potentialClient.status
                          )}`}
                        >
                          {potentialClient.status
                            .replace("_", " ")
                            .toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                          Source
                        </label>
                        <div className="flex items-center">
                          <span className="text-lg mr-2">
                            {getSourceIcon(potentialClient.source)}
                          </span>
                          <span className="text-sm text-gray-900 dark:text-gray-100">
                            {potentialClient.source
                              .replace("_", " ")
                              .toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                          Estimated Value
                        </label>
                        <p className="text-sm text-gray-900 dark:text-gray-100">
                          $
                          {potentialClient.estimated_value?.toLocaleString() ||
                            "0"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                          Assigned To
                        </label>
                        <p className="text-sm text-gray-900 dark:text-gray-100">
                          {potentialClient.assigned_to || "Not assigned"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Follow-up Information */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                      📅 Follow-up Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                          Last Contact Date
                        </label>
                        <p className="text-sm text-gray-900 dark:text-gray-100">
                          {potentialClient.last_contact_date
                            ? new Date(
                                potentialClient.last_contact_date
                              ).toLocaleDateString()
                            : "Not contacted yet"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                          Next Follow-up
                        </label>
                        <p className="text-sm text-gray-900 dark:text-gray-100">
                          {potentialClient.next_follow_up
                            ? new Date(
                                potentialClient.next_follow_up
                              ).toLocaleDateString()
                            : "Not scheduled"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {potentialClient.notes && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                        📝 Notes
                      </h3>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                          {potentialClient.notes}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    ⚡ Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <Link
                      href={route("potential-clients.edit", potentialClient.id)}
                      className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
                    >
                      ✏️ Edit Lead
                    </Link>
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            "Are you sure you want to delete this lead? This action cannot be undone."
                          )
                        ) {
                          // Create a form to submit the delete request
                          const form = document.createElement("form");
                          form.method = "POST";
                          form.action = route(
                            "potential-clients.destroy",
                            potentialClient.id
                          );

                          // Add CSRF token
                          const csrfToken = document.querySelector(
                            'meta[name="csrf-token"]'
                          );
                          if (csrfToken) {
                            const csrfInput = document.createElement("input");
                            csrfInput.type = "hidden";
                            csrfInput.name = "_token";
                            csrfInput.value = csrfToken.getAttribute("content");
                            form.appendChild(csrfInput);
                          }

                          // Add method override for DELETE
                          const methodInput = document.createElement("input");
                          methodInput.type = "hidden";
                          methodInput.name = "_method";
                          methodInput.value = "DELETE";
                          form.appendChild(methodInput);

                          document.body.appendChild(form);
                          form.submit();
                          document.body.removeChild(form);
                        }
                      }}
                      className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                    >
                      🗑️ Delete Lead
                    </button>
                  </div>
                </div>
              </div>

              {/* Lead Timeline */}
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    📈 Lead Timeline
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <span className="text-sm">💡</span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Lead Created
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(
                            potentialClient.created_at
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {potentialClient.last_contact_date && (
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                            <span className="text-sm">📞</span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Last Contact
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(
                              potentialClient.last_contact_date
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                    {potentialClient.next_follow_up && (
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                            <span className="text-sm">📅</span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Next Follow-up
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(
                              potentialClient.next_follow_up
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Lead Statistics */}
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    📊 Lead Statistics
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Days since created:
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {Math.floor(
                          (new Date() - new Date(potentialClient.created_at)) /
                            (1000 * 60 * 60 * 24)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Status:
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {potentialClient.status.replace("_", " ").toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Source:
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {potentialClient.source.replace("_", " ").toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

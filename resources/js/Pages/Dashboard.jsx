import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function Dashboard({ auth, stats, recentData }) {
  const [currentStats, setCurrentStats] = useState(stats || {});
  const [currentRecentData, setCurrentRecentData] = useState(recentData || {});

  useEffect(() => {
    if (stats) {
      setCurrentStats(stats);
    }
    if (recentData) {
      setCurrentRecentData(recentData);
    }
  }, [stats, recentData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-EG", {
      style: "currency",
      currency: "EGP",
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  const getPercentageChange = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return (((current - previous) / previous) * 100).toFixed(1);
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      in_progress:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      completed:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      pending:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      active:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      draft: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    };
    return (
      colors[status] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    );
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-white leading-tight">
          Dashboard
        </h2>
      }
    >
      <Head title="Dashboard" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Main Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Courses */}
            <div className="bg-gray-800 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg border-l-4 border-cyan-500">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-cyan-500">
                      <span className="text-white text-lg">📚</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-300 dark:text-gray-300">
                      Total Courses
                    </p>
                    <p className="text-2xl font-semibold text-white dark:text-white">
                      {currentStats.totalCourses || 0}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-400">
                      {currentStats.coursesThisMonth || 0} this month
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Participants */}
            <div className="bg-gray-800 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg border-l-4 border-green-500">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-green-500">
                      <span className="text-white text-lg">👥</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-300 dark:text-gray-300">
                      Total Participants
                    </p>
                    <p className="text-2xl font-semibold text-white dark:text-white">
                      {currentStats.totalParticipants || 0}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-400">
                      {currentStats.newParticipantsThisMonth || 0} new this
                      month
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Courses */}
            <div className="bg-gray-800 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg border-l-4 border-purple-500">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-500">
                      <span className="text-white text-lg">🎯</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-300 dark:text-gray-300">
                      Active Courses
                    </p>
                    <p className="text-2xl font-semibold text-white dark:text-white">
                      {currentStats.activeCourses || 0}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-400">
                      {currentStats.upcomingCourses || 0} upcoming
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Tasks */}
            <div className="bg-gray-800 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg border-l-4 border-orange-500">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-orange-500">
                      <span className="text-white text-lg">✅</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-300 dark:text-gray-300">
                      Total Tasks
                    </p>
                    <p className="text-2xl font-semibold text-white dark:text-white">
                      {currentStats.totalTasks || 0}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-400">
                      {currentStats.pendingTasks || 0} pending
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Employees */}
            <div className="bg-gray-800 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg border-l-4 border-indigo-500">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-500">
                      <span className="text-white text-lg">👨‍💼</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-300 dark:text-gray-300">
                      Employees
                    </p>
                    <p className="text-2xl font-semibold text-white dark:text-white">
                      {currentStats.totalEmployees || 0}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-400">
                      {currentStats.trainers || 0} trainers
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Assets */}
            <div className="bg-gray-800 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg border-l-4 border-pink-500">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-pink-500">
                      <span className="text-white text-lg">🏢</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-300 dark:text-gray-300">
                      Assets
                    </p>
                    <p className="text-2xl font-semibold text-white dark:text-white">
                      {currentStats.totalAssets || 0}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-400">
                      {currentStats.availableAssets || 0} available
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Meal Plans */}
            <div className="bg-gray-800 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg border-l-4 border-teal-500">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-teal-500">
                      <span className="text-white text-lg">🍽️</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-300 dark:text-gray-300">
                      Meal Plans
                    </p>
                    <p className="text-2xl font-semibold text-white dark:text-white">
                      {currentStats.totalMealPlans || 0}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-400">
                      {currentStats.totalMeals || 0} total meals
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Budget */}
            <div className="bg-gray-800 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg border-l-4 border-amber-500">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-500">
                      <span className="text-white text-lg">💰</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-300 dark:text-gray-300">
                      Total Budget
                    </p>
                    <p className="text-lg font-semibold text-white dark:text-white">
                      {formatCurrency(currentStats.totalBudget)}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-400">
                      {formatCurrency(currentStats.availableBudget)} available
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Courses */}
            <div className="bg-gray-800 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">📅</span>
                    <h3 className="text-lg font-semibold text-white dark:text-white">
                      Recent Courses
                    </h3>
                  </div>
                  <span className="text-sm text-gray-400 dark:text-gray-400">
                    {currentStats.activeCourses || 0} active
                  </span>
                </div>
                <div className="space-y-3">
                  {currentRecentData.recentCourses &&
                  currentRecentData.recentCourses.length > 0 ? (
                    currentRecentData.recentCourses.map((instance, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-700 dark:bg-gray-700"
                      >
                        <div>
                          <p className="font-medium text-white dark:text-white">
                            {instance.course?.name || "Course Name"}
                          </p>
                          <p className="text-sm text-gray-300 dark:text-gray-300">
                            {instance.start_date
                              ? new Date(
                                  instance.start_date
                                ).toLocaleDateString()
                              : "Date TBD"}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            instance.status
                          )}`}
                        >
                          {instance.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 dark:text-gray-400 text-center py-4">
                      No recent courses
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Tasks */}
            <div className="bg-gray-800 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">✅</span>
                    <h3 className="text-lg font-semibold text-white dark:text-white">
                      Recent Tasks
                    </h3>
                  </div>
                  <span className="text-sm text-gray-400 dark:text-gray-400">
                    {currentStats.pendingTasks || 0} pending
                  </span>
                </div>
                <div className="space-y-3">
                  {currentRecentData.recentTasks &&
                  currentRecentData.recentTasks.length > 0 ? (
                    currentRecentData.recentTasks.map((task, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-700 dark:bg-gray-700"
                      >
                        <div>
                          <p className="font-medium text-white dark:text-white">
                            {task.title}
                          </p>
                          <p className="text-sm text-gray-300 dark:text-gray-300">
                            Due:{" "}
                            {task.due_date
                              ? new Date(task.due_date).toLocaleDateString()
                              : "No due date"}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            task.status
                          )}`}
                        >
                          {task.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 dark:text-gray-400 text-center py-4">
                      No recent tasks
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Statistics Row */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Monthly Trends */}
            <div className="bg-gray-800 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white dark:text-white mb-4">
                  📈 Monthly Trends
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300 dark:text-gray-300">
                      Courses
                    </span>
                    <div className="flex items-center">
                      <span className="font-medium text-white dark:text-white">
                        {currentStats.coursesThisMonth || 0}
                      </span>
                      <span
                        className={`ml-2 text-xs ${
                          getPercentageChange(
                            currentStats.coursesThisMonth,
                            currentStats.coursesLastMonth
                          ) >= 0
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {getPercentageChange(
                          currentStats.coursesThisMonth,
                          currentStats.coursesLastMonth
                        )}
                        %
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300 dark:text-gray-300">
                      Participants
                    </span>
                    <div className="flex items-center">
                      <span className="font-medium text-white dark:text-white">
                        {currentStats.participantsThisMonth || 0}
                      </span>
                      <span
                        className={`ml-2 text-xs ${
                          getPercentageChange(
                            currentStats.participantsThisMonth,
                            currentStats.participantsLastMonth
                          ) >= 0
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {getPercentageChange(
                          currentStats.participantsThisMonth,
                          currentStats.participantsLastMonth
                        )}
                        %
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300 dark:text-gray-300">
                      Tasks
                    </span>
                    <div className="flex items-center">
                      <span className="font-medium text-white dark:text-white">
                        {currentStats.tasksThisMonth || 0}
                      </span>
                      <span
                        className={`ml-2 text-xs ${
                          getPercentageChange(
                            currentStats.tasksThisMonth,
                            currentStats.tasksLastMonth
                          ) >= 0
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {getPercentageChange(
                          currentStats.tasksThisMonth,
                          currentStats.tasksLastMonth
                        )}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white dark:text-white mb-4">
                  ⚡ Quick Actions
                </h3>
                <div className="space-y-3">
                  <a
                    href={route("courses.create")}
                    className="block p-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    <span className="text-white font-medium">
                      ➕ Add New Course
                    </span>
                  </a>
                  <a
                    href={route("participants.create")}
                    className="block p-3 rounded-lg bg-green-600 hover:bg-green-700 transition-colors cursor-pointer"
                  >
                    <span className="text-white font-medium">
                      👥 Add Participant
                    </span>
                  </a>
                  <a
                    href={route("clients.index")}
                    className="block p-3 rounded-lg bg-orange-600 hover:bg-orange-700 transition-colors cursor-pointer"
                  >
                    <span className="text-white font-medium">
                      👥 Manage All Clients
                    </span>
                  </a>
                  <a
                    href={route("catering.meal-break-plans.create")}
                    className="block p-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors"
                  >
                    <span className="text-white font-medium">
                      🍽️ Create Meal Plan
                    </span>
                  </a>
                  <a
                    href={route("tasks.create")}
                    className="block p-3 rounded-lg bg-orange-600 hover:bg-orange-700 transition-colors"
                  >
                    <span className="text-white font-medium">
                      ✅ Create New Task
                    </span>
                  </a>
                  <a
                    href={route("employees.create")}
                    className="block p-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors"
                  >
                    <span className="text-white font-medium">
                      👨‍💼 Add Employee
                    </span>
                  </a>
                  <a
                    href={route("asset-management.assets.create")}
                    className="block p-3 rounded-lg bg-pink-600 hover:bg-pink-700 transition-colors"
                  >
                    <span className="text-white font-medium">🏢 Add Asset</span>
                  </a>
                  <a
                    href={route("archived-courses.index")}
                    className="block p-3 rounded-lg bg-amber-600 hover:bg-amber-700 transition-colors"
                  >
                    <span className="text-white font-medium">
                      📚 Course Archives
                    </span>
                  </a>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-gray-800 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white dark:text-white mb-4">
                  🔧 System Status
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300 dark:text-gray-300">
                      Overdue Tasks
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        currentStats.overdueTasks > 0
                          ? "bg-red-600 text-white"
                          : "bg-green-600 text-white"
                      }`}
                    >
                      {currentStats.overdueTasks || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300 dark:text-gray-300">
                      Assets in Use
                    </span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-600 text-white">
                      {currentStats.inUseAssets || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300 dark:text-gray-300">
                      Maintenance
                    </span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-600 text-white">
                      {currentStats.maintenanceAssets || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300 dark:text-gray-300">
                      Active Meal Plans
                    </span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-teal-600 text-white">
                      {currentStats.activeMealPlans || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300 dark:text-gray-300">
                      Archived Courses
                    </span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-600 text-white">
                      {currentStats.archivedCourses || 0}
                    </span>
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

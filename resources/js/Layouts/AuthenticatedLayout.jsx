import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Authenticated({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const [showingMobileMenu, setShowingMobileMenu] = useState(false);

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{
                backgroundColor: "#343a40",
            }}
        >
            {/* ===== HEADER ===== */}
            <nav className="bg-gray-900 text-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-20">
                    {/* Logo and Brand */}
                    <div className="flex items-center space-x-3">
                        <ApplicationLogo className="w-10 h-10 object-contain my-2" />
                    <span className="text-xl sm:text-2xl font-bold tracking-tight">
    
</span>
                    </div>

                    {/* Desktop Navigation - Hidden on mobile */}
                    <nav className="hidden lg:flex items-center space-x-6">
                        <Link
                            href={route("dashboard")}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors relative cursor-pointer ${
                                route().current("dashboard")
                                    ? "bg-gray-700"
                                    : "hover:bg-gray-800"
                            }`}
                        >
                            📊 Dashboard
                            {route().current("dashboard") && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"></div>
                            )}
                        </Link>

                        {/* Courses Dropdown */}
                        <div className="relative">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button
                                        type="button"
                                        className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                                            route().current("courses.*") ||
                                            route().current(
                                                "archived-courses.*"
                                            )
                                                ? "bg-purple-600"
                                                : "hover:bg-gray-800"
                                        }`}
                                    >
                                        📚 Courses
                                        {route().current("courses.*") ||
                                            (route().current(
                                                "archived-courses.*"
                                            ) && (
                                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"></div>
                                            ))}
                                        <svg
                                            className="ml-2 h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Link
                                        href={route("courses.index")}
                                    >
                                        📋 All Courses
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route("archived-courses.index")}
                                    >
                                        📚 Course Archives
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route("courses.create")}
                                    >
                                        ➕ Create Course
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        <Link
                            href={route("trainers.index")}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors relative cursor-pointer ${
                                route().current("trainers.*")
                                    ? "bg-gray-700"
                                    : "hover:bg-gray-800"
                            }`}
                        >
                            👨‍🏫 Trainers
                            {route().current("trainers.*") && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"></div>
                            )}
                        </Link>

                        <Link
                            href={route("participants.index")}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors relative cursor-pointer ${
                                route().current("participants.*")
                                    ? "bg-gray-700"
                                    : "hover:bg-gray-800"
                            }`}
                        >
                            👥 Participants
                            {route().current("participants.*") && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"></div>
                            )}
                        </Link>

                        <Link
                            href={route("employees.index")}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors relative cursor-pointer ${
                                route().current("employees.*")
                                    ? "bg-gray-700"
                                    : "hover:bg-gray-800"
                            }`}
                        >
                            👥 Employees
                            {route().current("employees.*") && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"></div>
                            )}
                        </Link>

                        {/* Roles moved to Management dropdown for better organization */}

                        <Link
                            href={route("tasks.index")}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors relative cursor-pointer ${
                                route().current("tasks.*")
                                    ? "bg-gray-700"
                                    : "hover:bg-gray-800"
                            }`}
                        >
                            📋 Tasks
                            {route().current("tasks.*") && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"></div>
                            )}
                        </Link>

                        {/* Operations Dropdown */}
                        <div className="relative">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-800 transition-colors cursor-pointer"
                                    >
                                        🔧 Operations
                                        <svg
                                            className="ml-2 h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Link
                                        href={route("logistics.index")}
                                    >
                                        🚀 Logistics
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route("operations.attendance")}
                                    >
                                        📋 Attendance
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route("messages.index")}
                                    >
                                        💬 Messages
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route("catering.index")}
                                    >
                                        🍽️ Catering
                                    </Dropdown.Link>

                                    <Dropdown.Link
                                        href={route("transportation.index")}
                                    >
                                        🚗 Vehicle Rental
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route("asset-management.index")}
                                    >
                                        🏢 Manage Assets
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route("user-management.index")}
                                    >
                                        👥 User Management
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route(
                                            "financial-management.index"
                                        )}
                                    >
                                        💰 Financial Management
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        {/* Management Dropdown */}
                        <div className="relative">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-800 transition-colors cursor-pointer"
                                    >
                                        ⚙️ Management
                                        <svg
                                            className="ml-2 h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Link
                                        href={route("management.index")}
                                    >
                                        🎯 System Management
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route("departments.index")}
                                    >
                                        🏢 Departments
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route("role-management.index")}
                                    >
                                        👥 Roles
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route(
                                            "course-location-management.index"
                                        )}
                                    >
                                        📍 Course Locations
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route("training-halls.index")}
                                    >
                                        🏢 Training Halls
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route("hall-bookings.index")}
                                    >
                                        📅 Hall Bookings
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route(
                                            "catering.meal-break-plans.index"
                                        )}
                                    >
                                        📅 Meal Break Plans
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        {/* User Dropdown */}
                        <div className="relative">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-800 transition-colors cursor-pointer"
                                    >
                                        👤 {user.name}
                                        <svg
                                            className="ml-2 h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Link href={route("profile.edit")}>
                                        👤 Profile
                                    </Dropdown.Link>
                                    <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-100">
                                        <div className="font-medium">
                                            PMEC ACMS v2.0
                                        </div>
                                        <div>
                                            Laravel 12.24 • React 18 • JSX
                                        </div>
                                        <div>
                                            Build:{" "}
                                            {new Date().toLocaleDateString()}
                                        </div>
                                    </div>
                                    <Dropdown.Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                    >
                                        🚪 Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden">
                        <button
                            onClick={() =>
                                setShowingMobileMenu(!showingMobileMenu)
                            }
                            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        >
                            <svg
                                className={`${
                                    showingMobileMenu ? "hidden" : "block"
                                } h-6 w-6`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                            <svg
                                className={`${
                                    showingMobileMenu ? "block" : "hidden"
                                } h-6 w-6`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
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
                </div>

                {/* Mobile Navigation Menu */}
                {showingMobileMenu && (
                    <div className="lg:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {/* Mobile Navigation Links */}
                            <ResponsiveNavLink
                                href={route("dashboard")}
                                active={route().current("dashboard")}
                                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
                            >
                                📊 Dashboard
                            </ResponsiveNavLink>

                            {/* Courses Section */}
                            <div className="px-3 py-2">
                                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                    📚 Courses
                                </div>
                                <div className="space-y-1">
                                    <ResponsiveNavLink
                                        href={route("courses.index")}
                                        active={route().current("courses.*")}
                                        className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
                                    >
                                        📋 All Courses
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        href={route("archived-courses.index")}
                                        active={route().current(
                                            "archived-courses.*"
                                        )}
                                        className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
                                    >
                                        📚 Course Archives
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        href={route("courses.create")}
                                        className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
                                    >
                                        ➕ Create Course
                                    </ResponsiveNavLink>
                                </div>
                            </div>

                            <ResponsiveNavLink
                                href={route("trainers.index")}
                                active={route().current("trainers.*")}
                                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
                            >
                                👨‍🏫 Trainers
                            </ResponsiveNavLink>

                            <ResponsiveNavLink
                                href={route("participants.index")}
                                active={route().current("participants.*")}
                                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
                            >
                                👥 Participants
                            </ResponsiveNavLink>

                            <ResponsiveNavLink
                                href={route("employees.index")}
                                active={route().current("employees.*")}
                                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
                            >
                                👥 Employees
                            </ResponsiveNavLink>

                            {/* Roles moved to Management dropdown for better organization */}

                            <ResponsiveNavLink
                                href={route("tasks.index")}
                                active={route().current("tasks.*")}
                                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
                            >
                                📋 Tasks
                            </ResponsiveNavLink>

                            {/* Operations Section */}
                            <div className="px-3 py-2">
                                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                    🔧 Operations
                                </div>
                                <div className="space-y-1">
                                    <ResponsiveNavLink
                                        href={route("logistics.index")}
                                        className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
                                    >
                                        🚀 Logistics
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        href={route("operations.attendance")}
                                        className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
                                    >
                                        📋 Attendance
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        href={route("messages.index")}
                                        className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
                                    >
                                        💬 Messages
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        href={route("catering.index")}
                                        className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
                                    >
                                        🍽️ Catering
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        href={route(
                                            "catering.meal-break-plans.index"
                                        )}
                                        className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
                                    >
                                        📅 Meal Break Plans
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        href={route("transportation.index")}
                                        className="block px-3 py-2 rounded-md text-base font-medium text-sm font-medium text-white hover:bg-gray-700"
                                    >
                                        🚗 Vehicle Rental
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        href={route("asset-management.index")}
                                        className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
                                    >
                                        🏢 Manage Assets
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        href={route("user-management.index")}
                                        className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
                                    >
                                        👥 User Management
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        href={route(
                                            "financial-management.index"
                                        )}
                                        className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
                                    >
                                        💰 Financial Management
                                    </ResponsiveNavLink>
                                </div>
                            </div>

                            {/* Management Section */}
                            <div className="px-3 py-2">
                                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                    ⚙️ Management
                                </div>
                                <div className="space-y-1">
                                    <ResponsiveNavLink
                                        href={route("management.index")}
                                        className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
                                    >
                                        🎯 System Management
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        href={route("departments.index")}
                                        className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
                                    >
                                        🏢 Departments
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        href={route("role-management.index")}
                                        className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
                                    >
                                        👥 Roles
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        href={route(
                                            "course-location-management.index"
                                        )}
                                        className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
                                    >
                                        📍 Course Locations
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        href={route("training-halls.index")}
                                        className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
                                    >
                                        🏢 Training Halls
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        href={route("hall-bookings.index")}
                                        className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
                                    >
                                        📅 Hall Bookings
                                    </ResponsiveNavLink>
                                </div>
                            </div>

                            {/* User Section */}
                            <div className="border-t border-gray-700 pt-4">
                                <ResponsiveNavLink
                                    href={route("profile.edit")}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
                                >
                                    👤 Profile
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
                                >
                                    🚪 Log Out
                                </ResponsiveNavLink>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* ===== MAIN CONTENT ===== */}
            <main className="flex-1">
                {header && (
                    <header className="bg-gray-800 shadow">
                        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-white">{children}</div>
                        </div>
                    </div>
                </div>
            </main>

            {/* ===== FOOTER ===== */}
            <footer className="bg-slate-800 text-gray-300 py-3 sm:py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-xs sm:text-sm">
                    © {new Date().getFullYear()} PMEC — Professional Management
                    Expertise Center
                </div>
            </footer>
        </div>
    );
}

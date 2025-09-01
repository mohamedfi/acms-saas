import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";

export default function AttendanceIndex({ auth, course, attendanceSummary }) {
    const [qrCode, setQrCode] = useState("");
    const [scanStatus, setScanStatus] = useState("");
    const [scanMessage, setScanMessage] = useState("");
    const [isScanning, setIsScanning] = useState(false);
    const [localAttendanceSummary, setLocalAttendanceSummary] =
        useState(attendanceSummary);

    const handleQrScan = async () => {
        if (!qrCode.trim()) {
            setScanMessage("Please enter a QR code");
            return;
        }

        setIsScanning(true);
        setScanMessage("");

        try {
            const response = await fetch("/attendance/scan-qr", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
                body: JSON.stringify({
                    qr_code: qrCode,
                    course_id: course.id,
                    status: "present",
                    method: "qr",
                }),
            });

            const data = await response.json();

            if (data.success) {
                setScanStatus("success");
                setScanMessage(
                    `✅ ${data.participant.name} - ${data.participant.status} at ${data.participant.time}`
                );
                setQrCode("");

                // Automatically refresh attendance data
                await refreshAttendanceData();
            } else {
                setScanStatus("error");
                setScanMessage(`❌ ${data.message}`);
            }
        } catch (error) {
            setScanStatus("error");
            setScanMessage("❌ Error scanning QR code. Please try again.");
        } finally {
            setIsScanning(false);
        }
    };

    // Function to refresh attendance data
    const refreshAttendanceData = async () => {
        try {
            const response = await fetch(`/attendance/course/${course.id}`, {
                headers: {
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
            });

            if (response.ok) {
                const data = await response.json();
                if (data.attendanceSummary) {
                    setLocalAttendanceSummary(data.attendanceSummary);
                }
            }
        } catch (error) {
            console.error("Error refreshing attendance data:", error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "excellent":
                return "text-green-600 bg-green-100";
            case "good":
                return "text-blue-600 bg-blue-100";
            case "fair":
                return "text-yellow-600 bg-yellow-100";
            case "poor":
                return "text-red-600 bg-red-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Attendance - ${course.course_name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                        📊 Attendance Management
                                    </h1>
                                    <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                                        {course.course_name} -{" "}
                                        {course.course_code}
                                    </p>
                                </div>
                                <a
                                    href={`/archived-courses/${course.id}`}
                                    className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                >
                                    ← Back to Course
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* QR Code Scanner */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                📱 QR Code Scanner
                            </h2>
                            <div className="flex space-x-4">
                                <input
                                    type="text"
                                    value={qrCode}
                                    onChange={(e) => setQrCode(e.target.value)}
                                    placeholder="Enter QR code manually or scan"
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    onKeyPress={(e) =>
                                        e.key === "Enter" && handleQrScan()
                                    }
                                />
                                <button
                                    onClick={handleQrScan}
                                    disabled={isScanning}
                                    className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200"
                                >
                                    {isScanning ? "Scanning..." : "Scan"}
                                </button>
                            </div>
                            {scanMessage && (
                                <div
                                    className={`mt-3 p-3 rounded-lg ${
                                        scanStatus === "success"
                                            ? "bg-green-100 text-green-800"
                                            : scanStatus === "error"
                                            ? "bg-red-100 text-red-800"
                                            : "bg-blue-100 text-blue-800"
                                    }`}
                                >
                                    {scanMessage}
                                    {scanStatus === "success" && (
                                        <div className="mt-2 text-sm">
                                            📊 Attendance data has been
                                            automatically updated below!
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Attendance Summary */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                📊 Attendance Summary
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        {
                                            localAttendanceSummary.total_participants
                                        }
                                    </div>
                                    <div className="text-sm text-blue-600 dark:text-blue-400">
                                        Total Participants
                                    </div>
                                </div>
                                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                        {localAttendanceSummary.total_sessions}
                                    </div>
                                    <div className="text-sm text-green-600 dark:text-green-400">
                                        Total Sessions
                                    </div>
                                </div>
                                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-blue-800">
                                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                        {localAttendanceSummary.attendance_rate}
                                        %
                                    </div>
                                    <div className="text-sm text-purple-600 dark:text-purple-400">
                                        Overall Rate
                                    </div>
                                </div>
                                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                        {course.participants?.length || 0}
                                    </div>
                                    <div className="text-sm text-orange-600 dark:text-orange-400">
                                        Enrolled
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Participant List */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                    👥 Participant Attendance
                                </h2>
                                <button
                                    onClick={refreshAttendanceData}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                >
                                    🔄 Refresh Data
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Participant
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                QR Code
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Present
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Absent
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Late
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Rate
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {localAttendanceSummary.participants?.map(
                                            (participant) => (
                                                <tr
                                                    key={participant.id}
                                                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {participant.name}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                                                            {
                                                                participant.qr_code
                                                            }
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                                                            {
                                                                participant.present_count
                                                            }
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-red-600 dark:text-red-400 font-medium">
                                                            {
                                                                participant.absent_count
                                                            }
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                                                            {
                                                                participant.late_count
                                                            }
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                                                            {
                                                                participant.attendance_rate
                                                            }
                                                            %
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                                                participant.status
                                                            )}`}
                                                        >
                                                            {participant.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

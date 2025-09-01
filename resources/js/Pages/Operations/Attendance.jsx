import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import QRCode from "qrcode";
// Using emoji icons instead of heroicons

export default function OperationsAttendance({
    auth,
    courses,
    selectedCourse,
    selectedCourseId,
    attendanceSummary,
    participants,
    globalStats,
}) {
    const [localAttendanceSummary, setLocalAttendanceSummary] =
        useState(attendanceSummary);
    const [localParticipants, setLocalParticipants] = useState(participants);
    const [selectedCourseIdLocal, setSelectedCourseIdLocal] =
        useState(selectedCourseId);
    const [qrCode, setQrCode] = useState("");
    const [scanMessage, setScanMessage] = useState("");
    const [isScanning, setIsScanning] = useState(false);
    const [participantQRCodes, setParticipantQRCodes] = useState({});

    // Update local state when props change
    useEffect(() => {
        setLocalAttendanceSummary(attendanceSummary);
        setLocalParticipants(participants);
        setSelectedCourseIdLocal(selectedCourseId);
    }, [attendanceSummary, participants, selectedCourseId]);

    // Debug logging
    useEffect(() => {
        console.log('Operations Attendance Props:', {
            courses,
            selectedCourse,
            selectedCourseId,
            attendanceSummary,
            participants,
            globalStats
        });
    }, [courses, selectedCourse, selectedCourseId, attendanceSummary, participants, globalStats]);

    const handleCourseChange = async (courseId) => {
        if (!courseId) {
            setLocalAttendanceSummary(null);
            setLocalParticipants(null);
            setSelectedCourseIdLocal(null);
            setParticipantQRCodes({});
            return;
        }

        try {
            const response = await fetch(
                `/operations/attendance/course/${courseId}`
            );
            const data = await response.json();

            setLocalAttendanceSummary(data.attendanceSummary);
            setLocalParticipants(data.participants);
            setSelectedCourseIdLocal(courseId);
            
            // Generate QR codes for participants
            if (data.participants) {
                const qrCodes = {};
                for (const participant of data.participants) {
                    // Find the participant's QR code from the main participants table
                    const participantResponse = await fetch(`/api/participants?search=${encodeURIComponent(participant.name)}`);
                    const participantData = await participantResponse.json();
                    if (participantData.data && participantData.data.length > 0) {
                        const mainParticipant = participantData.data[0];
                        if (mainParticipant.qr_code) {
                            const qrDataURL = await generateQRCode(mainParticipant.qr_code);
                            qrCodes[participant.id] = {
                                qrString: mainParticipant.qr_code,
                                qrImage: qrDataURL
                            };
                        }
                    }
                }
                setParticipantQRCodes(qrCodes);
            }
        } catch (error) {
            console.error("Error fetching course attendance:", error);
        }
    };

    const handleQrScan = async (e) => {
        e.preventDefault();
        if (!qrCode.trim() || !selectedCourseIdLocal) {
            setScanMessage("Please enter a QR code and select a course");
            return;
        }

        setIsScanning(true);
        setScanMessage("");

        try {
            const response = await fetch("/operations/attendance/scan-qr", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
                body: JSON.stringify({
                    qr_code: qrCode,
                    course_id: selectedCourseIdLocal,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setScanMessage(`✅ ${data.participant} - ${data.message}`);
                setQrCode("");
                // Refresh attendance data
                await handleCourseChange(selectedCourseIdLocal);
            } else {
                setScanMessage(`❌ ${data.message}`);
            }
        } catch (error) {
            setScanMessage("❌ Error scanning QR code");
            console.error("Error:", error);
        } finally {
            setIsScanning(false);
        }
    };

    const refreshAttendanceData = async () => {
        if (selectedCourseIdLocal) {
            await handleCourseChange(selectedCourseIdLocal);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "present":
                return "bg-green-100 text-green-800 border-green-200";
            case "absent":
                return "bg-red-100 text-red-800 border-red-200";
            case "late":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "present":
                return "✅";
            case "absent":
                return "❌";
            case "late":
                return "⏰";
            default:
                return "❓";
        }
    };

    const generateQRCode = async (qrString) => {
        try {
            const qrDataURL = await QRCode.toDataURL(qrString, {
                width: 80,
                margin: 1,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            });
            return qrDataURL;
        } catch (error) {
            console.error('Error generating QR code:', error);
            return null;
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Operations - Attendance Management
                </h2>
            }
        >
            <Head title="Operations - Attendance" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                        📊 Attendance Management
                                    </h1>
                                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                                        Manage attendance across all courses
                                        with smart routing
                                    </p>
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={refreshAttendanceData}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                    >
                                        🔄 Refresh Data
                                    </button>
                                    <a
                                        href="/operations/attendance/export"
                                        className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                    >
                                        📥 Export Global Report
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Global Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">📅</div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Total Courses
                                        </p>
                                        <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                            {globalStats?.total_courses || 0}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">👥</div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Total Participants
                                        </p>
                                        <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                            {globalStats?.total_participants ||
                                                0}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">📊</div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Attendance Records
                                        </p>
                                        <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                            {globalStats?.total_attendance_records ||
                                                0}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">📈</div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Overall Rate
                                        </p>
                                        <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                            {globalStats?.overall_attendance_rate ||
                                                0}
                                            %
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Course Selection and QR Scanner */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                🎯 Course Selection & QR Scanner
                            </h3>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Course Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Select Course
                                    </label>
                                    <select
                                        value={selectedCourseIdLocal || ""}
                                        onChange={(e) =>
                                            handleCourseChange(e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    >
                                        <option value="">
                                            -- Select a course --
                                        </option>
                                        {courses && courses.length > 0 ? courses.map((course) => (
                                            <option
                                                key={course.id}
                                                value={course.id}
                                            >
                                                {course.course_name || 'Unnamed Course'} (
                                                {course.start_date || 'No date'})
                                            </option>
                                        )) : (
                                            <option value="" disabled>No courses available</option>
                                        )}
                                    </select>
                                </div>

                                {/* QR Scanner */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        QR Code Scanner
                                    </label>
                                    <form
                                        onSubmit={handleQrScan}
                                        className="flex space-x-2"
                                    >
                                        <input
                                            type="text"
                                            value={qrCode}
                                            onChange={(e) =>
                                                setQrCode(e.target.value)
                                            }
                                            placeholder="Enter QR code or scan"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            disabled={!selectedCourseIdLocal}
                                        />
                                        <button
                                            type="submit"
                                            disabled={
                                                !selectedCourseIdLocal ||
                                                isScanning
                                            }
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-md transition-colors duration-200 flex items-center"
                                        >
                                            📱
                                            {isScanning
                                                ? "Scanning..."
                                                : "Scan"}
                                        </button>
                                    </form>
                                    {scanMessage && (
                                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                            {scanMessage}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Course-Specific Attendance */}
                    {selectedCourseIdLocal && localAttendanceSummary && (
                        <>
                            {/* Attendance Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                👥
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Total Participants
                                                </p>
                                                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                                    {
                                                        localAttendanceSummary.total_participants
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                📈
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Present
                                                </p>
                                                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                                    {
                                                        localAttendanceSummary.present_count
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                📈
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Absent
                                                </p>
                                                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                                    {
                                                        localAttendanceSummary.absent_count
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                📈
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Attendance Rate
                                                </p>
                                                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                                    {
                                                        localAttendanceSummary.attendance_rate
                                                    }
                                                    %
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Participants List */}
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                            👥 Course Participants (
                                            {localParticipants?.length || 0})
                                        </h3>
                                        <a
                                            href={`/operations/attendance/export/${selectedCourseIdLocal}`}
                                            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                        >
                                            📥 Export Course Report
                                        </a>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-700">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Participant
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Email
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        QR Code
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Last Attendance
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                {localParticipants?.map(
                                                    (participant) => (
                                                        <tr
                                                            key={participant.id}
                                                        >
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                    {
                                                                        participant.name
                                                                    }
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                    {
                                                                        participant.email
                                                                    }
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span
                                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                                                                        participant.attendance_status
                                                                    )}`}
                                                                >
                                                                    {getStatusIcon(
                                                                        participant.attendance_status
                                                                    )}{" "}
                                                                    {
                                                                        participant.attendance_status
                                                                    }
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                {participantQRCodes[participant.id] ? (
                                                                    <div className="flex flex-col items-center space-y-2">
                                                                        <img 
                                                                            src={participantQRCodes[participant.id].qrImage} 
                                                                            alt={`QR Code for ${participant.name}`}
                                                                            className="w-16 h-16 border border-gray-300 rounded"
                                                                        />
                                                                        <span className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                                                                            {participantQRCodes[participant.id].qrString}
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-sm text-gray-400">Loading...</span>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                {participant.last_attendance
                                                                    ? new Date(
                                                                          participant.last_attendance
                                                                    ).toLocaleString()
                                                                    : "Not recorded"}
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* No Course Selected Message */}
                    {!selectedCourseIdLocal && (
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-center">
                                👥
                                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                                    No Course Selected
                                </h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    {courses && courses.length > 0 
                                        ? `Select a course from the dropdown above to view attendance details. Available courses: ${courses.length}`
                                        : 'No courses available. Please check your archived courses.'
                                    }
                                </p>
                                {courses && courses.length > 0 && (
                                    <div className="mt-4">
                                        <button
                                            onClick={() => handleCourseChange(courses[0].id)}
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                        >
                                            🚀 Quick Start: Select First Course
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

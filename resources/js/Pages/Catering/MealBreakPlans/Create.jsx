import React, { useState, useEffect, useRef } from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";

export default function Create() {
    const [items, setItems] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedDays, setSelectedDays] = useState([]);
    const [showCharts, setShowCharts] = useState(false);
    const [planData, setPlanData] = useState(null);
    const [numberOfDays, setNumberOfDays] = useState(7);
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const chartRef = useRef(null);

    // Generate dynamic day names with actual day names and dates
    const generateDayNames = (count, startDate) => {
        const days = [];
        const dayNames = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];

        if (!startDate) return days;

        for (let i = 0; i < count; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(currentDate.getDate() + i);

            const dayOfWeek = dayNames[currentDate.getDay()];
            const formattedDate = currentDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            });

            days.push({
                id: i + 1,
                name: `Day ${i + 1}`,
                dayName: dayOfWeek,
                date: formattedDate,
                fullDate: currentDate.toISOString().split("T")[0],
            });
        }
        return days;
    };

    const { data, setData, post, processing, errors } = useForm({
        name: "",
        description: "",
        start_date: "",
        end_date: "",
        notes: "",
        employee_id: "",
        department_id: "",
        total_food_cost: 0,
        total_delivery_cost: 0,
        grand_total: 0,
        items: [],
    });

    // Initialize with dynamic day structure
    useEffect(() => {
        const today = new Date();
        const endDate = new Date(today);
        endDate.setDate(today.getDate() + numberOfDays - 1); // numberOfDays total

        setData({
            ...data,
            start_date: today.toISOString().split("T")[0],
            end_date: endDate.toISOString().split("T")[0],
        });

        generateMealItems(numberOfDays);
    }, [numberOfDays]);

    // Fetch employees and departments
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get CSRF token from meta tag
                const token = document
                    .querySelector('meta[name="csrf-token"]')
                    ?.getAttribute("content");

                // Use the same baseUrl approach as courses
                const baseUrl = window.location.origin + "/pmec2/public";

                // Fetch employees
                const employeesResponse = await fetch(`${baseUrl}/api/employees`, {
                    headers: {
                        "X-CSRF-TOKEN": token,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    credentials: "same-origin",
                });

                if (!employeesResponse.ok) {
                    throw new Error(
                        `Employees API error: ${employeesResponse.status}`
                    );
                }

                const employeesData = await employeesResponse.json();
                setEmployees(employeesData.data || []);

                // Fetch departments
                const departmentsResponse = await fetch(`${baseUrl}/api/departments`, {
                    headers: {
                        "X-CSRF-TOKEN": token,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    credentials: "same-origin",
                });

                if (!departmentsResponse.ok) {
                    throw new Error(
                        `Departments API error: ${departmentsResponse.status}`
                    );
                }

                const departmentsData = await departmentsResponse.json();
                setDepartments(departmentsData.data || []);
            } catch (error) {
                console.error("Error fetching data:", error);
                // Set empty arrays to prevent errors
                setEmployees([]);
                setDepartments([]);
            }
        };

        fetchData();
    }, []);

    // Regenerate items when start date changes
    useEffect(() => {
        if (data.start_date && numberOfDays) {
            generateMealItems(numberOfDays);
        }
    }, [data.start_date]);

    // Function to generate meal items based on number of days
    const generateMealItems = (daysCount) => {
        const mealsPerDay = ["Breakfast", "Lunch", "Dinner"];
        const dayNames = generateDayNames(daysCount, data.start_date);
        const initialItems = [];

        dayNames.forEach((day, dayIndex) => {
            mealsPerDay.forEach((meal, mealIndex) => {
                initialItems.push({
                    id: `${dayIndex + 1}-${mealIndex + 1}`,
                    name: "",
                    cost: "",
                    delivery_cost: "",
                    location: "",
                    department: "",
                    course_id: "",
                    quantity: 1,
                    supplier: "",
                    day: day,
                    meal_type: meal,
                    participants: 0,
                    special_requirements: "",
                    meal_order: mealIndex + 1,
                });
            });
        });

        setItems(initialItems);
        setSelectedDays(dayNames);
    };

    // Helper function to calculate end date
    const calculateEndDate = (startDate, days) => {
        if (!startDate || !days) return "";
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + days - 1);
        return endDate.toISOString().split("T")[0];
    };

    // Fetch courses when component mounts
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const baseUrl = window.location.origin + "/pmec2/public";
                const response = await fetch(`${baseUrl}/api/courses`);
                if (response.ok) {
                    const result = await response.json();
                    setCourses(result.data || []);
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };
        fetchCourses();
    }, []);

    const updateItem = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;

        // If course_id changes, update the name automatically
        if (field === "course_id") {
            const selectedCourse = courses.find((course) => course.id == value);
            if (selectedCourse) {
                newItems[index].name = selectedCourse.name;
            }
        }

        setItems(newItems);
        updateTotals(newItems);
    };

    const updateTotals = (currentItems) => {
        const totalFood = currentItems.reduce((sum, item) => {
            const itemCost =
                (parseFloat(item.cost) || 0) * (parseInt(item.quantity) || 1);
            return sum + itemCost;
        }, 0);

        const totalDelivery = currentItems.reduce((sum, item) => {
            return sum + (parseFloat(item.delivery_cost) || 0);
        }, 0);

        const grandTotal = totalFood + totalDelivery;

        setData("total_food_cost", totalFood);
        setData("total_delivery_cost", totalDelivery);
        setData("grand_total", grandTotal);
        setData("items", currentItems);
    };

    const generateReport = () => {
        const reportData = {
            planName: data.name,
            period: `${data.start_date} to ${data.end_date}`,
            totalDays: numberOfDays,
            totalMeals: numberOfDays * 3,
            totalFoodCost: data.total_food_cost,
            totalDeliveryCost: data.total_delivery_cost,
            grandTotal: data.grand_total,
            dailyBreakdown: items.map((item) => ({
                day: item.day.name,
                meal: item.meal_type,
                course: item.name,
                participants: item.participants,
                cost:
                    (parseFloat(item.cost) || 0) *
                    (parseInt(item.quantity) || 1),
                delivery: parseFloat(item.delivery_cost) || 0,
                supplier: item.supplier,
                location: item.location,
                department: item.department,
            })),
            summary: {
                totalParticipants: items.reduce(
                    (sum, item) => sum + (parseInt(item.participants) || 0),
                    0
                ),
                averageDailyCost: data.grand_total / numberOfDays,
                mostExpensiveDay: items.reduce(
                    (max, item) => {
                        const cost =
                            (parseFloat(item.cost) || 0) *
                                (parseInt(item.quantity) || 1) +
                            (parseFloat(item.delivery_cost) || 0);
                        return cost > max.cost
                            ? { day: item.day.name, cost }
                            : max;
                    },
                    { day: "", cost: 0 }
                ),
                suppliers: [
                    ...new Set(
                        items.map((item) => item.supplier).filter(Boolean)
                    ),
                ],
                locations: [
                    ...new Set(
                        items.map((item) => item.location).filter(Boolean)
                    ),
                ],
                departments: [
                    ...new Set(
                        items.map((item) => item.department).filter(Boolean)
                    ),
                ],
            },
        };

        setPlanData(reportData);
        setShowCharts(true);
    };

    const downloadPDF = async () => {
        if (!chartRef.current) return;

        try {
            // Create a simple HTML report for download
            const reportHTML = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>${data.name} - Meal Break Plan Report</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
                        .summary { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
                        .daily-breakdown { margin-bottom: 30px; }
                        .day-card { border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px; }
                        .cost-highlight { color: #e53e3e; font-weight: bold; }
                        .supplier-info { background: #e6fffa; padding: 10px; border-radius: 5px; margin-top: 10px; }
                        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background: #f8f9fa; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>🍽️ ${data.name}</h1>
                        <h2>Meal Break Plan Report</h2>
                        <p><strong>Period:</strong> ${data.start_date} to ${
                data.end_date
            }</p>
                        <p><strong>Total Days:</strong> {numberOfDays}</p>
                <p><strong>Total Meals:</strong> {numberOfDays * 3} (3 meals per day)</p>
                    </div>

                    <div class="summary">
                        <h3>📊 Financial Summary</h3>
                        <table>
                            <tr><th>Category</th><th>Amount (EGP)</th></tr>
                            <tr><td>Total Food Cost</td><td class="cost-highlight">${data.total_food_cost.toFixed(
                                2
                            )}</td></tr>
                            <tr><td>Total Delivery Cost</td><td class="cost-highlight">${data.total_delivery_cost.toFixed(
                                2
                            )}</td></tr>
                            <tr><td><strong>Grand Total</strong></td><td class="cost-highlight"><strong>${data.grand_total.toFixed(
                                2
                            )}</strong></td></tr>
                        </table>
                    </div>

                    <div class="daily-breakdown">
                        <h3>📅 Daily Breakdown</h3>
                        ${items
                            .map(
                                (item) => `
                            <div class="day-card">
                                <h4>${item.day} - ${item.meal_type}</h4>
                                <p><strong>Course:</strong> ${
                                    item.name || "Not specified"
                                }</p>
                                <p><strong>Participants:</strong> ${
                                    item.participants || 0
                                }</p>
                                <p><strong>Cost:</strong> EGP ${(
                                    (parseFloat(item.cost) || 0) *
                                    (parseInt(item.quantity) || 1)
                                ).toFixed(2)}</p>
                                <p><strong>Delivery:</strong> EGP ${(
                                    parseFloat(item.delivery_cost) || 0
                                ).toFixed(2)}</p>
                                <div class="supplier-info">
                                    <p><strong>Supplier:</strong> ${
                                        item.supplier || "Not specified"
                                    }</p>
                                    <p><strong>Location:</strong> ${
                                        item.location || "Not specified"
                                    }</p>
                                    <p><strong>Department:</strong> ${
                                        item.department || "Not specified"
                                    }</p>
                                </div>
                            </div>
                        `
                            )
                            .join("")}
                    </div>

                    <div class="summary">
                        <h3>📈 Plan Statistics</h3>
                        <p><strong>Total Participants:</strong> ${items.reduce(
                            (sum, item) =>
                                sum + (parseInt(item.participants) || 0),
                            0
                        )}</p>
                        <p><strong>Average Daily Cost:</strong> EGP ${(
                            data.grand_total / numberOfDays
                        ).toFixed(2)}</p>
                        <p><strong>Average Meal Cost:</strong> EGP ${(
                            data.grand_total /
                            (numberOfDays * 3)
                        ).toFixed(2)}</p>
                        <p><strong>Most Expensive Day:</strong> ${items.reduce(
                            (max, item) => {
                                const cost =
                                    (parseFloat(item.cost) || 0) *
                                        (parseInt(item.quantity) || 1) +
                                    (parseFloat(item.delivery_cost) || 0);
                                return cost > max.cost ? item.day : max.day;
                            },
                            ""
                        )}</p>
                    </div>

                    <div class="summary">
                        <h3>📝 Notes</h3>
                        <p>${data.notes || "No additional notes provided."}</p>
                    </div>

                    <div style="text-align: center; margin-top: 40px; color: #666;">
                        <p>Report generated on ${new Date().toLocaleDateString()}</p>
                    </div>
                </body>
                </html>
            `;

            // Create blob and download
            const blob = new Blob([reportHTML], { type: "text/html" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${data.name
                .replace(/[^a-z0-9]/gi, "_")
                .toLowerCase()}_meal_plan_report.html`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Error generating report:", error);
            alert("Error generating report. Please try again.");
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post("/pmec2/public/catering/meal-break-plans");
    };

    const getDayColor = (day) => {
        const colors = {
            1: "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg",
            2: "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg",
            3: "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg",
            4: "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg",
            5: "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg",
            6: "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg",
            7: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg",
            8: "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg",
            9: "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg",
            10: "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg",
        };
        return (
            colors[day.id] ||
            "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg"
        );
    };

    const getMealTypeColor = (mealType) => {
        const colors = {
            Breakfast:
                "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg font-semibold",
            Lunch: "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg font-semibold",
            Dinner: "bg-gradient-to-r from-purple-400 to-indigo-500 text-white shadow-lg font-semibold",
            Snack: "bg-gradient-to-r from-teal-400 to-cyan-500 text-white shadow-lg font-semibold",
        };
        return colors[mealType] || "bg-gray-500 text-white shadow-lg";
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create 7-Day Meal Break Plan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-semibold">
                                    🗓️ Create Dynamic Meal Break Plan
                                </h2>
                                <a
                                    href="/pmec2/public/catering/meal-break-plans"
                                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                                >
                                    ← Back to Plans
                                </a>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                {/* Basic Plan Information */}
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6">
                                    <h3 className="text-xl font-semibold mb-4 text-blue-800 dark:text-blue-200">
                                        📋 Basic Plan Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel
                                                htmlFor="name"
                                                value="Plan Name"
                                            />
                                            <TextInput
                                                id="name"
                                                type="text"
                                                name="name"
                                                value={data.name}
                                                className="mt-1 block w-full"
                                                onChange={(e) =>
                                                    setData(
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="e.g., Weekly Training Meal Plan - August 2025"
                                                required
                                            />
                                            <InputError
                                                message={errors.name}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div>
                                            <InputLabel
                                                htmlFor="description"
                                                value="Description (Optional)"
                                            />
                                            <TextInput
                                                id="description"
                                                type="text"
                                                name="description"
                                                value={data.description}
                                                className="mt-1 block w-full"
                                                onChange={(e) =>
                                                    setData(
                                                        "description",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Brief description of the weekly plan"
                                            />
                                            <InputError
                                                message={errors.description}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                        <div>
                                            <InputLabel
                                                htmlFor="employee_id"
                                                value="Responsible Employee"
                                            />

                                            <select
                                                id="employee_id"
                                                name="employee_id"
                                                value={data.employee_id}
                                                className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                onChange={(e) =>
                                                    setData(
                                                        "employee_id",
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    Select an employee
                                                </option>
                                                {employees.map((employee) => (
                                                    <option
                                                        key={employee.id}
                                                        value={employee.id}
                                                    >
                                                        {employee.full_name} -{" "}
                                                        {employee.position}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError
                                                message={errors.employee_id}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div>
                                            <InputLabel
                                                htmlFor="department_id"
                                                value="Department"
                                            />

                                            <select
                                                id="department_id"
                                                name="department_id"
                                                value={data.department_id}
                                                className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                onChange={(e) =>
                                                    setData(
                                                        "department_id",
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    Select a department
                                                </option>
                                                {departments.map(
                                                    (department) => (
                                                        <option
                                                            key={department.id}
                                                            value={
                                                                department.id
                                                            }
                                                        >
                                                            {department.name}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                            <InputError
                                                message={errors.department_id}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                        <div>
                                            <InputLabel
                                                htmlFor="number_of_days"
                                                value="Number of Days"
                                            />
                                            <TextInput
                                                id="number_of_days"
                                                type="number"
                                                name="number_of_days"
                                                value={numberOfDays}
                                                className="mt-1 block w-full"
                                                onChange={(e) => {
                                                    const days =
                                                        parseInt(
                                                            e.target.value
                                                        ) || 1;
                                                    setNumberOfDays(
                                                        Math.max(
                                                            1,
                                                            Math.min(30, days)
                                                        )
                                                    ); // Limit 1-30 days
                                                }}
                                                min="1"
                                                max="30"
                                                required
                                            />
                                            <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                Choose 1-30 days for your meal
                                                plan
                                            </div>
                                        </div>

                                        <div>
                                            <InputLabel
                                                htmlFor="start_date"
                                                value="Start Date"
                                            />
                                            <TextInput
                                                id="start_date"
                                                type="date"
                                                name="start_date"
                                                value={data.start_date}
                                                className="mt-1 block w-full"
                                                onChange={(e) =>
                                                    setData(
                                                        "start_date",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                            <InputError
                                                message={errors.start_date}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div>
                                            <InputLabel
                                                htmlFor="end_date"
                                                value="End Date"
                                            />
                                            <TextInput
                                                id="end_date"
                                                type="date"
                                                name="end_date"
                                                value={calculateEndDate(
                                                    data.start_date,
                                                    numberOfDays
                                                )}
                                                className="mt-1 block w-full"
                                                readOnly
                                            />
                                            {data.start_date &&
                                                numberOfDays && (
                                                    <div className="mt-1 text-sm text-green-600 dark:text-green-400">
                                                        📅 {numberOfDays}-day
                                                        period:{" "}
                                                        {data.start_date} to{" "}
                                                        {calculateEndDate(
                                                            data.start_date,
                                                            numberOfDays
                                                        )}
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                </div>

                                {/* Dynamic Meal Plan Grid */}
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6">
                                    <h3 className="text-xl font-semibold mb-6 text-green-800 dark:text-green-200">
                                        🍽️ Dynamic Meal Plan Structure
                                    </h3>

                                    <div className="space-y-6">
                                        {selectedDays.map((day) => (
                                            <div
                                                key={day}
                                                className="bg-white dark:bg-gray-800 rounded-lg p-6 border-2 border-green-200 dark:border-green-800"
                                            >
                                                <div
                                                    className={`text-center mb-4 p-3 rounded-lg ${getDayColor(
                                                        day
                                                    )}`}
                                                >
                                                    <h3 className="font-bold text-lg mb-1">
                                                        {day.name}
                                                    </h3>
                                                    <div className="text-sm opacity-90">
                                                        {day.dayName} •{" "}
                                                        {day.date}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    {items
                                                        .filter(
                                                            (item) =>
                                                                item.day.id ===
                                                                day.id
                                                        )
                                                        .sort(
                                                            (a, b) =>
                                                                a.meal_order -
                                                                b.meal_order
                                                        )
                                                        .map(
                                                            (
                                                                item,
                                                                mealIndex
                                                            ) => {
                                                                // Find the actual index in the original items array
                                                                const actualIndex =
                                                                    items.findIndex(
                                                                        (
                                                                            originalItem
                                                                        ) =>
                                                                            originalItem.id ===
                                                                            item.id
                                                                    );
                                                                return (
                                                                    <div
                                                                        key={
                                                                            item.id
                                                                        }
                                                                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                                                                    >
                                                                        <div
                                                                            className={`text-center mb-3 p-2 rounded-lg ${getMealTypeColor(
                                                                                item.meal_type
                                                                            )}`}
                                                                        >
                                                                            <h4 className="font-bold text-sm">
                                                                                {
                                                                                    item.meal_type
                                                                                }
                                                                            </h4>
                                                                        </div>

                                                                        <div className="space-y-3">
                                                                            {/* Meal Type */}
                                                                            <div>
                                                                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                                                    Meal
                                                                                    Type
                                                                                </label>
                                                                                <select
                                                                                    value={
                                                                                        item.meal_type
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) =>
                                                                                        updateItem(
                                                                                            actualIndex,
                                                                                            "meal_type",
                                                                                            e
                                                                                                .target
                                                                                                .value
                                                                                        )
                                                                                    }
                                                                                    className="w-full text-xs border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-md"
                                                                                >
                                                                                    <option value="Breakfast">
                                                                                        Breakfast
                                                                                    </option>
                                                                                    <option value="Lunch">
                                                                                        Lunch
                                                                                    </option>
                                                                                    <option value="Dinner">
                                                                                        Dinner
                                                                                    </option>
                                                                                    <option value="Snack">
                                                                                        Snack
                                                                                    </option>
                                                                                </select>
                                                                            </div>

                                                                            {/* Course Selection */}
                                                                            <div>
                                                                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                                                    Course
                                                                                </label>
                                                                                <select
                                                                                    value={
                                                                                        item.course_id
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) =>
                                                                                        updateItem(
                                                                                            actualIndex,
                                                                                            "course_id",
                                                                                            e
                                                                                                .target
                                                                                                .value
                                                                                        )
                                                                                    }
                                                                                    className="w-full text-xs border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-md"
                                                                                    required
                                                                                >
                                                                                    <option value="">
                                                                                        Select
                                                                                        Course
                                                                                    </option>
                                                                                    {courses.map(
                                                                                        (
                                                                                            course
                                                                                        ) => (
                                                                                            <option
                                                                                                key={
                                                                                                    course.id
                                                                                                }
                                                                                                value={
                                                                                                    course.id
                                                                                                }
                                                                                            >
                                                                                                {
                                                                                                    course.name
                                                                                                }
                                                                                            </option>
                                                                                        )
                                                                                    )}
                                                                                </select>
                                                                            </div>

                                                                            {/* Participants */}
                                                                            <div>
                                                                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                                                    Participants
                                                                                </label>
                                                                                <input
                                                                                    type="number"
                                                                                    value={
                                                                                        item.participants
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) =>
                                                                                        updateItem(
                                                                                            actualIndex,
                                                                                            "participants",
                                                                                            e
                                                                                                .target
                                                                                                .value
                                                                                        )
                                                                                    }
                                                                                    className="w-full text-xs border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-md"
                                                                                    placeholder="0"
                                                                                    min="0"
                                                                                />
                                                                            </div>

                                                                            {/* Cost per Person */}
                                                                            <div>
                                                                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                                                    Cost
                                                                                    per
                                                                                    Person
                                                                                    (EGP)
                                                                                </label>
                                                                                <input
                                                                                    type="number"
                                                                                    value={
                                                                                        item.cost
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) =>
                                                                                        updateItem(
                                                                                            actualIndex,
                                                                                            "cost",
                                                                                            e
                                                                                                .target
                                                                                                .value
                                                                                        )
                                                                                    }
                                                                                    className="w-full text-xs border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-md"
                                                                                    placeholder="0.00"
                                                                                    step="0.01"
                                                                                    min="0"
                                                                                    required
                                                                                />
                                                                            </div>

                                                                            {/* Delivery Cost */}
                                                                            <div>
                                                                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                                                    Delivery
                                                                                    Cost
                                                                                    (EGP)
                                                                                </label>
                                                                                <input
                                                                                    type="number"
                                                                                    value={
                                                                                        item.delivery_cost
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) =>
                                                                                        updateItem(
                                                                                            actualIndex,
                                                                                            "delivery_cost",
                                                                                            e
                                                                                                .target
                                                                                                .value
                                                                                        )
                                                                                    }
                                                                                    className="w-full text-xs border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-md"
                                                                                    placeholder="0.00"
                                                                                    step="0.01"
                                                                                    min="0"
                                                                                />
                                                                            </div>

                                                                            {/* Supplier */}
                                                                            <div>
                                                                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                                                    Supplier
                                                                                </label>
                                                                                <input
                                                                                    type="text"
                                                                                    value={
                                                                                        item.supplier
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) =>
                                                                                        updateItem(
                                                                                            actualIndex,
                                                                                            "supplier",
                                                                                            e
                                                                                                .target
                                                                                                .value
                                                                                        )
                                                                                    }
                                                                                    className="w-full text-xs border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-md"
                                                                                    placeholder="Restaurant/Catering"
                                                                                />
                                                                            </div>

                                                                            {/* Location */}
                                                                            <div>
                                                                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                                                    Location
                                                                                </label>
                                                                                <select
                                                                                    value={
                                                                                        item.location
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) =>
                                                                                        updateItem(
                                                                                            actualIndex,
                                                                                            "location",
                                                                                            e
                                                                                                .target
                                                                                                .value
                                                                                        )
                                                                                    }
                                                                                    className="w-full text-xs border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-md"
                                                                                >
                                                                                    <option value="">
                                                                                        Select
                                                                                        Location
                                                                                    </option>
                                                                                    <option value="مكانك إسكندرية">
                                                                                        مكانك
                                                                                        إسكندرية
                                                                                    </option>
                                                                                    <option value="مكانك مدينة نصر">
                                                                                        مكانك
                                                                                        مدينة
                                                                                        نصر
                                                                                    </option>
                                                                                    <option value="الدقي">
                                                                                        الدقي
                                                                                    </option>
                                                                                    <option value="الرحاب">
                                                                                        الرحاب
                                                                                    </option>
                                                                                    <option value="Business Square">
                                                                                        Business
                                                                                        Square
                                                                                    </option>
                                                                                    <option value="BDC">
                                                                                        BDC
                                                                                    </option>
                                                                                    <option value="الطارق العلي">
                                                                                        الطارق
                                                                                        العلي
                                                                                    </option>
                                                                                </select>
                                                                            </div>

                                                                            {/* Department */}
                                                                            <div>
                                                                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                                                    Department
                                                                                </label>
                                                                                <select
                                                                                    value={
                                                                                        item.department
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) =>
                                                                                        updateItem(
                                                                                            actualIndex,
                                                                                            "department",
                                                                                            e
                                                                                                .target
                                                                                                .value
                                                                                        )
                                                                                    }
                                                                                    className="w-full text-xs border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-md"
                                                                                >
                                                                                    <option value="">
                                                                                        Select
                                                                                        Department
                                                                                    </option>
                                                                                    <option value="إدارة الموارد">
                                                                                        إدارة
                                                                                        الموارد
                                                                                    </option>
                                                                                    <option value="المشروعات">
                                                                                        المشروعات
                                                                                    </option>
                                                                                    <option value="إدارة المواد">
                                                                                        إدارة
                                                                                        المواد
                                                                                    </option>
                                                                                    <option value="التمريض">
                                                                                        التمريض
                                                                                    </option>
                                                                                    <option value="إدارة المشروعات">
                                                                                        إدارة
                                                                                        المشروعات
                                                                                    </option>
                                                                                    <option value="تنمية مهارات وادارية">
                                                                                        تنمية
                                                                                        مهارات
                                                                                        وادارية
                                                                                    </option>
                                                                                </select>
                                                                            </div>

                                                                            {/* Special Requirements */}
                                                                            <div>
                                                                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                                                    Special
                                                                                    Requirements
                                                                                </label>
                                                                                <textarea
                                                                                    value={
                                                                                        item.special_requirements
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) =>
                                                                                        updateItem(
                                                                                            actualIndex,
                                                                                            "special_requirements",
                                                                                            e
                                                                                                .target
                                                                                                .value
                                                                                        )
                                                                                    }
                                                                                    className="w-full text-xs border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-md"
                                                                                    placeholder="Dietary restrictions, allergies..."
                                                                                    rows="2"
                                                                                />
                                                                            </div>

                                                                            {/* Day Total */}
                                                                            <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-center">
                                                                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                                                                    Meal
                                                                                    Total
                                                                                </div>
                                                                                <div className="font-bold text-green-600 dark:text-green-400">
                                                                                    EGP{" "}
                                                                                    {(
                                                                                        (parseFloat(
                                                                                            item.cost
                                                                                        ) ||
                                                                                            0) *
                                                                                            (parseInt(
                                                                                                item.participants
                                                                                            ) ||
                                                                                                0) +
                                                                                        (parseFloat(
                                                                                            item.delivery_cost
                                                                                        ) ||
                                                                                            0)
                                                                                    ).toFixed(
                                                                                        2
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }
                                                        )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Financial Summary */}
                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6">
                                    <h3 className="text-xl font-semibold mb-6 text-purple-800 dark:text-purple-200">
                                        💰 Financial Summary
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center border-2 border-blue-200 dark:border-blue-800">
                                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                EGP{" "}
                                                {data.total_food_cost.toFixed(
                                                    2
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                Total Food Cost
                                            </div>
                                        </div>
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center border-2 border-green-200 dark:border-green-800">
                                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                EGP{" "}
                                                {data.total_delivery_cost.toFixed(
                                                    2
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                Total Delivery Cost
                                            </div>
                                        </div>
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center border-2 border-purple-200 dark:border-purple-800">
                                            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                                EGP{" "}
                                                {data.grand_total.toFixed(2)}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                Grand Total
                                            </div>
                                        </div>
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center border-2 border-orange-200 dark:border-orange-800">
                                            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                                EGP{" "}
                                                {(
                                                    data.grand_total /
                                                    (numberOfDays * 3)
                                                ).toFixed(2)}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                Meal Average ({numberOfDays * 3}{" "}
                                                meals)
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Notes */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                    <InputLabel
                                        htmlFor="notes"
                                        value="Additional Notes (Optional)"
                                    />
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        value={data.notes}
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        rows="4"
                                        onChange={(e) =>
                                            setData("notes", e.target.value)
                                        }
                                        placeholder="Additional notes, special instructions, dietary requirements, or any other relevant information..."
                                    />
                                    <InputError
                                        message={errors.notes}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-4 items-center justify-between">
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={generateReport}
                                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                                        >
                                            📊 Generate Report & Charts
                                        </button>
                                        {showCharts && (
                                            <button
                                                type="button"
                                                onClick={downloadPDF}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                                            >
                                                📥 Download Report
                                            </button>
                                        )}
                                    </div>

                                    <PrimaryButton
                                        className="ml-4"
                                        disabled={
                                            processing ||
                                            !data.name ||
                                            !data.start_date ||
                                            !data.end_date ||
                                            items.length === 0
                                        }
                                    >
                                        {processing
                                            ? "Creating..."
                                            : "Create Meal Break Plan"}
                                    </PrimaryButton>
                                </div>
                            </form>

                            {/* Charts and Reports Section */}
                            {showCharts && planData && (
                                <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-800">
                                    <h3 className="text-xl font-semibold mb-6 text-blue-800 dark:text-blue-200">
                                        📊 Plan Analysis & Charts
                                    </h3>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                        {/* Daily Cost Chart */}
                                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                            <h4 className="font-semibold mb-3 text-center">
                                                Daily Cost Breakdown
                                            </h4>
                                            <div className="h-64 flex items-end justify-center space-x-2">
                                                {planData.dailyBreakdown
                                                    .filter(
                                                        (day, index) =>
                                                            index % 3 === 0
                                                    ) // Show one bar per day (first meal of each day)
                                                    .map((day, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex flex-col items-center"
                                                        >
                                                            <div
                                                                className="w-8 bg-blue-500 rounded-t"
                                                                style={{
                                                                    height: `${
                                                                        ((day.cost +
                                                                            day.delivery) /
                                                                            planData.grandTotal) *
                                                                        200
                                                                    }px`,
                                                                }}
                                                            ></div>
                                                            <div className="text-xs mt-2 text-center">
                                                                <div className="font-medium">
                                                                    {day.day}
                                                                </div>
                                                                <div className="text-blue-600">
                                                                    EGP{" "}
                                                                    {(
                                                                        day.cost +
                                                                        day.delivery
                                                                    ).toFixed(
                                                                        2
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>

                                        {/* Meal Type Distribution */}
                                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                            <h4 className="font-semibold mb-3 text-center">
                                                Meal Type Distribution
                                            </h4>
                                            <div className="space-y-3">
                                                {[
                                                    "Breakfast",
                                                    "Lunch",
                                                    "Dinner",
                                                    "Snack",
                                                ].map((mealType) => {
                                                    const count = items.filter(
                                                        (item) =>
                                                            item.meal_type ===
                                                            mealType
                                                    ).length;
                                                    const percentage =
                                                        (count / 7) * 100;
                                                    return (
                                                        <div
                                                            key={mealType}
                                                            className="flex items-center justify-between"
                                                        >
                                                            <span className="text-sm">
                                                                {mealType}
                                                            </span>
                                                            <div className="flex-1 mx-3">
                                                                <div className="bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                                                    <div
                                                                        className="bg-blue-500 h-2 rounded-full"
                                                                        style={{
                                                                            width: `${percentage}%`,
                                                                        }}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                            <span className="text-sm font-medium">
                                                                {count}/7
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Summary Statistics */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                {
                                                    planData.summary
                                                        .totalParticipants
                                                }
                                            </div>
                                            <div className="text-sm text-blue-800 dark:text-blue-200">
                                                Total Participants
                                            </div>
                                        </div>
                                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                {
                                                    planData.summary.suppliers
                                                        .length
                                                }
                                            </div>
                                            <div className="text-sm text-green-800 dark:text-green-200">
                                                Unique Suppliers
                                            </div>
                                        </div>
                                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                                {
                                                    planData.summary.locations
                                                        .length
                                                }
                                            </div>
                                            <div className="text-sm text-purple-800 dark:text-purple-200">
                                                Locations
                                            </div>
                                        </div>
                                    </div>

                                    {/* Detailed Daily Table */}
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                                            <thead className="bg-gray-50 dark:bg-gray-700">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Day
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Meal
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Course
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Participants
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Cost
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Supplier
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                                {planData.dailyBreakdown.map(
                                                    (day, index) => (
                                                        <tr
                                                            key={index}
                                                            className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                                        >
                                                            <td className="px-4 py-3 whitespace-nowrap">
                                                                <span
                                                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDayColor(
                                                                        day.day
                                                                    )}`}
                                                                >
                                                                    {day.day}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 whitespace-nowrap">
                                                                <span
                                                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMealTypeColor(
                                                                        day.meal
                                                                    )}`}
                                                                >
                                                                    {day.meal}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                                                                {day.course ||
                                                                    "Not specified"}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                                                                {
                                                                    day.participants
                                                                }
                                                            </td>
                                                            <td className="px-4 py-3 text-sm font-medium text-green-600 dark:text-green-400">
                                                                EGP{" "}
                                                                {(
                                                                    day.cost +
                                                                    day.delivery
                                                                ).toFixed(2)}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                                                                {day.supplier ||
                                                                    "Not specified"}
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Help Text */}
                            <div className="mt-8 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                    💡 How the Dynamic Meal Plan Works
                                </h3>
                                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                                    <p>
                                        <strong>1. Flexible Duration:</strong>{" "}
                                        Choose 1-30 days for your meal plan
                                        (currently {numberOfDays} days)
                                    </p>
                                    <p>
                                        <strong>
                                            2. Smart Date Calculation:
                                        </strong>{" "}
                                        System automatically calculates end date
                                        and shows day names with dates
                                    </p>
                                    <p>
                                        <strong>3. Structured Planning:</strong>{" "}
                                        Plan 3 meals (Breakfast, Lunch, Dinner)
                                        plus optional Snacks for each day of
                                        your chosen period
                                    </p>
                                    <p>
                                        <strong>
                                            4. Comprehensive Details:
                                        </strong>{" "}
                                        Include course, participants, costs,
                                        suppliers, locations, and departments
                                        for each meal
                                    </p>
                                    <p>
                                        <strong>
                                            5. Automatic Calculations:
                                        </strong>{" "}
                                        System calculates meal, daily, and total
                                        costs automatically
                                    </p>
                                    <p>
                                        <strong>6. Visual Reports:</strong>{" "}
                                        Generate charts and reports to analyze
                                        your meal plan patterns
                                    </p>
                                    <p>
                                        <strong>7. Download Options:</strong>{" "}
                                        Export your plan as an HTML report for
                                        sharing with stakeholders
                                    </p>
                                    <p>
                                        <strong>8. Cost Tracking:</strong>{" "}
                                        Monitor food costs, delivery costs, and
                                        total expenses per meal and per day
                                    </p>
                                    <p>
                                        <strong>9. Meal Organization:</strong>{" "}
                                        Each day shows Breakfast, Lunch, and
                                        Dinner with individual settings
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

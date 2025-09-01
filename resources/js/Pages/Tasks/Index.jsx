import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ tasks, employees, courses, filters = {} }) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [selectedEmployee, setSelectedEmployee] = useState(filters?.assigned_to || '');
    const [selectedStatus, setSelectedStatus] = useState(filters?.status || '');
    const [selectedPriority, setSelectedPriority] = useState(filters?.priority || '');
    const [selectedTaskType, setSelectedTaskType] = useState(filters?.task_type || '');

    const applyFilters = () => {
        const filterParams = {};
        if (searchTerm) filterParams.search = searchTerm;
        if (selectedEmployee) filterParams.assigned_to = selectedEmployee;
        if (selectedStatus) filterParams.status = selectedStatus;
        if (selectedPriority) filterParams.priority = selectedPriority;
        if (selectedTaskType) filterParams.task_type = selectedTaskType;

        router.get(route('tasks.index'), filterParams, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedEmployee('');
        setSelectedStatus('');
        setSelectedPriority('');
        setSelectedTaskType('');
        router.get(route('tasks.index'));
    };

    const handleDelete = (task) => {
        if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
            router.delete(route('tasks.destroy', task.id));
        }
    };

    const handleStatusUpdate = (task, newStatus) => {
        router.put(route('tasks.update', task.id), {
            ...task,
            status: newStatus,
        }, {
            preserveScroll: true,
        });
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { 
                class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
                emoji: '⏳',
                text: 'Pending'
            },
            in_progress: { 
                class: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
                emoji: '🔄',
                text: 'In Progress'
            },
            completed: { 
                class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
                emoji: '✅',
                text: 'Completed'
            },
            cancelled: { 
                class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
                emoji: '❌',
                text: 'Cancelled'
            },
            done: { 
                class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
                emoji: '✅',
                text: 'Done'
            },
            blocked: { 
                class: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
                emoji: '🚫',
                text: 'Blocked'
            }
        };

        const config = statusConfig[status] || statusConfig.pending;
        
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.class}`}>
                {config.emoji} {config.text}
            </span>
        );
    };

    const getPriorityBadge = (priority) => {
        const priorityConfig = {
            low: { 
                class: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
                emoji: '🔽',
                text: 'Low'
            },
            normal: { 
                class: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
                emoji: '➖',
                text: 'Normal'
            },
            medium: { 
                class: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
                emoji: '➖',
                text: 'Medium'
            },
            high: { 
                class: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
                emoji: '🔺',
                text: 'High'
            },
            urgent: { 
                class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
                emoji: '🚨',
                text: 'Urgent'
            }
        };

        const config = priorityConfig[priority] || priorityConfig.normal;
        
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.class}`}>
                {config.emoji} {config.text}
            </span>
        );
    };

    const getTaskTypeBadge = (taskType) => {
        const typeConfig = {
            'course-related': { emoji: '🎓', text: 'Course' },
            'administrative': { emoji: '📋', text: 'Admin' },
            'financial': { emoji: '💰', text: 'Finance' },
            'general': { emoji: '📝', text: 'General' },
        };

        const config = typeConfig[taskType] || { emoji: '📝', text: 'General' };
        
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                {config.emoji} {config.text}
            </span>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        const date = new Date(dateString);
        const isOverdue = date < new Date() && dateString;
        const className = isOverdue ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-900 dark:text-gray-100';
        
        return (
            <span className={className}>
                📅 {date.toLocaleDateString()}
                {isOverdue && ' ⚠️'}
            </span>
        );
    };

    const getTaskStats = () => {
        const total = tasks.length;
        const pending = tasks.filter(t => ['pending'].includes(t.status)).length;
        const inProgress = tasks.filter(t => ['in_progress'].includes(t.status)).length;
        const completed = tasks.filter(t => ['completed', 'done'].includes(t.status)).length;
        const overdue = tasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && !['completed', 'done', 'cancelled'].includes(t.status)).length;

        return { total, pending, inProgress, completed, overdue };
    };

    const stats = getTaskStats();

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        📋 Task Management
                    </h2>
                    <Link
                        href={route('tasks.create')}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                    >
                        ➕ Create Task
                    </Link>
                </div>
            }
        >
            <Head title="Tasks" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="text-2xl">📋</div>
                                </div>
                                <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tasks</div>
                                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="text-2xl">⏳</div>
                                </div>
                                <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending</div>
                                    <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="text-2xl">🔄</div>
                                </div>
                                <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">In Progress</div>
                                    <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="text-2xl">✅</div>
                                </div>
                                <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</div>
                                    <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="text-2xl">⚠️</div>
                                </div>
                                <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Overdue</div>
                                    <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                                {/* Search */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        🔍 Search
                                    </label>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                                        placeholder="Search tasks..."
                                        className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    />
                                </div>

                                {/* Employee Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        👤 Assigned To
                                    </label>
                                    <select
                                        value={selectedEmployee}
                                        onChange={(e) => setSelectedEmployee(e.target.value)}
                                        className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    >
                                        <option value="">All Employees</option>
                                        {employees.map(employee => (
                                            <option key={employee.id} value={employee.id}>
                                                {employee.full_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Status Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        📊 Status
                                    </label>
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    >
                                        <option value="">All Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                        <option value="done">Done</option>
                                        <option value="blocked">Blocked</option>
                                    </select>
                                </div>

                                {/* Priority Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        🔺 Priority
                                    </label>
                                    <select
                                        value={selectedPriority}
                                        onChange={(e) => setSelectedPriority(e.target.value)}
                                        className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    >
                                        <option value="">All Priorities</option>
                                        <option value="low">Low</option>
                                        <option value="normal">Normal</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>

                                {/* Apply Filters */}
                                <div className="flex items-end space-x-2">
                                    <button
                                        onClick={applyFilters}
                                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                    >
                                        🔍 Filter
                                    </button>
                                </div>

                                {/* Clear Filters */}
                                <div className="flex items-end">
                                    <button
                                        onClick={clearFilters}
                                        className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                    >
                                        🗑️ Clear
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tasks Table */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    Tasks ({tasks.length})
                                </h3>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Task
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Assigned To
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Priority & Type
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Status & Due Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {tasks.length > 0 ? (
                                            tasks.map((task) => (
                                                <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                    <td className="px-6 py-4">
                                                        <div className="max-w-xs">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                                                                {task.title}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                                {task.description}
                                                            </div>
                                                            {task.course && (
                                                                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                                                    🎓 {task.course.course_name}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {task.assigned_to ? (
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0 h-8 w-8">
                                                                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                                                                        {task.assigned_to.first_name?.charAt(0)}{task.assigned_to.last_name?.charAt(0)}
                                                                    </div>
                                                                </div>
                                                                <div className="ml-3">
                                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                        {task.assigned_to.full_name}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                        {task.assigned_to.role?.display_name}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-500 dark:text-gray-400">Unassigned</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="space-y-2">
                                                            {getPriorityBadge(task.priority)}
                                                            {getTaskTypeBadge(task.task_type)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="space-y-2">
                                                            {getStatusBadge(task.status)}
                                                            <div className="text-xs">
                                                                {formatDate(task.due_date)}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            <Link
                                                                href={route('tasks.show', task.id)}
                                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                            >
                                                                👁️
                                                            </Link>
                                                            <Link
                                                                href={route('tasks.edit', task.id)}
                                                                className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                                                            >
                                                                ✏️
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(task)}
                                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                            >
                                                                🗑️
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                                    <div className="text-6xl mb-4">📋</div>
                                                    <div className="text-lg font-medium mb-2">No tasks found</div>
                                                    <div className="text-sm">
                                                        {filters && Object.values(filters).some(Boolean) 
                                                            ? 'Try adjusting your filters'
                                                            : 'Get started by creating your first task'
                                                        }
                                                    </div>
                                                </td>
                                            </tr>
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
import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        subject: '',
        content: '',
        channel: 'all',
        category: 'announcement',
        variables: [],
        is_active: true,
    });

    const channels = [
        { value: 'email', label: '📧 Email Only' },
        { value: 'sms', label: '💬 SMS Only' },
        { value: 'whatsapp', label: '📱 WhatsApp Only' },
        { value: 'all', label: '🌐 All Channels' },
    ];

    const categories = [
        { value: 'course', label: '📚 Course Related' },
        { value: 'task', label: '📋 Task Related' },
        { value: 'announcement', label: '📢 Announcement' },
        { value: 'reminder', label: '⏰ Reminder' },
        { value: 'welcome', label: '👋 Welcome' },
        { value: 'confirmation', label: '✅ Confirmation' },
    ];

    const commonVariables = [
        'participant_name', 'course_name', 'course_start', 'course_end', 'location',
        'employee_name', 'task_title', 'task_description', 'due_date', 'priority',
        'announcement_title', 'announcement_content', 'sender_name'
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('message-templates.store'), {
            onSuccess: () => {
                reset();
            },
        });
    };

    const addVariable = (variable) => {
        if (!data.variables.includes(variable)) {
            setData('variables', [...data.variables, variable]);
        }
    };

    const removeVariable = (variable) => {
        setData('variables', data.variables.filter(v => v !== variable));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        📝 Create Message Template
                    </h2>
                    <Link
                        href={route('message-templates.index')}
                        className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                    >
                        ⬅️ Back to Templates
                    </Link>
                </div>
            }
        >
            <Head title="Create Template" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Basic Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel value="Template Name *" />
                                        <TextInput
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="mt-1 block w-full"
                                            placeholder="e.g., Course Welcome, Task Assignment"
                                        />
                                        <InputError message={errors.name} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel value="Category *" />
                                        <select
                                            value={data.category}
                                            onChange={(e) => setData('category', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        >
                                            {categories.map((category) => (
                                                <option key={category.value} value={category.value}>
                                                    {category.label}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.category} className="mt-2" />
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <InputLabel value="Description" />
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={3}
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        placeholder="Brief description of when to use this template..."
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                {/* Channel and Active Status */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel value="Channel *" />
                                        <select
                                            value={data.channel}
                                            onChange={(e) => setData('channel', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        >
                                            {channels.map((channel) => (
                                                <option key={channel.value} value={channel.value}>
                                                    {channel.label}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.channel} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel value="Status" />
                                        <div className="mt-2">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={data.is_active}
                                                    onChange={(e) => setData('is_active', e.target.checked)}
                                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                                    Active (can be used for sending messages)
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Subject (for email templates) */}
                                <div>
                                    <InputLabel value="Subject (Email templates only)" />
                                    <TextInput
                                        value={data.subject}
                                        onChange={(e) => setData('subject', e.target.value)}
                                        className="mt-1 block w-full"
                                        placeholder="Email subject line (optional for SMS/WhatsApp)"
                                    />
                                    <InputError message={errors.subject} className="mt-2" />
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Leave empty for SMS and WhatsApp templates
                                    </p>
                                </div>

                                {/* Content */}
                                <div>
                                    <InputLabel value="Message Content *" />
                                    <textarea
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        rows={8}
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        placeholder="Enter your message content. Use {{variable_name}} for dynamic content..."
                                    />
                                    <InputError message={errors.content} className="mt-2" />
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Use <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">{{variable_name}}</code> for dynamic content
                                    </p>
                                </div>

                                {/* Variables */}
                                <div>
                                    <InputLabel value="Available Variables" />
                                    <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                            Click on variables to add them to your template:
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {commonVariables.map((variable) => (
                                                <button
                                                    key={variable}
                                                    type="button"
                                                    onClick={() => addVariable(variable)}
                                                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                                                        data.variables.includes(variable)
                                                            ? 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700'
                                                            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-500'
                                                    }`}
                                                >
                                                    {variable}
                                                </button>
                                            ))}
                                        </div>
                                        {data.variables.length > 0 && (
                                            <div className="mt-3">
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                    Selected variables:
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {data.variables.map((variable) => (
                                                        <span
                                                            key={variable}
                                                            className="px-3 py-1 text-sm bg-blue-100 text-blue-800 border border-blue-300 rounded-full flex items-center"
                                                        >
                                                            {variable}
                                                            <button
                                                                type="button"
                                                                onClick={() => removeVariable(variable)}
                                                                className="ml-2 text-blue-600 hover:text-blue-800"
                                                            >
                                                                ×
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <Link
                                        href={route('message-templates.index')}
                                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 text-sm font-medium rounded-lg transition-colors duration-200"
                                    >
                                        ❌ Cancel
                                    </Link>
                                    <PrimaryButton
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2 bg-green-600 hover:bg-green-700"
                                    >
                                        {processing ? 'Creating...' : '📝 Create Template'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

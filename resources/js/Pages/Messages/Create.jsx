import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Create({ templates, participants, employees, courses }) {
    const [selectedChannel, setSelectedChannel] = useState('email');
    const [selectedCategory, setSelectedCategory] = useState('announcement');
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [showSchedule, setShowSchedule] = useState(false);
    const [recipients, setRecipients] = useState([]);
    const [selectedRecipientType, setSelectedRecipientType] = useState(''); // Track which button was clicked

    const { data, setData, post, processing, errors, reset } = useForm({
        recipients: [],
        template_id: '',
        subject: '',
        content: '',
        channel: 'email',
        category: 'announcement',
        priority: 'normal',
        scheduled_at: '',
    });

    const channels = [
        { value: 'email', label: '📧 Email', icon: '📧' },
        { value: 'sms', label: '💬 SMS', icon: '💬' },
        { value: 'whatsapp', label: '📱 WhatsApp', icon: '📱' },
    ];

    const categories = [
        { value: 'course', label: '📚 Course Related', icon: '📚' },
        { value: 'task', label: '📋 Task Related', icon: '📋' },
        { value: 'announcement', label: '📢 Announcement', icon: '📢' },
        { value: 'reminder', label: '⏰ Reminder', icon: '⏰' },
        { value: 'welcome', label: '👋 Welcome', icon: '👋' },
        { value: 'confirmation', label: '✅ Confirmation', icon: '✅' },
    ];

    const priorities = [
        { value: 'low', label: '🔽 Low', color: 'text-gray-600' },
        { value: 'normal', label: '➖ Normal', color: 'text-blue-600' },
        { value: 'high', label: '🔺 High', color: 'text-orange-600' },
        { value: 'urgent', label: '🚨 Urgent', color: 'text-red-600' },
    ];

    const handleChannelChange = (channel) => {
        setSelectedChannel(channel);
        setData('channel', channel);
        
        // Update recipients based on channel
        if (channel === 'email') {
            setRecipients(participants.map(p => ({
                type: 'email',
                value: p.email,
                name: p.full_name,
                channel: 'email'
            })));
        } else {
            setRecipients(participants.map(p => ({
                type: 'phone',
                value: p.phone,
                name: p.full_name,
                channel: channel
            })));
        }
        
        setData('recipients', recipients);
    };

    const handleTemplateChange = (templateId) => {
        setSelectedTemplate(templateId);
        setData('template_id', templateId);
        
        if (templateId) {
            const template = templates.find(t => t.id == templateId);
            if (template) {
                setData('subject', template.subject || '');
                setData('content', template.content || '');
                setData('category', template.category || 'announcement');
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Update recipients before submitting
        setData('recipients', recipients);
        
        post(route('messages.store'), {
            onSuccess: () => {
                reset();
                setRecipients([]);
                setSelectedTemplate('');
            },
        });
    };

    const addRecipient = () => {
        const newRecipient = {
            type: selectedChannel === 'email' ? 'email' : 'phone',
            value: '',
            name: '',
            channel: selectedChannel
        };
        setRecipients([...recipients, newRecipient]);
    };

    const removeRecipient = (index) => {
        const newRecipients = recipients.filter((_, i) => i !== index);
        setRecipients(newRecipients);
    };

    const updateRecipient = (index, field, value) => {
        const newRecipients = [...recipients];
        newRecipients[index][field] = value;
        setRecipients(newRecipients);
    };

    const selectAllParticipants = () => {
        if (selectedChannel === 'email') {
            setRecipients(participants.map(p => ({
                type: 'email',
                value: p.email,
                name: p.full_name,
                channel: 'email'
            })));
        } else {
            setRecipients(participants.map(p => ({
                type: 'phone',
                value: p.phone,
                name: p.full_name,
                channel: selectedChannel
            })));
        }
        setSelectedRecipientType('participants');
        setData('recipients', recipients);
    };

    const selectAllEmployees = () => {
        if (selectedChannel === 'email') {
            setRecipients(employees.map(e => ({
                type: 'email',
                value: e.email,
                name: `${e.first_name} ${e.last_name}`,
                channel: 'email'
            })));
        } else {
            setRecipients(employees.map(e => ({
                type: 'phone',
                value: e.phone,
                name: `${e.first_name} ${e.last_name}`,
                channel: selectedChannel
            })));
        }
        setSelectedRecipientType('employees');
        setData('recipients', recipients);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        📨 Compose Message
                    </h2>
                    <Link
                        href={route('messages.index')}
                        className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                    >
                        ⬅️ Back to Messages
                    </Link>
                </div>
            }
        >
            <Head title="Compose Message" />

            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Channel Selection */}
                                <div>
                                    <InputLabel value="Communication Channel *" />
                                    <div className="mt-2 grid grid-cols-3 gap-3">
                                        {channels.map((channel) => (
                                            <button
                                                key={channel.value}
                                                type="button"
                                                onClick={() => handleChannelChange(channel.value)}
                                                className={`p-4 border-2 rounded-lg text-center transition-all ${
                                                    selectedChannel === channel.value
                                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100'
                                                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 text-gray-700 dark:text-gray-300'
                                                }`}
                                            >
                                                <div className="text-2xl mb-2">{channel.icon}</div>
                                                <div className="font-medium text-gray-900 dark:text-gray-100">{channel.label}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Category and Priority */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel value="Category *" />
                                        <select
                                            value={data.category}
                                            onChange={(e) => setData('category', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        >
                                            {categories.map((category) => (
                                                <option key={category.value} value={category.value}>
                                                    {category.icon} {category.label}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.category} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel value="Priority *" />
                                        <select
                                            value={data.priority}
                                            onChange={(e) => setData('priority', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        >
                                            {priorities.map((priority) => (
                                                <option key={priority.value} value={priority.value}>
                                                    {priority.label}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.priority} className="mt-2" />
                                    </div>
                                </div>

                                {/* Template Selection */}
                                <div>
                                    <InputLabel value="Message Template (Optional)" />
                                    <select
                                        value={selectedTemplate}
                                        onChange={(e) => handleTemplateChange(e.target.value)}
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    >
                                        <option value="">Select a template...</option>
                                        {templates.map((template) => (
                                            <option key={template.id} value={template.id}>
                                                {template.channel_icon} {template.name} - {template.category}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.template_id} className="mt-2" />
                                </div>

                                {/* Subject (Email only) */}
                                {selectedChannel === 'email' && (
                                    <div>
                                        <InputLabel value="Subject" />
                                        <TextInput
                                            value={data.subject}
                                            onChange={(e) => setData('subject', e.target.value)}
                                            className="mt-1 block w-full"
                                            placeholder="Enter email subject..."
                                        />
                                        <InputError message={errors.subject} className="mt-2" />
                                    </div>
                                )}

                                {/* Message Content */}
                                <div>
                                    <InputLabel value="Message Content *" />
                                    <textarea
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        rows={6}
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        placeholder="Enter your message content..."
                                    />
                                    <InputError message={errors.content} className="mt-2" />
                                </div>

                                {/* Recipients */}
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <InputLabel value="Recipients *" />
                                        <div className="space-x-2">
                                            <button
                                                type="button"
                                                onClick={selectAllParticipants}
                                                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                                    selectedRecipientType === 'participants'
                                                        ? 'bg-green-700 text-white ring-2 ring-green-300'
                                                        : 'bg-green-600 hover:bg-green-700 text-white'
                                                }`}
                                            >
                                                👥 All Participants
                                                {selectedRecipientType === 'participants' && recipients.length > 0 && (
                                                    <span className="ml-2 text-xs bg-green-800 px-2 py-1 rounded-full">
                                                        {recipients.length} selected
                                                    </span>
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={selectAllEmployees}
                                                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                                    selectedRecipientType === 'employees'
                                                        ? 'bg-blue-700 text-white ring-2 ring-blue-300'
                                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                                }`}
                                            >
                                                👨‍💼 All Employees
                                                {selectedRecipientType === 'employees' && recipients.length > 0 && (
                                                    <span className="ml-2 text-xs bg-blue-800 px-2 py-1 rounded-full">
                                                        {recipients.length} selected
                                                    </span>
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={addRecipient}
                                                className="px-3 py-1 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
                                            >
                                                ➕ Add Recipient
                                            </button>
                                            {selectedRecipientType && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setRecipients([]);
                                                        setSelectedRecipientType('');
                                                        setData('recipients', []);
                                                    }}
                                                    className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-md"
                                                >
                                                    🗑️ Clear Selection
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {recipients.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                            No recipients selected. Use the buttons above to add recipients.
                                        </div>
                                    ) : (
                                        <>
                                            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                                                            {selectedRecipientType === 'participants' ? '👥 Participants' : '👨‍💼 Employees'} Selected
                                                        </span>
                                                        <span className="text-blue-500 dark:text-blue-300 text-sm">
                                                            ({recipients.length} recipients)
                                                        </span>
                                                    </div>
                                                    <span className="text-blue-500 dark:text-blue-300 text-xs">
                                                        Channel: {selectedChannel.toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                            {recipients.map((recipient, index) => (
                                                <div key={index} className="flex items-center space-x-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg">
                                                    <div className="flex-1 grid grid-cols-2 gap-3">
                                                        <input
                                                            type="text"
                                                            value={recipient.name}
                                                            onChange={(e) => updateRecipient(index, 'name', e.target.value)}
                                                            placeholder="Recipient name"
                                                            className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={recipient.value}
                                                            onChange={(e) => updateRecipient(index, 'value', e.target.value)}
                                                            placeholder={selectedChannel === 'email' ? 'Email address' : 'Phone number'}
                                                            className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeRecipient(index)}
                                                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        </>
                                    )}
                                    <InputError message={errors.recipients} className="mt-2" />
                                </div>

                                {/* Scheduling */}
                                <div>
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            id="schedule_message"
                                            checked={showSchedule}
                                            onChange={(e) => setShowSchedule(e.target.checked)}
                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <InputLabel value="Schedule for later" />
                                    </div>

                                    {showSchedule && (
                                        <div className="mt-3">
                                            <InputLabel value="Send Date & Time" />
                                            <TextInput
                                                type="datetime-local"
                                                value={data.scheduled_at}
                                                onChange={(e) => setData('scheduled_at', e.target.value)}
                                                className="mt-1 block w-full"
                                                min={new Date(Date.now() + 60000).toISOString().slice(0, 16)}
                                            />
                                            <InputError message={errors.scheduled_at} className="mt-2" />
                                        </div>
                                    )}
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <Link
                                        href={route('messages.index')}
                                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 text-sm font-medium rounded-lg transition-colors duration-200"
                                    >
                                        ❌ Cancel
                                    </Link>
                                    <PrimaryButton
                                        type="submit"
                                        disabled={processing || recipients.length === 0}
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700"
                                    >
                                        {processing ? 'Sending...' : showSchedule ? '📅 Schedule Message' : '📤 Send Message'}
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

import React, { useState, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';

export default function Edit({ auth, hall, trainers, trainingPrograms }) {
    const { data, setData, put, processing, errors } = useForm({
        name: hall.name || '',
        code: hall.code || '',
        description: hall.description || '',
        address: hall.address || '',
        city: hall.city || '',
        capacity: hall.capacity || 30,
        facilities: hall.facilities || [],
        contact_person: hall.contact_person || '',
        contact_phone: hall.contact_phone || '',
        contact_email: hall.contact_email || '',
        assigned_employee_id: hall.assigned_employee_id || '',
        assigned_role: hall.assigned_role || '',
        assignment_date: hall.assignment_date || '',
        assignment_notes: hall.assignment_notes || '',
        specialized_courses: hall.specialized_courses || [],
        is_general_purpose: hall.is_general_purpose || false,
        is_active: hall.is_active !== undefined ? hall.is_active : true,
        sort_order: hall.sort_order || 0,
    });

    const [newFacility, setNewFacility] = useState('');
    const [newSpecializedCourse, setNewSpecializedCourse] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('training-halls.update', hall.id));
    };

    const addFacility = () => {
        if (newFacility.trim() && !data.facilities.includes(newFacility.trim())) {
            setData('facilities', [...data.facilities, newFacility.trim()]);
            setNewFacility('');
        }
    };

    const removeFacility = (index) => {
        setData('facilities', data.facilities.filter((_, i) => i !== index));
    };

    const addSpecializedCourse = () => {
        if (newSpecializedCourse && !data.specialized_courses.includes(newSpecializedCourse)) {
            setData('specialized_courses', [...data.specialized_courses, newSpecializedCourse]);
            setNewSpecializedCourse('');
        }
    };

    const removeSpecializedCourse = (index) => {
        setData('specialized_courses', data.specialized_courses.filter((_, i) => i !== index));
    };

    const roleOptions = [
        { value: 'manager', label: 'Manager' },
        { value: 'coordinator', label: 'Coordinator' },
        { value: 'supervisor', label: 'Supervisor' },
        { value: 'assistant', label: 'Assistant' },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Edit Training Hall - ${hall.name}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Edit Training Hall
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Update information for {hall.name}
                            </p>
                        </div>
                        <Link
                            href={route('training-halls.show', hall.id)}
                            className="inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                        >
                            ← Back to Hall
                        </Link>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="name" value="Hall Name" />
                                        <TextInput
                                            id="name"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.name} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="code" value="Hall Code" />
                                        <TextInput
                                            id="code"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.code}
                                            onChange={(e) => setData('code', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.code} className="mt-2" />
                                    </div>
                                </div>

                                <div>
                                    <InputLabel htmlFor="description" value="Description" />
                                    <textarea
                                        id="description"
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        rows="3"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="city" value="City" />
                                        <TextInput
                                            id="city"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.city} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="capacity" value="Capacity" />
                                        <TextInput
                                            id="capacity"
                                            type="number"
                                            className="mt-1 block w-full"
                                            value={data.capacity}
                                            onChange={(e) => setData('capacity', parseInt(e.target.value))}
                                            min="1"
                                            max="1000"
                                            required
                                        />
                                        <InputError message={errors.capacity} className="mt-2" />
                                    </div>
                                </div>

                                <div>
                                    <InputLabel htmlFor="address" value="Address" />
                                    <TextInput
                                        id="address"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                    />
                                    <InputError message={errors.address} className="mt-2" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Facilities */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Facilities</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex space-x-2">
                                    <TextInput
                                        type="text"
                                        placeholder="Add a facility"
                                        value={newFacility}
                                        onChange={(e) => setNewFacility(e.target.value)}
                                        className="flex-1"
                                    />
                                    <button
                                        type="button"
                                        onClick={addFacility}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        Add
                                    </button>
                                </div>

                                {data.facilities.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {data.facilities.map((facility, index) => (
                                            <Badge key={index} className="flex items-center space-x-1">
                                                <span>{facility}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFacility(index)}
                                                    className="ml-1 text-red-500 hover:text-red-700"
                                                >
                                                    ×
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="contact_person" value="Contact Person" />
                                        <TextInput
                                            id="contact_person"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.contact_person}
                                            onChange={(e) => setData('contact_person', e.target.value)}
                                        />
                                        <InputError message={errors.contact_person} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="contact_phone" value="Contact Phone" />
                                        <TextInput
                                            id="contact_phone"
                                            type="tel"
                                            className="mt-1 block w-full"
                                            value={data.contact_phone}
                                            onChange={(e) => setData('contact_phone', e.target.value)}
                                        />
                                        <InputError message={errors.contact_phone} className="mt-2" />
                                    </div>
                                </div>

                                <div>
                                    <InputLabel htmlFor="contact_email" value="Contact Email" />
                                    <TextInput
                                        id="contact_email"
                                        type="email"
                                        className="mt-1 block w-full"
                                        value={data.contact_email}
                                        onChange={(e) => setData('contact_email', e.target.value)}
                                    />
                                    <InputError message={errors.contact_email} className="mt-2" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Employee Assignment */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Employee Assignment</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="assigned_employee_id" value="Assigned Employee" />
                                        <select
                                            id="assigned_employee_id"
                                            value={data.assigned_employee_id}
                                            onChange={(e) => setData('assigned_employee_id', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="">Select an employee</option>
                                            {trainers.map((trainer) => (
                                                <option key={trainer.id} value={trainer.id}>
                                                    {trainer.full_name} - {trainer.position}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.assigned_employee_id} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="assigned_role" value="Assignment Role" />
                                        <select
                                            id="assigned_role"
                                            value={data.assigned_role}
                                            onChange={(e) => setData('assigned_role', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="">Select a role</option>
                                            {roleOptions.map((role) => (
                                                <option key={role.value} value={role.value}>
                                                    {role.label}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.assigned_role} className="mt-2" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="assignment_date" value="Assignment Date" />
                                        <input
                                            id="assignment_date"
                                            type="date"
                                            value={data.assignment_date}
                                            onChange={(e) => setData('assignment_date', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        <InputError message={errors.assignment_date} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="assignment_notes" value="Assignment Notes" />
                                        <textarea
                                            id="assignment_notes"
                                            rows="2"
                                            value={data.assignment_notes}
                                            onChange={(e) => setData('assignment_notes', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="Notes about this employee assignment..."
                                        />
                                        <InputError message={errors.assignment_notes} className="mt-2" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Course Specialization */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Course Specialization</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center">
                                    <input
                                        id="is_general_purpose"
                                        type="checkbox"
                                        checked={data.is_general_purpose}
                                        onChange={(e) => setData('is_general_purpose', e.target.checked)}
                                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    <label htmlFor="is_general_purpose" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                        This hall can host any type of course (General Purpose)
                                    </label>
                                </div>

                                {!data.is_general_purpose && (
                                    <div>
                                        <InputLabel value="Specialized Courses" />
                                        <div className="mt-2 space-y-2">
                                            {data.specialized_courses.map((courseId, index) => {
                                                const course = trainingPrograms.find(p => p.id == courseId);
                                                return (
                                                    <div key={index} className="flex items-center space-x-2">
                                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                                            {course?.name || `Course ID: ${courseId}`}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeSpecializedCourse(index)}
                                                            className="text-red-600 hover:text-red-800 text-sm"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                            <select
                                                onChange={(e) => {
                                                    if (e.target.value && !data.specialized_courses.includes(e.target.value)) {
                                                        addSpecializedCourse(e.target.value);
                                                        e.target.value = "";
                                                    }
                                                }}
                                                className="mt-2 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            >
                                                <option value="">Add a specialized course</option>
                                                {trainingPrograms.map((program) => (
                                                    <option key={program.id} value={program.id}>
                                                        {program.name} ({program.code})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Status & Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Status & Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center">
                                        <input
                                            id="is_active"
                                            type="checkbox"
                                            checked={data.is_active}
                                            onChange={(e) => setData('is_active', e.target.checked)}
                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        <label htmlFor="is_active" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                            Active
                                        </label>
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="sort_order" value="Sort Order" />
                                        <TextInput
                                            id="sort_order"
                                            type="number"
                                            className="mt-1 block w-full"
                                            value={data.sort_order}
                                            onChange={(e) => setData('sort_order', parseInt(e.target.value))}
                                            min="0"
                                        />
                                        <InputError message={errors.sort_order} className="mt-2" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-3">
                            <Link
                                href={route('training-halls.show', hall.id)}
                                className="inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                            >
                                Cancel
                            </Link>
                            <PrimaryButton disabled={processing}>
                                {processing ? 'Updating...' : 'Update Training Hall'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

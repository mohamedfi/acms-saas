import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Create({ roles }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        employee_id: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        position: '',
        role_id: '',
        department: '',
        bio: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('employees.store'), {
            onSuccess: () => reset(),
        });
    };

    // Generate next employee ID suggestion
    const generateEmployeeId = () => {
        const nextNum = Math.floor(Math.random() * 9000) + 1000; // Random 4-digit number
        return `EMP${nextNum}`;
    };

    const departments = [
        'IT',
        'Training',
        'Finance',
        'Operations',
        'HR',
        'Marketing',
        'Support'
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        ➕ Add New Employee
                    </h2>
                    <Link
                        href={route('employees.index')}
                        className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                    >
                        ⬅️ Back to Employees
                    </Link>
                </div>
            }
        >
            <Head title="Add Employee" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                    Employee Information
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Add a new employee to the system. All fields marked with * are required.
                                </p>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Employee ID */}
                                    <div>
                                        <InputLabel htmlFor="employee_id" value="Employee ID *" />
                                        <div className="mt-1 flex">
                                            <TextInput
                                                id="employee_id"
                                                name="employee_id"
                                                value={data.employee_id}
                                                className="flex-1"
                                                isFocused={true}
                                                onChange={(e) => setData('employee_id', e.target.value)}
                                                placeholder="e.g., EMP001"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setData('employee_id', generateEmployeeId())}
                                                className="ml-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors duration-200"
                                            >
                                                🎲 Generate
                                            </button>
                                        </div>
                                        <InputError message={errors.employee_id} className="mt-2" />
                                    </div>

                                    {/* Role */}
                                    <div>
                                        <InputLabel htmlFor="role_id" value="Role *" />
                                        <select
                                            id="role_id"
                                            name="role_id"
                                            value={data.role_id}
                                            onChange={(e) => setData('role_id', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        >
                                            <option value="">Select a role</option>
                                            {roles.map(role => (
                                                <option key={role.id} value={role.id}>
                                                    {role.display_name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.role_id} className="mt-2" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* First Name */}
                                    <div>
                                        <InputLabel htmlFor="first_name" value="First Name *" />
                                        <TextInput
                                            id="first_name"
                                            name="first_name"
                                            value={data.first_name}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('first_name', e.target.value)}
                                            placeholder="Enter first name"
                                        />
                                        <InputError message={errors.first_name} className="mt-2" />
                                    </div>

                                    {/* Last Name */}
                                    <div>
                                        <InputLabel htmlFor="last_name" value="Last Name *" />
                                        <TextInput
                                            id="last_name"
                                            name="last_name"
                                            value={data.last_name}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('last_name', e.target.value)}
                                            placeholder="Enter last name"
                                        />
                                        <InputError message={errors.last_name} className="mt-2" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Email */}
                                    <div>
                                        <InputLabel htmlFor="email" value="Email Address *" />
                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="employee@pmec.com"
                                        />
                                        <InputError message={errors.email} className="mt-2" />
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <InputLabel htmlFor="phone" value="Phone Number" />
                                        <TextInput
                                            id="phone"
                                            name="phone"
                                            value={data.phone}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder="+966501234567"
                                        />
                                        <InputError message={errors.phone} className="mt-2" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Position */}
                                    <div>
                                        <InputLabel htmlFor="position" value="Position/Job Title" />
                                        <TextInput
                                            id="position"
                                            name="position"
                                            value={data.position}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('position', e.target.value)}
                                            placeholder="e.g., Senior Trainer"
                                        />
                                        <InputError message={errors.position} className="mt-2" />
                                    </div>

                                    {/* Department */}
                                    <div>
                                        <InputLabel htmlFor="department" value="Department" />
                                        <select
                                            id="department"
                                            name="department"
                                            value={data.department}
                                            onChange={(e) => setData('department', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        >
                                            <option value="">Select department</option>
                                            {departments.map(dept => (
                                                <option key={dept} value={dept}>
                                                    {dept}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.department} className="mt-2" />
                                    </div>
                                </div>

                                {/* Bio */}
                                <div>
                                    <InputLabel htmlFor="bio" value="Bio/Description" />
                                    <textarea
                                        id="bio"
                                        name="bio"
                                        value={data.bio}
                                        onChange={(e) => setData('bio', e.target.value)}
                                        rows={4}
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        placeholder="Brief description of the employee's background and expertise..."
                                    />
                                    <InputError message={errors.bio} className="mt-2" />
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <Link
                                        href={route('employees.index')}
                                        className="inline-flex items-center px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 text-sm font-medium rounded-lg transition-colors duration-200"
                                    >
                                        ❌ Cancel
                                    </Link>
                                    
                                    <PrimaryButton 
                                        className="inline-flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700" 
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                ✅ Create Employee
                                            </>
                                        )}
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

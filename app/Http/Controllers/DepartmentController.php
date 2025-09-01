<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class DepartmentController extends Controller
{
    /**
     * Display a listing of departments.
     */
    public function index()
    {
        $departments = Department::with(['manager', 'employees'])
            ->withCount('employees')
            ->ordered()
            ->get();

        $stats = [
            'total_departments' => Department::count(),
            'active_departments' => Department::active()->count(),
            'total_employees' => Employee::count(),
            'departments_with_managers' => Department::whereNotNull('manager_id')->count(),
        ];

        return Inertia::render('DepartmentManagement/Index', [
            'departments' => $departments,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new department.
     */
    public function create()
    {
        $employees = Employee::active()->orderBy('first_name')->get();
        
        return Inertia::render('DepartmentManagement/Create', [
            'employees' => $employees,
        ]);
    }

    /**
     * Store a newly created department in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:departments',
            'description' => 'nullable|string',
            'code' => 'nullable|string|max:10|unique:departments',
            'manager_id' => 'nullable|exists:employees,id',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
            'budget' => 'nullable|numeric|min:0',
            'location' => 'nullable|string|max:255',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:20',
        ]);

        Department::create($validated);

        return redirect()->route('departments.index')
            ->with('success', 'Department created successfully.');
    }

    /**
     * Display the specified department.
     */
    public function show(Department $department)
    {
        $department->load(['manager', 'employees']);
        
        return Inertia::render('DepartmentManagement/Show', [
            'department' => $department,
        ]);
    }

    /**
     * Show the form for editing the specified department.
     */
    public function edit(Department $department)
    {
        $employees = Employee::active()->orderBy('first_name')->get();
        
        return Inertia::render('DepartmentManagement/Edit', [
            'department' => $department,
            'employees' => $employees,
        ]);
    }

    /**
     * Update the specified department in storage.
     */
    public function update(Request $request, Department $department)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('departments')->ignore($department->id)],
            'description' => 'nullable|string',
            'code' => ['nullable', 'string', 'max:10', Rule::unique('departments')->ignore($department->id)],
            'manager_id' => 'nullable|exists:employees,id',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
            'budget' => 'nullable|numeric|min:0',
            'location' => 'nullable|string|max:255',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:20',
        ]);

        $department->update($validated);

        return redirect()->route('departments.index')
            ->with('success', 'Department updated successfully.');
    }

    /**
     * Remove the specified department from storage.
     */
    public function destroy(Department $department)
    {
        // Check if department has employees
        if ($department->employees()->count() > 0) {
            return back()->with('error', 'Cannot delete department with assigned employees.');
        }

        $department->delete();

        return redirect()->route('departments.index')
            ->with('success', 'Department deleted successfully.');
    }

    /**
     * Toggle department active status.
     */
    public function toggleStatus(Department $department)
    {
        $department->update(['is_active' => !$department->is_active]);

        $status = $department->is_active ? 'activated' : 'deactivated';
        
        return back()->with('success', "Department {$status} successfully.");
    }

    /**
     * Get departments for API/select dropdowns.
     */
    public function api()
    {
        $departments = Department::active()
            ->ordered()
            ->select('id', 'name', 'code')
            ->get();

        return response()->json(['data' => $departments]);
    }
}

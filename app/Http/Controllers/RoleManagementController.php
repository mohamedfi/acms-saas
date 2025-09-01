<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class RoleManagementController extends Controller
{
    /**
     * Display a listing of roles.
     */
    public function index()
    {
        $roles = Role::withCount('employees')
            ->with(['employees' => function ($query) {
                $query->select('id', 'first_name', 'last_name', 'employee_id');
            }])
            ->ordered()
            ->get();

        $stats = [
            'total_roles' => Role::count(),
            'active_roles' => Role::active()->count(),
            'total_employees' => Employee::count(),
            'roles_with_employees' => Role::whereHas('employees')->count(),
        ];

        return Inertia::render('RoleManagement/Index', [
            'roles' => $roles,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new role.
     */
    public function create()
    {
        $employees = \App\Models\Employee::active()
            ->select('id', 'employee_id', 'first_name', 'last_name', 'position')
            ->orderBy('first_name')
            ->get()
            ->map(function ($employee) {
                return [
                    'id' => $employee->id,
                    'label' => $employee->employee_id . ' - ' . $employee->first_name . ' ' . $employee->last_name . ' (' . $employee->position . ')',
                    'value' => $employee->id,
                ];
            });

        return Inertia::render('RoleManagement/Create', [
            'employees' => $employees,
        ]);
    }

    /**
     * Store a newly created role in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles',
            'display_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'permissions' => 'nullable|array',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
            'color' => 'nullable|string|max:20',
            'icon' => 'nullable|string|max:50',
            'access_level' => 'integer|min:1|max:10',
            'assigned_employees' => 'nullable|array',
            'assigned_employees.*' => 'exists:employees,id',
        ]);

        // Create the role
        $role = Role::create($validated);

        // Assign employees to this role
        if (!empty($validated['assigned_employees'])) {
            \App\Models\Employee::whereIn('id', $validated['assigned_employees'])
                ->update(['role_id' => $role->id]);
        }

        return redirect()->route('role-management.index')
            ->with('success', 'Role created successfully with ' . count($validated['assigned_employees'] ?? []) . ' employee(s) assigned.');
    }

    /**
     * Display the specified role.
     */
    public function show(Role $role)
    {
        $role->load('employees');

        return Inertia::render('RoleManagement/Show', [
            'role' => $role,
        ]);
    }

    /**
     * Show the form for editing the specified role.
     */
    public function edit(Role $role)
    {
        $role->load('employees');

        $employees = \App\Models\Employee::active()
            ->select('id', 'employee_id', 'first_name', 'last_name', 'position')
            ->orderBy('first_name')
            ->get()
            ->map(function ($employee) {
                return [
                    'id' => $employee->id,
                    'label' => $employee->employee_id . ' - ' . $employee->first_name . ' ' . $employee->last_name . ' (' . $employee->position . ')',
                    'value' => $employee->id,
                ];
            });

        return Inertia::render('RoleManagement/Edit', [
            'role' => $role,
            'employees' => $employees,
        ]);
    }

    /**
     * Update the specified role in storage.
     */
    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('roles')->ignore($role->id)],
            'display_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'permissions' => 'nullable|array',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
            'color' => 'nullable|string|max:20',
            'icon' => 'nullable|string|max:50',
            'access_level' => 'integer|min:1|max:10',
            'assigned_employees' => 'nullable|array',
            'assigned_employees.*' => 'exists:employees,id',
        ]);

        $role->update($validated);

        // Handle employee assignments
        if (isset($validated['assigned_employees'])) {
            // Remove all current employee assignments for this role
            \App\Models\Employee::where('role_id', $role->id)->update(['role_id' => null]);

            // Assign new employees to this role
            if (!empty($validated['assigned_employees'])) {
                \App\Models\Employee::whereIn('id', $validated['assigned_employees'])
                    ->update(['role_id' => $role->id]);
            }
        }

        return redirect()->route('role-management.index')
            ->with('success', 'Role updated successfully with ' . count($validated['assigned_employees'] ?? []) . ' employee(s) assigned.');
    }

    /**
     * Remove the specified role from storage.
     */
    public function destroy(Role $role)
    {
        // Check if role has employees
        if ($role->employees()->count() > 0) {
            return back()->with('error', 'Cannot delete role with assigned employees.');
        }

        $role->delete();

        return redirect()->route('role-management.index')
            ->with('success', 'Role deleted successfully.');
    }

    /**
     * Toggle role active status.
     */
    public function toggleStatus(Role $role)
    {
        $role->update(['is_active' => !$role->is_active]);

        $status = $role->is_active ? 'activated' : 'deactivated';

        return back()->with('success', "Role {$status} successfully.");
    }

    /**
     * Get roles for API/select dropdowns.
     */
    public function api()
    {
        $roles = Role::active()
            ->ordered()
            ->select('id', 'name', 'display_name')
            ->get();

        return response()->json(['data' => $roles]);
    }
}

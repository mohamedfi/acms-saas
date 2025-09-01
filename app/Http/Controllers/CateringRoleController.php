<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\CateringRole;
use Illuminate\Validation\Rule;

class CateringRoleController extends Controller
{
    public function index()
    {
        $roles = CateringRole::ordered()->get();

        return Inertia::render('Catering/Roles/Index', [
            'roles' => $roles,
        ]);
    }

    public function create()
    {
        return Inertia::render('Catering/Roles/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:catering_roles',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:10',
            'hierarchy_level' => 'required|integer|min:1|max:10',
            'is_active' => 'boolean',
            'required_skills' => 'nullable|array',
            'required_skills.*' => 'string|max:100',
        ]);

        CateringRole::create($validated);

        return redirect()->route('catering.roles.index')->with('success', 'Role created successfully!');
    }

    public function edit(CateringRole $role)
    {
        return Inertia::render('Catering/Roles/Edit', [
            'role' => $role,
        ]);
    }

    public function update(Request $request, CateringRole $role)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => ['required', 'string', 'max:255', Rule::unique('catering_roles')->ignore($role->id)],
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:10',
            'hierarchy_level' => 'required|integer|min:1|max:10',
            'is_active' => 'boolean',
            'required_skills' => 'nullable|array',
            'required_skills.*' => 'string|max:100',
        ]);

        $role->update($validated);

        return redirect()->route('catering.roles.index')->with('success', 'Role updated successfully!');
    }

    public function destroy(CateringRole $role)
    {
        // Check if role is being used
        if ($role->employeeAssignments()->count() > 0) {
            return redirect()->route('catering.roles.index')->with('error', 'Cannot delete role that is assigned to employees.');
        }

        $role->delete();

        return redirect()->route('catering.roles.index')->with('success', 'Role deleted successfully!');
    }

    public function toggleStatus(CateringRole $role)
    {
        $role->update(['is_active' => !$role->is_active]);

        $status = $role->is_active ? 'enabled' : 'disabled';
        return redirect()->route('catering.roles.index')->with('success', "Role {$status} successfully!");
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    /**
     * Display the user management dashboard
     */
    public function index()
    {
        $stats = [
            'total_users' => User::count(),
            'active_users' => User::where('is_active', true)->count(),
            'total_roles' => Role::count(),
            'admin_users' => User::whereHas('role', function ($query) {
                $query->where('name', 'admin');
            })->count(),
        ];

        $recentUsers = User::with('role')
            ->latest()
            ->take(5)
            ->get();

        $usersByRole = User::select('role_id', \Illuminate\Support\Facades\DB::raw('count(*) as count'))
            ->with('role:id,name,display_name')
            ->groupBy('role_id')
            ->get();

        return Inertia::render('UserManagement/Index', [
            'stats' => $stats,
            'recentUsers' => $recentUsers,
            'usersByRole' => $usersByRole,
        ]);
    }

    /**
     * Display all users
     */
    public function users()
    {
        $users = User::with(['role', 'employee'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        $roles = Role::active()->get();
        $employees = Employee::active()->orderBy('first_name')->get(['id', 'first_name', 'last_name', 'position']);

        return Inertia::render('UserManagement/Users', [
            'users' => $users,
            'roles' => $roles,
            'employees' => $employees,
        ]);
    }

    /**
     * Display all roles
     */
    public function roles()
    {
        $roles = Role::withCount('users')
            ->withCount('employees')
            ->ordered()
            ->paginate(20);

        return Inertia::render('UserManagement/Roles', [
            'roles' => $roles,
        ]);
    }

    /**
     * Show the form for creating a new user
     */
    public function createUser()
    {
        $roles = Role::active()->get();
        $employees = Employee::active()->orderBy('first_name')->get(['id', 'first_name', 'last_name', 'position']);

        return Inertia::render('UserManagement/CreateUser', [
            'roles' => $roles,
            'employees' => $employees,
        ]);
    }

    /**
     * Store a newly created user
     */
    public function storeUser(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role_id' => 'required|exists:roles,id',
            'phone' => 'nullable|string|max:20',
            'employee_id' => 'nullable|exists:employees,id',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role_id' => $validated['role_id'],
            'phone' => $validated['phone'],
            'employee_id' => $validated['employee_id'],
        ]);

        return redirect()->route('user-management.users')
            ->with('success', 'User created successfully!');
    }

    /**
     * Show the form for editing a user
     */
    public function editUser(User $user)
    {
        $roles = Role::active()->get();
        $employees = Employee::active()->orderBy('first_name')->get(['id', 'first_name', 'last_name', 'position']);

        return Inertia::render('UserManagement/EditUser', [
            'user' => $user->load(['role', 'employee']),
            'roles' => $roles,
            'employees' => $employees,
        ]);
    }

    /**
     * Update the specified user
     */
    public function updateUser(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role_id' => 'required|exists:roles,id',
            'phone' => 'nullable|string|max:20',
            'employee_id' => 'nullable|exists:employees,id',
            'is_active' => 'boolean',
        ]);

        $user->update($validated);

        return redirect()->route('user-management.users')
            ->with('success', 'User updated successfully!');
    }

    /**
     * Remove the specified user
     */
    public function destroyUser(User $user)
    {
        // Don't allow admin to delete themselves
        if ($user->id === auth()->id()) {
            return redirect()->route('user-management.users')
                ->with('error', 'You cannot delete your own account!');
        }

        $user->delete();

        return redirect()->route('user-management.users')
            ->with('success', 'User deleted successfully!');
    }

    /**
     * Show the form for creating a new role
     */
    public function createRole()
    {
        return Inertia::render('UserManagement/CreateRole');
    }

    /**
     * Store a newly created role
     */
    public function storeRole(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles',
            'display_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'permissions' => 'array',
            'is_active' => 'boolean',
        ]);

        Role::create($validated);

        return redirect()->route('user-management.roles')
            ->with('success', 'Role created successfully!');
    }

    /**
     * Show the form for editing a role
     */
    public function editRole(Role $role)
    {
        return Inertia::render('UserManagement/EditRole', [
            'role' => $role,
        ]);
    }

    /**
     * Update the specified role
     */
    public function updateRole(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
            'display_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'permissions' => 'array',
            'is_active' => 'boolean',
        ]);

        $role->update($validated);

        return redirect()->route('user-management.roles')
            ->with('success', 'Role updated successfully!');
    }

    /**
     * Remove the specified role
     */
    public function destroyRole(Role $role)
    {
        // Don't allow deletion of admin role
        if ($role->name === 'admin') {
            return redirect()->route('user-management.roles')
                ->with('error', 'Admin role cannot be deleted!');
        }

        // Check if role is in use
        if ($role->users()->count() > 0 || $role->employees()->count() > 0) {
            return redirect()->route('user-management.roles')
                ->with('error', 'Cannot delete role that is assigned to users or employees!');
        }

        $role->delete();

        return redirect()->route('user-management.roles')
            ->with('success', 'Role deleted successfully!');
    }

    /**
     * Change user password
     */
    public function changePassword(Request $request, User $user)
    {
        $validated = $request->validate([
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->route('user-management.users')
            ->with('success', 'Password changed successfully!');
    }

    /**
     * Toggle user active status
     */
    public function toggleStatus(User $user)
    {
        $user->update(['is_active' => !$user->is_active]);

        $status = $user->is_active ? 'activated' : 'deactivated';
        return redirect()->route('user-management.users')
            ->with('success', "User {$status} successfully!");
    }
}

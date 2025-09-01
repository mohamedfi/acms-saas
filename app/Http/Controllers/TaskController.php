<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Employee;
use App\Models\ArchivedCourse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Task::with(['assignedTo', 'assignedBy', 'course']);

        // Apply filters
        if ($request->filled('assigned_to')) {
            $query->where('assigned_to', $request->assigned_to);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->filled('task_type')) {
            $query->where('task_type', $request->task_type);
        }

        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', "%{$searchTerm}%")
                    ->orWhere('description', 'like', "%{$searchTerm}%");
            });
        }

        $tasks = $query->orderBy('created_at', 'desc')->get();

        // Get filter options
        $employees = Employee::with('role')->where('is_active', true)->get();
        $courses = ArchivedCourse::select('id', 'course_name')->get();

        return Inertia::render('Tasks/Index', [
            'tasks' => $tasks,
            'employees' => $employees,
            'courses' => $courses,
            'filters' => $request->only(['assigned_to', 'status', 'priority', 'task_type', 'search']) ?: [],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $employees = Employee::with('role')->where('is_active', true)->get();
        $courses = ArchivedCourse::select('id', 'course_name')->get();

        return Inertia::render('Tasks/Create', [
            'employees' => $employees,
            'courses' => $courses,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'assigned_to' => 'required|exists:employees,id',
            'assigned_by' => 'nullable|exists:employees,id',
            'priority' => 'required|in:low,normal,high',
            'status' => 'required|in:pending,in_progress,completed,cancelled,done,blocked',
            'due_date' => 'required|date|after_or_equal:today',
            'task_type' => 'required|string',
            'course_id' => 'nullable|exists:archived_courses,id',
            'notes' => 'nullable|string',
        ]);

        Task::create($validated);

        return redirect()->route('tasks.index')
            ->with('success', 'Task created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

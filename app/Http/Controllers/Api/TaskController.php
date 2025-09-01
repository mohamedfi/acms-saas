<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
use Carbon\Carbon;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Task::with(['courseInstance.course', 'assignedUser']);

        // Filter by course instance
        if ($request->has('instance_id')) {
            $query->where('course_instance_id', $request->instance_id);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by assigned user or role
        $user = $request->user();
        if (!$user->isAdmin()) {
            $query->where(function ($q) use ($user) {
                $q->where('assigned_user_id', $user->id)
                    ->orWhere('assigned_role', $user->role->name);
            });
        }

        // Order by due date (overdue first)
        $query->orderByRaw('CASE WHEN due_date < ? AND status != "done" THEN 0 ELSE 1 END, due_date ASC', [Carbon::now()]);

        $tasks = $query->paginate(15);

        return response()->json($tasks);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_instance_id' => 'nullable|exists:course_instances,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'required|date',
            'assigned_user_id' => 'nullable|exists:users,id',
            'assigned_role' => 'nullable|in:admin,coordinator,trainer,finance',
            'priority' => 'required|in:low,normal,high',
        ]);

        $validated['status'] = 'pending';

        $task = Task::create($validated);

        return response()->json($task->load(['courseInstance.course', 'assignedUser']), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        return response()->json($task->load(['courseInstance.course', 'assignedUser']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'course_instance_id' => 'nullable|exists:course_instances,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'required|date',
            'assigned_user_id' => 'nullable|exists:users,id',
            'assigned_role' => 'nullable|in:admin,coordinator,trainer,finance',
            'priority' => 'required|in:low,normal,high',
            'status' => 'required|in:pending,in_progress,done,blocked',
        ]);

        $task->update($validated);

        return response()->json($task->load(['courseInstance.course', 'assignedUser']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $task->delete();

        return response()->json(['message' => 'Task deleted successfully'], 204);
    }

    /**
     * Mark task as complete
     */
    public function complete(Task $task)
    {
        $task->update(['status' => 'done']);

        return response()->json($task->load(['courseInstance.course', 'assignedUser']));
    }

    /**
     * Get overdue tasks
     */
    public function overdue(Request $request)
    {
        $query = Task::with(['courseInstance.course', 'assignedUser'])
            ->where('due_date', '<', Carbon::now())
            ->where('status', '!=', 'done');

        $user = $request->user();
        if (!$user->isAdmin()) {
            $query->where(function ($q) use ($user) {
                $q->where('assigned_user_id', $user->id)
                    ->orWhere('assigned_role', $user->role->name);
            });
        }

        $tasks = $query->orderBy('due_date')->get();

        return response()->json($tasks);
    }

    /**
     * Get today's tasks
     */
    public function today(Request $request)
    {
        $query = Task::with(['courseInstance.course', 'assignedUser'])
            ->whereDate('due_date', Carbon::today())
            ->where('status', '!=', 'done');

        $user = $request->user();
        if (!$user->isAdmin()) {
            $query->where(function ($q) use ($user) {
                $q->where('assigned_user_id', $user->id)
                    ->orWhere('assigned_role', $user->role->name);
            });
        }

        $tasks = $query->orderBy('due_date')->get();

        return response()->json($tasks);
    }
}

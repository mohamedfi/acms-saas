<?php

namespace App\Http\Controllers;

use App\Models\MessageTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class MessageTemplateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $templates = MessageTemplate::with(['creator', 'updater'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('MessageTemplates/Index', [
            'templates' => $templates,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('MessageTemplates/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:message_templates',
            'description' => 'nullable|string',
            'subject' => 'nullable|string|max:255',
            'content' => 'required|string',
            'channel' => 'required|in:email,sms,whatsapp,all',
            'category' => 'required|in:course,task,announcement,reminder,welcome,confirmation',
            'variables' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $validated['created_by'] = Auth::id();
        $validated['updated_by'] = Auth::id();
        $validated['is_active'] = $validated['is_active'] ?? true;

        MessageTemplate::create($validated);

        return redirect()->route('message-templates.index')
            ->with('success', 'Message template created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(MessageTemplate $messageTemplate)
    {
        $messageTemplate->load(['creator', 'updater', 'messages']);
        
        return Inertia::render('MessageTemplates/Show', [
            'template' => $messageTemplate,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MessageTemplate $messageTemplate)
    {
        return Inertia::render('MessageTemplates/Edit', [
            'template' => $messageTemplate,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MessageTemplate $messageTemplate)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:message_templates,name,' . $messageTemplate->id,
            'description' => 'nullable|string',
            'subject' => 'nullable|string|max:255',
            'content' => 'required|string',
            'channel' => 'required|in:email,sms,whatsapp,all',
            'category' => 'required|in:course,task,announcement,reminder,welcome,confirmation',
            'variables' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $validated['updated_by'] = Auth::id();

        $messageTemplate->update($validated);

        return redirect()->route('message-templates.index')
            ->with('success', 'Message template updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MessageTemplate $messageTemplate)
    {
        // Check if template is being used by any messages
        if ($messageTemplate->messages()->count() > 0) {
            return back()->withErrors(['error' => 'Cannot delete template that is being used by messages.']);
        }

        $messageTemplate->delete();

        return redirect()->route('message-templates.index')
            ->with('success', 'Message template deleted successfully.');
    }

    /**
     * Toggle template active status
     */
    public function toggleStatus(MessageTemplate $messageTemplate)
    {
        $messageTemplate->update([
            'is_active' => !$messageTemplate->is_active,
            'updated_by' => Auth::id(),
        ]);

        $status = $messageTemplate->is_active ? 'activated' : 'deactivated';
        
        return back()->with('success', "Message template {$status} successfully.");
    }
}

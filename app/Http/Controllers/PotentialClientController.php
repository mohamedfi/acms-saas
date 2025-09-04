<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\PotentialClient;

class PotentialClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get('search', '');
        $status = $request->get('status', 'all');
        $source = $request->get('source', 'all');
        $sortBy = $request->get('sort', 'created_at');
        $sortOrder = $request->get('order', 'desc');

        $query = PotentialClient::query();

        // Apply search filter
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('company', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Apply status filter
        if ($status !== 'all') {
            $query->where('status', $status);
        }

        // Apply source filter
        if ($source !== 'all') {
            $query->where('source', $source);
        }

        // Apply sorting
        $query->orderBy($sortBy, $sortOrder);

        $potentialClients = $query->paginate(15);

        // Get statistics
        $stats = [
            'total' => PotentialClient::count(),
            'new' => PotentialClient::where('status', 'new')->count(),
            'contacted' => PotentialClient::where('status', 'contacted')->count(),
            'qualified' => PotentialClient::where('status', 'qualified')->count(),
            'overdue_follow_ups' => PotentialClient::overdueFollowUps()->count(),
            'total_estimated_value' => PotentialClient::sum('estimated_value'),
        ];

        return Inertia::render('PotentialClients/Index', [
            'potentialClients' => $potentialClients,
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'source' => $source,
                'sort' => $sortBy,
                'order' => $sortOrder,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('PotentialClients/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
            'position' => 'nullable|string|max:255',
            'industry' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'status' => 'required|in:new,contacted,qualified,proposal_sent,negotiating,closed_won,closed_lost',
            'source' => 'required|in:website,referral,social_media,cold_call,email_campaign,event,other',
            'estimated_value' => 'nullable|numeric|min:0',
            'last_contact_date' => 'nullable|date',
            'next_follow_up' => 'nullable|date',
            'assigned_to' => 'nullable|string|max:255',
        ]);

        PotentialClient::create($request->all());

        return redirect()->route('potential-clients.index')
            ->with('success', 'Potential client created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(PotentialClient $potentialClient)
    {
        return Inertia::render('PotentialClients/Show', [
            'potentialClient' => $potentialClient,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PotentialClient $potentialClient)
    {
        return Inertia::render('PotentialClients/Edit', [
            'potentialClient' => $potentialClient,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PotentialClient $potentialClient)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
            'position' => 'nullable|string|max:255',
            'industry' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'status' => 'required|in:new,contacted,qualified,proposal_sent,negotiating,closed_won,closed_lost',
            'source' => 'required|in:website,referral,social_media,cold_call,email_campaign,event,other',
            'estimated_value' => 'nullable|numeric|min:0',
            'last_contact_date' => 'nullable|date',
            'next_follow_up' => 'nullable|date',
            'assigned_to' => 'nullable|string|max:255',
        ]);

        $potentialClient->update($request->all());

        return redirect()->route('potential-clients.index')
            ->with('success', 'Potential client updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PotentialClient $potentialClient)
    {
        $potentialClient->delete();

        return redirect()->route('potential-clients.index')
            ->with('success', 'Potential client deleted successfully.');
    }

    /**
     * Convert potential client to actual client
     */
    public function convert(Request $request, PotentialClient $potentialClient)
    {
        $request->validate([
            'client_type' => 'required|in:participant,company,user',
        ]);

        // Here you would create the actual client based on the type
        // For now, we'll just mark the potential client as converted
        $potentialClient->update(['status' => 'closed_won']);

        return redirect()->route('potential-clients.index')
            ->with('success', 'Potential client converted successfully.');
    }
}

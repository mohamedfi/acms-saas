<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Participant;
use App\Models\RentalCompany;
use App\Models\CompanyVehicle;
use Illuminate\Support\Facades\DB;

class UnifiedClientController extends Controller
{
    /**
     * Display unified client dashboard
     */
    public function index(Request $request)
    {
        $search = $request->get('search', '');
        $type = $request->get('type', 'all');
        $status = $request->get('status', 'all');
        $sortBy = $request->get('sort', 'created_at');
        $sortOrder = $request->get('order', 'desc');

        // Get all client types with unified data structure
        $clients = collect();

        // Participants (Training Clients)
        if ($type === 'all' || $type === 'participants') {
            $participants = Participant::with(['courses'])
                ->when($search, function ($query, $search) {
                    $query->where(function ($q) use ($search) {
                        $q->where('full_name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%")
                            ->orWhere('organization', 'like', "%{$search}%");
                    });
                })
                ->when($status !== 'all', function ($query, $status) {
                    // Participants don't have a status column, so we'll consider all as active
                    // You can modify this logic based on your business requirements
                    if ($status === 'inactive') {
                        $query->whereRaw('1 = 0'); // No inactive participants
                    }
                    // For 'active' status, we don't need to filter as all participants are active
                })
                ->get()
                ->map(function ($participant) {
                    return [
                        'id' => $participant->id,
                        'type' => 'participant',
                        'name' => $participant->full_name,
                        'email' => $participant->email,
                        'phone' => $participant->phone,
                        'company' => $participant->organization,
                        'status' => 'active', // All participants are considered active
                        'created_at' => $participant->created_at,
                        'updated_at' => $participant->updated_at,
                        'nationality' => $participant->nationality,
                        'country' => null, // Participants table doesn't have country column
                        'courses_count' => $participant->courses->count(),
                        'last_activity' => $participant->updated_at,
                        'revenue' => 0,
                        'priority' => $this->calculatePriority($participant),
                        'tags' => ['Training', 'Course Participant'],
                    ];
                });

            $clients = $clients->merge($participants);
        }

        // Rental Companies (Transportation Clients)
        if ($type === 'all' || $type === 'companies') {
            $companies = RentalCompany::with(['vehicles'])
                ->when($search, function ($query, $search) {
                    $query->where(function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%")
                            ->orWhere('primary_phone', 'like', "%{$search}%")
                            ->orWhere('contact_person', 'like', "%{$search}%");
                    });
                })
                ->when($status !== 'all', function ($query, $status) {
                    if ($status === 'active') {
                        $query->where('is_active', true);
                    } elseif ($status === 'inactive') {
                        $query->where('is_active', false);
                    } elseif ($status === 'verified') {
                        $query->where('is_verified', true);
                    } elseif ($status === 'featured') {
                        $query->where('is_featured', true);
                    }
                })
                ->get()
                ->map(function ($company) {
                    $totalRevenue = $company->vehicles->sum('revenue_to_date');
                    return [
                        'id' => $company->id,
                        'type' => 'company',
                        'name' => $company->name,
                        'email' => $company->email,
                        'phone' => $company->primary_phone,
                        'company' => $company->name,
                        'status' => $company->is_active ? 'active' : 'inactive',
                        'created_at' => $company->created_at,
                        'updated_at' => $company->updated_at,
                        'nationality' => null,
                        'country' => $company->country,
                        'courses_count' => 0,
                        'vehicles_count' => $company->vehicles->count(),
                        'last_activity' => $company->updated_at,
                        'revenue' => $totalRevenue,
                        'priority' => $this->calculateCompanyPriority($company),
                        'tags' => ['Transportation', 'Rental Company'],
                        'is_verified' => $company->is_verified,
                        'is_featured' => $company->is_featured,
                        'rating' => $company->rating,
                    ];
                });

            $clients = $clients->merge($companies);
        }

        // System Users (Internal Clients)
        if ($type === 'all' || $type === 'users') {
            $users = User::when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
                ->when($status !== 'all', function ($query, $status) {
                    if ($status === 'active') {
                        $query->where('is_active', true);
                    } elseif ($status === 'inactive') {
                        $query->where('is_active', false);
                    }
                })
                ->get()
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'type' => 'user',
                        'name' => $user->name,
                        'email' => $user->email,
                        'phone' => null,
                        'company' => 'ACMS-SaaS',
                        'status' => $user->is_active ? 'active' : 'inactive',
                        'created_at' => $user->created_at,
                        'updated_at' => $user->updated_at,
                        'nationality' => null,
                        'country' => null,
                        'courses_count' => 0,
                        'vehicles_count' => 0,
                        'last_activity' => $user->updated_at,
                        'revenue' => 0,
                        'priority' => $this->calculateUserPriority($user),
                        'tags' => ['System User', 'Internal'],
                        'role' => $user->role ?? 'user',
                    ];
                });

            $clients = $clients->merge($users);
        }

        // Sort clients
        $clients = $clients->sortBy([
            [$sortBy, $sortOrder]
        ]);

        // Calculate statistics
        $stats = [
            'total_clients' => $clients->count(),
            'participants' => $clients->where('type', 'participant')->count(),
            'companies' => $clients->where('type', 'company')->count(),
            'users' => $clients->where('type', 'user')->count(),
            'active_clients' => $clients->where('status', 'active')->count(),
            'total_revenue' => $clients->sum('revenue'),
            'high_priority' => $clients->where('priority', 'high')->count(),
            'new_this_month' => $clients->where('created_at', '>=', now()->startOfMonth())->count(),
        ];

        // Get recent activities
        $recentActivities = $this->getRecentActivities();

        return Inertia::render('Clients/Index', [
            'clients' => $clients->values(),
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'type' => $type,
                'status' => $status,
                'sort' => $sortBy,
                'order' => $sortOrder,
            ],
            'recentActivities' => $recentActivities,
        ]);
    }

    /**
     * Show individual client details
     */
    public function show($type, $id)
    {
        $client = null;
        $relatedData = [];

        switch ($type) {
            case 'participant':
                $client = Participant::with(['courses'])->findOrFail($id);
                $relatedData = [
                    'courses' => $client->courses,
                    'enrollments' => $client->courses->count(),
                ];
                break;

            case 'company':
                $client = RentalCompany::with(['vehicles'])->findOrFail($id);
                $relatedData = [
                    'vehicles' => $client->vehicles,
                    'total_vehicles' => $client->vehicles->count(),
                    'total_revenue' => $client->vehicles->sum('revenue_to_date'),
                ];
                break;

            case 'user':
                $client = User::findOrFail($id);
                $relatedData = [
                    'role' => $client->role ?? 'user',
                    'permissions' => [],
                ];
                break;
        }

        return Inertia::render('Clients/Show', [
            'client' => $client,
            'clientType' => $type,
            'relatedData' => $relatedData,
        ]);
    }

    /**
     * Calculate client priority based on various factors
     */
    private function calculatePriority($participant)
    {
        $priority = 'medium';

        if ($participant->courses->count() > 3) {
            $priority = 'high';
        } elseif ($participant->courses->count() === 0) {
            $priority = 'low';
        }

        return $priority;
    }

    /**
     * Calculate company priority based on various factors
     */
    private function calculateCompanyPriority($company)
    {
        $priority = 'medium';

        if ($company->is_featured || $company->rating >= 4.5) {
            $priority = 'high';
        } elseif ($company->vehicles->count() === 0 || $company->rating < 3.0) {
            $priority = 'low';
        }

        return $priority;
    }

    /**
     * Calculate user priority based on role
     */
    private function calculateUserPriority($user)
    {
        $priority = 'medium';

        if (in_array($user->role ?? 'user', ['admin', 'super_admin'])) {
            $priority = 'high';
        } elseif (in_array($user->role ?? 'user', ['guest', 'viewer'])) {
            $priority = 'low';
        }

        return $priority;
    }

    /**
     * Get recent activities across all client types
     */
    private function getRecentActivities()
    {
        $activities = collect();

        // Recent participants
        $recentParticipants = Participant::latest()->limit(3)->get();
        foreach ($recentParticipants as $participant) {
            $activities->push([
                'type' => 'participant_created',
                'message' => "New participant registered: {$participant->name}",
                'time' => $participant->created_at,
                'client_type' => 'participant',
                'client_id' => $participant->id,
            ]);
        }

        // Recent companies
        $recentCompanies = RentalCompany::latest()->limit(3)->get();
        foreach ($recentCompanies as $company) {
            $activities->push([
                'type' => 'company_created',
                'message' => "New rental company registered: {$company->name}",
                'time' => $company->created_at,
                'client_type' => 'company',
                'client_id' => $company->id,
            ]);
        }

        return $activities->sortByDesc('time')->take(10)->values();
    }

    /**
     * Export clients data
     */
    public function export(Request $request)
    {
        $format = $request->get('format', 'csv');
        $type = $request->get('type', 'all');
        $status = $request->get('status', 'all');

        // Get the same data as the index method
        $clients = collect();

        // Participants
        if ($type === 'all' || $type === 'participants') {
            $participants = Participant::with(['courses'])
                ->when($status !== 'all', function ($query, $status) {
                    // Participants don't have a status column, so we'll consider all as active
                    if ($status === 'inactive') {
                        $query->whereRaw('1 = 0'); // No inactive participants
                    }
                })
                ->get()
                ->map(function ($participant) {
                    return [
                        'id' => $participant->id,
                        'type' => 'Participant',
                        'name' => $participant->full_name,
                        'email' => $participant->email,
                        'phone' => $participant->phone,
                        'company' => $participant->organization,
                        'status' => 'active',
                        'created_at' => $participant->created_at->format('Y-m-d H:i:s'),
                        'courses_count' => $participant->courses->count(),
                        'nationality' => $participant->nationality,
                        'country' => null, // Participants table doesn't have country column
                    ];
                });
            $clients = $clients->merge($participants);
        }

        // Companies
        if ($type === 'all' || $type === 'companies') {
            $companies = RentalCompany::with(['vehicles'])
                ->when($status !== 'all', function ($query, $status) {
                    if ($status === 'active') {
                        $query->where('is_active', true);
                    } elseif ($status === 'inactive') {
                        $query->where('is_active', false);
                    } elseif ($status === 'verified') {
                        $query->where('is_verified', true);
                    } elseif ($status === 'featured') {
                        $query->where('is_featured', true);
                    }
                })
                ->get()
                ->map(function ($company) {
                    return [
                        'id' => $company->id,
                        'type' => 'Rental Company',
                        'name' => $company->name,
                        'email' => $company->email,
                        'phone' => $company->primary_phone,
                        'company' => $company->name,
                        'status' => $company->is_active ? 'active' : 'inactive',
                        'created_at' => $company->created_at->format('Y-m-d H:i:s'),
                        'vehicles_count' => $company->vehicles->count(),
                        'country' => $company->country,
                        'rating' => $company->rating,
                        'is_verified' => $company->is_verified ? 'Yes' : 'No',
                        'is_featured' => $company->is_featured ? 'Yes' : 'No',
                    ];
                });
            $clients = $clients->merge($companies);
        }

        // Users
        if ($type === 'all' || $type === 'users') {
            $users = User::when($status !== 'all', function ($query, $status) {
                if ($status === 'active') {
                    $query->where('is_active', true);
                } elseif ($status === 'inactive') {
                    $query->where('is_active', false);
                }
            })
                ->get()
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'type' => 'System User',
                        'name' => $user->name,
                        'email' => $user->email,
                        'phone' => 'N/A',
                        'company' => 'ACMS-SaaS',
                        'status' => $user->is_active ? 'active' : 'inactive',
                        'created_at' => $user->created_at->format('Y-m-d H:i:s'),
                        'role' => $user->role ?? 'user',
                    ];
                });
            $clients = $clients->merge($users);
        }

        if ($format === 'csv') {
            $filename = 'clients_export_' . date('Y-m-d_H-i-s') . '.csv';
            $headers = [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            ];

            $callback = function () use ($clients) {
                $file = fopen('php://output', 'w');

                // CSV Headers
                fputcsv($file, [
                    'ID',
                    'Type',
                    'Name',
                    'Email',
                    'Phone',
                    'Company',
                    'Status',
                    'Created At',
                    'Additional Info'
                ]);

                // CSV Data
                foreach ($clients as $client) {
                    $additionalInfo = '';
                    if ($client['type'] === 'Participant') {
                        $additionalInfo = "Courses: {$client['courses_count']}, Nationality: {$client['nationality']}, Country: {$client['country']}";
                    } elseif ($client['type'] === 'Rental Company') {
                        $additionalInfo = "Vehicles: {$client['vehicles_count']}, Rating: {$client['rating']}, Verified: {$client['is_verified']}, Featured: {$client['is_featured']}";
                    } elseif ($client['type'] === 'System User') {
                        $additionalInfo = "Role: {$client['role']}";
                    }

                    fputcsv($file, [
                        $client['id'],
                        $client['type'],
                        $client['name'],
                        $client['email'],
                        $client['phone'],
                        $client['company'],
                        $client['status'],
                        $client['created_at'],
                        $additionalInfo
                    ]);
                }

                fclose($file);
            };

            return response()->stream($callback, 200, $headers);
        }

        // For other formats or as fallback, return to the index page with success message
        return redirect()->route('clients.index')
            ->with('success', "Export completed successfully! {$clients->count()} clients exported.");
    }

    /**
     * Bulk actions on clients
     */
    public function bulkAction(Request $request)
    {
        $action = $request->get('action');
        $clientIds = $request->get('client_ids', []);
        $clientType = $request->get('client_type');

        if (empty($clientIds)) {
            return redirect()->route('clients.index')
                ->with('error', 'No clients selected for bulk action.');
        }

        $processedCount = 0;

        switch ($action) {
            case 'activate':
                foreach ($clientIds as $clientId) {
                    $parts = explode('-', $clientId);
                    $type = $parts[0];
                    $id = $parts[1];

                    switch ($type) {
                        case 'participant':
                            // Participants don't have a status column, so we'll skip this
                            // You can add other fields to update if needed
                            break;
                        case 'company':
                            RentalCompany::where('id', $id)->update(['is_active' => true]);
                            break;
                        case 'user':
                            User::where('id', $id)->update(['is_active' => true]);
                            break;
                    }
                    $processedCount++;
                }
                $message = "Successfully activated {$processedCount} clients.";
                break;

            case 'deactivate':
                foreach ($clientIds as $clientId) {
                    $parts = explode('-', $clientId);
                    $type = $parts[0];
                    $id = $parts[1];

                    switch ($type) {
                        case 'participant':
                            // Participants don't have a status column, so we'll skip this
                            // You can add other fields to update if needed
                            break;
                        case 'company':
                            RentalCompany::where('id', $id)->update(['is_active' => false]);
                            break;
                        case 'user':
                            User::where('id', $id)->update(['is_active' => false]);
                            break;
                    }
                    $processedCount++;
                }
                $message = "Successfully deactivated {$processedCount} clients.";
                break;

            case 'delete':
                foreach ($clientIds as $clientId) {
                    $parts = explode('-', $clientId);
                    $type = $parts[0];
                    $id = $parts[1];

                    switch ($type) {
                        case 'participant':
                            Participant::where('id', $id)->delete();
                            break;
                        case 'company':
                            RentalCompany::where('id', $id)->delete();
                            break;
                        case 'user':
                            User::where('id', $id)->delete();
                            break;
                    }
                    $processedCount++;
                }
                $message = "Successfully deleted {$processedCount} clients.";
                break;

            case 'export_selected':
                // Export only selected clients
                return $this->exportSelected($clientIds);

            default:
                return redirect()->route('clients.index')
                    ->with('error', 'Invalid bulk action selected.');
        }

        return redirect()->route('clients.index')
            ->with('success', $message);
    }

    /**
     * Delete a single client
     */
    public function destroy(Request $request, $type, $id)
    {
        try {
            switch ($type) {
                case 'participant':
                    $client = Participant::findOrFail($id);
                    $client->delete();
                    break;
                case 'company':
                    $client = RentalCompany::findOrFail($id);
                    $client->delete();
                    break;
                case 'user':
                    $client = User::findOrFail($id);
                    $client->delete();
                    break;
                default:
                    return redirect()->route('clients.index')
                        ->with('error', 'Invalid client type.');
            }

            return redirect()->route('clients.index')
                ->with('success', 'Client deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->route('clients.index')
                ->with('error', 'Failed to delete client: ' . $e->getMessage());
        }
    }

    /**
     * Export selected clients
     */
    private function exportSelected($clientIds)
    {
        $clients = collect();

        foreach ($clientIds as $clientId) {
            $parts = explode('-', $clientId);
            $type = $parts[0];
            $id = $parts[1];

            switch ($type) {
                case 'participant':
                    $participant = Participant::with(['courses'])->find($id);
                    if ($participant) {
                        $clients->push([
                            'id' => $participant->id,
                            'type' => 'Participant',
                            'name' => $participant->full_name,
                            'email' => $participant->email,
                            'phone' => $participant->phone,
                            'company' => $participant->organization,
                            'status' => 'active',
                            'created_at' => $participant->created_at->format('Y-m-d H:i:s'),
                            'courses_count' => $participant->courses->count(),
                            'nationality' => $participant->nationality,
                            'country' => null, // Participants table doesn't have country column
                        ]);
                    }
                    break;

                case 'company':
                    $company = RentalCompany::with(['vehicles'])->find($id);
                    if ($company) {
                        $clients->push([
                            'id' => $company->id,
                            'type' => 'Rental Company',
                            'name' => $company->name,
                            'email' => $company->email,
                            'phone' => $company->primary_phone,
                            'company' => $company->name,
                            'status' => $company->is_active ? 'active' : 'inactive',
                            'created_at' => $company->created_at->format('Y-m-d H:i:s'),
                            'vehicles_count' => $company->vehicles->count(),
                            'country' => $company->country,
                            'rating' => $company->rating,
                            'is_verified' => $company->is_verified ? 'Yes' : 'No',
                            'is_featured' => $company->is_featured ? 'Yes' : 'No',
                        ]);
                    }
                    break;

                case 'user':
                    $user = User::find($id);
                    if ($user) {
                        $clients->push([
                            'id' => $user->id,
                            'type' => 'System User',
                            'name' => $user->name,
                            'email' => $user->email,
                            'phone' => 'N/A',
                            'company' => 'ACMS-SaaS',
                            'status' => $user->is_active ? 'active' : 'inactive',
                            'created_at' => $user->created_at->format('Y-m-d H:i:s'),
                            'role' => $user->role ?? 'user',
                        ]);
                    }
                    break;
            }
        }

        $filename = 'selected_clients_export_' . date('Y-m-d_H-i-s') . '.csv';
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function () use ($clients) {
            $file = fopen('php://output', 'w');

            // CSV Headers
            fputcsv($file, [
                'ID',
                'Type',
                'Name',
                'Email',
                'Phone',
                'Company',
                'Status',
                'Created At',
                'Additional Info'
            ]);

            // CSV Data
            foreach ($clients as $client) {
                $additionalInfo = '';
                if ($client['type'] === 'Participant') {
                    $additionalInfo = "Courses: {$client['courses_count']}, Nationality: {$client['nationality']}, Country: {$client['country']}";
                } elseif ($client['type'] === 'Rental Company') {
                    $additionalInfo = "Vehicles: {$client['vehicles_count']}, Rating: {$client['rating']}, Verified: {$client['is_verified']}, Featured: {$client['is_featured']}";
                } elseif ($client['type'] === 'System User') {
                    $additionalInfo = "Role: {$client['role']}";
                }

                fputcsv($file, [
                    $client['id'],
                    $client['type'],
                    $client['name'],
                    $client['email'],
                    $client['phone'],
                    $client['company'],
                    $client['status'],
                    $client['created_at'],
                    $additionalInfo
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}

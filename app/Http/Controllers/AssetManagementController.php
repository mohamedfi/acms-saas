<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\AssetCategory;
use App\Models\AssetLocation;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AssetManagementController extends Controller
{
    /**
     * Display the asset management dashboard
     */
    public function index()
    {
        $stats = [
            'total_assets' => Asset::count(),
            'available_assets' => Asset::available()->count(),
            'in_use_assets' => Asset::inUse()->count(),
            'maintenance_assets' => Asset::where('status', 'maintenance')->count(),
            'total_value' => Asset::sum('purchase_price') ?? 0,
            'categories_count' => AssetCategory::active()->count(),
            'locations_count' => AssetLocation::active()->count(),
        ];

        $recentAssets = Asset::with(['category', 'location'])
            ->latest()
            ->take(5)
            ->get();

        $assetsByCategory = Asset::select('category_id', DB::raw('count(*) as count'))
            ->with('category:id,name,icon,color')
            ->groupBy('category_id')
            ->get();

        $assetsByLocation = Asset::select('location_id', DB::raw('count(*) as count'))
            ->with('location:id,name,building,floor')
            ->groupBy('location_id')
            ->get();

        return Inertia::render('AssetManagement/Index', [
            'stats' => $stats,
            'recentAssets' => $recentAssets,
            'assetsByCategory' => $assetsByCategory,
            'assetsByLocation' => $assetsByLocation,
        ]);
    }

    /**
     * Display all assets
     */
    public function assets()
    {
        $assets = Asset::with(['category', 'location'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        $categories = AssetCategory::active()->ordered()->get();
        $locations = AssetLocation::active()->ordered()->get();

        return Inertia::render('AssetManagement/Assets', [
            'assets' => $assets,
            'categories' => $categories,
            'locations' => $locations,
        ]);
    }

    /**
     * Display asset categories
     */
    public function categories()
    {
        $categories = AssetCategory::withCount('assets')
            ->withSum('assets', 'purchase_price')
            ->ordered()
            ->paginate(20);

        return Inertia::render('AssetManagement/Categories', [
            'categories' => $categories,
        ]);
    }

    /**
     * Display asset locations
     */
    public function locations()
    {
        $locations = AssetLocation::withCount('assets')
            ->withSum('assets', 'purchase_price')
            ->ordered()
            ->paginate(20);

        return Inertia::render('AssetManagement/Locations', [
            'locations' => $locations,
        ]);
    }

    /**
     * Show asset details
     */
    public function show(Asset $asset)
    {
        $asset->load(['category', 'location']);

        return Inertia::render('AssetManagement/Show', [
            'asset' => $asset,
        ]);
    }

    /**
     * Show the form for creating a new asset
     */
    public function create()
    {
        $categories = AssetCategory::active()->ordered()->get();
        $locations = AssetLocation::active()->ordered()->get();
        $employees = Employee::active()->orderBy('first_name')->get(['id', 'first_name', 'last_name', 'position']);

        return Inertia::render('AssetManagement/Create', [
            'categories' => $categories,
            'locations' => $locations,
            'employees' => $employees,
        ]);
    }

    /**
     * Store a newly created asset
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:asset_categories,id',
            'location_id' => 'required|exists:asset_locations,id',
            'brand' => 'nullable|string|max:255',
            'model' => 'nullable|string|max:255',
            'serial_number' => 'nullable|string|max:255',
            'condition' => 'required|in:excellent,good,fair,poor,damaged',
            'purchase_price' => 'nullable|numeric|min:0',
            'purchase_date' => 'nullable|date',
            'supplier' => 'nullable|string|max:255',
            'warranty_expiry' => 'nullable|date',
            'status' => 'required|in:available,in_use,maintenance,retired,lost',
            'assigned_to' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $validated['asset_code'] = Asset::generateAssetCode();

        $asset = Asset::create($validated);

        return redirect()->route('asset-management.assets')
            ->with('success', 'Asset created successfully!');
    }

    /**
     * Show the form for editing an asset
     */
    public function edit(Asset $asset)
    {
        $categories = AssetCategory::active()->ordered()->get();
        $locations = AssetLocation::active()->ordered()->get();
        $employees = Employee::active()->orderBy('first_name')->get(['id', 'first_name', 'last_name', 'position']);

        return Inertia::render('AssetManagement/Edit', [
            'asset' => $asset,
            'categories' => $categories,
            'locations' => $locations,
            'employees' => $employees,
        ]);
    }

    /**
     * Update the specified asset
     */
    public function update(Request $request, Asset $asset)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:asset_categories,id',
            'location_id' => 'required|exists:asset_locations,id',
            'brand' => 'nullable|string|max:255',
            'model' => 'nullable|string|max:255',
            'serial_number' => 'nullable|string|max:255',
            'condition' => 'required|in:excellent,good,fair,poor,damaged',
            'purchase_price' => 'nullable|numeric|min:0',
            'purchase_date' => 'nullable|date',
            'supplier' => 'nullable|string|max:255',
            'warranty_expiry' => 'nullable|date',
            'status' => 'required|in:available,in_use,maintenance,retired,lost',
            'assigned_to' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $asset->update($validated);

        return redirect()->route('asset-management.assets')
            ->with('success', 'Asset updated successfully!');
    }

    /**
     * Remove the specified asset
     */
    public function destroy(Asset $asset)
    {
        $asset->delete();

        return redirect()->route('asset-management.assets')
            ->with('success', 'Asset deleted successfully!');
    }

    /**
     * Generate QR code for an asset
     */
    public function generateQR(Asset $asset)
    {
        // Generate QR code logic here
        $qrCode = 'QR_' . $asset->asset_code . '_' . time();

        $asset->update(['qr_code' => $qrCode]);

        return response()->json([
            'success' => true,
            'qr_code' => $qrCode,
            'message' => 'QR code generated successfully!'
        ]);
    }

    /**
     * Get asset statistics for dashboard
     */
    public function stats()
    {
        $stats = [
            'total_assets' => Asset::count(),
            'available_assets' => Asset::available()->count(),
            'in_use_assets' => Asset::inUse()->count(),
            'maintenance_assets' => Asset::where('status', 'maintenance')->count(),
            'total_value' => Asset::sum('purchase_price') ?? 0,
            'categories_count' => AssetCategory::active()->count(),
            'locations_count' => AssetLocation::active()->count(),
        ];

        return response()->json($stats);
    }
}

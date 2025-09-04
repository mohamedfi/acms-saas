<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Certificate;
use App\Models\Participant;
use App\Models\Course;
use App\Models\RentalCompany;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CertificateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Certificate::query();

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('certificate_number', 'like', "%{$search}%")
                    ->orWhere('course_name', 'like', "%{$search}%")
                    ->orWhere('participant_name', 'like', "%{$search}%")
                    ->orWhere('company_name', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->get('status'));
        }

        // Filter by course
        if ($request->filled('course')) {
            $query->where('course_name', $request->get('course'));
        }

        // Sort
        $sortBy = $request->get('sort', 'created_at');
        $sortOrder = $request->get('order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $certificates = $query->paginate(15)->withQueryString();

        // Get statistics
        $stats = [
            'total' => Certificate::count(),
            'active' => Certificate::where('status', 'active')->count(),
            'revoked' => Certificate::where('status', 'revoked')->count(),
            'expired' => Certificate::where('status', 'expired')->count(),
            'this_month' => Certificate::whereMonth('created_at', now()->month)->count(),
        ];

        // Get unique courses for filter
        $courses = Certificate::select('course_name')
            ->distinct()
            ->orderBy('course_name')
            ->pluck('course_name');

        return Inertia::render('Certificates/Index', [
            'certificates' => $certificates,
            'stats' => $stats,
            'courses' => $courses,
            'filters' => $request->only(['search', 'status', 'course', 'sort', 'order']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Get participants for dropdown
        $participants = Participant::select('id', 'full_name', 'email', 'organization')
            ->orderBy('full_name')
            ->get();

        // Get courses for dropdown
        $courses = Course::select('id', 'name', 'code')
            ->orderBy('name')
            ->get();

        // Get companies/organizations from participants and other client sources
        $companies = collect();

        // Get unique organizations from participants
        $participantOrganizations = Participant::select('organization')
            ->whereNotNull('organization')
            ->where('organization', '!=', '')
            ->distinct()
            ->orderBy('organization')
            ->pluck('organization')
            ->map(function ($org) {
                return ['id' => 'org_' . md5($org), 'name' => $org, 'type' => 'organization'];
            });

        $companies = $companies->merge($participantOrganizations);

        // Get rental companies
        $rentalCompanies = RentalCompany::select('id', 'name')
            ->where('is_active', true)
            ->orderBy('name')
            ->get()
            ->map(function ($company) {
                return ['id' => 'rental_' . $company->id, 'name' => $company->name, 'type' => 'rental_company'];
            });

        $companies = $companies->merge($rentalCompanies);

        // Get available background images
        $backgroundImages = $this->getAvailableBackgroundImages();

        return Inertia::render('Certificates/Create', [
            'participants' => $participants,
            'courses' => $courses,
            'companies' => $companies,
            'backgroundImages' => $backgroundImages,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'course_id' => 'nullable|exists:courses,id',
            'participant_name' => 'nullable|string|max:255',
            'participant_email' => 'nullable|email|max:255',
            'company_id' => 'nullable|string',
            'completion_date' => 'nullable|date',
            'issue_date' => 'nullable|date',
            'description' => 'nullable|string',
            'background_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'selected_background_image' => 'nullable|string',
            'orientation' => 'required|in:landscape,portrait',
            'notes' => 'nullable|string',
        ]);

        // Get course and company names (handle optional fields)
        $courseName = null;
        if ($request->course_id) {
            $course = Course::find($request->course_id);
            $courseName = $course ? $course->name : null;
        }
        $companyName = null;
        if ($request->company_id) {
            // Handle different company types
            if (str_starts_with($request->company_id, 'org_')) {
                // Extract organization name from the hash
                $orgHash = str_replace('org_', '', $request->company_id);
                $companyName = Participant::whereNotNull('organization')
                    ->where('organization', '!=', '')
                    ->distinct()
                    ->pluck('organization')
                    ->first(function ($org) use ($orgHash) {
                        return md5($org) === $orgHash;
                    });
            } elseif (str_starts_with($request->company_id, 'rental_')) {
                $rentalId = str_replace('rental_', '', $request->company_id);
                $rentalCompany = RentalCompany::find($rentalId);
                $companyName = $rentalCompany ? $rentalCompany->name : null;
            }
        }

        // Handle background image upload or selection
        $backgroundImagePath = null;
        if ($request->hasFile('background_image')) {
            // New file upload - store with original filename
            $file = $request->file('background_image');
            $originalName = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            $filename = pathinfo($originalName, PATHINFO_FILENAME);
            $storedName = $filename . '_' . time() . '.' . $extension;
            $backgroundImagePath = $file->storeAs('certificate-backgrounds', $storedName, 'public');
        } elseif ($request->selected_background_image) {
            // Selected existing image
            $backgroundImagePath = $request->selected_background_image;
        }

        // Set default dates if not provided
        $completionDate = $request->completion_date ?: now()->toDateString();
        $issueDate = $request->issue_date ?: now()->toDateString();

        $certificate = Certificate::create([
            'certificate_number' => Certificate::generateCertificateNumber(),
            'course_name' => $courseName,
            'participant_name' => $request->participant_name,
            'participant_email' => $request->participant_email,
            'company_name' => $companyName,
            'completion_date' => $completionDate,
            'issue_date' => $issueDate,
            'description' => $request->description,
            'background_image' => $backgroundImagePath,
            'orientation' => $request->orientation,
            'notes' => $request->notes,
            'status' => 'active',
        ]);

        return redirect()->route('certificates.show', $certificate)
            ->with('success', 'Certificate created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Certificate $certificate)
    {
        // Append formatted dates to the certificate
        $certificate->formatted_completion_date = $certificate->formatted_completion_date;
        $certificate->formatted_issue_date = $certificate->formatted_issue_date;

        return Inertia::render('Certificates/Show', [
            'certificate' => $certificate,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Certificate $certificate)
    {
        // Get participants for dropdown
        $participants = Participant::select('id', 'full_name', 'email', 'organization')
            ->orderBy('full_name')
            ->get();

        // Get courses for dropdown
        $courses = Course::select('id', 'name', 'code')
            ->orderBy('name')
            ->get();

        // Get companies/organizations from participants and other client sources
        $companies = collect();

        // Get unique organizations from participants
        $participantOrganizations = Participant::select('organization')
            ->whereNotNull('organization')
            ->where('organization', '!=', '')
            ->distinct()
            ->orderBy('organization')
            ->pluck('organization')
            ->map(function ($org) {
                return ['id' => 'org_' . md5($org), 'name' => $org, 'type' => 'organization'];
            });

        $companies = $companies->merge($participantOrganizations);

        // Get rental companies
        $rentalCompanies = RentalCompany::select('id', 'name')
            ->where('is_active', true)
            ->orderBy('name')
            ->get()
            ->map(function ($company) {
                return ['id' => 'rental_' . $company->id, 'name' => $company->name, 'type' => 'rental_company'];
            });

        $companies = $companies->merge($rentalCompanies);

        // Get available background images
        $backgroundImages = $this->getAvailableBackgroundImages();

        // Find current course and company selections
        $currentCourse = $courses->firstWhere('name', $certificate->course_name);
        $currentCompany = null;

        if ($certificate->company_name) {
            // Try to find in participant organizations first
            $currentCompany = $companies->first(function ($company) use ($certificate) {
                return $company['name'] === $certificate->company_name;
            });
        }

        return Inertia::render('Certificates/Edit', [
            'certificate' => $certificate,
            'participants' => $participants,
            'courses' => $courses,
            'companies' => $companies,
            'backgroundImages' => $backgroundImages,
            'currentCourse' => $currentCourse,
            'currentCompany' => $currentCompany,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Certificate $certificate)
    {
        $request->validate([
            'course_id' => 'nullable|exists:courses,id',
            'participant_name' => 'nullable|string|max:255',
            'participant_email' => 'nullable|email|max:255',
            'company_id' => 'nullable|string',
            'completion_date' => 'nullable|date',
            'issue_date' => 'nullable|date',
            'description' => 'nullable|string',
            'background_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'selected_background_image' => 'nullable|string',
            'orientation' => 'required|in:landscape,portrait',
            'status' => 'required|in:active,revoked,expired',
            'notes' => 'nullable|string',
        ]);

        // Get course and company names (handle optional fields)
        $courseName = $certificate->course_name; // Keep existing if not provided
        if ($request->course_id) {
            $course = Course::find($request->course_id);
            $courseName = $course ? $course->name : $certificate->course_name;
        }

        $companyName = $certificate->company_name; // Keep existing if not provided
        if ($request->company_id) {
            // Handle different company types
            if (str_starts_with($request->company_id, 'org_')) {
                // Extract organization name from the hash
                $orgHash = str_replace('org_', '', $request->company_id);
                $companyName = Participant::whereNotNull('organization')
                    ->where('organization', '!=', '')
                    ->distinct()
                    ->pluck('organization')
                    ->first(function ($org) use ($orgHash) {
                        return md5($org) === $orgHash;
                    });
            } elseif (str_starts_with($request->company_id, 'rental_')) {
                $rentalId = str_replace('rental_', '', $request->company_id);
                $rentalCompany = RentalCompany::find($rentalId);
                $companyName = $rentalCompany ? $rentalCompany->name : null;
            }
        }

        // Handle background image upload or selection
        $backgroundImagePath = $certificate->background_image; // Keep existing if no new upload
        if ($request->hasFile('background_image')) {
            // New file upload - delete old image if exists
            if ($certificate->background_image) {
                Storage::disk('public')->delete($certificate->background_image);
            }
            // Store with original filename
            $file = $request->file('background_image');
            $originalName = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            $filename = pathinfo($originalName, PATHINFO_FILENAME);
            $storedName = $filename . '_' . time() . '.' . $extension;
            $backgroundImagePath = $file->storeAs('certificate-backgrounds', $storedName, 'public');
        } elseif ($request->selected_background_image) {
            // Selected existing image
            $backgroundImagePath = $request->selected_background_image;
        }

        $certificate->update([
            'course_name' => $courseName,
            'participant_name' => $request->participant_name ?: $certificate->participant_name,
            'participant_email' => $request->participant_email ?: $certificate->participant_email,
            'company_name' => $companyName,
            'completion_date' => $request->completion_date ?: $certificate->completion_date,
            'issue_date' => $request->issue_date ?: $certificate->issue_date,
            'description' => $request->description ?: $certificate->description,
            'background_image' => $backgroundImagePath,
            'orientation' => $request->orientation,
            'status' => $request->status,
            'notes' => $request->notes ?: $certificate->notes,
        ]);

        return redirect()->route('certificates.show', $certificate)
            ->with('success', 'Certificate updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Certificate $certificate)
    {
        $certificate->delete();

        return redirect()->route('certificates.index')
            ->with('success', 'Certificate deleted successfully!');
    }

    /**
     * Display certificate for printing/viewing
     */
    public function view(Certificate $certificate)
    {
        // Append formatted dates to the certificate
        $certificate->formatted_completion_date = $certificate->formatted_completion_date;
        $certificate->formatted_issue_date = $certificate->formatted_issue_date;

        return Inertia::render('Certificates/View', [
            'certificate' => $certificate,
        ]);
    }

    /**
     * Export certificate as PDF
     */
    public function exportPdf(Certificate $certificate)
    {
        // Generate HTML for PDF
        $html = $this->generateCertificateHtml($certificate);

        return response()->json([
            'html' => $html,
            'filename' => 'certificate_' . $certificate->certificate_number . '.pdf'
        ]);
    }

    /**
     * Show certificate customization page
     */
    public function customize(Certificate $certificate)
    {
        // Get available background images
        $backgroundImages = $this->getAvailableBackgroundImages();

        // Append formatted dates to the certificate
        $certificate->formatted_completion_date = $certificate->formatted_completion_date;
        $certificate->formatted_issue_date = $certificate->formatted_issue_date;

        return Inertia::render('Certificates/Customize', [
            'certificate' => $certificate,
            'backgroundImages' => $backgroundImages,
        ]);
    }

    /**
     * Save certificate customization
     */
    public function saveCustomization(Request $request, Certificate $certificate)
    {
        $request->validate([
            'customization' => 'required|array',
            'background_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'selected_background_image' => 'nullable|string',
        ]);

        $updateData = [
            'customization' => $request->customization,
        ];

        // Handle background image upload or selection
        if ($request->hasFile('background_image')) {
            // New file upload - delete old image if exists
            if ($certificate->background_image) {
                Storage::disk('public')->delete($certificate->background_image);
            }
            // Store with original filename
            $file = $request->file('background_image');
            $originalName = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            $filename = pathinfo($originalName, PATHINFO_FILENAME);
            $storedName = $filename . '_' . time() . '.' . $extension;
            $updateData['background_image'] = $file->storeAs('certificate-backgrounds', $storedName, 'public');
        } elseif ($request->selected_background_image) {
            // Selected existing image
            $updateData['background_image'] = $request->selected_background_image;
        }

        $certificate->update($updateData);

        return redirect()->route('certificates.show', $certificate)
            ->with('success', 'Certificate customization saved successfully!');
    }

    /**
     * Generate certificate HTML for PDF export
     */
    private function generateCertificateHtml(Certificate $certificate)
    {
        // Handle background image path correctly
        $backgroundImage = null;
        if ($certificate->background_image) {
            $backgroundImage = asset('storage/' . $certificate->background_image);
        } else {
            $backgroundImage = asset('images/default-certificate-bg.jpg');
        }

        // Determine page orientation
        $pageSize = $certificate->orientation === 'portrait' ? 'A4 portrait' : 'A4 landscape';

        // Get customization settings or use defaults
        $customization = $certificate->customization ?? [];
        $defaults = [
            'title' => [
                'font_family' => 'Times New Roman',
                'font_size' => '3em',
                'color' => '#8b4513',
                'position' => ['top' => '20%', 'left' => '50%'],
                'text_align' => 'center'
            ],
            'subtitle' => [
                'font_family' => 'Times New Roman',
                'font_size' => '1.5em',
                'color' => '#34495e',
                'position' => ['top' => '35%', 'left' => '50%'],
                'text_align' => 'center'
            ],
            'participant_name' => [
                'font_family' => 'Times New Roman',
                'font_size' => '2.5em',
                'color' => '#2c3e50',
                'position' => ['top' => '45%', 'left' => '50%'],
                'text_align' => 'center',
                'underline' => true,
                'underline_color' => '#e74c3c'
            ],
            'course_details' => [
                'font_family' => 'Times New Roman',
                'font_size' => '1.3em',
                'color' => '#34495e',
                'position' => ['top' => '60%', 'left' => '50%'],
                'text_align' => 'center'
            ],
            'company_name' => [
                'font_family' => 'Times New Roman',
                'font_size' => '1.2em',
                'color' => '#7f8c8d',
                'position' => ['top' => '70%', 'left' => '50%'],
                'text_align' => 'center',
                'italic' => true
            ],
            'dates' => [
                'font_family' => 'Times New Roman',
                'font_size' => '1.1em',
                'color' => '#34495e',
                'position' => ['top' => '80%', 'left' => '50%'],
                'text_align' => 'center'
            ],
            'certificate_number' => [
                'font_family' => 'Times New Roman',
                'font_size' => '0.9em',
                'color' => '#7f8c8d',
                'position' => ['bottom' => '20px', 'right' => '20px'],
                'text_align' => 'right'
            ],
        ];

        // Deep merge customization with defaults
        $styles = $this->deepMerge($defaults, $customization);

        $html = '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Certificate - ' . $certificate->certificate_number . '</title>
            <style>
                @page {
                    size: ' . $pageSize . ';
                    margin: 0;
                }
                body {
                    margin: 0;
                    padding: 0;
                    font-family: "Times New Roman", serif;
                    background-image: url("' . $backgroundImage . '");
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                    width: 100vw;
                    height: 100vh;
                    position: relative;
                }
                .certificate-title {
                    position: absolute;
                    transform: translate(-50%, -50%);
                    font-family: "' . ($styles['title']['font_family'] ?? 'Times New Roman') . '", serif;
                    font-size: ' . ($styles['title']['font_size'] ?? '3em') . ';
                    font-weight: bold;
                    color: ' . ($styles['title']['color'] ?? '#8b4513') . ';
                    text-align: ' . ($styles['title']['text_align'] ?? 'center') . ';
                    top: ' . ($styles['title']['position']['top'] ?? '20%') . ';
                    left: ' . ($styles['title']['position']['left'] ?? '50%') . ';
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
                    z-index: 10;
                }
                .certificate-subtitle {
                    position: absolute;
                    transform: translate(-50%, -50%);
                    font-family: "' . $styles['subtitle']['font_family'] . '", serif;
                    font-size: ' . $styles['subtitle']['font_size'] . ';
                    color: ' . $styles['subtitle']['color'] . ';
                    text-align: ' . $styles['subtitle']['text_align'] . ';
                    top: ' . ($styles['subtitle']['position']['top'] ?? '35%') . ';
                    left: ' . ($styles['subtitle']['position']['left'] ?? '50%') . ';
                    z-index: 10;
                }
                .participant-name {
                    position: absolute;
                    transform: translate(-50%, -50%);
                    font-family: "' . ($styles['participant_name']['font_family'] ?? 'Times New Roman') . '", serif;
                    font-size: ' . ($styles['participant_name']['font_size'] ?? '2.5em') . ';
                    font-weight: bold;
                    color: ' . ($styles['participant_name']['color'] ?? '#2c3e50') . ';
                    text-align: ' . ($styles['participant_name']['text_align'] ?? 'center') . ';
                    top: ' . ($styles['participant_name']['position']['top'] ?? '45%') . ';
                    left: ' . ($styles['participant_name']['position']['left'] ?? '50%') . ';
                    z-index: 10;' .
            (isset($styles['participant_name']['underline']) && $styles['participant_name']['underline'] ? '
                    text-decoration: underline;
                    text-decoration-color: ' . $styles['participant_name']['underline_color'] . ';
                    text-decoration-thickness: 3px;' : '') . '
                }
                .course-details {
                    position: absolute;
                    transform: translate(-50%, -50%);
                    font-family: "' . $styles['course_details']['font_family'] . '", serif;
                    font-size: ' . $styles['course_details']['font_size'] . ';
                    color: ' . $styles['course_details']['color'] . ';
                    text-align: ' . $styles['course_details']['text_align'] . ';
                    top: ' . ($styles['course_details']['position']['top'] ?? '60%') . ';
                    left: ' . ($styles['course_details']['position']['left'] ?? '50%') . ';
                    z-index: 10;
                }
                .company-name {
                    position: absolute;
                    transform: translate(-50%, -50%);
                    font-family: "' . $styles['company_name']['font_family'] . '", serif;
                    font-size: ' . $styles['company_name']['font_size'] . ';
                    color: ' . $styles['company_name']['color'] . ';
                    text-align: ' . $styles['company_name']['text_align'] . ';
                    top: ' . ($styles['company_name']['position']['top'] ?? '70%') . ';
                    left: ' . ($styles['company_name']['position']['left'] ?? '50%') . ';
                    z-index: 10;' .
            (isset($styles['company_name']['italic']) && $styles['company_name']['italic'] ? '
                    font-style: italic;' : '') . '
                }
                .dates {
                    position: absolute;
                    transform: translate(-50%, -50%);
                    font-family: "' . $styles['dates']['font_family'] . '", serif;
                    font-size: ' . $styles['dates']['font_size'] . ';
                    color: ' . $styles['dates']['color'] . ';
                    text-align: ' . $styles['dates']['text_align'] . ';
                    top: ' . ($styles['dates']['position']['top'] ?? '80%') . ';
                    left: ' . ($styles['dates']['position']['left'] ?? '50%') . ';
                    z-index: 10;
                }
                .certificate-number {
                    position: absolute;
                    font-family: "' . $styles['certificate_number']['font_family'] . '", serif;
                    font-size: ' . $styles['certificate_number']['font_size'] . ';
                    color: ' . $styles['certificate_number']['color'] . ';
                    text-align: ' . $styles['certificate_number']['text_align'] . ';
                    bottom: ' . ($styles['certificate_number']['position']['bottom'] ?? '20px') . ';
                    right: ' . ($styles['certificate_number']['position']['right'] ?? '20px') . ';
                    z-index: 10;
                }
            </style>
        </head>
        <body>
            <div class="certificate-title">CERTIFICATE OF COMPLETION</div>
            <div class="certificate-subtitle">This is to certify that</div>
            ' . ($certificate->participant_name ? '<div class="participant-name">' . htmlspecialchars($certificate->participant_name) . '</div>' : '') . '
            ' . ($certificate->course_name ? '<div class="course-details">
                has successfully completed the course<br>
                <strong>' . htmlspecialchars($certificate->course_name) . '</strong>
            </div>' : '') . '
            ' . ($certificate->company_name ? '<div class="company-name">from ' . htmlspecialchars($certificate->company_name) . '</div>' : '') . '
            ' . (($certificate->completion_date || $certificate->issue_date) ? '<div class="dates">
                ' . ($certificate->completion_date ? '<div>Completed on: ' . $certificate->formatted_completion_date . '</div>' : '') . '
                ' . ($certificate->issue_date ? '<div>Issued on: ' . $certificate->formatted_issue_date . '</div>' : '') . '
            </div>' : '') . '
            <div class="certificate-number">Certificate No: ' . $certificate->certificate_number . '</div>
        </body>
        </html>';

        return $html;
    }

    /**
     * Get available background images
     */
    private function getAvailableBackgroundImages()
    {
        $images = [];

        // Get uploaded certificate background images from storage
        $uploadedImages = Storage::disk('public')->files('certificate-backgrounds');
        foreach ($uploadedImages as $imagePath) {
            $filename = basename($imagePath);
            $name = pathinfo($filename, PATHINFO_FILENAME);

            // Try to extract original filename from stored name
            if (preg_match('/^(.+)_\d+$/', $name, $matches)) {
                $displayName = $matches[1]; // Original filename without timestamp
            } else {
                // For old hash-based filenames, use a generic name
                $displayName = 'Uploaded Image ' . substr($name, 0, 8);
            }

            $images[] = [
                'filename' => $filename,
                'url' => asset('storage/' . $imagePath),
                'name' => $displayName,
                'type' => 'uploaded'
            ];
        }

        // Get default images from public directory
        $backgroundPath = public_path('images/certificate-backgrounds');
        if (is_dir($backgroundPath)) {
            $files = scandir($backgroundPath);
            foreach ($files as $file) {
                if (in_array(strtolower(pathinfo($file, PATHINFO_EXTENSION)), ['jpg', 'jpeg', 'png', 'gif'])) {
                    $images[] = [
                        'filename' => $file,
                        'url' => asset('images/certificate-backgrounds/' . $file),
                        'name' => pathinfo($file, PATHINFO_FILENAME),
                        'type' => 'default'
                    ];
                }
            }
        }

        // Add default option
        $images[] = [
            'filename' => 'default',
            'url' => asset('images/default-certificate-bg.jpg'),
            'name' => 'Default Certificate',
            'type' => 'default'
        ];

        return $images;
    }

    /**
     * Bulk actions for certificates
     */
    public function bulkAction(Request $request)
    {
        \Log::info('Bulk action request received:', $request->all());

        // Handle both direct and nested data formats
        $action = $request->action ?? $request->input('data.action');
        $certificateIds = $request->certificate_ids ?? $request->input('data.certificate_ids');

        \Log::info('Extracted data:', [
            'action' => $action,
            'certificate_ids' => $certificateIds,
            'raw_request' => $request->all()
        ]);

        $request->validate([
            'action' => 'required|in:delete,revoke,activate',
            'certificate_ids' => 'required|array',
            'certificate_ids.*' => 'exists:certificates,id',
        ]);

        $count = count($certificateIds);

        \Log::info('Processing bulk action:', [
            'action' => $action,
            'certificate_ids' => $certificateIds,
            'count' => $count
        ]);

        switch ($action) {
            case 'delete':
                // Get certificates before deleting to clean up background images
                $certificates = Certificate::whereIn('id', $certificateIds)->get();

                // Delete background images
                foreach ($certificates as $certificate) {
                    if ($certificate->background_image) {
                        Storage::disk('public')->delete($certificate->background_image);
                    }
                }

                // Delete certificates
                Certificate::whereIn('id', $certificateIds)->delete();
                $message = "Successfully deleted {$count} certificate(s).";
                break;
            case 'revoke':
                Certificate::whereIn('id', $certificateIds)->update(['status' => 'revoked']);
                $message = "Successfully revoked {$count} certificate(s).";
                break;
            case 'activate':
                Certificate::whereIn('id', $certificateIds)->update(['status' => 'active']);
                $message = "Successfully activated {$count} certificate(s).";
                break;
            default:
                return redirect()->route('certificates.index')->with('error', 'Invalid action.');
        }

        return redirect()->route('certificates.index')->with('success', $message);
    }

    /**
     * Deep merge arrays
     */
    private function deepMerge($target, $source)
    {
        $result = $target;
        foreach ($source as $key => $value) {
            if (is_array($value) && isset($result[$key]) && is_array($result[$key])) {
                $result[$key] = $this->deepMerge($result[$key], $value);
            } else {
                $result[$key] = $value;
            }
        }
        return $result;
    }
}

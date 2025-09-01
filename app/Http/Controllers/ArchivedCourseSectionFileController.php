<?php

namespace App\Http\Controllers;

use App\Models\ArchivedCourseSection;
use App\Models\ArchivedCourseSectionFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class ArchivedCourseSectionFileController extends Controller
{
    public function store(Request $request, $sectionId)
    {
        $request->validate([
            'files.*' => 'required|file|mimes:pdf,doc,docx,xls,xlsx,jpg,jpeg,png,gif,txt,zip,rar|max:10240', // 10MB max
            'description' => 'nullable|string|max:500',
        ]);

        $section = ArchivedCourseSection::findOrFail($sectionId);
        
        $uploadedFiles = [];
        
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $fileName = $file->getClientOriginalName();
                $filePath = $file->store('archived_course_sections/' . $sectionId, 'public');
                
                $sectionFile = ArchivedCourseSectionFile::create([
                    'archived_course_section_id' => $sectionId,
                    'file_name' => $fileName,
                    'file_path' => $filePath,
                    'file_type' => $file->getClientMimeType(),
                    'file_size' => $file->getSize(),
                    'description' => $request->description,
                    'uploaded_by' => Auth::user()->name ?? 'System',
                ]);
                
                $uploadedFiles[] = $sectionFile;
            }
        }
        
        return response()->json([
            'success' => true,
            'message' => count($uploadedFiles) . ' file(s) uploaded successfully',
            'files' => $uploadedFiles
        ]);
    }

    public function destroy($fileId)
    {
        $file = ArchivedCourseSectionFile::findOrFail($fileId);
        
        // Delete the physical file
        if (Storage::disk('public')->exists($file->file_path)) {
            Storage::disk('public')->delete($file->file_path);
        }
        
        // Delete the database record
        $file->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'File deleted successfully'
        ]);
    }

    public function download($fileId)
    {
        $file = ArchivedCourseSectionFile::findOrFail($fileId);
        
        if (Storage::disk('public')->exists($file->file_path)) {
            $path = Storage::disk('public')->path($file->file_path);
            return response()->download($path, $file->file_name);
        }
        
        abort(404, 'File not found');
    }
}

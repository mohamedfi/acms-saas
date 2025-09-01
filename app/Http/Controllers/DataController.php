<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Department;
use App\Models\Trainer;
use Illuminate\Http\Request;

class DataController extends Controller
{
        /**
     * Get active employees for form dropdowns
     */
    public function getEmployees()
    {
        $employees = Employee::where('is_active', true)
            ->select('id', 'first_name', 'last_name', 'position', 'department_id')
            ->get()
            ->map(function ($employee) {
                return [
                    'id' => $employee->id,
                    'full_name' => $employee->full_name,
                    'position' => $employee->position,
                    'department_id' => $employee->department_id,
                ];
            });

        return response()->json(['data' => $employees]);
    }

        /**
     * Get all departments for form dropdowns
     */
    public function getDepartments()
    {
        $departments = Department::select('id', 'name', 'description')
            ->orderBy('name')
            ->get();

        return response()->json(['data' => $departments]);
    }

    /**
     * Get active trainers for form dropdowns
     */
    public function getTrainers()
    {
        $trainers = Trainer::where('status', 'active')
            ->select('id', 'full_name', 'position', 'expertise_areas')
            ->get();

        return response()->json(['data' => $trainers]);
    }

    /**
     * Get courses for form dropdowns
     */
    public function getCourses()
    {
        $courses = \App\Models\Course::with(['trainer', 'coordinator'])
            ->select('id', 'name', 'description', 'trainer_id', 'coordinator_id')
            ->get();

        return response()->json(['data' => $courses]);
    }

    /**
     * Get participants for form dropdowns
     */
    public function getParticipants()
    {
        $participants = \App\Models\Participant::with(['enrollments.course'])
            ->get()
            ->map(function ($participant) {
                return [
                    'id' => $participant->id,
                    'full_name' => $participant->full_name,
                    'email' => $participant->email,
                    'phone' => $participant->phone,
                    'organization' => $participant->organization,
                    'passport_no' => $participant->passport_no,
                    'nationality' => $participant->nationality,
                    'notes' => $participant->notes,
                    'profile_image' => $participant->profile_image,
                    'thumbnail' => $participant->thumbnail,
                    'qr_code' => $participant->qr_code,
                    'passport_id_document' => $participant->passport_id_document,
                    'visa_status' => $participant->visa_status,
                    'created_at' => $participant->created_at,
                    'updated_at' => $participant->updated_at,
                    // Computed URLs
                    'profile_image_url' => $participant->profile_image_url,
                    'thumbnail_url' => $participant->thumbnail_url,
                    'passport_id_document_url' => $participant->passport_id_document_url,
                    'qr_code_url' => route('participants.qr-code', $participant->id),
                    // Enrollment count
                    'enrolled_courses_count' => $participant->enrollments->count(),
                ];
            });

        return response()->json(['data' => $participants]);
    }

    /**
     * Get active training halls for form dropdowns
     */
    public function getTrainingHalls()
    {
        $halls = \App\Models\TrainingHall::active()
            ->select('id', 'name', 'code', 'city', 'capacity')
            ->ordered()
            ->get();

        return response()->json(['data' => $halls]);
    }

    /**
     * Get active training programs for form dropdowns
     */
    public function getTrainingPrograms()
    {
        $programs = \App\Models\TrainingProgram::active()
            ->select('id', 'name', 'code', 'duration_hours', 'category', 'level')
            ->ordered()
            ->get();

        return response()->json(['data' => $programs]);
    }
}

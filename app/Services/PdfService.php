<?php

namespace App\Services;

use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\TrainingHall;
use App\Models\HallBooking;

class PdfService
{
    /**
     * Generate a comprehensive training hall and booking report
     */
    public function generateTrainingHallReport($trainingHall, $booking = null)
    {
        $html = $this->generateReportHtml($trainingHall, $booking);
        
        $pdf = Pdf::loadHTML($html);
        $pdf->setPaper('A4', 'portrait');
        
        return $pdf;
    }

    /**
     * Generate the HTML content for the report
     */
    private function generateReportHtml($trainingHall, $booking = null)
    {
        $currentDate = now()->format('F j, Y');
        $currentTime = now()->format('g:i A');

        $html = '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Training Hall Report</title>
            <style>
                body {
                    font-family: "DejaVu Sans", Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background-color: #f8f9fa;
                }
                .container {
                    max-width: 800px;
                    margin: 0 auto;
                    background: white;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    border-bottom: 3px solid #3b82f6;
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }
                .header h1 {
                    color: #1e40af;
                    margin: 0;
                    font-size: 28px;
                    font-weight: bold;
                }
                .header .subtitle {
                    color: #6b7280;
                    margin: 10px 0 0 0;
                    font-size: 16px;
                }
                .section {
                    margin-bottom: 25px;
                    padding: 20px;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    background: #f9fafb;
                }
                .section h2 {
                    color: #374151;
                    margin: 0 0 15px 0;
                    font-size: 20px;
                    border-bottom: 2px solid #3b82f6;
                    padding-bottom: 8px;
                }
                .info-grid {
                    display: table;
                    width: 100%;
                    border-collapse: collapse;
                }
                .info-row {
                    display: table-row;
                }
                .info-label {
                    display: table-cell;
                    width: 35%;
                    padding: 8px 12px;
                    font-weight: bold;
                    color: #374151;
                    border-bottom: 1px solid #e5e7eb;
                }
                .info-value {
                    display: table-cell;
                    width: 65%;
                    padding: 8px 12px;
                    color: #1f2937;
                    border-bottom: 1px solid #e5e7eb;
                }
                .facilities {
                    margin-top: 10px;
                }
                .facility-tag {
                    display: inline-block;
                    background: #3b82f6;
                    color: white;
                    padding: 4px 12px;
                    border-radius: 20px;
                    margin: 2px;
                    font-size: 12px;
                }
                .status-active {
                    color: #059669;
                    font-weight: bold;
                }
                .status-inactive {
                    color: #dc2626;
                    font-weight: bold;
                }
                .footer {
                    margin-top: 40px;
                    text-align: center;
                    color: #6b7280;
                    font-size: 12px;
                    border-top: 1px solid #e5e7eb;
                    padding-top: 20px;
                }
                .highlight-box {
                    background: linear-gradient(135deg, #3b82f6, #1e40af);
                    color: white;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                    text-align: center;
                }
                .highlight-box h3 {
                    margin: 0 0 10px 0;
                    font-size: 18px;
                }
                .highlight-box p {
                    margin: 0;
                    font-size: 14px;
                    opacity: 0.9;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🏢 Training Hall Management Report</h1>
                    <p class="subtitle">Comprehensive Training Hall & Booking Information</p>
                    <p class="subtitle">Generated on ' . $currentDate . ' at ' . $currentTime . '</p>
                </div>';

        // Training Hall Information
        $html .= '
                <div class="section">
                    <h2>📋 Training Hall Details</h2>
                    <div class="info-grid">
                        <div class="info-row">
                            <div class="info-label">Hall Name:</div>
                            <div class="info-value">' . htmlspecialchars($trainingHall->name) . '</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Hall Code:</div>
                            <div class="info-value">' . htmlspecialchars($trainingHall->code) . '</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">City:</div>
                            <div class="info-value">' . htmlspecialchars($trainingHall->city) . '</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Address:</div>
                            <div class="info-value">' . htmlspecialchars($trainingHall->address ?: 'Not specified') . '</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Maximum Capacity:</div>
                            <div class="info-value">' . $trainingHall->capacity . ' participants</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Status:</div>
                            <div class="info-value">
                                <span class="' . ($trainingHall->is_active ? 'status-active' : 'status-inactive') . '">
                                    ' . ($trainingHall->is_active ? '✅ Active' : '❌ Inactive') . '
                                </span>
                            </div>
                        </div>';

        if ($trainingHall->description) {
            $html .= '
                        <div class="info-row">
                            <div class="info-label">Description:</div>
                            <div class="info-value">' . htmlspecialchars($trainingHall->description) . '</div>
                        </div>';
        }

        if (!empty($trainingHall->facilities)) {
            $html .= '
                        <div class="info-row">
                            <div class="info-label">Available Facilities:</div>
                            <div class="info-value">
                                <div class="facilities">';
            foreach ($trainingHall->facilities as $facility) {
                $html .= '<span class="facility-tag">' . htmlspecialchars($facility) . '</span>';
            }
            $html .= '
                                </div>
                            </div>
                        </div>';
        }

        if ($trainingHall->contact_person || $trainingHall->contact_phone || $trainingHall->contact_email) {
            $html .= '
                        <div class="info-row">
                            <div class="info-label">Contact Information:</div>
                            <div class="info-value">';
            if ($trainingHall->contact_person) {
                $html .= '<strong>Person:</strong> ' . htmlspecialchars($trainingHall->contact_person) . '<br>';
            }
            if ($trainingHall->contact_phone) {
                $html .= '<strong>Phone:</strong> ' . htmlspecialchars($trainingHall->contact_phone) . '<br>';
            }
            if ($trainingHall->contact_email) {
                $html .= '<strong>Email:</strong> ' . htmlspecialchars($trainingHall->contact_email);
            }
            $html .= '</div></div>';
        }

        $html .= '
                    </div>
                </div>';

        // Booking Information (if exists)
        if ($booking) {
            $html .= '
                <div class="section">
                    <h2>📅 Training Session Details</h2>
                    <div class="info-grid">
                        <div class="info-row">
                            <div class="info-label">Course Name:</div>
                            <div class="info-value">' . htmlspecialchars($booking->trainingProgram->name ?? 'N/A') . '</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Course Code:</div>
                            <div class="info-value">' . htmlspecialchars($booking->trainingProgram->code ?? 'N/A') . '</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Trainer:</div>
                            <div class="info-value">' . htmlspecialchars($booking->trainer->full_name ?? 'Not assigned') . '</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Start Date:</div>
                            <div class="info-value">' . $booking->start_date . '</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">End Date:</div>
                            <div class="info-value">' . $booking->end_date . '</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Time:</div>
                            <div class="info-value">' . $booking->start_time . ' - ' . $booking->end_time . '</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Participants:</div>
                            <div class="info-value">' . $booking->current_participants . ' / ' . $booking->max_participants . '</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Price per Participant:</div>
                            <div class="info-value">' . ($booking->price_per_participant ? '$' . number_format($booking->price_per_participant, 2) : 'Free') . '</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Status:</div>
                            <div class="info-value">' . ucfirst($booking->status) . '</div>
                        </div>';

            if ($booking->notes) {
                $html .= '
                        <div class="info-row">
                            <div class="info-label">Notes:</div>
                            <div class="info-value">' . htmlspecialchars($booking->notes) . '</div>
                        </div>';
            }

            $html .= '
                    </div>
                </div>';
        }

        // Summary Statistics
        $totalBookings = $trainingHall->bookings()->count();
        $activeBookings = $trainingHall->bookings()->where('status', '!=', 'cancelled')->count();
        $totalParticipants = $trainingHall->bookings()->sum('current_participants');

        $html .= '
                <div class="highlight-box">
                    <h3>📊 Hall Utilization Summary</h3>
                    <p>Total Bookings: ' . $totalBookings . ' | Active Sessions: ' . $activeBookings . ' | Total Participants: ' . $totalParticipants . '</p>
                </div>

                <div class="footer">
                    <p>This report was automatically generated by the PMEC Training Hall Management System</p>
                    <p>For questions or support, please contact your system administrator</p>
                </div>
            </div>
        </body>
        </html>';

        return $html;
    }
}

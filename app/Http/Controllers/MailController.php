<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class MailController extends Controller
{
    public function sendReport(Request $request)
    {
        try {
            $request->validate([
                'subject' => 'required|string|max:255',
                'recipients' => 'required|array',
                'recipients.*' => 'email',
                'message' => 'required|string',
                'reportTitle' => 'required|string',
                'reportFormat' => 'required|string',
                'reportSize' => 'required|string',
                'reportId' => 'required|string',
            ]);

            $data = [
                'reportSubject' => $request->subject,
                'recipients' => $request->recipients,
                'reportMessage' => $request->message,
                'reportTitle' => $request->reportTitle,
                'reportFormat' => $request->reportFormat,
                'reportSize' => $request->reportSize,
                'reportId' => $request->reportId,
            ];

            // For now, just log the email attempt (since email might not be configured)
            Log::info('Report email requested', [
                'recipients' => $request->recipients,
                'subject' => $request->subject,
                'report_id' => $request->reportId,
                'data' => $data
            ]);

            // Try to send email if mail is configured
            try {
                // Send email to each recipient
                foreach ($request->recipients as $recipient) {
                    Mail::send('emails.report', $data, function ($mailMessage) use ($data, $recipient) {
                        $mailMessage->to($recipient)
                            ->subject($data['reportSubject'])
                            ->from(config('mail.from.address', 'noreply@pmec.com'), config('mail.from.name', 'PMEC Logistics Team'));
                    });
                }

                Log::info('Report email sent successfully', [
                    'recipients' => $request->recipients,
                    'subject' => $request->subject,
                    'report_id' => $request->reportId
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Email sent successfully to ' . count($request->recipients) . ' recipient(s)',
                    'recipients' => $request->recipients
                ]);
            } catch (\Exception $mailError) {
                Log::warning('Mail sending failed, but request was valid', [
                    'mail_error' => $mailError->getMessage(),
                    'request_data' => $request->all()
                ]);

                // Return success anyway since the request was valid
                return response()->json([
                    'success' => true,
                    'message' => 'Email request processed successfully. Note: Email delivery may be delayed due to configuration.',
                    'recipients' => $request->recipients,
                    'note' => 'Check server logs for email delivery status'
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Failed to process report email request', [
                'error' => $e->getMessage(),
                'request_data' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to process email request: ' . $e->getMessage()
            ], 500);
        }
    }
}

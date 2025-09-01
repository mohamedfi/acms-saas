<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\MessageTemplate;
use App\Models\Participant;
use App\Models\Employee;
use App\Models\ArchivedCourse;
use App\Services\CommunicationService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class MessagesController extends Controller
{
    protected $communicationService;

    public function __construct(CommunicationService $communicationService)
    {
        $this->communicationService = $communicationService;
    }

    /**
     * Display the messages dashboard
     */
    public function index()
    {
        try {
            $messages = Message::with(['sender', 'template'])
                ->orderBy('created_at', 'desc')
                ->paginate(20);

            $templates = MessageTemplate::active()->get();
            
            $stats = [
                'total' => Message::count(),
                'pending' => Message::pending()->count(),
                'sent' => Message::sent()->count(),
                'failed' => Message::failed()->count(),
                'today' => Message::whereDate('created_at', today())->count(),
            ];

            // Debug logging
            Log::info('MessagesController index - Data prepared:', [
                'messages_count' => $messages->count(),
                'templates_count' => $templates->count(),
                'stats' => $stats
            ]);

            return Inertia::render('Messages/Index', [
                'messages' => $messages,
                'templates' => $templates,
                'stats' => $stats,
            ]);
        } catch (\Exception $e) {
            Log::error('MessagesController index error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    /**
     * Show the compose message form
     */
    public function create()
    {
        $templates = MessageTemplate::active()->get();
        $participants = Participant::select('id', 'full_name', 'email', 'phone')->get();
        $employees = Employee::select('id', 'first_name', 'last_name', 'email', 'phone')->get();
        $courses = ArchivedCourse::select('id', 'course_name')->get();

        return Inertia::render('Messages/Create', [
            'templates' => $templates,
            'participants' => $participants,
            'employees' => $employees,
            'courses' => $courses,
        ]);
    }

    /**
     * Store a new message
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'recipients' => 'required|array|min:1',
            'recipients.*.type' => 'required|in:email,phone,whatsapp',
            'recipients.*.value' => 'required|string',
            'recipients.*.name' => 'nullable|string',
            'recipients.*.channel' => 'required|in:email,sms,whatsapp',
            'template_id' => 'nullable|exists:message_templates,id',
            'subject' => 'nullable|string|max:255',
            'content' => 'required|string',
            'channel' => 'required|in:email,sms,whatsapp',
            'category' => 'required|in:course,task,announcement,reminder,welcome,confirmation',
            'priority' => 'required|in:low,normal,high,urgent',
            'scheduled_at' => 'nullable|date|after:now',
        ]);

        try {
            DB::beginTransaction();

            $messages = [];
            foreach ($validated['recipients'] as $recipient) {
                $message = Message::create([
                    'recipient_type' => $recipient['type'],
                    'recipient_value' => $recipient['value'],
                    'recipient_name' => $recipient['name'] ?? '',
                    'subject' => $validated['subject'],
                    'content' => $validated['content'],
                    'channel' => $recipient['channel'],
                    'template_id' => $validated['template_id'],
                    'sender_id' => Auth::id(),
                    'category' => $validated['category'],
                    'priority' => $validated['priority'],
                    'scheduled_at' => $validated['scheduled_at'],
                    'status' => $validated['scheduled_at'] ? 'pending' : 'pending',
                ]);

                $messages[] = $message;

                // Send immediately if not scheduled
                if (!$validated['scheduled_at']) {
                    $this->communicationService->send($message);
                }
            }

            DB::commit();

            $messageCount = count($messages);
            $scheduledCount = $validated['scheduled_at'] ? $messageCount : 0;
            $sentCount = $messageCount - $scheduledCount;

            $message = $scheduledCount > 0 
                ? "{$sentCount} message(s) sent, {$scheduledCount} scheduled for later"
                : "{$sentCount} message(s) sent successfully";

            return redirect()->route('messages.index')
                ->with('success', $message);

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to send messages: ' . $e->getMessage()]);
        }
    }

    /**
     * Send message using a template
     */
    public function sendWithTemplate(Request $request)
    {
        $validated = $request->validate([
            'template_id' => 'required|exists:message_templates,id',
            'recipients' => 'required|array|min:1',
            'recipients.*.type' => 'required|in:email,phone,whatsapp',
            'recipients.*.value' => 'required|string',
            'recipients.*.name' => 'nullable|string',
            'recipients.*.channel' => 'required|in:email,sms,whatsapp',
            'variables' => 'array',
            'scheduled_at' => 'nullable|date|after:now',
        ]);

        try {
            $template = MessageTemplate::findOrFail($validated['template_id']);
            
            $messages = [];
            foreach ($validated['recipients'] as $recipient) {
                if ($validated['scheduled_at']) {
                    $message = $this->communicationService->schedule(
                        $template,
                        $recipient['type'],
                        $recipient['value'],
                        $recipient['name'] ?? '',
                        $validated['variables'] ?? [],
                        $recipient['channel'],
                        $validated['scheduled_at']
                    );
                } else {
                    $message = $this->communicationService->sendWithTemplate(
                        $template,
                        $recipient['type'],
                        $recipient['value'],
                        $recipient['name'] ?? '',
                        $validated['variables'] ?? [],
                        $recipient['channel']
                    );
                }
                
                $messages[] = $message;
            }

            $messageCount = count($messages);
            $scheduledCount = $validated['scheduled_at'] ? $messageCount : 0;
            $sentCount = $messageCount - $scheduledCount;

            $message = $scheduledCount > 0 
                ? "{$sentCount} message(s) sent, {$scheduledCount} scheduled for later"
                : "{$sentCount} message(s) sent successfully using template '{$template->name}'";

            return redirect()->route('messages.index')
                ->with('success', $message);

        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to send template messages: ' . $e->getMessage()]);
        }
    }

    /**
     * Send course-related messages
     */
    public function sendCourseMessage(Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:archived_courses,id',
            'template_id' => 'required|exists:message_templates,id',
            'channel' => 'required|in:email,sms,whatsapp',
            'variables' => 'array',
            'scheduled_at' => 'nullable|date|after:now',
        ]);

        try {
            $course = ArchivedCourse::with('participants')->findOrFail($validated['course_id']);
            $template = MessageTemplate::findOrFail($validated['template_id']);

            $recipients = [];
            foreach ($course->participants as $participant) {
                $recipients[] = [
                    'type' => $validated['channel'] === 'email' ? 'email' : 'phone',
                    'value' => $validated['channel'] === 'email' ? $participant->email : $participant->phone,
                    'name' => $participant->full_name,
                    'channel' => $validated['channel'],
                ];
            }

            // Add course variables
            $variables = array_merge($validated['variables'] ?? [], [
                'course_name' => $course->course_name,
                'course_start' => $course->start_date,
                'course_end' => $course->end_date,
            ]);

            $messages = [];
            foreach ($recipients as $recipient) {
                if ($validated['scheduled_at']) {
                    $message = $this->communicationService->schedule(
                        $template,
                        $recipient['type'],
                        $recipient['value'],
                        $recipient['name'],
                        $variables,
                        $recipient['channel'],
                        $validated['scheduled_at']
                    );
                } else {
                    $message = $this->communicationService->sendWithTemplate(
                        $template,
                        $recipient['type'],
                        $recipient['value'],
                        $recipient['name'],
                        $variables,
                        $recipient['channel']
                    );
                }
                
                $messages[] = $message;
            }

            $messageCount = count($messages);
            $scheduledCount = $validated['scheduled_at'] ? $messageCount : 0;
            $sentCount = $messageCount - $scheduledCount;

            $message = $scheduledCount > 0 
                ? "{$sentCount} course message(s) sent, {$scheduledCount} scheduled for later"
                : "{$sentCount} course message(s) sent successfully";

            return redirect()->route('messages.index')
                ->with('success', $message);

        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to send course messages: ' . $e->getMessage()]);
        }
    }

    /**
     * Show message details
     */
    public function show(Message $message)
    {
        $message->load(['sender', 'template', 'related']);
        
        return Inertia::render('Messages/Show', [
            'message' => $message,
        ]);
    }

    /**
     * Resend a failed message
     */
    public function resend(Message $message)
    {
        if ($message->status !== 'failed') {
            return back()->withErrors(['error' => 'Only failed messages can be resent']);
        }

        try {
            $message->update(['status' => 'pending']);
            $this->communicationService->send($message);

            return back()->with('success', 'Message resent successfully');

        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to resend message: ' . $e->getMessage()]);
        }
    }

    /**
     * Get message statistics
     */
    public function stats()
    {
        $stats = [
            'total' => Message::count(),
            'pending' => Message::pending()->count(),
            'sent' => Message::sent()->count(),
            'delivered' => Message::where('status', 'delivered')->count(),
            'failed' => Message::failed()->count(),
            'today' => Message::whereDate('created_at', today())->count(),
            'this_week' => Message::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
            'this_month' => Message::whereMonth('created_at', now()->month)->count(),
        ];

        $channelStats = Message::selectRaw('channel, COUNT(*) as count')
            ->groupBy('channel')
            ->get()
            ->pluck('count', 'channel');

        $categoryStats = Message::selectRaw('category, COUNT(*) as count')
            ->groupBy('category')
            ->get()
            ->pluck('count', 'category');

        return response()->json([
            'stats' => $stats,
            'channels' => $channelStats,
            'categories' => $categoryStats,
        ]);
    }
}

<?php

namespace App\Services;

use App\Models\Message;
use App\Models\MessageTemplate;
use App\Services\SMSService;
use App\Services\WhatsAppService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;

class CommunicationService
{
    /**
     * Send a message through the specified channel
     */
    public function send(Message $message): bool
    {
        try {
            switch ($message->channel) {
                case 'email':
                    return $this->sendEmail($message);
                case 'sms':
                    return $this->sendSMS($message);
                case 'whatsapp':
                    return $this->sendWhatsApp($message);
                case 'in_app':
                    return $this->sendInApp($message);
                default:
                    Log::error("Unsupported channel: {$message->channel}");
                    $message->markAsFailed("Unsupported channel: {$message->channel}");
                    return false;
            }
        } catch (\Exception $e) {
            Log::error("Failed to send message: " . $e->getMessage());
            $message->markAsFailed($e->getMessage());
            return false;
        }
    }

    /**
     * Send email using Laravel's mail system
     */
    protected function sendEmail(Message $message): bool
    {
        try {
            // Create a simple email class for the message
            $emailData = [
                'subject' => $message->subject,
                'content' => $message->content,
                'recipient_name' => $message->recipient_name,
            ];

            // Send email using Laravel's mail facade
            Mail::send('emails.generic', $emailData, function ($mail) use ($message) {
                $mail->to($message->recipient_value, $message->recipient_name)
                    ->subject($message->subject);
            });

            $message->markAsSent();
            Log::info("Email sent successfully to: {$message->recipient_value}");
            return true;
        } catch (\Exception $e) {
            Log::error("Email sending failed: " . $e->getMessage());
            $message->markAsFailed($e->getMessage());
            return false;
        }
    }

    /**
     * Send SMS using dedicated SMS service
     */
    protected function sendSMS(Message $message): bool
    {
        $smsService = app(SMSService::class);
        return $smsService->send($message);
    }

    /**
     * Send WhatsApp message using dedicated WhatsApp service
     */
    protected function sendWhatsApp(Message $message): bool
    {
        $whatsappService = app(WhatsAppService::class);
        return $whatsappService->send($message);
    }

    /**
     * Send in-app notification
     */
    protected function sendInApp(Message $message): bool
    {
        try {
            // For now, just mark as sent since in-app notifications
            // would typically be handled by a separate notification system
            $message->markAsSent();
            Log::info("In-app notification sent to: {$message->recipient_value}");
            return true;
        } catch (\Exception $e) {
            Log::error("In-app notification failed: " . $e->getMessage());
            $message->markAsFailed($e->getMessage());
            return false;
        }
    }

    /**
     * Send message using a template
     */
    public function sendWithTemplate(
        MessageTemplate $template,
        string $recipientType,
        string $recipientValue,
        string $recipientName,
        array $variables = [],
        string $channel = 'email',
        int $senderId = null
    ): Message {
        $message = Message::create([
            'recipient_type' => $recipientType,
            'recipient_value' => $recipientValue,
            'recipient_name' => $recipientName,
            'subject' => $template->renderSubject($variables),
            'content' => $template->renderContent($variables),
            'channel' => $channel,
            'template_id' => $template->id,
            'sender_id' => $senderId ?? Auth::id(),
            'category' => $template->category,
            'priority' => 'normal',
        ]);

        // Send the message
        $this->send($message);

        return $message;
    }

    /**
     * Send bulk messages
     */
    public function sendBulk(array $recipients, MessageTemplate $template, array $variables = []): array
    {
        $results = [];

        foreach ($recipients as $recipient) {
            $message = $this->sendWithTemplate(
                $template,
                $recipient['type'],
                $recipient['value'],
                $recipient['name'] ?? '',
                $variables,
                $recipient['channel'] ?? 'email'
            );

            $results[] = $message;
        }

        return $results;
    }

    /**
     * Schedule a message for later
     */
    public function schedule(
        MessageTemplate $template,
        string $recipientType,
        string $recipientValue,
        string $recipientName,
        array $variables = [],
        string $channel = 'email',
        \DateTime $scheduledAt = null,
        int $senderId = null
    ): Message {
        return Message::create([
            'recipient_type' => $recipientType,
            'recipient_value' => $recipientValue,
            'recipient_name' => $recipientName,
            'subject' => $template->renderSubject($variables),
            'content' => $template->renderContent($variables),
            'channel' => $channel,
            'template_id' => $template->id,
            'sender_id' => $senderId ?? Auth::id(),
            'category' => $template->category,
            'priority' => 'normal',
            'scheduled_at' => $scheduledAt,
            'status' => 'pending',
        ]);
    }

    /**
     * Process scheduled messages
     */
    public function processScheduledMessages(): int
    {
        $scheduledMessages = Message::scheduled()
            ->where('scheduled_at', '<=', now())
            ->get();

        $processed = 0;

        foreach ($scheduledMessages as $message) {
            if ($this->send($message)) {
                $processed++;
            }
        }

        return $processed;
    }
}

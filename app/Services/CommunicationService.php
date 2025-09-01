<?php

namespace App\Services;

use App\Models\Message;
use App\Models\MessageTemplate;
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
     * Send SMS using Twilio or similar service
     */
    protected function sendSMS(Message $message): bool
    {
        try {
            // Check if Twilio is configured
            if (!config('services.twilio.account_sid')) {
                // For development/testing, simulate SMS sending
                Log::info("Twilio not configured - simulating SMS send for: {$message->recipient_value}");
                $message->update([
                    'metadata' => ['simulated' => true, 'note' => 'Twilio not configured - SMS simulated'],
                ]);
                $message->markAsSent();
                return true;
            }

            $response = Http::withBasicAuth(
                config('services.twilio.account_sid'),
                config('services.twilio.auth_token')
            )->post("https://api.twilio.com/2010-04-01/Accounts/" .
                config('services.twilio.account_sid') . "/Messages.json", [
                'To' => $message->recipient_value,
                'Body' => $message->content,
                'From' => config('services.twilio.phone_number'),
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $message->update([
                    'metadata' => $data,
                    'cost' => $data['price'] ?? 0,
                ]);
                $message->markAsSent();
                Log::info("SMS sent successfully to: {$message->recipient_value}");
                return true;
            } else {
                throw new \Exception("SMS API error: " . $response->body());
            }
        } catch (\Exception $e) {
            Log::error("SMS sending failed: " . $e->getMessage());
            $message->markAsFailed($e->getMessage());
            return false;
        }
    }

    /**
     * Send WhatsApp message using WhatsApp Business API
     */
    protected function sendWhatsApp(Message $message): bool
    {
        try {
            // Check if WhatsApp Business API is configured
            if (!config('services.whatsapp.access_token')) {
                // For development/testing, simulate WhatsApp sending
                Log::info("WhatsApp not configured - simulating message send for: {$message->recipient_value}");
                $message->update([
                    'metadata' => ['simulated' => true, 'note' => 'WhatsApp API not configured - message simulated'],
                ]);
                $message->markAsSent();
                return true;
            }

            $response = Http::withToken(config('services.whatsapp.access_token'))
                ->post("https://graph.facebook.com/v17.0/" .
                    config('services.whatsapp.phone_number_id') . "/messages", [
                    'messaging_product' => 'whatsapp',
                    'to' => $message->recipient_value,
                    'type' => 'text',
                    'text' => [
                        'body' => $message->content
                    ]
                ]);

            if ($response->successful()) {
                $data = $response->json();
                $message->update([
                    'metadata' => $data,
                ]);
                $message->markAsSent();
                Log::info("WhatsApp message sent successfully to: {$message->recipient_value}");
                return true;
            } else {
                throw new \Exception("WhatsApp API error: " . $response->body());
            }
        } catch (\Exception $e) {
            Log::error("WhatsApp sending failed: " . $e->getMessage());
            $message->markAsFailed($e->getMessage());
            return false;
        }
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

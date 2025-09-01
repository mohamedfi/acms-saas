<?php

namespace App\Services;

use App\Models\Message;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class WhatsAppService
{
    protected $accessToken;
    protected $phoneNumberId;
    protected $apiVersion;

    public function __construct()
    {
        $this->accessToken = config('whatsapp.providers.meta.access_token');
        $this->phoneNumberId = config('whatsapp.providers.meta.phone_number_id');
        $this->apiVersion = config('whatsapp.providers.meta.api_version', 'v17.0');
    }

    /**
     * Send WhatsApp message
     */
    public function send(Message $message): bool
    {
        try {
            // If WhatsApp is not configured, simulate sending
            if (!$this->isConfigured()) {
                return $this->simulateSending($message);
            }

            // Format phone number
            $toNumber = $this->formatPhoneNumber($message->recipient_value);

            // Send WhatsApp message via Meta API
            $response = Http::withToken($this->accessToken)
                ->post("https://graph.facebook.com/{$this->apiVersion}/{$this->phoneNumberId}/messages", [
                    'messaging_product' => 'whatsapp',
                    'to' => $toNumber,
                    'type' => 'text',
                    'text' => [
                        'body' => $message->content
                    ]
                ]);

            if ($response->successful()) {
                $data = $response->json();

                // Update message with WhatsApp response
                $message->update([
                    'metadata' => [
                        'whatsapp_message_id' => $data['messages'][0]['id'] ?? null,
                        'status' => 'sent',
                        'api_response' => $data,
                        'sent_at' => now()->toISOString(),
                    ],
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
     * Send WhatsApp message with template
     */
    public function sendTemplate(Message $message, string $templateName, array $components = []): bool
    {
        try {
            if (!$this->isConfigured()) {
                return $this->simulateSending($message);
            }

            $toNumber = $this->formatPhoneNumber($message->recipient_value);

            $payload = [
                'messaging_product' => 'whatsapp',
                'to' => $toNumber,
                'type' => 'template',
                'template' => [
                    'name' => $templateName,
                    'language' => [
                        'code' => config('whatsapp.templates.language', 'en_US')
                    ]
                ]
            ];

            // Add template components if provided
            if (!empty($components)) {
                $payload['template']['components'] = $components;
            }

            $response = Http::withToken($this->accessToken)
                ->post("https://graph.facebook.com/{$this->apiVersion}/{$this->phoneNumberId}/messages", $payload);

            if ($response->successful()) {
                $data = $response->json();

                $message->update([
                    'metadata' => [
                        'whatsapp_message_id' => $data['messages'][0]['id'] ?? null,
                        'template_used' => $templateName,
                        'status' => 'sent',
                        'api_response' => $data,
                        'sent_at' => now()->toISOString(),
                    ],
                ]);

                $message->markAsSent();
                Log::info("WhatsApp template message sent successfully to: {$message->recipient_value}");

                return true;
            } else {
                throw new \Exception("WhatsApp template API error: " . $response->body());
            }
        } catch (\Exception $e) {
            Log::error("WhatsApp template sending failed: " . $e->getMessage());
            $message->markAsFailed($e->getMessage());
            return false;
        }
    }

    /**
     * Simulate WhatsApp sending for development/testing
     */
    protected function simulateSending(Message $message): bool
    {
        Log::info("WhatsApp not configured - simulating message send for: {$message->recipient_value}");

        $message->update([
            'metadata' => [
                'simulated' => true,
                'note' => 'WhatsApp API not configured - message simulated',
                'simulated_at' => now()->toISOString(),
            ],
        ]);

        $message->markAsSent();
        return true;
    }

    /**
     * Format phone number with country code if needed
     */
    protected function formatPhoneNumber(string $phoneNumber): string
    {
        // Remove any non-digit characters except +
        $phoneNumber = preg_replace('/[^0-9+]/', '', $phoneNumber);

        // If number doesn't start with +, add default country code
        if (!str_starts_with($phoneNumber, '+')) {
            $phoneNumber = '+1' . $phoneNumber; // Default to US
        }

        return $phoneNumber;
    }

    /**
     * Check if WhatsApp service is properly configured
     */
    public function isConfigured(): bool
    {
        return !empty($this->accessToken) && !empty($this->phoneNumberId);
    }

    /**
     * Get available templates from WhatsApp
     */
    public function getTemplates(): array
    {
        if (!$this->isConfigured()) {
            return [];
        }

        try {
            $response = Http::withToken($this->accessToken)
                ->get("https://graph.facebook.com/{$this->apiVersion}/{$this->phoneNumberId}/message_templates");

            if ($response->successful()) {
                return $response->json()['data'] ?? [];
            }
        } catch (\Exception $e) {
            Log::error("Failed to get WhatsApp templates: " . $e->getMessage());
        }

        return [];
    }

    /**
     * Verify webhook signature
     */
    public function verifyWebhook(string $body, string $signature): bool
    {
        $expectedSignature = 'sha256=' . hash_hmac('sha256', $body, config('whatsapp.providers.meta.webhook_verify_token'));
        return hash_equals($expectedSignature, $signature);
    }
}

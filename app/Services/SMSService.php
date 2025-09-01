<?php

namespace App\Services;

use App\Models\Message;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Twilio\Rest\Client;

class SMSService
{
    protected $client;
    protected $fromNumber;

    public function __construct()
    {
        $this->fromNumber = config('twilio.phone_number');

        if (config('twilio.account_sid') && config('twilio.auth_token')) {
            $this->client = new Client(
                config('twilio.account_sid'),
                config('twilio.auth_token')
            );
        }
    }

    /**
     * Send SMS message
     */
    public function send(Message $message): bool
    {
        try {
            // If Twilio is not configured, simulate sending
            if (!$this->client) {
                return $this->simulateSending($message);
            }

            // Format phone number
            $toNumber = $this->formatPhoneNumber($message->recipient_value);

            // Send SMS via Twilio
            $twilioMessage = $this->client->messages->create(
                $toNumber,
                [
                    'from' => $this->fromNumber,
                    'body' => $message->content
                ]
            );

            // Update message with Twilio response
            $message->update([
                'metadata' => [
                    'twilio_sid' => $twilioMessage->sid,
                    'status' => $twilioMessage->status,
                    'price' => $twilioMessage->price,
                    'date_created' => $twilioMessage->dateCreated,
                ],
                'cost' => $twilioMessage->price ?? 0,
            ]);

            $message->markAsSent();
            Log::info("SMS sent successfully via Twilio to: {$message->recipient_value}");

            return true;
        } catch (\Exception $e) {
            Log::error("SMS sending failed: " . $e->getMessage());
            $message->markAsFailed($e->getMessage());
            return false;
        }
    }

    /**
     * Simulate SMS sending for development/testing
     */
    protected function simulateSending(Message $message): bool
    {
        Log::info("Twilio not configured - simulating SMS send for: {$message->recipient_value}");

        $message->update([
            'metadata' => [
                'simulated' => true,
                'note' => 'Twilio not configured - SMS simulated',
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
        // If number doesn't start with +, add default country code
        if (!str_starts_with($phoneNumber, '+')) {
            $phoneNumber = config('twilio.default_country_code', '+1') . $phoneNumber;
        }

        return $phoneNumber;
    }

    /**
     * Check if SMS service is properly configured
     */
    public function isConfigured(): bool
    {
        return !empty(config('twilio.account_sid')) &&
            !empty(config('twilio.auth_token')) &&
            !empty(config('twilio.phone_number'));
    }

    /**
     * Get account balance (Twilio only)
     */
    public function getBalance(): ?float
    {
        if (!$this->client) {
            return null;
        }

        try {
            $account = $this->client->api->accounts(config('twilio.account_sid'))->fetch();
            return (float) $account->balance;
        } catch (\Exception $e) {
            Log::error("Failed to get Twilio balance: " . $e->getMessage());
            return null;
        }
    }
}

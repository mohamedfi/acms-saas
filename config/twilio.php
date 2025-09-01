<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Twilio Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains the configuration for Twilio SMS service.
    |
    */

    'account_sid' => env('TWILIO_ACCOUNT_SID'),
    'auth_token' => env('TWILIO_AUTH_TOKEN'),
    'phone_number' => env('TWILIO_PHONE_NUMBER'),

    'default_country_code' => env('TWILIO_DEFAULT_COUNTRY_CODE', '+1'),

    'webhook' => [
        'enabled' => env('TWILIO_WEBHOOK_ENABLED', false),
        'path' => env('TWILIO_WEBHOOK_PATH', 'webhooks/twilio'),
    ],

    'logging' => [
        'enabled' => env('TWILIO_LOGGING_ENABLED', true),
        'level' => env('TWILIO_LOG_LEVEL', 'info'),
    ],
];

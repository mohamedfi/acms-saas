<?php

return [
    /*
    |--------------------------------------------------------------------------
    | WhatsApp Business API Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains the configuration for WhatsApp Business API
    | integration using Meta's WhatsApp Cloud API.
    |
    */

    'default' => env('WHATSAPP_DEFAULT_PROVIDER', 'meta'),

    'providers' => [
        'meta' => [
            'access_token' => env('WHATSAPP_ACCESS_TOKEN'),
            'phone_number_id' => env('WHATSAPP_PHONE_NUMBER_ID'),
            'business_account_id' => env('WHATSAPP_BUSINESS_ACCOUNT_ID'),
            'api_version' => env('WHATSAPP_API_VERSION', 'v17.0'),
            'webhook_verify_token' => env('WHATSAPP_WEBHOOK_VERIFY_TOKEN'),
        ],
    ],

    'webhook' => [
        'enabled' => env('WHATSAPP_WEBHOOK_ENABLED', false),
        'path' => env('WHATSAPP_WEBHOOK_PATH', 'webhooks/whatsapp'),
    ],

    'templates' => [
        'enabled' => env('WHATSAPP_TEMPLATES_ENABLED', true),
        'language' => env('WHATSAPP_TEMPLATE_LANGUAGE', 'en_US'),
    ],
];

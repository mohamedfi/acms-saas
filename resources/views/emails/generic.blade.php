<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $subject ?? 'Message from ACMS' }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background-color: #3b82f6;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }

        .content {
            background-color: #f8fafc;
            padding: 30px;
            border-radius: 0 0 8px 8px;
            border: 1px solid #e2e8f0;
        }

        .footer {
            text-align: center;
            margin-top: 20px;
            color: #64748b;
            font-size: 14px;
        }

        .message-content {
            background-color: white;
            padding: 20px;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
            margin: 20px 0;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>ACMS - Academic Course Management System</h1>
    </div>

    <div class="content">
        @if (isset($recipient_name) && $recipient_name)
            <p>Dear {{ $recipient_name }},</p>
        @endif

        <div class="message-content">
            {!! nl2br(e($content)) !!}
        </div>

        <p>Best regards,<br>
            ACMS Team</p>
    </div>

    <div class="footer">
        <p>This is an automated message from the ACMS system.</p>
        <p>If you have any questions, please contact your course administrator.</p>
    </div>
</body>

</html>

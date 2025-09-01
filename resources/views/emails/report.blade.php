<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $reportSubject }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }

        .email-container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            margin: -30px -30px 30px -30px;
            text-align: center;
        }

        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }

        .content {
            margin-bottom: 30px;
        }

        .message {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 6px;
            border-left: 4px solid #667eea;
            margin: 20px 0;
        }

        .report-details {
            background-color: #e3f2fd;
            padding: 20px;
            border-radius: 6px;
            border: 1px solid #bbdefb;
        }

        .report-details h3 {
            margin-top: 0;
            color: #1976d2;
        }

        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 8px 0;
            border-bottom: 1px solid #e1f5fe;
        }

        .detail-label {
            font-weight: 600;
            color: #555;
        }

        .detail-value {
            color: #333;
        }

        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
        }

        .logo {
            font-size: 28px;
            margin-bottom: 10px;
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">📊</div>
            <h1>Logistics Report</h1>
        </div>

        <div class="content">
            <p>Hello,</p>

            <div class="message">
                <strong>Message:</strong><br>
                {{ $reportMessage }}
            </div>

            <div class="report-details">
                <h3>📋 Report Information</h3>
                <div class="detail-row">
                    <span class="detail-label">Report Title:</span>
                    <span class="detail-value">{{ $reportTitle }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Format:</span>
                    <span class="detail-value">{{ $reportFormat }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">File Size:</span>
                    <span class="detail-value">{{ $reportSize }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Report ID:</span>
                    <span class="detail-value"><code>{{ $reportId }}</code></span>
                </div>
            </div>

            <p>This report has been generated and is ready for your review. If you have any questions or need additional
                information, please don't hesitate to contact us.</p>
        </div>

        <div class="footer">
            <p>Best regards,<br>
                <strong>PMEC Logistics Team</strong>
            </p>
            <p>This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>

</html>

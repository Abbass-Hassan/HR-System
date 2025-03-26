<?php

namespace App\Services;
use Illuminate\Support\Facades\Http;

class SlackNotificationService
{
    protected $webhookUrl;
    public function __construct()
    {
        $this->webhookUrl = env('SLACK_PROJECT_WEBHOOK');
    }

    public static function sendNotification($message, $webhookUrl = null)
    {
        $url = $webhookUrl ?? SlackNotificationService::$webhookUrl;
        $payload = [
            "attachments" => [
                [
                    "color" => "#FF6347",
                    "blocks" => [
                        [
                            "type" => "header",
                            "text" => [
                                "type" => "plain_text",
                                "text" => ":bell: *Notification*",
                                "emoji" => true
                            ]
                        ],
                        [
                            "type" => "section",
                            "text" => [
                                "type" => "mrkdwn",
                                "text" => "*$message* :sparkles:"
                            ]
                        ],
                        [
                            "type" => "context",
                            "elements" => [
                                [
                                    "type" => "mrkdwn",
                                    "text" => ":clock1: *Time:* " . now()->setTimezone('Asia/Beirut')->format('Y-m-d H:i:s')
                                ]
                            ]
                        ],
                        [
                            "type" => "divider"
                        ],
                        [
                            "type" => "context",
                            "elements" => [
                                [
                                    "type" => "mrkdwn",
                                    "text" => "_🤖 This is an automated notification._"
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ];

        $response = Http::post(
            $url,
            $payload
        );

        return $response->successful();
    }
}

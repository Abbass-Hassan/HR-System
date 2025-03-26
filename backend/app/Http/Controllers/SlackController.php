<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\SlackNotificationService;

class SlackController extends Controller
{
    protected $slackService;

    public function __construct(SlackNotificationService $slackService)
    {
        $this->slackService = $slackService;
    }

    public function sendToProjectChannel(Request $request)
    {
        $this->slackService->sendNotification($request["message"], env('SLACK_PROJECT_WEBHOOK'));
        return response()->json(['message' => 'Notification Sent to Project Channel']);
    }

    public function sendToLoginChannel(Request $request)
    {    
        $this->slackService->sendNotification($request["message"], env('SLACK_LOGIN_WEBHOOK'));
        return response()->json(['message' => 'Notification Sent to Login Channel']);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Google\Cloud\Dialogflow\V2\SessionsClient;
use Google\Cloud\Dialogflow\V2\TextInput;
use Google\Cloud\Dialogflow\V2\QueryInput;

class SupportController extends Controller
{
    public function getResponse(Request $request)
    {
        try {
            // Validate input
            $userQuery = $request->input('query');
            if (empty(trim($userQuery))) {
                return response()->json(['reply' => 'Please enter a valid query.'], 400);
            }
            
            // Set credentials path
            $credentialsPath = base_path('storage/credentials/dialogflow.json');
            putenv('GOOGLE_APPLICATION_CREDENTIALS=' . $credentialsPath);
            
            // Create sessions client
            $sessionsClient = new SessionsClient();
            $sessionPath = $sessionsClient->sessionName('employeesupportagent-9gca', uniqid());
            
            // Create the text input
            $textInput = new TextInput();
            $textInput->setText($userQuery);
            $textInput->setLanguageCode('en-US');
            
            // Create the query input
            $queryInput = new QueryInput();
            $queryInput->setText($textInput);
            
            // Get response from Dialogflow
            $response = $sessionsClient->detectIntent($sessionPath, $queryInput);
            $queryResult = $response->getQueryResult();
            $fulfillmentText = $queryResult->getFulfillmentText();
            
            // Close the client
            $sessionsClient->close();
            
            return response()->json(['reply' => $fulfillmentText]);
            
        } catch (\Exception $e) {
            Log::error('Dialogflow error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
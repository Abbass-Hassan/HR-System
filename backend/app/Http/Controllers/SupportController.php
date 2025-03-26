<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Firebase\JWT\JWT;

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
            
            // Get service account credentials
            $credentialsPath = base_path('storage/credentials/dialogflow.json');
            $credentials = json_decode(file_get_contents($credentialsPath), true);
            
            // Create a session ID
            $sessionId = uniqid();
            $projectId = 'employeesupportagent-9gca';
            
            // Get access token
            $accessToken = $this->getAccessToken($credentials);
            
            // Make direct API call to Dialogflow
            $response = Http::withToken($accessToken)
                ->post("https://dialogflow.googleapis.com/v2/projects/{$projectId}/agent/sessions/{$sessionId}:detectIntent", [
                    'queryInput' => [
                        'text' => [
                            'text' => $userQuery,
                            'languageCode' => 'en-US'
                        ]
                    ]
                ]);
                
            if ($response->successful()) {
                $fulfillmentText = $response->json()['queryResult']['fulfillmentText'] ?? 'No response found';
                return response()->json(['reply' => $fulfillmentText]);
            } else {
                return response()->json(['error' => $response->body()], 500);
            }
            
        } catch (\Exception $e) {
            \Log::error('Dialogflow error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    private function getAccessToken($credentials)
    {
        // Check cache first
        $cacheKey = 'dialogflow_token';
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }
        
        // Create JWT token
        $now = time();
        $payload = [
            'iss' => $credentials['client_email'],
            'sub' => $credentials['client_email'],
            'aud' => 'https://oauth2.googleapis.com/token',
            'iat' => $now,
            'exp' => $now + 3600,
            'scope' => 'https://www.googleapis.com/auth/dialogflow'
        ];
        
        $jwt = JWT::encode($payload, $credentials['private_key'], 'RS256');
        
        // Exchange JWT for access token
        $response = Http::asForm()->post('https://oauth2.googleapis.com/token', [
            'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            'assertion' => $jwt
        ]);
        
        if (!$response->successful()) {
            \Log::error('OAuth error: ' . $response->body());
            throw new \Exception('Could not obtain access token: ' . $response->body());
        }
        
        $accessToken = $response->json()['access_token'];
        $expiresIn = $response->json()['expires_in'] ?? 3600;
        
        // Cache token for future use (slightly less than expiry)
        Cache::put($cacheKey, $accessToken, now()->addSeconds($expiresIn - 300));
        
        return $accessToken;
    }
}
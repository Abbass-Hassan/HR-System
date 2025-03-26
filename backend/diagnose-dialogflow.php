<?php
// diagnose-dialogflow.php
require_once __DIR__ . '/vendor/autoload.php';

echo "Checking PHP extensions:\n";
echo "gRPC extension: " . (extension_loaded('grpc') ? "Loaded ✓" : "NOT LOADED ✗") . "\n";
echo "Protobuf extension: " . (extension_loaded('protobuf') ? "Loaded ✓" : "NOT LOADED ✗") . "\n";

echo "\nChecking for Google Dialogflow files:\n";
$path = __DIR__ . '/vendor/google/cloud-dialogflow/src/V2/SessionsClient.php';
echo "SessionsClient exists: " . (file_exists($path) ? "Yes ✓" : "NO ✗") . "\n";

echo "\nAttempting to use class:\n";
try {
    // Force autoloader to find the class
    class_exists('Google\Cloud\Dialogflow\V2\SessionsClient');
    echo "Class found in autoloader ✓\n";
} catch (Exception $e) {
    echo "Autoloader error: " . $e->getMessage() . "\n";
}

echo "\nTesting direct instantiation:\n";
try {
    putenv('GOOGLE_APPLICATION_CREDENTIALS=' . __DIR__ . '/storage/credentials/dialogflow.json');
    $client = new Google\Cloud\Dialogflow\V2\SessionsClient();
    echo "Successfully created client ✓\n";
} catch (Throwable $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Type: " . get_class($e) . "\n";
}
<?php
// Get the request URI
$uri = $_SERVER['REQUEST_URI'] ?? '/';
$uri = parse_url($uri, PHP_URL_PATH);

// Route API, Admin, and Storage to Laravel
if (preg_match('#^/(api|admin|storage)#', $uri)) {
    // Preserve original URI and method
    $_SERVER['REQUEST_URI'] = $uri;
    $_SERVER['SCRIPT_NAME'] = '/index.php';
    $_SERVER['REQUEST_METHOD'] = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    
    // Important: Don't read php://input here - let Laravel read it directly
    // Laravel's Request::capture() will handle reading from php://input
    // For multipart/form-data, PHP automatically populates $_POST and $_FILES
    
    chdir(__DIR__ . '/backend/public');
    require __DIR__ . '/backend/public/index.php';
    exit;
}

// All other requests - Proxy to Next.js
$nextJsUrl = 'http://localhost:3000' . $_SERVER['REQUEST_URI'];
$ch = curl_init($nextJsUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $_SERVER['REQUEST_METHOD'] ?? 'GET');

// Forward POST data if exists
if (in_array($_SERVER['REQUEST_METHOD'], ['POST', 'PUT', 'PATCH', 'DELETE'])) {
    // Read raw input (supports JSON, form-data, etc.)
    $input = file_get_contents('php://input');
    if (!empty($input)) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, $input);
    } elseif (isset($_POST) && count($_POST) > 0) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($_POST));
    }
    
    // Forward Content-Type header
    if (isset($_SERVER['CONTENT_TYPE'])) {
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: ' . $_SERVER['CONTENT_TYPE']
        ]);
    }
}

// Execute request
$response = curl_exec($ch);

if ($response === false) {
    $error = curl_error($ch);
    http_response_code(503);
    header('Content-Type: text/plain');
    echo "Service temporarily unavailable: " . $error;
    curl_close($ch);
    exit;
}

$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

// Forward response headers
$responseHeaders = explode("\r\n", substr($response, 0, $headerSize));
foreach ($responseHeaders as $header) {
    if ($header && strpos($header, ':') !== false) {
        $parts = explode(':', $header, 2);
        $headerName = trim($parts[0]);
        $headerValue = trim($parts[1]);
        
        // Skip certain headers
        if (!in_array(strtolower($headerName), ['transfer-encoding', 'connection', 'content-encoding'])) {
            header("$headerName: $headerValue");
        }
    }
}

// Set HTTP status code
http_response_code($httpCode);

// Output response body
echo substr($response, $headerSize);
curl_close($ch);


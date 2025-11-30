<?php
// Get the request URI
$uri = $_SERVER['REQUEST_URI'] ?? '/';
$uri = parse_url($uri, PHP_URL_PATH);

// Route API, Admin, and Storage to Laravel
if (preg_match('#^/(api|admin|storage)#', $uri)) {
    // Get original request method BEFORE any modifications
    $originalMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    
    // Preserve original URI (without query string for routing)
    $_SERVER['REQUEST_URI'] = $uri;
    
    // Fix SCRIPT_NAME and SCRIPT_FILENAME for Laravel
    $_SERVER['SCRIPT_NAME'] = '/index.php';
    $_SERVER['SCRIPT_FILENAME'] = __DIR__ . '/backend/public/index.php';
    
    // CRITICAL: Preserve REQUEST_METHOD exactly as received
    $_SERVER['REQUEST_METHOD'] = strtoupper($originalMethod);
    
    // Also set HTTP method in environment (some frameworks check this)
    putenv('REQUEST_METHOD=' . $_SERVER['REQUEST_METHOD']);
    
    // Preserve query string if exists
    if (isset($_SERVER['QUERY_STRING'])) {
        $_SERVER['QUERY_STRING'] = $_SERVER['QUERY_STRING'];
    }
    
    // Preserve all HTTP headers
    foreach ($_SERVER as $key => $value) {
        if (strpos($key, 'HTTP_') === 0) {
            // Headers are already in $_SERVER, keep them
        }
    }
    
    // Important: Don't read php://input here - let Laravel read it directly
    // Laravel's Request::capture() will handle reading from php://input
    // For multipart/form-data, PHP automatically populates $_POST and $_FILES
    
    // Change to Laravel public directory
    chdir(__DIR__ . '/backend/public');
    
    // Debug: Log request method (remove in production)
    // error_log("DEBUG: REQUEST_METHOD = " . $_SERVER['REQUEST_METHOD']);
    // error_log("DEBUG: REQUEST_URI = " . $_SERVER['REQUEST_URI']);
    
    // Require Laravel's index.php
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


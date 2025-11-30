<?php
// Get the request URI
$uri = $_SERVER['REQUEST_URI'] ?? '/';
$uri = parse_url($uri, PHP_URL_PATH);

// Route API, Admin, Storage, and Livewire to Laravel
if (preg_match('#^/(api|admin|storage|livewire)#', $uri)) {
    // Get original request method BEFORE any modifications
    $originalMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    
    // Preserve original URI (without query string for routing)
    $_SERVER['REQUEST_URI'] = $uri;
    
    // Fix SCRIPT_NAME and SCRIPT_FILENAME for Laravel
    $_SERVER['SCRIPT_NAME'] = '/index.php';
    $_SERVER['SCRIPT_FILENAME'] = __DIR__ . '/backend/public/index.php';
    
    // CRITICAL: Set REQUEST_METHOD in multiple ways to ensure Laravel sees it
    // Some PHP configurations or Laravel versions check different sources
    $method = strtoupper($originalMethod);
    $_SERVER['REQUEST_METHOD'] = $method;
    $_ENV['REQUEST_METHOD'] = $method;
    putenv('REQUEST_METHOD=' . $method);
    
    // Also set HTTP_X_HTTP_METHOD_OVERRIDE if needed (some proxies use this)
    if (!isset($_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'])) {
        $_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'] = $method;
    }
    
    // CRITICAL: For POST/PUT/PATCH/DELETE, ensure Laravel sees the method
    // Some servers/proxies may override this, so we set it explicitly
    if (in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'])) {
        // Set as POST for form submissions (Laravel's Request::capture() checks this)
        $_SERVER['REQUEST_METHOD'] = $method;
        // Also set _method parameter for method spoofing (Laravel supports this)
        if ($method !== 'POST' && !isset($_POST['_method'])) {
            $_POST['_method'] = $method;
        }
    }
    
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
    
    // Enable debug logging to Laravel log file (BEFORE chdir)
    $debugFile = __DIR__ . '/backend/storage/logs/index_debug.log';
    $debugMsg = sprintf(
        "[%s] INDEX.PHP DEBUG - METHOD: %s, URI: %s, POST: %s, CONTENT_TYPE: %s, _ENV: %s\n",
        date('Y-m-d H:i:s'),
        $_SERVER['REQUEST_METHOD'] ?? 'NOT SET',
        $_SERVER['REQUEST_URI'] ?? 'NOT SET',
        isset($_POST) && count($_POST) > 0 ? 'YES' : 'NO',
        $_SERVER['CONTENT_TYPE'] ?? 'NOT SET',
        $_ENV['REQUEST_METHOD'] ?? 'NOT SET'
    );
    file_put_contents($debugFile, $debugMsg, FILE_APPEND);
    
    // Change to Laravel public directory AFTER setting all variables
    chdir(__DIR__ . '/backend/public');
    
    // CRITICAL: Re-set REQUEST_METHOD after chdir() in case it was lost
    $_SERVER['REQUEST_METHOD'] = $method;
    $_ENV['REQUEST_METHOD'] = $method;
    putenv('REQUEST_METHOD=' . $method);
    
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
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 2); // Reduced timeout for faster failure detection
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
$curlError = curl_error($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

// If Next.js is not available, serve a maintenance page or try to restart it
if ($response === false || $httpCode === 0) {
    curl_close($ch);
    
    // Try to restart Next.js via PM2 (if available)
    $pm2Path = '/home/u646739138/.nvm/versions/node/v18.20.8/bin/pm2';
    $pm2Restart = @shell_exec("export PATH=/home/u646739138/.nvm/versions/node/v18.20.8/bin:\$PATH && cd " . __DIR__ . "/frontend && $pm2Path restart nextjs 2>&1 || $pm2Path start npm --name nextjs -- start 2>&1");
    
    // Log the error for debugging
    $errorLog = __DIR__ . '/backend/storage/logs/nextjs_errors.log';
    $errorMsg = sprintf(
        "[%s] Next.js unavailable: %s | PM2 restart: %s\n",
        date('Y-m-d H:i:s'),
        $curlError ?: 'Connection failed',
        $pm2Restart ? 'Attempted' : 'PM2 not available'
    );
    @file_put_contents($errorLog, $errorMsg, FILE_APPEND);
    
    // Serve a user-friendly error page
    http_response_code(503);
    header('Content-Type: text/html; charset=UTF-8');
    ?>
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>الخدمة غير متاحة مؤقتاً - Dama Home Realty</title>
        <style>
            body {
                font-family: 'Cairo', Arial, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                color: #333;
            }
            .container {
                background: white;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                text-align: center;
                max-width: 500px;
            }
            h1 {
                color: #B49162;
                margin-bottom: 20px;
            }
            p {
                line-height: 1.6;
                color: #666;
            }
            .retry-btn {
                background: #B49162;
                color: white;
                padding: 12px 30px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
                margin-top: 20px;
                text-decoration: none;
                display: inline-block;
            }
            .retry-btn:hover {
                background: #9a7a4f;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>الخدمة غير متاحة مؤقتاً</h1>
            <p>نعتذر، الموقع قيد الصيانة أو غير متاح حالياً. يرجى المحاولة مرة أخرى بعد قليل.</p>
            <p style="font-size: 14px; color: #999; margin-top: 20px;">
                إذا استمرت المشكلة، يرجى التواصل معنا.
            </p>
            <a href="/" class="retry-btn" onclick="window.location.reload()">إعادة المحاولة</a>
        </div>
    </body>
    </html>
    <?php
    exit;
}

$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
if ($httpCode === 0) {
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
}

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


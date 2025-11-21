<?php

/**
 * Create Database Script
 * Creates the dama_home database if it doesn't exist
 */

$host = '127.0.0.1';
$port = 3306;
$username = 'root';
$password = '';
$database = 'dama_home';

echo "Creating database '{$database}'...\n";
echo "========================================\n\n";

try {
    // Connect to MySQL server (without database)
    $dsn = "mysql:host={$host};port={$port};charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
    
    // Create database
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$database}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    
    echo "✅ SUCCESS: Database '{$database}' created successfully!\n\n";
    
    // Verify it exists
    $stmt = $pdo->query("SHOW DATABASES LIKE '{$database}'");
    if ($stmt->rowCount() > 0) {
        echo "✅ Verification: Database exists and is ready to use!\n";
    }
    
} catch (PDOException $e) {
    echo "❌ ERROR: " . $e->getMessage() . "\n";
    echo "   Error Code: " . $e->getCode() . "\n";
    exit(1);
}

echo "\n========================================\n";
echo "Database creation completed!\n";
echo "========================================\n";


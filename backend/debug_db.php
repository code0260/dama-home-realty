<?php

/**
 * Database Connection Debug Script
 * 
 * This script helps diagnose database connection issues by:
 * 1. Attempting a direct PDO connection with hardcoded credentials
 * 2. Listing all available databases
 * 3. Showing detailed error information if connection fails
 */

// Hardcoded credentials for debugging
$host = '127.0.0.1';
$port = 3306;
$username = 'root';
$password = '';
$database = 'dama_home'; // The database we're looking for

echo "========================================\n";
echo "Database Connection Debug Script\n";
echo "========================================\n\n";

echo "Connection Parameters:\n";
echo "  Host: {$host}\n";
echo "  Port: {$port}\n";
echo "  Username: {$username}\n";
echo "  Password: " . (empty($password) ? '(empty)' : '***') . "\n";
echo "  Target Database: {$database}\n\n";

// Try to connect without specifying a database first
echo "Attempting connection to MySQL server (without database)...\n";
echo "------------------------------------------------------------\n";

try {
    $dsn = "mysql:host={$host};port={$port};charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];
    
    $pdo = new PDO($dsn, $username, $password, $options);
    
    echo "✅ SUCCESS: Connected to MySQL server!\n\n";
    
    // Show all databases
    echo "Listing all available databases:\n";
    echo "------------------------------------------------------------\n";
    
    $stmt = $pdo->query("SHOW DATABASES");
    $databases = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    $found = false;
    foreach ($databases as $db) {
        if (strtolower($db) === strtolower($database)) {
            echo "  ✅ {$db} (FOUND!)\n";
            $found = true;
        } else {
            echo "  - {$db}\n";
        }
    }
    
    echo "\n";
    
    if ($found) {
        echo "✅ The database '{$database}' EXISTS on this server!\n\n";
        
        // Try to select the database
        echo "Attempting to select database '{$database}'...\n";
        echo "------------------------------------------------------------\n";
        
        try {
            $pdo->exec("USE `{$database}`");
            echo "✅ SUCCESS: Database '{$database}' selected successfully!\n\n";
            
            // Show tables in the database
            echo "Tables in '{$database}':\n";
            echo "------------------------------------------------------------\n";
            $stmt = $pdo->query("SHOW TABLES");
            $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
            
            if (empty($tables)) {
                echo "  (No tables found)\n";
            } else {
                foreach ($tables as $table) {
                    echo "  - {$table}\n";
                }
            }
            
        } catch (PDOException $e) {
            echo "❌ ERROR selecting database: {$e->getMessage()}\n";
            echo "   Error Code: {$e->getCode()}\n";
        }
        
    } else {
        echo "❌ The database '{$database}' was NOT FOUND on this server!\n";
        echo "   Please check the database name spelling.\n";
        echo "   Note: Database names are case-sensitive on Linux/Mac, but not on Windows.\n\n";
    }
    
    // Show MySQL version
    echo "\nMySQL Server Information:\n";
    echo "------------------------------------------------------------\n";
    $stmt = $pdo->query("SELECT VERSION() as version");
    $version = $stmt->fetch();
    echo "  MySQL Version: {$version['version']}\n";
    
    // Show current user
    $stmt = $pdo->query("SELECT USER() as user, DATABASE() as current_db");
    $userInfo = $stmt->fetch();
    echo "  Current User: {$userInfo['user']}\n";
    echo "  Current Database: " . ($userInfo['current_db'] ?: '(none)') . "\n";
    
} catch (PDOException $e) {
    echo "❌ CONNECTION FAILED!\n\n";
    echo "Error Details:\n";
    echo "------------------------------------------------------------\n";
    echo "  Error Message: {$e->getMessage()}\n";
    echo "  Error Code: {$e->getCode()}\n";
    echo "  Host Attempted: {$host}\n";
    echo "  Port Attempted: {$port}\n";
    echo "  Username: {$username}\n\n";
    
    echo "Possible Issues:\n";
    echo "------------------------------------------------------------\n";
    
    if ($e->getCode() == 2002) {
        echo "  • MySQL server is not running\n";
        echo "  • Wrong host or port number\n";
        echo "  • Firewall blocking the connection\n";
    } elseif ($e->getCode() == 1045) {
        echo "  • Wrong username or password\n";
        echo "  • User doesn't have permission to connect\n";
    } elseif ($e->getCode() == 1049) {
        echo "  • Database '{$database}' does not exist\n";
        echo "  • Check database name spelling (case-sensitive on Linux/Mac)\n";
    } else {
        echo "  • Unknown error - check MySQL server logs\n";
    }
    
    echo "\n";
    echo "Troubleshooting Steps:\n";
    echo "------------------------------------------------------------\n";
    echo "  1. Verify MySQL server is running:\n";
    echo "     - Windows: Check Services (services.msc)\n";
    echo "     - Or run: net start MySQL\n\n";
    echo "  2. Check if MySQL is listening on port {$port}:\n";
    echo "     - Run: netstat -an | findstr {$port}\n\n";
    echo "  3. Verify credentials in HeidiSQL match these:\n";
    echo "     - Host: {$host}\n";
    echo "     - Port: {$port}\n";
    echo "     - Username: {$username}\n\n";
    echo "  4. Try connecting with HeidiSQL using these exact credentials\n";
}

echo "\n========================================\n";
echo "Debug script completed.\n";
echo "========================================\n";


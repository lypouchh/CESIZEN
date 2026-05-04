<?php

// Force test database environment BEFORE Laravel bootstraps and before Dotenv
// loads .env (which uses createImmutable and won't overwrite these values).
// This is necessary because Docker injects DB_CONNECTION=mysql as a system
// environment variable that PHPUnit's <env> cannot reliably override.

$testEnv = [
    'APP_ENV'       => 'testing',
    'DB_CONNECTION' => 'sqlite',
    'DB_DATABASE'   => ':memory:',
];

foreach ($testEnv as $key => $value) {
    putenv("{$key}={$value}");
    $_ENV[$key]    = $value;
    $_SERVER[$key] = $value;
}

require __DIR__ . '/../vendor/autoload.php';

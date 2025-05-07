<?php
$host = 'my_postgres_container';
$db   = 'mydb';
$user = 'uppulasaikumar';
$pass = 'uppulasaikumar';
$port = '5454';
$pdo;
try {
    $pdo = new PDO('pgsql:host=my_postgres_container;port=5454;dbname=mydb', $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // echo "Connected successfully!";
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
    exit();
}
?>
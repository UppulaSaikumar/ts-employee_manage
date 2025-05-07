<?php
require("./includes/db.php");
$migrations = [
    './migrations/001.migration.employees.sql',
    './migrations/002.migration.admEmps.sql',
];
foreach ($migrations as $migration) {
    if (file_exists($migration)) {
        $sql = file_get_contents($migration);
        try {
            $pdo->exec($sql);
            echo "Executed migration: $migration<br>";
        } catch (PDOException $e) {
            echo "Error executing $migration: " . $e->getMessage() . "<br>";
        }
    } else {
        echo "Migration file not found: $migration<br>";
    }
}
?>
<?php
require_once __DIR__ . '/vendor/autoload.php'; 
// require_once __DIR__ .'./includes/preflight.php';
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed_origins = ['http://localhost:5173']; 

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

function getJsonInput() {
    return json_decode(file_get_contents("php://input"), true);
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
require_once './includes/db.php';                        
require_once './middleware/auth.middleware.php';        

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

require_once './routes/auth.routes.php';
require_once './routes/employee.routes.php';
?>

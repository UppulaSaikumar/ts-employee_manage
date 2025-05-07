<?php
use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

$secret_key = "Sureify";

function authenticate() {
    global $pdo, $secret_key;

    $token = $_COOKIE['authToken'] ?? null;
    if (!$token) {
        $authHeader = getallheaders()['Authorization'] ?? '';
        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $token = $matches[1];
        }
    }

    if (!$token) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized: Token missing"]);
        exit;
    }

    try {
        $decoded = JWT::decode($token, new Key($secret_key, 'HS256'));
        $empid = $decoded->empid;
        $exp = $decoded->exp;

        if ($exp < time()) {
            http_response_code(401);
            echo json_encode(["error" => "Token expired"]);
            exit;
        }

        $stmt = $pdo->prepare("SELECT role FROM employees WHERE empid = :empid");
        $stmt->execute(["empid" => $empid]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row) {
            http_response_code(403);
            echo json_encode(["error" => "Access denied: Employee not found"]);
            exit;
        }

        $GLOBALS['currentUser'] = [
            "empid" => $empid,
            "role" => $row['role']
        ];
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized: Invalid or expired token"]);
        exit;
    }
}
?>

<?php
use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

$secret_key = "Sureify";

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_SERVER['REQUEST_URI'] === '/api/register') {
    $data = getJsonInput();

    $sql = "INSERT INTO admemps (empid, fullname, email, password) VALUES (:empid, :fullname, :email, :password)";
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            "empid" => $data['empid'],
            "fullname" => $data['fullname'],
            "email" => $data['email'],
            "password" => $data['password'] 
        ]);
        echo json_encode(["message" => "Registered successfully"]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_SERVER['REQUEST_URI'] === '/api/login') {
    $data = getJsonInput();
    $email = $data['email'];
    $password = $data['password'];

    try {
        $stmt = $pdo->prepare("SELECT * FROM admemps WHERE email = :email AND password = :password");
        $stmt->execute(["email" => $email, "password" => $password]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            echo json_encode(["error" => "Invalid Email or password"]);
            exit;
        }

        $token = JWT::encode([
            "email" => $email,
            "empid" => $user['empid'],
            "exp" => time() + 3600  
        ], $secret_key, 'HS256');

        setcookie("authToken", $token, time() + 3600, "/", "", false, true);

        $roleStmt = $pdo->prepare("SELECT role FROM employees WHERE empid = :empid");
        $roleStmt->execute(["empid" => $user['empid']]);
        $roleRow = $roleStmt->fetch(PDO::FETCH_ASSOC);

        if (!$roleRow) {
            echo json_encode(["error" => "Employee not found in employees table"]);
            exit;
        }

        echo json_encode([
            "message" => "Login successful",
            "fullname" => $user['fullname'],
            "empid" => $user['empid'],
            "role" => $roleRow['role']
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Error during login: " . $e->getMessage()]);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_SERVER['REQUEST_URI'] === '/verify-token') {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';

    if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        $token = $matches[1];
        try {
            $decoded = JWT::decode($token, new Key($secret_key, 'HS256'));
            echo json_encode(["valid" => true, "data" => (array)$decoded]);
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(["error" => "Invalid or expired token"]);
        }
    } else {
        http_response_code(401);
        echo json_encode(["error" => "Authorization header missing"]);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_SERVER['REQUEST_URI'] === '/api/logout') {
    setcookie("authToken", "", time() - 3600, "/", "", false, true);
    echo json_encode(["message" => "Logged out successfully"]);
    exit;
}
?>

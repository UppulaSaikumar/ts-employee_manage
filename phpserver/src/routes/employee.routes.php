<?php

require_once __DIR__ . '/../middleware/auth.middleware.php'; 

$method = $_SERVER["REQUEST_METHOD"];
$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

authenticate();

$isAdmin = $GLOBALS['currentUser']['role'] === 'admin'; 

if ($method === 'GET' && $path === "/api/get_employees") {
    try {
        $stmt = $pdo->query("SELECT * FROM employees");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error"]);
    }
    exit;
}

$publicRoutes = ['/api/register', '/login', '/verify-token'];

if (!in_array($path, $publicRoutes)) {
    authenticate(); 
}

if (!$isAdmin && in_array($method, ['POST', 'PUT', 'DELETE'])) {
    http_response_code(403);
    echo json_encode(["error" => "Access denied: Only admins can modify data"]);
    exit;
}

if ($method === 'POST' && $path === "/api/add_employee") {
    $data = getJsonInput();
    $empid = $data["empid"];

    $checkStmt = $pdo->prepare("SELECT COUNT(*) FROM employees WHERE empid = :empid");
    $checkStmt->execute(["empid" => $empid]);
    $count = (int)$checkStmt->fetchColumn();

    if ($count > 0) {
        http_response_code(404);
        echo json_encode(["error" => "Employee already exists with empid: $empid"]);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO employees (empid, profile, fullname, designation, department, salary, role)
                           VALUES (:empid, :profile, :fullname, :designation, :department, :salary, :role)");
    $stmt->execute([
        "empid" => $empid,
        "profile" => $data["profile"],
        "fullname" => $data["fullname"],
        "designation" => $data["designation"],
        "department" => $data["department"],
        "salary" => $data["salary"],
        "role" => $data["role"]
    ]);

    echo json_encode(["message" => "Employee inserted"]);
    exit;
}

if ($method === 'PUT' && preg_match("#^/api/update_employee/(\w+)$#", $path, $matches)) {
    $empid = $matches[1];
    $data = getJsonInput();

    $stmt = $pdo->prepare("UPDATE employees SET profile = :profile, fullname = :fullname,
        designation = :designation, department = :department, salary = :salary WHERE empid = :empid");

    $stmt->execute([
        "profile" => $data["profile"],
        "fullname" => $data["fullname"],
        "designation" => $data["designation"],
        "department" => $data["department"],
        "salary" => $data["salary"],
        "empid" => $empid
    ]);

    echo json_encode(["message" => "Employee updated"]);
    exit;
}

if ($method === 'DELETE' && preg_match("#^/api/delete_employee/(\w+)$#", $path, $matches)) {
    $empid = $matches[1];

    $stmt = $pdo->prepare("DELETE FROM employees WHERE empid = :empid");
    $stmt->execute(["empid" => $empid]);

    echo json_encode(["message" => "Employee deleted"]);
    exit;
}

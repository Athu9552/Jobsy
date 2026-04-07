<?php
session_start();
include 'db_connect.php';

if (!isset($_SESSION['user_id'])) {
    echo "login_required";
    exit;
}

$user_id = $_SESSION['user_id'];
$job_id  = $_POST['job_id']  ?? '';
$title   = $_POST['title']   ?? '';
$company = $_POST['company'] ?? '';

if (!$job_id || !$title || !$company) {
    echo "Error: Missing job data.";
    exit;
}

$sql = "INSERT INTO applications (user_id, job_id, title, company) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("isss", $user_id, $job_id, $title, $company);

if ($stmt->execute()) {
    echo "Applied";
} else {
    echo "Error: " . $stmt->error;
}
?>
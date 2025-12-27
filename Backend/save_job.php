<?php
session_start();
include 'db_connect.php';

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo "Error: User not logged in.";
    exit;
}

$user_id = $_SESSION['user_id'];
$job_id = $_POST['job_id'] ?? '';
$title = $_POST['title'] ?? '';
$company = $_POST['company'] ?? '';

// Validate input
if (!$job_id || !$title || !$company) {
    echo "Error: Missing job data.";
    exit;
}

// Prepare and execute insert
$sql = "INSERT INTO saved_jobs (user_id, job_id, title, company) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("isss", $user_id, $job_id, $title, $company);

if ($stmt->execute()) {
    echo "Job saved successfully!";
} else {
    echo "Error: " . $stmt->error;
}
?>
<?php
session_start();
include 'db_connect.php';

$user_id = $_SESSION['user_id'];
$job_id = $_POST['job_id'];
$title = $_POST['title'];
$company = $_POST['company'];

$sql = "INSERT INTO applications (user_id, job_id, title, company) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("isss", $user_id, $job_id, $title, $company);
$stmt->execute();

echo "Applied";
?>
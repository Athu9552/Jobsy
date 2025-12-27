<?php
session_start();
include 'db_connect.php';

$user_id = $_SESSION['user_id'];
$sql = "SELECT * FROM saved_jobs WHERE user_id=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$jobs = [];
while($row = $result->fetch_assoc()) {
  $jobs[] = $row;
}
echo json_encode($jobs);
?>
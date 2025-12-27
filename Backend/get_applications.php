<?php
session_start();
include 'db_connect.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode([]);
    exit;
}

$user_id = $_SESSION['user_id'];
$sql = "SELECT * FROM applications WHERE user_id=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$apps = [];
while($row = $result->fetch_assoc()) {
    $apps[] = $row;
}
echo json_encode($apps);
?>
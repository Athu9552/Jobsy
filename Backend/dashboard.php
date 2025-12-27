<?php
session_start();
if (!isset($_SESSION['user'])) {
    header("Location: login.html");
    exit();
}
echo "Welcome, " . $_SESSION['user'] . "!";
?>
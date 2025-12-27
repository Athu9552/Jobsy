<?php
$servername = "localhost";
$username = "root";      // default in XAMPP/WAMP
$password = "";          // empty by default
$dbname = "auth_system"; // the database you created

$conn = mysqli_connect($servername, $username, $password, $dbname);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
?>
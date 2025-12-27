<?php
// login.php
session_start();
include("db_connect.php"); // your DB connection file

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Check user in database (use prepared statement for security)
    $query = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();

        // Verify password (assuming hashed passwords)
        if (password_verify($password, $row['password'])) {
            // ✅ Set both user_id and username in session
            $_SESSION['user_id'] = $row['id'];       // this is critical for save_job.php
            $_SESSION['user'] = $row['username'];

            header("Location: http://localhost/Smart%20Job%20Recommendation/index.html"); // redirect after login
            exit();
        } else {
            echo "Invalid password!";
        }
    } else {
        echo "No user found with that email!";
    }
}
?>
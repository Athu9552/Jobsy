<?php
session_start();

// Dummy credentials for demo
$admin_user = "admin";
$admin_pass = "admin123";

if (isset($_POST['login'])) {
    if ($_POST['username'] === $admin_user && $_POST['password'] === $admin_pass) {
        $_SESSION['admin'] = true;
        header("Location: dashboard.php");
        exit;
    } else {
        $error = "Invalid username or password!";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Admin Login</title>
<link rel="stylesheet" href="../signup&login.css">
</head>
<body>

<div class="SignF">
  <div class="centerF">
    <h1>Admin Login</h1>

    <?php if(isset($error)) echo "<p style='color:red;text-align:center;margin-bottom:15px;'>$error</p>"; ?>

    <form method="POST">
      <label>Username</label>
      <input type="text" name="username" placeholder="Enter username" required>

      <label>Password</label>
      <input type="password" name="password" placeholder="Enter password" required>

      <button type="submit" name="login">Login</button>
    </form>

    <p>Back to <a href="../signup.html">Home</a></p>
  </div>
</div>

</body>
</html>
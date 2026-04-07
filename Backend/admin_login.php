<?php
session_start();

$admin_user = "admin";
$admin_pass = "$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi"; // bcrypt of 'admin123'

if (isset($_POST['login'])) {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    if ($username === $admin_user && password_verify($password, $admin_pass)) {
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
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
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
      <div class="input-eye">
        <input type="password" name="password" id="adminPassword" placeholder="Enter password" required>
        <i class="fa-regular fa-eye eye-btn" onclick="toggleEye('adminPassword', this)"></i>
      </div>

      <button type="submit" name="login">Login</button>
    </form>

    <p>Back to <a href="../signup.html">Home</a></p>
  </div>
</div>

</body>
<script>
  function toggleEye(id, el) {
    const input = document.getElementById(id);
    if (input.type === 'password') {
      input.type = 'text';
      el.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
      input.type = 'password';
      el.classList.replace('fa-eye-slash', 'fa-eye');
    }
  }
</script>
</html>
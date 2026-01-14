<?php
session_start();
if (!isset($_SESSION['admin'])) {
    header("Location: admin_login.php");
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Admin Dashboard</title>
<link rel="stylesheet" href="../admin.css">
</head>
<body>

<div class="dashboard">

    <!-- Sidebar -->
    <aside class="sidebar">
        <h2 class="logo">Jobsy Admin</h2>
        <nav>
            <a href="dashboard.php" class="active">Dashboard</a>
            <a href="manage_jobs.php">Manage Jobs</a>
            <a href="logout.php" class="logout">Logout</a>
        </nav>
    </aside>

    <!-- Main Content -->
    <main class="main">

        <!-- Top Bar -->
        <header class="topbar">
            <h1>Admin Dashboard</h1>
            <span class="admin-name">Welcome, Admin</span>
        </header>

        <!-- Cards -->
        <section class="cards">
            <div class="card">
                <h3>Manage Jobs</h3>
                <p>Create, update and delete job listings.</p>
                <a href="manage_jobs.php" class="btn primary">Open</a>
            </div>

            <div class="card danger">
                <h3>Logout</h3>
                <p>End admin session securely.</p>
                <a href="logout.php" class="btn danger">Logout</a>
            </div>
        </section>

    </main>

</div>

</body>
</html>
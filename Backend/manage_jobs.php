<?php
session_start();
if (!isset($_SESSION['admin'])) {
    header("Location: admin_login.php");
    exit;
}

/* ---------- LOCAL JOBS FILE ---------- */
$localJobsFile = 'jobs.json';

if (!file_exists($localJobsFile)) {
    file_put_contents($localJobsFile, json_encode([]));
}

$localJobs = json_decode(file_get_contents($localJobsFile), true) ?? [];

/* ---------- FIX OLD LOCAL JOBS ---------- */
foreach ($localJobs as &$job) {
    $job['source'] = 'Local';
    $job['priority'] = 1;
}
unset($job);

/* ---------- ADD LOCAL JOB ---------- */
if (isset($_POST['add_job'])) {
    $newJob = [
        'id' => time(),
        'title' => $_POST['title'],
        'company' => $_POST['company'],
        'location' => $_POST['location'],
        'email' => $_POST['email'],
        'date' => date('Y-m-d'),
        'source' => 'Local',
        'priority' => 1
    ];
    $localJobs[] = $newJob;
    file_put_contents($localJobsFile, json_encode($localJobs, JSON_PRETTY_PRINT));
    $success = "Job added successfully!";
}

/* ---------- EDIT LOCAL JOB ---------- */
if (isset($_POST['edit_job'])) {
    foreach ($localJobs as &$job) {
        if ($job['id'] == $_POST['id']) {
            $job['title'] = $_POST['title'];
            $job['company'] = $_POST['company'];
            $job['location'] = $_POST['location'];
            $job['email'] = $_POST['email'];
            break;
        }
    }
    file_put_contents($localJobsFile, json_encode($localJobs, JSON_PRETTY_PRINT));
    $success = "Job updated successfully!";
}

/* ---------- DELETE LOCAL JOB ---------- */
if (isset($_GET['delete'])) {
    $id = $_GET['delete'];
    $localJobs = array_filter($localJobs, fn($job) => $job['id'] != $id);
    file_put_contents($localJobsFile, json_encode(array_values($localJobs), JSON_PRETTY_PRINT));
    $success = "Job deleted successfully!";
}

/* ---------- SORT LOCAL JOBS (PRIORITY FIRST) ---------- */
usort($localJobs, function ($a, $b) {
    return $a['priority'] <=> $b['priority'];
});

/* ---------- FETCH ADZUNA JOBS ---------- */
$appId  = "d4891409";
$appKey = "b1e57f5912bbb13c164d9d8e533407ca";
$apiUrl = "https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=$appId&app_key=$appKey&what=developer&where=India";

$adzunaJobs = [];
try {
    $res = file_get_contents($apiUrl);
    $data = json_decode($res, true);
    $adzunaJobs = $data['results'] ?? [];
} catch (Exception $e) {
    $adzunaJobs = [];
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Manage Jobs</title>
<link rel="stylesheet" href="../admin.css">
<style>
.admin-container { max-width: 1000px; margin: 30px auto; padding: 20px; background: #fff; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
h2,h3{text-align:center;}
.job-form input,button{padding:10px;width:90%;max-width:400px;margin:5px auto;display:block;}
button{background:linear-gradient(135deg,#2575fc,#6a11cb);color:#fff;border:none;border-radius:8px;}
table{width:100%;border-collapse:collapse;margin-top:20px;}
th,td{padding:12px;border-bottom:1px solid #ccc;text-align:center;}
th{background:#2575fc;color:#fff;}
.edit{background:#f39c12;color:#fff;padding:6px 10px;border-radius:5px;text-decoration:none;}
.delete{background:#d9534f;color:#fff;padding:6px 10px;border-radius:5px;text-decoration:none;}
.readonly{color:#999;font-weight:600;}
.local-badge{background:#dcfce7;color:#15803d;padding:4px 8px;border-radius:6px;font-size:12px;font-weight:600;}
.success{text-align:center;color:green;font-weight:bold;margin-bottom:10px;}
</style>
</head>

<body>
<div class="admin-container">

<a href="dashboard.php" style="text-decoration:none;background:#555;color:#fff;padding:8px 14px;border-radius:6px;">← Back to Dashboard</a>

<h2>Manage Jobs</h2>
<?php if(isset($success)) echo "<p class='success'>$success</p>"; ?>

<div class="job-form">
<h3><?= isset($_GET['edit_local']) ? 'Edit Local Job' : 'Add Local Job' ?></h3>

<?php
$editJob = null;
if (isset($_GET['edit_local'])) {
    foreach ($localJobs as $job) {
        if ($job['id'] == $_GET['edit_local']) {
            $editJob = $job;
            break;
        }
    }
}
?>

<form method="POST">
<input type="hidden" name="id" value="<?= $editJob['id'] ?? '' ?>">
<input type="text" name="title" placeholder="Job Title" value="<?= $editJob['title'] ?? '' ?>" required>
<input type="text" name="company" placeholder="Company" value="<?= $editJob['company'] ?? '' ?>" required>
<input type="text" name="location" placeholder="Location" value="<?= $editJob['location'] ?? '' ?>" required>
<input type="email" name="email" placeholder="Company Email" value="<?= $editJob['email'] ?? '' ?>" required>
<button name="<?= $editJob ? 'edit_job' : 'add_job' ?>">
<?= $editJob ? 'Update Job' : 'Add Job' ?>
</button>
</form>
</div>

<table>
<thead>
<tr>
<th>Title</th>
<th>Company</th>
<th>Location</th>
<th>Date</th>
<th>Source</th>
<th>Actions</th>
</tr>
</thead>
<tbody>

<?php foreach ($localJobs as $job): ?>
<tr>
<td><?= htmlspecialchars($job['title']) ?></td>
<td><?= htmlspecialchars($job['company']) ?></td>
<td><?= htmlspecialchars($job['location']) ?></td>
<td><?= $job['date'] ?></td>
<td><span class="local-badge">Local</span></td>
<td>
<a href="?edit_local=<?= $job['id'] ?>" class="edit">Edit</a>
<a href="?delete=<?= $job['id'] ?>" class="delete" onclick="return confirm('Delete job?')">Delete</a>
</td>
</tr>
<?php endforeach; ?>

<?php foreach ($adzunaJobs as $job): ?>
<tr>
<td><?= htmlspecialchars($job['title']) ?></td>
<td><?= htmlspecialchars($job['company']['display_name'] ?? '') ?></td>
<td><?= htmlspecialchars($job['location']['area'][0] ?? '') ?></td>
<td><?= date('Y-m-d', strtotime($job['created'])) ?></td>
<td>Adzuna</td>
<td class="readonly">Read Only</td>
</tr>
<?php endforeach; ?>

</tbody>
</table>

</div>
</body>
</html>
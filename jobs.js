/* ---------- LOAD LOCAL JOBS ---------- */
fetch("Backend/jobs.json")
  .then(res => res.json())
  .then(localJobs => {

    // Ensure priority & source
    localJobs.forEach(job => {
      job.priority = 1;
      job.source = "Local";
    });

    renderLocalJobs(localJobs);
  })
  .catch(err => console.error("Local jobs error:", err));


function renderLocalJobs(jobs) {
  const container = document.getElementById("localJobs");
  container.innerHTML = "";

  if (jobs.length === 0) {
    container.innerHTML = "<p>No local jobs available</p>";
    return;
  }

  jobs.forEach(job => {

    if (!job.email) {
      console.error("Email missing for job:", job);
      return;
    }

    container.innerHTML += `
      <div class="job-box featured-job">
        <div class="job-header">
          <h3>${job.title}</h3>
          <span class="badge">🔥 Local</span>
        </div>

        <p class="company">${job.company}</p>
        <p class="location">${job.location}</p>

        <div class="job-footer">
          <span class="date">📅 ${job.date}</span>

          <button class="apply-btn"
             onclick="applyJob('${job.id || job.title}','${job.title}','${job.company}'); window.location.href='mailto:${job.email}?subject=${encodeURIComponent("Job Application - " + job.title)}'">
             Apply
          </button>
        </div>
      </div>
    `;
  });
}
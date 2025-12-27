async function extractTextFromPDF(file) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = async function (e) {
      const typedArray = new Uint8Array(e.target.result);
      const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item) => item.str).join(" ") + " ";
      }
      resolve(text.toLowerCase());
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

async function MatchJob() {
  const fileInput = document.getElementById("Resume").files[0];
  if (!fileInput) {
    alert("Please upload a PDF resume first!");
    return;
  }

  const text = await extractTextFromPDF(fileInput);

  // Extract skills
  const skills = [
    "javascript",
    "html",
    "css",
    "react",
    "angular",
    "php",
    "java",
    "c#",
    "python",
  ];
  const matchedSkills = skills.filter((skill) => text.includes(skill));

  if (matchedSkills.length === 0) {
    alert(
      "No skills detected in resume. Try adding keywords like JavaScript, Java, etc."
    );
    return;
  }

  // Adzuna API credentials
  const appId = "d4891409";
  const appKey = "b1e57f5912bbb13c164d9d8e533407ca";
  const query = matchedSkills.join(" ");
  const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${appId}&app_key=${appKey}&what=${query}&where=India`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Hide first page, show job page
    document.getElementById("page1").style.display = "none";
    document.getElementById("page2").style.display = "none";
    document.getElementById("Savedjobs").style.display = "none";
    document.getElementById("page3").style.display = "none";
    document.getElementById("jobPage").style.display = "block";
    document.getElementById("homeReviews").style.display = "none";

    const jobList = document.getElementById("jobList");
    jobList.innerHTML = "";

    if (data.results.length === 0) {
      jobList.innerHTML =
        "<p>No jobs found for your skills. Try updating your resume.</p>";
      return;
    }

    data.results.forEach((job) => {
      jobList.innerHTML += `
            <div class="job">

              <strong>${job.title}</strong>
 
              <span>${job.company.display_name}</span><br>

              <p>Location: ${job.location.display_name}</p><br>

             <div class="job-actions">
              <button class="btnjob" onclick="saveJob('${job.id}','${job.title}','${job.company.display_name}')">Save</button>
              <button class="btnjob" onclick="applyJob('${job.id}','${job.title}','${job.company.display_name}')"><a href="${job.redirect_url}" target="_blank">Apply</a></button>
             </div>
            </div>
          `;
    });
  } catch (err) {
    console.error(err);
    alert(
      "Error fetching jobs. Please check your internet or try again later."
    );
  }
}

function showSearchResults(results, keyword) {
    const title = document.getElementById("searchTitle");
    const container = document.getElementById("searchResults");

    title.style.display = "block";
    title.innerHTML = `Results for "<b>${keyword}</b>"`;

    if (results.length === 0) {
        container.innerHTML = `<p>No jobs found.</p>`;
        return;
    }

    container.innerHTML = results
        .map(job => `
            <div style="
                padding: 15px;
                border: 1px solid #ddd;
                border-radius: 10px;
                margin-bottom: 15px;
            ">
                <h3>${job.title}</h3>
                <p><b>Company:</b> ${job.company?.display_name || "N/A"}</p>
                <p><b>Location:</b> ${job.location?.display_name || "N/A"}</p>
                <a href="${job.redirect_url}" target="_blank" style="color:#ed2337;">Apply / View</a>
            </div>
        `)
        .join("");
}

async function searchJob() {
    const keyword = document.getElementById("searchInput").value.trim();

    if (keyword === "") {
        alert("Please enter a job title to search.");
        return;
    }

    const appId = "d4891409";
    const appKey = "b1e57f5912bbb13c164d9d8e533407ca";

    const apiURL = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${appId}&app_key=${appKey}&what=${encodeURIComponent(keyword)}&where=India&content-type=application/json`;

    try {
        const response = await fetch(apiURL);

        if (!response.ok) {
            throw new Error("API failed");
        }

        const data = await response.json();

        // Show job page
        document.getElementById("page1").style.display = "none";
        document.getElementById("page2").style.display = "none";
        document.getElementById("Savedjobs").style.display = "none";
        document.getElementById("page3").style.display = "none";
        document.getElementById("jobPage").style.display = "block";
        document.getElementById("homeReviews").style.display = "none";

        const jobList = document.getElementById("jobList");
        jobList.innerHTML = "";

        if (!data.results || data.results.length === 0) {
            jobList.innerHTML = "<p>No jobs found.</p>";
            return;
        }

        data.results.forEach(job => {
            jobList.innerHTML += `
            <div class="job">

              <strong>${job.title}</strong>
 
              <span>${job.company.display_name}</span><br>

              <p>Location: ${job.location.display_name}</p><br>

             <div class="job-actions">
              <button class="btnjob" onclick="saveJob('${job.id}','${job.title}','${job.company.display_name}')">Save</button>
              <button class="btnjob" onclick="applyJob('${job.id}','${job.title}','${job.company.display_name}')"><a href="${job.redirect_url}" target="_blank">Apply</a></button>
             </div>
            </div>
            `;
        });

    } catch (error) {
        console.error(error);
        alert("Error fetching search results. Try again.");
    }
}

function reviewPage(){
let rating = 0;

/* STAR RATING */
document.querySelectorAll(".rating-input span").forEach((star, index) => {
  star.addEventListener("click", () => {
    rating = index + 1;
    document.querySelectorAll(".rating-input span").forEach(s => s.classList.remove("active"));
    for (let i = 0; i < rating; i++) {
      document.querySelectorAll(".rating-input span")[i].classList.add("active");
    }
  });
});

/* SAVE REVIEW (Review Page Only) */
const form = document.getElementById("reviewForm");
if (form) {
  form.addEventListener("submit", e => {
    e.preventDefault();

    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    const review = {
      name: reviewName.value,
      text: reviewText.value,
      rating: rating,
      date: new Date().toLocaleDateString()
    };

    const reviews = JSON.parse(localStorage.getItem("jobsyReviews")) || [];
    reviews.unshift(review);
    localStorage.setItem("jobsyReviews", JSON.stringify(reviews));

    alert("Review submitted successfully!");
    form.reset();
    rating = 0;
    document.querySelectorAll(".rating-input span").forEach(s => s.classList.remove("active"));
  });
}

/* SHOW REVIEWS ON HOME */
const homeContainer = document.getElementById("homeReviewCards");
if (homeContainer) {
  const reviews = JSON.parse(localStorage.getItem("jobsyReviews")) || [];

  reviews.slice(0, 3).forEach(r => {
    homeContainer.innerHTML += `
      <div class="review-card">
        <h4>${r.name}</h4>
        <div class="stars">${"★".repeat(r.rating)}</div>
        <p>${r.text}</p>
        <small>${r.date}</small>
      </div>
    `;
  });
}

function handleNavChange() {
  const select = document.getElementById("navSelect");
  const value = select.value;

  if (!value) return;

  if (value.startsWith("#")) {
    document.querySelector(value).scrollIntoView({
      behavior: "smooth"
    });
  } else {
    window.location.href = value;
  }

  select.selectedIndex = 0;
}
}

reviewPage();

function saveJob(jobId, title, company) {
  fetch("Backend/save_job.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `job_id=${encodeURIComponent(jobId)}&title=${encodeURIComponent(
      title
    )}&company=${encodeURIComponent(company)}`,
  })
    .then((res) => res.text())
    .then((data) => {
      alert(data);
    })
    .catch((err) => {
      console.error("Save failed:", err);
      alert("Failed to save job.");
    });
}

function applyJob(jobId, title, company) {
  fetch("Backend/apply_job.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `job_id=${jobId}&title=${title}&company=${company}`,
  })
    .then((res) => res.text())
    .then((data) => alert("Application submitted!"))
    .catch((err) => console.error("Error applying job:", err));
}

function showSavedJobs() {
  document.getElementById("jobPage").style.display = "none";
  document.getElementById("savedJobs").style.display = "block";

  fetch("Backend/get_saved_jobs.php")
    .then((res) => res.json())
    .then((jobs) => {
      const list = document.getElementById("savedJobList");
      list.innerHTML = jobs
        .map(
          (j) => `
        <div class="saved-job-card">
          <strong>${j.title}</strong> - ${j.company}
          <span>Saved on: ${j.saved_at}</span>
        </div>
      `
        )
        .join("");
    });
}

function showApplications() {
  document.getElementById("jobPage").style.display = "none";
  document.getElementById("applicationHistory").style.display = "block";

  fetch("Backend/get_applications.php")
    .then((res) => res.json())
    .then((apps) => {
      const list = document.getElementById("applicationList");
      list.innerHTML = apps
        .map(
          (a) => `
        <tr>
          <td>${a.title}</td>
          <td>${a.company}</td>
          <td>${a.status}</td>
          <td>${a.applied_at}</td>
        </tr>
      `
        )
        .join("");
    });
}

function goBack() {
  document.getElementById("page1").style.display = "flex";
  document.getElementById("page2").style.display = "grid";
  document.getElementById("Savedjobs").style.display = "flex";
  document.getElementById("page3").style.display = "flex";
  document.getElementById("jobPage").style.display = "none";
  document.getElementById("homeReviews").style.display = "block";
}

const sectors = [
  "software developer",
  "digital marketing",
  "finance",
  "graphic designer",
];

async function loadSectorJobs() {
  showSavedJobs();
  showApplications();
  const appId = "d4891409";
  const appKey = "b1e57f5912bbb13c164d9d8e533407ca";
  const container = document.getElementById("sectorGrid");
  container.innerHTML = "";

  for (const sector of sectors) {
    const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${appId}&app_key=${appKey}&what=${sector}&where=India&results_per_page=5`;
    try {
      const res = await fetch(url);
      const data = await res.json();

      let jobsHTML = "";
      data.results.slice(0, 3).forEach((job) => {
        jobsHTML += `
          <div class="jobCard">
            <strong>${job.title}</strong><br>
            <span>${job.company.display_name}</span><br>
            <p>${job.location.display_name}</p>
            <a href="${job.redirect_url}" target="_blank">Apply</a>
          </div>
        `;
      });

      container.innerHTML += `
        <div class="sectorBox">
          <h3>${sector} Jobs</h3>
          ${jobsHTML || "<p>No jobs found.</p>"}
        </div>
      `;
    } catch (err) {
      console.error(`Error loading ${sector} jobs`, err);
    }
  }
}

// Run automatically when the page loads
window.onload = loadSectorJobs;

function PreLoader() {
  const preLoader = document.querySelector(".preloader");
  const Loader = document.querySelector("#loader");

  let tl = gsap.timeline();

  tl.to("#loader", {
    transform: "translateY(-50%)",
    scale: 1,
    duration: 0.5,
    ease: "power2.inOut",
  });

  tl.to("#loader", {
    transfrom: "translateY(50%)",
    scale: 2,
    duration: 0.5,
    ease: "power2.inOut",
  });

  tl.to("#loader", {
    transform: "scaleX(-50)",
    scale: 5,
    duration: 0.5,
    ease: "power2.inOut",
  });

  tl.to("#loader", {
    borderRadius: "10px",
    scale: 10,
    duration: 0.5,
    ease: "power2.inOut",
  });

  tl.to("#loader", {
    scale: 15,
    duration: 1.5,
    ease: "power2.inOut",
  });

  tl.to(".preloader", {
    opacity: 0,
    duration: 0.8,
    pointerEvents: "none",
    onComplete: () => (preLoader.style.display = "none"),
  });

  tl.from("nav", "#page1", {
    opacity: 0,
    duration: -1,
  });
}

PreLoader();
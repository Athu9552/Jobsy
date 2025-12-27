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

        document.getElementById("fetures").style.display = "none";
        document.getElementById("jobPage").style.display = "block";

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
                    <span>${job.company.display_name}</span>
                    <p>${job.location.display_name}</p>

                    <div class="job-actions">
                        <button class="btn1" onclick="alert('Save needs backend')">Save</button>
                        <button class="btn1"><a href="${job.redirect_url}" target="_blank">Apply</a></button>
                    </div>
                </div>
            `;
        });

    } catch (error) {
        console.error(error);
        alert("Error fetching search results. Try again.");
    }
}

function goBack() {
  document.getElementById("fetures").style.display = "flex";
  document.getElementById("jobPage").style.display = "none";
}

let lastExtractedText = "";
const fileInput = document.getElementById("fileInput");
const extractBtn = document.getElementById("extractBtn");
const extractedText = document.getElementById("extractedText");
const extractedArea = document.getElementById("extractedTextArea");
const detectedSkillsEl = document.getElementById("detectedSkills");
const predictedRoleEl = document.getElementById("predictedRole");
const resumeScoreEl = document.getElementById("resumeScore");
const progressBar = document.getElementById("progressBar");

function setProgress(p) {
  progressBar.style.width = p + "%";
}

extractBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];
  if (!file) {
    alert("Select a PDF first");
    return;
  }
  setProgress(5);
  const arrayBuffer = await file.arrayBuffer();
  setProgress(15);

  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    fullText += "\n" + content.items.map((it) => it.str).join(" ");
    setProgress(15 + Math.round((i / pdf.numPages) * 70));
  }

  lastExtractedText = fullText;
  extractedArea.hidden = false;
  extractedText.value = fullText;
  analyzeText(fullText);
  setProgress(100);
  setTimeout(() => setProgress(0), 500);
});

function analyzeText(text) {
  const lowered = text.toLowerCase();
  const SKILLS = [
    "html", "css", "javascript", "react", "node", "express", "java", "spring",
    "sql", "mysql", "mongodb", "python", "pandas", "numpy", "git", "docker",
    "aws", "figma", "ui", "ux", "c++", "c", "php", "typescript", "angular"
  ];
  const found = SKILLS.filter((s) => lowered.includes(s));
  detectedSkillsEl.innerHTML =
    "<strong>Skills:</strong> " +
    (found.length
      ? found.map((s) => `<span class="skill">${s}</span>`).join("")
      : "None");

  const roleMap = {
    Frontend: ["html", "css", "javascript", "react", "angular", "typescript"],
    Backend: ["java", "spring", "node", "express", "sql", "mongodb"],
    Data: ["python", "pandas", "numpy", "sql"],
    Design: ["figma", "ui", "ux"],
  };
  const roleScores = {};
  Object.keys(roleMap).forEach((r) => {
    roleScores[r] = roleMap[r].filter((k) => found.includes(k)).length;
  });
  const best = Object.entries(roleScores).sort((a, b) => b[1] - a[1])[0];
  const predicted = best && best[1] > 0 ? best[0] : "General";
  predictedRoleEl.innerHTML = `<strong>Predicted Role:</strong> ${predicted}`;

  let score = 20 + Math.min(found.length * 8, 40);
  if (/experience|internship|intern|worked/i.test(text)) score += 15;
  if (/projects|github|portfolio/i.test(text)) score += 15;
  if (/bachelor|master|degree|college|university/i.test(text)) score += 10;
  if (score > 100) score = 100;
  resumeScoreEl.innerHTML = `<strong>Resume Score:</strong> ${score} / 100`;
}

document.getElementById("downloadReport").addEventListener("click", () => {
  if (!lastExtractedText) {
    alert("Extract resume first");
    return;
  }
  const report = document.createElement("div");
  report.style.padding = "20px";
  report.style.fontFamily = "Arial, sans-serif";
  report.style.color = "#000";
  report.innerHTML = `
    <h2>Resume Analysis Report</h2>
    <p>${predictedRoleEl.innerHTML}</p>
    <p>${resumeScoreEl.innerHTML}</p>
    <h4>Detected Skills:</h4>
    <div>${detectedSkillsEl.innerHTML}</div>
    <h4>Extracted Text:</h4>
    <pre style="white-space:pre-wrap">${lastExtractedText}</pre>
  `;
  document.body.appendChild(report);
  html2pdf()
    .set({
      margin: 10,
      filename: "resume-report.pdf",
      html2canvas: { scale: 2 },
    })
    .from(report)
    .save()
    .finally(() => report.remove());
});

extractedText.addEventListener("input", () => {
  lastExtractedText = extractedText.value;
});
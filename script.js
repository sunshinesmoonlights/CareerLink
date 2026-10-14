const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const toast = $("#toast");
let toastTimer;
function notify(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}
function openModal(title, description, details, primary = "Got it") {
  $("#modalTitle").textContent = title;
  $("#modalDescription").textContent = description;
  $("#modalDetails").innerHTML = details;
  $("#modalPrimary").innerHTML = `${primary} <span>↗</span>`;
  $("#modalBackdrop").classList.remove("hidden");
}
function closeModal() {
  $("#modalBackdrop").classList.add("hidden");
}
$("#modalClose").addEventListener("click", closeModal);
$("#modalCancel").addEventListener("click", closeModal);
$("#modalBackdrop").addEventListener("click", (e) => {
  if (e.target.id === "modalBackdrop") closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});
$("#modalPrimary").addEventListener("click", () => {
  const title = $("#modalTitle").textContent;
  closeModal();
  notify(
    title.toLowerCase().includes("job") ||
      title.toLowerCase().includes("intern") ||
      title.toLowerCase().includes("analyst")
      ? "Application flow is not connected."
      : "You’re all set!",
  );
});

const pageCopy = {
  Overview: [
    "Good morning, Snehal ✳",
    "Your next opportunity could be one click away. Here's your career at a glance.",
  ],
  Jobs: [
    "Find your next opportunity",
    "Explore roles picked to match your interests and skills.",
  ],
  Applications: [
    "My applications",
    "Keep track of the opportunities you’ve applied for.",
  ],
  Assessments: [
    "Assessments",
    "Prepare for upcoming tests and keep your recruitment journey on track.",
  ],
  Events: [
    "Events & drives",
    "Your campus recruitment calendar, all in one place.",
  ],
  Profile: [
    "My profile",
    "A strong profile helps recruiters discover what makes you unique.",
  ],
  Documents: [
    "Your documents",
    "Keep your resume and other application documents organised.",
  ],
  Resources: [
    "Career resources",
    "Practical resources to help you feel ready for your next step.",
  ],
  Settings: ["Settings", "Manage your CareerLink demo preferences."],
  Help: [
    "Help center",
    "Find guidance for using your CareerLink student portal.",
  ],
  Privacy: ["Privacy", "Your data stays in this browser session."],
};
function setPage(page) {
  const copy = pageCopy[page] || pageCopy.Overview;
  $("#currentPage").textContent = page;
  $("#pageHeading").textContent = copy[0];
  $("#pageSubtitle").textContent = copy[1];
  $$(".nav-item[data-page]").forEach((b) =>
    b.classList.toggle("active", b.dataset.page === page),
  );
  $("#sidebar").classList.remove("open");
  if (page === "Jobs") {
    $("#jobsPanel").scrollIntoView({ behavior: "smooth", block: "start" });
  } else if (page !== "Overview") {
    openModal(
      page,
      copy[1],
      `<strong>CareerLink</strong><br>`,
      "Cancel",
    );
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
$$("[data-page]").forEach((el) =>
  el.addEventListener("click", (e) => {
    e.preventDefault();
    setPage(el.dataset.page);
  }),
);
$$("[data-goto]").forEach((el) =>
  el.addEventListener("click", () => setPage(el.dataset.goto)),
);
$("#mobileMenu").addEventListener("click", () =>
  $("#sidebar").classList.toggle("open"),
);
$("#resourceBtn").addEventListener("click", () => setPage("Resources"));
$("#browseJobsBtn").addEventListener("click", () => setPage("Jobs"));
$("#viewAllJobs").addEventListener("click", () => setPage("Jobs"));
$("#loadMore").addEventListener("click", () =>
  notify("You’re viewing all featured opportunities."),
);
$("#notificationBtn").addEventListener("click", () =>
  openModal(
    "Notifications",
    "You’re all caught up on your CareerLink updates.",
    "<strong>Recent activity</strong><br>• Your profile is 80% complete.<br>• Infosys coding assessment is due in 2 days.<br>• 3 new roles match your interests.",
    "Done",
  ),
);
$("#userMenuBtn").addEventListener("click", () =>
  openModal(
    "Student account",
    "Signed in as Snehal Bhosle.",
    "<strong>Demo account</strong><br>Account settings and sign-out are simulated in this front-end prototype.",
    "Close",
  ),
);
$("#calendarBtn").addEventListener("click", () => setPage("Events"));
$("#allActivity").addEventListener("click", () => setPage("Events"));
$("#announcementBtn").addEventListener("click", () =>
  openModal(
    "Placement season checklist",
    "A few small steps can make your next application stronger.",
    "<strong>Your checklist</strong><br>✓ Keep your resume to one or two pages.<br>✓ Review the job description before applying.<br>✓ Practise aptitude and coding fundamentals.<br>✓ Check assessment dates and instructions.",
    "Let’s do this",
  ),
);
$("#downloadBtn").addEventListener("click", () => {
  const summary =
    "CareerLink — Student Career Summary\\nStudent: Snehal Bhosle\\nApplications sent: 12\\nIn progress: 4\\nAssessments completed: 3/5\\nProfile completion: 80%\\n\\nThis is a sample front-end demo summary.";
  const blob = new Blob([summary], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "careerlink-summary.txt";
  a.click();
  URL.revokeObjectURL(url);
  notify(" ");
});

let activeFilter = "All";
function filterJobs() {
  const query = $("#globalSearch").value.trim().toLowerCase();
  let visible = 0;
  $$(".job-card").forEach((card) => {
    const type = card.dataset.type;
    const searchable = (
      card.dataset.search +
      " " +
      card.innerText
    ).toLowerCase();
    const matchesFilter =
      activeFilter === "All" ||
      (activeFilter === "Remote"
        ? searchable.includes("remote")
        : type === activeFilter ||
          (activeFilter === "Full-time" && searchable.includes("full-time")));
    const matchesSearch = !query || searchable.includes(query);
    card.classList.toggle("hidden", !(matchesFilter && matchesSearch));
    if (matchesFilter && matchesSearch) visible++;
  });
  $("#emptyJobs").classList.toggle("hidden", visible !== 0);
  $("#loadMore").classList.toggle("hidden", visible === 0);
}
$$(".filter-chip").forEach((chip) =>
  chip.addEventListener("click", () => {
    $$(".filter-chip").forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    activeFilter = chip.dataset.filter;
    filterJobs();
  }),
);
$("#globalSearch").addEventListener("input", filterJobs);
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    $("#globalSearch").focus();
  }
});
$$(".bookmark-btn").forEach((btn) =>
  btn.addEventListener("click", () => {
    btn.classList.toggle("saved");
    btn.textContent = btn.classList.contains("saved") ? "♥" : "♡";
    notify(
      btn.classList.contains("saved")
        ? "Job saved to your shortlist."
        : "Job removed from your shortlist.",
    );
  }),
);
$$(".job-open").forEach((btn) =>
  btn.addEventListener("click", () => {
    const card = btn.closest(".job-card");
    const title = $("h3", card).textContent;
    const company = $(".company-line", card)
      .textContent.replace(/\s+/g, " ")
      .trim();
    const meta = $(".job-meta", card).innerText.replace(/\n/g, " · ");
    openModal(
      title,
      `${company} — a sample opportunity selected for your profile.`,
      `<strong>Opportunity overview</strong><br>${meta}<br><br><strong>What you’ll do</strong><br>Collaborate with a team, learn on the job, and contribute to real projects.<br><br><em></em>`,
      "Apply now",
    );
  }),
);
$$(".activity-item .arrow-btn").forEach((btn) =>
  btn.addEventListener("click", () => {
    const title = $("strong", btn.closest(".activity-item")).textContent;
    openModal(
      title,
      "Here are the details for this upcoming campus activity.",
      "<strong>Reminder</strong><br>Add this date to your personal calendar and check your college placement announcements for official instructions.",
      "Got it",
    );
  }),
);
$$(".filter-chip").forEach((c) => {
  if (c.dataset.filter === "Remote") c.title = "Show roles tagged Remote";
});

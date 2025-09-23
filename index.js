// index.js
"use strict";

let proj = null;

// Load projects JSON and render the list (if #projects exists on the page)
fetch("index.json")
  .then((r) => r.json())
  .then((projects) => {
    proj = projects;
    parseData(projects);
    wireFilters();
  })
  .catch((err) => console.log("error", err));

/**
 * Insert project cards into #projects (if present).
 * Fixes the missing ">" on the <a> tag from the original template.
 */
function parseData(data) {
  const root = document.getElementById("projects");
  if (!root || !data || !data.projects) return;

  let html = "";
  for (let i = 0; i < data.projects.length; i++) {
    const p = data.projects[i];
    html += `
      <a href="${p.subdomain}.html">
        <div class="row project" id="${p.subdomain}">
          <div class="description">
            <h2>${p.name}</h2>
            <p class="subtitle">${p.subtitle || ""}</p>
            <p>${p.abstract || ""}</p>
          </div>
        </div>
      </a>
    `;
  }
  root.innerHTML = html;
}

/**
 * Attach click handlers to filter buttons if the #buttons container exists.
 */
function wireFilters() {
  const container = document.getElementById("buttons");
  if (!container) return;

  const buttons = container.querySelectorAll("button");
  if (!buttons.length) return;

  buttons.forEach((b) => {
    b.addEventListener("click", (e) => {
      sortProjects(e.target.value);
    });
  });
}

/**
 * Show/hide projects by category based on the clicked filter button.
 * - "clear": show all
 * - "filter": no-op (just opens dropdown)
 * - otherwise: match category
 */
function sortProjects(button) {
  if (!proj || !proj.projects) return;

  if (button === "clear") {
    for (let i = 0; i < proj.projects.length; i++) {
      const id = proj.projects[i].subdomain;
      const el = document.getElementById(id);
      if (el) el.style.display = "flex";
    }
    return;
  }

  if (button === "filter" || typeof button === "undefined") {
    // No change to visibility when clicking the main Filter button
    return;
  }

  for (let i = 0; i < proj.projects.length; i++) {
    const p = proj.projects[i];
    const match = (p.category || []).includes(button);
    const el = document.getElementById(p.subdomain);
    if (el) el.style.display = match ? "flex" : "none";
  }
}

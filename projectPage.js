let proj;

fetch('index.json')
  .then(response => response.json())
  .then(projects => {
    proj = projects;
    loadProjectPage();
  })
  .catch(err => console.log(`Error: ${err}`));

function loadProjectPage() {
  const filename = window.location.pathname.split("/").pop();
  const subdomain = filename.replace(".html", "");
  const project = proj.projects.find(p => p.subdomain === subdomain);

  const mount = document.getElementById('project-content');
  if (!mount) return;

  if (project) {
    document.title = project.name;

    mount.innerHTML = `
      <div class="project-head">
        <h1>${project.name}</h1>
        <h2>${project.subtitle || ''}</h2>
      </div>

      <div class="project-carousel">
        <div class="main-image">
          <img id="main-img" src="images/${project.mainimg}" alt="${project.name}">
        </div>
        <div class="thumbnail-images">
          ${(project.images || []).map(img => `
            <img class="thumbnail" src="images/${img}" alt="${project.name}">
          `).join('')}
        </div>
      </div>

      <div class="project-abstract">
        <p><strong>Abstract:</strong> ${project.abstract || ''}</p>
      </div>

      <div class="citations">
        ${renderCitations(project.citations || [])}
      </div>
    `;

    // swap main image on thumb click
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImg = document.getElementById('main-img');
    thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', function () {
        mainImg.src = this.src;
        mainImg.alt = this.alt;
      });
    });
  } else {
    mount.innerHTML = "<p>Project not found.</p>";
  }
}

function renderCitations(citations) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return citations.map(citation =>
    citation.replace(urlRegex, m => `<a href="${m}" target="_blank" rel="noopener">${m}</a>`)
  ).join('<br>');
}

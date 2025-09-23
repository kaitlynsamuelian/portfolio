// projects.js
let data = null;

async function load() {
  const res = await fetch('index.json');
  data = await res.json();
  renderCards(data.projects);
  bindFilters();
}

function cardHTML(p) {
  const href = `${p.subdomain}.html`; // links to your detail pages
  const img = p.mainimg ? `images/${p.mainimg}` : 'images/placeholder.png';
  const tags = (p.category || []).map(c => `<span class="tag">${c}</span>`).join('');
  return `
    <div class="card-wrap">
      <article class="card">
        <img class="thumb" src="${img}" alt="${p.name}">
        <div class="card-body">
          <h3>${p.name}</h3>
          <p class="sub">${p.subtitle || ''}</p>
          <div class="tags">${tags}</div>
        </div>
      </article>
      <a class="stretch" href="${href}" aria-label="${p.name}"></a>
    </div>
  `;
}

function renderCards(list){
  const grid = document.getElementById('grid');
  grid.innerHTML = list.map(cardHTML).join('');
}

function bindFilters(){
  const buttons = document.querySelectorAll('.filters button');
  buttons.forEach(b=>{
    b.addEventListener('click', ()=>{
      buttons.forEach(x=>x.classList.remove('on'));
      b.classList.add('on');
      const f = b.dataset.filter;
      if (f === 'all') return renderCards(data.projects);
      renderCards(data.projects.filter(p => (p.category||[]).includes(f)));
    });
  });
}

load();

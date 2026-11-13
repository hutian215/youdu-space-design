const PROJECTS_URL = "data/projects.json";
const grid = document.getElementById("project-grid");
const dialog = document.getElementById("project-dialog");
const dialogContent = document.getElementById("dialog-content");
document.getElementById("year").textContent = new Date().getFullYear();

const escapeHTML = (value="") => String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let projects = [];

function renderProjects(filter="全部") {
  const visible = projects.filter(p => p.published !== false && (filter === "全部" || p.category === filter));
  if (!visible.length) {
    grid.innerHTML = '<div class="empty-state"><span class="empty-mark">YU</span><h3>让每一个空间故事，从这里开始。</h3><p>真实项目正在整理中，敬请期待。</p></div>';
    return;
  }
  grid.innerHTML = visible.map((p) => {
    const cover = p.cover || (Array.isArray(p.gallery) ? p.gallery[0] : "");
    return '<article class="project-card" data-slug="'+escapeHTML(p.slug||"")+'"><img class="project-cover" src="'+escapeHTML(cover)+'" alt="'+escapeHTML(p.title)+'" loading="lazy"><div class="project-meta"><div><h3 class="project-title">'+escapeHTML(p.title)+'</h3><p class="project-sub">'+[p.area,p.style,p.location].filter(Boolean).map(escapeHTML).join(" · ")+'</p></div><span class="project-type">'+escapeHTML(p.category||"设计作品")+'</span></div></article>';
  }).join("");
  grid.querySelectorAll(".project-card").forEach(card => card.addEventListener("click", () => openProject(card.dataset.slug)));
}
function openProject(slug) {
  const p = projects.find(item => item.slug === slug);
  if (!p) return;
  const gallery = [p.cover, ...(p.gallery||[])].filter(Boolean);
  dialogContent.innerHTML = '<p class="eyebrow">YOUDU SPACE DESIGN / PROJECT</p><h2 class="dialog-title">'+escapeHTML(p.title)+'</h2><p class="project-sub">'+[p.area,p.style,p.location,p.category].filter(Boolean).map(escapeHTML).join(" · ")+'</p><p class="dialog-copy">'+escapeHTML(p.summary||"")+'</p>'+(p.concept?'<h3>设计理念</h3><p class="dialog-copy">'+escapeHTML(p.concept)+'</p>':"")+'<div class="dialog-gallery">'+gallery.map(src=>'<img src="'+escapeHTML(src)+'" alt="'+escapeHTML(p.title)+'" loading="lazy">').join("")+'</div>';
  dialog.showModal();
}
document.querySelectorAll(".filter").forEach(btn => btn.addEventListener("click", () => {
  document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
  renderProjects(btn.dataset.filter);
}));
document.querySelector(".dialog-close").addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});
const toggle=document.querySelector(".menu-toggle");
const nav=document.querySelector(".main-nav");
toggle.addEventListener("click",()=>{const open=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open));});
nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");toggle.setAttribute("aria-expanded","false")}));
fetch(PROJECTS_URL).then(r=>{if(!r.ok)throw new Error("projects unavailable");return r.json()}).then(data=>{projects=Array.isArray(data)?data:[];renderProjects()}).catch(()=>renderProjects());
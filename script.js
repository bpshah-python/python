// script.js — powers index.html

let activeCategory = "All";
let query = "";

function categoriesFrom(programs) {
  const cats = {};
  programs.forEach(p => { cats[p.category] = (cats[p.category] || 0) + 1; });
  return cats;
}

function renderSidebar(programs) {
  const cats = categoriesFrom(programs);
  const listDesktop = document.getElementById("filterList");
  const listMobile = document.getElementById("filterListMobile");
  const entries = [["All", programs.length], ...Object.entries(cats).sort()];

  const html = entries.map(([name, count]) => `
    <li>
      <button class="${name === activeCategory ? "active" : ""}" data-cat="${escapeHtml(name)}">
        <span>${escapeHtml(name)}</span>
        <span class="count">${count}</span>
      </button>
    </li>
  `).join("");

  if (listDesktop) {
    listDesktop.innerHTML = html;
    listDesktop.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        activeCategory = btn.dataset.cat;
        renderAll();
      });
    });
  }

  if (listMobile) {
    listMobile.innerHTML = html;
    listMobile.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        activeCategory = btn.dataset.cat;
        closeTopicsSheet();
        renderAll();
      });
    });
  }
}

function matches(program) {
  const inCat = activeCategory === "All" || program.category === activeCategory;
  if (!inCat) return false;
  if (!query.trim()) return true;
  const q = query.toLowerCase();
  return (
    program.title.toLowerCase().includes(q) ||
    program.description.toLowerCase().includes(q) ||
    program.category.toLowerCase().includes(q)
  );
}

function fileNameFor(program) {
  const slug = program.title.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
  return `ex${program.num}_${slug}.py`;
}

function renderPrograms(programs) {
  const wrap = document.getElementById("programList");
  const filtered = programs.filter(matches);

  if (!filtered.length) {
    wrap.innerHTML = `<div class="empty-state">No exercises match your search.</div>`;
    return;
  }

  wrap.innerHTML = filtered.map(p => `
    <div class="card" id="card-${p.id}">
      <div class="card-head" data-toggle="${p.id}">
        <span class="card-num">${String(p.num).padStart(2, "0")}</span>
        <div class="card-titles">
          <div class="card-title">${escapeHtml(p.title)}</div>
          <div class="card-desc">${escapeHtml(p.description)}</div>
        </div>
        <span class="card-tag">${escapeHtml(p.category)}</span>
        <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
      </div>
      <div class="card-body">
        <div class="code-window">
          <div class="code-window-bar">
            <span class="code-window-name">${escapeHtml(fileNameFor(p))}</span>
          </div>
          <pre class="code"><code>${highlightPython(p.code)}</code></pre>
        </div>
      </div>
    </div>
  `).join("");

  wrap.querySelectorAll("[data-toggle]").forEach(head => {
    head.addEventListener("click", () => {
      document.getElementById(`card-${head.dataset.toggle}`).classList.toggle("open");
    });
  });
}


function renderStats(programs) {
  document.getElementById("statTotal").textContent = programs.length;
  document.getElementById("statCats").textContent = Object.keys(categoriesFrom(programs)).length;
}

function renderAll() {
  const programs = getAllPrograms();
  renderSidebar(programs);
  renderPrograms(programs);
  renderStats(programs);
}

// Topics Bottom Sheet Toggle Helpers
function openTopicsSheet() {
  document.getElementById("topicsSheet").classList.add("active");
  document.getElementById("topicsSheetOverlay").classList.add("active");
  document.body.style.overflow = "hidden"; // Prevent background scroll
}

function closeTopicsSheet() {
  document.getElementById("topicsSheet").classList.remove("active");
  document.getElementById("topicsSheetOverlay").classList.remove("active");
  document.body.style.overflow = "";
}

document.addEventListener("DOMContentLoaded", () => {
  renderAll();

  // Search input listeners
  const search = document.getElementById("searchInput");
  const clearBtn = document.getElementById("clearSearchBtn");

  function updateSearch(val) {
    query = val;
    search.value = val;
    clearBtn.style.display = val ? "inline-flex" : "none";
    renderPrograms(getAllPrograms());
  }

  if (search) {
    search.addEventListener("input", (e) => {
      updateSearch(e.target.value);
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      updateSearch("");
      search.focus();
    });
  }

  // Bottom Nav & Sheet Event Listeners
  const navHomeBtn = document.getElementById("navHomeBtn");
  const navTopicsBtn = document.getElementById("navTopicsBtn");
  const closeTopicsBtn = document.getElementById("closeTopicsBtn");
  const topicsSheetOverlay = document.getElementById("topicsSheetOverlay");

  if (navHomeBtn) {
    navHomeBtn.addEventListener("click", () => {
      activeCategory = "All";
      updateSearch("");
      renderAll();
      window.scrollTo({ top: 0, behavior: "smooth" });
      
      // Update active nav button
      document.querySelectorAll(".bottom-nav-item").forEach(el => el.classList.remove("active"));
      navHomeBtn.classList.add("active");
    });
  }

  if (navTopicsBtn) {
    navTopicsBtn.addEventListener("click", () => {
      openTopicsSheet();
    });
  }

  if (closeTopicsBtn) {
    closeTopicsBtn.addEventListener("click", closeTopicsSheet);
  }

  if (topicsSheetOverlay) {
    topicsSheetOverlay.addEventListener("click", closeTopicsSheet);
  }

  // Handle redirect from admin/other pages that want to open topics sheet directly
  if (new URLSearchParams(window.location.search).get("openTopics") === "true") {
    openTopicsSheet();
    const newUrl = window.location.pathname;
    window.history.replaceState({}, document.title, newUrl);
  }

  // Prevent copying in any way
  document.addEventListener('contextmenu', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    e.preventDefault();
  });

  document.addEventListener('copy', e => {
    if (window.getSelection().anchorNode && 
        (window.getSelection().anchorNode.parentNode.tagName === 'INPUT' || 
         window.getSelection().anchorNode.parentNode.tagName === 'TEXTAREA' ||
         window.getSelection().anchorNode.tagName === 'INPUT' ||
         window.getSelection().anchorNode.tagName === 'TEXTAREA')) {
      return;
    }
    e.preventDefault();
    toast("Copying is disabled on this site!");
  });

  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    // Ctrl+C / Cmd+C
    if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
      e.preventDefault();
      toast("Copying is disabled!");
    }
    // Ctrl+U / Cmd+U (View Source)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) {
      e.preventDefault();
    }
    // F12 (Inspect Element)
    if (e.key === 'F12') {
      e.preventDefault();
    }
  });
});

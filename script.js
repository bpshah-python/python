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
  const list = document.getElementById("filterList");
  const entries = [["All", programs.length], ...Object.entries(cats).sort()];

  list.innerHTML = entries.map(([name, count]) => `
    <li>
      <button class="${name === activeCategory ? "active" : ""}" data-cat="${escapeHtml(name)}">
        <span>${escapeHtml(name)}</span>
        <span class="count">${count}</span>
      </button>
    </li>
  `).join("");

  list.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.cat;
      renderAll();
    });
  });
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
            <button class="copy-btn" data-copy="${p.id}">Copy</button>
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

  wrap.querySelectorAll("[data-copy]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const program = programs.find(p => p.id === btn.dataset.copy);
      copyToClipboard(program.code).then(() => {
        const original = btn.textContent;
        btn.textContent = "Copied!";
        toast("Code copied to clipboard");
        setTimeout(() => (btn.textContent = original), 1200);
      }).catch(err => {
        console.error("Copy failed", err);
        btn.textContent = "Error";
        setTimeout(() => (btn.textContent = "Copy"), 1200);
      });
    });
  });
}

function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  } else {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    return new Promise((resolve, reject) => {
      try {
        const successful = document.execCommand('copy');
        if (successful) resolve(); else reject(new Error("execCommand returned false"));
      } catch (err) {
        reject(err);
      }
      textArea.remove();
    });
  }
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

document.addEventListener("DOMContentLoaded", () => {
  renderAll();

  const search = document.getElementById("searchInput");
  const clearBtn = document.getElementById("clearSearchBtn");

  function updateSearch(val) {
    query = val;
    search.value = val;
    clearBtn.style.display = val ? "inline-flex" : "none";
    renderPrograms(getAllPrograms());
  }

  search.addEventListener("input", (e) => {
    updateSearch(e.target.value);
  });

  clearBtn.addEventListener("click", () => {
    updateSearch("");
    search.focus();
  });
});

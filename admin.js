// admin.js — powers admin.html
//
// NOTE ON SECURITY: this site has no server or database, so there is no
// real authentication here — the "password" only hides the panel from
// casual visitors and is visible to anyone who reads this file. Do not
// rely on it to protect sensitive content. Anything typed into the form
// below is saved in *this browser's* local storage; use Export to turn
// it into a permanent, site-wide addition (see the panel at the bottom).

const ADMIN_PASSWORD = "python2026"; // change this to your own password
const SESSION_KEY = "pylab_admin_session";

let editingId = null;

function isLoggedIn() {
  return sessionStorage.getItem(SESSION_KEY) === "1";
}

function renderLogin() {
  document.getElementById("loginView").style.display = "block";
  document.getElementById("panelView").style.display = "none";
}

function renderPanel() {
  document.getElementById("loginView").style.display = "none";
  document.getElementById("panelView").style.display = "block";
  renderCategoryOptions();
  renderList();
}

function renderCategoryOptions() {
  const select = document.getElementById("fCategory");
  const cats = [...new Set(getAllPrograms().map(p => p.category))].sort();
  const current = select.value;
  select.innerHTML = cats.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("")
    + `<option value="__new">+ New topic…</option>`;
  if (cats.includes(current)) select.value = current;
}

function renderList() {
  const all = getAllPrograms();
  const customIds = new Set(getCustomPrograms().map(p => p.id));
  const list = document.getElementById("adminList");

  list.innerHTML = all.map(p => `
    <div class="admin-row">
      <div class="info">
        <div class="t">${String(p.num).padStart(2, "0")}. ${escapeHtml(p.title)}
          <span class="badge-source ${customIds.has(p.id) ? "custom" : ""}">${customIds.has(p.id) ? "added" : "built-in"}</span>
        </div>
        <div class="m">${escapeHtml(p.category)}</div>
      </div>
      <div class="actions">
        ${customIds.has(p.id) ? `
          <button class="btn btn-sm" data-edit="${p.id}">Edit</button>
          <button class="btn btn-sm btn-danger" data-del="${p.id}">Delete</button>
        ` : `<span class="field-hint">edit in data.js</span>`}
      </div>
    </div>
  `).join("");

  list.querySelectorAll("[data-edit]").forEach(btn => {
    btn.addEventListener("click", () => loadForEdit(btn.dataset.edit));
  });
  list.querySelectorAll("[data-del]").forEach(btn => {
    btn.addEventListener("click", () => deleteProgram(btn.dataset.del));
  });

  document.getElementById("countBuiltin").textContent = all.length - customIds.size;
  document.getElementById("countCustom").textContent = customIds.size;
}

function loadForEdit(id) {
  const p = getCustomPrograms().find(x => x.id === id);
  if (!p) return;
  editingId = id;
  document.getElementById("fTitle").value = p.title;
  document.getElementById("fDesc").value = p.description;
  document.getElementById("fCode").value = p.code;
  renderCategoryOptions();
  document.getElementById("fCategory").value = p.category;
  document.getElementById("formTitle").textContent = "Edit program";
  document.getElementById("submitBtn").textContent = "Save changes";
  document.getElementById("cancelEdit").style.display = "inline-flex";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetForm() {
  editingId = null;
  document.getElementById("programForm").reset();
  document.getElementById("formTitle").textContent = "Add a new program";
  document.getElementById("submitBtn").textContent = "Add program";
  document.getElementById("cancelEdit").style.display = "none";
  renderCategoryOptions();
}

function deleteProgram(id) {
  if (!confirm("Delete this program? This only removes it from your browser's saved copy.")) return;
  const list = getCustomPrograms().filter(p => p.id !== id);
  saveCustomPrograms(list);
  renderPanel();
  toast("Program deleted");
}

function handleSubmit(e) {
  e.preventDefault();
  const title = document.getElementById("fTitle").value.trim();
  const description = document.getElementById("fDesc").value.trim();
  const code = document.getElementById("fCode").value;
  let category = document.getElementById("fCategory").value;

  if (category === "__new") {
    category = (document.getElementById("fNewCategory").value || "Misc").trim();
  }

  if (!title || !description || !code.trim()) {
    toast("Please fill in all fields");
    return;
  }

  const list = getCustomPrograms();

  if (editingId) {
    const idx = list.findIndex(p => p.id === editingId);
    if (idx >= 0) {
      list[idx] = { ...list[idx], title, description, code, category };
    }
    toast("Program updated");
  } else {
    list.push({ id: uid(), num: nextNum(), title, description, code, category });
    toast("Program added");
  }

  saveCustomPrograms(list);
  resetForm();
  renderPanel();
}

function handleCategoryChange() {
  const select = document.getElementById("fCategory");
  const newWrap = document.getElementById("newCategoryWrap");
  newWrap.style.display = select.value === "__new" ? "block" : "none";
}

function exportJson() {
  const list = getCustomPrograms();
  if (!list.length) {
    toast("Nothing to export yet");
    return;
  }
  const blob = new Blob([JSON.stringify(list, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "pylab_custom_programs.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importJson(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const incoming = JSON.parse(reader.result);
      if (!Array.isArray(incoming)) throw new Error("File is not a list of programs");
      const existing = getCustomPrograms();
      const existingIds = new Set(existing.map(p => p.id));
      incoming.forEach(p => {
        if (!p.id || existingIds.has(p.id)) p.id = uid();
        if (!p.num) p.num = nextNum();
      });
      saveCustomPrograms([...existing, ...incoming]);
      renderPanel();
      toast(`Imported ${incoming.length} program(s)`);
    } catch (err) {
      toast("Could not read that file");
      console.error(err);
    }
  };
  reader.readAsText(file);
}

document.addEventListener("DOMContentLoaded", () => {
  if (isLoggedIn()) renderPanel(); else renderLogin();

  document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const val = document.getElementById("passwordInput").value;
    if (val === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      renderPanel();
    } else {
      document.getElementById("loginError").textContent = "Incorrect password.";
    }
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    sessionStorage.removeItem(SESSION_KEY);
    renderLogin();
  });

  document.getElementById("programForm").addEventListener("submit", handleSubmit);
  document.getElementById("cancelEdit").addEventListener("click", resetForm);
  document.getElementById("fCategory").addEventListener("change", handleCategoryChange);
  document.getElementById("exportBtn").addEventListener("click", exportJson);
  document.getElementById("importInput").addEventListener("change", (e) => {
    if (e.target.files[0]) importJson(e.target.files[0]);
    e.target.value = "";
  });
});

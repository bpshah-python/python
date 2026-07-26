// common.js — shared helpers used by both index.html and admin.html

const STORAGE_KEY = "pylab_custom_programs_v1";

/** Read admin-added programs from localStorage. */
function getCustomPrograms() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Could not read stored programs:", e);
    return [];
  }
}

/** Persist the admin-added programs array. */
function saveCustomPrograms(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

/** Full list = built-in defaults + anything added via the admin panel. */
function getAllPrograms() {
  const custom = getCustomPrograms();
  return [...DEFAULT_PROGRAMS, ...custom].sort((a, b) => a.num - b.num);
}

function nextNum() {
  const all = getAllPrograms();
  return all.length ? Math.max(...all.map(p => p.num)) + 1 : 1;
}

function uid() {
  return "c" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Very small, dependency-free Python syntax highlighter (good enough for these exercises). */
function highlightPython(code) {
  const escaped = escapeHtml(code);
  const keywords = /\b(def|return|if|elif|else|for|while|in|import|from|as|class|try|except|finally|with|pass|break|continue|and|or|not|is|None|True|False|lambda|yield|global)\b/g;
  const builtins = /\b(print|input|range|len|int|float|str|list|dict|set|tuple|sum|max|min|abs|sorted|enumerate|zip|type|isinstance)\b/g;

  const lines = escaped.split("\n").map(line => {
    // Pull out comments first so we don't tokenize inside them
    let commentIdx = -1;
    let inStr = false, strCh = null;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inStr) {
        if (ch === strCh && line[i - 1] !== "\\") inStr = false;
      } else if (ch === '"' || ch === "'") {
        inStr = true; strCh = ch;
      } else if (ch === "#") {
        commentIdx = i; break;
      }
    }
    let code = commentIdx >= 0 ? line.slice(0, commentIdx) : line;
    let comment = commentIdx >= 0 ? line.slice(commentIdx) : "";

    code = code.replace(/(&quot;.*?&quot;|&#39;.*?&#39;|".*?"|'.*?')/g, m => `§STR§${m}§/STR§`);
    code = code.replace(keywords, m => `§KW§${m}§/KW§`);
    code = code.replace(builtins, m => `§BI§${m}§/BI§`);
    code = code.replace(/\b(\d+\.?\d*)\b/g, m => `§NUM§${m}§/NUM§`);

    code = code
      .replace(/§STR§/g, '<span class="tok-str">').replace(/§\/STR§/g, "</span>")
      .replace(/§KW§/g, '<span class="tok-kw">').replace(/§\/KW§/g, "</span>")
      .replace(/§BI§/g, '<span class="tok-bi">').replace(/§\/BI§/g, "</span>")
      .replace(/§NUM§/g, '<span class="tok-num">').replace(/§\/NUM§/g, "</span>");

    if (comment) comment = `<span class="tok-com">${comment}</span>`;
    return `<span class="code-line">${code + comment}</span>`;
  });

  return lines.join("\n");
}

function toast(msg) {
  let el = document.getElementById("toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove("show"), 1800);
}

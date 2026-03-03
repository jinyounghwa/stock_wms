#!/usr/bin/env node

import fs from "fs";
import path from "path";

const rootDir = process.cwd();
const dataPath = path.join(rootDir, "demo", "data", "page-specs.json");
const outDir = path.join(rootDir, "demo", "pages");

const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const pages = data.pages;

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

const fileMap = new Map();
pages.forEach((page, index) => {
  const base = page.code || page.id || `page-${index + 1}`;
  const slug = slugify(base) || `page-${index + 1}`;
  fileMap.set(page.id, `${slug}.html`);
});

function escapeScriptJson(value) {
  return JSON.stringify(value).replace(/<\//g, "<\\/");
}

function renderSidebar(currentId) {
  const grouped = new Map();
  pages.forEach((page) => {
    if (!grouped.has(page.menuGroup)) grouped.set(page.menuGroup, []);
    grouped.get(page.menuGroup).push(page);
  });

  return `
    <div class="logo-wrap">
      <div class="logo">⚡</div>
      <div class="logo-text">WMS</div>
    </div>
    <div class="nav-subtitle">빠른 이동</div>
    <div class="nav-list">
      <a class="nav-link" href="../index.html">재고현황 기본/필터</a>
    </div>
    ${Array.from(grouped.entries())
      .map(
        ([group, list]) => `
      <div class="nav-subtitle">${group}</div>
      <div class="nav-list">
        ${list
          .map((page) => {
            const currentClass = page.id === currentId ? "current" : "";
            const href = `./${fileMap.get(page.id)}`;
            const code = page.code ? ` <small>(${page.code})</small>` : "";
            return `<a class="nav-link ${currentClass}" href="${href}">${page.title}${code}</a>`;
          })
          .join("")}
      </div>
    `,
      )
      .join("")}
  `;
}

function renderPageHtml(page) {
  const pageFile = fileMap.get(page.id);
  const docJson = escapeScriptJson(page);

  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${page.title} | WMS 데모</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="../assets/base.css" />
  </head>
  <body>
    <div class="doc-shell">
      <aside class="doc-sidebar">
        ${renderSidebar(page.id)}
      </aside>

      <main class="doc-main">
        <header class="top-tabs">
          <button class="tab">default tex...</button>
          <button class="tab">default tex...</button>
          <button class="tab active">${page.title}</button>
          <button class="tab">문서 기반 데모</button>
        </header>
        <section id="docRoot" class="doc-root"></section>
      </main>
    </div>

    <div id="toast" class="toast"></div>

    <script>window.PAGE_SPEC = ${docJson};</script>
    <script src="../assets/doc-page.js"></script>
  </body>
</html>
`;
}

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

pages.forEach((page) => {
  const fileName = fileMap.get(page.id);
  const html = renderPageHtml(page);
  fs.writeFileSync(path.join(outDir, fileName), html, "utf8");
});

const grouped = new Map();
pages.forEach((page) => {
  if (!grouped.has(page.menuGroup)) grouped.set(page.menuGroup, []);
  grouped.get(page.menuGroup).push(page);
});

const listHtml = `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>문서별 데모 페이지 목록</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="../assets/base.css" />
  </head>
  <body>
    <main class="doc-root">
      <section class="quick-links">
        <h2>문서별 데모 페이지 (${pages.length}개)</h2>
        <div class="quick-grid">
          <a href="../index.html">재고현황 기본/필터 페이지</a>
          ${pages
            .map((page) => `<a href="./${fileMap.get(page.id)}">${page.title}${page.code ? ` (${page.code})` : ""}</a>`)
            .join("")}
        </div>
      </section>

      ${Array.from(grouped.entries())
        .map(
          ([group, list]) => `
        <section class="quick-links">
          <h2>${group}</h2>
          <div class="quick-grid">
            ${list
              .map(
                (page) =>
                  `<a href="./${fileMap.get(page.id)}"><strong>${page.title}</strong><br/><small>${page.code || page.id}</small></a>`,
              )
              .join("")}
          </div>
        </section>
      `,
        )
        .join("")}
    </main>
  </body>
</html>`;

fs.writeFileSync(path.join(outDir, "index.html"), listHtml, "utf8");

fs.writeFileSync(
  path.join(outDir, "_map.json"),
  JSON.stringify(
    pages.map((page) => ({
      title: page.title,
      code: page.code || page.id,
      source: page.docPath,
      page: `pages/${fileMap.get(page.id)}`,
    })),
    null,
    2,
  ),
  "utf8",
);

console.log(`generated pages: ${pages.length}`);
console.log(`index: ${path.join(outDir, "index.html")}`);

#!/usr/bin/env node

import fs from "fs";
import path from "path";

const rootDir = process.cwd();
const docsDir = path.join(rootDir, "재고2");
const primaryOutFile = path.join(rootDir, "src", "data", "page-specs.json");
const legacyOutFile = path.join(rootDir, "demo", "data", "page-specs.json");

const mdFiles = fs
  .readdirSync(docsDir)
  .filter((name) => name.endsWith(".md"))
  .sort((a, b) => a.localeCompare(b, "ko"));

function parseRow(line) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function normalize(value) {
  return value.replace(/\s+/g, " ").trim();
}

function parseFile(fileName, index) {
  const fullPath = path.join(docsDir, fileName);
  const text = fs.readFileSync(fullPath, "utf8");
  const lines = text.split(/\r?\n/);

  let pageTitle = "";
  let currentSection = "";
  const sections = [];
  const tables = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const titleMatch = line.match(/^#\s+페이지 분석\s+—\s+(.+)$/);
    if (titleMatch) {
      pageTitle = normalize(titleMatch[1]);
    }

    const sec2 = line.match(/^##\s+(.+)$/);
    if (sec2) {
      currentSection = normalize(sec2[1]);
      sections.push(currentSection);
      continue;
    }

    const sec3 = line.match(/^###\s+(.+)$/);
    if (sec3) {
      currentSection = normalize(sec3[1]);
      sections.push(currentSection);
      continue;
    }

    const next = lines[i + 1] || "";
    if (line.trim().startsWith("|") && /^\|\s*[-: ]+\|/.test(next)) {
      const rawRows = [];
      rawRows.push(parseRow(line));
      i += 2;
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        rawRows.push(parseRow(lines[i]));
        i += 1;
      }
      i -= 1;

      if (rawRows.length >= 2) {
        tables.push({
          section: currentSection,
          headers: rawRows[0],
          rows: rawRows.slice(1),
        });
      }
    }
  }

  const overviewTable = tables.find((table) => table.headers[0] === "항목" && table.headers[1] === "내용");
  const overviewMap = {};
  if (overviewTable) {
    overviewTable.rows.forEach((row) => {
      if (row.length >= 2) {
        overviewMap[normalize(row[0])] = normalize(row[1]);
      }
    });
  }

  const filterTable = tables.find((table) => table.headers.includes("필드명"));
  const actionTable = tables.find((table) => table.headers.includes("버튼명"));
  const columnTables = tables.filter((table) => table.headers.includes("컬럼명"));
  const summaryTables = tables.filter(
    (table) =>
      table.headers.includes("항목") &&
      table.headers.includes("설명") &&
      /(요약|집계|카드)/.test(table.section),
  );
  const apiTable = tables.find((table) => table.headers.includes("API") && table.headers.includes("Method"));

  const code = overviewMap["식별 코드"] && overviewMap["식별 코드"] !== "미기재" ? overviewMap["식별 코드"] : "";
  const id = code || `PAGE-${String(index + 1).padStart(3, "0")}`;

  const fieldNames = (filterTable?.rows || []).map((row) => normalize(row[0])).filter(Boolean);
  const actionNames = (actionTable?.rows || []).map((row) => normalize(row[0])).filter(Boolean);

  const pageName = overviewMap["페이지명"] || pageTitle || fileName.replace(/\.md$/, "");
  const title = /\(.+\)/.test(pageName) ? pageName.replace(/\s+/g, " ").trim() : pageName;

  return {
    id,
    code,
    title,
    pageTitle,
    fileName,
    docPath: path.join("재고2", fileName),
    menuGroup: overviewMap["메뉴 그룹/위치"] || "기타",
    purpose: overviewMap["목적"] || "",
    access: overviewMap["접근 권한"] || "",
    sections,
    fields: fieldNames,
    actions: actionNames,
    columnTables: columnTables.map((table) => ({
      section: table.section,
      columns: table.rows.map((row) => normalize(row[0])).filter(Boolean),
    })),
    summaries: summaryTables.map((table) => ({
      section: table.section,
      items: table.rows.map((row) => ({
        name: normalize(row[0]),
        description: normalize(row[1] || ""),
      })),
    })),
    apis: (apiTable?.rows || []).map((row) => ({
      path: normalize(row[0] || ""),
      method: normalize(row[1] || ""),
      description: normalize(row[2] || ""),
    })),
  };
}

const specs = mdFiles.map(parseFile);

const payload = JSON.stringify(
  {
    generatedAt: new Date().toISOString(),
    sourceDir: "재고2",
    count: specs.length,
    pages: specs,
  },
  null,
  2,
);

fs.mkdirSync(path.dirname(primaryOutFile), { recursive: true });
fs.writeFileSync(primaryOutFile, payload, "utf8");
console.log(`generated: ${primaryOutFile}`);

if (fs.existsSync(path.dirname(legacyOutFile))) {
  fs.mkdirSync(path.dirname(legacyOutFile), { recursive: true });
  fs.writeFileSync(legacyOutFile, payload, "utf8");
  console.log(`generated (legacy): ${legacyOutFile}`);
}

console.log(`pages: ${specs.length}`);

import { useEffect, useMemo, useRef, useState } from "react";
import { BrowserRouter, Link, NavLink, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import pageSpecs from "./data/page-specs.json";

const INVENTORY_DATA = [
  {
    id: "P001",
    category: "카테고리>카테고리>카테고리",
    sku: "JB003-KN01",
    name: "[MADE] 데스 베이직 반팔 니트 JT009390 [MADE] 데스 베이직 반팔 니트 JT009390",
    brand: "MADE J",
    productInfo: "클래식웨어 베이직니트",
    stock: 10000,
    options: [
      ["레드, M", 1999, "A-01-01-01", "81231341295121", 362928, 17356000000],
      ["블랙, L", 1500, "B-02-02-02", "81231341295122", 450350, 20250000000],
      ["그린, S", 1200, "C-03-03-03", "81231341295123", 250000, 10500000000],
      ["오프화이트, XL", 800, "D-04-04-04", "81231341295124", 300000, 8000000000],
      ["퍼플, M", 900, "E-05-05-05", "81231341295125", 350000, 10000000000],
      ["핑크, S", 1100, "F-06-06-06", "81231341295126", 400000, 15000000000],
      ["오렌지, L", 1300, "G-07-07-07", "81231341295127", 450000, 12500000000],
    ],
  },
  {
    id: "P002",
    category: "카테고리>카테고리>카테고리",
    sku: "JB003-KN01",
    name: "[MADE] 데스 베이직 반팔 니트 JT009390 [MADE] 데스 베이직 반팔 니트 JT009390",
    brand: "MADE J",
    productInfo: "클래식웨어 베이직니트",
    stock: 10000,
    options: [
      ["레드, M", 1999, "A-01-01-01", "81231341295121", 362928, 17356000000],
      ["블랙, L", 1500, "B-02-02-02", "81231341295122", 450350, 20250000000],
      ["그린, S", 1200, "C-03-03-03", "81231341295123", 250000, 10500000000],
      ["오프화이트, XL", 800, "D-04-04-04", "81231341295124", 300000, 8000000000],
      ["퍼플, M", 900, "E-05-05-05", "81231341295125", 350000, 10000000000],
      ["핑크, S", 1100, "F-06-06-06", "81231341295126", 400000, 15000000000],
      ["오렌지, L", 1300, "G-07-07-07", "81231341295127", 450000, 12500000000],
    ],
  },
  {
    id: "P003",
    category: "카테고리>카테고리>카테고리",
    sku: "JB003-KN01",
    name: "[MADE] 데스 베이직 반팔 니트 JT009390 123123123123123123123123123123123123...",
    brand: "MADE J",
    productInfo: "클래식웨어 베이직니트",
    stock: 10000,
    options: [],
  },
  {
    id: "P004",
    category: "카테고리>카테고리>카테고리",
    sku: "JB003-KN01",
    name: "[MADE] 데스 베이직 반팔 니트 JT009390 123123123123123123123123123123123123...",
    brand: "MADE J",
    productInfo: "클래식웨어 베이직니트",
    stock: 10000,
    options: [],
  },
];

function formatNumber(value) {
  return Number(value || 0).toLocaleString("ko-KR");
}

function formatCurrency(value) {
  return `₩${formatNumber(value)}`;
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

const DOC_PAGES = pageSpecs.pages.map((page, index) => {
  const baseId = page.code || page.id || `PAGE-${String(index + 1).padStart(3, "0")}`;
  return {
    ...page,
    pageKey: slugify(baseId),
  };
});

const DOC_GROUPS = DOC_PAGES.reduce((acc, page) => {
  if (!acc[page.menuGroup]) acc[page.menuGroup] = [];
  acc[page.menuGroup].push(page);
  return acc;
}, {});

function useToast() {
  const [toast, setToast] = useState("");
  const timerRef = useRef(0);

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setToast(""), 1700);
  };

  useEffect(
    () => () => {
      window.clearTimeout(timerRef.current);
    },
    [],
  );

  return { toast, showToast };
}

function sampleValue(column, rowIndex) {
  const idx = rowIndex + 1;

  if (/체크/.test(column)) return "□";
  if (/번호/.test(column)) return `NO-20260303-${String(idx).padStart(4, "0")}`;
  if (/바코드/.test(column)) return `81231341295${String(120 + idx)}`;
  if (/상품코드/.test(column)) return `JT0093${String(80 + idx)}`;
  if (/스타일코드/.test(column)) return `JB003-KN0${(idx % 3) + 1}`;
  if (/브랜드/.test(column)) return ["MADE J", "NATURIA", "VINTAGE LAB"][idx % 3];
  if (/화주/.test(column)) return ["화주사 A", "화주사 B"][idx % 2];
  if (/창고/.test(column)) return ["메인센터", "서브센터"][idx % 2];
  if (/로케이션|위치/.test(column)) return `${String.fromCharCode(65 + (idx % 6))}-0${(idx % 8) + 1}-0${(idx % 6) + 1}`;
  if (/카테고리/.test(column)) return ["상의", "하의", "아우터"][idx % 3];
  if (/시즌/.test(column)) return ["SS25", "FW25", "SS26"][idx % 3];
  if (/상태/.test(column)) return ["완료", "진행중", "대기", "미입력"][idx % 4];
  if (/일시/.test(column)) return `2026-03-${String((idx % 28) + 1).padStart(2, "0")} 10:${String((idx * 7) % 60).padStart(2, "0")}`;
  if (/일$|날짜|기준일|출고일|입고일/.test(column)) return `2026-03-${String((idx % 28) + 1).padStart(2, "0")}`;
  if (/율/.test(column)) return `${72 + (idx % 20)}%`;
  if (/수량|재고|건수|점유율|합계/.test(column)) return formatNumber(300 + idx * 17);
  if (/금액|원가|가격/.test(column)) return `₩${formatNumber(100000 + idx * 45000)}`;
  if (/메모|설명/.test(column)) return "데모 처리 메모";
  if (/유형/.test(column)) return ["증가", "감소", "일반"][idx % 3];
  if (/유효기간/.test(column)) return `2026-12-${String((idx % 28) + 1).padStart(2, "0")}`;
  if (/담당자|처리자|승인자|요청자|등록자/.test(column)) return ["김작업", "이관리", "박검수"][idx % 3];
  if (/SKU/.test(column)) return formatNumber(120 + idx);
  if (/상품명/.test(column)) return `[MADE] 데모 상품 ${idx}`;

  return `${column} ${idx}`;
}

function buildRows(columns, count = 8) {
  const result = [];
  for (let i = 0; i < count; i += 1) {
    const row = { __id: `row-${i + 1}` };
    columns.forEach((column) => {
      row[column] = sampleValue(column, i);
    });
    result.push(row);
  }
  return result;
}

function PageLayout({ tabTitle, children, showDocLinks = false, currentDocKey = "" }) {
  return (
    <div className="layout">
      <aside className="sidebar">
        <SidebarNav showDocLinks={showDocLinks} currentDocKey={currentDocKey} />
      </aside>

      <main className="main">
        <header className="top-tabs">
          <button type="button" className="tab">default tex...</button>
          <button type="button" className="tab">default tex...</button>
          <button type="button" className="tab active">{tabTitle}</button>
          <button type="button" className="tab">재고 관리</button>
          <button type="button" className="tab">default tex...</button>
          <button type="button" className="tab">default tex...</button>
        </header>

        <section className="content">{children}</section>
      </main>
    </div>
  );
}

function SidebarNav({ showDocLinks, currentDocKey }) {
  const location = useLocation();

  return (
    <>
      <div className="logo-wrap">
        <div className="logo">⚡</div>
        <div className="logo-text">WMS</div>
      </div>

      <nav className="menu">
        <div className="menu-group">
          <div className="menu-title">창고 관리</div>
          <button type="button" className="menu-item">창고 현황 관리</button>
          <button type="button" className="menu-item">창고 레이아웃 관리</button>
          <button type="button" className="menu-item">보관위치 관리</button>
          <button type="button" className="menu-item">화주 관리</button>
        </div>

        <div className="menu-group">
          <div className="menu-title">재고 관리</div>
          <NavLink to="/" className={({ isActive }) => `menu-item ${isActive && location.pathname === "/" ? "active" : ""}`}>
            재고 현황
          </NavLink>
          <button type="button" className="menu-item">재고 설정</button>
          <button type="button" className="menu-item">로케이션 재고</button>
          <button type="button" className="menu-item">재고 조사</button>
        </div>

        <div className="menu-group">
          <div className="menu-title">재고 이동</div>
          <button type="button" className="menu-item">이동 지시 목록</button>
          <button type="button" className="menu-item">이동 지시</button>
          <button type="button" className="menu-item">이동 실행</button>
          <button type="button" className="menu-item">입출 이동</button>
        </div>

        <div className="menu-group">
          <div className="menu-title">출고</div>
          <button type="button" className="menu-item">출고 오더 목록</button>
          <button type="button" className="menu-item">출고 지시</button>
          <button type="button" className="menu-item">피킹 및 출수</button>
          <button type="button" className="menu-item">분할 보류</button>
          <button type="button" className="menu-item">출고 관리</button>
        </div>

        {showDocLinks ? (
          <div className="menu-group docs-menu">
            <div className="menu-title">재고2 데모 링크</div>
            <NavLink to="/docs" className={({ isActive }) => `menu-item ${isActive && location.pathname === "/docs" ? "active" : ""}`}>
              문서 전체 목록
            </NavLink>
            {DOC_PAGES.map((page) => (
              <NavLink
                key={page.pageKey}
                to={`/docs/${page.pageKey}`}
                className={`menu-item ${currentDocKey === page.pageKey ? "active" : ""}`}
              >
                {page.title}
              </NavLink>
            ))}
          </div>
        ) : null}
      </nav>
    </>
  );
}

function BaseInventoryPage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [queryInput, setQueryInput] = useState("");
  const [queryApplied, setQueryApplied] = useState("");
  const [selected, setSelected] = useState(() => new Set());
  const { toast, showToast } = useToast();

  const filtered = useMemo(() => {
    const q = queryApplied.trim().toLowerCase();
    if (!q) return INVENTORY_DATA;
    return INVENTORY_DATA.filter((item) => `${item.name} ${item.sku}`.toLowerCase().includes(q));
  }, [queryApplied]);

  const handleToggleSelect = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const handleApplyFilter = () => {
    const q = queryInput.trim().toLowerCase();
    const count = q
      ? INVENTORY_DATA.filter((item) => `${item.name} ${item.sku}`.toLowerCase().includes(q)).length
      : INVENTORY_DATA.length;
    setQueryApplied(queryInput);
    showToast(`조회 결과 ${count}건`);
  };

  const handleReset = () => {
    setQueryInput("");
    setQueryApplied("");
    setSelected(new Set());
    showToast("필터를 초기화했습니다.");
  };

  return (
    <PageLayout tabTitle="재고 현황" showDocLinks>
      <div className="page-head">
        <h1>재고 현황</h1>
        <div className="head-actions">
          <Link to="/docs" className="chip">문서2 데모 전체</Link>
          <button type="button" className="text-btn">재고관리자</button>
          <button type="button" className="text-btn">재고 갱신</button>
        </div>
      </div>

      <section className="quick-links">
        <h2>재고2 문서 페이지 바로가기 ({DOC_PAGES.length}개)</h2>
        <div className="quick-grid">
          <Link to="/docs">전체 목록 보기</Link>
          {DOC_PAGES.map((page) => (
            <Link key={page.pageKey} to={`/docs/${page.pageKey}`}>
              {page.title}
              <small>{page.code || page.id}</small>
            </Link>
          ))}
        </div>
      </section>

      <div className="search-card">
        <div className="search-top-row">
          <div>
            <strong>통합 검색</strong>
            <p>카테고리+브랜드+키워드+기간으로 검색하세요. 기간은 필터 영역에서 설정하세요.</p>
          </div>
          <div className="search-right">
            <input
              type="text"
              value={queryInput}
              onChange={(event) => setQueryInput(event.target.value)}
              placeholder="상품명, 상품코드 또는 바코드 (다중값: 콤마 구분)"
            />
            <select defaultValue="전체">
              <option>전체</option>
              <option>가용재고</option>
              <option>예약재고</option>
              <option>불용재고</option>
            </select>
            <button
              type="button"
              className="primary ghost"
              onClick={() => setFilterOpen((prev) => !prev)}
            >
              {filterOpen ? "필터 접기" : "필터 펼치기"}
            </button>
          </div>
        </div>

        {filterOpen ? (
          <div className="filter-panel">
            <div className="filter-grid">
              <label>
                화주
                <select defaultValue="화주사 A">
                  <option>화주사 A</option>
                  <option>화주사 B</option>
                </select>
              </label>
              <label>
                창고
                <select defaultValue="메인센터">
                  <option>메인센터</option>
                  <option>서브센터</option>
                </select>
              </label>
              <label>
                브랜드
                <select defaultValue="브랜드 전체">
                  <option>브랜드 전체</option>
                  <option>MADE J</option>
                </select>
              </label>
              <label>
                카테고리
                <select defaultValue="카테고리 전체">
                  <option>카테고리 전체</option>
                  <option>상의</option>
                  <option>하의</option>
                </select>
              </label>
              <label>
                시즌
                <select defaultValue="시즌 전체">
                  <option>시즌 전체</option>
                  <option>SS25</option>
                  <option>FW25</option>
                </select>
              </label>
              <label>
                로케이션
                <input type="text" placeholder="A-01-01" />
              </label>
              <label>
                상품코드
                <input type="text" placeholder="JT009390" />
              </label>
              <label>
                스타일코드
                <input type="text" placeholder="JB003-KN01" />
              </label>
              <label>
                색상
                <select defaultValue="색상 전체">
                  <option>색상 전체</option>
                  <option>블랙</option>
                  <option>오프화이트</option>
                </select>
              </label>
              <label>
                사이즈
                <select defaultValue="사이즈 전체">
                  <option>사이즈 전체</option>
                  <option>S</option>
                  <option>M</option>
                  <option>L</option>
                </select>
              </label>
              <label>
                보관 시작일
                <input type="date" />
              </label>
              <label>
                보관 종료일
                <input type="date" />
              </label>
            </div>
            <div className="filter-actions">
              <button type="button" className="primary" onClick={handleApplyFilter}>필터 적용</button>
              <button type="button" className="secondary" onClick={handleReset}>초기화</button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="table-toolbar">
        <div className="count-info">
          전체 상품 <strong>{filtered.length}종</strong> / 선택 <strong>{selected.size}건</strong>
        </div>
        <div className="toolbar-actions">
          <button type="button" className="chip" onClick={() => showToast("엑셀 다운로드는 데모 동작입니다.")}>엑셀 다운로드</button>
          <button type="button" className="chip" onClick={() => showToast("상품 바코드 출력은 데모 동작입니다.")}>상품 바코드 출력</button>
        </div>
      </div>

      <div className="inventory-list">
        {filtered.map((product) => {
          const checked = selected.has(product.id);
          return (
            <article key={product.id} className="product-card">
              <div className="product-head">
                <button
                  type="button"
                  className={`fake-checkbox${checked ? " checked" : ""}`}
                  aria-label="선택"
                  onClick={() => handleToggleSelect(product.id)}
                />
                <div className="thumb" />
                <div>
                  <div className="cell-title">{product.category} / {product.sku}</div>
                  <div className="product-title">{product.name}</div>
                  <div className="product-sub">옵션 보기 ▾</div>
                </div>
                <div>
                  <div className="cell-title">브랜드</div>
                  <div className="cell-value">{product.brand}</div>
                </div>
                <div>
                  <div className="cell-title">제품 정보</div>
                  <div className="cell-value link">클래식웨어 베이직니트</div>
                  <div className="product-sub">{product.productInfo}</div>
                </div>
                <div className="stock-total">
                  <div className="cell-title">재고</div>
                  <div className="cell-value">{formatNumber(product.stock)}개</div>
                </div>
              </div>

              {product.options.length ? (
                <table className="option-table">
                  <thead>
                    <tr>
                      <th>옵션명</th>
                      <th>가용재고</th>
                      <th>위치</th>
                      <th>글로벌 바코드</th>
                      <th>원가</th>
                      <th>재고금액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.options.map((option) => (
                      <tr key={`${product.id}-${option[0]}`}>
                        <td>{option[0]}</td>
                        <td>{formatNumber(option[1])}개</td>
                        <td>{option[2]} 3번 위치 2</td>
                        <td>{option[3]}</td>
                        <td>{formatCurrency(option[4])}</td>
                        <td>{formatCurrency(option[5])}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : null}
            </article>
          );
        })}
      </div>

      <div className={`toast${toast ? " show" : ""}`}>{toast}</div>
    </PageLayout>
  );
}

function DocsIndexPage() {
  return (
    <PageLayout tabTitle="재고2 문서 데모" showDocLinks>
      <div className="page-head">
        <h1>재고2 문서 데모 목록</h1>
        <div className="head-actions">
          <Link to="/" className="chip">재고현황 기본으로</Link>
        </div>
      </div>

      <section className="quick-links">
        <h2>전체 문서 ({DOC_PAGES.length}개)</h2>
        <div className="quick-grid">
          {DOC_PAGES.map((page) => (
            <Link key={page.pageKey} to={`/docs/${page.pageKey}`}>
              <strong>{page.title}</strong>
              <small>{page.code || page.id}</small>
            </Link>
          ))}
        </div>
      </section>

      {Object.entries(DOC_GROUPS).map(([groupName, list]) => (
        <section key={groupName} className="quick-links">
          <h2>{groupName}</h2>
          <div className="quick-grid">
            {list.map((page) => (
              <Link key={page.pageKey} to={`/docs/${page.pageKey}`}>
                <strong>{page.title}</strong>
                <small>{page.code || page.id}</small>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </PageLayout>
  );
}

function renderFieldControl(field) {
  if (/재고 없음 포함|체크/.test(field)) {
    return (
      <label className="check-field">
        <input type="checkbox" />
        포함
      </label>
    );
  }

  if (/기준일|일자|기간|시작일|종료일/.test(field)) {
    return <input type="date" />;
  }

  if (/상품코드|바코드|스타일코드|로케이션|번호|담당자|메모|사유|설명/.test(field)) {
    return <input type="text" placeholder={`${field} 입력`} />;
  }

  return (
    <select defaultValue="">
      <option value="">{field} 선택</option>
      <option value="옵션1">옵션1</option>
      <option value="옵션2">옵션2</option>
    </select>
  );
}

function DocHeaderBlock({ page }) {
  return (
    <div className="doc-page-head">
      <div>
        <h1>{page.title}</h1>
        <p>{page.purpose}</p>
      </div>
      <div className="doc-badges">
        <span className="badge">{page.code || page.id}</span>
        <span className="badge line">{page.menuGroup}</span>
      </div>
    </div>
  );
}

function DocFilterBlock({ page, helperText, onSearch, onReset, children }) {
  return (
    <section className="search-card">
      <div className="search-top-row doc-compact">
        <div>
          <strong>검색 조건</strong>
          <p>{helperText || `${page.fields.length}개 필드`}</p>
        </div>
        <div className="toolbar-actions">
          <button type="button" className="primary" onClick={onSearch}>검색</button>
          <button type="button" className="secondary" onClick={onReset}>초기화</button>
        </div>
      </div>
      <div className="filter-panel doc-open">
        {children}
        <div className="filter-grid">
          {page.fields.map((field) => (
            <label key={field}>
              {field}
              {renderFieldControl(field)}
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}

function DocSummaryCards({ items }) {
  return (
    <div className="summary-grid summary-mini">
      {items.map((item) => (
        <article key={item.name} className="summary-card">
          <div className="summary-name">{item.name}</div>
          <div className="summary-value">{item.value}</div>
          <div className="summary-desc">{item.description}</div>
        </article>
      ))}
    </div>
  );
}

function DocTableBlock({ columns, rows, selectedId, onRowClick }) {
  return (
    <div className="doc-table-wrap">
      <table className="doc-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.__id}
              className={selectedId && selectedId === row.__id ? "selected-row" : ""}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((column) => (
                <td key={`${row.__id}-${column}`}>{row[column] || "-"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DocMetaBlock({ page, toast }) {
  return (
    <>
      <section className="doc-meta">
        <strong>원본 문서</strong>
        <code>{page.docPath}</code>
        <div className="api-list">
          {page.apis.slice(0, 5).map((api) => (
            <span key={`${api.method}-${api.path}`}>{api.method} {api.path}</span>
          ))}
        </div>
      </section>
      <div className={`toast${toast ? " show" : ""}`}>{toast}</div>
    </>
  );
}

function IndividualInboundDoc({ page }) {
  const { toast, showToast } = useToast();
  const columns = page.columnTables?.[0]?.columns?.length ? page.columnTables[0].columns : [];
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ sku: "", barcode: "", qty: "" });

  const addRow = () => {
    if (!form.sku.trim() || !form.barcode.trim() || !form.qty.trim()) {
      showToast("상품코드/바코드/수량을 입력하세요.");
      return;
    }
    const row = { __id: `ind-${Date.now()}` };
    columns.forEach((column, index) => {
      if (/상품코드/.test(column)) row[column] = form.sku.trim();
      else if (/바코드/.test(column)) row[column] = form.barcode.trim();
      else if (/수량|가입고/.test(column)) row[column] = formatNumber(form.qty);
      else row[column] = sampleValue(column, index + 1);
    });
    setRows((prev) => [row, ...prev]);
    setForm({ sku: "", barcode: "", qty: "" });
    showToast("개별가입고 행을 추가했습니다.");
  };

  const totalQty = rows.reduce((sum, row) => {
    const key = columns.find((column) => /수량|가입고/.test(column));
    return sum + Number(String(row[key] || "0").replace(/,/g, ""));
  }, 0);

  return (
    <PageLayout tabTitle={page.title} showDocLinks currentDocKey={page.pageKey}>
      <DocHeaderBlock page={page} />

      <DocFilterBlock
        page={page}
        helperText="헤더 공통 정보와 개별 행 입력"
        onSearch={() => showToast("검색 실행")}
        onReset={() => showToast("초기화")}
      />

      <section className="special-panel">
        <h3>개별가입고 입력</h3>
        <p>바코드 스캐너가 없어도 상품을 1건씩 직접 추가합니다.</p>
        <div className="entry-inputs">
          <input
            type="text"
            value={form.sku}
            onChange={(event) => setForm((prev) => ({ ...prev, sku: event.target.value }))}
            placeholder="상품코드"
          />
          <input
            type="text"
            value={form.barcode}
            onChange={(event) => setForm((prev) => ({ ...prev, barcode: event.target.value }))}
            placeholder="바코드"
          />
          <input
            type="number"
            min="0"
            value={form.qty}
            onChange={(event) => setForm((prev) => ({ ...prev, qty: event.target.value }))}
            placeholder="가입고 수량"
          />
          <button type="button" className="primary" onClick={addRow}>행 추가</button>
        </div>
      </section>

      <DocSummaryCards
        items={[
          { name: "입력 건수", value: formatNumber(rows.length), description: "추가된 임시 행 수" },
          { name: "총 가입고 수량", value: formatNumber(totalQty), description: "임시 목록 수량 합계" },
          { name: "오류 건수", value: "0", description: "필수값 누락/형식 오류" },
        ]}
      />

      <section className="table-toolbar doc-toolbar">
        <div className="count-info">임시 목록 <strong>{formatNumber(rows.length)}건</strong></div>
        <div className="toolbar-actions">
          {page.actions.map((action) => (
            <button key={action} type="button" className="chip" onClick={() => showToast(`${action} 실행`)}>
              {action}
            </button>
          ))}
        </div>
      </section>
      {rows.length ? <DocTableBlock columns={columns} rows={rows} /> : <div className="empty-state">추가된 데이터가 없습니다.</div>}

      <DocMetaBlock page={page} toast={toast} />
    </PageLayout>
  );
}

function BarcodeInboundDoc({ page }) {
  const { toast, showToast } = useToast();
  const columns = page.columnTables?.[0]?.columns?.length ? page.columnTables[0].columns : [];
  const [scanMode, setScanMode] = useState("자동");
  const [scanValue, setScanValue] = useState("");
  const [rows, setRows] = useState(() => buildRows(columns, 4));

  const addScan = () => {
    const value = scanValue.trim();
    if (!value) return;
    const row = { __id: `scan-${Date.now()}` };
    columns.forEach((column, index) => {
      if (/바코드/.test(column)) row[column] = value;
      else if (/수량|가입고/.test(column)) row[column] = formatNumber(1);
      else if (/입력방식|스캔/.test(column)) row[column] = scanMode;
      else row[column] = sampleValue(column, index + 3);
    });
    setRows((prev) => [row, ...prev]);
    setScanValue("");
    showToast(`스캔 등록: ${value}`);
  };

  return (
    <PageLayout tabTitle={page.title} showDocLinks currentDocKey={page.pageKey}>
      <DocHeaderBlock page={page} />
      <DocFilterBlock page={page} helperText="헤더 설정 + 스캔 누적 처리" onSearch={() => showToast("검색 실행")} onReset={() => showToast("초기화")} />

      <section className="special-panel">
        <h3>스캔 입력 영역</h3>
        <p>자동 모드/수동 모드에 따라 바코드 입력 이벤트를 처리합니다.</p>
        <div className="mode-toggle">
          {["자동", "수동"].map((mode) => (
            <button
              key={mode}
              type="button"
              className={`chip ${scanMode === mode ? "active-mode" : ""}`}
              onClick={() => setScanMode(mode)}
            >
              {mode} 모드
            </button>
          ))}
        </div>
        <div className="scan-row">
          <input
            type="text"
            value={scanValue}
            onChange={(event) => setScanValue(event.target.value)}
            placeholder="바코드를 스캔하거나 입력 후 Enter"
            onKeyDown={(event) => {
              if (event.key === "Enter") addScan();
            }}
          />
          <button type="button" className="primary" onClick={addScan}>스캔 등록</button>
        </div>
      </section>

      <DocSummaryCards
        items={[
          { name: "총 스캔 건수", value: formatNumber(rows.length), description: "누적 스캔 처리 건수" },
          { name: "정상 건수", value: formatNumber(Math.max(rows.length - 1, 0)), description: "상품 매칭 성공 건" },
          { name: "오류 건수", value: "1", description: "미등록 바코드/중복 경고" },
        ]}
      />

      <section className="table-toolbar doc-toolbar">
        <div className="count-info">스캔 누적 목록 <strong>{formatNumber(rows.length)}건</strong></div>
        <div className="toolbar-actions">
          {page.actions.map((action) => (
            <button key={action} type="button" className="chip" onClick={() => showToast(`${action} 실행`)}>
              {action}
            </button>
          ))}
        </div>
      </section>
      <DocTableBlock columns={columns} rows={rows} />

      <DocMetaBlock page={page} toast={toast} />
    </PageLayout>
  );
}

function ExcelInboundDoc({ page }) {
  const { toast, showToast } = useToast();
  const columns = page.columnTables?.[0]?.columns?.length ? page.columnTables[0].columns : [];
  const [previewRows, setPreviewRows] = useState([]);
  const [fileInfo, setFileInfo] = useState("업로드된 파일 없음");

  return (
    <PageLayout tabTitle={page.title} showDocLinks currentDocKey={page.pageKey}>
      <DocHeaderBlock page={page} />
      <DocFilterBlock page={page} helperText="엑셀 업로드 + 미리보기 + 적용 결과" onSearch={() => showToast("검색 실행")} onReset={() => showToast("초기화")} />

      <section className="special-panel">
        <h3>엑셀 업로드 영역</h3>
        <p>문서 정의 컬럼(바코드/상품코드/가입고수량)을 기준으로 유효성 검증합니다.</p>
        <div className="upload-zone">
          <input
            type="file"
            accept=".xlsx,.csv"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const count = Math.max(8, Math.min(80, Math.round(file.size / 120)));
              setPreviewRows(buildRows(columns, count));
              setFileInfo(`${file.name} · ${count}행 미리보기`);
              showToast("엑셀 파일 업로드 완료");
            }}
          />
          <span>필수 컬럼 누락 시 업로드 오류로 분류됩니다.</span>
          <div className="mini-meta">{fileInfo}</div>
        </div>
      </section>

      <DocSummaryCards
        items={[
          { name: "총 업로드 건수", value: formatNumber(previewRows.length), description: "파일에서 읽은 건수" },
          { name: "정상 건수", value: formatNumber(Math.max(previewRows.length - 2, 0)), description: "유효성 통과 건수" },
          { name: "오류 건수", value: formatNumber(previewRows.length ? 2 : 0), description: "형식/필수값 오류" },
        ]}
      />

      <section className="table-toolbar doc-toolbar">
        <div className="count-info">업로드 미리보기 <strong>{formatNumber(previewRows.length)}건</strong></div>
        <div className="toolbar-actions">
          {page.actions.map((action) => (
            <button key={action} type="button" className="chip" onClick={() => showToast(`${action} 실행`)}>
              {action}
            </button>
          ))}
        </div>
      </section>
      {previewRows.length ? <DocTableBlock columns={columns} rows={previewRows} /> : <div className="empty-state">업로드된 데이터가 없습니다.</div>}

      <DocMetaBlock page={page} toast={toast} />
    </PageLayout>
  );
}

function ExcelBatchListDoc({ page }) {
  const { toast, showToast } = useToast();
  const masterColumns = page.columnTables?.[0]?.columns?.length ? page.columnTables[0].columns : [];
  const detailColumns = page.columnTables?.[1]?.columns?.length ? page.columnTables[1].columns : [];
  const [masterRows] = useState(() =>
    buildRows(masterColumns, 6).map((row, index) => ({
      ...row,
      __id: `batch-excel-${index + 1}`,
      상태: ["처리완료", "처리중", "검증오류"][index % 3],
      업로드파일명: `가입고_${index + 1}.xlsx`,
    })),
  );
  const [selectedId, setSelectedId] = useState("");
  const [detailRows, setDetailRows] = useState(() => buildRows(detailColumns, 5));

  const onSelect = (row) => {
    setSelectedId(row.__id);
    setDetailRows(
      buildRows(detailColumns, 6).map((item, idx) => ({
        ...item,
        __id: `detail-batch-${idx + 1}`,
        업로드파일명: row.업로드파일명 || row.파일명 || "-",
      })),
    );
  };

  return (
    <PageLayout tabTitle={page.title} showDocLinks currentDocKey={page.pageKey}>
      <DocHeaderBlock page={page} />
      <DocFilterBlock page={page} helperText="업로드 배치별 상태 추적" onSearch={() => showToast("검색 실행")} onReset={() => showToast("초기화")} />

      <section className="table-toolbar doc-toolbar">
        <div className="count-info">배치 목록 <strong>{formatNumber(masterRows.length)}건</strong></div>
        <div className="toolbar-actions">
          {page.actions.map((action) => (
            <button key={action} type="button" className="chip" onClick={() => showToast(`${action} 실행`)}>
              {action}
            </button>
          ))}
        </div>
      </section>
      <DocTableBlock columns={masterColumns} rows={masterRows} selectedId={selectedId} onRowClick={onSelect} />

      {detailColumns.length ? (
        <section className="drilldown-block">
          <div className="drilldown-title">선택 배치 상세 내역</div>
          <DocTableBlock columns={detailColumns} rows={detailRows} />
        </section>
      ) : null}

      <DocMetaBlock page={page} toast={toast} />
    </PageLayout>
  );
}

function RegisteredProductsDoc({ page }) {
  const { toast, showToast } = useToast();
  const [mode, setMode] = useState("file");
  const [manualText, setManualText] = useState("");
  const [uploadedCodes, setUploadedCodes] = useState([]);
  const [uploadMeta, setUploadMeta] = useState("업로드된 파일 없음");
  const [rows, setRows] = useState([]);

  const primaryColumns = page.columnTables?.[0]?.columns?.length ? page.columnTables[0].columns : [];
  const summaryNames = page.summaries?.[0]?.items?.map((item) => item.name) || [
    "입력 건수",
    "매칭 건수",
    "미등록 건수",
  ];

  const createRowByColumn = (column, inputValue, index, matched) => {
    if (column === "입력 바코드/상품코드") return inputValue;
    if (column === "매칭 여부") return matched ? "매칭됨" : "미등록";
    if (!matched && !["입력 바코드/상품코드", "매칭 여부"].includes(column)) return "-";

    const map = {
      화주: ["화주사 A", "화주사 B"][index % 2],
      창고: ["메인센터", "서브센터"][index % 2],
      브랜드: ["MADE J", "NATURIA"][index % 2],
      상품코드: `JT009${300 + index}`,
      바코드: `81231341295${String(20 + index).padStart(2, "0")}`,
      스타일코드: `JB003-KN0${(index % 3) + 1}`,
      색상: ["블랙", "오프화이트", "레드"][index % 3],
      사이즈: ["S", "M", "L", "XL"][index % 4],
      상품명: `[MADE] 데모 상품 ${index + 1}`,
      "기준일 재고": formatNumber(500 + index * 12),
      "가입고 수량": formatNumber(60 + index * 2),
      현재고: formatNumber(560 + index * 11),
      로케이션: `${String.fromCharCode(65 + (index % 6))}-0${(index % 9) + 1}-0${(index % 5) + 1}`,
      "조사 상태": ["미조사", "조사중", "조사완료"][index % 3],
    };

    return map[column] ?? sampleValue(column, index);
  };

  const buildResultRows = (inputs) =>
    inputs.map((inputValue, index) => {
      const matched = index % 5 !== 0;
      const row = { __id: `reg-${index + 1}` };
      primaryColumns.forEach((column) => {
        row[column] = createRowByColumn(column, inputValue, index, matched);
      });
      return row;
    });

  const parseManualInputs = (text) =>
    text
      .split(/[\n,]/g)
      .map((value) => value.trim())
      .filter(Boolean)
      .slice(0, 500);

  const runSearch = () => {
    const inputs = mode === "file" ? uploadedCodes : parseManualInputs(manualText);
    if (!inputs.length) {
      showToast("상품코드 또는 바코드를 입력하세요.");
      return;
    }

    setRows(buildResultRows(inputs));
    showToast(`조회 완료: ${inputs.length}건`);
  };

  const inputCount = rows.length;
  const matchCount = rows.filter((row) => row["매칭 여부"] === "매칭됨").length;
  const unregisteredCount = inputCount - matchCount;

  return (
    <PageLayout tabTitle={page.title} showDocLinks currentDocKey={page.pageKey}>
      <div className="doc-page-head">
        <div>
          <h1>{page.title}</h1>
          <p>{page.purpose}</p>
        </div>
        <div className="doc-badges">
          <span className="badge">{page.code || page.id}</span>
          <span className="badge line">{page.menuGroup}</span>
        </div>
      </div>

      <section className="search-card">
        <div className="search-top-row doc-compact">
          <div>
            <strong>검색 조건</strong>
            <p>문서 정의 필드: {page.fields.join(", ")}</p>
          </div>
          <div className="toolbar-actions">
            <button type="button" className="chip" onClick={() => showToast("서식 다운로드")}>서식 다운로드</button>
            <button type="button" className="primary" onClick={runSearch}>조회</button>
            <button type="button" className="chip" onClick={() => showToast("엑셀 다운로드")}>엑셀 다운로드</button>
            <button type="button" className="chip" onClick={() => showToast("가입고 입력 이동")}>가입고 입력</button>
          </div>
        </div>
        <div className="filter-panel doc-open">
          <div className="filter-grid">
            {page.fields.map((field) => (
              <label key={field}>
                {field}
                {renderFieldControl(field)}
              </label>
            ))}
          </div>
        </div>
      </section>

      <section className="special-panel">
        <h3>상품 목록 입력 방식</h3>
        <p>CSV 업로드(.csv/.txt/.xlsx) 또는 직접 입력(줄바꿈/콤마 구분) 중 하나를 선택합니다.</p>
        <div className="mode-toggle">
          <button
            type="button"
            className={`chip ${mode === "file" ? "active-mode" : ""}`}
            onClick={() => setMode("file")}
          >
            CSV 파일 업로드
          </button>
          <button
            type="button"
            className={`chip ${mode === "manual" ? "active-mode" : ""}`}
            onClick={() => setMode("manual")}
          >
            직접 입력
          </button>
        </div>

        {mode === "file" ? (
          <div className="upload-zone">
            <input
              type="file"
              accept=".csv,.txt,.xlsx"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                const count = Math.max(5, Math.min(120, Math.round(file.size / 120)));
                const codes = Array.from({ length: count }, (_, index) => `JT009${String(300 + index)}`);
                setUploadedCodes(codes);
                setUploadMeta(`${file.name} 업로드 완료 · ${count}건 인식`);
                showToast("파일이 업로드되었습니다.");
              }}
            />
            <span>최대 5,000행 데모 처리</span>
            <div className="mini-meta">{uploadMeta}</div>
          </div>
        ) : (
          <div>
            <textarea
              className="demo-textarea"
              value={manualText}
              onChange={(event) => setManualText(event.target.value)}
              placeholder={"예시)\nJT009390\nJT009391\n81231341295121"}
            />
            <div className="mini-meta">직접 입력 최대 500건</div>
          </div>
        )}
      </section>

      <div className="summary-grid summary-mini">
        <article className="summary-card">
          <div className="summary-name">{summaryNames[0]}</div>
          <div className="summary-value">{formatNumber(inputCount)}</div>
          <div className="summary-desc">업로드/입력된 코드 수</div>
        </article>
        <article className="summary-card">
          <div className="summary-name">{summaryNames[1]}</div>
          <div className="summary-value">{formatNumber(matchCount)}</div>
          <div className="summary-desc">등록 상품 매칭 성공 건</div>
        </article>
        <article className="summary-card">
          <div className="summary-name">{summaryNames[2]}</div>
          <div className="summary-value">{formatNumber(unregisteredCount)}</div>
          <div className="summary-desc">미등록 코드 건수</div>
        </article>
      </div>

      <section className="table-toolbar doc-toolbar">
        <div className="count-info">조회 결과 <strong>{formatNumber(rows.length)}건</strong></div>
      </section>
      <div className="doc-table-wrap">
        {rows.length ? (
          <table className="doc-table">
            <thead>
              <tr>
                {primaryColumns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.__id}>
                  {primaryColumns.map((column) => (
                    <td key={`${row.__id}-${column}`}>{row[column] || "-"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">조회 버튼을 눌러 결과를 확인하세요.</div>
        )}
      </div>

      <section className="doc-meta">
        <strong>원본 문서</strong>
        <code>{page.docPath}</code>
      </section>

      <div className={`toast${toast ? " show" : ""}`}>{toast}</div>
    </PageLayout>
  );
}

function WorkHistoryDoc({ page }) {
  const { toast, showToast } = useToast();
  const primaryColumns = page.columnTables?.[0]?.columns?.length ? page.columnTables[0].columns : [];

  const [rows, setRows] = useState(() =>
    buildRows(primaryColumns, 10).map((row, index) => ({
      ...row,
      __id: `wrk-${index + 1}`,
      실산수량: index % 3 === 0 ? formatNumber(250 + index * 3) : "-",
      메모: index % 3 === 0 ? "초기 실산 입력" : "-",
      "실산 상태": index % 3 === 0 ? "입력완료" : "미입력",
    })),
  );
  const [selectedId, setSelectedId] = useState("");
  const [countQty, setCountQty] = useState("");
  const [countMemo, setCountMemo] = useState("");

  const selectedRow = rows.find((row) => row.__id === selectedId);

  const parseQty = (value) => Number(String(value || "0").replace(/,/g, ""));

  const saveCount = () => {
    if (!selectedId) {
      showToast("상품을 먼저 선택하세요.");
      return;
    }
    if (countQty === "") {
      showToast("실산수량을 입력하세요.");
      return;
    }
    if (Number(countQty) < 0) {
      showToast("실산수량은 0 이상이어야 합니다.");
      return;
    }

    setRows((prev) =>
      prev.map((row) => {
        if (row.__id !== selectedId) return row;
        const baseQty = parseQty(row["기준일 재고"]);
        const realQty = Number(countQty);
        const diff = realQty - baseQty;
        return {
          ...row,
          실산수량: formatNumber(realQty),
          메모: countMemo.trim() || "-",
          차이수량: diff > 0 ? `+${formatNumber(diff)}` : formatNumber(diff),
          "실산 상태": row["실산 상태"] === "미입력" ? "입력완료" : "수정됨",
          입력일시: new Date().toISOString().slice(0, 16).replace("T", " "),
        };
      }),
    );
    showToast("실산 저장 완료");
  };

  const summary = useMemo(() => {
    const total = rows.length;
    const done = rows.filter((row) => row["실산 상태"] !== "미입력").length;
    const pending = total - done;
    return { total, done, pending };
  }, [rows]);

  return (
    <PageLayout tabTitle={page.title} showDocLinks currentDocKey={page.pageKey}>
      <div className="doc-page-head">
        <div>
          <h1>{page.title}</h1>
          <p>{page.purpose}</p>
        </div>
        <div className="doc-badges">
          <span className="badge">{page.code || page.id}</span>
          <span className="badge line">{page.menuGroup}</span>
        </div>
      </div>

      <section className="search-card">
        <div className="search-top-row doc-compact">
          <div>
            <strong>검색 조건</strong>
            <p>화주/창고/기준일/상품코드/바코드/실산상태 등 문서 기준 조건</p>
          </div>
          <div className="toolbar-actions">
            <button type="button" className="primary" onClick={() => showToast("검색 실행")}>검색</button>
            <button type="button" className="secondary" onClick={() => showToast("초기화")}>초기화</button>
          </div>
        </div>
        <div className="filter-panel doc-open">
          <div className="filter-grid">
            {page.fields.map((field) => (
              <label key={field}>
                {field}
                {renderFieldControl(field)}
              </label>
            ))}
          </div>
        </div>
      </section>

      <div className="summary-grid summary-mini">
        <article className="summary-card">
          <div className="summary-name">총 조회 SKU 수</div>
          <div className="summary-value">{formatNumber(summary.total)}</div>
          <div className="summary-desc">검색 조건 기준 SKU</div>
        </article>
        <article className="summary-card">
          <div className="summary-name">실산 완료 건수</div>
          <div className="summary-value">{formatNumber(summary.done)}</div>
          <div className="summary-desc">실산수량 입력 완료</div>
        </article>
        <article className="summary-card">
          <div className="summary-name">미입력 건수</div>
          <div className="summary-value">{formatNumber(summary.pending)}</div>
          <div className="summary-desc">실산 미입력 SKU</div>
        </article>
      </div>

      <section className="special-panel">
        <h3>실산 입력 패널</h3>
        <p>목록에서 상품을 선택한 뒤 실산수량/메모를 저장합니다.</p>
        <div className="entry-panel">
          <div className="entry-row">
            <span>선택 SKU</span>
            <strong>{selectedRow?.상품코드 || selectedRow?.["상품코드"] || "-"}</strong>
          </div>
          <div className="entry-row">
            <span>기준일 재고</span>
            <strong>{selectedRow?.["기준일 재고"] || "-"}</strong>
          </div>
          <div className="entry-inputs">
            <input
              type="number"
              min="0"
              value={countQty}
              onChange={(event) => setCountQty(event.target.value)}
              placeholder="실산수량 입력"
            />
            <input
              type="text"
              value={countMemo}
              onChange={(event) => setCountMemo(event.target.value)}
              placeholder="실산 메모 (최대 200자)"
            />
            <button type="button" className="primary" onClick={saveCount}>실산 저장</button>
          </div>
        </div>
      </section>

      <section className="table-toolbar doc-toolbar">
        <div className="count-info">목록 <strong>{formatNumber(rows.length)}건</strong></div>
        <div className="toolbar-actions">
          {page.actions.map((action) => (
            <button
              key={action}
              type="button"
              className="chip"
              onClick={() => {
                if (action === "실산 저장") saveCount();
                else showToast(`${action} 동작`);
              }}
            >
              {action}
            </button>
          ))}
        </div>
      </section>

      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              {primaryColumns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.__id}
                className={selectedId === row.__id ? "selected-row" : ""}
                onClick={() => {
                  setSelectedId(row.__id);
                  setCountQty(row.실산수량 && row.실산수량 !== "-" ? parseQty(row.실산수량) : "");
                  setCountMemo(row.메모 && row.메모 !== "-" ? row.메모 : "");
                }}
              >
                {primaryColumns.map((column) => (
                  <td key={`${row.__id}-${column}`}>{row[column] || "-"}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="doc-meta">
        <strong>원본 문서</strong>
        <code>{page.docPath}</code>
      </section>

      <div className={`toast${toast ? " show" : ""}`}>{toast}</div>
    </PageLayout>
  );
}

function BatchHistoryDoc({ page }) {
  const { toast, showToast } = useToast();
  const masterColumns = page.columnTables?.[0]?.columns?.length ? page.columnTables[0].columns : [];
  const detailColumns = page.columnTables?.[1]?.columns?.length ? page.columnTables[1].columns : [];

  const [masterRows, setMasterRows] = useState(() =>
    buildRows(masterColumns, 7).map((row, index) => ({
      ...row,
      __id: `batch-${index + 1}`,
      "조사 차수": `2026-${index + 1}차`,
      "조회 SKU 건수": formatNumber(240 + index * 13),
      "실산 완료 건수": formatNumber(180 + index * 9),
      "미완료 건수": formatNumber(60 + index * 4),
      "완료율(%)": `${74 + index}%`,
    })),
  );
  const [selectedBatch, setSelectedBatch] = useState("");
  const [showIncompleteOnly, setShowIncompleteOnly] = useState(false);
  const [detailRows, setDetailRows] = useState(() => buildRows(detailColumns, 6));

  const visibleMasterRows = useMemo(() => {
    if (!showIncompleteOnly) return masterRows;
    return masterRows.filter((row) => Number(String(row["미완료 건수"]).replace(/,/g, "")) > 0);
  }, [masterRows, showIncompleteOnly]);

  const onSelectBatch = (row) => {
    setSelectedBatch(row.__id);
    const next = buildRows(detailColumns, 6).map((item, index) => ({
      ...item,
      __id: `detail-${index + 1}`,
      조회일시: `2026-03-${String(index + 1).padStart(2, "0")} 09:${String(index * 7).padStart(2, "0")}`,
      "조사 차수": row["조사 차수"] || row["차수"] || "-",
      "실산 상태": ["입력완료", "미입력", "수정됨"][index % 3],
      "가입고 연계": `${index % 3}건`,
      "재고조정 연계": index % 2 ? `ADJ-202603-${String(index + 11).padStart(3, "0")}` : "-",
    }));
    setDetailRows(next);
  };

  const summary = useMemo(() => {
    const totalBatch = visibleMasterRows.length;
    const totalSku = visibleMasterRows.reduce(
      (sum, row) => sum + Number(String(row["조회 SKU 건수"] || "0").replace(/,/g, "")),
      0,
    );
    const totalDone = visibleMasterRows.reduce(
      (sum, row) => sum + Number(String(row["실산 완료 건수"] || "0").replace(/,/g, "")),
      0,
    );
    const rate = totalSku ? Math.round((totalDone / totalSku) * 100) : 0;
    return { totalBatch, totalSku, rate };
  }, [visibleMasterRows]);

  return (
    <PageLayout tabTitle={page.title} showDocLinks currentDocKey={page.pageKey}>
      <div className="doc-page-head">
        <div>
          <h1>{page.title}</h1>
          <p>{page.purpose}</p>
        </div>
        <div className="doc-badges">
          <span className="badge">{page.code || page.id}</span>
          <span className="badge line">{page.menuGroup}</span>
        </div>
      </div>

      <section className="search-card">
        <div className="search-top-row doc-compact">
          <div>
            <strong>검색 필터</strong>
            <p>기준일/화주/창고/조사차수/완료상태 기준 조회</p>
          </div>
          <div className="toolbar-actions">
            <button type="button" className="primary" onClick={() => showToast("검색 실행")}>검색</button>
            <button type="button" className="secondary" onClick={() => showToast("초기화")}>초기화</button>
          </div>
        </div>
        <div className="filter-panel doc-open">
          <div className="filter-grid">
            {page.fields.map((field) => (
              <label key={field}>
                {field}
                {renderFieldControl(field)}
              </label>
            ))}
          </div>
        </div>
      </section>

      <div className="summary-grid summary-mini">
        <article className="summary-card">
          <div className="summary-name">조회 기간 내 총 차수 수</div>
          <div className="summary-value">{formatNumber(summary.totalBatch)}</div>
          <div className="summary-desc">검색 결과 차수 건수</div>
        </article>
        <article className="summary-card">
          <div className="summary-name">총 조회 SKU 건수</div>
          <div className="summary-value">{formatNumber(summary.totalSku)}</div>
          <div className="summary-desc">전체 차수 SKU 합계</div>
        </article>
        <article className="summary-card">
          <div className="summary-name">전체 실산완료율(%)</div>
          <div className="summary-value">{summary.rate}%</div>
          <div className="summary-desc">완료 SKU / 총 SKU</div>
        </article>
      </div>

      <section className="special-panel">
        <h3>차수별 집계 제어</h3>
        <p>차수 행 클릭 시 SKU별 상세 내역을 하단에 드릴다운 표시합니다.</p>
        <div className="scan-row">
          <button
            type="button"
            className={`chip ${showIncompleteOnly ? "active-mode" : ""}`}
            onClick={() => setShowIncompleteOnly((prev) => !prev)}
          >
            미완료 항목 보기
          </button>
          <button type="button" className="chip" onClick={() => showToast("엑셀 다운로드 (차수 목록)")}>
            엑셀 다운로드 (차수 목록)
          </button>
          <button type="button" className="chip" onClick={() => showToast("엑셀 다운로드 (전체 상세)")}>
            엑셀 다운로드 (전체 상세)
          </button>
          <button type="button" className="chip" onClick={() => showToast("작업내역보기 이동")}>
            작업내역보기 이동
          </button>
        </div>
      </section>

      <section className="table-toolbar doc-toolbar">
        <div className="count-info">차수 목록 <strong>{formatNumber(visibleMasterRows.length)}건</strong></div>
      </section>
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              {masterColumns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleMasterRows.map((row) => (
              <tr
                key={row.__id}
                className={selectedBatch === row.__id ? "selected-row" : ""}
                onClick={() => onSelectBatch(row)}
              >
                {masterColumns.map((column) => (
                  <td key={`${row.__id}-${column}`}>{row[column] || "-"}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {detailColumns.length ? (
        <section className="drilldown-block">
          <div className="drilldown-title">SKU별 상세 내역 (선택 차수 드릴다운)</div>
          <div className="doc-table-wrap">
            <table className="doc-table">
              <thead>
                <tr>
                  {detailColumns.map((column) => (
                    <th key={column}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {detailRows.map((row) => (
                  <tr key={row.__id}>
                    {detailColumns.map((column) => (
                      <td key={`${row.__id}-${column}`}>{row[column] || "-"}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <section className="doc-meta">
        <strong>원본 문서</strong>
        <code>{page.docPath}</code>
      </section>

      <div className={`toast${toast ? " show" : ""}`}>{toast}</div>
    </PageLayout>
  );
}

function ProductInboundHubDoc({ page }) {
  const { toast, showToast } = useToast();
  const columns = page.columnTables?.[0]?.columns?.length ? page.columnTables[0].columns : [];
  const [tab, setTab] = useState("개별가입고");
  const [rows] = useState(() =>
    buildRows(columns, 9).map((row, index) => ({
      ...row,
      __id: `inbound-hub-${index + 1}`,
      상태: ["가입고", "실입고완료", "취소"][index % 3],
      입력방식: ["개별", "바코드", "엑셀"][index % 3],
    })),
  );

  return (
    <PageLayout tabTitle={page.title} showDocLinks currentDocKey={page.pageKey}>
      <DocHeaderBlock page={page} />
      <DocFilterBlock page={page} helperText="상품 가입고 현황 통합 조회" onSearch={() => showToast("검색 실행")} onReset={() => showToast("초기화")} />

      <section className="special-panel">
        <h3>입력 방식 선택</h3>
        <p>문서 정의에 따라 개별/바코드/엑셀 탭을 제공하고 하위 페이지로 이동합니다.</p>
        <div className="mode-toggle">
          {["개별가입고", "바코드가입고", "엑셀가입고"].map((label) => (
            <button
              key={label}
              type="button"
              className={`chip ${tab === label ? "active-mode" : ""}`}
              onClick={() => setTab(label)}
            >
              {label}
            </button>
          ))}
          <Link className="chip" to="/docs/page-004">개별가입고 상세</Link>
          <Link className="chip" to="/docs/page-005">바코드가입고 상세</Link>
          <Link className="chip" to="/docs/page-006">엑셀가입고 상세</Link>
          <Link className="chip" to="/docs/page-007">차수별 엑셀가입고</Link>
        </div>
      </section>

      <DocSummaryCards
        items={[
          { name: "총 가입고 건수", value: formatNumber(rows.length), description: "현재 조회 조건 기준" },
          { name: "가입고 상태", value: formatNumber(rows.filter((row) => row.상태 === "가입고").length), description: "실입고 전 대기" },
          { name: "실입고완료", value: formatNumber(rows.filter((row) => row.상태 === "실입고완료").length), description: "실입고 처리 완료" },
        ]}
      />

      <section className="table-toolbar doc-toolbar">
        <div className="count-info">
          선택 입력방식 <strong>{tab}</strong> / 조회 <strong>{formatNumber(rows.length)}건</strong>
        </div>
        <div className="toolbar-actions">
          {page.actions.map((action) => (
            <button key={action} type="button" className="chip" onClick={() => showToast(`${action} 실행`)}>
              {action}
            </button>
          ))}
        </div>
      </section>
      <DocTableBlock columns={columns} rows={rows} />

      <DocMetaBlock page={page} toast={toast} />
    </PageLayout>
  );
}

function InboundListDoc({ page }) {
  const { toast, showToast } = useToast();
  const columns = page.columnTables?.[0]?.columns?.length ? page.columnTables[0].columns : [];
  const [rows, setRows] = useState(() =>
    buildRows(columns, 10).map((row, index) => ({
      ...row,
      __id: `pre-${index + 1}`,
      상태: ["가입고", "실입고완료", "취소"][index % 3],
      가입고수량: formatNumber(80 + index * 3),
      실입고수량: formatNumber(index % 3 === 0 ? 80 + index * 3 : 0),
      차이수량: formatNumber(index % 3 === 0 ? 0 : 80 + index * 3),
    })),
  );
  const [selectedId, setSelectedId] = useState("");
  const [editQty, setEditQty] = useState("");

  const selectedRow = rows.find((row) => row.__id === selectedId);

  const applyEdit = () => {
    if (!selectedId) {
      showToast("행을 선택하세요.");
      return;
    }
    setRows((prev) =>
      prev.map((row) => {
        if (row.__id !== selectedId) return row;
        const qty = Number(editQty || "0");
        return {
          ...row,
          가입고수량: formatNumber(qty),
          차이수량: row.상태 === "실입고완료" ? "0" : formatNumber(qty),
        };
      }),
    );
    showToast("가입고 수량 수정");
  };

  const confirmInbound = () => {
    if (!selectedId) {
      showToast("행을 선택하세요.");
      return;
    }
    setRows((prev) =>
      prev.map((row) =>
        row.__id === selectedId
          ? { ...row, 상태: "실입고완료", 실입고수량: row.가입고수량, 차이수량: "0" }
          : row,
      ),
    );
    showToast("실입고 처리 완료");
  };

  const summaryQty = rows.reduce((sum, row) => sum + Number(String(row.가입고수량).replace(/,/g, "")), 0);

  return (
    <PageLayout tabTitle={page.title} showDocLinks currentDocKey={page.pageKey}>
      <DocHeaderBlock page={page} />
      <DocFilterBlock page={page} helperText="가입고 등록 목록 조회 및 수정/실입고 처리" onSearch={() => showToast("검색 실행")} onReset={() => showToast("초기화")} />

      <DocSummaryCards
        items={[
          { name: "총 건수", value: formatNumber(rows.length), description: "조회 결과 행 수" },
          { name: "총 가입고 수량", value: formatNumber(summaryQty), description: "가입고수량 합계" },
          { name: "실입고완료 건수", value: formatNumber(rows.filter((row) => row.상태 === "실입고완료").length), description: "실입고 처리 완료" },
        ]}
      />

      <section className="special-panel">
        <h3>선택 행 편집</h3>
        <p>선택한 가입고 건의 수량 수정 또는 실입고 처리를 수행합니다.</p>
        <div className="entry-row">
          <span>선택 가입고번호</span>
          <strong>{selectedRow?.가입고번호 || "-"}</strong>
        </div>
        <div className="entry-inputs">
          <input type="number" min="0" value={editQty} onChange={(event) => setEditQty(event.target.value)} placeholder="가입고 수량" />
          <button type="button" className="secondary" onClick={applyEdit}>가입고 수정</button>
          <button type="button" className="primary" onClick={confirmInbound}>실입고 처리</button>
        </div>
      </section>

      <section className="table-toolbar doc-toolbar">
        <div className="count-info">가입고 목록 <strong>{formatNumber(rows.length)}건</strong></div>
        <div className="toolbar-actions">
          {page.actions.map((action) => (
            <button
              key={action}
              type="button"
              className="chip"
              onClick={() => {
                if (action.includes("실입고 처리")) confirmInbound();
                else if (action.includes("가입고 수정")) applyEdit();
                else showToast(`${action} 실행`);
              }}
            >
              {action}
            </button>
          ))}
        </div>
      </section>
      <DocTableBlock
        columns={columns}
        rows={rows}
        selectedId={selectedId}
        onRowClick={(row) => {
          setSelectedId(row.__id);
          setEditQty(Number(String(row.가입고수량 || "0").replace(/,/g, "")));
        }}
      />

      <DocMetaBlock page={page} toast={toast} />
    </PageLayout>
  );
}

function InboundReceiptCompareDoc({ page }) {
  const { toast, showToast } = useToast();
  const columns = page.columnTables?.[0]?.columns?.length ? page.columnTables[0].columns : [];
  const [mismatchOnly, setMismatchOnly] = useState(false);
  const [rows] = useState(() =>
    buildRows(columns, 10).map((row, index) => ({
      ...row,
      __id: `cmp-receipt-${index + 1}`,
      대조결과: ["일치", "부족", "초과"][index % 3],
      "차이수량": formatNumber(index % 3 === 0 ? 0 : index % 3 === 1 ? -5 - index : 4 + index),
    })),
  );

  const visible = mismatchOnly ? rows.filter((row) => row.대조결과 !== "일치") : rows;

  return (
    <PageLayout tabTitle={page.title} showDocLinks currentDocKey={page.pageKey}>
      <DocHeaderBlock page={page} />
      <DocFilterBlock page={page} helperText="가입고 등록 수량과 실입고 수량 대조" onSearch={() => showToast("검색 실행")} onReset={() => showToast("초기화")} />

      <DocSummaryCards
        items={[
          { name: "총 대조 건수", value: formatNumber(rows.length), description: "조회 조건 기준" },
          { name: "일치 건수", value: formatNumber(rows.filter((row) => row.대조결과 === "일치").length), description: "정상 대조 완료" },
          { name: "불일치 건수", value: formatNumber(rows.filter((row) => row.대조결과 !== "일치").length), description: "부족/초과 항목" },
        ]}
      />

      <section className="special-panel">
        <h3>대조 필터</h3>
        <p>불일치 항목만 빠르게 확인해 후속 조치할 수 있습니다.</p>
        <button type="button" className={`chip ${mismatchOnly ? "active-mode" : ""}`} onClick={() => setMismatchOnly((prev) => !prev)}>
          불일치만 보기
        </button>
      </section>

      <section className="table-toolbar doc-toolbar">
        <div className="count-info">대조 목록 <strong>{formatNumber(visible.length)}건</strong></div>
        <div className="toolbar-actions">
          {page.actions.map((action) => (
            <button key={action} type="button" className="chip" onClick={() => showToast(`${action} 실행`)}>
              {action}
            </button>
          ))}
        </div>
      </section>
      <DocTableBlock columns={columns} rows={visible} />

      <DocMetaBlock page={page} toast={toast} />
    </PageLayout>
  );
}

function InboundCurrentCompareDoc({ page }) {
  const { toast, showToast } = useToast();
  const columns = page.columnTables?.[0]?.columns?.length ? page.columnTables[0].columns : [];
  const [rows, setRows] = useState(() =>
    buildRows(columns, 10).map((row, index) => ({
      ...row,
      __id: `cmp-current-${index + 1}`,
      "대조 결과": ["일치", "부족", "초과"][index % 3],
      "차이수량": formatNumber(index % 3 === 0 ? 0 : index % 3 === 1 ? -9 - index : 7 + index),
      "재고조정 상태": index % 3 === 0 ? "불필요" : "요청대기",
    })),
  );
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [mismatchOnly, setMismatchOnly] = useState(false);

  const visible = mismatchOnly ? rows.filter((row) => row["대조 결과"] !== "일치") : rows;

  const toggleRow = (rowId) => {
    const next = new Set(selectedIds);
    if (next.has(rowId)) next.delete(rowId);
    else next.add(rowId);
    setSelectedIds(next);
  };

  const requestAdjustment = () => {
    if (!selectedIds.size) {
      showToast("재고조정 요청 대상을 선택하세요.");
      return;
    }
    setRows((prev) =>
      prev.map((row) =>
        selectedIds.has(row.__id) ? { ...row, "재고조정 상태": "요청완료" } : row,
      ),
    );
    setSelectedIds(new Set());
    showToast("재고조정 일괄 요청 완료");
  };

  return (
    <PageLayout tabTitle={page.title} showDocLinks currentDocKey={page.pageKey}>
      <DocHeaderBlock page={page} />
      <DocFilterBlock page={page} helperText="가입고와 현재고를 대조하여 차이 항목을 조정 연계" onSearch={() => showToast("검색 실행")} onReset={() => showToast("초기화")} />

      <DocSummaryCards
        items={[
          { name: "총 대조 건수", value: formatNumber(rows.length), description: "현재고 대조 대상" },
          { name: "차이 발생 건수", value: formatNumber(rows.filter((row) => row["대조 결과"] !== "일치").length), description: "조정 검토 필요" },
          { name: "요청완료 건수", value: formatNumber(rows.filter((row) => row["재고조정 상태"] === "요청완료").length), description: "R-STK-606 연계" },
        ]}
      />

      <section className="special-panel">
        <h3>일괄 재고조정 요청</h3>
        <p>차이 항목 선택 후 재고조정 요청을 생성합니다.</p>
        <div className="scan-row">
          <button type="button" className={`chip ${mismatchOnly ? "active-mode" : ""}`} onClick={() => setMismatchOnly((prev) => !prev)}>
            불일치만 보기
          </button>
          <button type="button" className="primary" onClick={requestAdjustment}>재고조정 일괄 요청</button>
        </div>
      </section>

      <section className="table-toolbar doc-toolbar">
        <div className="count-info">대조 목록 <strong>{formatNumber(visible.length)}건</strong> / 선택 <strong>{selectedIds.size}건</strong></div>
        <div className="toolbar-actions">
          {page.actions.map((action) => (
            <button
              key={action}
              type="button"
              className="chip"
              onClick={() => {
                if (action.includes("재고조정")) requestAdjustment();
                else showToast(`${action} 실행`);
              }}
            >
              {action}
            </button>
          ))}
        </div>
      </section>
      <DocTableBlock columns={columns} rows={visible} selectedId={null} onRowClick={(row) => toggleRow(row.__id)} />

      <DocMetaBlock page={page} toast={toast} />
    </PageLayout>
  );
}

function SnapshotHubDoc({ page }) {
  const { toast, showToast } = useToast();
  const columns = page.columnTables?.[0]?.columns?.length ? page.columnTables[0].columns : [];
  const [rows] = useState(() =>
    buildRows(columns, 8).map((row, index) => ({
      ...row,
      __id: `snapshot-${index + 1}`,
      상태: ["진행중", "완료", "미시작"][index % 3],
      "완료율(%)": `${68 + index}%`,
    })),
  );

  return (
    <PageLayout tabTitle={page.title} showDocLinks currentDocKey={page.pageKey}>
      <DocHeaderBlock page={page} />
      <DocFilterBlock page={page} helperText="기준일 상품보기 허브" onSearch={() => showToast("검색 실행")} onReset={() => showToast("초기화")} />

      <section className="special-panel">
        <h3>하위 메뉴 이동</h3>
        <p>문서 정의의 하위 탭/버튼으로 연결됩니다.</p>
        <div className="mode-toggle">
          <Link className="chip" to="/docs/page-001">등록상품보기</Link>
          <Link className="chip" to="/docs/page-002">작업내역보기</Link>
          <Link className="chip" to="/docs/page-003">차수별 상품보기내역</Link>
        </div>
      </section>

      <section className="table-toolbar doc-toolbar">
        <div className="count-info">기준일 상품조회 목록 <strong>{formatNumber(rows.length)}건</strong></div>
        <div className="toolbar-actions">
          {page.actions.map((action) => (
            <button key={action} type="button" className="chip" onClick={() => showToast(`${action} 실행`)}>
              {action}
            </button>
          ))}
        </div>
      </section>
      <DocTableBlock columns={columns} rows={rows} />

      <DocMetaBlock page={page} toast={toast} />
    </PageLayout>
  );
}

function LocationSurveyDoc({ page }) {
  const { toast, showToast } = useToast();
  const columns = page.columnTables?.[0]?.columns?.length ? page.columnTables[0].columns : [];
  const [rows, setRows] = useState(() =>
    buildRows(columns, 10).map((row, index) => ({
      ...row,
      __id: `survey-${index + 1}`,
      "전산재고": formatNumber(180 + index * 5),
      "실재고": "-",
      "차이수량": "-",
      상태: "미조사",
    })),
  );
  const [selectedId, setSelectedId] = useState("");
  const [realQty, setRealQty] = useState("");

  const selectedRow = rows.find((row) => row.__id === selectedId);

  const saveRealQty = () => {
    if (!selectedId) {
      showToast("행을 선택하세요.");
      return;
    }
    if (realQty === "") {
      showToast("실재고 수량을 입력하세요.");
      return;
    }
    setRows((prev) =>
      prev.map((row) => {
        if (row.__id !== selectedId) return row;
        const systemQty = Number(String(row["전산재고"] || "0").replace(/,/g, ""));
        const actual = Number(realQty);
        const diff = actual - systemQty;
        return {
          ...row,
          "실재고": formatNumber(actual),
          "차이수량": diff > 0 ? `+${formatNumber(diff)}` : formatNumber(diff),
          상태: "실재고입력",
        };
      }),
    );
    showToast("실재고 입력 저장");
  };

  const completeSurvey = () => {
    setRows((prev) => prev.map((row) => (row.상태 === "실재고입력" ? { ...row, 상태: "조사완료" } : row)));
    showToast("조사 완료 처리");
  };

  return (
    <PageLayout tabTitle={page.title} showDocLinks currentDocKey={page.pageKey}>
      <DocHeaderBlock page={page} />
      <DocFilterBlock page={page} helperText="로케이션 단위 실재고 조사 입력" onSearch={() => showToast("검색 실행")} onReset={() => showToast("초기화")} />

      <DocSummaryCards
        items={[
          { name: "총 조사 건수", value: formatNumber(rows.length), description: "조회 대상 SKU" },
          { name: "실재고 입력 건수", value: formatNumber(rows.filter((row) => row.상태 === "실재고입력").length), description: "입력 후 미완료" },
          { name: "조사완료 건수", value: formatNumber(rows.filter((row) => row.상태 === "조사완료").length), description: "확정 완료" },
        ]}
      />

      <section className="special-panel">
        <h3>실재고 입력 패널</h3>
        <p>선택한 행의 실재고 수량을 입력하여 차이수량을 계산합니다.</p>
        <div className="entry-row">
          <span>선택 상품코드</span>
          <strong>{selectedRow?.상품코드 || "-"}</strong>
        </div>
        <div className="entry-row">
          <span>전산재고</span>
          <strong>{selectedRow?.전산재고 || "-"}</strong>
        </div>
        <div className="entry-inputs">
          <input type="number" min="0" value={realQty} onChange={(event) => setRealQty(event.target.value)} placeholder="실재고 수량" />
          <button type="button" className="primary" onClick={saveRealQty}>실재고 입력</button>
          <button type="button" className="secondary" onClick={completeSurvey}>조사 완료</button>
        </div>
      </section>

      <section className="table-toolbar doc-toolbar">
        <div className="count-info">조사 목록 <strong>{formatNumber(rows.length)}건</strong></div>
        <div className="toolbar-actions">
          {page.actions.map((action) => (
            <button
              key={action}
              type="button"
              className="chip"
              onClick={() => {
                if (action.includes("실재고")) saveRealQty();
                else if (action.includes("완료")) completeSurvey();
                else showToast(`${action} 실행`);
              }}
            >
              {action}
            </button>
          ))}
        </div>
      </section>
      <DocTableBlock
        columns={columns}
        rows={rows}
        selectedId={selectedId}
        onRowClick={(row) => {
          setSelectedId(row.__id);
          setRealQty(row["실재고"] && row["실재고"] !== "-" ? Number(String(row["실재고"]).replace(/,/g, "")) : "");
        }}
      />

      <DocMetaBlock page={page} toast={toast} />
    </PageLayout>
  );
}

function StockAdjustmentDoc({ page }) {
  const { toast, showToast } = useToast();
  const columns = page.columnTables?.[0]?.columns?.length ? page.columnTables[0].columns : [];
  const [rows, setRows] = useState(() =>
    buildRows(columns, 9).map((row, index) => ({
      ...row,
      __id: `adj-${index + 1}`,
      상태: ["요청", "승인대기", "승인완료", "반려"][index % 4],
      "조정유형": index % 2 ? "증가(+)" : "감소(-)",
      "조정수량": index % 2 ? `+${formatNumber(3 + index)}` : `-${formatNumber(2 + index)}`,
    })),
  );
  const [requestForm, setRequestForm] = useState({ code: "", qty: "", reason: "" });
  const [selectedId, setSelectedId] = useState("");

  const createRequest = () => {
    if (!requestForm.code.trim() || !requestForm.qty.trim() || !requestForm.reason.trim()) {
      showToast("요청 정보(상품코드/수량/사유)를 입력하세요.");
      return;
    }
    const row = { __id: `adj-${Date.now()}` };
    columns.forEach((column, index) => {
      if (/상품코드/.test(column)) row[column] = requestForm.code.trim();
      else if (/조정수량/.test(column)) row[column] = `${Number(requestForm.qty) > 0 ? "+" : ""}${formatNumber(requestForm.qty)}`;
      else if (/조정사유|사유/.test(column)) row[column] = requestForm.reason.trim();
      else if (/상태/.test(column)) row[column] = "요청";
      else row[column] = sampleValue(column, index + 2);
    });
    setRows((prev) => [row, ...prev]);
    setRequestForm({ code: "", qty: "", reason: "" });
    showToast("재고조정 요청 생성");
  };

  const updateStatus = (status) => {
    if (!selectedId) {
      showToast("행을 선택하세요.");
      return;
    }
    setRows((prev) => prev.map((row) => (row.__id === selectedId ? { ...row, 상태: status } : row)));
    showToast(`상태 변경: ${status}`);
  };

  return (
    <PageLayout tabTitle={page.title} showDocLinks currentDocKey={page.pageKey}>
      <DocHeaderBlock page={page} />
      <DocFilterBlock page={page} helperText="재고조정 요청/승인/반려 처리" onSearch={() => showToast("검색 실행")} onReset={() => showToast("초기화")} />

      <section className="special-panel">
        <h3>재고조정 요청 폼</h3>
        <p>상품코드와 조정수량, 사유를 입력해 요청을 생성합니다.</p>
        <div className="entry-inputs">
          <input
            type="text"
            value={requestForm.code}
            onChange={(event) => setRequestForm((prev) => ({ ...prev, code: event.target.value }))}
            placeholder="상품코드"
          />
          <input
            type="number"
            value={requestForm.qty}
            onChange={(event) => setRequestForm((prev) => ({ ...prev, qty: event.target.value }))}
            placeholder="조정수량 (+/-)"
          />
          <input
            type="text"
            value={requestForm.reason}
            onChange={(event) => setRequestForm((prev) => ({ ...prev, reason: event.target.value }))}
            placeholder="조정사유"
          />
          <button type="button" className="primary" onClick={createRequest}>요청 생성</button>
          <button type="button" className="secondary" onClick={() => updateStatus("승인완료")}>선택 승인</button>
          <button type="button" className="secondary" onClick={() => updateStatus("반려")}>선택 반려</button>
        </div>
      </section>

      <section className="table-toolbar doc-toolbar">
        <div className="count-info">재고조정 목록 <strong>{formatNumber(rows.length)}건</strong></div>
        <div className="toolbar-actions">
          {page.actions.map((action) => (
            <button
              key={action}
              type="button"
              className="chip"
              onClick={() => {
                if (action.includes("요청")) createRequest();
                else if (action.includes("승인")) updateStatus("승인완료");
                else if (action.includes("반려")) updateStatus("반려");
                else showToast(`${action} 실행`);
              }}
            >
              {action}
            </button>
          ))}
        </div>
      </section>
      <DocTableBlock columns={columns} rows={rows} selectedId={selectedId} onRowClick={(row) => setSelectedId(row.__id)} />

      <DocMetaBlock page={page} toast={toast} />
    </PageLayout>
  );
}

function AdjustmentBatchListDoc({ page }) {
  const { toast, showToast } = useToast();
  const masterColumns = page.columnTables?.[0]?.columns?.length ? page.columnTables[0].columns : [];
  const detailColumns = page.columnTables?.[1]?.columns?.length ? page.columnTables[1].columns : [];
  const [masterRows] = useState(() =>
    buildRows(masterColumns, 7).map((row, index) => ({
      ...row,
      __id: `adj-batch-${index + 1}`,
      차수번호: `ADJ-BATCH-202603-${String(index + 1).padStart(3, "0")}`,
      "순 재고 변동": index % 2 ? `+${formatNumber(30 + index)}` : `-${formatNumber(18 + index)}`,
    })),
  );
  const [selectedId, setSelectedId] = useState("");
  const [detailRows, setDetailRows] = useState(() => buildRows(detailColumns, 6));

  return (
    <PageLayout tabTitle={page.title} showDocLinks currentDocKey={page.pageKey}>
      <DocHeaderBlock page={page} />
      <DocFilterBlock page={page} helperText="차수별 재고조정 이력 조회" onSearch={() => showToast("검색 실행")} onReset={() => showToast("초기화")} />

      <DocSummaryCards
        items={[
          { name: "조회 기간 내 총 차수 수", value: formatNumber(masterRows.length), description: "조정 배치 건수" },
          { name: "총 조정 SKU 건수", value: formatNumber(402), description: "전체 조정 SKU 합계" },
          { name: "순 재고 변동", value: "-78", description: "증가/감소 순합" },
        ]}
      />

      <section className="table-toolbar doc-toolbar">
        <div className="count-info">차수 목록 <strong>{formatNumber(masterRows.length)}건</strong></div>
        <div className="toolbar-actions">
          {page.actions.map((action) => (
            <button key={action} type="button" className="chip" onClick={() => showToast(`${action} 실행`)}>
              {action}
            </button>
          ))}
        </div>
      </section>
      <DocTableBlock
        columns={masterColumns}
        rows={masterRows}
        selectedId={selectedId}
        onRowClick={(row) => {
          setSelectedId(row.__id);
          setDetailRows(
            buildRows(detailColumns, 6).map((item, index) => ({
              ...item,
              __id: `adj-detail-${index + 1}`,
              차수번호: row.차수번호,
            })),
          );
        }}
      />

      {detailColumns.length ? (
        <section className="drilldown-block">
          <div className="drilldown-title">선택 차수 상세 내역</div>
          <DocTableBlock columns={detailColumns} rows={detailRows} />
        </section>
      ) : null}

      <DocMetaBlock page={page} toast={toast} />
    </PageLayout>
  );
}

function SlowMovingStockDoc({ page }) {
  const { toast, showToast } = useToast();
  const columns = page.columnTables?.[0]?.columns?.length ? page.columnTables[0].columns : [];
  const historyColumns = page.columnTables?.[1]?.columns?.length ? page.columnTables[1].columns : [];
  const [gradeFilter, setGradeFilter] = useState("90일 이상");
  const [rows, setRows] = useState(() =>
    buildRows(columns, 10).map((row, index) => ({
      ...row,
      __id: `slow-${index + 1}`,
      "부진 등급": ["주의 (90일+)", "경고 (180일+)", "위험 (365일+)"][index % 3],
      "처리 상태": ["미처리", "처리예정", "처리완료"][index % 3],
      "미이동일수": formatNumber(90 + index * 21),
    })),
  );
  const [selectedId, setSelectedId] = useState("");
  const [historyRows, setHistoryRows] = useState(() => buildRows(historyColumns, 5));

  const filteredRows = useMemo(() => {
    if (gradeFilter === "90일 이상") return rows;
    if (gradeFilter === "180일 이상") return rows.filter((row) => row["부진 등급"] !== "주의 (90일+)");
    return rows.filter((row) => row["부진 등급"] === "위험 (365일+)");
  }, [rows, gradeFilter]);

  const markProcessing = () => {
    if (!selectedId) {
      showToast("항목을 선택하세요.");
      return;
    }
    setRows((prev) => prev.map((row) => (row.__id === selectedId ? { ...row, "처리 상태": "처리예정" } : row)));
    showToast("처리예정 표시 완료");
  };

  return (
    <PageLayout tabTitle={page.title} showDocLinks currentDocKey={page.pageKey}>
      <DocHeaderBlock page={page} />
      <DocFilterBlock page={page} helperText="부진 기준별 재고 분석" onSearch={() => showToast("검색 실행")} onReset={() => showToast("초기화")} />

      <DocSummaryCards
        items={[
          { name: "부진재고 총 수량", value: formatNumber(16320), description: "필터 기준 수량 합계" },
          { name: "365일+ SKU 수", value: formatNumber(rows.filter((row) => row["부진 등급"] === "위험 (365일+)").length), description: "우선 처리 필요" },
          { name: "유효기간 임박 SKU 수", value: formatNumber(23), description: "30일 이내 만료 예정" },
        ]}
      />

      <section className="special-panel">
        <h3>부진 등급 차트</h3>
        <p>등급별 분포를 기준으로 처리 대상을 선별합니다.</p>
        <div className="mode-toggle">
          {["90일 이상", "180일 이상", "365일 이상"].map((grade) => (
            <button key={grade} type="button" className={`chip ${gradeFilter === grade ? "active-mode" : ""}`} onClick={() => setGradeFilter(grade)}>
              {grade}
            </button>
          ))}
        </div>
        <div className="chart-bars">
          <div><span>90일+</span><b style={{ width: "42%" }}>42%</b></div>
          <div><span>180일+</span><b style={{ width: "27%" }}>27%</b></div>
          <div><span>365일+</span><b style={{ width: "14%" }}>14%</b></div>
        </div>
      </section>

      <section className="table-toolbar doc-toolbar">
        <div className="count-info">부진 재고 목록 <strong>{formatNumber(filteredRows.length)}건</strong></div>
        <div className="toolbar-actions">
          {page.actions.map((action) => (
            <button
              key={action}
              type="button"
              className="chip"
              onClick={() => {
                if (action.includes("처리예정")) markProcessing();
                else showToast(`${action} 실행`);
              }}
            >
              {action}
            </button>
          ))}
        </div>
      </section>
      <DocTableBlock
        columns={columns}
        rows={filteredRows}
        selectedId={selectedId}
        onRowClick={(row) => {
          setSelectedId(row.__id);
          setHistoryRows(
            buildRows(historyColumns, 5).map((item, index) => ({
              ...item,
              __id: `history-${index + 1}`,
              상품코드: row.상품코드 || row["상품코드"] || "-",
            })),
          );
        }}
      />

      {historyColumns.length ? (
        <section className="drilldown-block">
          <div className="drilldown-title">적치이력</div>
          <DocTableBlock columns={historyColumns} rows={historyRows} />
        </section>
      ) : null}

      <DocMetaBlock page={page} toast={toast} />
    </PageLayout>
  );
}

function LocationAvailabilityDoc({ page }) {
  const { toast, showToast } = useToast();
  const columns = page.columnTables?.[0]?.columns?.length ? page.columnTables[0].columns : [];
  const [rows] = useState(() =>
    buildRows(columns, 12).map((row, index) => ({
      ...row,
      __id: `loc-${index + 1}`,
      가용재고: formatNumber(100 + index * 3),
      예약재고: formatNumber(15 + index),
      불용재고: formatNumber(index % 3),
      총재고: formatNumber(115 + index * 4),
      로케이션: `${String.fromCharCode(65 + (index % 6))}-0${(index % 8) + 1}-0${(index % 5) + 1}`,
    })),
  );
  const [selectedId, setSelectedId] = useState("");

  const selectedRow = rows.find((row) => row.__id === selectedId);

  return (
    <PageLayout tabTitle={page.title} showDocLinks currentDocKey={page.pageKey}>
      <DocHeaderBlock page={page} />
      <DocFilterBlock page={page} helperText="로케이션별 가용/예약/불용 조회" onSearch={() => showToast("검색 실행")} onReset={() => showToast("초기화")} />

      <DocSummaryCards
        items={[
          { name: "총 사용 로케이션 수", value: formatNumber(86), description: "재고 보관중 로케이션" },
          { name: "총 가용재고", value: formatNumber(8230), description: "즉시 출고 가능 수량" },
          { name: "총 불용재고", value: formatNumber(132), description: "파손/불량 처리 수량" },
        ]}
      />

      <section className="special-panel">
        <h3>로케이션 상세</h3>
        <p>행 선택 시 해당 로케이션의 상세 정보를 확인합니다.</p>
        <div className="entry-row">
          <span>선택 로케이션</span>
          <strong>{selectedRow?.로케이션 || "-"}</strong>
        </div>
        <div className="entry-row">
          <span>점유 현황</span>
          <strong>{selectedRow ? `가용 ${selectedRow.가용재고} / 예약 ${selectedRow.예약재고} / 불용 ${selectedRow.불용재고}` : "-"}</strong>
        </div>
      </section>

      <section className="table-toolbar doc-toolbar">
        <div className="count-info">위치별 재고 <strong>{formatNumber(rows.length)}건</strong></div>
        <div className="toolbar-actions">
          {page.actions.map((action) => (
            <button key={action} type="button" className="chip" onClick={() => showToast(`${action} 실행`)}>
              {action}
            </button>
          ))}
        </div>
      </section>
      <DocTableBlock columns={columns} rows={rows} selectedId={selectedId} onRowClick={(row) => setSelectedId(row.__id)} />

      <DocMetaBlock page={page} toast={toast} />
    </PageLayout>
  );
}

function DocDemoPage() {
  const { pageKey = "" } = useParams();
  const page = DOC_PAGES.find((item) => item.pageKey === pageKey);

  if (!page) {
    return (
      <PageLayout tabTitle="문서 없음" showDocLinks>
        <section className="quick-links">
          <h2>요청한 문서를 찾을 수 없습니다.</h2>
          <div className="quick-grid">
            <Link to="/docs">문서 목록으로 이동</Link>
            <Link to="/">기본 페이지로 이동</Link>
          </div>
        </section>
      </PageLayout>
    );
  }

  const componentMap = {
    "page-001": RegisteredProductsDoc,
    "page-002": WorkHistoryDoc,
    "page-003": BatchHistoryDoc,
    "page-004": IndividualInboundDoc,
    "page-005": BarcodeInboundDoc,
    "page-006": ExcelInboundDoc,
    "page-007": ExcelBatchListDoc,
    "r-stk-603": InboundListDoc,
    "r-stk-604": InboundReceiptCompareDoc,
    "r-stk-605": InboundCurrentCompareDoc,
    "r-stk-607": SnapshotHubDoc,
    "r-stk-602": ProductInboundHubDoc,
    "r-stk-601": LocationSurveyDoc,
    "r-stk-606": StockAdjustmentDoc,
    "page-015": AdjustmentBatchListDoc,
    "page-016": SlowMovingStockDoc,
    "r-stk-1001": LocationAvailabilityDoc,
  };

  const Component = componentMap[page.pageKey];
  if (!Component) {
    return (
      <PageLayout tabTitle={page.title} showDocLinks currentDocKey={page.pageKey}>
        <section className="quick-links">
          <h2>해당 문서의 전용 컴포넌트를 찾을 수 없습니다.</h2>
          <div className="quick-grid">
            <Link to="/docs">문서 목록으로 이동</Link>
          </div>
        </section>
      </PageLayout>
    );
  }

  return <Component page={page} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BaseInventoryPage />} />
        <Route path="/docs" element={<DocsIndexPage />} />
        <Route path="/docs/:pageKey" element={<DocDemoPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

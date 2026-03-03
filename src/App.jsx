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

function splitKeywords(value) {
  return String(value || "")
    .split(/[,\n]/)
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function matchesKeyword(value, keywords) {
  if (!keywords.length) return true;
  const source = String(value || "").toLowerCase();
  return keywords.some((keyword) => source.includes(keyword));
}

const EXTRA_PAGES = [
  {
    id: "R-STK-101",
    code: "R-STK-101",
    title: "입출고 목록",
    pageTitle: "입출고 목록",
    docPath: "이미지 요구사항 기반 추가 페이지",
    menuGroup: "입출고 목록",
    purpose: "상품의 입고/출고 현황, 내역, 창고 변경 이력을 조회하고 재고를 관리하는 메뉴",
    fields: ["기간", "화주사", "창고", "입출고 유형", "상품코드", "바코드", "상태"],
    actions: ["조회", "초기화", "엑셀 다운로드", "상세 보기"],
    columnTables: [
      {
        section: "목록 컬럼",
        columns: [
          "입출고번호",
          "입출고 유형",
          "화주사",
          "창고",
          "상품코드",
          "바코드",
          "수량",
          "변경 전 위치",
          "변경 후 위치",
          "처리일시",
          "처리자",
          "상태",
        ],
      },
    ],
    summaries: [
      {
        section: "요약",
        items: [
          { name: "총 입출고 건수", description: "조회 기간 내 입/출고 처리 건수" },
          { name: "총 입고 수량", description: "입고 처리 수량 합계" },
          { name: "총 출고 수량", description: "출고 처리 수량 합계" },
        ],
      },
    ],
    apis: [],
  },
];

const SELLMATE_PAGES = [
  {
    id: "SM-STK-201",
    code: "SM-STK-201",
    title: "품목별 재고 목록",
    pageTitle: "품목별 재고 목록",
    docPath: "재고/품목별재고목록_상세분석.md",
    menuGroup: "재고 (Sellmate)",
    purpose: "품목(재고) 단위로 재고 상태(가용/예약/불량/검수대기/특수)와 Zone 분포를 통합 조회하는 화면",
    fields: [],
    actions: ["검색", "검색 초기화", "엑셀 다운로드", "활용 TIP"],
    columnTables: [],
    summaries: [],
    apis: [],
  },
  {
    id: "SM-STK-202",
    code: "SM-STK-202",
    title: "품목 바코드 출력",
    pageTitle: "품목 바코드 출력",
    docPath: "재고/품목바코드출력_상세분석.md",
    menuGroup: "재고 (Sellmate)",
    purpose: "화주/품목 조건으로 출력 대상을 선택해 바코드 라벨을 인쇄하는 화면",
    fields: [],
    actions: ["검색", "검색 초기화", "출력", "출력 템플릿 관리"],
    columnTables: [],
    summaries: [],
    apis: [],
  },
  {
    id: "SM-STK-203",
    code: "SM-STK-203",
    title: "로케이션별 재고 목록",
    pageTitle: "로케이션별 재고 목록",
    docPath: "재고/로케이션별재고목록_상세분석.md",
    menuGroup: "재고 (Sellmate)",
    purpose: "로케이션(Zone + 위치) 단위로 재고를 상세 조회하고 유통기한/로트/공급처를 함께 확인하는 화면",
    fields: [],
    actions: ["검색", "검색 초기화", "엑셀 다운로드", "활용 TIP"],
    columnTables: [],
    summaries: [],
    apis: [],
  },
  {
    id: "SM-STK-204",
    code: "SM-STK-204",
    title: "입출고 및 이동 내역",
    pageTitle: "입출고 및 이동 내역",
    docPath: "재고/입출고및이동내역.md",
    menuGroup: "재고 이동 (Sellmate)",
    purpose: "입출고/이동/반품/조정 이력 조회와 이동 오더·지시·실행·임의이동 흐름을 통합 데모로 제공",
    fields: [],
    actions: ["검색", "검색 초기화", "엑셀 다운로드"],
    columnTables: [],
    summaries: [],
    apis: [],
  },
];

const DOC_PAGES = [...pageSpecs.pages, ...EXTRA_PAGES, ...SELLMATE_PAGES].map((page, index) => {
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
  if (/화주사/.test(column)) return ["화주사 A", "화주사 B"][idx % 2];
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
  if (/재고/.test(column)) return formatNumber(120 + idx);
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
          <button type="button" className="menu-item">화주사 관리</button>
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
            <div className="menu-title">재고 문서 데모 링크</div>
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
          <Link to="/docs" className="chip">문서 데모 전체</Link>
          <button type="button" className="text-btn">재고관리자</button>
          <button type="button" className="text-btn">재고 갱신</button>
        </div>
      </div>

      <section className="quick-links">
        <h2>재고 문서 페이지 바로가기 ({DOC_PAGES.length}개)</h2>
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
                화주사
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
    <PageLayout tabTitle="재고 문서 데모" showDocLinks>
      <div className="page-head">
        <h1>재고 문서 데모 목록</h1>
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
  const ownerOptions = ["원차일드", "onedns_test", "테스트", "안나랜모드"];
  const [selectedOwners, setSelectedOwners] = useState(() => new Set());
  const [scanMode, setScanMode] = useState("자동");
  const [scanValue, setScanValue] = useState("");
  const [rows, setRows] = useState(() =>
    buildRows(columns, 4).map((row, index) => ({
      ...row,
      __id: `scan-init-${index + 1}`,
      화주사: ownerOptions[index % ownerOptions.length],
      품목코드: row.품목코드 || `JT00${9301 + index}`,
    })),
  );
  const [selectedRows, setSelectedRows] = useState(() => new Set());

  const toggleOwner = (owner) => {
    setSelectedOwners((prev) => {
      const next = new Set(prev);
      if (next.has(owner)) next.delete(owner);
      else next.add(owner);
      return next;
    });
  };

  const filteredRows = useMemo(() => {
    if (!selectedOwners.size) return [];
    return rows.filter((row) => selectedOwners.has(row.화주사));
  }, [rows, selectedOwners]);

  const selectedCount = filteredRows.filter((row) => selectedRows.has(row.__id)).length;
  const displayColumns = ["선택", ...columns];
  const displayRows = filteredRows.map((row) => ({ ...row, 선택: selectedRows.has(row.__id) ? "☑" : "☐" }));

  const addScan = () => {
    if (!selectedOwners.size) {
      showToast("화주사를 먼저 선택하세요.");
      return;
    }
    const value = scanValue.trim();
    if (!value) return;
    const row = { __id: `scan-${Date.now()}` };
    columns.forEach((column, index) => {
      if (/바코드/.test(column)) row[column] = value;
      else if (/수량|가입고/.test(column)) row[column] = formatNumber(1);
      else if (/입력방식|스캔/.test(column)) row[column] = scanMode;
      else row[column] = sampleValue(column, index + 3);
    });
    row.화주사 = [...selectedOwners][0];
    setRows((prev) => [row, ...prev]);
    setScanValue("");
    showToast(`스캔 등록: ${value}`);
  };

  return (
    <PageLayout tabTitle={page.title} showDocLinks currentDocKey={page.pageKey}>
      <DocHeaderBlock page={page} />
      <DocFilterBlock
        page={page}
        helperText="화주사 선택 후 조회/선택/출력하는 바코드 작업 흐름"
        onSearch={() => showToast(selectedOwners.size ? `조회 결과 ${filteredRows.length}건` : "화주사를 선택하세요.")}
        onReset={() => {
          setSelectedOwners(new Set());
          setSelectedRows(new Set());
          setScanValue("");
          showToast("초기화");
        }}
      >
        <div className="search-check-list">
          {ownerOptions.map((owner) => (
            <button
              key={owner}
              type="button"
              className={`search-check-chip ${selectedOwners.has(owner) ? "checked" : ""}`}
              onClick={() => toggleOwner(owner)}
            >
              <span className="search-check-mark" aria-hidden="true" />
              {owner}
            </button>
          ))}
        </div>
      </DocFilterBlock>

      <section className="special-panel">
        <h3>스캔 입력 영역</h3>
        <p>자동/수동 스캔 입력과 선택 출력 흐름을 함께 데모합니다.</p>
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
          { name: "총 조회 건수", value: formatNumber(filteredRows.length), description: "화주사 선택 기준" },
          { name: "선택 건수", value: formatNumber(selectedCount), description: "출력 대상 선택 건수" },
          { name: "누적 스캔 건수", value: formatNumber(rows.length), description: "전체 스캔 누적" },
        ]}
      />

      <section className="table-toolbar doc-toolbar">
        <div className="count-info">스캔 누적 목록 <strong>{formatNumber(filteredRows.length)}건</strong> / <strong>{formatNumber(selectedCount)}건 선택</strong></div>
        <div className="toolbar-actions">
          <button type="button" className="chip" onClick={() => setSelectedRows(new Set(filteredRows.map((row) => row.__id)))}>
            전체 선택
          </button>
          <button type="button" className="chip" onClick={() => setSelectedRows(new Set())}>선택 해제</button>
          <button
            type="button"
            className="primary"
            disabled={selectedCount === 0}
            onClick={() => showToast(`${selectedCount}건 바코드 출력 실행`)}
          >
            출력
          </button>
          <button type="button" className="chip" onClick={() => showToast("출력 템플릿 관리 화면으로 이동")}>
            출력 템플릿 관리
          </button>
          {page.actions.map((action) => (
            <button key={action} type="button" className="chip" onClick={() => showToast(`${action} 실행`)}>
              {action}
            </button>
          ))}
        </div>
      </section>
      {!selectedOwners.size ? (
        <div className="empty-state bordered">데이터를 불러오기 위해, 검색 조건(화주사) 설정이 필요합니다.</div>
      ) : (
        <DocTableBlock
          columns={displayColumns}
          rows={displayRows}
          onRowClick={(row) => {
            setSelectedRows((prev) => {
              const next = new Set(prev);
              if (next.has(row.__id)) next.delete(row.__id);
              else next.add(row.__id);
              return next;
            });
          }}
        />
      )}

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
  const [rowsPerPage, setRowsPerPage] = useState("50");
  const [pageNo, setPageNo] = useState(1);

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
      화주사: ["화주사 A", "화주사 B"][index % 2],
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
    setPageNo(1);
    showToast(`조회 완료: ${inputs.length}건`);
  };

  const inputCount = rows.length;
  const matchCount = rows.filter((row) => row["매칭 여부"] === "매칭됨").length;
  const unregisteredCount = inputCount - matchCount;
  const pageSize = Number(rowsPerPage);
  const totalPage = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePageNo = Math.min(pageNo, totalPage);
  const visibleRows = rows.slice((safePageNo - 1) * pageSize, safePageNo * pageSize);

  useEffect(() => {
    if (pageNo !== safePageNo) setPageNo(safePageNo);
  }, [pageNo, safePageNo]);

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
        <div className="count-info">조회 결과 <strong>{formatNumber(rows.length)}건</strong> (페이지 {safePageNo}/{totalPage})</div>
        <div className="toolbar-actions">
          <button
            type="button"
            className="chip"
            onClick={() => showToast("TIP: 품목명 링크를 클릭하면 상세 재고 화면으로 이동합니다.")}
          >
            활용 TIP
          </button>
          <select value={rowsPerPage} onChange={(event) => setRowsPerPage(event.target.value)}>
            <option value="50">50개씩 보기</option>
            <option value="100">100개씩 보기</option>
            <option value="150">150개씩 보기</option>
            <option value="200">200개씩 보기</option>
          </select>
        </div>
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
              {visibleRows.map((row) => (
                <tr key={row.__id}>
                  {primaryColumns.map((column) => {
                    const cell = row[column] || "-";
                    if (column === "상품명" && cell !== "-") {
                      return (
                        <td key={`${row.__id}-${column}`}>
                          <button type="button" className="link-btn" onClick={() => showToast(`${cell} 상세 이동`)}>
                            {cell}
                          </button>
                        </td>
                      );
                    }
                    return <td key={`${row.__id}-${column}`}>{cell}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">조회 버튼을 눌러 결과를 확인하세요.</div>
        )}
      </div>
      {rows.length ? (
        <div className="pager-inline">
          <button type="button" className="chip" onClick={() => setPageNo((prev) => Math.max(1, prev - 1))}>이전</button>
          <span>{safePageNo} / {totalPage}</span>
          <button type="button" className="chip" onClick={() => setPageNo((prev) => Math.min(totalPage, prev + 1))}>다음</button>
        </div>
      ) : null}

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
            <p>화주사/창고/기준일/상품코드/바코드/실산상태 등 문서 기준 조건</p>
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
          <div className="summary-name">총 조회 재고 수</div>
          <div className="summary-value">{formatNumber(summary.total)}</div>
          <div className="summary-desc">검색 조건 기준 재고</div>
        </article>
        <article className="summary-card">
          <div className="summary-name">실산 완료 건수</div>
          <div className="summary-value">{formatNumber(summary.done)}</div>
          <div className="summary-desc">실산수량 입력 완료</div>
        </article>
        <article className="summary-card">
          <div className="summary-name">미입력 건수</div>
          <div className="summary-value">{formatNumber(summary.pending)}</div>
          <div className="summary-desc">실산 미입력 재고</div>
        </article>
      </div>

      <section className="special-panel">
        <h3>실산 입력 패널</h3>
        <p>목록에서 상품을 선택한 뒤 실산수량/메모를 저장합니다.</p>
        <div className="entry-panel">
          <div className="entry-row">
            <span>선택 재고</span>
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
      "조회 재고 건수": formatNumber(240 + index * 13),
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
      (sum, row) => sum + Number(String(row["조회 재고 건수"] || "0").replace(/,/g, "")),
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
            <p>기준일/화주사/창고/조사차수/완료상태 기준 조회</p>
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
          <div className="summary-name">총 조회 재고 건수</div>
          <div className="summary-value">{formatNumber(summary.totalSku)}</div>
          <div className="summary-desc">전체 차수 재고 합계</div>
        </article>
        <article className="summary-card">
          <div className="summary-name">전체 실산완료율(%)</div>
          <div className="summary-value">{summary.rate}%</div>
          <div className="summary-desc">완료 재고 / 총 재고</div>
        </article>
      </div>

      <section className="special-panel">
        <h3>차수별 집계 제어</h3>
        <p>차수 행 클릭 시 재고별 상세 내역을 하단에 드릴다운 표시합니다.</p>
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
          <div className="drilldown-title">재고별 상세 내역 (선택 차수 드릴다운)</div>
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
          { name: "총 조사 건수", value: formatNumber(rows.length), description: "조회 대상 재고" },
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
          { name: "총 조정 재고 건수", value: formatNumber(402), description: "전체 조정 재고 합계" },
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
  const [activeGradeLabel, setActiveGradeLabel] = useState("주의 (90일+)");

  const filteredRows = useMemo(() => {
    if (gradeFilter === "90일 이상") return rows;
    if (gradeFilter === "180일 이상") return rows.filter((row) => row["부진 등급"] !== "주의 (90일+)");
    return rows.filter((row) => row["부진 등급"] === "위험 (365일+)");
  }, [rows, gradeFilter]);

  const gradeStats = useMemo(() => {
    const total = rows.length || 1;
    const config = [
      { label: "주의 (90일+)", short: "90일+", filter: "90일 이상", recommendation: "화주사 현황 공유" },
      { label: "경고 (180일+)", short: "180일+", filter: "180일 이상", recommendation: "처리 방향 협의" },
      { label: "위험 (365일+)", short: "365일+", filter: "365일 이상", recommendation: "할인/폐기/반품 우선 처리" },
    ];
    return config.map((item) => {
      const count = rows.filter((row) => row["부진 등급"] === item.label).length;
      const ratio = Math.round((count / total) * 100);
      return { ...item, count, ratio };
    });
  }, [rows]);

  const activeGrade = gradeStats.find((item) => item.label === activeGradeLabel) || gradeStats[0];

  useEffect(() => {
    if (!activeGrade && gradeStats.length) setActiveGradeLabel(gradeStats[0].label);
  }, [activeGrade, gradeStats]);

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
          { name: "365일+ 재고 수", value: formatNumber(rows.filter((row) => row["부진 등급"] === "위험 (365일+)").length), description: "우선 처리 필요" },
          { name: "유효기간 임박 재고 수", value: formatNumber(23), description: "30일 이내 만료 예정" },
        ]}
      />

      <section className="special-panel">
        <h3>부진 등급 차트</h3>
        <p>막대를 클릭하면 해당 등급 기준으로 즉시 필터링됩니다.</p>
        <div className="mode-toggle">
          {["90일 이상", "180일 이상", "365일 이상"].map((grade) => (
            <button key={grade} type="button" className={`chip ${gradeFilter === grade ? "active-mode" : ""}`} onClick={() => setGradeFilter(grade)}>
              {grade}
            </button>
          ))}
        </div>
        <div className="interactive-chart">
          {gradeStats.map((stat) => (
            <button
              key={stat.label}
              type="button"
              className={`chart-row-btn ${activeGradeLabel === stat.label ? "active" : ""}`}
              onMouseEnter={() => setActiveGradeLabel(stat.label)}
              onClick={() => {
                setActiveGradeLabel(stat.label);
                setGradeFilter(stat.filter);
              }}
            >
              <span className="chart-row-label">{stat.short}</span>
              <div className="chart-row-track">
                <b style={{ width: `${Math.max(stat.ratio, 6)}%` }}>{stat.ratio}%</b>
              </div>
              <span className="chart-row-count">{formatNumber(stat.count)}건</span>
            </button>
          ))}
        </div>
        <div className="chart-detail-card">
          <div className="summary-name">선택 등급</div>
          <div className="summary-value">{activeGrade?.short || "-"}</div>
          <div className="summary-desc">
            대상 {formatNumber(activeGrade?.count || 0)}건 · 권고 조치: {activeGrade?.recommendation || "-"}
          </div>
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
  const [rows] = useState(() => ([
    {
      __id: "loc-001",
      창고: "메인센터",
      "존(Zone)": "보관 존",
      로케이션: "A-01-01",
      "로케이션 타입": "랙",
      화주사: "onedns_test",
      브랜드: "MADE J",
      카테고리: "상의",
      상품코드: "JT009301",
      바코드: "81231341295121",
      스타일코드: "JB003-KN01",
      색상: "블랙",
      사이즈: "M",
      상품명: "[MADE] 데모 니트",
      가용재고: "180",
      예약재고: "12",
      불용재고: "2",
      총재고: "194",
      "최초 입고일": "2025-11-20",
      "마지막 입고일": "2026-02-21",
      "마지막 출고일": "2026-03-02",
      보관일수: "104",
      상태: "가용",
    },
    {
      __id: "loc-002",
      창고: "메인센터",
      "존(Zone)": "보관 존",
      로케이션: "A-01-02",
      "로케이션 타입": "랙",
      화주사: "onedns_test",
      브랜드: "MADE J",
      카테고리: "하의",
      상품코드: "JT009302",
      바코드: "81231341295122",
      스타일코드: "JB003-KN02",
      색상: "오프화이트",
      사이즈: "L",
      상품명: "[MADE] 데모 팬츠",
      가용재고: "140",
      예약재고: "9",
      불용재고: "1",
      총재고: "150",
      "최초 입고일": "2025-11-22",
      "마지막 입고일": "2026-02-25",
      "마지막 출고일": "2026-03-02",
      보관일수: "100",
      상태: "가용",
    },
    {
      __id: "loc-003",
      창고: "메인센터",
      "존(Zone)": "입고 존",
      로케이션: "rcv_conf",
      "로케이션 타입": "검수",
      화주사: "테스트",
      브랜드: "NATURIA",
      카테고리: "아우터",
      상품코드: "JT009303",
      바코드: "81231341295123",
      스타일코드: "JB003-KN03",
      색상: "레드",
      사이즈: "S",
      상품명: "[NATURIA] 데모 자켓",
      가용재고: "0",
      예약재고: "0",
      불용재고: "0",
      총재고: "44",
      "최초 입고일": "2026-02-28",
      "마지막 입고일": "2026-03-03",
      "마지막 출고일": "-",
      보관일수: "4",
      상태: "검수 대기",
    },
    {
      __id: "loc-004",
      창고: "서브센터",
      "존(Zone)": "뮬랑",
      로케이션: "C-01-01",
      "로케이션 타입": "랙",
      화주사: "원차일드",
      브랜드: "VINTAGE LAB",
      카테고리: "상의",
      상품코드: "JT009304",
      바코드: "81231341295124",
      스타일코드: "JB003-KN04",
      색상: "그린",
      사이즈: "XL",
      상품명: "[VINTAGE] 데모 셔츠",
      가용재고: "102",
      예약재고: "6",
      불용재고: "0",
      총재고: "108",
      "최초 입고일": "2025-12-03",
      "마지막 입고일": "2026-02-19",
      "마지막 출고일": "2026-03-01",
      보관일수: "91",
      상태: "가용",
    },
  ]));
  const [useZoneFilter, setUseZoneFilter] = useState(false);
  const [zoneFilter, setZoneFilter] = useState("보관 존");
  const [useStatusFilter, setUseStatusFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState("가용");
  const [rowsPerPage, setRowsPerPage] = useState("50");
  const [pageNo, setPageNo] = useState(1);
  const [selectedId, setSelectedId] = useState("");

  const filteredRows = useMemo(() => rows
    .filter((row) => (!useZoneFilter || row["존(Zone)"] === zoneFilter) && (!useStatusFilter || row.상태 === statusFilter))
    .sort((a, b) => String(a.로케이션).localeCompare(String(b.로케이션))), [rows, useZoneFilter, zoneFilter, useStatusFilter, statusFilter]);

  const pageSize = Number(rowsPerPage);
  const totalPage = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePageNo = Math.min(pageNo, totalPage);
  const visibleRows = filteredRows.slice((safePageNo - 1) * pageSize, safePageNo * pageSize);
  const selectedRow = visibleRows.find((row) => row.__id === selectedId) || filteredRows.find((row) => row.__id === selectedId);

  const summary = useMemo(() => {
    const total = filteredRows.reduce((sum, row) => sum + Number(String(row.총재고 || "0").replace(/,/g, "")), 0);
    const reserved = filteredRows.reduce((sum, row) => sum + Number(String(row.예약재고 || "0").replace(/,/g, "")), 0);
    return { total, reserved };
  }, [filteredRows]);

  useEffect(() => {
    if (pageNo !== safePageNo) setPageNo(safePageNo);
  }, [pageNo, safePageNo]);

  return (
    <PageLayout tabTitle={page.title} showDocLinks currentDocKey={page.pageKey}>
      <DocHeaderBlock page={page} />
      <DocFilterBlock
        page={page}
        helperText="로케이션명 오름차순 기본 정렬 / Zone·상태 추가 필터 지원"
        onSearch={() => showToast(`조회 결과 ${filteredRows.length}건`)}
        onReset={() => {
          setUseZoneFilter(false);
          setZoneFilter("보관 존");
          setUseStatusFilter(false);
          setStatusFilter("가용");
          setRowsPerPage("50");
          setPageNo(1);
          showToast("초기화");
        }}
      >
        <div className="mode-toggle">
          <button type="button" className={`chip ${useZoneFilter ? "active-mode" : ""}`} onClick={() => setUseZoneFilter((prev) => !prev)}>
            + 필터추가: Zone
          </button>
          <button type="button" className={`chip ${useStatusFilter ? "active-mode" : ""}`} onClick={() => setUseStatusFilter((prev) => !prev)}>
            + 필터추가: 상태
          </button>
        </div>
        {(useZoneFilter || useStatusFilter) ? (
          <div className="filter-grid">
            {useZoneFilter ? (
              <label>
                Zone
                <select value={zoneFilter} onChange={(event) => setZoneFilter(event.target.value)}>
                  {["입고 존", "보관 존", "뮬랑"].map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
            ) : null}
            {useStatusFilter ? (
              <label>
                상태
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                  {["가용", "검수 대기"].map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
            ) : null}
          </div>
        ) : null}
      </DocFilterBlock>

      <DocSummaryCards
        items={[
          { name: "총 사용 로케이션 수", value: formatNumber(filteredRows.length), description: "재고 보관중 로케이션" },
          { name: "총 재고", value: formatNumber(summary.total), description: "예약 포함 수량" },
          { name: "총 예약재고", value: formatNumber(summary.reserved), description: `가용 계산값 ${formatNumber(summary.total - summary.reserved)}` },
        ]}
      />

      <section className="special-panel">
        <h3>로케이션 상세</h3>
        <p>행 선택 시 해당 로케이션의 상세 정보를 확인합니다. 총 재고는 예약 재고를 포함한 수량입니다.</p>
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
        <div className="count-info">위치별 재고 <strong>{formatNumber(filteredRows.length)}건</strong> (페이지 {safePageNo}/{totalPage})</div>
        <div className="toolbar-actions">
          {page.actions.map((action) => (
            <button key={action} type="button" className="chip" onClick={() => showToast(`${action} 실행`)}>
              {action}
            </button>
          ))}
          <button type="button" className="chip" onClick={() => showToast("TIP: 목록은 로케이션명 기준 오름차순으로 표시됩니다.")}>
            활용 TIP
          </button>
          <select value={rowsPerPage} onChange={(event) => setRowsPerPage(event.target.value)}>
            <option value="50">50개씩 보기</option>
            <option value="100">100개씩 보기</option>
            <option value="150">150개씩 보기</option>
            <option value="200">200개씩 보기</option>
          </select>
        </div>
      </section>
      <DocTableBlock columns={columns} rows={visibleRows} selectedId={selectedId} onRowClick={(row) => setSelectedId(row.__id)} />
      <div className="pager-inline">
        <button type="button" className="chip" onClick={() => setPageNo((prev) => Math.max(1, prev - 1))}>이전</button>
        <span>{safePageNo} / {totalPage}</span>
        <button type="button" className="chip" onClick={() => setPageNo((prev) => Math.min(totalPage, prev + 1))}>다음</button>
      </div>

      <DocMetaBlock page={page} toast={toast} />
    </PageLayout>
  );
}

function InOutListDoc({ page }) {
  const { toast, showToast } = useToast();
  const columns = page.columnTables?.[0]?.columns?.length ? page.columnTables[0].columns : [];
  const transactionTypes = ["전체", "입고", "출고", "이동", "반출", "B2B 반품", "B2C 반품", "조정"];
  const [rows] = useState(() =>
    buildRows(columns, 12).map((row, index) => ({
      ...row,
      __id: `inout-${index + 1}`,
      입출고번호: `IO-202603-${String(index + 1).padStart(4, "0")}`,
      "입출고 유형": ["입고", "출고", "이동", "반출", "B2B 반품", "조정"][index % 6],
      화주사: ["화주사 A", "화주사 B"][index % 2],
      창고: ["메인센터", "서브센터"][index % 2],
      상품코드: `JT00${9300 + index}`,
      바코드: `81231341295${String(40 + index).padStart(2, "0")}`,
      수량: formatNumber(10 + index * 2),
      "변경 전 위치": `${String.fromCharCode(65 + (index % 6))}-01-0${(index % 5) + 1}`,
      "변경 후 위치": `${String.fromCharCode(66 + (index % 6))}-02-0${(index % 5) + 1}`,
      처리일시: `2026-03-${String((index % 28) + 1).padStart(2, "0")} 11:${String((index * 6) % 60).padStart(2, "0")}`,
      처리자: ["김작업", "이관리", "박검수"][index % 3],
      상태: ["완료", "처리중", "대기"][index % 3],
    })),
  );
  const [typeFilter, setTypeFilter] = useState("전체");
  const [datePreset, setDatePreset] = useState("오늘");
  const [useOrderFilter, setUseOrderFilter] = useState(false);
  const [orderKeyword, setOrderKeyword] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState("50");
  const [pageNo, setPageNo] = useState(1);

  const visibleRows = useMemo(() => {
    const keywords = splitKeywords(orderKeyword);
    return rows.filter((row) => (
      (typeFilter === "전체" || row["입출고 유형"] === typeFilter)
      && (!useOrderFilter || matchesKeyword(`${row.입출고번호} ${row.메모 || ""}`, keywords))
    ));
  }, [rows, typeFilter, useOrderFilter, orderKeyword]);

  const summary = useMemo(() => {
    const inbound = visibleRows
      .filter((row) => row["입출고 유형"] === "입고")
      .reduce((sum, row) => sum + Number(String(row.수량 || "0").replace(/,/g, "")), 0);
    const outbound = visibleRows
      .filter((row) => row["입출고 유형"] === "출고")
      .reduce((sum, row) => sum + Number(String(row.수량 || "0").replace(/,/g, "")), 0);
    const movement = visibleRows
      .filter((row) => row["입출고 유형"] === "이동")
      .reduce((sum, row) => sum + Number(String(row.수량 || "0").replace(/,/g, "")), 0);
    return { inbound, outbound, movement };
  }, [visibleRows]);

  const pageSize = Number(rowsPerPage);
  const totalPage = Math.max(1, Math.ceil(visibleRows.length / pageSize));
  const safePageNo = Math.min(pageNo, totalPage);
  const pagedRows = visibleRows.slice((safePageNo - 1) * pageSize, safePageNo * pageSize);

  useEffect(() => {
    if (pageNo !== safePageNo) setPageNo(safePageNo);
  }, [pageNo, safePageNo]);

  return (
    <PageLayout tabTitle={page.title} showDocLinks currentDocKey={page.pageKey}>
      <DocHeaderBlock page={page} />
      <DocFilterBlock
        page={page}
        helperText="입출고 일자 기반 통합 조회 + 이동 관련 필터/흐름 보강"
        onSearch={() => showToast(`조회 결과 ${visibleRows.length}건`)}
        onReset={() => {
          setTypeFilter("전체");
          setDatePreset("오늘");
          setUseOrderFilter(false);
          setOrderKeyword("");
          setRowsPerPage("50");
          setPageNo(1);
          showToast("초기화");
        }}
      >
        <div className="filter-grid">
          <label>
            입출고 일자 프리셋
            <select value={datePreset} onChange={(event) => setDatePreset(event.target.value)}>
              {["오늘", "지난 7일", "지난 30일", "사용자 지정(최대 90일)"].map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>시작일<input type="date" defaultValue="2026-03-01" /></label>
          <label>종료일<input type="date" defaultValue="2026-03-03" /></label>
          <label>
            구분
            <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
              {transactionTypes.map((type) => <option key={type}>{type}</option>)}
            </select>
          </label>
        </div>
        <div className="mode-toggle">
          {transactionTypes.slice(0, 4).map((type) => (
            <button
              key={type}
              type="button"
              className={`chip ${typeFilter === type ? "active-mode" : ""}`}
              onClick={() => setTypeFilter(type)}
            >
              {type}
            </button>
          ))}
          <button
            type="button"
            className={`chip ${useOrderFilter ? "active-mode" : ""}`}
            onClick={() => setUseOrderFilter((prev) => !prev)}
          >
            + 필터추가: 오더번호
          </button>
          <Link className="chip" to="/docs/sm-stk-204">이동 오더/지시/실행 상세</Link>
        </div>
        {useOrderFilter ? (
          <div className="filter-grid">
            <label>
              오더번호 키워드
              <input
                type="text"
                value={orderKeyword}
                onChange={(event) => setOrderKeyword(event.target.value)}
                placeholder="이동 오더번호/입고 오더번호 등"
              />
            </label>
          </div>
        ) : null}
      </DocFilterBlock>

      <DocSummaryCards
        items={[
          { name: "총 입출고 건수", value: formatNumber(visibleRows.length), description: "조회 기간 내 처리 건수" },
          { name: "총 입고 수량", value: formatNumber(summary.inbound), description: "입고 수량 합계" },
          { name: "총 출고 수량", value: formatNumber(summary.outbound), description: `이동 수량 ${formatNumber(summary.movement)}` },
        ]}
      />

      <section className="table-toolbar doc-toolbar">
        <div className="count-info">입출고 목록 <strong>{formatNumber(visibleRows.length)}건</strong> (페이지 {safePageNo}/{totalPage})</div>
        <div className="toolbar-actions">
          {page.actions.map((action) => (
            <button key={action} type="button" className="chip" onClick={() => showToast(`${action} 실행`)}>
              {action}
            </button>
          ))}
          <button type="button" className="chip" onClick={() => showToast("TIP: 구분을 '이동'으로 설정하면 이동 이력만 조회됩니다.")}>
            활용 TIP
          </button>
          <select value={rowsPerPage} onChange={(event) => setRowsPerPage(event.target.value)}>
            <option value="50">50개씩 보기</option>
            <option value="100">100개씩 보기</option>
            <option value="150">150개씩 보기</option>
            <option value="200">200개씩 보기</option>
          </select>
        </div>
      </section>
      <DocTableBlock columns={columns} rows={pagedRows} />
      <div className="pager-inline">
        <button type="button" className="chip" onClick={() => setPageNo((prev) => Math.max(1, prev - 1))}>이전</button>
        <span>{safePageNo} / {totalPage}</span>
        <button type="button" className="chip" onClick={() => setPageNo((prev) => Math.min(totalPage, prev + 1))}>다음</button>
      </div>

      <DocMetaBlock page={page} toast={toast} />
    </PageLayout>
  );
}

function ItemStockListSellmateDoc({ page }) {
  const { toast, showToast } = useToast();
  const ownerOptions = ["원차일드", "onedns_test", "테스트", "안나랜모드"];
  const [selectedOwners, setSelectedOwners] = useState(() => new Set(["원차일드", "onedns_test"]));
  const [itemCodeQuery, setItemCodeQuery] = useState("");
  const [itemNameQuery, setItemNameQuery] = useState("");
  const [attrQuery, setAttrQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [zoneLayout, setZoneLayout] = useState("vertical");
  const [rowsPerPage, setRowsPerPage] = useState("50");
  const [pageNo, setPageNo] = useState(1);

  const [rows] = useState([
    { __id: "itm-001", 화주사: "원차일드", 품목등록일: "2026-02-20", 품목코드: "10000011", 품목명: "데모 베이직 반팔 니트", 품목속성: "Free", 총재고: 612, 가용: 560, 예약: 34, 불량: 8, 검수대기: 7, 특수: 3, zoneList: [["입고 존", 21], ["보관 존", 560], ["뮬랑", 31]] },
    { __id: "itm-002", 화주사: "onedns_test", 품목등록일: "2026-02-22", 품목코드: "10000012", 품목명: "데모 소프트 후드 집업", 품목속성: "단일상품", 총재고: 380, 가용: 341, 예약: 25, 불량: 5, 검수대기: 6, 특수: 3, zoneList: [["입고 존", 18], ["보관 존", 317], ["뮬랑", 45]] },
    { __id: "itm-003", 화주사: "테스트", 품목등록일: "2026-02-24", 품목코드: "10000013", 품목명: "데모 기모 조거 팬츠", 품목속성: "Free", 총재고: 501, 가용: 472, 예약: 16, 불량: 4, 검수대기: 5, 특수: 4, zoneList: [["입고 존", 15], ["보관 존", 452], ["뮬랑", 34]] },
    { __id: "itm-004", 화주사: "안나랜모드", 품목등록일: "2026-02-25", 품목코드: "10000014", 품목명: "데모 울 라운드 니트", 품목속성: "단일상품", 총재고: 265, 가용: 242, 예약: 14, 불량: 3, 검수대기: 4, 특수: 2, zoneList: [["입고 존", 10], ["보관 존", 221], ["뮬랑", 34]] },
    { __id: "itm-005", 화주사: "원차일드", 품목등록일: "2026-02-26", 품목코드: "10000015", 품목명: "데모 슬림 롱슬리브", 품목속성: "Free", 총재고: 913, 가용: 852, 예약: 41, 불량: 8, 검수대기: 7, 특수: 5, zoneList: [["입고 존", 26], ["보관 존", 827], ["뮬랑", 60]] },
    { __id: "itm-006", 화주사: "onedns_test", 품목등록일: "2026-02-27", 품목코드: "10000016", 품목명: "데모 와이드 데님", 품목속성: "Free", 총재고: 458, 가용: 425, 예약: 21, 불량: 4, 검수대기: 5, 특수: 3, zoneList: [["입고 존", 17], ["보관 존", 399], ["뮬랑", 42]] },
  ]);

  const toggleOwner = (owner) => {
    setSelectedOwners((prev) => {
      const next = new Set(prev);
      if (next.has(owner)) next.delete(owner);
      else next.add(owner);
      return next;
    });
    setPageNo(1);
  };

  const resetFilters = () => {
    setSelectedOwners(new Set());
    setItemCodeQuery("");
    setItemNameQuery("");
    setAttrQuery("");
    setSortOrder("asc");
    setZoneLayout("vertical");
    setRowsPerPage("50");
    setPageNo(1);
    showToast("검색 조건을 초기화했습니다.");
  };

  const filteredRows = useMemo(() => {
    const ownerKeywords = selectedOwners.size ? selectedOwners : new Set(ownerOptions);
    const codeKeywords = splitKeywords(itemCodeQuery);
    const nameKeywords = splitKeywords(itemNameQuery);
    const attrKeywords = splitKeywords(attrQuery);
    const list = rows.filter((row) => (
      ownerKeywords.has(row.화주사)
      && matchesKeyword(row.품목코드, codeKeywords)
      && matchesKeyword(row.품목명, nameKeywords)
      && matchesKeyword(row.품목속성, attrKeywords)
    ));
    return [...list].sort((a, b) => {
      const dateA = new Date(a.품목등록일).getTime();
      const dateB = new Date(b.품목등록일).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [rows, selectedOwners, ownerOptions, itemCodeQuery, itemNameQuery, attrQuery, sortOrder]);

  const summary = useMemo(() => {
    const totalStock = filteredRows.reduce((sum, row) => sum + row.총재고, 0);
    const available = filteredRows.reduce((sum, row) => sum + row.가용, 0);
    const pendingInspect = filteredRows.reduce((sum, row) => sum + row.검수대기, 0);
    return { totalStock, available, pendingInspect };
  }, [filteredRows]);

  const pageSize = Number(rowsPerPage);
  const totalPage = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePageNo = Math.min(pageNo, totalPage);
  const visibleRows = filteredRows.slice((safePageNo - 1) * pageSize, safePageNo * pageSize);

  useEffect(() => {
    if (pageNo !== safePageNo) setPageNo(safePageNo);
  }, [pageNo, safePageNo]);

  return (
    <PageLayout tabTitle={page.title} showDocLinks currentDocKey={page.pageKey}>
      <DocHeaderBlock page={page} />

      <section className="search-card">
        <div className="search-top-row doc-compact">
          <div>
            <strong>검색 조건</strong>
            <p>화주사/품목코드/품목명/품목속성으로 조회하고 품목 등록일 정렬을 전환합니다.</p>
          </div>
          <div className="toolbar-actions">
            <button type="button" className="primary" onClick={() => showToast(`조회 결과 ${filteredRows.length}건`)}>
              검색
            </button>
            <button type="button" className="secondary" onClick={resetFilters}>검색 초기화</button>
          </div>
        </div>
        <div className="filter-panel doc-open">
          <div className="owner-checks">
            {ownerOptions.map((owner) => (
              <label key={owner}>
                <input type="checkbox" checked={selectedOwners.has(owner)} onChange={() => toggleOwner(owner)} />
                {owner}
              </label>
            ))}
          </div>
          <div className="filter-grid">
            <label>
              품목 코드
              <input
                type="text"
                placeholder="콤마(,) 또는 Enter로 다중 키워드"
                value={itemCodeQuery}
                onChange={(event) => setItemCodeQuery(event.target.value)}
              />
            </label>
            <label>
              품목명
              <input
                type="text"
                placeholder="포함 검색"
                value={itemNameQuery}
                onChange={(event) => setItemNameQuery(event.target.value)}
              />
            </label>
            <label>
              품목 속성
              <input
                type="text"
                placeholder="예: Free, 단일상품"
                value={attrQuery}
                onChange={(event) => setAttrQuery(event.target.value)}
              />
            </label>
            <label>
              품목 등록일 정렬
              <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
                <option value="asc">오름차순 ↑</option>
                <option value="desc">내림차순 ↓</option>
              </select>
            </label>
          </div>
        </div>
      </section>

      <DocSummaryCards
        items={[
          { name: "총 조회 건수", value: formatNumber(filteredRows.length), description: "품목(재고) 건수" },
          { name: "총 재고 수량", value: formatNumber(summary.totalStock), description: "상태 합산 수량" },
          { name: "총 가용 수량", value: formatNumber(summary.available), description: `검수 대기 ${formatNumber(summary.pendingInspect)} 포함` },
        ]}
      />

      <section className="table-toolbar doc-toolbar">
        <div className="count-info">총 {formatNumber(filteredRows.length)}건 (페이지 {safePageNo}/{totalPage})</div>
        <div className="toolbar-actions">
          <button type="button" className="chip" onClick={() => showToast("엑셀 다운로드 실행")}>엑셀 다운로드</button>
          <button
            type="button"
            className="chip"
            onClick={() => showToast("TIP: Zone 정렬 아이콘으로 가로/세로 표시를 전환합니다.")}
          >
            활용 TIP
          </button>
          <button
            type="button"
            className={`chip ${zoneLayout === "vertical" ? "active-mode" : ""}`}
            onClick={() => setZoneLayout("vertical")}
          >
            Zone 세로
          </button>
          <button
            type="button"
            className={`chip ${zoneLayout === "horizontal" ? "active-mode" : ""}`}
            onClick={() => setZoneLayout("horizontal")}
          >
            Zone 가로
          </button>
          <select value={rowsPerPage} onChange={(event) => setRowsPerPage(event.target.value)}>
            <option value="50">50개씩 보기</option>
            <option value="100">100개씩 보기</option>
            <option value="150">150개씩 보기</option>
            <option value="200">200개씩 보기</option>
          </select>
        </div>
      </section>

      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>화주사</th>
              <th>품목 등록일</th>
              <th>품목 코드</th>
              <th>품목명</th>
              <th>품목 속성</th>
              <th>총 재고</th>
              <th>가용</th>
              <th>예약</th>
              <th>불량</th>
              <th>검수 대기</th>
              <th>특수</th>
              <th>Zone별 재고 목록</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr key={row.__id}>
                <td>{row.화주사}</td>
                <td>{row.품목등록일}</td>
                <td>{row.품목코드}</td>
                <td>
                  <button type="button" className="link-btn" onClick={() => showToast(`${row.품목명} 상세로 이동`)}>
                    {row.품목명}
                  </button>
                </td>
                <td>{row.품목속성}</td>
                <td>{formatNumber(row.총재고)}</td>
                <td>{formatNumber(row.가용)}</td>
                <td>{formatNumber(row.예약)}</td>
                <td>{formatNumber(row.불량)}</td>
                <td>{formatNumber(row.검수대기)}</td>
                <td>{formatNumber(row.특수)}</td>
                <td>
                  <div className={`zone-badges ${zoneLayout}`}>
                    {row.zoneList.map(([zoneName, qty]) => (
                      <span
                        key={`${row.__id}-${zoneName}`}
                        className={`zone-pill ${zoneName.includes("입고") ? "inbound" : zoneName.includes("보관") ? "storage" : "mulang"}`}
                      >
                        {zoneName} {formatNumber(qty)}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
            {!visibleRows.length ? (
              <tr>
                <td colSpan={12}>
                  <div className="empty-state">조회 결과가 없습니다.</div>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="pager-inline">
        <button type="button" className="chip" onClick={() => setPageNo((prev) => Math.max(1, prev - 1))}>이전</button>
        <span>{safePageNo} / {totalPage}</span>
        <button type="button" className="chip" onClick={() => setPageNo((prev) => Math.min(totalPage, prev + 1))}>다음</button>
      </div>

      <DocMetaBlock page={page} toast={toast} />
    </PageLayout>
  );
}

function ItemBarcodePrintSellmateDoc({ page }) {
  const { toast, showToast } = useToast();
  const ownerOptions = ["원차일드", "onedns_test", "테스트", "안나랜모드"];
  const supplierOptions = ["자사"];
  const [selectedOwners, setSelectedOwners] = useState(() => new Set());
  const [itemCodeQuery, setItemCodeQuery] = useState("");
  const [itemNameQuery, setItemNameQuery] = useState("");
  const [itemAttrQuery, setItemAttrQuery] = useState("");
  const [supplierQuery, setSupplierQuery] = useState("");
  const [selectedSuppliers, setSelectedSuppliers] = useState(() => new Set());
  const [showSupplierProductFilter, setShowSupplierProductFilter] = useState(false);
  const [supplierProductQuery, setSupplierProductQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState(() => new Set());

  const [rows] = useState([
    { __id: "bar-001", 화주사: "원차일드", 품목코드: "10000011", 품목명: "데모 베이직 반팔 니트", 품목속성: "Free", 공급처: "자사", 공급처상품명: "BASIC KNIT" },
    { __id: "bar-002", 화주사: "onedns_test", 품목코드: "10000012", 품목명: "데모 소프트 후드 집업", 품목속성: "단일상품", 공급처: "자사", 공급처상품명: "SOFT HOOD ZIPUP" },
    { __id: "bar-003", 화주사: "onedns_test", 품목코드: "10000016", 품목명: "데모 와이드 데님", 품목속성: "Free", 공급처: "자사", 공급처상품명: "WIDE DENIM" },
    { __id: "bar-004", 화주사: "테스트", 품목코드: "10000013", 품목명: "데모 기모 조거 팬츠", 품목속성: "Free", 공급처: "자사", 공급처상품명: "JOGGER PANTS" },
  ]);

  const filteredSupplierOptions = useMemo(() => {
    const q = supplierQuery.trim().toLowerCase();
    if (!q) return supplierOptions;
    return supplierOptions.filter((item) => item.toLowerCase().includes(q));
  }, [supplierQuery, supplierOptions]);

  const filteredRows = useMemo(() => {
    if (!selectedOwners.size) return [];
    const codeKeywords = splitKeywords(itemCodeQuery);
    const nameKeywords = splitKeywords(itemNameQuery);
    const attrKeywords = splitKeywords(itemAttrQuery);
    const supplierKeywords = splitKeywords(supplierProductQuery);
    return rows.filter((row) => (
      selectedOwners.has(row.화주사)
      && matchesKeyword(row.품목코드, codeKeywords)
      && matchesKeyword(row.품목명, nameKeywords)
      && matchesKeyword(row.품목속성, attrKeywords)
      && (!selectedSuppliers.size || selectedSuppliers.has(row.공급처))
      && (!showSupplierProductFilter || matchesKeyword(row.공급처상품명, supplierKeywords))
    ));
  }, [rows, selectedOwners, itemCodeQuery, itemNameQuery, itemAttrQuery, selectedSuppliers, showSupplierProductFilter, supplierProductQuery]);

  const selectedCount = useMemo(
    () => filteredRows.filter((row) => selectedRows.has(row.__id)).length,
    [filteredRows, selectedRows],
  );

  const allChecked = filteredRows.length > 0 && selectedCount === filteredRows.length;

  const toggleOwner = (owner) => {
    setSelectedOwners((prev) => {
      const next = new Set(prev);
      if (next.has(owner)) next.delete(owner);
      else next.add(owner);
      return next;
    });
  };

  const toggleSupplier = (supplier) => {
    setSelectedSuppliers((prev) => {
      const next = new Set(prev);
      if (next.has(supplier)) next.delete(supplier);
      else next.add(supplier);
      return next;
    });
  };

  const toggleRow = (rowId) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) next.delete(rowId);
      else next.add(rowId);
      return next;
    });
  };

  const toggleAll = () => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (allChecked) filteredRows.forEach((row) => next.delete(row.__id));
      else filteredRows.forEach((row) => next.add(row.__id));
      return next;
    });
  };

  const resetFilters = () => {
    setSelectedOwners(new Set());
    setItemCodeQuery("");
    setItemNameQuery("");
    setItemAttrQuery("");
    setSupplierQuery("");
    setSelectedSuppliers(new Set());
    setShowSupplierProductFilter(false);
    setSupplierProductQuery("");
    setSelectedRows(new Set());
    showToast("검색 조건을 초기화했습니다.");
  };

  return (
    <PageLayout tabTitle={page.title} showDocLinks currentDocKey={page.pageKey}>
      <DocHeaderBlock page={page} />

      <section className="search-card">
        <div className="search-top-row doc-compact">
          <div>
            <strong>검색 조건</strong>
            <p>화주사 선택이 필수이며, 선택된 품목만 출력 버튼이 활성화됩니다.</p>
          </div>
          <div className="toolbar-actions">
            <button
              type="button"
              className="primary"
              onClick={() => showToast(selectedOwners.size ? `조회 결과 ${filteredRows.length}건` : "화주사를 먼저 선택하세요.")}
            >
              검색
            </button>
            <button type="button" className="secondary" onClick={resetFilters}>검색 초기화</button>
          </div>
        </div>
        <div className="filter-panel doc-open">
          <div className="owner-checks">
            {ownerOptions.map((owner) => (
              <label key={owner}>
                <input type="checkbox" checked={selectedOwners.has(owner)} onChange={() => toggleOwner(owner)} />
                {owner}
              </label>
            ))}
          </div>
          <div className="filter-grid">
            <label>
              품목 코드
              <input value={itemCodeQuery} onChange={(event) => setItemCodeQuery(event.target.value)} placeholder="포함 검색" />
            </label>
            <label>
              품목명
              <input value={itemNameQuery} onChange={(event) => setItemNameQuery(event.target.value)} placeholder="포함 검색" />
            </label>
            <label>
              품목 속성
              <input value={itemAttrQuery} onChange={(event) => setItemAttrQuery(event.target.value)} placeholder="예: Free" />
            </label>
            <label>
              공급처 검색
              <input value={supplierQuery} onChange={(event) => setSupplierQuery(event.target.value)} placeholder="공급처명 검색" />
            </label>
          </div>
          <div className="owner-checks compact">
            {filteredSupplierOptions.map((supplier) => (
              <label key={supplier}>
                <input type="checkbox" checked={selectedSuppliers.has(supplier)} onChange={() => toggleSupplier(supplier)} />
                {supplier}
              </label>
            ))}
            <button
              type="button"
              className={`chip ${showSupplierProductFilter ? "active-mode" : ""}`}
              onClick={() => setShowSupplierProductFilter((prev) => !prev)}
            >
              + 필터추가: 공급처 상품명
            </button>
          </div>
          {showSupplierProductFilter ? (
            <div className="filter-grid">
              <label>
                공급처 상품명
                <input
                  value={supplierProductQuery}
                  onChange={(event) => setSupplierProductQuery(event.target.value)}
                  placeholder="공급처 상품명 포함 검색"
                />
              </label>
            </div>
          ) : null}
          <div className="active-tags">
            {[...selectedOwners].map((owner) => (
              <button
                key={`owner-${owner}`}
                type="button"
                className="active-tag"
                onClick={() => toggleOwner(owner)}
              >
                화주사 : {owner} ×
              </button>
            ))}
            {itemCodeQuery ? (
              <button type="button" className="active-tag" onClick={() => setItemCodeQuery("")}>품목 코드 : {itemCodeQuery} ×</button>
            ) : null}
            {itemNameQuery ? (
              <button type="button" className="active-tag" onClick={() => setItemNameQuery("")}>품목명 : {itemNameQuery} ×</button>
            ) : null}
            {itemAttrQuery ? (
              <button type="button" className="active-tag" onClick={() => setItemAttrQuery("")}>품목 속성 : {itemAttrQuery} ×</button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="table-toolbar doc-toolbar">
        <div className="count-info">총 {formatNumber(filteredRows.length)}건 / {formatNumber(selectedCount)}건 선택</div>
        <div className="toolbar-actions">
          <button
            type="button"
            className="primary"
            disabled={selectedCount === 0}
            onClick={() => showToast(`${selectedCount}건 바코드 출력 실행`)}
          >
            출력
          </button>
          <button type="button" className="chip" onClick={() => showToast("출력 템플릿 관리 화면으로 이동")}>
            출력 템플릿 관리
          </button>
        </div>
      </section>

      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>
                <input type="checkbox" checked={allChecked} onChange={toggleAll} disabled={!filteredRows.length} />
              </th>
              <th>화주사</th>
              <th>품목 코드</th>
              <th>품목명 / 품목 속성</th>
            </tr>
          </thead>
          <tbody>
            {!selectedOwners.size ? (
              <tr>
                <td colSpan={4}>
                  <div className="empty-state">데이터를 불러오기 위해, 검색 조건(화주사) 설정이 필요합니다.</div>
                </td>
              </tr>
            ) : null}
            {selectedOwners.size && !filteredRows.length ? (
              <tr>
                <td colSpan={4}>
                  <div className="empty-state">검색 결과가 없습니다.</div>
                </td>
              </tr>
            ) : null}
            {filteredRows.map((row) => (
              <tr key={row.__id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.has(row.__id)}
                    onChange={() => toggleRow(row.__id)}
                  />
                </td>
                <td>{row.화주사}</td>
                <td>{row.품목코드}</td>
                <td>
                  <button type="button" className="link-btn" onClick={() => showToast(`${row.품목명} 상세 보기`)}>
                    {row.품목명}
                  </button>
                  <div className="cell-title">{row.품목속성}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pager-inline">
        <span>페이지당 건수</span>
        <select defaultValue="50">
          <option>50개씩 보기</option>
          <option>100개씩 보기</option>
          <option>150개씩 보기</option>
          <option>200개씩 보기</option>
        </select>
      </div>

      <DocMetaBlock page={page} toast={toast} />
    </PageLayout>
  );
}

function LocationStockListSellmateDoc({ page }) {
  const { toast, showToast } = useToast();
  const ownerOptions = ["원차일드", "onedns_test", "테스트", "안나랜모드"];
  const zoneOptions = ["입고 존", "보관 존", "뮬랑"];
  const statusOptions = ["가용", "검수 대기"];
  const [selectedOwners, setSelectedOwners] = useState(() => new Set(["onedns_test"]));
  const [locationQuery, setLocationQuery] = useState("");
  const [itemCodeQuery, setItemCodeQuery] = useState("");
  const [itemNameQuery, setItemNameQuery] = useState("");
  const [itemAttrQuery, setItemAttrQuery] = useState("");
  const [useZoneFilter, setUseZoneFilter] = useState(false);
  const [zoneFilter, setZoneFilter] = useState("보관 존");
  const [useStatusFilter, setUseStatusFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState("가용");
  const [rowsPerPage, setRowsPerPage] = useState("50");
  const [pageNo, setPageNo] = useState(1);

  const [rows] = useState([
    { __id: "loc-001", 화주사: "onedns_test", Zone: "보관 존", 로케이션명: "a-0001", 상태: "가용", 품목코드: "10000011", 품목명: "데모 베이직 반팔 니트", 품목속성: "Free", 공급처: "자사", 유통기한: "2026-12-31", 로트번호: "LOT-001", 총재고: 200, 예약: 12 },
    { __id: "loc-002", 화주사: "onedns_test", Zone: "보관 존", 로케이션명: "a-0002", 상태: "가용", 품목코드: "10000012", 품목명: "데모 소프트 후드 집업", 품목속성: "단일상품", 공급처: "자사", 유통기한: "-", 로트번호: "-", 총재고: 160, 예약: 9 },
    { __id: "loc-003", 화주사: "onedns_test", Zone: "입고 존", 로케이션명: "rcv_conf", 상태: "검수 대기", 품목코드: "10000016", 품목명: "데모 와이드 데님", 품목속성: "Free", 공급처: "자사", 유통기한: "-", 로트번호: "LOT-004", 총재고: 42, 예약: 0 },
    { __id: "loc-004", 화주사: "원차일드", Zone: "뮬랑", 로케이션명: "C-01-01", 상태: "가용", 품목코드: "10000015", 품목명: "데모 슬림 롱슬리브", 품목속성: "Free", 공급처: "자사", 유통기한: "2026-11-30", 로트번호: "LOT-102", 총재고: 130, 예약: 6 },
    { __id: "loc-005", 화주사: "테스트", Zone: "입고 존", 로케이션명: "B2B_RTN_CONF", 상태: "검수 대기", 품목코드: "10000013", 품목명: "데모 기모 조거 팬츠", 품목속성: "Free", 공급처: "자사", 유통기한: "-", 로트번호: "-", 총재고: 34, 예약: 0 },
  ]);

  const toggleOwner = (owner) => {
    setSelectedOwners((prev) => {
      const next = new Set(prev);
      if (next.has(owner)) next.delete(owner);
      else next.add(owner);
      return next;
    });
    setPageNo(1);
  };

  const resetFilters = () => {
    setSelectedOwners(new Set(["onedns_test"]));
    setLocationQuery("");
    setItemCodeQuery("");
    setItemNameQuery("");
    setItemAttrQuery("");
    setUseZoneFilter(false);
    setZoneFilter("보관 존");
    setUseStatusFilter(false);
    setStatusFilter("가용");
    setRowsPerPage("50");
    setPageNo(1);
    showToast("검색 조건을 초기화했습니다.");
  };

  const filteredRows = useMemo(() => {
    const codeKeywords = splitKeywords(itemCodeQuery);
    const nameKeywords = splitKeywords(itemNameQuery);
    const attrKeywords = splitKeywords(itemAttrQuery);
    const locationKeywords = splitKeywords(locationQuery);
    const ownerSet = selectedOwners.size ? selectedOwners : new Set(ownerOptions);
    return rows
      .filter((row) => (
        ownerSet.has(row.화주사)
        && matchesKeyword(row.로케이션명, locationKeywords)
        && matchesKeyword(row.품목코드, codeKeywords)
        && matchesKeyword(row.품목명, nameKeywords)
        && matchesKeyword(row.품목속성, attrKeywords)
        && (!useZoneFilter || row.Zone === zoneFilter)
        && (!useStatusFilter || row.상태 === statusFilter)
      ))
      .sort((a, b) => String(a.로케이션명).localeCompare(String(b.로케이션명)));
  }, [rows, selectedOwners, ownerOptions, locationQuery, itemCodeQuery, itemNameQuery, itemAttrQuery, useZoneFilter, zoneFilter, useStatusFilter, statusFilter]);

  const summary = useMemo(() => {
    const totalStock = filteredRows.reduce((sum, row) => sum + row.총재고, 0);
    const totalReserved = filteredRows.reduce((sum, row) => sum + row.예약, 0);
    return { totalStock, totalReserved };
  }, [filteredRows]);

  const pageSize = Number(rowsPerPage);
  const totalPage = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePageNo = Math.min(pageNo, totalPage);
  const visibleRows = filteredRows.slice((safePageNo - 1) * pageSize, safePageNo * pageSize);

  useEffect(() => {
    if (pageNo !== safePageNo) setPageNo(safePageNo);
  }, [pageNo, safePageNo]);

  return (
    <PageLayout tabTitle={page.title} showDocLinks currentDocKey={page.pageKey}>
      <DocHeaderBlock page={page} />

      <section className="search-card">
        <div className="search-top-row doc-compact">
          <div>
            <strong>검색 조건</strong>
            <p>로케이션명 오름차순 기본 정렬, Zone/상태 추가 필터를 지원합니다.</p>
          </div>
          <div className="toolbar-actions">
            <button type="button" className="primary" onClick={() => showToast(`조회 결과 ${filteredRows.length}건`)}>
              검색
            </button>
            <button type="button" className="secondary" onClick={resetFilters}>검색 초기화</button>
          </div>
        </div>
        <div className="filter-panel doc-open">
          <div className="owner-checks">
            {ownerOptions.map((owner) => (
              <label key={owner}>
                <input type="checkbox" checked={selectedOwners.has(owner)} onChange={() => toggleOwner(owner)} />
                {owner}
              </label>
            ))}
          </div>
          <div className="filter-grid">
            <label>
              로케이션명
              <input value={locationQuery} onChange={(event) => setLocationQuery(event.target.value)} placeholder="예: a-0, rcv" />
            </label>
            <label>
              품목 코드
              <input value={itemCodeQuery} onChange={(event) => setItemCodeQuery(event.target.value)} placeholder="포함 검색" />
            </label>
            <label>
              품목명
              <input value={itemNameQuery} onChange={(event) => setItemNameQuery(event.target.value)} placeholder="포함 검색" />
            </label>
            <label>
              품목 속성
              <input value={itemAttrQuery} onChange={(event) => setItemAttrQuery(event.target.value)} placeholder="예: Free" />
            </label>
          </div>
          <div className="mode-toggle">
            <button
              type="button"
              className={`chip ${useZoneFilter ? "active-mode" : ""}`}
              onClick={() => setUseZoneFilter((prev) => !prev)}
            >
              + 필터추가: Zone
            </button>
            <button
              type="button"
              className={`chip ${useStatusFilter ? "active-mode" : ""}`}
              onClick={() => setUseStatusFilter((prev) => !prev)}
            >
              + 필터추가: 상태
            </button>
          </div>
          {(useZoneFilter || useStatusFilter) ? (
            <div className="filter-grid">
              {useZoneFilter ? (
                <label>
                  Zone
                  <select value={zoneFilter} onChange={(event) => setZoneFilter(event.target.value)}>
                    {zoneOptions.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
              ) : null}
              {useStatusFilter ? (
                <label>
                  상태
                  <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                    {statusOptions.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>

      <DocSummaryCards
        items={[
          { name: "총 조회 건수", value: formatNumber(filteredRows.length), description: "로케이션 × 재고 행 수" },
          { name: "총 재고 수량", value: formatNumber(summary.totalStock), description: "예약 포함 수량" },
          { name: "총 예약 수량", value: formatNumber(summary.totalReserved), description: `가용 계산값 ${formatNumber(summary.totalStock - summary.totalReserved)}` },
        ]}
      />

      <section className="table-toolbar doc-toolbar">
        <div className="count-info">총 {formatNumber(filteredRows.length)}건 (페이지 {safePageNo}/{totalPage})</div>
        <div className="toolbar-actions">
          <button type="button" className="chip" onClick={() => showToast("엑셀 다운로드 실행")}>엑셀 다운로드</button>
          <button
            type="button"
            className="chip"
            onClick={() => showToast("TIP: 총 재고는 예약 포함 수량입니다. 가용 재고는 총 재고 - 예약으로 계산합니다.")}
          >
            활용 TIP
          </button>
          <select value={rowsPerPage} onChange={(event) => setRowsPerPage(event.target.value)}>
            <option value="50">50개씩 보기</option>
            <option value="100">100개씩 보기</option>
            <option value="150">150개씩 보기</option>
            <option value="200">200개씩 보기</option>
          </select>
        </div>
      </section>

      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>화주사</th>
              <th>Zone</th>
              <th>로케이션명</th>
              <th>상태</th>
              <th>품목 코드</th>
              <th>품목명</th>
              <th>품목 속성</th>
              <th>공급처</th>
              <th>유통기한</th>
              <th>로트번호</th>
              <th>총 재고</th>
              <th>예약</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr key={row.__id}>
                <td>{row.화주사}</td>
                <td>{row.Zone}</td>
                <td>{row.로케이션명}</td>
                <td><span className={`status-pill ${row.상태 === "검수 대기" ? "wait" : "ok"}`}>{row.상태}</span></td>
                <td>{row.품목코드}</td>
                <td>
                  <button type="button" className="link-btn" onClick={() => showToast(`${row.품목명} 상세 조회`)}>
                    {row.품목명}
                  </button>
                </td>
                <td>{row.품목속성}</td>
                <td>{row.공급처}</td>
                <td>{row.유통기한}</td>
                <td>{row.로트번호}</td>
                <td>{formatNumber(row.총재고)}</td>
                <td>{formatNumber(row.예약)}</td>
              </tr>
            ))}
            {!visibleRows.length ? (
              <tr>
                <td colSpan={12}>
                  <div className="empty-state">조회 결과가 없습니다.</div>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="pager-inline">
        <button type="button" className="chip" onClick={() => setPageNo((prev) => Math.max(1, prev - 1))}>이전</button>
        <span>{safePageNo} / {totalPage}</span>
        <button type="button" className="chip" onClick={() => setPageNo((prev) => Math.min(totalPage, prev + 1))}>다음</button>
      </div>

      <DocMetaBlock page={page} toast={toast} />
    </PageLayout>
  );
}

function StockMovementSuiteSellmateDoc({ page }) {
  const { toast, showToast } = useToast();
  const ownerOptions = ["원차일드", "onedns_test", "테스트", "안나랜모드"];
  const [activeTab, setActiveTab] = useState("history");
  const [historyType, setHistoryType] = useState("전체");
  const [historyKeyword, setHistoryKeyword] = useState("");
  const [orderStatus, setOrderStatus] = useState("전체");
  const [instructionSelected, setInstructionSelected] = useState(() => new Set());
  const [executionStage, setExecutionStage] = useState("이동대기");
  const [executionSelected, setExecutionSelected] = useState(() => new Set());
  const [manualOwner, setManualOwner] = useState("");
  const [manualSelected, setManualSelected] = useState(() => new Set());
  const [manualRows, setManualRows] = useState([
    { __id: "manual-001", 화주사: "onedns_test", 품목코드: "10000011", "품목명/품목 속성": "데모 베이직 반팔 니트 / Free", 공급처: "자사", 로케이션: "a-0001", 유통기한: "2026-12-31", 로트번호: "LOT-001", 가용: "180", 예약: "12", 검수대기: "0", 불량: "2", 특수: "1" },
    { __id: "manual-002", 화주사: "원차일드", 품목코드: "10000015", "품목명/품목 속성": "데모 슬림 롱슬리브 / Free", 공급처: "자사", 로케이션: "C-01-01", 유통기한: "2026-11-30", 로트번호: "LOT-102", 가용: "120", 예약: "6", 검수대기: "0", 불량: "1", 특수: "0" },
  ]);

  const [executionRows, setExecutionRows] = useState([
    { __id: "exec-001", 화주사: "onedns_test", "이동 오더 번호": "MV-202603-0001", 이동생성일: "2026-03-01", 이동지시일: "2026-03-02", 품목명: "데모 베이직 반팔 니트", "품목 총 수량": "120", 메모: "A-0001 -> B-0001", 진행상태: "이동대기" },
    { __id: "exec-002", 화주사: "원차일드", "이동 오더 번호": "MV-202603-0002", 이동생성일: "2026-03-01", 이동지시일: "2026-03-02", 품목명: "데모 슬림 롱슬리브", "품목 총 수량": "85", 메모: "C-01-01 -> A-0003", 진행상태: "이동중" },
    { __id: "exec-003", 화주사: "onedns_test", "이동 오더 번호": "MV-202603-0003", 이동생성일: "2026-02-28", 이동지시일: "2026-03-01", 품목명: "데모 와이드 데님", "품목 총 수량": "44", 메모: "rcv_conf -> a-0002", 진행상태: "이동완료" },
  ]);

  const historyRows = [
    { __id: "his-001", 일시: "2026-03-03 09:42", 화주사: "onedns_test", "Zone/로케이션": "보관 존 / a-0001", 품목코드: "10000011", "품목명/품목 속성": "데모 베이직 반팔 니트 / Free", "공급처/유통기한/로트번호": "자사 / 2026-12-31 / LOT-001", 수량: "14", 구분: "출고", 작업위치: "패킹존", 작업자: "김작업", 메모: "오더 SHP-001" },
    { __id: "his-002", 일시: "2026-03-03 10:15", 화주사: "원차일드", "Zone/로케이션": "뮬랑 / C-01-01", 품목코드: "10000015", "품목명/품목 속성": "데모 슬림 롱슬리브 / Free", "공급처/유통기한/로트번호": "자사 / 2026-11-30 / LOT-102", 수량: "21", 구분: "이동", 작업위치: "C-01-01", 작업자: "이관리", 메모: "MV-202603-0002" },
    { __id: "his-003", 일시: "2026-03-03 11:40", 화주사: "테스트", "Zone/로케이션": "입고 존 / rcv_conf", 품목코드: "10000013", "품목명/품목 속성": "데모 기모 조거 팬츠 / Free", "공급처/유통기한/로트번호": "자사 / - / -", 수량: "32", 구분: "입고", 작업위치: "입고존", 작업자: "박검수", 메모: "입고 오더 RCV-903" },
    { __id: "his-004", 일시: "2026-03-02 15:20", 화주사: "onedns_test", "Zone/로케이션": "보관 존 / a-0002", 품목코드: "10000016", "품목명/품목 속성": "데모 와이드 데님 / Free", "공급처/유통기한/로트번호": "자사 / - / LOT-004", 수량: "6", 구분: "조정", 작업위치: "Aisle-2", 작업자: "김작업", 메모: "조정 승인 ADJ-1102" },
  ];

  const orderRows = [
    { __id: "ord-001", 화주사: "onedns_test", "이동 오더 번호": "MV-202603-0001", 이동생성일: "2026-03-01", 이동지시일: "2026-03-02", 이동완료일: "-", "이동 지시 수량": "120", "이동 오더 상태": "이동대기", 메모: "A-0001 -> B-0001" },
    { __id: "ord-002", 화주사: "원차일드", "이동 오더 번호": "MV-202603-0002", 이동생성일: "2026-03-01", 이동지시일: "2026-03-02", 이동완료일: "-", "이동 지시 수량": "85", "이동 오더 상태": "이동중", 메모: "C-01-01 -> A-0003" },
    { __id: "ord-003", 화주사: "onedns_test", "이동 오더 번호": "MV-202603-0003", 이동생성일: "2026-02-28", 이동지시일: "2026-03-01", 이동완료일: "2026-03-02", "이동 지시 수량": "44", "이동 오더 상태": "이동완료", 메모: "rcv_conf -> a-0002" },
  ];

  const instructionRows = [
    { __id: "ins-001", 화주사: "onedns_test", "이동 오더 번호": "MV-202603-0005", 생성일: "2026-03-03", 품목명: "데모 베이직 반팔 니트", "이동 지시 수량": "60", 메모: "A-0001 -> B-0002" },
    { __id: "ins-002", 화주사: "테스트", "이동 오더 번호": "MV-202603-0006", 생성일: "2026-03-03", 품목명: "데모 기모 조거 팬츠", "이동 지시 수량": "33", 메모: "B2B_RTN_CONF -> a-0002" },
  ];

  const historyFilteredRows = useMemo(() => {
    const keywords = splitKeywords(historyKeyword);
    return historyRows.filter((row) => (
      (historyType === "전체" || row.구분 === historyType)
      && matchesKeyword(`${row.품목코드} ${row["품목명/품목 속성"]}`, keywords)
    ));
  }, [historyType, historyKeyword, historyRows]);

  const orderFilteredRows = useMemo(() => {
    if (orderStatus === "전체") return orderRows;
    return orderRows.filter((row) => row["이동 오더 상태"] === orderStatus);
  }, [orderRows, orderStatus]);

  const instructionViewRows = useMemo(() => instructionRows.map((row) => ({
    ...row,
    선택: instructionSelected.has(row.__id) ? "☑" : "☐",
  })), [instructionRows, instructionSelected]);

  const executionStageRows = useMemo(
    () => executionRows.filter((row) => row.진행상태 === executionStage),
    [executionRows, executionStage],
  );

  const executionViewRows = useMemo(
    () => executionStageRows.map((row) => ({ ...row, 선택: executionSelected.has(row.__id) ? "☑" : "☐" })),
    [executionStageRows, executionSelected],
  );

  const manualViewRows = useMemo(() => {
    if (!manualOwner) return [];
    return manualRows
      .filter((row) => row.화주사 === manualOwner)
      .map((row) => ({ ...row, 선택: manualSelected.has(row.__id) ? "☑" : "☐" }));
  }, [manualRows, manualOwner, manualSelected]);

  const handleInstructionAction = (actionName) => {
    const selectedCount = instructionRows.filter((row) => instructionSelected.has(row.__id)).length;
    if (!selectedCount) {
      showToast("이동 오더를 선택하세요.");
      return;
    }
    if (actionName === "이동 예정 등록") {
      showToast("이동 예정 정보 등록이 완료되었습니다.");
      return;
    }
    showToast(`${actionName} ${selectedCount}건 처리`);
  };

  const handleExecutionConfirm = () => {
    const selectedCount = executionStageRows.filter((row) => executionSelected.has(row.__id)).length;
    if (!selectedCount) {
      showToast("확정할 이동 건을 선택하세요.");
      return;
    }
    const nextStage = executionStage === "이동대기" ? "이동중" : executionStage === "이동중" ? "이동완료" : "이동완료";
    setExecutionRows((prev) => prev.map((row) => (executionSelected.has(row.__id) ? { ...row, 진행상태: nextStage } : row)));
    setExecutionSelected(new Set());
    showToast(`이동 확정 완료 (${nextStage})`);
  };

  const handleManualMove = () => {
    const selectedCount = manualViewRows.filter((row) => manualSelected.has(row.__id)).length;
    if (!manualOwner) {
      showToast("화주사를 먼저 선택하세요.");
      return;
    }
    if (!selectedCount) {
      showToast("임의 이동할 재고를 선택하세요.");
      return;
    }
    setManualRows((prev) => prev.map((row) => (
      manualSelected.has(row.__id) ? { ...row, 로케이션: "MOVE-TEMP-01" } : row
    )));
    setManualSelected(new Set());
    showToast(`임의 이동 ${selectedCount}건 처리`);
  };

  return (
    <PageLayout tabTitle={page.title} showDocLinks currentDocKey={page.pageKey}>
      <DocHeaderBlock page={page} />

      <section className="special-panel">
        <h3>이동 업무 탭</h3>
        <p>문서 기준으로 입출고 이력 조회부터 이동 지시/실행/임의 이동까지 한 화면에서 데모합니다.</p>
        <div className="mode-toggle">
          {[
            { key: "history", label: "입출고 및 이동 내역" },
            { key: "order", label: "이동 오더 목록" },
            { key: "instruction", label: "이동 지시" },
            { key: "execution", label: "이동 실행" },
            { key: "manual", label: "임의 이동" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`chip ${activeTab === tab.key ? "active-mode" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {activeTab === "history" ? (
        <>
          <section className="search-card">
            <div className="search-top-row doc-compact">
              <div>
                <strong>검색 조건</strong>
                <p>입출고 일자(필수), 구분, 품목 키워드로 통합 이력을 조회합니다.</p>
              </div>
              <div className="toolbar-actions">
                <button type="button" className="primary" onClick={() => showToast(`조회 결과 ${historyFilteredRows.length}건`)}>
                  검색
                </button>
                <button type="button" className="secondary" onClick={() => { setHistoryType("전체"); setHistoryKeyword(""); }}>
                  검색 초기화
                </button>
              </div>
            </div>
            <div className="filter-panel doc-open">
              <div className="filter-grid">
                <label>입출고 일자(시작)<input type="date" defaultValue="2026-03-01" /></label>
                <label>입출고 일자(종료)<input type="date" defaultValue="2026-03-03" /></label>
                <label>
                  구분
                  <select value={historyType} onChange={(event) => setHistoryType(event.target.value)}>
                    {["전체", "입고", "출고", "이동", "반출", "B2B 반품", "B2C 반품", "조정"].map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
                <label>
                  품목 코드/품목명
                  <input value={historyKeyword} onChange={(event) => setHistoryKeyword(event.target.value)} placeholder="포함 검색" />
                </label>
              </div>
            </div>
          </section>
          <DocSummaryCards
            items={[
              { name: "총 이력 건수", value: formatNumber(historyFilteredRows.length), description: "필터 기준 트랜잭션 수" },
              { name: "이동 건수", value: formatNumber(historyFilteredRows.filter((row) => row.구분 === "이동").length), description: "구분=이동" },
              { name: "조정 건수", value: formatNumber(historyFilteredRows.filter((row) => row.구분 === "조정").length), description: "구분=조정" },
            ]}
          />
          <section className="table-toolbar doc-toolbar">
            <div className="count-info">입출고 및 이동 내역 {formatNumber(historyFilteredRows.length)}건</div>
            <div className="toolbar-actions">
              <button type="button" className="chip" onClick={() => showToast("엑셀 다운로드 실행")}>엑셀 다운로드</button>
            </div>
          </section>
          <DocTableBlock
            columns={["일시", "화주사", "Zone/로케이션", "품목코드", "품목명/품목 속성", "공급처/유통기한/로트번호", "수량", "구분", "작업위치", "작업자", "메모"]}
            rows={historyFilteredRows}
          />
        </>
      ) : null}

      {activeTab === "order" ? (
        <>
          <section className="search-card">
            <div className="search-top-row doc-compact">
              <div>
                <strong>검색 조건</strong>
                <p>이동 생성일/지시일/완료일과 상태값으로 이동 오더 현황을 조회합니다.</p>
              </div>
              <div className="toolbar-actions">
                <button type="button" className="primary" onClick={() => showToast(`조회 결과 ${orderFilteredRows.length}건`)}>
                  검색
                </button>
                <button type="button" className="secondary" onClick={() => setOrderStatus("전체")}>검색 초기화</button>
              </div>
            </div>
            <div className="filter-panel doc-open">
              <div className="filter-grid">
                <label>이동 생성일<input type="date" defaultValue="2026-03-01" /></label>
                <label>이동 지시일<input type="date" defaultValue="2026-03-02" /></label>
                <label>이동 완료일<input type="date" /></label>
                <label>
                  상태
                  <select value={orderStatus} onChange={(event) => setOrderStatus(event.target.value)}>
                    {["전체", "이동예정", "이동대기", "이동중", "이동완료", "취소완료"].map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
              </div>
            </div>
          </section>
          <section className="table-toolbar doc-toolbar">
            <div className="count-info">이동 오더 목록 {formatNumber(orderFilteredRows.length)}건</div>
            <div className="toolbar-actions">
              <button type="button" className="chip" onClick={() => showToast("엑셀 다운로드 실행")}>엑셀 다운로드</button>
            </div>
          </section>
          <DocTableBlock
            columns={["화주사", "이동 오더 번호", "이동생성일", "이동지시일", "이동완료일", "이동 지시 수량", "이동 오더 상태", "메모"]}
            rows={orderFilteredRows}
          />
        </>
      ) : null}

      {activeTab === "instruction" ? (
        <>
          <section className="search-card">
            <div className="search-top-row doc-compact">
              <div>
                <strong>검색 조건</strong>
                <p>이동 생성일과 화주 기준으로 지시 발행 대상을 조회합니다.</p>
              </div>
              <div className="toolbar-actions">
                <button type="button" className="primary" onClick={() => showToast(`조회 결과 ${instructionRows.length}건`)}>
                  검색
                </button>
                <button type="button" className="secondary" onClick={() => setInstructionSelected(new Set())}>선택 초기화</button>
              </div>
            </div>
            <div className="filter-panel doc-open">
              <div className="filter-grid">
                <label>이동 생성일<input type="date" defaultValue="2026-03-03" /></label>
                <label>
                  화주사
                  <select defaultValue="전체">
                    <option>전체</option>
                    {ownerOptions.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
                <label>이동 오더 번호<input type="text" placeholder="MV-202603-0005" /></label>
                <label>품목 코드<input type="text" placeholder="10000011" /></label>
              </div>
            </div>
          </section>
          <section className="table-toolbar doc-toolbar">
            <div className="count-info">총 {formatNumber(instructionRows.length)}건 / {formatNumber(instructionSelected.size)}건 선택</div>
            <div className="toolbar-actions">
              <button type="button" className="chip" onClick={() => handleInstructionAction("이동 지시")}>이동 지시</button>
              <button type="button" className="chip" onClick={() => handleInstructionAction("이동 예정 등록")}>이동 예정 등록</button>
              <button type="button" className="chip" onClick={() => showToast("파일로 등록 팝업 실행")}>파일로 등록</button>
            </div>
          </section>
          <DocTableBlock
            columns={["선택", "화주사", "이동 오더 번호", "생성일", "품목명", "이동 지시 수량", "메모"]}
            rows={instructionViewRows}
            onRowClick={(row) => {
              setInstructionSelected((prev) => {
                const next = new Set(prev);
                if (next.has(row.__id)) next.delete(row.__id);
                else next.add(row.__id);
                return next;
              });
            }}
          />
        </>
      ) : null}

      {activeTab === "execution" ? (
        <>
          <section className="search-card">
            <div className="search-top-row doc-compact">
              <div>
                <strong>검색 조건</strong>
                <p>이동 지시일 기준 조회 후 상태 탭(이동대기/이동중/이동완료)으로 실행 단계를 관리합니다.</p>
              </div>
              <div className="toolbar-actions">
                <button type="button" className="primary" onClick={() => showToast(`현재 탭 ${executionStageRows.length}건`)}>
                  검색
                </button>
                <button type="button" className="secondary" onClick={() => setExecutionSelected(new Set())}>선택 초기화</button>
              </div>
            </div>
            <div className="filter-panel doc-open">
              <div className="filter-grid">
                <label>이동 지시일<input type="date" defaultValue="2026-03-02" /></label>
                <label>
                  화주사
                  <select defaultValue="전체">
                    <option>전체</option>
                    {ownerOptions.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
                <label>이동 오더 번호<input type="text" placeholder="MV-202603-" /></label>
                <label>품목 코드<input type="text" placeholder="10000011" /></label>
              </div>
            </div>
          </section>
          <section className="special-panel">
            <h3>상태 탭</h3>
            <div className="mode-toggle">
              {["이동대기", "이동중", "이동완료"].map((stage) => (
                <button
                  key={stage}
                  type="button"
                  className={`chip ${executionStage === stage ? "active-mode" : ""}`}
                  onClick={() => {
                    setExecutionStage(stage);
                    setExecutionSelected(new Set());
                  }}
                >
                  {stage} ({executionRows.filter((row) => row.진행상태 === stage).length})
                </button>
              ))}
            </div>
          </section>
          <section className="table-toolbar doc-toolbar">
            <div className="count-info">{executionStage} {formatNumber(executionStageRows.length)}건 / {formatNumber(executionSelected.size)}건 선택</div>
            <div className="toolbar-actions">
              <button type="button" className="chip" onClick={() => showToast("작업 지시서 출력 실행")}>작업 지시서 출력</button>
              <button type="button" className="chip" onClick={handleExecutionConfirm}>이동 확정</button>
            </div>
          </section>
          <DocTableBlock
            columns={["선택", "화주사", "이동 오더 번호", "이동생성일", "이동지시일", "품목명", "품목 총 수량", "메모"]}
            rows={executionViewRows}
            onRowClick={(row) => {
              setExecutionSelected((prev) => {
                const next = new Set(prev);
                if (next.has(row.__id)) next.delete(row.__id);
                else next.add(row.__id);
                return next;
              });
            }}
          />
        </>
      ) : null}

      {activeTab === "manual" ? (
        <>
          <section className="search-card">
            <div className="search-top-row doc-compact">
              <div>
                <strong>검색 조건</strong>
                <p>임의 이동은 화주사 선택이 필수입니다.</p>
              </div>
              <div className="toolbar-actions">
                <button type="button" className="primary" onClick={() => showToast(manualOwner ? `조회 결과 ${manualViewRows.length}건` : "화주사를 먼저 선택하세요.")}>
                  검색
                </button>
                <button type="button" className="secondary" onClick={() => { setManualOwner(""); setManualSelected(new Set()); }}>검색 초기화</button>
              </div>
            </div>
            <div className="filter-panel doc-open">
              <div className="filter-grid">
                <label>
                  화주사(필수)
                  <select value={manualOwner} onChange={(event) => setManualOwner(event.target.value)}>
                    <option value="">선택</option>
                    {ownerOptions.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
                <label>로케이션명<input type="text" placeholder="a-0001" /></label>
                <label>품목코드<input type="text" placeholder="10000011" /></label>
                <label>품목명<input type="text" placeholder="데모 베이직 반팔 니트" /></label>
              </div>
            </div>
          </section>
          <section className="table-toolbar doc-toolbar">
            <div className="count-info">총 {formatNumber(manualViewRows.length)}건 / {formatNumber(manualSelected.size)}건 선택</div>
            <div className="toolbar-actions">
              <button type="button" className="chip" onClick={handleManualMove}>임의 이동</button>
              <button type="button" className="chip" onClick={() => showToast("파일로 등록 팝업 실행")}>파일로 등록</button>
            </div>
          </section>
          {!manualOwner ? (
            <div className="empty-state bordered">데이터를 불러오기 위해, 검색 조건(화주사) 설정이 필요합니다.</div>
          ) : (
            <DocTableBlock
              columns={["선택", "화주사", "품목코드", "품목명/품목 속성", "공급처", "로케이션", "유통기한", "로트번호", "가용", "예약", "검수대기", "불량", "특수"]}
              rows={manualViewRows}
              onRowClick={(row) => {
                setManualSelected((prev) => {
                  const next = new Set(prev);
                  if (next.has(row.__id)) next.delete(row.__id);
                  else next.add(row.__id);
                  return next;
                });
              }}
            />
          )}
        </>
      ) : null}

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
    "r-stk-101": InOutListDoc,
    "sm-stk-201": ItemStockListSellmateDoc,
    "sm-stk-202": ItemBarcodePrintSellmateDoc,
    "sm-stk-203": LocationStockListSellmateDoc,
    "sm-stk-204": StockMovementSuiteSellmateDoc,
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

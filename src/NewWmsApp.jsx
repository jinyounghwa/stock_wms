import { useEffect, useMemo, useRef, useState } from "react";
import { BrowserRouter, NavLink, Navigate, Route, Routes } from "react-router-dom";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from "chart.js";
import { Bar, Bubble, Doughnut, Line, Radar, Scatter } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  Tooltip,
  Legend,
  Filler,
);

function formatNumber(value) {
  return Number(value || 0).toLocaleString("ko-KR");
}

function toNumber(value) {
  const parsed = Number(String(value ?? "").replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function getNowString() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

function useToast() {
  const [toast, setToast] = useState("");
  const timerRef = useRef(0);

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setToast(""), 1800);
  };

  useEffect(
    () => () => {
      window.clearTimeout(timerRef.current);
    },
    [],
  );

  return { toast, showToast };
}

const OWNER_OPTIONS = ["ALL", "화주사 2", "안나엔모드", "onedns_test", "원차일드", "테스트"];
const CENTER_OPTIONS = ["ALL", "A센터", "B센터"];
const ZONE_OPTIONS = ["ALL", "입고존", "보관존", "출고존", "반품존", "뮬랑"];
const SEASON_OPTIONS = ["ALL", "봄", "여름", "FW24", "FW25", "연중"];

const CHART_COLORS = {
  blue: "#2486f9",
  blueSoft: "#d9eaff",
  sky: "#69b3ff",
  green: "#25a86c",
  amber: "#f2a341",
  red: "#e04b4b",
  slate: "#7a879d",
  line: "#e6ebf3",
  text: "#556780",
};

function chartBaseOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          color: CHART_COLORS.text,
          font: {
            family: "Noto Sans KR",
            size: 11,
          },
        },
      },
      tooltip: {
        backgroundColor: "#1f2c3f",
        titleFont: { family: "Noto Sans KR", size: 11, weight: "600" },
        bodyFont: { family: "Noto Sans KR", size: 11 },
        padding: 9,
        borderColor: "#2f435f",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: CHART_COLORS.text,
          font: {
            family: "Noto Sans KR",
            size: 11,
          },
        },
        grid: {
          color: "#f0f3f8",
        },
        border: { color: CHART_COLORS.line },
      },
      y: {
        ticks: {
          color: CHART_COLORS.text,
          font: {
            family: "Noto Sans KR",
            size: 11,
          },
        },
        grid: {
          color: "#edf2f8",
        },
        border: { color: CHART_COLORS.line },
      },
    },
  };
}

const PRODUCT_MASTER = [
  {
    id: "prd-001",
    owner: "화주사 2",
    name: "나이키 에어맥스 270",
    option: "블랙/화이트, 270mm",
    barcode: "880123456789",
    brand: "나이키코리아",
    tone: "dark",
    locations: [
      { zone: "입고존", code: "WHO1-A01-01-01", qty: 150 },
      { zone: "입고존", code: "WHO1-A01-01-02", qty: 150 },
      { zone: "보관존", code: "WHO1-B01-01-01", qty: 150 },
    ],
  },
  {
    id: "prd-002",
    owner: "화주사 2",
    name: "아디다스 울트라부스트",
    option: "핑크, 250mm",
    barcode: "880987654321",
    brand: "아디다스코리아",
    tone: "pink",
    locations: [
      { zone: "보관존", code: "WHO1-B02-01-01", qty: 200 },
      { zone: "출고존", code: "WHO1-A01-03-01", qty: 120 },
    ],
  },
  {
    id: "prd-003",
    owner: "화주사 2",
    name: "퓨마 스피드캣",
    option: "화이트, 265mm",
    barcode: "880555444333",
    brand: "퓨마코리아",
    tone: "light",
    locations: [
      { zone: "입고존", code: "WHO1-A01-02-01", qty: 100 },
      { zone: "보관존", code: "WHO1-B01-02-01", qty: 80 },
      { zone: "보관존", code: "WHO1-B01-03-02", qty: 100 },
    ],
  },
  {
    id: "prd-004",
    owner: "안나엔모드",
    name: "(아동)❤더심플카라셔츠[셔츠BAM276]",
    option: "아이보리,5호(XL)",
    barcode: "81231341295121",
    brand: "브랜드A",
    tone: "red",
    locations: [
      { zone: "보관존", code: "4E-AX-06-4", qty: 1 },
      { zone: "보관존", code: "4E-AX-09-4", qty: 2 },
    ],
  },
  {
    id: "prd-005",
    owner: "안나엔모드",
    name: "(아동)❤쫄깃기본티(1+1)[티셔츠BANX23]",
    option: "아이보리,M",
    barcode: "81231341295122",
    brand: "브랜드B",
    tone: "orange",
    locations: [
      { zone: "보관존", code: "4E-AX-02-1", qty: 2 },
      { zone: "보관존", code: "4E-AX-03-1", qty: 1 },
      { zone: "보관존", code: "4E-AX-09-5", qty: 3 },
    ],
  },
  {
    id: "prd-006",
    owner: "onedns_test",
    name: "데모 베이직 반팔 니트",
    option: "블랙, M",
    barcode: "8001231230001",
    brand: "MADE J",
    tone: "sky",
    locations: [
      { zone: "보관존", code: "A-01-2", qty: 1 },
      { zone: "보관존", code: "A-01-3", qty: 3 },
      { zone: "보관존", code: "A-02-3", qty: 4 },
    ],
  },
];

const LOCATION_CODE_GROUP_A = [
  "a7g90122600",
  "a7g87954300",
  "A7JE0001557",
  "A7V00001414",
  "A07G0916130",
  "A-BOX-1",
  "A-01-BOX",
  "A-BOX-01",
  "A-01",
  "A-01-1",
  "A-01-2",
  "A-01-3",
  "A-01-4",
  "A-01-5",
  "A-BOX-2",
  "A-BOX-02",
  "A-02",
  "A-02-1",
  "A-02-2",
  "A-02-3",
  "A-02-4",
  "A-02-5",
  "A-BOX-3",
  "A-03",
  "A-BOX-03",
  "A-03-1",
  "A03-01-4",
  "A03-01-04",
  "A-03-2",
  "A03-02-4",
  "A03-02-04",
  "A-03-3",
  "A03-03-2",
];

const LOCATION_FIXED_STOCK = {
  "A-01-2": { stock: 1, reserved: 1 },
  "A-01-3": { stock: 3, reserved: 3 },
  "A-01-5": { stock: 3, reserved: 3 },
  "A-02-2": { stock: 2, reserved: 2 },
  "A-02-3": { stock: 4, reserved: 4 },
  "A-03-1": { stock: 2, reserved: 2 },
  "A-03-3": { stock: 3, reserved: 3 },
  "A-01-BOX": { stock: 0, reserved: 0 },
};

function pickZoneByCode(code) {
  if (code.includes("BOX")) return "입고존";
  if (code.startsWith("A03")) return "출고존";
  return "보관존";
}

function getAreaFromLocationCode(code) {
  const parts = String(code || "").split("-").filter(Boolean);
  if (parts.length >= 2) return `${parts[0]}-${parts[1]}`;
  return String(code || "-");
}

function splitInteger(total, parts) {
  if (parts <= 0) return [];
  const safeTotal = Math.max(0, toNumber(total));
  const base = Math.floor(safeTotal / parts);
  let remainder = safeTotal % parts;
  return Array.from({ length: parts }).map(() => {
    if (remainder > 0) {
      remainder -= 1;
      return base + 1;
    }
    return base;
  });
}

function buildVirtualLocationProducts({ rowId, owner, locationCode, stock, reserved }) {
  const ownerPool = PRODUCT_MASTER.filter((product) => product.owner === owner);
  const pool = ownerPool.length ? ownerPool : PRODUCT_MASTER;
  if (!pool.length) return [];

  const seed = `${rowId}-${locationCode}-${owner}`
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const productCount = Math.min(3, Math.max(stock > 0 ? 2 : 1, 1), pool.length);
  const startIndex = seed % pool.length;
  const candidates = Array.from({ length: productCount }).map((_, index) => pool[(startIndex + index) % pool.length]);
  const stockParts = splitInteger(stock, productCount);
  const reservedParts = splitInteger(Math.min(reserved, stock), productCount);

  return candidates.map((product, index) => {
    const itemStock = stockParts[index] || 0;
    const itemReserved = Math.min(reservedParts[index] || 0, itemStock);
    return {
      id: `${rowId}-virtual-${product.id}-${index}`,
      owner,
      name: product.name,
      option: product.option,
      barcode: product.barcode,
      stock: itemStock,
      available: Math.max(itemStock - itemReserved, 0),
      reserved: itemReserved,
      virtual: true,
    };
  });
}

function buildLocationRows() {
  const owners = ["onedns_test", "원차일드", "테스트", "화주사 2", "안나엔모드"];

  const rowsA = LOCATION_CODE_GROUP_A.map((code, index) => {
    const fixed = LOCATION_FIXED_STOCK[code] || { stock: 0, reserved: 0 };
    const stock = fixed.stock;
    const reserved = fixed.reserved;
    const owner = owners[index % owners.length];
    let products = PRODUCT_MASTER
      .filter((product) => product.locations.some((loc) => loc.code === code))
      .map((product) => {
        const location = product.locations.find((loc) => loc.code === code);
        return {
          id: `${product.id}-${code}`,
          owner: product.owner,
          name: product.name,
          option: product.option,
          barcode: product.barcode,
          stock: location ? location.qty : 0,
          available: location ? Math.max(location.qty - 1, 0) : 0,
          reserved: location ? Math.min(location.qty, 1) : 0,
        };
      });
    if (!products.length) {
      products = buildVirtualLocationProducts({
        rowId: `loc-a-${index + 1}`,
        owner,
        locationCode: code,
        stock,
        reserved,
      });
    }

    return {
      id: `loc-a-${index + 1}`,
      owner,
      center: "A센터",
      zone: pickZoneByCode(code),
      locationCode: code,
      stock,
      reserved,
      available: Math.max(stock - reserved, 0),
      capacity: 20,
      products,
    };
  });

  const rowsB = [
    {
      id: "loc-b-1",
      owner: "화주사 2",
      center: "B센터",
      zone: "보관존",
      locationCode: "4E-A-01-1",
      stock: 150,
      reserved: 5,
      available: 145,
      capacity: 180,
      products: [
        {
          id: "prd-001-4E-A-01-1",
          owner: "화주사 2",
          name: "나이키 에어맥스 270",
          option: "블랙/화이트, 270mm",
          barcode: "880123456789",
          stock: 150,
          available: 145,
          reserved: 5,
        },
      ],
    },
    {
      id: "loc-b-2",
      owner: "화주사 2",
      center: "B센터",
      zone: "보관존",
      locationCode: "3C-B-02-5",
      stock: 150,
      reserved: 6,
      available: 144,
      capacity: 180,
      products: [
        {
          id: "prd-001-3C-B-02-5",
          owner: "화주사 2",
          name: "나이키 에어맥스 270",
          option: "블랙/화이트, 270mm",
          barcode: "880123456789",
          stock: 150,
          available: 144,
          reserved: 6,
        },
      ],
    },
    {
      id: "loc-b-3",
      owner: "안나엔모드",
      center: "B센터",
      zone: "보관존",
      locationCode: "4E-AX-09-5",
      stock: 3,
      reserved: 0,
      available: 3,
      capacity: 40,
      products: [
        {
          id: "prd-005-4E-AX-09-5",
          owner: "안나엔모드",
          name: "(아동)❤쫄깃기본티(1+1)[티셔츠BANX23]",
          option: "아이보리,M",
          barcode: "81231341295122",
          stock: 3,
          available: 3,
          reserved: 0,
        },
      ],
    },
  ];

  const normalizedRowsB = rowsB.map((row) => {
    if (row.products.length) return row;
    return {
      ...row,
      products: buildVirtualLocationProducts({
        rowId: row.id,
        owner: row.owner,
        locationCode: row.locationCode,
        stock: row.stock,
        reserved: row.reserved,
      }),
    };
  });

  return [...rowsA, ...normalizedRowsB];
}

const LOCATION_STOCK_ROWS = buildLocationRows();

const SLOW_MOVING_SKUS = [
  {
    id: "sku-001",
    center: "A센터",
    owner: "안나엔모드",
    productName: "(아동)❤더심플카라셔츠[셔츠BAM276]",
    brand: "브랜드A",
    season: "봄",
    lastInboundDate: "2025. 11. 7.",
    lastOutboundDate: "없음",
    daysNoOutbound: 118,
    daysSinceInbound: 118,
    locations: [
      { id: "sku-001-l1", zone: "보관존", area: "4E-AX", locationCode: "4E-AX-06-4", optionName: "아이보리,5호(XL)", barcode: "81231341295121", availableQty: 1, reservedQty: 0 },
      { id: "sku-001-l2", zone: "보관존", area: "4E-AX", locationCode: "4E-AX-09-4", optionName: "아이보리,5호(XL)", barcode: "81231341295121", availableQty: 2, reservedQty: 0 },
    ],
  },
  {
    id: "sku-002",
    center: "A센터",
    owner: "안나엔모드",
    productName: "(아동)❤쫄깃기본티(1+1)[티셔츠BANX23]",
    brand: "브랜드B",
    season: "봄",
    lastInboundDate: "2025. 10. 25.",
    lastOutboundDate: "없음",
    daysNoOutbound: 190,
    daysSinceInbound: 130,
    locations: [
      { id: "sku-002-l1", zone: "보관존", area: "4E-AX", locationCode: "4E-AX-02-1", optionName: "아이보리,M", barcode: "81231341295122", availableQty: 1, reservedQty: 0 },
      { id: "sku-002-l2", zone: "보관존", area: "4E-AX", locationCode: "4E-AX-03-1", optionName: "블루,S", barcode: "81231341295122", availableQty: 1, reservedQty: 0 },
      { id: "sku-002-l3", zone: "보관존", area: "4E-AX", locationCode: "4E-AX-09-5", optionName: "아이보리,3호(M)", barcode: "81231341295122", availableQty: 3, reservedQty: 0 },
    ],
  },
  {
    id: "sku-003",
    center: "B센터",
    owner: "화주사 2",
    productName: "나이키 에어맥스 270",
    brand: "나이키코리아",
    season: "FW25",
    lastInboundDate: "2026. 01. 22.",
    lastOutboundDate: "2026. 01. 26.",
    daysNoOutbound: 38,
    daysSinceInbound: 42,
    locations: [
      { id: "sku-003-l1", zone: "보관존", area: "4E-A", locationCode: "4E-A-01-1", optionName: "블랙/화이트,270mm", barcode: "880123456789", availableQty: 145, reservedQty: 5 },
      { id: "sku-003-l2", zone: "보관존", area: "3C-B", locationCode: "3C-B-02-5", optionName: "블랙/화이트,270mm", barcode: "880123456789", availableQty: 144, reservedQty: 6 },
    ],
  },
  {
    id: "sku-004",
    center: "A센터",
    owner: "onedns_test",
    productName: "데모 베이직 반팔 니트",
    brand: "MADE J",
    season: "연중",
    lastInboundDate: "2025. 06. 10.",
    lastOutboundDate: "2025. 07. 10.",
    daysNoOutbound: 240,
    daysSinceInbound: 270,
    locations: [
      { id: "sku-004-l1", zone: "보관존", area: "A-01", locationCode: "A-01-2", optionName: "블랙,M", barcode: "8001231230001", availableQty: 1, reservedQty: 1 },
      { id: "sku-004-l2", zone: "보관존", area: "A-01", locationCode: "A-01-3", optionName: "블랙,M", barcode: "8001231230001", availableQty: 3, reservedQty: 0 },
      { id: "sku-004-l3", zone: "보관존", area: "A-02", locationCode: "A-02-3", optionName: "블랙,M", barcode: "8001231230001", availableQty: 4, reservedQty: 0 },
    ],
  },
  {
    id: "sku-005",
    center: "B센터",
    owner: "원차일드",
    productName: "데모 울 라운드 니트",
    brand: "VINTAGE LAB",
    season: "FW24",
    lastInboundDate: "2024. 12. 10.",
    lastOutboundDate: "2025. 01. 02.",
    daysNoOutbound: 410,
    daysSinceInbound: 420,
    locations: [
      { id: "sku-005-l1", zone: "보관존", area: "C-01", locationCode: "C-01-01", optionName: "오프화이트,L", barcode: "8899011122334", availableQty: 32, reservedQty: 2 },
      { id: "sku-005-l2", zone: "보관존", area: "C-01", locationCode: "C-01-02", optionName: "오프화이트,L", barcode: "8899011122334", availableQty: 28, reservedQty: 1 },
    ],
  },
];

function buildSystemStockRows() {
  const rows = [];
  PRODUCT_MASTER.forEach((product) => {
    product.locations.forEach((location) => {
      rows.push({
        key: `${product.barcode}|${location.code}`,
        owner: product.owner,
        barcode: product.barcode,
        productName: product.name,
        option: product.option,
        locationCode: location.code,
        zone: location.zone,
        qty: location.qty,
      });
    });
  });
  return rows;
}

const SYSTEM_STOCK_ROWS = buildSystemStockRows();

function getSlowGrade(daysNoOutbound) {
  if (daysNoOutbound >= 365) return { label: "위험", className: "risk" };
  if (daysNoOutbound >= 180) return { label: "경고", className: "warning" };
  if (daysNoOutbound >= 90) return { label: "주의", className: "caution" };
  return { label: "정상", className: "normal" };
}

function getToneClass(tone) {
  const map = {
    dark: "tone-dark",
    pink: "tone-pink",
    light: "tone-light",
    red: "tone-red",
    orange: "tone-orange",
    sky: "tone-sky",
  };
  return map[tone] || "tone-dark";
}

function buildDemoProductsForLocation(selectedLocation, ownerProducts) {
  if (!selectedLocation || !ownerProducts.length) return [];
  const seed = `${selectedLocation.locationCode}-${selectedLocation.owner || ""}`
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const pickCount = Math.min(4, ownerProducts.length);
  const start = seed % ownerProducts.length;
  const weightTotal = (pickCount * (pickCount + 1)) / 2;
  const baseQty = Math.max(
    toNumber(selectedLocation.available) + toNumber(selectedLocation.reserved),
    toNumber(selectedLocation.stock),
    1,
  );

  return Array.from({ length: pickCount }).map((_, index) => {
    const master = ownerProducts[(start + index) % ownerProducts.length];
    const weight = pickCount - index;
    return {
      id: `${master.id}-demo-${selectedLocation.id}-${index}`,
      productId: master.id,
      name: master.name,
      option: master.option,
      barcode: master.barcode,
      brand: master.brand,
      tone: master.tone,
      systemQty: Math.max(1, Math.round((baseQty * weight) / weightTotal)),
      zone: selectedLocation.zone,
      sourceType: "demo",
    };
  });
}

function getLocationIntensity(stock, capacity) {
  if (capacity <= 0) return "empty";
  const ratio = (stock / capacity) * 100;
  if (ratio <= 0) return "empty";
  if (ratio <= 30) return "low";
  if (ratio <= 60) return "medium";
  if (ratio <= 90) return "high";
  return "full";
}

function statusClass(status) {
  if (status === "승인됨" || status === "실입고완료" || status === "일치") return "ok";
  if (status === "대기중" || status === "조사중" || status === "불일치+") return "warn";
  if (status === "거절됨" || status === "취소됨" || status === "불일치-") return "danger";
  return "muted";
}

function findProductByBarcode(barcode) {
  return PRODUCT_MASTER.find((product) => product.barcode === barcode);
}

function SidebarLayout({ title, children }) {
  return (
    <div className="nw-shell">
      <aside className="nw-sidebar">
        <div className="nw-brand">
          <div className="nw-brand-icon">W</div>
          <div>
            <strong>Stock WMS</strong>
            <span>재고관리 메뉴</span>
          </div>
        </div>

        <nav className="nw-nav">
          <div className="nw-nav-title">재고관리</div>
          <NavLink to="/inventory-survey" className={({ isActive }) => `nw-nav-item ${isActive ? "active" : ""}`}>
            재고조사
          </NavLink>
          <NavLink to="/location-stock" className={({ isActive }) => `nw-nav-item ${isActive ? "active" : ""}`}>
            위치별 재고 현황
          </NavLink>
          <NavLink to="/slow-moving" className={({ isActive }) => `nw-nav-item ${isActive ? "active" : ""}`}>
            부진재고
          </NavLink>
          <NavLink to="/slow-moving-2" className={({ isActive }) => `nw-nav-item ${isActive ? "active" : ""}`}>
            부진재고2
          </NavLink>
        </nav>

        <div className="nw-sidebar-note">
          기존 문서 데모 페이지는 잠시 숨김 처리되어 있습니다.
        </div>
      </aside>

      <main className="nw-main">
        <header className="nw-topbar">
          <h1>{title}</h1>
          <div className="nw-topbar-right">`재고2/new` 명세/이미지 기준 Web 버전</div>
        </header>

        <section className="nw-content">{children}</section>
      </main>
    </div>
  );
}

function GlobalToast({ message }) {
  return <div className={`nw-toast ${message ? "show" : ""}`}>{message}</div>;
}

function ChartPanel({ title, helper = "", className = "", children }) {
  return (
    <section className={`nw-chart-panel ${className}`}>
      <div className="nw-panel-title-row mini">
        <h4>{title}</h4>
        {helper ? <div className="nw-helper-text">{helper}</div> : null}
      </div>
      <div className="nw-chart-body">{children}</div>
    </section>
  );
}

function intensityColor(intensity) {
  if (intensity === "full") return "#1f83f8";
  if (intensity === "high") return "#3e97fb";
  if (intensity === "medium") return "#6aaefb";
  if (intensity === "low") return "#a8cfff";
  return "#d7dde8";
}

function SlowMovingBasePage({
  menuTitle = "부진재고",
  pageTitle = "부진재고",
  pageDescription = "SKU 단위 필터 + 위치 단위 출력, 리스트/2D 시각화 전환",
  visualVariant = "v1",
} = {}) {
  const { toast, showToast } = useToast();
  const [filters, setFilters] = useState({
    owner: "ALL",
    center: "A센터",
    zone: "ALL",
    daysNoOutbound: "30",
    daysSinceInbound: "30",
    minStock: "1",
    season: "봄",
    brand: "ALL",
    query: "",
  });
  const [viewMode, setViewMode] = useState("list");
  const [selectedSkuId, setSelectedSkuId] = useState("sku-001");
  const [selectedLocationCode, setSelectedLocationCode] = useState("");
  const [routeSourceCode, setRouteSourceCode] = useState("");
  const [routeTargetCode, setRouteTargetCode] = useState("");
  const [weightMode, setWeightMode] = useState("qty_high");

  const filteredSkus = useMemo(
    () => SLOW_MOVING_SKUS.filter((sku) => {
      const totalStock = sku.locations.reduce((sum, location) => sum + location.availableQty + location.reservedQty, 0);
      const queryTarget = `${sku.productName} ${sku.brand} ${sku.locations.map((location) => location.locationCode).join(" ")} ${sku.locations.map((location) => location.barcode).join(" ")}`.toLowerCase();
      const queryMatched = !filters.query || queryTarget.includes(filters.query.trim().toLowerCase());
      return (
        (filters.owner === "ALL" || sku.owner === filters.owner)
        && (filters.center === "ALL" || sku.center === filters.center)
        && (filters.season === "ALL" || sku.season === filters.season)
        && (filters.brand === "ALL" || sku.brand === filters.brand)
        && sku.daysNoOutbound >= toNumber(filters.daysNoOutbound)
        && sku.daysSinceInbound >= toNumber(filters.daysSinceInbound)
        && totalStock >= toNumber(filters.minStock)
        && queryMatched
      );
    }),
    [filters],
  );

  useEffect(() => {
    if (!filteredSkus.length) {
      setSelectedSkuId("");
      return;
    }
    if (!filteredSkus.some((sku) => sku.id === selectedSkuId)) {
      setSelectedSkuId(filteredSkus[0].id);
    }
  }, [filteredSkus, selectedSkuId]);

  const filteredRows = useMemo(
    () =>
      filteredSkus.flatMap((sku) =>
        sku.locations
          .filter((location) => filters.zone === "ALL" || location.zone === filters.zone)
          .map((location) => {
            const skuTotalQty = sku.locations.reduce((sum, item) => sum + item.availableQty + item.reservedQty, 0);
            const locationQty = location.availableQty + location.reservedQty;
            return {
              rowId: location.id,
              skuId: sku.id,
              owner: sku.owner,
              productName: sku.productName,
              optionName: location.optionName,
              barcode: location.barcode,
              brand: sku.brand,
              center: sku.center,
              season: sku.season,
              zone: location.zone,
              area: location.area,
              locationCode: location.locationCode,
              lastInboundDate: sku.lastInboundDate,
              lastOutboundDate: sku.lastOutboundDate,
              daysNoOutbound: sku.daysNoOutbound,
              availableQty: location.availableQty,
              reservedQty: location.reservedQty,
              skuTotalQty,
              locationRatio: skuTotalQty > 0 ? (locationQty / skuTotalQty) * 100 : 0,
              grade: getSlowGrade(sku.daysNoOutbound),
            };
          }),
      ),
    [filteredSkus, filters.zone],
  );

  const summary = useMemo(() => {
    const skuCount = new Set(filteredRows.map((row) => row.skuId)).size;
    const totalAvailable = filteredRows.reduce((sum, row) => sum + row.availableQty, 0);
    const totalReserved = filteredRows.reduce((sum, row) => sum + row.reservedQty, 0);
    return { skuCount, totalAvailable, totalReserved };
  }, [filteredRows]);

  const gradeChart = useMemo(() => {
    const source = [
      { key: "정상", className: "normal" },
      { key: "주의", className: "caution" },
      { key: "경고", className: "warning" },
      { key: "위험", className: "risk" },
    ];
    return source.map((item) => ({
      ...item,
      count: filteredSkus.filter((sku) => getSlowGrade(sku.daysNoOutbound).label === item.key).length,
    }));
  }, [filteredSkus]);

  const agingBuckets = useMemo(() => {
    const source = [
      { label: "0~89일", min: 0, max: 89, value: 0 },
      { label: "90~179일", min: 90, max: 179, value: 0 },
      { label: "180~364일", min: 180, max: 364, value: 0 },
      { label: "365일+", min: 365, max: Number.MAX_SAFE_INTEGER, value: 0 },
    ];

    filteredSkus.forEach((sku) => {
      const bucket = source.find((item) => sku.daysNoOutbound >= item.min && sku.daysNoOutbound <= item.max);
      if (bucket) bucket.value += 1;
    });

    return source;
  }, [filteredSkus]);

  const zoneHeat = useMemo(() => {
    const source = ["입고존", "보관존", "출고존", "반품존", "뮬랑"].map((zone) => ({
      zone,
      count: 0,
      qty: 0,
    }));

    filteredRows.forEach((row) => {
      const target = source.find((item) => item.zone === row.zone);
      if (!target) return;
      target.count += 1;
      target.qty += row.availableQty + row.reservedQty;
    });

    return source;
  }, [filteredRows]);

  const gradeDoughnutData = useMemo(() => ({
    labels: gradeChart.map((item) => item.key),
    datasets: [
      {
        data: gradeChart.map((item) => item.count),
        backgroundColor: ["#7cc08e", "#f2c14a", "#f29b4b", "#e15a5a"],
        borderColor: "#ffffff",
        borderWidth: 2,
        hoverOffset: 5,
      },
    ],
  }), [gradeChart]);

  const agingBarData = useMemo(() => ({
    labels: agingBuckets.map((item) => item.label),
    datasets: [
      {
        label: "SKU 수",
        data: agingBuckets.map((item) => item.value),
        backgroundColor: ["#b9d9ff", "#84bcff", "#549fff", "#267ff8"],
        borderRadius: 6,
        maxBarThickness: 34,
      },
    ],
  }), [agingBuckets]);

  const zoneRadarData = useMemo(() => ({
    labels: zoneHeat.map((item) => item.zone),
    datasets: [
      {
        label: "위치 행 수",
        data: zoneHeat.map((item) => item.count),
        borderColor: CHART_COLORS.blue,
        backgroundColor: "rgba(36, 134, 249, 0.16)",
        pointBackgroundColor: CHART_COLORS.blue,
        pointRadius: 3,
      },
      {
        label: "재고 수량(10단위)",
        data: zoneHeat.map((item) => Math.round(item.qty / 10)),
        borderColor: CHART_COLORS.amber,
        backgroundColor: "rgba(242, 163, 65, 0.15)",
        pointBackgroundColor: CHART_COLORS.amber,
        pointRadius: 3,
      },
    ],
  }), [zoneHeat]);

  const selectedSku = filteredSkus.find((sku) => sku.id === selectedSkuId) || filteredSkus[0] || null;

  const v2VisualRows = useMemo(() => {
    if (visualVariant !== "v2") return [];
    const zoneRank = {
      입고존: 0,
      보관존: 1,
      출고존: 2,
      반품존: 3,
      뮬랑: 4,
    };
    return filteredRows.map((row, index) => {
      const qty = row.availableQty + row.reservedQty;
      return {
        ...row,
        id: row.rowId,
        qty,
        x: (index % 18) + 1 + (row.center === "B센터" ? 0.35 : 0),
        y: Math.floor(index / 18) + 1 + (zoneRank[row.zone] ?? 0) * 0.36,
      };
    });
  }, [filteredRows, visualVariant]);

  useEffect(() => {
    const sourcePoints = visualVariant === "v2"
      ? v2VisualRows
      : (selectedSku?.locations || []).map((location) => ({ locationCode: location.locationCode }));
    if (!sourcePoints.length) {
      setSelectedLocationCode("");
      return;
    }
    const hasSelected = sourcePoints.some((point) => point.locationCode === selectedLocationCode);
    if (!hasSelected) {
      setSelectedLocationCode(sourcePoints[0].locationCode);
    }
  }, [selectedLocationCode, selectedSku, v2VisualRows, visualVariant]);

  const skuObjectPoints = useMemo(() => {
    if (!selectedSku) return [];
    return selectedSku.locations.map((location, index) => {
      const qty = location.availableQty + location.reservedQty;
      const laneOffset = location.zone === "출고존" ? 0.22 : location.zone === "보관존" ? 0.1 : 0;
      return {
        ...location,
        id: location.locationCode,
        qty,
        x: (index % 5) + 1 + (location.reservedQty > 0 ? 0.12 : 0),
        y: Math.floor(index / 5) + 1 + laneOffset,
      };
    });
  }, [selectedSku]);

  const activeObjectPoints = visualVariant === "v2" ? v2VisualRows : skuObjectPoints;

  useEffect(() => {
    if (!activeObjectPoints.length) {
      setRouteSourceCode("");
      setRouteTargetCode("");
      return;
    }
    if (routeSourceCode && !activeObjectPoints.some((point) => point.locationCode === routeSourceCode)) {
      setRouteSourceCode("");
    }
    if (routeTargetCode && !activeObjectPoints.some((point) => point.locationCode === routeTargetCode)) {
      setRouteTargetCode("");
    }
  }, [activeObjectPoints, routeSourceCode, routeTargetCode]);

  const selectedObjectPoint = useMemo(
    () => activeObjectPoints.find((point) => point.locationCode === selectedLocationCode) || activeObjectPoints[0] || null,
    [activeObjectPoints, selectedLocationCode],
  );

  const routePoints = useMemo(() => {
    if (!activeObjectPoints.length) return [];
    if (visualVariant !== "v2") {
      return [...activeObjectPoints].sort((a, b) => String(a.locationCode).localeCompare(String(b.locationCode)));
    }

    const source = activeObjectPoints.find((point) => point.locationCode === routeSourceCode) || activeObjectPoints[0];
    const target = activeObjectPoints.find((point) => point.locationCode === routeTargetCode) || activeObjectPoints[activeObjectPoints.length - 1];

    let mids = activeObjectPoints.filter((point) => point.locationCode !== source.locationCode && point.locationCode !== target.locationCode);
    if (weightMode === "qty_high") mids.sort((a, b) => b.qty - a.qty);
    else if (weightMode === "qty_low") mids.sort((a, b) => a.qty - b.qty);
    else mids.sort((a, b) => Math.hypot(a.x - source.x, a.y - source.y) - Math.hypot(b.x - source.x, b.y - source.y));

    mids = mids.slice(0, Math.min(10, mids.length)).sort((a, b) => a.x - b.x || a.y - b.y);
    if (source.locationCode === target.locationCode) return [source, ...mids];
    return [source, ...mids, target];
  }, [activeObjectPoints, routeSourceCode, routeTargetCode, visualVariant, weightMode]);

  const routeDistance = useMemo(() => {
    if (routePoints.length < 2) return 0;
    let distance = 0;
    for (let i = 1; i < routePoints.length; i += 1) {
      const prev = routePoints[i - 1];
      const current = routePoints[i];
      distance += Math.hypot(current.x - prev.x, current.y - prev.y);
    }
    return Number(distance.toFixed(1));
  }, [routePoints]);

  const zoneObjectSummary = useMemo(() => {
    const map = {};
    activeObjectPoints.forEach((point) => {
      if (!map[point.zone]) map[point.zone] = { zone: point.zone, count: 0, qty: 0 };
      map[point.zone].count += 1;
      map[point.zone].qty += point.qty;
    });
    return Object.values(map);
  }, [activeObjectPoints]);

  const visualCells = useMemo(() => {
    if (visualVariant === "v2") {
      if (!v2VisualRows.length) return [];
      const occupied = [...v2VisualRows]
        .sort((a, b) => b.qty - a.qty)
        .slice(0, 16)
        .map((row, index) => ({
          id: `cell-v2-${row.id}`,
          locationCode: row.locationCode,
          areaCode: `${row.center}-${row.zone.replace("존", "")}`,
          qty: row.qty,
          reservedQty: row.reservedQty,
          zone: row.zone,
          intensity: getLocationIntensity(row.qty, 50),
          empty: false,
          index,
        }));

      const empty = Array.from({ length: 16 - occupied.length }, (_, index) => ({
        id: `cell-v2-empty-${index + 1}`,
        locationCode: "",
        areaCode: "",
        qty: 0,
        reservedQty: 0,
        zone: "",
        intensity: "empty",
        empty: true,
        index: occupied.length + index,
      }));
      return [...occupied, ...empty];
    }

    if (!selectedSku) return [];

    const occupied = selectedSku.locations.map((location, index) => {
      const qty = location.availableQty + location.reservedQty;
      const intensity = getLocationIntensity(qty, 10);
      const areaCode = location.locationCode.split("-").slice(0, 2).join("-");
      return {
        id: `cell-${location.id}`,
        locationCode: location.locationCode,
        areaCode,
        qty,
        reservedQty: location.reservedQty,
        zone: location.zone,
        intensity,
        empty: false,
        index,
      };
    });

    const cellCount = Math.max(12, Math.ceil(occupied.length / 4) * 4);
    const empty = Array.from({ length: cellCount - occupied.length }, (_, index) => ({
      id: `cell-empty-${index + 1}`,
      locationCode: "",
      areaCode: "",
      qty: 0,
      reservedQty: 0,
      zone: "",
      intensity: "empty",
      empty: true,
      index: occupied.length + index,
    }));

    return [...occupied, ...empty];
  }, [selectedSku, v2VisualRows, visualVariant]);

  const skuBubbleData = useMemo(() => {
    if (!selectedSku) return { datasets: [] };

    return {
      datasets: [
        {
          label: "위치별 재고",
          data: selectedSku.locations.map((location, index) => {
            const qty = location.availableQty + location.reservedQty;
            return {
              x: (index % 4) + 1,
              y: Math.floor(index / 4) + 1,
              r: Math.max(8, Math.min(30, 7 + qty * 1.7)),
              locationCode: location.locationCode,
              qty,
              reservedQty: location.reservedQty,
              zone: location.zone,
              areaCode: location.locationCode.split("-").slice(0, 2).join("-"),
            };
          }),
          backgroundColor: selectedSku.locations.map((location) => {
            const qty = location.availableQty + location.reservedQty;
            const intensity = getLocationIntensity(qty, 10);
            return intensityColor(intensity);
          }),
          borderColor: selectedSku.locations.map((location) => (location.reservedQty > 0 ? "#f08a2f" : "#ffffff")),
          borderWidth: selectedSku.locations.map((location) => (location.reservedQty > 0 ? 2 : 1)),
          hoverBorderWidth: 3,
        },
      ],
    };
  }, [selectedSku]);

  const skuLocationDoughnutData = useMemo(() => {
    if (visualVariant === "v2") {
      return {
        labels: zoneObjectSummary.map((item) => item.zone),
        datasets: [
          {
            data: zoneObjectSummary.map((item) => item.qty),
            backgroundColor: ["#4d9eff", "#7fb8ff", "#9cc8ff", "#bedcff", "#d9e8ff"],
            borderColor: "#ffffff",
            borderWidth: 2,
          },
        ],
      };
    }
    if (!selectedSku) return { labels: [], datasets: [] };
    return {
      labels: selectedSku.locations.map((location) => location.locationCode),
      datasets: [
        {
          data: selectedSku.locations.map((location) => location.availableQty + location.reservedQty),
          backgroundColor: ["#4d9eff", "#7fb8ff", "#9cc8ff", "#bedcff", "#d9e8ff"],
          borderColor: "#ffffff",
          borderWidth: 2,
        },
      ],
    };
  }, [selectedSku, visualVariant, zoneObjectSummary]);

  const slowGradeOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: "58%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: CHART_COLORS.text,
          boxWidth: 10,
          boxHeight: 10,
          font: { family: "Noto Sans KR", size: 11 },
        },
      },
      tooltip: {
        backgroundColor: "#1f2c3f",
        bodyFont: { family: "Noto Sans KR", size: 11 },
        callbacks: {
          label: (context) => `${context.label}: ${formatNumber(context.raw)} SKU`,
        },
      },
    },
  }), []);

  const agingBarOptions = useMemo(() => {
    const options = chartBaseOptions();
    return {
      ...options,
      plugins: {
        ...options.plugins,
        legend: { display: false },
      },
      scales: {
        ...options.scales,
        y: {
          ...options.scales.y,
          beginAtZero: true,
          ticks: { ...options.scales.y.ticks, precision: 0 },
        },
      },
    };
  }, []);

  const zoneRadarOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: CHART_COLORS.text,
          boxWidth: 10,
          boxHeight: 10,
          font: { family: "Noto Sans KR", size: 11 },
        },
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        suggestedMax: Math.max(...zoneHeat.map((item) => Math.max(item.count, Math.round(item.qty / 10))), 2),
        grid: { color: "#edf2f8" },
        angleLines: { color: "#edf2f8" },
        pointLabels: {
          color: CHART_COLORS.text,
          font: { family: "Noto Sans KR", size: 11 },
        },
        ticks: {
          color: CHART_COLORS.text,
          backdropColor: "transparent",
          stepSize: 2,
          font: { family: "Noto Sans KR", size: 10 },
        },
      },
    },
  }), [zoneHeat]);

  const skuBubbleOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1f2c3f",
        bodyFont: { family: "Noto Sans KR", size: 11 },
        callbacks: {
          label: (context) => {
            const row = context.raw;
            return `${row.locationCode} | 재고 ${formatNumber(row.qty)} | 예약 ${formatNumber(row.reservedQty)}`;
          },
        },
      },
    },
    scales: {
      x: {
        min: 0.4,
        max: 4.6,
        ticks: {
          stepSize: 1,
          color: CHART_COLORS.text,
          callback: (value) => `열 ${value}`,
          font: { family: "Noto Sans KR", size: 10 },
        },
        grid: { color: "#eff3f9" },
        border: { color: CHART_COLORS.line },
      },
      y: {
        min: 0.4,
        max: Math.max(Math.ceil((selectedSku?.locations?.length || 1) / 4), 1) + 0.6,
        reverse: true,
        ticks: {
          stepSize: 1,
          color: CHART_COLORS.text,
          callback: (value) => `행 ${value}`,
          font: { family: "Noto Sans KR", size: 10 },
        },
        grid: { color: "#eff3f9" },
        border: { color: CHART_COLORS.line },
      },
    },
  }), [selectedSku]);

  const skuLocationDoughnutOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: "54%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: CHART_COLORS.text,
          boxWidth: 10,
          boxHeight: 10,
          font: { family: "Noto Sans KR", size: 11 },
        },
      },
      tooltip: {
        backgroundColor: "#1f2c3f",
        bodyFont: { family: "Noto Sans KR", size: 11 },
        callbacks: {
          label: (context) => `${context.label}: ${formatNumber(context.raw)}개`,
        },
      },
    },
  }), []);

  const skuScatterData = useMemo(() => {
    if (!activeObjectPoints.length) return { datasets: [] };
    const datasets = [
      {
        type: "line",
        label: "객체 경로",
        data: routePoints.map((point) => ({ ...point, x: point.x, y: point.y })),
        borderColor: "#0f172a",
        backgroundColor: "transparent",
        borderDash: [4, 3],
        borderWidth: 1.5,
        pointRadius: 0,
        tension: 0.24,
      },
      {
        label: "로케이션 좌표",
        data: activeObjectPoints.map((point) => ({ ...point, x: point.x, y: point.y })),
        pointBackgroundColor: activeObjectPoints.map((point) => intensityColor(getLocationIntensity(point.qty, visualVariant === "v2" ? 50 : 10))),
        pointBorderColor: activeObjectPoints.map((point) => (point.reservedQty > 0 ? "#0f172a" : "#ffffff")),
        pointBorderWidth: activeObjectPoints.map((point) => (point.reservedQty > 0 ? 2 : 1)),
        pointRadius: (context) => {
          const raw = context.raw || {};
          return Math.max(6, Math.min(visualVariant === "v2" ? 11 : 13, 5 + (raw.qty || 0) * (visualVariant === "v2" ? 0.35 : 1.1)));
        },
        pointHoverRadius: (context) => {
          const raw = context.raw || {};
          return Math.max(8, Math.min(visualVariant === "v2" ? 13 : 15, 7 + (raw.qty || 0) * (visualVariant === "v2" ? 0.36 : 1.15)));
        },
      },
    ];

    if (selectedObjectPoint) {
      datasets.push({
        label: "Selected",
        data: [{ ...selectedObjectPoint, x: selectedObjectPoint.x, y: selectedObjectPoint.y }],
        pointBackgroundColor: "#16a34a",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 9,
        pointHoverRadius: 11,
      });
    }

    return {
      datasets,
    };
  }, [activeObjectPoints, routePoints, selectedObjectPoint, visualVariant]);

  const skuScatterOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    onClick: (_, elements, chart) => {
      if (!elements.length) return;
      const element = elements[0];
      const dataset = chart.data.datasets[element.datasetIndex];
      const row = dataset?.data?.[element.index] || null;
      if (!row?.locationCode) return;
      setSelectedLocationCode(row.locationCode);
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1f2c3f",
        bodyFont: { family: "Noto Sans KR", size: 11 },
        callbacks: {
          label: (context) => {
            const row = context.raw || {};
            return `${row.locationCode} | ${row.zone} | 가용 ${formatNumber(row.availableQty)} | 예약 ${formatNumber(row.reservedQty)}`;
          },
        },
      },
    },
    scales: {
      x: {
        min: 0.5,
        max: Math.max(...activeObjectPoints.map((point) => point.x), 5.2) + 0.8,
        grid: { color: "#eef3f9" },
        border: { color: CHART_COLORS.line },
        ticks: {
          stepSize: 1,
          color: CHART_COLORS.text,
          callback: (value) => (visualVariant === "v2" ? `Grid ${value}` : `축 ${value}`),
          font: { family: "Noto Sans KR", size: 10 },
        },
      },
      y: {
        min: 0.5,
        max: Math.max(...activeObjectPoints.map((point) => point.y), 2) + 0.8,
        reverse: true,
        grid: { color: "#eef3f9" },
        border: { color: CHART_COLORS.line },
        ticks: {
          stepSize: 1,
          color: CHART_COLORS.text,
          callback: (value) => (visualVariant === "v2" ? `Lane ${value}` : `라인 ${value}`),
          font: { family: "Noto Sans KR", size: 10 },
        },
      },
    },
  }), [activeObjectPoints, visualVariant]);

  const skuFlowLineData = useMemo(() => {
    if (!routePoints.length) return { labels: [], datasets: [] };
    return {
      labels: routePoints.map((point) => point.locationCode),
      datasets: [
        {
          label: "가용 재고",
          data: routePoints.map((point) => point.availableQty),
          borderColor: "#2486f9",
          backgroundColor: "rgba(36, 134, 249, 0.16)",
          fill: true,
          tension: 0.35,
          pointRadius: 2.5,
        },
        {
          label: "예약 재고",
          data: routePoints.map((point) => point.reservedQty),
          borderColor: "#f2a341",
          backgroundColor: "rgba(242, 163, 65, 0.14)",
          fill: true,
          tension: 0.35,
          pointRadius: 2.5,
        },
      ],
    };
  }, [routePoints]);

  const skuFlowLineOptions = useMemo(() => {
    const options = chartBaseOptions();
    return {
      ...options,
      scales: {
        ...options.scales,
        x: {
          ...options.scales.x,
          ticks: { ...options.scales.x.ticks, maxRotation: 0, minRotation: 0, autoSkip: true, maxTicksLimit: 6 },
        },
        y: {
          ...options.scales.y,
          beginAtZero: true,
          ticks: { ...options.scales.y.ticks, precision: 0 },
        },
      },
    };
  }, []);

  const handleReset = () => {
    setFilters({
      owner: "ALL",
      center: "A센터",
      zone: "ALL",
      daysNoOutbound: "30",
      daysSinceInbound: "30",
      minStock: "1",
      season: "봄",
      brand: "ALL",
      query: "",
    });
    setViewMode("list");
    setSelectedLocationCode("");
    setRouteSourceCode("");
    setRouteTargetCode("");
    setWeightMode("qty_high");
    showToast("필터를 초기화했습니다.");
  };

  return (
    <SidebarLayout title={menuTitle}>
      <div className="nw-page-head">
        <div>
          <h2>{pageTitle}</h2>
          <p>{pageDescription}</p>
        </div>
      </div>

      <section className="nw-panel">
        <div className="nw-inline-filter">
          <select value={filters.center} onChange={(event) => setFilters((prev) => ({ ...prev, center: event.target.value }))}>
            {CENTER_OPTIONS.filter((option) => option !== "ALL").map((option) => <option key={option}>{option}</option>)}
          </select>
          <input
            type="text"
            value={filters.query}
            onChange={(event) => setFilters((prev) => ({ ...prev, query: event.target.value }))}
            placeholder="상품명, 바코드, 위치 코드"
          />
          <button type="button" className="nw-btn primary" onClick={() => showToast(`검색 결과 ${formatNumber(filteredRows.length)}건`)}>검색</button>
          <button type="button" className={`nw-icon-btn ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")} title="목록 보기">☷</button>
          <button type="button" className={`nw-icon-btn ${viewMode === "visual" ? "active" : ""}`} onClick={() => setViewMode("visual")} title="시각화 보기">⊞</button>
        </div>

        <div className="nw-filter-grid slow">
          <label>
            화주사
            <select value={filters.owner} onChange={(event) => setFilters((prev) => ({ ...prev, owner: event.target.value }))}>
              {OWNER_OPTIONS.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label>
            구역(존)
            <select value={filters.zone} onChange={(event) => setFilters((prev) => ({ ...prev, zone: event.target.value }))}>
              {ZONE_OPTIONS.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label>
            미출고 일수
            <input type="number" min="0" value={filters.daysNoOutbound} onChange={(event) => setFilters((prev) => ({ ...prev, daysNoOutbound: event.target.value }))} />
          </label>
          <label>
            마지막 입고일수
            <input type="number" min="0" value={filters.daysSinceInbound} onChange={(event) => setFilters((prev) => ({ ...prev, daysSinceInbound: event.target.value }))} />
          </label>
          <label>
            최소 재고
            <input type="number" min="0" value={filters.minStock} onChange={(event) => setFilters((prev) => ({ ...prev, minStock: event.target.value }))} />
          </label>
          <label>
            시즌
            <select value={filters.season} onChange={(event) => setFilters((prev) => ({ ...prev, season: event.target.value }))}>
              {SEASON_OPTIONS.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label>
            브랜드
            <select value={filters.brand} onChange={(event) => setFilters((prev) => ({ ...prev, brand: event.target.value }))}>
              <option>ALL</option>
              {[...new Set(SLOW_MOVING_SKUS.map((sku) => sku.brand))].map((brand) => <option key={brand}>{brand}</option>)}
            </select>
          </label>
        </div>

        <div className="nw-helper-text">
          미출고 일수/마지막 입고 일수/최소 재고는 SKU 단위로 필터링하고, 결과는 위치 단위로 출력됩니다.
        </div>

        <div className="nw-panel-actions">
          <button type="button" className="nw-btn primary" onClick={() => showToast(`검색 결과 ${formatNumber(filteredRows.length)}건`)}>추출</button>
          <button type="button" className="nw-btn" onClick={() => showToast("엑셀 다운로드를 시작합니다 (데모)")}>엑셀 다운로드</button>
          <button type="button" className="nw-btn" onClick={handleReset}>새로 검색</button>
        </div>
      </section>

      <section className="nw-summary-grid three">
        <article className="nw-summary-card">
          <div className="label">위치 행 수</div>
          <strong>{formatNumber(filteredRows.length)}</strong>
          <span>필터 조건 기준</span>
        </article>
        <article className="nw-summary-card">
          <div className="label">고유 SKU 수</div>
          <strong>{formatNumber(summary.skuCount)}</strong>
          <span>SKU 단위 필터 적용</span>
        </article>
        <article className="nw-summary-card">
          <div className="label">가용 / 예약</div>
          <strong>{formatNumber(summary.totalAvailable)} / {formatNumber(summary.totalReserved)}</strong>
          <span>위치별 수량 합계</span>
        </article>
      </section>

      <section className="nw-chart-grid slow">
        <ChartPanel title="부진 등급 분포" helper="미출고 일수 기준">
          <Doughnut data={gradeDoughnutData} options={slowGradeOptions} />
        </ChartPanel>

        <ChartPanel title="체류 기간 분포" helper="SKU 수">
          <Bar data={agingBarData} options={agingBarOptions} />
        </ChartPanel>

        <ChartPanel title="존별 점유 레이더" helper="위치 행 수 + 재고 수량(10단위)">
          <Radar data={zoneRadarData} options={zoneRadarOptions} />
        </ChartPanel>
      </section>

      {viewMode === "list" ? (
        <section className="nw-panel">
          <div className="nw-panel-title-row">
            <h3>추출 결과</h3>
            <div className="nw-helper-text">
              {visualVariant === "v2" ? "필터 전체 데이터를 목록/시각화로 전환합니다. (행 클릭 시 선택 강조)" : "행 선택 후 상단 목록/시각화 버튼으로 전환합니다."}
            </div>
          </div>

          <div className="nw-table-wrap">
            <table className="nw-table">
              <thead>
                <tr>
                  <th>화주사</th>
                  <th>상품명</th>
                  <th>옵션명</th>
                  <th>위치</th>
                  <th>시즌</th>
                  <th>최근 입고일</th>
                  <th>최근 출고일</th>
                  <th>재고수량</th>
                  <th>예약 재고</th>
                  <th>SKU 합계</th>
                  <th>위치 비중</th>
                  <th>부진 등급</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => (
                  <tr
                    key={row.rowId}
                    className={selectedLocationCode === row.locationCode ? "selected-row" : ""}
                    onClick={() => {
                      setSelectedLocationCode(row.locationCode);
                      setSelectedSkuId(row.skuId);
                    }}
                  >
                    <td>{row.owner}</td>
                    <td>{row.productName}</td>
                    <td>{row.optionName}</td>
                    <td>
                      <span className="nw-zone-chip">{row.zone}</span>
                      {row.locationCode}
                    </td>
                    <td><span className="nw-season-chip">{row.season}</span></td>
                    <td>{row.lastInboundDate}</td>
                    <td>{row.lastOutboundDate}</td>
                    <td>{formatNumber(row.availableQty)}</td>
                    <td>{formatNumber(row.reservedQty)}</td>
                    <td>{formatNumber(row.skuTotalQty)}</td>
                    <td>{row.locationRatio.toFixed(1)}%</td>
                    <td><span className={`nw-grade-badge ${row.grade.className}`}>{row.grade.label}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!filteredRows.length ? <div className="nw-empty">조회 조건에 해당하는 부진재고가 없습니다.</div> : null}
        </section>
      ) : (
        <section className="nw-panel">
          <div className="nw-panel-title-row">
            <h3>2D 시각화 뷰 (적치이력)</h3>
            <div className="nw-btn-row">
              <button type="button" className="nw-btn" onClick={() => setViewMode("list")}>리스트로 돌아가기</button>
              <button
                type="button"
                className="nw-btn"
                onClick={() => showToast(visualVariant === "v2" ? "전체 시각화 대상 엑셀 다운로드 (데모)" : "선택 SKU 엑셀 다운로드 (데모)")}
              >
                {visualVariant === "v2" ? "엑셀 다운로드 (전체)" : "엑셀 다운로드 (이 상품)"}
              </button>
            </div>
          </div>

          {(visualVariant === "v2" ? filteredRows.length > 0 : Boolean(selectedSku)) ? (
            <>
              {visualVariant === "v2" ? (
                <div className="nw-visual-meta">
                  <div><span>센터</span><strong>{filters.center}</strong></div>
                  <div><span>고유 SKU 수</span><strong>{formatNumber(summary.skuCount)}개</strong></div>
                  <div><span>위치 수</span><strong>{formatNumber(filteredRows.length)}개</strong></div>
                  <div><span>총 재고(가용/예약)</span><strong>{formatNumber(summary.totalAvailable)} / {formatNumber(summary.totalReserved)}</strong></div>
                </div>
              ) : (
                <div className="nw-visual-meta">
                  <div><span>화주사</span><strong>{selectedSku.owner}</strong></div>
                  <div><span>상품명</span><strong>{selectedSku.productName}</strong></div>
                  <div><span>위치</span><strong>{selectedSku.locations.map((location) => location.locationCode).join(", ")}</strong></div>
                  <div><span>재고 수량</span><strong>{formatNumber(selectedSku.locations.reduce((sum, location) => sum + location.availableQty + location.reservedQty, 0))}개</strong></div>
                </div>
              )}

              {visualVariant === "v2" ? (
                <>
                  <div className="nw-visual-banner alt">부진재고2 시각화: 동일 데이터 + 다른 차트/2D 배치</div>
                  <section className="nw-chart-grid split v2-object-layout">
                    <ChartPanel title="2D 위치 스캐터 맵" helper="점 크기=재고량, 테두리=예약 존재">
                      <Scatter data={skuScatterData} options={skuScatterOptions} />
                    </ChartPanel>

                    <div className="nw-v2-side-stack">
                      <section className="nw-v2-side-card">
                        <h4>Selected</h4>
                        <div className="line"><span>로케이션</span><strong>{selectedObjectPoint?.locationCode || "-"}</strong></div>
                        <div className="line"><span>구역</span><strong>{selectedObjectPoint?.zone || "-"}</strong></div>
                        <div className="line"><span>가용/예약</span><strong>{formatNumber(selectedObjectPoint?.availableQty || 0)} / {formatNumber(selectedObjectPoint?.reservedQty || 0)}</strong></div>
                      </section>

                      <section className="nw-v2-side-card">
                        <h4>Routing</h4>
                        <div className="nw-btn-row">
                          <button
                            type="button"
                            className="nw-btn tiny"
                            onClick={() => {
                              if (!selectedObjectPoint) return;
                              setRouteSourceCode(selectedObjectPoint.locationCode);
                              showToast(`출발지 지정: ${selectedObjectPoint.locationCode}`);
                            }}
                          >
                            출발지 지정
                          </button>
                          <button
                            type="button"
                            className="nw-btn tiny"
                            onClick={() => {
                              if (!selectedObjectPoint) return;
                              setRouteTargetCode(selectedObjectPoint.locationCode);
                              showToast(`도착지 지정: ${selectedObjectPoint.locationCode}`);
                            }}
                          >
                            도착지 지정
                          </button>
                        </div>
                        <div className="nw-btn-row">
                          <button type="button" className={`nw-btn tiny ${weightMode === "none" ? "active" : ""}`} onClick={() => setWeightMode("none")}>없음</button>
                          <button type="button" className={`nw-btn tiny ${weightMode === "qty_high" ? "active" : ""}`} onClick={() => setWeightMode("qty_high")}>수량 우선</button>
                          <button type="button" className={`nw-btn tiny ${weightMode === "qty_low" ? "active" : ""}`} onClick={() => setWeightMode("qty_low")}>소량 우선</button>
                        </div>
                        <div className="line"><span>출발지</span><strong>{routeSourceCode || routePoints[0]?.locationCode || "-"}</strong></div>
                        <div className="line"><span>도착지</span><strong>{routeTargetCode || routePoints[routePoints.length - 1]?.locationCode || "-"}</strong></div>
                        <div className="line"><span>경로 포인트</span><strong>{formatNumber(routePoints.length)}개</strong></div>
                        <div className="line"><span>예상 거리</span><strong>{routeDistance}m</strong></div>
                      </section>

                      <section className="nw-v2-side-card">
                        <h4>Floors / Group</h4>
                        <div className="nw-chip-wrap">
                          <button
                            type="button"
                            className={`nw-chip ${filters.zone === "ALL" ? "active" : ""}`}
                            onClick={() => setFilters((prev) => ({ ...prev, zone: "ALL" }))}
                          >
                            {filters.center}
                          </button>
                          {zoneObjectSummary.map((item) => (
                            <button
                              key={item.zone}
                              type="button"
                              className={`nw-chip ${filters.zone === item.zone ? "active" : ""}`}
                              onClick={() => setFilters((prev) => ({ ...prev, zone: prev.zone === item.zone ? "ALL" : item.zone }))}
                            >
                              {item.zone} {item.count}
                            </button>
                          ))}
                        </div>
                        <div className="foot">Locations: {formatNumber(activeObjectPoints.length)}개</div>
                      </section>
                    </div>
                  </section>

                  <section className="nw-chart-grid split">
                    <ChartPanel title="위치별 수량 흐름" helper="가용/예약 라인 비교">
                      <Line data={skuFlowLineData} options={skuFlowLineOptions} />
                    </ChartPanel>

                    <ChartPanel title="위치별 재고 비중" helper="필터 전체 존 분포">
                      <Doughnut data={skuLocationDoughnutData} options={skuLocationDoughnutOptions} />
                    </ChartPanel>
                  </section>

                  <div className="nw-2d-matrix">
                    {visualCells.map((cell) => {
                      if (cell.empty) return <div key={cell.id} className="nw-2d-cell empty" />;
                      const fillRate = Math.max(0, Math.min(100, (cell.qty / (visualVariant === "v2" ? 50 : 10)) * 100));
                      return (
                        <button
                          key={cell.id}
                          type="button"
                          className={`nw-2d-cell ${cell.intensity} ${selectedLocationCode === cell.locationCode ? "active" : ""}`}
                          onClick={() => setSelectedLocationCode(cell.locationCode)}
                        >
                          <div className="head">
                            <span>{cell.areaCode}</span>
                            <strong>{formatNumber(cell.qty)}개</strong>
                          </div>
                          <div className="code">{cell.locationCode}</div>
                          <div className="sub">{cell.zone}</div>
                          <div className="nw-mini-fill">
                            <i style={{ width: `${fillRate}%` }} />
                          </div>
                          <div className="sub">예약 {formatNumber(cell.reservedQty)}개</div>
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  <div className="nw-visual-banner">원아이 개발 진행 중 - 간단 2D 버전</div>
                  <section className="nw-chart-grid split">
                    <ChartPanel title="2D 위치 버블 맵" helper="버블 크기=재고, 테두리=예약 존재">
                      <Bubble data={skuBubbleData} options={skuBubbleOptions} />
                    </ChartPanel>

                    <ChartPanel title="위치별 재고 비중" helper="SKU 내부 분포">
                      <Doughnut data={skuLocationDoughnutData} options={skuLocationDoughnutOptions} />
                    </ChartPanel>
                  </section>

                  <div className="nw-lane-board">
                    {visualCells.map((cell) => {
                      if (cell.empty) return <div key={cell.id} className="nw-lane-cell empty" />;
                      return (
                        <div key={cell.id} className={`nw-lane-cell ${cell.intensity}`}>
                          <div className="top">
                            <span>{cell.areaCode}</span>
                            <strong>{formatNumber(cell.qty)}</strong>
                          </div>
                          <div className="code">{cell.locationCode}</div>
                          <div className="meta">{cell.zone}{cell.reservedQty > 0 ? ` · 예약 ${formatNumber(cell.reservedQty)}` : ""}</div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              <div className="nw-table-wrap">
                <table className="nw-table compact">
                  <thead>
                    <tr>
                      <th>화주사</th>
                      <th>상품명</th>
                      <th>위치</th>
                      <th>재고 수량</th>
                    </tr>
                      </thead>
                      <tbody>
                        {visualVariant === "v2"
                          ? filteredRows.slice(0, 30).map((row) => (
                            <tr key={row.rowId}>
                              <td>{row.owner}</td>
                              <td>{row.productName}</td>
                              <td>{row.locationCode}</td>
                              <td>{formatNumber(row.availableQty + row.reservedQty)}</td>
                            </tr>
                          ))
                          : selectedSku.locations.map((location) => (
                            <tr key={`${selectedSku.id}-${location.id}`}>
                              <td>{selectedSku.owner}</td>
                              <td>{selectedSku.productName}</td>
                              <td>{location.locationCode}</td>
                              <td>{formatNumber(location.availableQty + location.reservedQty)}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="nw-empty">{visualVariant === "v2" ? "시각화할 데이터가 없습니다." : "시각화할 SKU가 없습니다."}</div>
              )}
        </section>
      )}

      <GlobalToast message={toast} />
    </SidebarLayout>
  );
}

function SlowMoving2Page() {
  return (
    <SlowMovingBasePage
      menuTitle="부진재고2"
      pageTitle="부진재고"
      pageDescription="부진재고 복사판 - 시각화 방식만 다르게 구성"
      visualVariant="v2"
    />
  );
}

function SlowMovingPage() {
  return <SlowMovingBasePage />;
}

function LocationStockPage() {
  const { toast, showToast } = useToast();
  const [filters, setFilters] = useState({
    owner: "ALL",
    center: "ALL",
    zone: "ALL",
    area: "ALL",
    query: "",
    minStock: "",
    maxStock: "",
    minAvailable: "",
    maxAvailable: "",
    minReserved: "",
    maxReserved: "",
    minUtil: "",
    maxUtil: "",
  });
  const [viewMode, setViewMode] = useState("list");
  const [sortType, setSortType] = useState("기본");
  const [focusLocationId, setFocusLocationId] = useState("");

  const sourceRows = useMemo(
    () =>
      LOCATION_STOCK_ROWS.map((row) => ({
        ...row,
        areaCode: getAreaFromLocationCode(row.locationCode),
        util: row.capacity > 0 ? (row.stock / row.capacity) * 100 : 0,
      })),
    [],
  );

  const areaOptions = useMemo(() => {
    const list = sourceRows
      .filter((row) => (filters.center === "ALL" || row.center === filters.center) && (filters.zone === "ALL" || row.zone === filters.zone))
      .map((row) => row.areaCode);
    return ["ALL", ...new Set(list)];
  }, [sourceRows, filters.center, filters.zone]);

  useEffect(() => {
    if (filters.area !== "ALL" && !areaOptions.includes(filters.area)) {
      setFilters((prev) => ({ ...prev, area: "ALL" }));
    }
  }, [areaOptions, filters.area]);

  const filteredRows = useMemo(
    () => sourceRows.filter((row) => {
      const query = filters.query.trim().toLowerCase();
      const target = `${row.locationCode} ${row.areaCode} ${row.center} ${row.zone} ${row.owner}`.toLowerCase();
      if (filters.owner !== "ALL" && row.owner !== filters.owner) return false;
      if (filters.center !== "ALL" && row.center !== filters.center) return false;
      if (filters.zone !== "ALL" && row.zone !== filters.zone) return false;
      if (filters.area !== "ALL" && row.areaCode !== filters.area) return false;
      if (query && !target.includes(query)) return false;
      if (filters.minStock !== "" && row.stock < toNumber(filters.minStock)) return false;
      if (filters.maxStock !== "" && row.stock > toNumber(filters.maxStock)) return false;
      if (filters.minAvailable !== "" && row.available < toNumber(filters.minAvailable)) return false;
      if (filters.maxAvailable !== "" && row.available > toNumber(filters.maxAvailable)) return false;
      if (filters.minReserved !== "" && row.reserved < toNumber(filters.minReserved)) return false;
      if (filters.maxReserved !== "" && row.reserved > toNumber(filters.maxReserved)) return false;
      if (filters.minUtil !== "" && row.util < toNumber(filters.minUtil)) return false;
      if (filters.maxUtil !== "" && row.util > toNumber(filters.maxUtil)) return false;
      return true;
    }),
    [filters, sourceRows],
  );

  const summary = useMemo(() => {
    const total = filteredRows.reduce((sum, row) => sum + row.stock, 0);
    const available = filteredRows.reduce((sum, row) => sum + row.available, 0);
    const reserved = filteredRows.reduce((sum, row) => sum + row.reserved, 0);
    const locationCount = filteredRows.length;
    const avgUtil = locationCount
      ? filteredRows.reduce((sum, row) => sum + row.util, 0) / locationCount
      : 0;
    return { total, available, reserved, locationCount, avgUtil };
  }, [filteredRows]);

  const centerSummary = useMemo(() => {
    const map = {};
    filteredRows.forEach((row) => {
      if (!map[row.center]) map[row.center] = { center: row.center, total: 0, reserved: 0, count: 0 };
      map[row.center].total += row.stock;
      map[row.center].reserved += row.reserved;
      map[row.center].count += 1;
    });
    return Object.values(map);
  }, [filteredRows]);

  const utilDistribution = useMemo(() => {
    const source = [
      { label: "0%", min: 0, max: 0, value: 0 },
      { label: "1~30%", min: 0.01, max: 30, value: 0 },
      { label: "31~60%", min: 30.01, max: 60, value: 0 },
      { label: "61~90%", min: 60.01, max: 90, value: 0 },
      { label: "91~100%", min: 90.01, max: 100, value: 0 },
    ];

    filteredRows.forEach((row) => {
      const bucket = source.find((item) => row.util >= item.min && row.util <= item.max);
      if (bucket) bucket.value += 1;
    });

    return source;
  }, [filteredRows]);

  const hotSpots = useMemo(() => [...filteredRows]
    .sort((a, b) => b.util - a.util)
    .slice(0, 5), [filteredRows]);

  const centerStackData = useMemo(() => ({
    labels: centerSummary.map((item) => item.center),
    datasets: [
      {
        label: "즉시출고 가능",
        data: centerSummary.map((item) => Math.max(item.total - item.reserved, 0)),
        backgroundColor: CHART_COLORS.blue,
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: "보류",
        data: centerSummary.map((item) => item.reserved),
        backgroundColor: CHART_COLORS.amber,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  }), [centerSummary]);

  const utilDistributionData = useMemo(() => ({
    labels: utilDistribution.map((item) => item.label),
    datasets: [
      {
        label: "위치 수",
        data: utilDistribution.map((item) => item.value),
        backgroundColor: ["#f0f4fa", "#dbeaff", "#b8d6ff", "#86b8ff", "#4a99ff"],
        borderWidth: 0,
      },
    ],
  }), [utilDistribution]);

  const hotspotLineData = useMemo(() => ({
    labels: hotSpots.map((item) => item.locationCode),
    datasets: [
      {
        label: "점유율(%)",
        data: hotSpots.map((item) => Number(item.util.toFixed(1))),
        borderColor: CHART_COLORS.red,
        backgroundColor: "rgba(224, 75, 75, 0.16)",
        pointRadius: 3,
        fill: true,
        tension: 0.3,
      },
      {
        label: "예약 수량",
        data: hotSpots.map((item) => item.reserved),
        borderColor: CHART_COLORS.amber,
        backgroundColor: "rgba(242, 163, 65, 0.16)",
        pointRadius: 3,
        fill: true,
        tension: 0.3,
      },
    ],
  }), [hotSpots]);

  const zoneUtilSummary = useMemo(() => {
    const map = {};
    filteredRows.forEach((row) => {
      if (!map[row.zone]) map[row.zone] = { zone: row.zone, utilTotal: 0, available: 0, count: 0 };
      map[row.zone].utilTotal += row.util;
      map[row.zone].available += row.available;
      map[row.zone].count += 1;
    });
    return Object.values(map).map((item) => ({
      ...item,
      avgUtil: item.count ? item.utilTotal / item.count : 0,
    }));
  }, [filteredRows]);

  const areaSummary = useMemo(() => {
    const map = {};
    filteredRows.forEach((row) => {
      if (!map[row.areaCode]) {
        map[row.areaCode] = {
          areaCode: row.areaCode,
          available: 0,
          reserved: 0,
          stock: 0,
          count: 0,
        };
      }
      map[row.areaCode].available += row.available;
      map[row.areaCode].reserved += row.reserved;
      map[row.areaCode].stock += row.stock;
      map[row.areaCode].count += 1;
    });
    return Object.values(map).sort((a, b) => b.stock - a.stock).slice(0, 8);
  }, [filteredRows]);

  const ownerSummary = useMemo(() => {
    const map = {};
    filteredRows.forEach((row) => {
      if (!map[row.owner]) {
        map[row.owner] = {
          owner: row.owner,
          utilTotal: 0,
          stock: 0,
          reserved: 0,
          count: 0,
        };
      }
      map[row.owner].utilTotal += row.util;
      map[row.owner].stock += row.stock;
      map[row.owner].reserved += row.reserved;
      map[row.owner].count += 1;
    });
    return Object.values(map).map((item) => ({
      ...item,
      avgUtil: item.count ? item.utilTotal / item.count : 0,
      reservedRatio: item.stock > 0 ? (item.reserved / item.stock) * 100 : 0,
    }));
  }, [filteredRows]);

  const zoneUtilBarData = useMemo(() => ({
    labels: zoneUtilSummary.map((item) => item.zone),
    datasets: [
      {
        label: "평균 공간 점유율(%)",
        data: zoneUtilSummary.map((item) => Number(item.avgUtil.toFixed(1))),
        backgroundColor: "#6ab3ff",
        borderRadius: 6,
        yAxisID: "y",
      },
      {
        label: "즉시출고 가능 수량",
        data: zoneUtilSummary.map((item) => item.available),
        backgroundColor: "#27a36a",
        borderRadius: 6,
        yAxisID: "y1",
      },
    ],
  }), [zoneUtilSummary]);

  const areaStackData = useMemo(() => ({
    labels: areaSummary.map((item) => item.areaCode),
    datasets: [
      {
        label: "즉시출고 가능",
        data: areaSummary.map((item) => item.available),
        backgroundColor: "#3f94ff",
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: "보류",
        data: areaSummary.map((item) => item.reserved),
        backgroundColor: "#f3a44d",
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  }), [areaSummary]);

  const ownerRadarData = useMemo(() => ({
    labels: ownerSummary.map((item) => item.owner),
    datasets: [
      {
        label: "평균 공간 점유율(%)",
        data: ownerSummary.map((item) => Number(item.avgUtil.toFixed(1))),
        borderColor: CHART_COLORS.blue,
        backgroundColor: "rgba(36, 134, 249, 0.16)",
        pointBackgroundColor: CHART_COLORS.blue,
      },
      {
        label: "보류 비율(%)",
        data: ownerSummary.map((item) => Number(item.reservedRatio.toFixed(1))),
        borderColor: CHART_COLORS.amber,
        backgroundColor: "rgba(242, 163, 65, 0.14)",
        pointBackgroundColor: CHART_COLORS.amber,
      },
    ],
  }), [ownerSummary]);

  const visualRows = useMemo(() => {
    const sorted = [...filteredRows];
    if (sortType === "수량 높은순") sorted.sort((a, b) => b.stock - a.stock);
    else if (sortType === "수량 낮은순") sorted.sort((a, b) => a.stock - b.stock);
    else sorted.sort((a, b) => String(a.locationCode).localeCompare(String(b.locationCode)));
    return sorted;
  }, [filteredRows, sortType]);

  const groupedVisualRows = useMemo(() => {
    const groups = {};
    visualRows.forEach((row) => {
      if (!groups[row.center]) groups[row.center] = [];
      groups[row.center].push(row);
    });
    return groups;
  }, [visualRows]);

  const centerStackOptions = useMemo(() => {
    const options = chartBaseOptions();
    return {
      ...options,
      plugins: {
        ...options.plugins,
        legend: {
          ...options.plugins.legend,
          position: "bottom",
        },
      },
      scales: {
        x: {
          ...options.scales.x,
          stacked: true,
        },
        y: {
          ...options.scales.y,
          stacked: true,
          beginAtZero: true,
          ticks: { ...options.scales.y.ticks, precision: 0 },
        },
      },
    };
  }, []);

  const utilDistributionOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: "56%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: CHART_COLORS.text,
          boxWidth: 10,
          boxHeight: 10,
          font: { family: "Noto Sans KR", size: 11 },
        },
      },
      tooltip: {
        backgroundColor: "#1f2c3f",
        bodyFont: { family: "Noto Sans KR", size: 11 },
        callbacks: {
          label: (context) => `${context.label}: ${formatNumber(context.raw)}개 위치`,
        },
      },
    },
  }), []);

  const hotspotLineOptions = useMemo(() => {
    const options = chartBaseOptions();
    return {
      ...options,
      plugins: {
        ...options.plugins,
        legend: { ...options.plugins.legend, position: "bottom" },
      },
      scales: {
        x: {
          ...options.scales.x,
          ticks: {
            ...options.scales.x.ticks,
            maxRotation: 0,
            autoSkip: false,
          },
        },
        y: {
          ...options.scales.y,
          beginAtZero: true,
        },
      },
    };
  }, []);

  const zoneUtilBarOptions = useMemo(() => {
    const options = chartBaseOptions();
    return {
      ...options,
      scales: {
        ...options.scales,
        y: {
          ...options.scales.y,
          beginAtZero: true,
          title: { display: true, text: "공간 점유율(%)", color: CHART_COLORS.text, font: { family: "Noto Sans KR", size: 11 } },
        },
        y1: {
          beginAtZero: true,
          position: "right",
          grid: { drawOnChartArea: false, color: "#f2f5fa" },
          ticks: { color: CHART_COLORS.text, font: { family: "Noto Sans KR", size: 11 } },
          border: { color: CHART_COLORS.line },
          title: { display: true, text: "즉시출고 가능 수량", color: CHART_COLORS.text, font: { family: "Noto Sans KR", size: 11 } },
        },
      },
    };
  }, []);

  const areaStackOptions = useMemo(() => {
    const options = chartBaseOptions();
    return {
      ...options,
      scales: {
        x: {
          ...options.scales.x,
          stacked: true,
          ticks: { ...options.scales.x.ticks, autoSkip: false },
        },
        y: {
          ...options.scales.y,
          stacked: true,
          beginAtZero: true,
          ticks: { ...options.scales.y.ticks, precision: 0 },
        },
      },
    };
  }, []);

  const ownerRadarOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: CHART_COLORS.text,
          boxWidth: 10,
          boxHeight: 10,
          font: { family: "Noto Sans KR", size: 11 },
        },
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        suggestedMax: 100,
        grid: { color: "#edf2f8" },
        angleLines: { color: "#edf2f8" },
        pointLabels: {
          color: CHART_COLORS.text,
          font: { family: "Noto Sans KR", size: 11 },
        },
        ticks: {
          color: CHART_COLORS.text,
          backdropColor: "transparent",
          stepSize: 20,
          font: { family: "Noto Sans KR", size: 10 },
        },
      },
    },
  }), []);

  const focusLocation = filteredRows.find((row) => row.id === focusLocationId) || null;

  const resetFilters = () => {
    setFilters({
      owner: "ALL",
      center: "ALL",
      zone: "ALL",
      area: "ALL",
      query: "",
      minStock: "",
      maxStock: "",
      minAvailable: "",
      maxAvailable: "",
      minReserved: "",
      maxReserved: "",
      minUtil: "",
      maxUtil: "",
    });
    setViewMode("list");
    setSortType("기본");
    showToast("필터를 초기화했습니다.");
  };

  return (
    <SidebarLayout title="위치별 재고 현황">
      <div className="nw-page-head">
        <div>
          <h2>위치별 재고</h2>
          <p>리스트 뷰와 2D 시각화 뷰를 전환해 위치 점유 현황을 확인합니다.</p>
        </div>
      </div>

      <section className="nw-panel">
        <div className="nw-inline-filter">
          <select value={filters.owner} onChange={(event) => setFilters((prev) => ({ ...prev, owner: event.target.value }))}>
            {OWNER_OPTIONS.map((option) => <option key={option}>{option}</option>)}
          </select>
          <input
            type="text"
            value={filters.query}
            onChange={(event) => setFilters((prev) => ({ ...prev, query: event.target.value }))}
            placeholder="로케이션 코드 또는 구역 검색"
          />
          <button type="button" className="nw-btn primary" onClick={() => showToast(`조회 결과 ${formatNumber(filteredRows.length)}건`)}>검색</button>
          <button type="button" className={`nw-icon-btn ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")}>☷</button>
          <button type="button" className={`nw-icon-btn ${viewMode === "visual" ? "active" : ""}`} onClick={() => setViewMode("visual")}>⊞</button>
        </div>

        <div className="nw-filter-grid location">
          <label>
            물류센터
            <select value={filters.center} onChange={(event) => setFilters((prev) => ({ ...prev, center: event.target.value }))}>
              {CENTER_OPTIONS.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label>
            작업 존
            <select value={filters.zone} onChange={(event) => setFilters((prev) => ({ ...prev, zone: event.target.value }))}>
              {ZONE_OPTIONS.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label>
            랙 구역
            <select value={filters.area} onChange={(event) => setFilters((prev) => ({ ...prev, area: event.target.value }))}>
              {areaOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label>
            보관 수량(최소)
            <input type="number" value={filters.minStock} onChange={(event) => setFilters((prev) => ({ ...prev, minStock: event.target.value }))} />
          </label>
          <label>
            보관 수량(최대)
            <input type="number" value={filters.maxStock} onChange={(event) => setFilters((prev) => ({ ...prev, maxStock: event.target.value }))} />
          </label>
          <label>
            즉시출고 가능 수량(최소)
            <input type="number" value={filters.minAvailable} onChange={(event) => setFilters((prev) => ({ ...prev, minAvailable: event.target.value }))} />
          </label>
          <label>
            즉시출고 가능 수량(최대)
            <input type="number" value={filters.maxAvailable} onChange={(event) => setFilters((prev) => ({ ...prev, maxAvailable: event.target.value }))} />
          </label>
          <label>
            보류 수량(최소)
            <input type="number" value={filters.minReserved} onChange={(event) => setFilters((prev) => ({ ...prev, minReserved: event.target.value }))} />
          </label>
          <label>
            보류 수량(최대)
            <input type="number" value={filters.maxReserved} onChange={(event) => setFilters((prev) => ({ ...prev, maxReserved: event.target.value }))} />
          </label>
          <label>
            공간 점유율(최소 %)
            <input type="number" value={filters.minUtil} onChange={(event) => setFilters((prev) => ({ ...prev, minUtil: event.target.value }))} />
          </label>
          <label>
            공간 점유율(최대 %)
            <input type="number" value={filters.maxUtil} onChange={(event) => setFilters((prev) => ({ ...prev, maxUtil: event.target.value }))} />
          </label>
        </div>

        <div className="nw-panel-actions">
          <button type="button" className="nw-btn" onClick={() => showToast("엑셀 다운로드를 시작합니다 (데모)")}>엑셀 다운로드</button>
          <button type="button" className="nw-btn" onClick={() => showToast("재고조사 화면으로 이동합니다")}>재고조사 이동</button>
          <button type="button" className="nw-btn" onClick={resetFilters}>초기화</button>
        </div>
      </section>

      <section className="nw-summary-grid location-kpi">
        <article className="nw-summary-card">
          <div className="label">합계 재고</div>
          <strong>{formatNumber(summary.total)}</strong>
          <span>전체 조건 기준</span>
        </article>
        <article className="nw-summary-card">
          <div className="label">즉시출고 가능</div>
          <strong>{formatNumber(summary.available)}</strong>
          <span>가용 재고 합산</span>
        </article>
        <article className="nw-summary-card warn">
          <div className="label">보류 수량</div>
          <strong>{formatNumber(summary.reserved)}</strong>
          <span>합계 대비 비중 {summary.total ? `${Math.round((summary.reserved / summary.total) * 100)}%` : "0%"}</span>
        </article>
        <article className="nw-summary-card">
          <div className="label">위치 수 / 평균 공간 점유율</div>
          <strong>{formatNumber(summary.locationCount)} / {summary.avgUtil.toFixed(1)}%</strong>
          <span>필터 결과 기준</span>
        </article>
      </section>

      <section className="nw-chart-grid location">
        <ChartPanel title="센터별 즉시출고/보류 스택" helper="전체 조건 기준">
          <Bar data={centerStackData} options={centerStackOptions} />
        </ChartPanel>

        <ChartPanel title="공간 점유율 분포" helper="점유율 구간별 위치 수">
          <Doughnut data={utilDistributionData} options={utilDistributionOptions} />
        </ChartPanel>

        <ChartPanel title="핫스팟 TOP 5 추이" helper="공간 점유율(%) + 보류 수량">
          {hotSpots.length ? <Line data={hotspotLineData} options={hotspotLineOptions} /> : <div className="nw-empty inline">표시할 위치가 없습니다.</div>}
        </ChartPanel>

        <ChartPanel title="존별 공간 점유율 & 가용 재고" helper="작업 존 단위 비교">
          {zoneUtilSummary.length ? <Bar data={zoneUtilBarData} options={zoneUtilBarOptions} /> : <div className="nw-empty inline">표시할 존 데이터가 없습니다.</div>}
        </ChartPanel>

        <ChartPanel title="랙 구역별 즉시출고/보류" helper="상위 8개 구역">
          {areaSummary.length ? <Bar data={areaStackData} options={areaStackOptions} /> : <div className="nw-empty inline">표시할 구역 데이터가 없습니다.</div>}
        </ChartPanel>

        <ChartPanel title="화주사별 점유/보류 레이더" helper="평균 공간 점유율 vs 보류 비율">
          {ownerSummary.length ? <Radar data={ownerRadarData} options={ownerRadarOptions} /> : <div className="nw-empty inline">표시할 화주사 데이터가 없습니다.</div>}
        </ChartPanel>
      </section>

      {viewMode === "list" ? (
        <section className="nw-panel">
          <div className="nw-panel-title-row">
            <h3>위치별 리스트</h3>
            <div className="nw-helper-text">위치와 등록 상품을 같은 행에서 바로 확인</div>
          </div>

          <div className="nw-table-wrap">
            <table className="nw-table">
              <thead>
                <tr>
                  <th>센터</th>
                  <th>작업 존</th>
                  <th>랙 구역</th>
                  <th>로케이션</th>
                  <th>등록 상품</th>
                  <th>보관 수량</th>
                  <th>즉시출고 가능</th>
                  <th>보류 수량</th>
                  <th>공간 점유율</th>
                  <th>상품 종수</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => {
                  const util = row.util;
                  return (
                    <tr key={row.id}>
                      <td>{row.center}</td>
                      <td><span className="nw-zone-chip">{row.zone}</span></td>
                      <td>{row.areaCode}</td>
                      <td>{row.locationCode}</td>
                      <td className="nw-location-product-cell">
                        {row.products.length ? (
                          <div className="nw-location-product-list">
                            {row.products.slice(0, 3).map((product) => (
                              <div key={product.id} className="item">
                                <strong>{product.name}</strong>
                                <span>{product.option}</span>
                                <em>{formatNumber(product.stock)}개</em>
                              </div>
                            ))}
                            {row.products.length > 3 ? <div className="more">외 {formatNumber(row.products.length - 3)}개</div> : null}
                          </div>
                        ) : (
                          <span className="nw-empty-inline">-</span>
                        )}
                      </td>
                      <td>{formatNumber(row.stock)}</td>
                      <td>{formatNumber(row.available)}</td>
                      <td>{formatNumber(row.reserved)}</td>
                      <td>{util.toFixed(1)}%</td>
                      <td>{formatNumber(row.products.length)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {!filteredRows.length ? <div className="nw-empty">조회 조건에 해당하는 위치가 없습니다.</div> : null}
        </section>
      ) : (
        <section className="nw-panel">
          <div className="nw-panel-title-row">
            <h3>2D 시각화</h3>
            <div className="nw-sort-row">
              {[
                "기본",
                "수량 높은순",
                "수량 낮은순",
              ].map((label) => (
                <button
                  key={label}
                  type="button"
                  className={`nw-btn tiny ${sortType === label ? "active" : ""}`}
                  onClick={() => setSortType(label)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          {Object.entries(groupedVisualRows).map(([center, rows]) => {
            const total = rows.reduce((sum, row) => sum + row.stock, 0);
            const reserved = rows.reduce((sum, row) => sum + row.reserved, 0);
            const centerBubbleData = {
              datasets: [
                {
                  label: `${center} 위치`,
                  data: rows.map((row, index) => ({
                    x: (index % 6) + 1,
                    y: Math.floor(index / 6) + 1,
                    r: Math.max(6, Math.min(24, 6 + row.stock * 0.18)),
                    locationCode: row.locationCode,
                    areaCode: row.areaCode,
                    stock: row.stock,
                    available: row.available,
                    reserved: row.reserved,
                    util: row.util,
                  })),
                  backgroundColor: rows.map((row) => intensityColor(getLocationIntensity(row.stock, row.capacity))),
                  borderColor: rows.map((row) => (row.reserved > 0 ? CHART_COLORS.amber : "#ffffff")),
                  borderWidth: rows.map((row) => (row.reserved > 0 ? 2 : 1)),
                },
              ],
            };
            const centerBubbleOptions = {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  backgroundColor: "#1f2c3f",
                  bodyFont: { family: "Noto Sans KR", size: 11 },
                  callbacks: {
                    label: (context) => {
                      const row = context.raw;
                      return `${row.locationCode} (${row.areaCode}) | 보관 ${formatNumber(row.stock)} | 즉시출고 ${formatNumber(row.available)} | 보류 ${formatNumber(row.reserved)} | 점유율 ${row.util.toFixed(1)}%`;
                    },
                  },
                },
              },
              scales: {
                x: {
                  min: 0.5,
                  max: 6.6,
                  ticks: {
                    display: false,
                  },
                  grid: { color: "#edf2f9" },
                  border: { color: CHART_COLORS.line },
                },
                y: {
                  min: 0.5,
                  max: Math.max(Math.ceil(rows.length / 6), 1) + 0.6,
                  reverse: true,
                  ticks: {
                    display: false,
                  },
                  grid: { color: "#edf2f9" },
                  border: { color: CHART_COLORS.line },
                },
              },
            };

            return (
              <div key={center} className="nw-center-block chart-mode">
                <div className="nw-center-head">
                  <strong>{center}</strong>
                  <span>보관: {formatNumber(total)} / 보류: {formatNumber(reserved)}</span>
                  <em>{formatNumber(rows.length)}개 위치</em>
                </div>
                <div className="nw-center-visual-layout">
                  <div className="nw-center-map">
                    <Bubble data={centerBubbleData} options={centerBubbleOptions} />
                  </div>
                  <div className="nw-center-hot-list">
                    {rows.slice(0, 8).map((row) => {
                      const util = row.util;
                      return (
                        <button
                          key={row.id}
                          type="button"
                          className={`nw-compact-cell ${focusLocationId === row.id ? "active" : ""}`}
                          onClick={() => setFocusLocationId(row.id)}
                        >
                          <div className="title">{row.locationCode}</div>
                          <div className="meta">{row.zone} · {row.areaCode}</div>
                          <div className="qty">{formatNumber(row.stock)} / 보류 {formatNumber(row.reserved)}</div>
                          <div className="mini"><i style={{ width: `${Math.max(util, 4)}%` }} /></div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          {focusLocation ? (
            <section className="nw-focus-panel">
              <h4>위치 상세 - {focusLocation.locationCode}</h4>
              <p>{focusLocation.center} / {focusLocation.zone} / {focusLocation.areaCode} / 공간 점유율 {focusLocation.util.toFixed(1)}%</p>
              {focusLocation.products.length ? (
                <ul>
                  {focusLocation.products.map((product) => (
	                    <li key={product.id}>
	                      <strong>{product.name}</strong>
	                      <span>{product.option}</span>
	                      <span>보관 {formatNumber(product.stock)} / 보류 {formatNumber(product.reserved)}</span>
	                    </li>
                  ))}
                </ul>
              ) : (
                <div className="nw-empty inline">등록된 상품이 없습니다.</div>
              )}
            </section>
          ) : null}
        </section>
      )}

      <GlobalToast message={toast} />
    </SidebarLayout>
  );
}

function InventoryLookupTab({ onMoveToInput }) {
  const [owner, setOwner] = useState("");
  const [query, setQuery] = useState("");
  const [expandedSet, setExpandedSet] = useState(() => new Set());

  const filteredProducts = useMemo(() => {
    if (!owner && !query.trim()) return [];
    const keyword = query.trim().toLowerCase();
    return PRODUCT_MASTER.filter((product) => {
      const target = `${product.name} ${product.option} ${product.barcode} ${product.brand} ${product.locations.map((location) => location.code).join(" ")}`.toLowerCase();
      return (!owner || product.owner === owner) && (!keyword || target.includes(keyword));
    });
  }, [owner, query]);

  const toggleExpand = (id) => {
    setExpandedSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
      <section className="nw-mobile-panel">
        <div className="nw-mobile-filter-grid">
          <select value={owner} onChange={(event) => setOwner(event.target.value)}>
            <option value="">화주사 선택</option>
            {OWNER_OPTIONS.filter((option) => option !== "ALL").map((option) => <option key={option}>{option}</option>)}
          </select>
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="바코드 스캔 또는 검색어 입력"
          />
        </div>
      </section>

      {!filteredProducts.length ? (
        <section className="nw-mobile-empty">
          <div className="icon">⌘</div>
          <p>바코드를 스캔하거나 검색어를 입력해 주세요</p>
        </section>
      ) : (
        <section className="nw-mobile-list">
          {filteredProducts.map((product) => {
            const expanded = expandedSet.has(product.id);
            const visibleLocations = expanded ? product.locations : product.locations.slice(0, 2);
            const totalQty = product.locations.reduce((sum, location) => sum + location.qty, 0);
            return (
              <article key={product.id} className="nw-mobile-card">
                <div className="nw-mobile-product-head">
                  <div className={`nw-thumb ${getToneClass(product.tone)}`} />
                  <div>
                    <strong>{product.name}</strong>
                    <span>{product.option}</span>
                    <span>{product.barcode}</span>
                    <span className="brand">{product.brand}</span>
                  </div>
                  <div className="qty">
                    <span>{formatNumber(totalQty)}</span>
                    <small>📍 {product.locations.length}</small>
                  </div>
                </div>

                <div className="nw-location-lines">
                  {visibleLocations.map((location) => (
                    <div key={`${product.id}-${location.code}`} className="line">
                      <span className="zone">{location.zone}</span>
                      <strong>{location.code}</strong>
                      <em>{formatNumber(location.qty)}개</em>
                    </div>
                  ))}
                </div>

                {product.locations.length > 2 ? (
                  <button type="button" className="nw-link-btn" onClick={() => toggleExpand(product.id)}>
                    {expanded ? "접기" : `로케이션 ${product.locations.length - 2}개 더 보기`}
                  </button>
                ) : null}

                <div className="nw-btn-row end">
                  <button type="button" className="nw-btn tiny" onClick={onMoveToInput}>조사 재고 입력 이동</button>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </>
  );
}

function SurveyInputTab({ surveyEntries, setSurveyEntries, showToast }) {
  const [subTab, setSubTab] = useState("individual");
  const [individualForm, setIndividualForm] = useState({
    owner: "화주사 2",
    round: "2026-03-1차",
    barcode: "",
    locationCode: "",
    qty: "",
    memo: "",
  });
  const [scanForm, setScanForm] = useState({
    owner: "화주사 2",
    locationCode: "WHO1-A01-01-01",
    mode: "자동누산",
    barcode: "",
    qty: "1",
  });
  const [uploadText, setUploadText] = useState("880123456789,WHO1-A01-01-01,3,정상\n880987654321,WHO1-B02-01-01,2,리스트등록");
  const [uploadPreview, setUploadPreview] = useState([]);
  const [listFilter, setListFilter] = useState({ owner: "ALL", round: "ALL", status: "ALL" });
  const [selectedIds, setSelectedIds] = useState(() => new Set());

  const createEntry = ({ owner, round, barcode, locationCode, qty, memo, source }) => {
    const product = findProductByBarcode(barcode);
    return {
      id: `survey-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      owner,
      round,
      barcode,
      locationCode,
      qty: toNumber(qty),
      memo,
      source,
      status: "조사중",
      worker: "김작업",
      createdAt: getNowString(),
      productName: product ? product.name : "미등록 상품",
      option: product ? product.option : "-",
    };
  };

  const addIndividual = () => {
    if (!individualForm.owner || !individualForm.round || !individualForm.barcode || !individualForm.locationCode || toNumber(individualForm.qty) <= 0) {
      showToast("화주사/차수/바코드/로케이션/수량을 입력하세요.");
      return;
    }

    setSurveyEntries((prev) => [createEntry({ ...individualForm, source: "개별입력" }), ...prev]);
    setIndividualForm((prev) => ({ ...prev, barcode: "", locationCode: "", qty: "", memo: "" }));
    showToast("조사 재고를 임시 목록에 추가했습니다.");
  };

  const addScan = () => {
    if (!scanForm.owner || !scanForm.locationCode || !scanForm.barcode.trim()) {
      showToast("화주사/로케이션/바코드를 입력하세요.");
      return;
    }

    if (scanForm.mode === "자동누산") {
      let merged = false;
      setSurveyEntries((prev) => prev.map((entry) => {
        if (!merged && entry.status === "조사중" && entry.barcode === scanForm.barcode.trim() && entry.locationCode === scanForm.locationCode) {
          merged = true;
          return { ...entry, qty: entry.qty + 1 };
        }
        return entry;
      }));

      if (!merged) {
        setSurveyEntries((prev) => [
          createEntry({
            owner: scanForm.owner,
            round: "2026-03-1차",
            barcode: scanForm.barcode.trim(),
            locationCode: scanForm.locationCode,
            qty: 1,
            memo: "",
            source: "바코드스캔",
          }),
          ...prev,
        ]);
      }
    } else {
      if (toNumber(scanForm.qty) <= 0) {
        showToast("단위 입력 모드에서는 수량이 필요합니다.");
        return;
      }
      setSurveyEntries((prev) => [
        createEntry({
          owner: scanForm.owner,
          round: "2026-03-1차",
          barcode: scanForm.barcode.trim(),
          locationCode: scanForm.locationCode,
          qty: toNumber(scanForm.qty),
          memo: "",
          source: "바코드스캔",
        }),
        ...prev,
      ]);
    }

    setScanForm((prev) => ({ ...prev, barcode: "" }));
    showToast("스캔 항목을 반영했습니다.");
  };

  const parseUpload = () => {
    const lines = uploadText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const parsed = lines.map((line, index) => {
      const [barcode = "", locationCode = "", qty = "", memo = ""] = line.split(",").map((item) => item.trim());
      const valid = barcode && locationCode && toNumber(qty) > 0;
      return {
        index: index + 1,
        barcode,
        locationCode,
        qty,
        memo,
        valid,
        error: valid ? "" : "필수 컬럼 누락 또는 수량 오류",
      };
    });

    setUploadPreview(parsed);
    const validCount = parsed.filter((row) => row.valid).length;
    showToast(`검증 완료: 총 ${parsed.length}행 / 유효 ${validCount}행`);
  };

  const registerUpload = () => {
    const validRows = uploadPreview.filter((row) => row.valid);
    if (!validRows.length) {
      showToast("등록 가능한 유효 행이 없습니다.");
      return;
    }

    const created = validRows.map((row) => createEntry({
      owner: "화주사 2",
      round: "2026-03-1차",
      barcode: row.barcode,
      locationCode: row.locationCode,
      qty: row.qty,
      memo: row.memo,
      source: "CSV업로드",
    }));

    setSurveyEntries((prev) => [...created, ...prev]);
    showToast(`유효 ${created.length}건을 등록했습니다.`);
  };

  const filteredList = useMemo(() => surveyEntries.filter((entry) => {
    if (listFilter.owner !== "ALL" && entry.owner !== listFilter.owner) return false;
    if (listFilter.round !== "ALL" && entry.round !== listFilter.round) return false;
    if (listFilter.status !== "ALL" && entry.status !== listFilter.status) return false;
    return true;
  }), [surveyEntries, listFilter]);

  const toggleRowSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const updateSelectedStatus = (status) => {
    if (!selectedIds.size) {
      showToast("목록에서 항목을 선택하세요.");
      return;
    }
    setSurveyEntries((prev) => prev.map((entry) => (selectedIds.has(entry.id) ? { ...entry, status } : entry)));
    showToast(`선택 항목 ${selectedIds.size}건을 ${status} 처리했습니다.`);
    setSelectedIds(new Set());
  };

  return (
    <>
      <div className="nw-subtabs survey-subtabs">
        <button type="button" className={subTab === "individual" ? "active" : ""} onClick={() => setSubTab("individual")}>개별 입력</button>
        <button type="button" className={subTab === "scan" ? "active" : ""} onClick={() => setSubTab("scan")}>바코드 스캔</button>
        <button type="button" className={subTab === "upload" ? "active" : ""} onClick={() => setSubTab("upload")}>엑셀/CSV 업로드</button>
        <button type="button" className={subTab === "list" ? "active" : ""} onClick={() => setSubTab("list")}>조사 재고 목록</button>
      </div>

      {subTab === "individual" ? (
        <section className="nw-panel">
          <div className="nw-filter-grid input-mode">
            <label>
              화주사
              <select value={individualForm.owner} onChange={(event) => setIndividualForm((prev) => ({ ...prev, owner: event.target.value }))}>
                {OWNER_OPTIONS.filter((option) => option !== "ALL").map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label>
              조사 차수
              <input value={individualForm.round} onChange={(event) => setIndividualForm((prev) => ({ ...prev, round: event.target.value }))} />
            </label>
            <label>
              바코드
              <input value={individualForm.barcode} onChange={(event) => setIndividualForm((prev) => ({ ...prev, barcode: event.target.value }))} />
            </label>
            <label>
              로케이션
              <input value={individualForm.locationCode} onChange={(event) => setIndividualForm((prev) => ({ ...prev, locationCode: event.target.value }))} />
            </label>
            <label>
              수량
              <input type="number" min="0" value={individualForm.qty} onChange={(event) => setIndividualForm((prev) => ({ ...prev, qty: event.target.value }))} />
            </label>
            <label className="wide">
              메모
              <input value={individualForm.memo} onChange={(event) => setIndividualForm((prev) => ({ ...prev, memo: event.target.value }))} />
            </label>
          </div>
          <div className="nw-panel-actions">
            <button type="button" className="nw-btn primary" onClick={addIndividual}>행 추가</button>
          </div>
        </section>
      ) : null}

      {subTab === "scan" ? (
        <section className="nw-panel">
          <div className="nw-filter-grid input-mode">
            <label>
              화주사
              <select value={scanForm.owner} onChange={(event) => setScanForm((prev) => ({ ...prev, owner: event.target.value }))}>
                {OWNER_OPTIONS.filter((option) => option !== "ALL").map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label>
              로케이션
              <input value={scanForm.locationCode} onChange={(event) => setScanForm((prev) => ({ ...prev, locationCode: event.target.value }))} />
            </label>
            <label>
              스캔 모드
              <select value={scanForm.mode} onChange={(event) => setScanForm((prev) => ({ ...prev, mode: event.target.value }))}>
                <option>자동누산</option>
                <option>단위입력</option>
              </select>
            </label>
            <label>
              바코드
              <input value={scanForm.barcode} onChange={(event) => setScanForm((prev) => ({ ...prev, barcode: event.target.value }))} placeholder="스캔값 입력" />
            </label>
            {scanForm.mode === "단위입력" ? (
              <label>
                수량
                <input type="number" min="1" value={scanForm.qty} onChange={(event) => setScanForm((prev) => ({ ...prev, qty: event.target.value }))} />
              </label>
            ) : null}
          </div>
          <div className="nw-panel-actions">
            <button type="button" className="nw-btn primary" onClick={addScan}>스캔 반영</button>
          </div>
        </section>
      ) : null}

      {subTab === "upload" ? (
        <section className="nw-panel">
          <div className="nw-panel-title-row">
            <h3>CSV 업로드</h3>
            <div className="nw-helper-text">형식: 바코드,로케이션,수량,메모</div>
          </div>
          <textarea
            className="nw-upload-area"
            value={uploadText}
            onChange={(event) => setUploadText(event.target.value)}
          />
          <div className="nw-panel-actions">
            <button type="button" className="nw-btn" onClick={parseUpload}>검증 프리뷰</button>
            <button type="button" className="nw-btn primary" onClick={registerUpload}>유효 행 등록</button>
            <button type="button" className="nw-btn" onClick={() => showToast("오류 리포트 다운로드 (데모)")}>오류 리포트 다운로드</button>
          </div>

          {uploadPreview.length ? (
            <div className="nw-table-wrap small-gap">
              <table className="nw-table compact">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>바코드</th>
                    <th>로케이션</th>
                    <th>수량</th>
                    <th>검증</th>
                  </tr>
                </thead>
                <tbody>
                  {uploadPreview.map((row) => (
                    <tr key={row.index} className={row.valid ? "" : "row-error"}>
                      <td>{row.index}</td>
                      <td>{row.barcode || "-"}</td>
                      <td>{row.locationCode || "-"}</td>
                      <td>{row.qty || "-"}</td>
                      <td>{row.valid ? "유효" : row.error}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>
      ) : null}

      {subTab === "list" ? (
        <section className="nw-panel">
          <div className="nw-filter-grid list-mode">
            <label>
              화주사
              <select value={listFilter.owner} onChange={(event) => setListFilter((prev) => ({ ...prev, owner: event.target.value }))}>
                {OWNER_OPTIONS.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label>
              조사 차수
              <select value={listFilter.round} onChange={(event) => setListFilter((prev) => ({ ...prev, round: event.target.value }))}>
                <option>ALL</option>
                {[...new Set(surveyEntries.map((entry) => entry.round))].map((round) => <option key={round}>{round}</option>)}
              </select>
            </label>
            <label>
              상태
              <select value={listFilter.status} onChange={(event) => setListFilter((prev) => ({ ...prev, status: event.target.value }))}>
                <option>ALL</option>
                <option>조사중</option>
                <option>실입고완료</option>
                <option>취소됨</option>
              </select>
            </label>
          </div>

          <div className="nw-panel-actions">
            <button type="button" className="nw-btn" onClick={() => updateSelectedStatus("실입고완료")}>선택 실입고 처리</button>
            <button type="button" className="nw-btn" onClick={() => updateSelectedStatus("취소됨")}>선택 취소</button>
            <button type="button" className="nw-btn" onClick={() => showToast("목록 엑셀 다운로드 (데모)")}>엑셀 다운로드</button>
          </div>

          <div className="nw-table-wrap">
            <table className="nw-table">
              <thead>
                <tr>
                  <th />
                  <th>차수</th>
                  <th>등록일시</th>
                  <th>화주사</th>
                  <th>바코드</th>
                  <th>상품명 / 옵션</th>
                  <th>로케이션</th>
                  <th>조사 수량</th>
                  <th>상태</th>
                  <th>입력방식</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((entry) => (
                  <tr key={entry.id}>
                    <td><input type="checkbox" checked={selectedIds.has(entry.id)} onChange={() => toggleRowSelect(entry.id)} /></td>
                    <td>{entry.round}</td>
                    <td>{entry.createdAt}</td>
                    <td>{entry.owner}</td>
                    <td>{entry.barcode}</td>
                    <td>{entry.productName} / {entry.option}</td>
                    <td>{entry.locationCode}</td>
                    <td>{formatNumber(entry.qty)}</td>
                    <td><span className={`nw-status ${statusClass(entry.status)}`}>{entry.status}</span></td>
                    <td>{entry.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!filteredList.length ? <div className="nw-empty">조건에 맞는 조사 재고 목록이 없습니다.</div> : null}
        </section>
      ) : null}
    </>
  );
}

function CurrentCompareTab({ surveyEntries, setAdjustments, showToast }) {
  const [resultFilter, setResultFilter] = useState("ALL");
  const [minDiff, setMinDiff] = useState("");
  const [selectedIds, setSelectedIds] = useState(() => new Set());

  const comparisonRows = useMemo(() => {
    const surveyMap = new Map();
    surveyEntries
      .filter((entry) => entry.status !== "취소됨")
      .forEach((entry) => {
        const key = `${entry.barcode}|${entry.locationCode}`;
        if (!surveyMap.has(key)) {
          surveyMap.set(key, {
            key,
            owner: entry.owner,
            barcode: entry.barcode,
            productName: entry.productName,
            option: entry.option,
            locationCode: entry.locationCode,
            surveyQty: 0,
          });
        }
        surveyMap.get(key).surveyQty += entry.qty;
      });

    const rows = SYSTEM_STOCK_ROWS.map((systemRow) => {
      const survey = surveyMap.get(systemRow.key);
      const surveyQty = survey ? survey.surveyQty : 0;
      const diff = surveyQty - systemRow.qty;
      let result = "미처리";
      if (survey) {
        if (diff === 0) result = "일치";
        else if (diff > 0) result = "불일치+";
        else result = "불일치-";
      }

      return {
        id: `cmp-${systemRow.key}`,
        owner: systemRow.owner,
        barcode: systemRow.barcode,
        productName: systemRow.productName,
        option: systemRow.option,
        locationCode: systemRow.locationCode,
        surveyQty,
        systemQty: systemRow.qty,
        diff,
        result,
      };
    });

    surveyMap.forEach((surveyRow, key) => {
      if (!SYSTEM_STOCK_ROWS.find((systemRow) => systemRow.key === key)) {
        rows.push({
          id: `cmp-extra-${key}`,
          owner: surveyRow.owner,
          barcode: surveyRow.barcode,
          productName: surveyRow.productName,
          option: surveyRow.option,
          locationCode: surveyRow.locationCode,
          surveyQty: surveyRow.surveyQty,
          systemQty: 0,
          diff: surveyRow.surveyQty,
          result: "불일치+",
        });
      }
    });

    return rows;
  }, [surveyEntries]);

  const filteredRows = useMemo(() => comparisonRows.filter((row) => {
    if (resultFilter !== "ALL" && row.result !== resultFilter) return false;
    if (minDiff !== "" && Math.abs(row.diff) < toNumber(minDiff)) return false;
    return true;
  }), [comparisonRows, resultFilter, minDiff]);

  const summary = useMemo(() => {
    const total = filteredRows.length;
    const match = filteredRows.filter((row) => row.result === "일치").length;
    const plus = filteredRows.filter((row) => row.result === "불일치+").length;
    const minus = filteredRows.filter((row) => row.result === "불일치-").length;
    const pending = filteredRows.filter((row) => row.result === "미처리").length;
    const accuracy = total ? ((match / total) * 100).toFixed(1) : "0.0";
    return { total, match, plus, minus, pending, accuracy };
  }, [filteredRows]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const requestAdjustments = () => {
    const rows = filteredRows.filter((row) => selectedIds.has(row.id) && row.diff !== 0);
    if (!rows.length) {
      showToast("재고조정 요청 대상(차이 수량)을 선택하세요.");
      return;
    }

    const created = rows.map((row) => ({
      id: `adj-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      requestedAt: getNowString(),
      owner: row.owner,
      worker: "관리자 자동연계",
      productName: row.productName,
      option: row.option,
      barcode: row.barcode,
      brand: findProductByBarcode(row.barcode)?.brand || "-",
      zone: "보관존",
      locationCode: row.locationCode,
      systemQty: row.systemQty,
      actualQty: row.surveyQty,
      reason: "현재고 대조 불일치",
      status: "대기중",
      approvedAt: "",
    }));

    setAdjustments((prev) => [...created, ...prev]);
    setSelectedIds(new Set());
    showToast(`재고조정 요청 ${created.length}건을 생성했습니다.`);
  };

  return (
    <>
      <section className="nw-summary-grid five">
        <article className="nw-summary-card"><div className="label">재고 정확도</div><strong>{summary.accuracy}%</strong><span>일치 / 전체</span></article>
        <article className="nw-summary-card"><div className="label">일치 건수</div><strong>{formatNumber(summary.match)}</strong><span>조사재고 = 현재고</span></article>
        <article className="nw-summary-card warn"><div className="label">불일치(+)</div><strong>{formatNumber(summary.plus)}</strong><span>조사재고 &gt; 현재고</span></article>
        <article className="nw-summary-card danger"><div className="label">불일치(-)</div><strong>{formatNumber(summary.minus)}</strong><span>조사재고 &lt; 현재고</span></article>
        <article className="nw-summary-card"><div className="label">미처리</div><strong>{formatNumber(summary.pending)}</strong><span>조사 미입력</span></article>
      </section>

      <section className="nw-panel">
        <div className="nw-filter-grid compare">
          <label>
            대조 결과
            <select value={resultFilter} onChange={(event) => setResultFilter(event.target.value)}>
              <option>ALL</option>
              <option>일치</option>
              <option>불일치+</option>
              <option>불일치-</option>
              <option>미처리</option>
            </select>
          </label>
          <label>
            최소 차이 수량
            <input type="number" value={minDiff} onChange={(event) => setMinDiff(event.target.value)} />
          </label>
        </div>

        <div className="nw-panel-actions">
          <button type="button" className="nw-btn" onClick={requestAdjustments}>선택 재고조정 요청</button>
          <button type="button" className="nw-btn" onClick={() => showToast("대조 결과 엑셀 다운로드 (데모)")}>엑셀 다운로드</button>
        </div>

        <div className="nw-table-wrap">
          <table className="nw-table">
            <thead>
              <tr>
                <th />
                <th>화주사</th>
                <th>바코드</th>
                <th>상품명 / 옵션</th>
                <th>로케이션</th>
                <th>조사 수량</th>
                <th>현재고</th>
                <th>차이 수량</th>
                <th>대조 결과</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id}>
                  <td><input type="checkbox" checked={selectedIds.has(row.id)} onChange={() => toggleSelect(row.id)} /></td>
                  <td>{row.owner}</td>
                  <td>{row.barcode}</td>
                  <td>{row.productName} / {row.option}</td>
                  <td>{row.locationCode}</td>
                  <td>{formatNumber(row.surveyQty)}</td>
                  <td>{formatNumber(row.systemQty)}</td>
                  <td className={row.diff > 0 ? "text-plus" : row.diff < 0 ? "text-minus" : ""}>{row.diff > 0 ? `+${formatNumber(row.diff)}` : formatNumber(row.diff)}</td>
                  <td><span className={`nw-status ${statusClass(row.result)}`}>{row.result}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function WorkHistoryTab({ surveyEntries }) {
  const [subTab, setSubTab] = useState("registered");
  const [codesInput, setCodesInput] = useState("880123456789\n880987654321\nUNKNOWN-00001");
  const [registeredRows, setRegisteredRows] = useState([]);
  const [selectedRound, setSelectedRound] = useState("");

  const searchRegistered = () => {
    const codes = codesInput
      .split("\n")
      .map((code) => code.trim())
      .filter(Boolean);

    const rows = codes.map((code) => {
      const product = PRODUCT_MASTER.find((item) => item.barcode === code || item.id === code);
      const matched = Boolean(product);
      return {
        id: `registered-${code}`,
        matched,
        barcode: code,
        productName: product ? product.name : "미등록",
        option: product ? product.option : "-",
        snapshotQty: product ? formatNumber(product.locations.reduce((sum, location) => sum + location.qty, 0)) : "0",
        surveyQty: matched
          ? formatNumber(surveyEntries.filter((entry) => entry.barcode === product.barcode).reduce((sum, entry) => sum + entry.qty, 0))
          : "0",
      };
    });

    setRegisteredRows(rows);
  };

  const batchSummary = useMemo(() => {
    const map = {};
    surveyEntries.forEach((entry) => {
      if (!map[entry.round]) {
        map[entry.round] = {
          round: entry.round,
          owner: entry.owner,
          total: 0,
          completed: 0,
          pending: 0,
          linkedAdjustments: 0,
        };
      }
      map[entry.round].total += 1;
      if (entry.status === "실입고완료") map[entry.round].completed += 1;
      else map[entry.round].pending += 1;
    });
    return Object.values(map).map((item, index) => ({
      ...item,
      id: `batch-${index + 1}`,
      completion: item.total ? Math.round((item.completed / item.total) * 100) : 0,
      linkedAdjustments: Math.max(1, Math.round(item.total / 3)),
    }));
  }, [surveyEntries]);

  const selectedRoundRows = surveyEntries.filter((entry) => !selectedRound || entry.round === selectedRound);

  return (
    <>
      <div className="nw-subtabs survey-subtabs">
        <button type="button" className={subTab === "registered" ? "active" : ""} onClick={() => setSubTab("registered")}>등록상품보기</button>
        <button type="button" className={subTab === "work" ? "active" : ""} onClick={() => setSubTab("work")}>작업내역보기</button>
        <button type="button" className={subTab === "batch" ? "active" : ""} onClick={() => setSubTab("batch")}>차수별 상품보기내역</button>
      </div>

      {subTab === "registered" ? (
        <section className="nw-panel">
          <div className="nw-panel-title-row">
            <h3>등록상품보기</h3>
            <div className="nw-helper-text">CSV 업로드/직접 입력 코드로 기준일 재고 조회</div>
          </div>
          <textarea className="nw-upload-area" value={codesInput} onChange={(event) => setCodesInput(event.target.value)} />
          <div className="nw-panel-actions">
            <button type="button" className="nw-btn primary" onClick={searchRegistered}>조회</button>
          </div>

          <div className="nw-table-wrap">
            <table className="nw-table compact">
              <thead>
                <tr>
                  <th>매칭 여부</th>
                  <th>바코드</th>
                  <th>상품명 / 옵션</th>
                  <th>기준일 재고</th>
                  <th>조사 수량</th>
                </tr>
              </thead>
              <tbody>
                {registeredRows.map((row) => (
                  <tr key={row.id}>
                    <td><span className={`nw-status ${row.matched ? "ok" : "danger"}`}>{row.matched ? "등록됨" : "미등록"}</span></td>
                    <td>{row.barcode}</td>
                    <td>{row.productName} / {row.option}</td>
                    <td>{row.snapshotQty}</td>
                    <td>{row.surveyQty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {subTab === "work" ? (
        <section className="nw-panel">
          <div className="nw-panel-title-row">
            <h3>작업내역보기</h3>
            <div className="nw-helper-text">담당자별 실산 입력 내역</div>
          </div>
          <div className="nw-table-wrap">
            <table className="nw-table">
              <thead>
                <tr>
                  <th>입력일시</th>
                  <th>담당자</th>
                  <th>바코드 / 상품명</th>
                  <th>로케이션</th>
                  <th>조사 수량</th>
                  <th>실산 상태</th>
                  <th>메모</th>
                </tr>
              </thead>
              <tbody>
                {surveyEntries.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.createdAt}</td>
                    <td>{entry.worker}</td>
                    <td>{entry.barcode} / {entry.productName}</td>
                    <td>{entry.locationCode}</td>
                    <td>{formatNumber(entry.qty)}</td>
                    <td><span className={`nw-status ${statusClass(entry.status)}`}>{entry.status}</span></td>
                    <td>{entry.memo || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {subTab === "batch" ? (
        <section className="nw-panel">
          <div className="nw-panel-title-row">
            <h3>차수별 상품보기내역</h3>
            <div className="nw-helper-text">마스터 행 클릭 시 하위 상세 드릴다운</div>
          </div>

          <div className="nw-table-wrap">
            <table className="nw-table">
              <thead>
                <tr>
                  <th>조사 차수</th>
                  <th>화주사</th>
                  <th>조회 SKU 수</th>
                  <th>실산 완료 / 미완료</th>
                  <th>완료율</th>
                  <th>조정 연계 건수</th>
                </tr>
              </thead>
              <tbody>
                {batchSummary.map((batch) => (
                  <tr key={batch.id} className={selectedRound === batch.round ? "selected-row" : ""} onClick={() => setSelectedRound(batch.round)}>
                    <td>{batch.round}</td>
                    <td>{batch.owner}</td>
                    <td>{formatNumber(batch.total)}</td>
                    <td>{formatNumber(batch.completed)} / {formatNumber(batch.pending)}</td>
                    <td>{batch.completion}%</td>
                    <td>{formatNumber(batch.linkedAdjustments)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="nw-subpanel">
            <div className="title">{selectedRound || "전체 차수"} 상세</div>
            <div className="nw-table-wrap">
              <table className="nw-table compact">
                <thead>
                  <tr>
                    <th>등록일시</th>
                    <th>바코드</th>
                    <th>상품명</th>
                    <th>로케이션</th>
                    <th>조사 수량</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRoundRows.map((entry) => (
                    <tr key={`detail-${entry.id}`}>
                      <td>{entry.createdAt}</td>
                      <td>{entry.barcode}</td>
                      <td>{entry.productName}</td>
                      <td>{entry.locationCode}</td>
                      <td>{formatNumber(entry.qty)}</td>
                      <td><span className={`nw-status ${statusClass(entry.status)}`}>{entry.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}

function WorkerAdjustmentPanel({ adjustments, setAdjustments, showToast }) {
  const [subTab, setSubTab] = useState("request");
  const [owner, setOwner] = useState("화주사 2");
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [productQuery, setProductQuery] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [actualQty, setActualQty] = useState("");
  const [reason, setReason] = useState("");

  const [historyFilter, setHistoryFilter] = useState({
    status: "ALL",
    start: "2026-01-19",
    end: "2026-01-26",
  });
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [selectedHistoryId, setSelectedHistoryId] = useState("");
  const [detailEdit, setDetailEdit] = useState({ actualQty: "", reason: "" });

  const locationKeyword = locationQuery.trim().toLowerCase();
  const hasLocationScan = locationKeyword.length > 0;

  const candidateLocations = useMemo(() => LOCATION_STOCK_ROWS
    .filter((row) => row.owner === owner)
    .filter((row) => !locationKeyword
      || row.locationCode.toLowerCase().includes(locationKeyword)
      || row.zone.toLowerCase().includes(locationKeyword))
    .slice(0, 20), [owner, locationKeyword]);

  useEffect(() => {
    if (!hasLocationScan || !candidateLocations.length) {
      if (selectedLocationId) setSelectedLocationId("");
      return;
    }
    if (!candidateLocations.some((row) => row.id === selectedLocationId)) {
      const exactMatch = candidateLocations.find((row) => row.locationCode.toLowerCase() === locationKeyword);
      setSelectedLocationId((exactMatch || candidateLocations[0]).id);
    }
  }, [hasLocationScan, candidateLocations, selectedLocationId, locationKeyword]);

  const selectedLocation = hasLocationScan
    ? candidateLocations.find((row) => row.id === selectedLocationId)
      || LOCATION_STOCK_ROWS.find((row) => row.id === selectedLocationId)
      || null
    : null;

  const ownerProducts = useMemo(
    () => PRODUCT_MASTER.filter((product) => product.owner === owner),
    [owner],
  );

  const ownerLevelProducts = useMemo(() => ownerProducts.map((product) => ({
    id: product.id,
    productId: product.id,
    name: product.name,
    option: product.option,
    barcode: product.barcode,
    brand: product.brand,
    tone: product.tone,
    systemQty: product.locations.reduce((sum, location) => sum + toNumber(location.qty), 0),
    zone: product.locations[0]?.zone || "-",
    locationCode: product.locations[0]?.code || "",
    sourceType: "owner",
  })), [ownerProducts]);

  const locationProductsAll = useMemo(() => {
    if (!selectedLocation) return ownerLevelProducts;
    const productPool = ownerProducts.length ? ownerProducts : PRODUCT_MASTER;
    const exactRows = ownerProducts
      .filter((product) => product.locations.some((location) => location.code === selectedLocation.locationCode))
      .map((product) => {
        const target = product.locations.find((location) => location.code === selectedLocation.locationCode);
        return {
          id: product.id,
          productId: product.id,
          name: product.name,
          option: product.option,
          barcode: product.barcode,
          brand: product.brand,
          tone: product.tone,
          systemQty: target ? target.qty : 0,
          zone: target ? target.zone : selectedLocation.zone,
          sourceType: "exact",
        };
      });

    const locationRows = (selectedLocation.products || [])
      .filter((product) => !product.owner || product.owner === owner)
      .map((product, index) => {
        const matched = productPool.find((item) => item.barcode === product.barcode)
          || productPool[index % productPool.length];
        if (!matched) return null;
        return {
          id: `${matched.id}-row-${selectedLocation.id}-${index}`,
          productId: matched.id,
          name: product.name || matched.name,
          option: product.option || product.optionName || matched.option,
          barcode: product.barcode || matched.barcode,
          brand: matched.brand,
          tone: matched.tone,
          systemQty: Math.max(
            toNumber(product.stock),
            toNumber(product.available) + toNumber(product.reserved),
            1,
          ),
          zone: selectedLocation.zone,
          sourceType: ownerProducts.length ? "location" : "demo",
        };
      })
      .filter(Boolean);

    const merged = new Map();
    exactRows.forEach((row) => merged.set(row.productId, row));
    locationRows.forEach((row) => {
      if (!merged.has(row.productId)) merged.set(row.productId, row);
    });

    let rows = Array.from(merged.values());
    if (!rows.length) {
      rows = buildDemoProductsForLocation(selectedLocation, productPool);
    }

    return rows;
  }, [selectedLocation, owner, ownerProducts, ownerLevelProducts]);

  const locationProducts = useMemo(() => {
    const keyword = productQuery.trim().toLowerCase();
    return locationProductsAll
      .filter((row) => !keyword || `${row.name} ${row.barcode}`.toLowerCase().includes(keyword));
  }, [locationProductsAll, productQuery]);

  useEffect(() => {
    if (!selectedProductId) return;
    if (!locationProductsAll.some((product) => product.id === selectedProductId)) {
      setSelectedProductId("");
      setActualQty("");
      setReason("");
    }
  }, [locationProductsAll, selectedProductId]);

  useEffect(() => {
    setSelectedProductId("");
    setActualQty("");
    setReason("");
    setProductQuery("");
  }, [selectedLocationId]);

  const hasDemoRows = locationProductsAll.some((product) => product.sourceType === "demo");
  const selectedLocationSkuCount = selectedLocation
    ? Math.max(selectedLocation.products?.length || 0, locationProductsAll.length || 0)
    : locationProductsAll.length;

  const selectedProduct = locationProductsAll.find((product) => product.id === selectedProductId)
    || PRODUCT_MASTER.find((product) => product.id === selectedProductId)
    || null;

  const effectiveLocation = selectedLocation || (selectedProduct && selectedProduct.locationCode
    ? { zone: selectedProduct.zone || "-", locationCode: selectedProduct.locationCode }
    : null);

  const adjustmentQty = selectedProduct ? toNumber(actualQty) - selectedProduct.systemQty : 0;
  const canSubmitRequest = !!selectedProduct && !!effectiveLocation && actualQty !== "" && adjustmentQty !== 0;

  const createRequest = () => {
    if (!effectiveLocation || !selectedProduct) {
      showToast("위치와 상품을 선택하세요.");
      return;
    }

    if (actualQty === "") {
      showToast("실제 수량을 입력하세요.");
      return;
    }

    const diff = toNumber(actualQty) - selectedProduct.systemQty;
    if (diff === 0) {
      showToast("조정 수량이 0입니다. 실제 수량을 다시 확인하세요.");
      return;
    }

    const created = {
      id: `adj-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      requestedAt: getNowString(),
      owner,
      worker: "김작업",
      productName: selectedProduct.name,
      option: selectedProduct.option,
      barcode: selectedProduct.barcode,
      brand: selectedProduct.brand,
      zone: effectiveLocation.zone || selectedProduct.zone || "-",
      locationCode: effectiveLocation.locationCode,
      systemQty: selectedProduct.systemQty,
      actualQty: toNumber(actualQty),
      reason: reason.trim(),
      status: "대기중",
      approvedAt: "",
    };

    setAdjustments((prev) => [created, ...prev]);
    setActualQty("");
    setReason("");
    showToast("재고 조정 요청을 생성했습니다.");
    setSubTab("history");
  };

  const historyRows = useMemo(() => adjustments
    .filter((item) => item.worker !== "관리자 자동연계")
    .filter((item) => {
      const dateOnly = String(item.requestedAt || "").slice(0, 10);
      if (historyFilter.start && dateOnly < historyFilter.start) return false;
      if (historyFilter.end && dateOnly > historyFilter.end) return false;
      if (historyFilter.status !== "ALL" && item.status !== historyFilter.status) return false;
      return true;
    }), [adjustments, historyFilter]);

  const selectedHistory = historyRows.find((item) => item.id === selectedHistoryId) || null;
  const selectedHistoryProduct = selectedHistory ? findProductByBarcode(selectedHistory.barcode) : null;
  const selectedHistoryToneClass = selectedHistoryProduct ? getToneClass(selectedHistoryProduct.tone) : "tone-dark";
  const detailDiff = selectedHistory ? toNumber(detailEdit.actualQty) - selectedHistory.systemQty : 0;
  const canRerequest = Boolean(
    selectedHistory
    && selectedHistory.status !== "승인됨"
    && detailEdit.actualQty !== ""
    && detailDiff !== 0
    && detailEdit.reason.trim(),
  );

  useEffect(() => {
    if (!selectedHistory) return;
    setDetailEdit({ actualQty: String(selectedHistory.actualQty), reason: selectedHistory.reason || "" });
  }, [selectedHistory]);

  const searchHistory = () => {
    setHistoryLoaded(true);
    setSelectedHistoryId("");
    showToast(`조정 요청 내역 ${historyRows.length}건`);
  };

  const rerequest = () => {
    if (!selectedHistory) return;
    const actual = toNumber(detailEdit.actualQty);
    if (actual <= 0) {
      showToast("실제 수량을 입력하세요.");
      return;
    }
    if (actual - selectedHistory.systemQty === 0) {
      showToast("조정 수량이 0입니다. 실제 수량을 확인하세요.");
      return;
    }
    if (!detailEdit.reason.trim()) {
      showToast("사유를 입력하세요.");
      return;
    }
    setAdjustments((prev) => prev.map((item) => {
      if (item.id !== selectedHistory.id) return item;
      return {
        ...item,
        actualQty: actual,
        reason: detailEdit.reason.trim(),
        status: "대기중",
        requestedAt: getNowString(),
        approvedAt: "",
      };
    }));
    showToast("재고 조정 재요청을 전송했습니다.");
  };

  return (
    <>
      <div className="nw-subtabs survey-subtabs">
        <button type="button" className={subTab === "request" ? "active" : ""} onClick={() => setSubTab("request")}>조정하기</button>
        <button type="button" className={subTab === "history" ? "active" : ""} onClick={() => setSubTab("history")}>조정내역</button>
      </div>

      {subTab === "request" ? (
        <section className="nw-mobile-adjustment nw-adjust-view request">
          {!selectedProduct || !selectedLocation ? (
            <div className="nw-mobile-filter-grid adjust">
              <label className="nw-mini-field">
                <span>화주사</span>
                <select value={owner} onChange={(event) => setOwner(event.target.value)}>
                  {OWNER_OPTIONS.filter((option) => option !== "ALL").map((option) => <option key={option}>{option}</option>)}
                </select>
              </label>
              <label className="nw-mini-field">
                <span>위치 스캔</span>
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(event) => setLocationQuery(event.target.value)}
                  placeholder="구역/위치를 스캔 또는 검색"
                />
              </label>
            </div>
          ) : null}

          {hasLocationScan && !selectedLocation ? (
            <div className="nw-mobile-empty compact">
              <strong>스캔 결과 위치를 찾지 못했습니다.</strong>
              <p>위치 코드를 다시 스캔하거나 검색어를 확인해 주세요.</p>
            </div>
          ) : null}

          <>
              <div className="nw-mobile-section">
                <h4>위치</h4>
                {selectedLocation ? (
                  <div className="nw-adjust-location-summary">
                    <div className="left">
                      <span className="nw-zone-chip">{selectedLocation.zone}</span>
                      <strong>{selectedLocation.locationCode}</strong>
                    </div>
                    <em>상품 {formatNumber(selectedLocationSkuCount)}종</em>
                  </div>
                ) : (
                  <div className="nw-mobile-empty compact">
                    <strong>위치를 스캔하면 해당 위치 기준으로 전환됩니다.</strong>
                    <p>현재는 선택한 화주사의 상품 목록을 먼저 표시하고 있습니다.</p>
                  </div>
                )}
              </div>

              <div className="nw-mobile-section">
                <h4>상품</h4>
                {!selectedProduct ? (
                  <>
                    <input
                      className="nw-adjust-product-search"
                      type="text"
                      value={productQuery}
                      onChange={(event) => setProductQuery(event.target.value)}
                      placeholder="상품 검색"
                    />
                    {selectedLocation ? (
                      hasDemoRows ? <p className="nw-step-helper">위치 매핑 상품이 없어 상품 목록을 보강해 표시하고 있습니다.</p> : null
                    ) : (
                      <p className="nw-step-helper">화주사 기준 상품 목록입니다. 위치를 스캔하면 위치별 상품으로 전환됩니다.</p>
                    )}
                    {locationProducts.length ? (
                      <div className="nw-mobile-list">
                        {locationProducts.map((product) => (
                          <article
                            key={product.id}
                            className="nw-mobile-card compact"
                            onClick={() => {
                              setSelectedProductId(product.id);
                              setActualQty("");
                              setReason("");
                            }}
                          >
                            <div className="nw-mobile-product-head">
                              <div className={`nw-thumb ${getToneClass(product.tone)}`} />
                              <div>
                                <strong>{product.name}</strong>
                                <span>{product.option}</span>
                                <span>{product.barcode}</span>
                                <span className="brand">{product.brand}</span>
                              </div>
                              <div className="qty"><span>{formatNumber(product.systemQty)}개</span></div>
                            </div>
                          </article>
                        ))}
                      </div>
                    ) : (
                      <div className="nw-mobile-empty compact">
                        <strong>표시할 상품이 없습니다.</strong>
                        <p>상품 검색어를 변경해 주세요.</p>
                      </div>
                    )}
                  </>
                ) : (
                  <article className="nw-mobile-card compact selected">
                    <div className="nw-mobile-product-head">
                      <div className={`nw-thumb ${getToneClass(selectedProduct.tone)}`} />
                      <div>
                        <strong>{selectedProduct.name}</strong>
                        <span>{selectedProduct.option}</span>
                        <span>{selectedProduct.barcode}</span>
                        <span className="brand">{selectedProduct.brand}</span>
                      </div>
                      <div className="qty"><span>{formatNumber(selectedProduct.systemQty)}개</span></div>
                    </div>
                  </article>
                )}
              </div>

              {selectedProduct ? (
                <div className="nw-mobile-adjust-form">
                  <h4>재고조정</h4>
                  <div className="line">
                    <span>위치</span>
                    <strong>{effectiveLocation ? `${effectiveLocation.zone} ${effectiveLocation.locationCode}` : "-"}</strong>
                  </div>
                  <div className="line"><span>전산 수량</span><strong>{formatNumber(selectedProduct.systemQty)}개</strong></div>
                  <div className="line">
                    <span>실제 수량</span>
                    <input
                      type="number"
                      min="0"
                      value={actualQty}
                      onChange={(event) => setActualQty(event.target.value)}
                    />
                  </div>
                  <div className="line"><span>조정 수량</span><strong className={adjustmentQty > 0 ? "text-plus" : adjustmentQty < 0 ? "text-minus" : ""}>{adjustmentQty > 0 ? `+${formatNumber(adjustmentQty)}` : formatNumber(adjustmentQty)}</strong></div>
                  <label>
                    조정사유 (선택)
                    <textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="재고 실사 결과 추가 발견" />
                  </label>

                  <div className="nw-btn-row split nw-adjust-request-actions">
                    <button type="button" className="nw-btn" onClick={() => {
                      setSelectedProductId("");
                      setActualQty("");
                    }}
                    >
                      돌아가기
                    </button>
                    <button type="button" className="nw-btn primary" onClick={createRequest} disabled={!canSubmitRequest}>재고 조정 요청</button>
                  </div>
                </div>
              ) : null}
          </>
        </section>
      ) : null}

      {subTab === "history" ? (
        <section className="nw-mobile-adjustment nw-adjust-view history">
          {selectedHistory ? (
            <section className="nw-mobile-adjust-form detail history-detail-only">
              {selectedHistory.status === "승인됨" ? (
                <>
                  <div className="nw-approved-banner">이 항목은 이미 승인되어 수정할 수 없습니다.</div>
                  <div className="nw-mobile-product-head history">
                    <div className={`nw-thumb ${selectedHistoryToneClass}`} />
                    <div>
                      <strong>{selectedHistory.productName}</strong>
                      <span>{selectedHistory.option}</span>
                      <span>{selectedHistory.barcode}</span>
                      <span className="brand">{selectedHistory.brand || "-"}</span>
                    </div>
                    <div className="qty"><span>{formatNumber(selectedHistory.systemQty)}개</span></div>
                  </div>
                  <div className="nw-adjust-loc-row">
                    <span className="nw-zone-chip">{selectedHistory.zone}</span>
                    <strong>{selectedHistory.locationCode}</strong>
                  </div>
                  <div className="line"><span>전산 수량</span><strong>{formatNumber(selectedHistory.systemQty)}개</strong></div>
                  <div className="line"><span>실제 수량</span><strong>{formatNumber(selectedHistory.actualQty)}개</strong></div>
                  <div className="line"><span>조정 수량</span><strong className={selectedHistory.actualQty - selectedHistory.systemQty > 0 ? "text-plus" : "text-minus"}>{selectedHistory.actualQty - selectedHistory.systemQty > 0 ? `+${formatNumber(selectedHistory.actualQty - selectedHistory.systemQty)}` : formatNumber(selectedHistory.actualQty - selectedHistory.systemQty)}개</strong></div>
                  <div className="line"><span>사유</span><strong>{selectedHistory.reason || "-"}</strong></div>
                  <button type="button" className="nw-btn nw-adjust-detail-actions" onClick={() => setSelectedHistoryId("")}>돌아가기</button>
                </>
              ) : (
                <>
                  <div className="nw-mobile-product-head history">
                    <div className={`nw-thumb ${selectedHistoryToneClass}`} />
                    <div>
                      <strong>{selectedHistory.productName}</strong>
                      <span>{selectedHistory.option}</span>
                      <span>{selectedHistory.barcode}</span>
                      <span className="brand">{selectedHistory.brand || "-"}</span>
                    </div>
                    <div className="qty"><span>{formatNumber(selectedHistory.systemQty)}개</span></div>
                  </div>
                  <div className="nw-adjust-loc-row">
                    <span className="nw-zone-chip">{selectedHistory.zone}</span>
                    <strong>{selectedHistory.locationCode}</strong>
                  </div>
                  <div className="line"><span>전산 수량</span><strong>{formatNumber(selectedHistory.systemQty)}개</strong></div>
                  <div className="line">
                    <span>실제 수량</span>
                    <input type="number" min="0" value={detailEdit.actualQty} onChange={(event) => setDetailEdit((prev) => ({ ...prev, actualQty: event.target.value }))} />
                  </div>
                  <div className="line"><span>조정 수량</span><strong className={detailDiff > 0 ? "text-plus" : detailDiff < 0 ? "text-minus" : ""}>{detailDiff > 0 ? `+${formatNumber(detailDiff)}` : formatNumber(detailDiff)}개</strong></div>
                  <label>
                    사유
                    <input className="nw-adjust-detail-reason-input" value={detailEdit.reason} onChange={(event) => setDetailEdit((prev) => ({ ...prev, reason: event.target.value }))} placeholder="재고 실사 결과 추가 발견" />
                  </label>
                  <div className="nw-btn-row split nw-adjust-detail-actions">
                    <button type="button" className="nw-btn" onClick={() => setSelectedHistoryId("")}>돌아가기</button>
                    <button type="button" className="nw-btn primary" onClick={rerequest} disabled={!canRerequest}>재고 조정 재요청</button>
                  </div>
                </>
              )}
            </section>
          ) : (
            <>
              <div className="nw-history-filter-label">조회 기간</div>
              <div className="nw-mobile-filter-grid history">
                <input type="date" value={historyFilter.start} onChange={(event) => setHistoryFilter((prev) => ({ ...prev, start: event.target.value }))} />
                <span className="nw-date-divider">~</span>
                <input type="date" value={historyFilter.end} onChange={(event) => setHistoryFilter((prev) => ({ ...prev, end: event.target.value }))} />
              </div>
              <div className="nw-mobile-filter-grid history-status">
                <select value={historyFilter.status} onChange={(event) => setHistoryFilter((prev) => ({ ...prev, status: event.target.value }))}>
                  <option>ALL</option>
                  <option>대기중</option>
                  <option>승인됨</option>
                  <option>거절됨</option>
                </select>
              </div>
              <button type="button" className="nw-btn primary nw-history-search-btn" onClick={searchHistory}>조회</button>

              {historyLoaded ? (
                <>
                  <div className="nw-adjust-history-meta">
                    <strong>조정 요청 내역</strong>
                    <span>총 {formatNumber(historyRows.length)}건</span>
                  </div>
                  {historyRows.length ? (
                    <div className="nw-mobile-list">
                      {historyRows.map((item) => {
                        const diff = item.actualQty - item.systemQty;
                        const product = findProductByBarcode(item.barcode);
                        return (
                          <article key={item.id} className={`nw-adjust-history-card ${selectedHistoryId === item.id ? "selected" : ""}`} onClick={() => setSelectedHistoryId(item.id)}>
                            <div className="head">
                              <span className={`nw-status ${statusClass(item.status)}`}>{item.status}</span>
                              <em>{item.requestedAt}</em>
                            </div>
                            <div className="nw-mobile-product-head history">
                              <div className={`nw-thumb ${product ? getToneClass(product.tone) : "tone-dark"}`} />
                              <div>
                                <strong>{item.productName}</strong>
                                <span>{item.option}</span>
                                <span>{item.barcode}</span>
                                <span className="brand">{item.brand || "-"}</span>
                              </div>
                              <div className="qty"><span>{formatNumber(item.systemQty)}개</span></div>
                            </div>
                            <div className="nw-adjust-loc-row">
                              <span className="nw-zone-chip">{item.zone}</span>
                              <strong>{item.locationCode}</strong>
                            </div>
                            <div className="qty-row">
                              <b>전산 {formatNumber(item.systemQty)}개</b>
                              <b>실제 {formatNumber(item.actualQty)}개</b>
                              <b className={diff > 0 ? "text-plus" : diff < 0 ? "text-minus" : ""}>{diff > 0 ? `+${formatNumber(diff)}` : formatNumber(diff)}개</b>
                            </div>
                            <span>사유: {item.reason || "-"}</span>
                          </article>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="nw-mobile-empty compact">
                      <strong>조회된 조정 요청이 없습니다.</strong>
                      <p>기간 또는 승인 상태를 변경해 다시 조회해 주세요.</p>
                    </div>
                  )}
                </>
              ) : null}
            </>
          )}
        </section>
      ) : null}
    </>
  );
}

function AdminAdjustmentPanel({ adjustments, setAdjustments, showToast }) {
  const [filters, setFilters] = useState({ owner: "ALL", status: "ALL" });
  const [selectedIds, setSelectedIds] = useState(() => new Set());

  const rows = useMemo(() => adjustments.filter((item) => {
    if (filters.owner !== "ALL" && item.owner !== filters.owner) return false;
    if (filters.status !== "ALL" && item.status !== filters.status) return false;
    return true;
  }), [adjustments, filters]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const approve = (ids) => {
    if (!ids.length) {
      showToast("승인할 요청을 선택하세요.");
      return;
    }
    setAdjustments((prev) => prev.map((item) => {
      if (!ids.includes(item.id)) return item;
      return { ...item, status: "승인됨", approvedAt: getNowString() };
    }));
    showToast(`승인 완료: ${ids.length}건`);
    setSelectedIds(new Set());
  };

  const reject = (ids) => {
    if (!ids.length) {
      showToast("반려할 요청을 선택하세요.");
      return;
    }
    const reason = window.prompt("반려 사유를 입력하세요", "수량 근거 부족");
    if (reason === null) return;
    setAdjustments((prev) => prev.map((item) => {
      if (!ids.includes(item.id)) return item;
      return { ...item, status: "거절됨", approvedAt: getNowString(), reason: reason || item.reason };
    }));
    showToast(`반려 완료: ${ids.length}건`);
    setSelectedIds(new Set());
  };

  return (
    <section className="nw-panel nw-adjust-admin-panel">
      <div className="nw-filter-grid admin-adjustment">
        <label>
          화주사
          <select value={filters.owner} onChange={(event) => setFilters((prev) => ({ ...prev, owner: event.target.value }))}>
            {OWNER_OPTIONS.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
        <label>
          승인 상태
          <select value={filters.status} onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}>
            <option>ALL</option>
            <option>대기중</option>
            <option>승인됨</option>
            <option>거절됨</option>
          </select>
        </label>
      </div>

      <div className="nw-panel-actions">
        <button type="button" className="nw-btn" onClick={() => approve([...selectedIds])}>선택 승인</button>
        <button type="button" className="nw-btn" onClick={() => reject([...selectedIds])}>선택 반려</button>
      </div>

      <div className="nw-table-wrap">
        <table className="nw-table">
          <thead>
            <tr>
              <th />
              <th>요청일시</th>
              <th>작업자</th>
              <th>상품명 / 바코드</th>
              <th>위치</th>
              <th>전산</th>
              <th>실제</th>
              <th>조정</th>
              <th>사유</th>
              <th>상태</th>
              <th>승인/반려일시</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const diff = row.actualQty - row.systemQty;
              return (
                <tr key={row.id}>
                  <td><input type="checkbox" checked={selectedIds.has(row.id)} onChange={() => toggleSelect(row.id)} /></td>
                  <td>{row.requestedAt}</td>
                  <td>{row.worker}</td>
                  <td>{row.productName} / {row.barcode}</td>
                  <td>{row.zone} {row.locationCode}</td>
                  <td>{formatNumber(row.systemQty)}</td>
                  <td>{formatNumber(row.actualQty)}</td>
                  <td className={diff > 0 ? "text-plus" : diff < 0 ? "text-minus" : ""}>{diff > 0 ? `+${formatNumber(diff)}` : formatNumber(diff)}</td>
                  <td>{row.reason || "-"}</td>
                  <td><span className={`nw-status ${statusClass(row.status)}`}>{row.status}</span></td>
                  <td>{row.approvedAt || "-"}</td>
                  <td>
                    <div className="nw-btn-row">
                      <button type="button" className="nw-btn tiny" disabled={row.status !== "대기중"} onClick={() => approve([row.id])}>승인</button>
                      <button type="button" className="nw-btn tiny" disabled={row.status !== "대기중"} onClick={() => reject([row.id])}>반려</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function InventorySurveyPage() {
  const { toast, showToast } = useToast();
  const [activeTab, setActiveTab] = useState("lookup");
  const [surveyEntries, setSurveyEntries] = useState([
    {
      id: "survey-seed-1",
      owner: "화주사 2",
      round: "2026-03-1차",
      barcode: "880123456789",
      locationCode: "WHO1-A01-01-01",
      qty: 145,
      memo: "파손 5개 제외",
      source: "바코드스캔",
      status: "조사중",
      worker: "김작업",
      createdAt: "2026-03-04 09:15",
      productName: "나이키 에어맥스 270",
      option: "블랙/화이트, 270mm",
    },
    {
      id: "survey-seed-2",
      owner: "화주사 2",
      round: "2026-03-1차",
      barcode: "880987654321",
      locationCode: "WHO1-B02-01-01",
      qty: 200,
      memo: "",
      source: "개별입력",
      status: "실입고완료",
      worker: "이관리",
      createdAt: "2026-03-04 09:32",
      productName: "아디다스 울트라부스트",
      option: "핑크, 250mm",
    },
    {
      id: "survey-seed-3",
      owner: "안나엔모드",
      round: "2026-02-3차",
      barcode: "81231341295122",
      locationCode: "4E-AX-02-1",
      qty: 1,
      memo: "",
      source: "CSV업로드",
      status: "실입고완료",
      worker: "박검수",
      createdAt: "2026-03-03 16:24",
      productName: "(아동)❤쫄깃기본티(1+1)[티셔츠BANX23]",
      option: "아이보리,M",
    },
  ]);
  const [adjustments, setAdjustments] = useState([
    {
      id: "adj-seed-1",
      requestedAt: "2026-01-26 15:45",
      owner: "화주사 2",
      worker: "김작업",
      productName: "나이키 에어맥스 270",
      option: "블랙/화이트, 270mm",
      barcode: "880123456789",
      brand: "나이키코리아",
      zone: "보관존",
      locationCode: "4E-A-01-1",
      systemQty: 150,
      actualQty: 145,
      reason: "파손 제품 발견",
      status: "승인됨",
      approvedAt: "2026-01-26 16:02",
    },
    {
      id: "adj-seed-2",
      requestedAt: "2026-01-25 11:20",
      owner: "화주사 2",
      worker: "김작업",
      productName: "테스트테스트",
      option: "옵션2",
      barcode: "1234567890124",
      brand: "브랜드B",
      zone: "보관존",
      locationCode: "2A-C-03-2",
      systemQty: 150,
      actualQty: 140,
      reason: "분실",
      status: "거절됨",
      approvedAt: "2026-01-25 11:40",
    },
    {
      id: "adj-seed-3",
      requestedAt: "2026-01-26 15:45",
      owner: "화주사 2",
      worker: "김작업",
      productName: "테스트테스트",
      option: "옵션1",
      barcode: "1234567890123",
      brand: "브랜드A",
      zone: "입고존",
      locationCode: "3C-B-02-5",
      systemQty: 150,
      actualQty: 155,
      reason: "재고 실사 결과 추가 발견",
      status: "대기중",
      approvedAt: "",
    },
  ]);
  const [adjustmentRole, setAdjustmentRole] = useState("worker");
  const surveyStats = useMemo(() => ({
    total: surveyEntries.length,
    inProgress: surveyEntries.filter((entry) => entry.status === "조사중").length,
    completed: surveyEntries.filter((entry) => entry.status === "실입고완료").length,
    pendingAdjustments: adjustments.filter((item) => item.status === "대기중").length,
  }), [surveyEntries, adjustments]);

  const tabGuide = {
    lookup: { title: "재고 조회", description: "위치, 바코드, 상품명 기준으로 시스템 재고를 빠르게 확인합니다." },
    input: { title: "조사 재고 입력", description: "스캔/입력/업로드로 조사 재고를 수집하고 즉시 저장합니다." },
    compare: { title: "현재고 대조", description: "전산재고와 조사재고 차이를 확인하고 재고조정 연계까지 처리합니다." },
    history: { title: "작업내역", description: "조사 이력, 담당자, 상태를 날짜 기준으로 조회합니다." },
    adjustment: { title: "재고 조정", description: "위치 선택 > 상품 선택 > 조정 요청의 순서로 정정 요청을 생성합니다." },
  };
  const activeGuide = tabGuide[activeTab] || tabGuide.lookup;

  return (
    <SidebarLayout title="재고조사">
      <div className="nw-survey-page">
        <div className="nw-page-head">
          <div>
            <h2>재고조사 통합 메뉴</h2>
            <p>재고 조회 / 조사 재고 입력 / 현재고 대조 / 작업내역 / 재고 조정을 한 화면에서 제공합니다.</p>
          </div>
        </div>

        <section className="nw-panel nw-survey-overview">
          <div className="nw-survey-kpi-grid">
            <article className="nw-survey-kpi">
              <span>전체 조사 건수</span>
              <strong>{formatNumber(surveyStats.total)}</strong>
            </article>
            <article className="nw-survey-kpi">
              <span>조사 진행중</span>
              <strong>{formatNumber(surveyStats.inProgress)}</strong>
            </article>
            <article className="nw-survey-kpi">
              <span>실입고 완료</span>
              <strong>{formatNumber(surveyStats.completed)}</strong>
            </article>
            <article className="nw-survey-kpi">
              <span>조정 대기</span>
              <strong>{formatNumber(surveyStats.pendingAdjustments)}</strong>
            </article>
          </div>
          <div className="nw-survey-guide">
            <strong>{activeGuide.title}</strong>
            <span>{activeGuide.description}</span>
          </div>
        </section>

        <div className="nw-tabs survey-tabs">
          <button type="button" className={activeTab === "lookup" ? "active" : ""} onClick={() => setActiveTab("lookup")}>재고 조회</button>
          <button type="button" className={activeTab === "input" ? "active" : ""} onClick={() => setActiveTab("input")}>조사 재고 입력</button>
          <button type="button" className={activeTab === "compare" ? "active" : ""} onClick={() => setActiveTab("compare")}>현재고 대조</button>
          <button type="button" className={activeTab === "history" ? "active" : ""} onClick={() => setActiveTab("history")}>작업내역</button>
          <button type="button" className={activeTab === "adjustment" ? "active" : ""} onClick={() => setActiveTab("adjustment")}>재고 조정</button>
        </div>

        {activeTab === "lookup" ? <InventoryLookupTab onMoveToInput={() => setActiveTab("input")} /> : null}
        {activeTab === "input" ? <SurveyInputTab surveyEntries={surveyEntries} setSurveyEntries={setSurveyEntries} showToast={showToast} /> : null}
        {activeTab === "compare" ? <CurrentCompareTab surveyEntries={surveyEntries} setAdjustments={setAdjustments} showToast={showToast} /> : null}
        {activeTab === "history" ? <WorkHistoryTab surveyEntries={surveyEntries} /> : null}

        {activeTab === "adjustment" ? (
          <>
            <section className="nw-panel nw-adjust-role-panel">
              <div className="nw-panel-title-row">
                <h3>재고 조정</h3>
                <div className="nw-btn-row">
                  <button type="button" className={`nw-btn tiny ${adjustmentRole === "worker" ? "active" : ""}`} onClick={() => setAdjustmentRole("worker")}>작업자 화면</button>
                  <button type="button" className={`nw-btn tiny ${adjustmentRole === "admin" ? "active" : ""}`} onClick={() => setAdjustmentRole("admin")}>관리자 화면</button>
                </div>
              </div>
            </section>

            {adjustmentRole === "worker" ? (
              <WorkerAdjustmentPanel adjustments={adjustments} setAdjustments={setAdjustments} showToast={showToast} />
            ) : (
              <AdminAdjustmentPanel adjustments={adjustments} setAdjustments={setAdjustments} showToast={showToast} />
            )}
          </>
        ) : null}
      </div>

      <GlobalToast message={toast} />
    </SidebarLayout>
  );
}

function NewWmsApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/inventory-survey" element={<InventorySurveyPage />} />
        <Route path="/location-stock" element={<LocationStockPage />} />
        <Route path="/slow-moving" element={<SlowMovingPage />} />
        <Route path="/slow-moving-2" element={<SlowMoving2Page />} />
        <Route path="/" element={<Navigate to="/inventory-survey" replace />} />
        <Route path="*" element={<Navigate to="/inventory-survey" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default NewWmsApp;

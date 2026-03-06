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

const INITIAL_SURVEY_ENTRIES = [
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
];

const INITIAL_ADJUSTMENTS = [
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
];

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

function normalizeLookupValue(value) {
  return String(value ?? "").trim();
}

function findProductByBarcode(barcode, owner = "") {
  const normalizedBarcode = normalizeLookupValue(barcode);
  if (!normalizedBarcode) return undefined;

  return PRODUCT_MASTER.find((product) => (
    product.barcode === normalizedBarcode
    && (!owner || owner === "ALL" || product.owner === owner)
  ));
}

function findProductByLookup(value, owner = "") {
  const normalized = normalizeLookupValue(value);
  if (!normalized) return undefined;

  const lower = normalized.toLowerCase();
  return PRODUCT_MASTER.find((product) => (
    (!owner || owner === "ALL" || product.owner === owner)
    && (product.barcode === normalized || product.id.toLowerCase() === lower)
  ));
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
          <NavLink to="/inventory-adjustment" className={({ isActive }) => `nw-nav-item ${isActive ? "active" : ""}`}>
            재고조정
          </NavLink>
          <NavLink to="/location-stock" className={({ isActive }) => `nw-nav-item ${isActive ? "active" : ""}`}>
            위치별 재고 현황
          </NavLink>
          <NavLink to="/slow-moving" className={({ isActive }) => `nw-nav-item ${isActive ? "active" : ""}`}>
            부진재고
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
  pageDescription = "SKU 단위 필터 + 위치 단위 출력, 대시보드/리스트 전환",
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

  const riskRows = useMemo(() => {
    const zonePriority = {
      출고존: 1,
      입고존: 0.88,
      보관존: 0.46,
      반품존: 0.34,
      뮬랑: 0.26,
    };
    const zoneRecommendation = {
      출고존: "출고존 점유 해소: 보관존으로 이동",
      입고존: "입고 회전 슬롯 점유: 보관존으로 이동",
      보관존: "보관존 후면/저비용 구역으로 재배치",
      반품존: "반품존 장기 체류: 처리/회수 검토",
      뮬랑: "일반 구역 재배치 또는 처리 계획 수립",
    };

    const maxQty = Math.max(...filteredRows.map((row) => row.availableQty + row.reservedQty), 1);
    return filteredRows
      .map((row) => {
        const qty = row.availableQty + row.reservedQty;
        const ageWeight = Math.min(1, row.daysNoOutbound / 365);
        const zoneWeight = zonePriority[row.zone] ?? 0.4;
        const qtyWeight = maxQty > 0 ? qty / maxQty : 0;
        const availableShare = qty > 0 ? row.availableQty / qty : 0;
        const priorityScore = Math.round(((ageWeight * 0.42) + (zoneWeight * 0.28) + (qtyWeight * 0.2) + (availableShare * 0.1)) * 100);
        const actionLevel = priorityScore >= 75 ? "즉시 이동" : priorityScore >= 60 ? "우선 이동" : priorityScore >= 45 ? "모니터링" : "관찰";
        return {
          ...row,
          qty,
          ageWeight,
          zoneWeight,
          qtyWeight,
          availableShare,
          priorityScore,
          actionLevel,
          recommendation: zoneRecommendation[row.zone] || "보관 비용 관점에서 재배치 검토",
        };
      })
      .sort((a, b) => b.priorityScore - a.priorityScore || b.qty - a.qty);
  }, [filteredRows]);

  const decisionSummary = useMemo(() => {
    const primeZoneSet = new Set(["출고존", "입고존"]);
    const highRiskRows = riskRows.filter((row) => row.priorityScore >= 70);
    const moveRows = riskRows.filter((row) => row.priorityScore >= 60);
    const primeQty = riskRows
      .filter((row) => primeZoneSet.has(row.zone))
      .reduce((sum, row) => sum + row.qty, 0);
    const highRiskQty = highRiskRows.reduce((sum, row) => sum + row.qty, 0);
    const avgRisk = riskRows.length
      ? riskRows.reduce((sum, row) => sum + row.priorityScore, 0) / riskRows.length
      : 0;

    return {
      moveLocationCount: moveRows.length,
      highRiskLocationCount: highRiskRows.length,
      primeQty,
      highRiskQty,
      avgRisk,
    };
  }, [riskRows]);

  const topRiskRows = useMemo(() => riskRows.slice(0, 10), [riskRows]);

  const priorityActionRows = useMemo(
    () => riskRows.filter((row) => row.priorityScore >= 55).slice(0, 8),
    [riskRows],
  );

  const zoneDecisionSummary = useMemo(() => {
    const order = ["출고존", "입고존", "보관존", "반품존", "뮬랑"];
    const source = order.map((zone) => ({
      zone,
      totalQty: 0,
      availableQty: 0,
      reservedQty: 0,
      priorityQty: 0,
      locationCount: 0,
      riskTotal: 0,
      samples: [],
    }));

    riskRows.forEach((row) => {
      const target = source.find((item) => item.zone === row.zone);
      if (!target) return;
      target.totalQty += row.qty;
      target.availableQty += row.availableQty;
      target.reservedQty += row.reservedQty;
      target.locationCount += 1;
      target.riskTotal += row.priorityScore;
      if (row.priorityScore >= 60) target.priorityQty += row.qty;
      target.samples.push({
        owner: row.owner,
        productName: row.productName,
        area: row.area,
        locationCode: row.locationCode,
        priorityScore: row.priorityScore,
        availableQty: row.availableQty,
        reservedQty: row.reservedQty,
        qty: row.qty,
      });
    });

    return source.map((item) => ({
      ...item,
      normalQty: Math.max(item.totalQty - item.priorityQty, 0),
      avgRisk: item.locationCount ? item.riskTotal / item.locationCount : 0,
      samples: item.samples
        .sort((a, b) => b.priorityScore - a.priorityScore || b.qty - a.qty)
        .slice(0, 2),
    }));
  }, [riskRows]);

  const agingQtyBuckets = useMemo(() => {
    const source = [
      { label: "0~89일", min: 0, max: 89, available: 0, reserved: 0, locations: 0 },
      { label: "90~179일", min: 90, max: 179, available: 0, reserved: 0, locations: 0 },
      { label: "180~364일", min: 180, max: 364, available: 0, reserved: 0, locations: 0 },
      { label: "365일+", min: 365, max: Number.MAX_SAFE_INTEGER, available: 0, reserved: 0, locations: 0 },
    ];

    filteredRows.forEach((row) => {
      const bucket = source.find((item) => row.daysNoOutbound >= item.min && row.daysNoOutbound <= item.max);
      if (!bucket) return;
      bucket.available += row.availableQty;
      bucket.reserved += row.reservedQty;
      bucket.locations += 1;
    });

    return source;
  }, [filteredRows]);

  const topRiskBarData = useMemo(() => ({
    labels: topRiskRows.map((row) => row.locationCode),
    datasets: [
      {
        label: "우선순위 점수",
        data: topRiskRows.map((row) => row.priorityScore),
        backgroundColor: topRiskRows.map((row) => (row.priorityScore >= 75 ? "#e35b5b" : row.priorityScore >= 60 ? "#f2a341" : "#69b3ff")),
        borderRadius: 6,
        maxBarThickness: 18,
      },
    ],
  }), [topRiskRows]);

  const zoneDecisionBarData = useMemo(() => ({
    labels: zoneDecisionSummary.map((item) => item.zone),
    datasets: [
      {
        label: "우선 이동 수량",
        data: zoneDecisionSummary.map((item) => item.priorityQty),
        backgroundColor: "#f2a341",
        borderRadius: 6,
        stack: "qty",
      },
      {
        label: "일반 수량",
        data: zoneDecisionSummary.map((item) => item.normalQty),
        backgroundColor: "#8fbeff",
        borderRadius: 6,
        stack: "qty",
      },
    ],
  }), [zoneDecisionSummary]);

  const agingQtyBarData = useMemo(() => ({
    labels: agingQtyBuckets.map((item) => item.label),
    datasets: [
      {
        label: "가용 재고",
        data: agingQtyBuckets.map((item) => item.available),
        backgroundColor: "#5da6ff",
        borderRadius: 6,
        stack: "qty",
      },
      {
        label: "예약 재고",
        data: agingQtyBuckets.map((item) => item.reserved),
        backgroundColor: "#f2a341",
        borderRadius: 6,
        stack: "qty",
      },
    ],
  }), [agingQtyBuckets]);

  const zoneAvgRiskBarData = useMemo(() => ({
    labels: zoneDecisionSummary.map((item) => item.zone),
    datasets: [
      {
        label: "존 평균 리스크 점수",
        data: zoneDecisionSummary.map((item) => Number(item.avgRisk.toFixed(1))),
        backgroundColor: zoneDecisionSummary.map((item) => (item.avgRisk >= 75 ? "#e35b5b" : item.avgRisk >= 60 ? "#f2a341" : "#74b6ff")),
        borderRadius: 6,
        maxBarThickness: 34,
      },
    ],
  }), [zoneDecisionSummary]);

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
      : filteredRows;
    if (!sourcePoints.length) {
      setSelectedLocationCode("");
      return;
    }
    const hasSelected = sourcePoints.some((point) => point.locationCode === selectedLocationCode);
    if (!hasSelected) {
      setSelectedLocationCode(sourcePoints[0].locationCode);
    }
  }, [selectedLocationCode, filteredRows, v2VisualRows, visualVariant]);

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

  const topRiskBarOptions = useMemo(() => {
    const options = chartBaseOptions();
    return {
      ...options,
      indexAxis: "y",
      plugins: {
        ...options.plugins,
        legend: { display: false },
        tooltip: {
          ...options.plugins.tooltip,
          callbacks: {
            label: (context) => {
              const row = topRiskRows[context.dataIndex];
              if (!row) return `${context.raw}점`;
              return `${row.zone} | ${formatNumber(row.qty)}개 | ${context.raw}점`;
            },
          },
        },
      },
      scales: {
        ...options.scales,
        x: {
          ...options.scales.x,
          min: 0,
          max: 100,
          ticks: { ...options.scales.x.ticks, stepSize: 20 },
        },
        y: {
          ...options.scales.y,
          ticks: { ...options.scales.y.ticks, autoSkip: false },
        },
      },
    };
  }, [topRiskRows]);

  const stackedQtyOptions = useMemo(() => {
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
        ...options.scales,
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

  const riskScoreBarOptions = useMemo(() => {
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
          min: 0,
          max: 100,
          ticks: { ...options.scales.y.ticks, stepSize: 20 },
        },
      },
    };
  }, []);

  const selectedRiskRow = useMemo(
    () => riskRows.find((row) => row.locationCode === selectedLocationCode) || riskRows[0] || null,
    [riskRows, selectedLocationCode],
  );

  const slowRiskBubbleData = useMemo(() => {
    if (!riskRows.length) return { datasets: [] };
    const zoneAxis = { 반품존: 1, 뮬랑: 2, 보관존: 3, 입고존: 4, 출고존: 5 };
    const toColor = (score) => {
      if (score >= 75) return "rgba(227, 91, 91, 0.58)";
      if (score >= 60) return "rgba(242, 163, 65, 0.56)";
      return "rgba(88, 161, 247, 0.5)";
    };

    const mainDataset = {
      label: "위치",
      data: riskRows.map((row) => ({
        ...row,
        x: zoneAxis[row.zone] ?? 3,
        y: row.daysNoOutbound,
        r: Math.max(7, Math.min(22, 6 + Math.sqrt(row.qty) * 1.8)),
      })),
      backgroundColor: riskRows.map((row) => toColor(row.priorityScore)),
      borderColor: riskRows.map((row) => (row.priorityScore >= 75 ? "#d23a3a" : row.priorityScore >= 60 ? "#c16e1e" : "#2c7fe7")),
      borderWidth: 1.5,
      hoverBorderWidth: 2.5,
    };

    const selectedDataset = selectedRiskRow
      ? {
        label: "선택",
        data: [
          {
            ...selectedRiskRow,
            x: zoneAxis[selectedRiskRow.zone] ?? 3,
            y: selectedRiskRow.daysNoOutbound,
            r: Math.max(10, Math.min(24, 8 + Math.sqrt(selectedRiskRow.qty) * 2)),
          },
        ],
        backgroundColor: "rgba(28, 122, 232, 0.2)",
        borderColor: "#0f6ed6",
        borderWidth: 2.5,
      }
      : null;

    return {
      datasets: selectedDataset ? [mainDataset, selectedDataset] : [mainDataset],
    };
  }, [riskRows, selectedRiskRow]);

  const slowRiskBubbleOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    onClick: (_, elements, chart) => {
      if (!elements.length) return;
      const element = elements[0];
      const dataset = chart.data.datasets[element.datasetIndex];
      const row = dataset?.data?.[element.index] || null;
      if (!row?.locationCode) return;
      setSelectedLocationCode(row.locationCode);
      if (row.skuId) setSelectedSkuId(row.skuId);
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1f2c3f",
        bodyFont: { family: "Noto Sans KR", size: 11 },
        callbacks: {
          title: (items) => items[0]?.raw?.locationCode || "",
          label: (context) => {
            const row = context.raw || {};
            return `${row.zone} | 미출고 ${formatNumber(row.daysNoOutbound)}일 | ${formatNumber(row.qty)}개 | ${formatNumber(row.priorityScore)}점`;
          },
          afterLabel: (context) => context.raw?.recommendation || "",
        },
      },
    },
    scales: {
      x: {
        min: 0.5,
        max: 5.5,
        grid: { color: "#edf2f8" },
        border: { color: CHART_COLORS.line },
        ticks: {
          stepSize: 1,
          color: CHART_COLORS.text,
          callback: (value) => ({
            1: "반품존",
            2: "뮬랑",
            3: "보관존",
            4: "입고존",
            5: "출고존",
          }[value] || ""),
          font: { family: "Noto Sans KR", size: 11 },
        },
        title: {
          display: true,
          text: "위치 가치 (오른쪽일수록 핵심 위치)",
          color: CHART_COLORS.text,
          font: { family: "Noto Sans KR", size: 11, weight: 600 },
        },
      },
      y: {
        min: 0,
        max: Math.max(120, ...riskRows.map((row) => row.daysNoOutbound)) + 40,
        grid: { color: "#edf2f8" },
        border: { color: CHART_COLORS.line },
        ticks: {
          color: CHART_COLORS.text,
          font: { family: "Noto Sans KR", size: 11 },
        },
        title: {
          display: true,
          text: "미출고 일수",
          color: CHART_COLORS.text,
          font: { family: "Noto Sans KR", size: 11, weight: 600 },
        },
      },
    },
  }), [riskRows]);

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
            존
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
          <button type="button" className="nw-btn" onClick={() => showToast("엑셀 다운로드를 시작합니다 (데모)")}>엑셀 다운로드</button>
          <button type="button" className="nw-btn" onClick={handleReset}>새로 검색</button>
        </div>
      </section>

      <section className="nw-summary-grid slow-kpi">
        <article className="nw-summary-card">
          <div className="label">우선 이동 필요 위치</div>
          <strong>{formatNumber(decisionSummary.moveLocationCount)}</strong>
          <span>각 위치를 미출고 기간, 해당 존의 위치 가치(핵심 존 여부), 수량 규모, 가용 재고 비중으로 평가해 점수를 만들고, 60점 이상인 위치를 우선 이동 대상으로 집계한 값입니다.</span>
        </article>
        <article className="nw-summary-card warn">
          <div className="label">핵심 존 점유 수량</div>
          <strong>{formatNumber(decisionSummary.primeQty)}</strong>
          <span>입고존과 출고존에 있는 위치들의 가용 수량+예약 수량을 모두 더한 값입니다.</span>
        </article>
        <article className="nw-summary-card danger">
          <div className="label">즉시 조치 재고 수량</div>
          <strong>{formatNumber(decisionSummary.highRiskQty)}</strong>
          <span>리스크 점수 70점 이상 위치(전체 존)의 가용 수량+예약 수량을 모두 더한 값입니다.</span>
        </article>
        <article className="nw-summary-card">
          <div className="label">평균 리스크 점수</div>
          <strong>{decisionSummary.avgRisk.toFixed(1)}</strong>
          <span>각 위치의 점수(미출고 일수, 위치 가치, 수량 비중, 가용 비중 반영)를 평균낸 값입니다.</span>
        </article>
      </section>

      <section className="nw-chart-grid slow">
        <ChartPanel title="좋은 위치 점유 우선순위 TOP 10" helper="점수가 높을수록 먼저 이동/처리 검토">
          <Bar data={topRiskBarData} options={topRiskBarOptions} />
        </ChartPanel>

        <ChartPanel title="존별 우선 이동 수량" helper="핵심 위치의 부진재고 점유량 확인">
          <Bar data={zoneDecisionBarData} options={stackedQtyOptions} />
        </ChartPanel>

        <ChartPanel title="체류 구간별 가용/예약 수량" helper="장기 체류 + 수량 큰 구간 우선 검토">
          <Bar data={agingQtyBarData} options={stackedQtyOptions} />
        </ChartPanel>
      </section>

      {viewMode === "list" ? (
        <section className="nw-panel">
          <div className="nw-panel-title-row">
            <h3>추출 결과</h3>
            <div className="nw-helper-text">
              SKU 단위 조건으로 추출된 위치 목록입니다. 행 클릭 후 시각화 화면에서 이동/처리 우선순위를 확인할 수 있습니다.
            </div>
          </div>

          <div className="nw-table-wrap">
            <table className="nw-table">
              <thead>
                <tr>
                  <th>화주사</th>
                  <th>상품명</th>
                  <th>옵션명</th>
                  <th>존</th>
                  <th>구역</th>
                  <th>위치</th>
                  <th>시즌</th>
                  <th>최근 출고일</th>
                  <th>최근 입고일</th>
                  <th>가용 재고 수량</th>
                  <th>예약 재고 수량</th>
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
                    <td><span className="nw-zone-chip">{row.zone}</span></td>
                    <td>{row.area}</td>
                    <td>{row.locationCode}</td>
                    <td><span className="nw-season-chip">{row.season}</span></td>
                    <td>{row.lastOutboundDate}</td>
                    <td>{row.lastInboundDate}</td>
                    <td>{formatNumber(row.availableQty)}</td>
                    <td>{formatNumber(row.reservedQty)}</td>
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
            <h3>부진재고 의사결정 시각화</h3>
            <div className="nw-btn-row">
              <button
                type="button"
                className="nw-btn"
                onClick={() => showToast("시각화 기준 우선순위 엑셀 다운로드 (데모)")}
              >
                엑셀 다운로드 (우선순위)
              </button>
            </div>
          </div>

          {filteredRows.length ? (
            <>
              <div className="nw-visual-meta">
                <div><span>센터</span><strong>{filters.center}</strong></div>
                <div><span>고유 SKU 수</span><strong>{formatNumber(summary.skuCount)}개</strong></div>
                <div><span>위치 수</span><strong>{formatNumber(filteredRows.length)}개</strong></div>
                <div><span>가용/예약 합계</span><strong>{formatNumber(summary.totalAvailable)} / {formatNumber(summary.totalReserved)}</strong></div>
              </div>

              <section className="nw-chart-grid slow-visual-main">
                <section className="nw-chart-panel">
                  <div className="nw-panel-title-row mini">
                    <h4>이동/처리 우선순위</h4>
                    <div className="nw-helper-text">점수 55점 이상 위치 · 리스트 표기: [존 배지] · 구역 · 조치레벨</div>
                  </div>
                  <div className="nw-chart-body decision-list">
                    {priorityActionRows.length ? (
                      <div className="nw-hotspot-list">
                        {priorityActionRows.map((row, index) => (
                          <button
                            key={row.rowId}
                            type="button"
                            className={`nw-hotspot-row ${selectedLocationCode === row.locationCode ? "active" : ""}`}
                            onClick={() => {
                              setSelectedLocationCode(row.locationCode);
                              setSelectedSkuId(row.skuId);
                            }}
                          >
                            <div className="rank">{index + 1}</div>
                            <div className="meta">
                              <strong>{row.locationCode}</strong>
                              <em><span className="zone">{row.zone}</span> · {row.area} · {row.actionLevel}</em>
                            </div>
                            <div className="bar">
                              <i style={{ width: `${Math.min(100, Math.max(row.priorityScore, 2))}%` }} />
                            </div>
                            <b>{row.priorityScore}점</b>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="nw-empty inline">우선 조치 대상이 없습니다.</div>
                    )}
                  </div>
                </section>
              </section>

              <section className="nw-panel slow-zone-visual-panel">
                <div className="nw-panel-title-row mini">
                  <h4>존별 시각화</h4>
                  <div className="nw-helper-text">리스트와 전환되는 시각화 영역으로, 5개 존(입고/보관/출고/반품/뮬랑)을 모두 카드로 표시합니다. 재고 수량은 가용 기준이며 예약은 별도 표기합니다.</div>
                </div>
                <div className="nw-zone-visual-grid">
                  {zoneDecisionSummary.map((item) => {
                    const priorityPct = item.totalQty > 0 ? (item.priorityQty / item.totalQty) * 100 : 0;
                    const riskPct = Math.min(100, Math.max(item.avgRisk, 0));
                    const sampleRows = item.samples.length
                      ? [
                        ...item.samples,
                        ...Array.from({ length: Math.max(0, 2 - item.samples.length) }, (_, index) => ({
                          key: `pad-${index}`,
                          placeholder: true,
                          owner: "데이터 없음",
                          productName: "해당 없음",
                          area: "-",
                          locationCode: "-",
                          availableQty: 0,
                          reservedQty: 0,
                        })),
                      ]
                      : Array.from({ length: 2 }, (_, index) => ({
                        key: `empty-${index}`,
                        placeholder: true,
                        owner: "데이터 없음",
                        productName: "해당 없음",
                        area: "-",
                        locationCode: "-",
                        availableQty: 0,
                        reservedQty: 0,
                      }));
                    return (
                      <article key={item.zone} className="nw-zone-visual-card">
                        <div className="head">
                          <span className="nw-zone-chip">{item.zone}</span>
                          <em>{formatNumber(item.locationCount)}개 위치</em>
                        </div>
                        <div className="metrics">
                          <div><span>재고 수량</span><strong>{formatNumber(item.availableQty)}</strong></div>
                          <div><span>예약 수량</span><strong>{formatNumber(item.reservedQty)}</strong></div>
                          <div><span>우선 이동</span><strong>{formatNumber(item.priorityQty)}</strong></div>
                        </div>
                        <div className="bars">
                          <div className="label">
                            <span>우선 이동 비중</span>
                            <b>{priorityPct.toFixed(1)}%</b>
                          </div>
                          <div className="track">
                            <i style={{ width: `${priorityPct}%` }} />
                          </div>
                        </div>
                        <div className="bars risk">
                          <div className="label">
                            <span>평균 리스크</span>
                            <b>{item.avgRisk.toFixed(1)}점</b>
                          </div>
                          <div className="track">
                            <i style={{ width: `${riskPct}%` }} />
                          </div>
                        </div>
                        <div className="samples">
                          {sampleRows.map((sample, index) => (
                            <div key={`${item.zone}-sample-${sample.key || index}`} className={`sample-item ${sample.placeholder ? "placeholder" : ""}`}>
                              <strong>{sample.placeholder ? "데이터 없음" : `${sample.owner} · ${sample.productName}`}</strong>
                              <div className="sample-meta">
                                <span>구역 {sample.area || "-"}</span>
                                <span>위치 {sample.locationCode || "-"}</span>
                              </div>
                              <em>재고 {formatNumber(sample.availableQty)} / 예약 {formatNumber(sample.reservedQty)}</em>
                            </div>
                          ))}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            </>
          ) : (
            <div className="nw-empty">시각화할 데이터가 없습니다.</div>
          )}
        </section>
      )}

      <GlobalToast message={toast} />
    </SidebarLayout>
  );
}

function SlowMovingPage() {
  return <SlowMovingBasePage />;
}

function LocationStockPage() {
  const { toast, showToast } = useToast();
  const [filters, setFilters] = useState({
    owner: "ALL",
    zone: "ALL",
    area: "ALL",
    location: "",
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
  const [selectedRowIds, setSelectedRowIds] = useState(() => new Set());
  const selectAllRef = useRef(null);

  const sourceRows = useMemo(
    () =>
      LOCATION_STOCK_ROWS.map((row) => ({
        ...row,
        areaCode: getAreaFromLocationCode(row.locationCode),
        util: row.capacity > 0 ? (row.stock / row.capacity) * 100 : 0,
      })),
    [],
  );

  const ownerOptions = useMemo(() => ["ALL", ...new Set(sourceRows.map((row) => row.owner))], [sourceRows]);
  const zoneOptions = useMemo(() => ["ALL", ...new Set(sourceRows.map((row) => row.zone))], [sourceRows]);

  const areaOptions = useMemo(() => {
    const list = sourceRows
      .filter((row) => (filters.owner === "ALL" || row.owner === filters.owner) && (filters.zone === "ALL" || row.zone === filters.zone))
      .map((row) => row.areaCode);
    return ["ALL", ...new Set(list)];
  }, [sourceRows, filters.owner, filters.zone]);

  useEffect(() => {
    if (filters.area !== "ALL" && !areaOptions.includes(filters.area)) {
      setFilters((prev) => ({ ...prev, area: "ALL" }));
    }
  }, [areaOptions, filters.area]);

  const filteredRows = useMemo(
    () => sourceRows.filter((row) => {
      const query = filters.location.trim().toLowerCase();
      const target = `${row.locationCode} ${row.areaCode} ${row.center} ${row.zone} ${row.owner}`.toLowerCase();
      if (filters.owner !== "ALL" && row.owner !== filters.owner) return false;
      if (filters.zone !== "ALL" && row.zone !== filters.zone) return false;
      if (filters.area !== "ALL" && row.areaCode !== filters.area) return false;
      if (query && !target.includes(query)) return false;
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

  const listRows = useMemo(
    () => [...filteredRows].sort((a, b) => String(a.locationCode).localeCompare(String(b.locationCode))),
    [filteredRows],
  );

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
    return Object.entries(groups);
  }, [visualRows]);

  const listCenterSummaries = useMemo(() => {
    const map = {};
    filteredRows.forEach((row) => {
      if (!map[row.center]) {
        map[row.center] = {
          center: row.center,
          stock: 0,
          available: 0,
          reserved: 0,
          count: 0,
          utilTotal: 0,
        };
      }
      map[row.center].stock += row.stock;
      map[row.center].available += row.available;
      map[row.center].reserved += row.reserved;
      map[row.center].count += 1;
      map[row.center].utilTotal += row.util;
    });
    return Object.values(map)
      .map((item) => ({
        ...item,
        reservedRatio: item.stock > 0 ? (item.reserved / item.stock) * 100 : 0,
        avgUtil: item.count > 0 ? item.utilTotal / item.count : 0,
      }))
      .sort((a, b) => String(a.center).localeCompare(String(b.center)));
  }, [filteredRows]);

  useEffect(() => {
    const visibleIds = new Set(filteredRows.map((row) => row.id));

    setSelectedRowIds((prev) => {
      let changed = false;
      const next = new Set();
      prev.forEach((id) => {
        if (visibleIds.has(id)) next.add(id);
        else changed = true;
      });
      return changed ? next : prev;
    });

    if (!filteredRows.length) {
      setFocusLocationId("");
      return;
    }

    if (!focusLocationId || !filteredRows.some((row) => row.id === focusLocationId)) {
      setFocusLocationId(filteredRows[0].id);
    }
  }, [filteredRows, focusLocationId]);

  const focusLocation = filteredRows.find((row) => row.id === focusLocationId) || null;

  const selectedRows = useMemo(
    () => filteredRows.filter((row) => selectedRowIds.has(row.id)),
    [filteredRows, selectedRowIds],
  );

  const summarizeRows = (rows) => {
    const totalStock = rows.reduce((sum, row) => sum + row.stock, 0);
    const totalAvailable = rows.reduce((sum, row) => sum + row.available, 0);
    const totalReserved = rows.reduce((sum, row) => sum + row.reserved, 0);
    const locationCount = rows.length;
    const avgUtil = locationCount ? rows.reduce((sum, row) => sum + row.util, 0) / locationCount : 0;
    const reservedRatio = totalStock > 0 ? (totalReserved / totalStock) * 100 : 0;
    return { totalStock, totalAvailable, totalReserved, locationCount, avgUtil, reservedRatio };
  };

  const selectionSummary = summarizeRows(selectedRows.length ? selectedRows : filteredRows);
  const visualSummary = summarizeRows(filteredRows);
  const selectionReservedPct = Math.min(100, Math.max(selectionSummary.reservedRatio, 0));

  const isAllSelected = filteredRows.length > 0 && filteredRows.every((row) => selectedRowIds.has(row.id));

  useEffect(() => {
    if (!selectAllRef.current) return;
    selectAllRef.current.indeterminate = selectedRowIds.size > 0 && !isAllSelected;
  }, [selectedRowIds, isAllSelected]);

  const toggleRowSelection = (rowId) => {
    setSelectedRowIds((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) next.delete(rowId);
      else next.add(rowId);
      return next;
    });
  };

  const findLocationByScan = (value) => {
    const normalized = normalizeLookupValue(value).toUpperCase();
    if (!normalized) return null;
    return sourceRows.find((row) => {
      const code = String(row.locationCode).toUpperCase();
      return code === normalized || code.includes(normalized);
    }) || null;
  };

  const handleLocationScan = () => {
    const matched = findLocationByScan(filters.location);
    if (!matched) {
      showToast("스캔한 위치를 찾지 못했습니다.");
      return;
    }

    setFilters((prev) => ({
      ...prev,
      owner: "ALL",
      zone: "ALL",
      area: "ALL",
      location: matched.locationCode,
      minAvailable: "",
      maxAvailable: "",
      minReserved: "",
      maxReserved: "",
      minUtil: "",
      maxUtil: "",
    }));
    setSelectedRowIds(new Set([matched.id]));
    setFocusLocationId(matched.id);
    setViewMode("list");
    showToast(`스캔 완료: ${matched.locationCode}`);
  };

  const resetFilters = () => {
    setFilters({
      owner: "ALL",
      zone: "ALL",
      area: "ALL",
      location: "",
      minAvailable: "",
      maxAvailable: "",
      minReserved: "",
      maxReserved: "",
      minUtil: "",
      maxUtil: "",
    });
    setViewMode("list");
    setSortType("기본");
    setSelectedRowIds(new Set());
    showToast("필터를 초기화했습니다.");
  };

  return (
    <SidebarLayout title="위치별 재고 현황">
      <div className="nw-page-head">
        <div>
          <h2>위치별 재고 현황</h2>
          <p>필터 조건으로 위치별 재고를 조회하고 리스트/시각화 화면을 전환해서 확인합니다.</p>
        </div>
      </div>

      <section className="nw-panel">
        <div className="nw-inline-filter location-stock">
          <label className="nw-inline-field">
            <span>화주사</span>
            <select value={filters.owner} onChange={(event) => setFilters((prev) => ({ ...prev, owner: event.target.value }))}>
              {ownerOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label className="nw-inline-field">
            <span>존</span>
            <select value={filters.zone} onChange={(event) => setFilters((prev) => ({ ...prev, zone: event.target.value }))}>
              {zoneOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label className="nw-inline-field">
            <span>구역</span>
            <select value={filters.area} onChange={(event) => setFilters((prev) => ({ ...prev, area: event.target.value }))}>
              {areaOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <input
            type="text"
            value={filters.location}
            onChange={(event) => setFilters((prev) => ({ ...prev, location: event.target.value }))}
            placeholder="위치를 스캔하세요."
          />
          <button type="button" className="nw-btn primary" onClick={handleLocationScan}>
            스캔
          </button>
          <button type="button" className={`nw-icon-btn ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")} title="리스트 보기">
            ≡
          </button>
          <button type="button" className={`nw-icon-btn ${viewMode === "visual" ? "active" : ""}`} onClick={() => setViewMode("visual")} title="시각화 보기">
            ⊞
          </button>
        </div>

        <div className="nw-filter-grid location-stock">
          <label>
            가용 적재 수량(최소)
            <input type="number" value={filters.minAvailable} onChange={(event) => setFilters((prev) => ({ ...prev, minAvailable: event.target.value }))} />
          </label>
          <label>
            가용 적재 수량(최대)
            <input type="number" value={filters.maxAvailable} onChange={(event) => setFilters((prev) => ({ ...prev, maxAvailable: event.target.value }))} />
          </label>
          <label>
            미발송 수량(최소)
            <input type="number" value={filters.minReserved} onChange={(event) => setFilters((prev) => ({ ...prev, minReserved: event.target.value }))} />
          </label>
          <label>
            미발송 수량(최대)
            <input type="number" value={filters.maxReserved} onChange={(event) => setFilters((prev) => ({ ...prev, maxReserved: event.target.value }))} />
          </label>
          <label>
            적재 비율(최소 %)
            <input type="number" value={filters.minUtil} onChange={(event) => setFilters((prev) => ({ ...prev, minUtil: event.target.value }))} />
          </label>
          <label>
            적재 비율(최대 %)
            <input type="number" value={filters.maxUtil} onChange={(event) => setFilters((prev) => ({ ...prev, maxUtil: event.target.value }))} />
          </label>
        </div>

        <div className="nw-panel-actions">
          <button type="button" className="nw-btn" onClick={resetFilters}>초기화</button>
          <button type="button" className="nw-btn" onClick={() => showToast("엑셀 다운로드를 시작합니다 (데모)")}>엑셀 다운로드</button>
        </div>
      </section>

      {viewMode === "visual" ? (
        <>
          <section className="nw-summary-grid location-visual-kpi">
            <article className="nw-summary-card">
              <div className="label">합계 재고</div>
              <strong>{formatNumber(visualSummary.totalStock)}</strong>
              <span>필터 조건 기준</span>
            </article>
            <article className="nw-summary-card warn">
              <div className="label">미발송</div>
              <strong>{formatNumber(visualSummary.totalReserved)}</strong>
              <span>합계 대비 {visualSummary.reservedRatio.toFixed(1)}%</span>
            </article>
            <article className="nw-summary-card">
              <div className="label">위치 수</div>
              <strong>{formatNumber(visualSummary.locationCount)}</strong>
              <span>평균 적재 비율 {visualSummary.avgUtil.toFixed(1)}%</span>
            </article>
          </section>

          <section className="nw-panel">
            <div className="nw-panel-title-row">
              <h3>위치 시각화</h3>
              <div className="nw-sort-row">
                {["기본", "수량 높은순", "수량 낮은순"].map((label) => (
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

            {groupedVisualRows.length ? groupedVisualRows.map(([center, rows]) => {
              const totalStock = rows.reduce((sum, row) => sum + row.stock, 0);
              const totalReserved = rows.reduce((sum, row) => sum + row.reserved, 0);
              return (
                <div key={center} className="nw-center-block location-visual">
                  <div className="nw-center-head">
                    <strong>{center}</strong>
                    <span>적재: {formatNumber(totalStock)} / 미발송: {formatNumber(totalReserved)}</span>
                    <em>{formatNumber(rows.length)}개 위치</em>
                  </div>
                  <div className="nw-location-card-grid">
                    {rows.map((row) => {
                      const intensity = getLocationIntensity(row.stock, row.capacity);
                      const zoneTone = row.zone.includes("입고")
                        ? "inbound"
                        : row.zone.includes("출고")
                          ? "outbound"
                          : row.zone.includes("반품")
                            ? "return"
                            : "storage";
                      const utilPct = Math.min(100, Math.max(row.util, 0));
                      const stockFillPct = Math.min(100, Math.max(row.capacity > 0 ? (row.stock / row.capacity) * 100 : 0, 0));
                      const reservedFillPct = Math.min(100, Math.max(row.stock > 0 ? (row.reserved / row.stock) * 100 : row.reserved > 0 ? 100 : 0, 0));
                      return (
                        <button
                          key={row.id}
                          type="button"
                          className={`nw-location-card-v2 ${intensity} ${row.reserved > 0 ? "has-reserved" : ""} ${focusLocationId === row.id ? "active" : ""}`}
                          onClick={() => setFocusLocationId(row.id)}
                        >
                          <div className="nw-location-card-head">
                            <div className="nw-location-card-headline">
                              <strong className="nw-location-card-code">{row.locationCode}</strong>
                              <span className={`nw-location-stock-flag ${row.stock > 0 ? "has-stock" : "empty-stock"}`}>{row.stock > 0 ? "재고있음" : "재고 없음"}</span>
                            </div>
                          </div>

                          <div className="nw-location-card-core">
                            <div className="nw-location-card-metrics-line">
                              <article className="metric stock" style={{ "--fill": `${stockFillPct}%` }}>
                                <b>적재</b>
                                <em>{formatNumber(row.stock)}</em>
                              </article>
                              <article className="metric reserved" style={{ "--fill": `${reservedFillPct}%` }}>
                                <b>미발송</b>
                                <em>{formatNumber(row.reserved)}</em>
                              </article>
                            </div>

                            <div className="nw-location-card-meta">
                              <span className={`zone-pill ${zoneTone}`}>{row.zone}</span>
                            </div>

                            <div className="nw-location-card-util">
                              <div className="nw-location-util-head">
                                <small>적재비율</small>
                                <strong>{row.util.toFixed(1)}%</strong>
                              </div>
                              <div className="nw-location-util-bar">
                                <i style={{ width: `${utilPct}%` }} />
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            }) : <div className="nw-empty">조회 조건에 해당하는 위치가 없습니다.</div>}

            {focusLocation ? (
              <section className="nw-focus-panel">
                <h4>위치 상세 - {focusLocation.locationCode}</h4>
                <p>{focusLocation.center} / {focusLocation.zone} / {focusLocation.areaCode} / 적재 비율 {focusLocation.util.toFixed(1)}%</p>
                {focusLocation.products.length ? (
                  <ul>
                    {focusLocation.products.map((product) => (
                      <li key={product.id}>
                        <strong>{product.name}</strong>
                        <span>{product.option}</span>
                        <span>적재 {formatNumber(product.stock)} / 미발송 {formatNumber(product.reserved)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="nw-empty inline">등록된 상품이 없습니다.</div>
                )}
              </section>
            ) : null}
          </section>
        </>
      ) : (
        <>
          {selectedRows.length ? (
            <section className="nw-location-selection-visual simple">
              <article className="nw-location-kpi-card stock">
                <div className="kpi-title-row">
                  <span className="kpi-icon">📦</span>
                  <div>
                    <span className="title">합계 재고</span>
                    <em>선택 {formatNumber(selectedRows.length)}개 위치</em>
                  </div>
                </div>
                <strong>{formatNumber(selectionSummary.totalStock)}</strong>
                <div className="kpi-pill neutral">
                  <span>가용 / 미발송</span>
                  <b>{formatNumber(selectionSummary.totalAvailable)} / {formatNumber(selectionSummary.totalReserved)}</b>
                </div>
              </article>

              <article className="nw-location-kpi-card reserved">
                <div className="kpi-title-row">
                  <span className="kpi-icon">🚚</span>
                  <div>
                    <span className="title">미발송</span>
                    <em>합계 대비 {selectionReservedPct.toFixed(1)}%</em>
                  </div>
                </div>
                <strong>{formatNumber(selectionSummary.totalReserved)}</strong>
                <div className="kpi-pill">
                  <span>비율</span>
                  <b>{selectionReservedPct.toFixed(1)}%</b>
                </div>
              </article>

              <article className="nw-location-kpi-card location-count">
                <div className="kpi-title-row">
                  <span className="kpi-icon">📍</span>
                  <div>
                    <span className="title">위치 수</span>
                    <em>평균 적재 {selectionSummary.avgUtil.toFixed(1)}%</em>
                  </div>
                </div>
                <strong>{formatNumber(selectionSummary.locationCount)}</strong>
                <div className="kpi-pill neutral">
                  <span>평균 적재 비율</span>
                  <b>{selectionSummary.avgUtil.toFixed(1)}%</b>
                </div>
              </article>
            </section>
          ) : null}

          <section className="nw-panel">
            <div className="nw-panel-title-row">
              <h3>위치별 리스트</h3>
              <div className="nw-helper-text">체크박스로 선택하면 상단 대시보드가 선택 기준으로 갱신됩니다.</div>
            </div>

            {listCenterSummaries.length ? (
              <div className="nw-location-center-summary">
                {listCenterSummaries.map((item) => {
                  const reservedPct = Math.min(100, Math.max(item.reservedRatio, 0));
                  const availablePct = 100 - reservedPct;
                  const utilPct = Math.min(100, Math.max(item.avgUtil, 0));
                  return (
                    <article key={item.center} className="nw-location-center-card">
                      <div className="nw-location-center-head">
                        <strong>{item.center}</strong>
                        <em>{formatNumber(item.count)}개 위치</em>
                      </div>

                      <div className="nw-location-center-metrics">
                        <div>
                          <span>적재</span>
                          <b>{formatNumber(item.stock)}</b>
                        </div>
                        <div>
                          <span>미발송</span>
                          <b>{formatNumber(item.reserved)}</b>
                        </div>
                      </div>

                      <div className="nw-location-center-graphic">
                        <div className="nw-center-bar-label">
                          <span>가용 / 미발송 구성</span>
                          <em>미발송 {reservedPct.toFixed(1)}%</em>
                        </div>
                        <div className="nw-center-stack-bar">
                          <i className="available" style={{ width: `${availablePct}%` }} />
                          <i className="reserved" style={{ width: `${reservedPct}%` }} />
                        </div>
                        <div className="nw-center-bar-label">
                          <span>평균 적재 비율</span>
                          <em>{item.avgUtil.toFixed(1)}%</em>
                        </div>
                        <div className="nw-center-util-bar">
                          <i style={{ width: `${utilPct}%` }} />
                        </div>
                      </div>

                      <div className="nw-location-center-foot">
                        <span>가용 {formatNumber(item.available)}</span>
                        <span>평균 적재 {item.avgUtil.toFixed(1)}%</span>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : null}

            <div className="nw-table-wrap">
              <table className="nw-table nw-location-list-table">
                <thead>
                  <tr>
                    <th className="check">
                      <input
                        ref={selectAllRef}
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            setSelectedRowIds(new Set(filteredRows.map((row) => row.id)));
                          } else {
                            setSelectedRowIds(new Set());
                          }
                        }}
                      />
                    </th>
                    <th>센터</th>
                    <th>존</th>
                    <th>구역</th>
                    <th>위치</th>
                    <th>적재 상태</th>
                    <th>상품 상세</th>
                    <th>합계 재고</th>
                    <th>가용 적재</th>
                    <th>미발송</th>
                    <th>적재 비율</th>
                    <th>품목 총 수량</th>
                  </tr>
                </thead>
                <tbody>
                  {listRows.map((row) => {
                    const isSelected = selectedRowIds.has(row.id);
                    const intensity = getLocationIntensity(row.stock, row.capacity);
                    const itemTotalQty = row.products.reduce((sum, product) => sum + product.stock, 0);
                    return (
                      <tr
                        key={row.id}
                        className={`${focusLocationId === row.id ? "selected-row" : ""} ${isSelected ? "checked-row" : ""} nw-click-row`}
                        onClick={() => setFocusLocationId(row.id)}
                      >
                        <td className="check" onClick={(event) => event.stopPropagation()}>
                          <input type="checkbox" checked={isSelected} onChange={() => toggleRowSelection(row.id)} />
                        </td>
                        <td>{row.center}</td>
                        <td><span className="nw-zone-chip">{row.zone}</span></td>
                        <td>{row.areaCode}</td>
                        <td>{row.locationCode}</td>
                        <td><span className={`nw-stock-state ${row.stock > 0 ? "has-stock" : "empty-stock"}`}>{row.stock > 0 ? "재고있음" : "재고 없음"}</span></td>
                        <td className="nw-location-product-cell">
                          {row.products.length ? (
                            <div className="nw-location-product-list">
                              {row.products.map((product) => (
                                <div key={`${row.id}-${product.id}`} className="item">
                                  <strong>{product.name} / {product.option}</strong>
                                  <span>{product.barcode}</span>
                                  <em>적재 {formatNumber(product.stock)} · 가용 {formatNumber(product.available)} · 미발송 {formatNumber(product.reserved)}</em>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="nw-empty-inline">-</span>
                          )}
                        </td>
                        <td>{formatNumber(row.stock)}</td>
                        <td>{formatNumber(row.available)}</td>
                        <td>{formatNumber(row.reserved)}</td>
                        <td><span className={`nw-util-pill ${intensity}`}>{row.util.toFixed(1)}%</span></td>
                        <td>{formatNumber(itemTotalQty)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {!filteredRows.length ? <div className="nw-empty">조회 조건에 해당하는 위치가 없습니다.</div> : null}

            {focusLocation ? (
              <section className="nw-focus-panel">
                <h4>리스트 선택 상세 - {focusLocation.locationCode}</h4>
                <p>{focusLocation.center} / {focusLocation.zone} / {focusLocation.areaCode} / 적재 비율 {focusLocation.util.toFixed(1)}%</p>
                {focusLocation.products.length ? (
                  <ul>
                    {focusLocation.products.map((product) => (
                      <li key={product.id}>
                        <strong>{product.name}</strong>
                        <span>{product.option}</span>
                        <span>적재 {formatNumber(product.stock)} / 가용 {formatNumber(product.available)} / 미발송 {formatNumber(product.reserved)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="nw-empty inline">등록된 상품이 없습니다.</div>
                )}
              </section>
            ) : null}
          </section>
        </>
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
  const [individualResult, setIndividualResult] = useState(null);
  const [scanResult, setScanResult] = useState(null);

  const findProductByLocationCode = (locationCode, owner = "") => {
    const normalizedLocationCode = normalizeLookupValue(locationCode).toLowerCase();
    if (!normalizedLocationCode) return undefined;
    return PRODUCT_MASTER.find((product) => (
      (!owner || owner === "ALL" || product.owner === owner)
      && product.locations.some((location) => location.code.toLowerCase().includes(normalizedLocationCode))
    ));
  };

  const pickFallbackProduct = (owner, seedText) => {
    const ownerProducts = PRODUCT_MASTER.filter((product) => !owner || owner === "ALL" || product.owner === owner);
    const pool = ownerProducts.length ? ownerProducts : PRODUCT_MASTER;
    if (!pool.length) return undefined;

    const seed = normalizeLookupValue(seedText);
    if (!seed) return pool[0];
    const hash = [...seed].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return pool[hash % pool.length];
  };

  const resolveInputProduct = ({ barcode = "", locationCode = "", owner = "" }) => (
    findProductByLookup(barcode, owner)
    || findProductByLocationCode(barcode, owner)
    || findProductByLookup(locationCode, owner)
    || findProductByLocationCode(locationCode, owner)
    || pickFallbackProduct(owner, `${barcode}|${locationCode}`)
  );

  const makeLookupResult = ({ barcode, locationCode, owner }) => {
    const normalizedBarcode = normalizeLookupValue(barcode);
    const normalizedLocationCode = normalizeLookupValue(locationCode);
    const product = resolveInputProduct({ barcode: normalizedBarcode, locationCode: normalizedLocationCode, owner });
    return { barcode: normalizedBarcode, locationCode: normalizedLocationCode, owner, product };
  };

  const createEntry = ({ owner, round, barcode, locationCode, qty, memo, source }) => {
    const normalizedBarcode = normalizeLookupValue(barcode);
    const normalizedLocationCode = normalizeLookupValue(locationCode);
    const product = resolveInputProduct({ barcode: normalizedBarcode, locationCode: normalizedLocationCode, owner });
    return {
      id: `survey-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      owner,
      round,
      barcode: normalizedBarcode,
      locationCode: normalizedLocationCode,
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
    const normalizedBarcode = normalizeLookupValue(individualForm.barcode);
    if (!individualForm.owner || !individualForm.round || !normalizedBarcode || !individualForm.locationCode || toNumber(individualForm.qty) <= 0) {
      showToast("화주사/차수/바코드/로케이션/수량을 입력하세요.");
      return;
    }

    setIndividualResult(
      makeLookupResult({
        barcode: normalizedBarcode,
        locationCode: individualForm.locationCode,
        owner: individualForm.owner,
      }),
    );
    setSurveyEntries((prev) => [createEntry({ ...individualForm, barcode: normalizedBarcode, source: "개별입력" }), ...prev]);
    setIndividualForm((prev) => ({ ...prev, barcode: "", locationCode: "", qty: "", memo: "" }));
    showToast("조사 재고를 임시 목록에 추가했습니다.");
  };

  const addScan = () => {
    const normalizedBarcode = normalizeLookupValue(scanForm.barcode);
    if (!scanForm.owner || !scanForm.locationCode || !normalizedBarcode) {
      showToast("화주사/로케이션/바코드를 입력하세요.");
      return;
    }

    setScanResult(
      makeLookupResult({
        barcode: normalizedBarcode,
        locationCode: scanForm.locationCode,
        owner: scanForm.owner,
      }),
    );
    if (scanForm.mode === "자동누산") {
      setSurveyEntries((prev) => {
        const index = prev.findIndex(
          (entry) => entry.status === "조사중" && entry.barcode === normalizedBarcode && entry.locationCode === scanForm.locationCode,
        );
        if (index >= 0) {
          const next = [...prev];
          next[index] = { ...next[index], qty: next[index].qty + 1 };
          return next;
        }
        return [
          createEntry({
            owner: scanForm.owner,
            round: "2026-03-1차",
            barcode: normalizedBarcode,
            locationCode: scanForm.locationCode,
            qty: 1,
            memo: "",
            source: "바코드스캔",
          }),
          ...prev,
        ];
      });
    } else {
      if (toNumber(scanForm.qty) <= 0) {
        showToast("단위 입력 모드에서는 수량이 필요합니다.");
        return;
      }
      setSurveyEntries((prev) => [
        createEntry({
          owner: scanForm.owner,
          round: "2026-03-1차",
          barcode: normalizedBarcode,
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
              <input
                value={individualForm.barcode}
                onChange={(event) => setIndividualForm((prev) => ({ ...prev, barcode: event.target.value }))}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addIndividual();
                  }
                }}
              />
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
          {individualResult ? (
            <div className="nw-survey-input-result">
              <div className="nw-panel-title-row mini">
                <h4>입력 상품</h4>
              </div>
              {individualResult.product ? (
                <article className="nw-mobile-card compact nw-survey-input-preview">
                  <div className="nw-mobile-product-head">
                    <div className={`nw-thumb ${getToneClass(individualResult.product.tone)}`} />
                    <div>
                      <strong>{individualResult.product.name}</strong>
                      <span>{individualResult.product.option}</span>
                      <span>{individualResult.product.barcode}</span>
                      <span className="brand">{individualResult.product.brand}</span>
                      <span className="nw-product-tag">{individualResult.product.owner}</span>
                    </div>
                    <div className="qty">
                      <span>{formatNumber(individualResult.product.locations.reduce((sum, location) => sum + location.qty, 0))}개</span>
                    </div>
                  </div>
                </article>
              ) : (
                <div className="nw-mobile-empty compact nw-survey-input-empty">
                  <strong>입력한 값과 일치하는 상품이 없습니다.</strong>
                  <p>입력값: {individualResult.barcode}</p>
                </div>
              )}
            </div>
          ) : null}
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
              <input
                value={scanForm.barcode}
                onChange={(event) => setScanForm((prev) => ({ ...prev, barcode: event.target.value }))}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addScan();
                  }
                }}
                placeholder="스캔값 입력"
              />
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
          {scanResult ? (
            <div className="nw-survey-input-result">
              <div className="nw-panel-title-row mini">
                <h4>스캔 상품</h4>
              </div>
              {scanResult.product ? (
                <article className="nw-mobile-card compact nw-survey-input-preview">
                  <div className="nw-mobile-product-head">
                    <div className={`nw-thumb ${getToneClass(scanResult.product.tone)}`} />
                    <div>
                      <strong>{scanResult.product.name}</strong>
                      <span>{scanResult.product.option}</span>
                      <span>{scanResult.product.barcode}</span>
                      <span className="brand">{scanResult.product.brand}</span>
                      <span className="nw-product-tag">{scanResult.product.owner}</span>
                    </div>
                    <div className="qty">
                      <span>{formatNumber(scanResult.product.locations.reduce((sum, location) => sum + location.qty, 0))}개</span>
                    </div>
                  </div>
                </article>
              ) : (
                <div className="nw-mobile-empty compact nw-survey-input-empty">
                  <strong>입력한 값과 일치하는 상품이 없습니다.</strong>
                  <p>입력값: {scanResult.barcode}</p>
                </div>
              )}
            </div>
          ) : null}
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

function InventorySurveyPage({ surveyEntries, setSurveyEntries, adjustments, setAdjustments }) {
  const { toast, showToast } = useToast();
  const [activeTab, setActiveTab] = useState("lookup");
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
  };
  const activeGuide = tabGuide[activeTab] || tabGuide.lookup;

  return (
    <SidebarLayout title="재고조사">
      <div className="nw-survey-page">
        <div className="nw-page-head">
          <div>
            <h2>재고조사</h2>
            <p>재고 조회 / 조사 재고 입력 / 현재고 대조 / 작업내역을 제공합니다. 재고조정은 별도 메뉴에서 진행합니다.</p>
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
        </div>

        {activeTab === "lookup" ? <InventoryLookupTab onMoveToInput={() => setActiveTab("input")} /> : null}
        {activeTab === "input" ? <SurveyInputTab surveyEntries={surveyEntries} setSurveyEntries={setSurveyEntries} showToast={showToast} /> : null}
        {activeTab === "compare" ? <CurrentCompareTab surveyEntries={surveyEntries} setAdjustments={setAdjustments} showToast={showToast} /> : null}
        {activeTab === "history" ? <WorkHistoryTab surveyEntries={surveyEntries} /> : null}
      </div>

      <GlobalToast message={toast} />
    </SidebarLayout>
  );
}

function InventoryAdjustmentPage({ adjustments, setAdjustments }) {
  const { toast, showToast } = useToast();
  const [adjustmentRole, setAdjustmentRole] = useState("worker");

  const adjustmentStats = useMemo(() => ({
    total: adjustments.length,
    pending: adjustments.filter((item) => item.status === "대기중").length,
    approved: adjustments.filter((item) => item.status === "승인됨").length,
    rejected: adjustments.filter((item) => item.status === "거절됨").length,
  }), [adjustments]);

  return (
    <SidebarLayout title="재고조정">
      <div className="nw-survey-page">
        <div className="nw-page-head">
          <div>
            <h2>재고조정</h2>
            <p>웹 운영자 화면에서 조정 요청을 검토하고 승인/반려를 처리합니다.</p>
          </div>
        </div>

        <section className="nw-panel nw-survey-overview">
          <div className="nw-survey-kpi-grid">
            <article className="nw-survey-kpi">
              <span>전체 요청</span>
              <strong>{formatNumber(adjustmentStats.total)}</strong>
            </article>
            <article className="nw-survey-kpi">
              <span>대기중</span>
              <strong>{formatNumber(adjustmentStats.pending)}</strong>
            </article>
            <article className="nw-survey-kpi">
              <span>승인됨</span>
              <strong>{formatNumber(adjustmentStats.approved)}</strong>
            </article>
            <article className="nw-survey-kpi">
              <span>거절됨</span>
              <strong>{formatNumber(adjustmentStats.rejected)}</strong>
            </article>
          </div>
          <div className="nw-survey-guide">
            <strong>{adjustmentRole === "worker" ? "웹 작업자 화면" : "웹 관리자 화면"}</strong>
            <span>{adjustmentRole === "worker" ? "위치 선택 > 상품 선택 > 조정 요청/재요청" : "요청 일괄 승인/반려 및 이력 검토"}</span>
          </div>
        </section>

        <section className="nw-panel nw-adjust-role-panel">
          <div className="nw-panel-title-row">
            <h3>재고 조정 역할 선택</h3>
            <div className="nw-btn-row">
              <button
                type="button"
                className={`nw-btn tiny ${adjustmentRole === "worker" ? "active" : ""}`}
                onClick={() => setAdjustmentRole("worker")}
              >
                작업자 화면
              </button>
              <button
                type="button"
                className={`nw-btn tiny ${adjustmentRole === "admin" ? "active" : ""}`}
                onClick={() => setAdjustmentRole("admin")}
              >
                관리자 화면
              </button>
            </div>
          </div>
        </section>

        {adjustmentRole === "worker" ? (
          <WorkerAdjustmentPanel adjustments={adjustments} setAdjustments={setAdjustments} showToast={showToast} />
        ) : (
          <AdminAdjustmentPanel adjustments={adjustments} setAdjustments={setAdjustments} showToast={showToast} />
        )}
      </div>

      <GlobalToast message={toast} />
    </SidebarLayout>
  );
}

function NewWmsApp() {
  const [surveyEntries, setSurveyEntries] = useState(INITIAL_SURVEY_ENTRIES);
  const [adjustments, setAdjustments] = useState(INITIAL_ADJUSTMENTS);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/inventory-survey"
          element={(
            <InventorySurveyPage
              surveyEntries={surveyEntries}
              setSurveyEntries={setSurveyEntries}
              adjustments={adjustments}
              setAdjustments={setAdjustments}
            />
          )}
        />
        <Route
          path="/inventory-adjustment"
          element={<InventoryAdjustmentPage adjustments={adjustments} setAdjustments={setAdjustments} />}
        />
        <Route path="/location-stock" element={<LocationStockPage />} />
        <Route path="/slow-moving" element={<SlowMovingPage />} />
        <Route path="/" element={<Navigate to="/inventory-survey" replace />} />
        <Route path="*" element={<Navigate to="/inventory-survey" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default NewWmsApp;

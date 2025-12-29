import React, { useState, useContext, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ArrowLeft,
  Calendar,
  TrendingUp,
  RotateCcw,
  Percent,
  FileText,
  List,
  Briefcase,
  User,
  Coins,
  Hash,
  ArrowUp,
  ArrowDown,
  Table as TableIcon,
  Wallet,
  LayoutDashboard,
  PieChart,
  X,
  Filter,
} from "lucide-react";
import { LanguageContext } from "../context/LanguageContext";
import { useCursor } from "../context/CursorContext";
import FadeContent from "./FadeContent";
import BlurText from "./BlurText";
import ShinyText from "./ShinyText";
import MagicBento from "./MagicBento";
import SalesChart from "./SalesChart";
import ProductDistributionChart from "./ProductDistributionChart";
import RankingChart from "./RankingChart";
import SalesTables from "./SalesTables";
import FinancialTables from "./FinancialTables";
import ProfitLossContent from "./ProfitLossContent";

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useContext(LanguageContext);
  const { setCursorVariant } = useCursor();

  // Top Level Section: 'sales' | 'financial'
  const [section, setSection] = useState("sales");
  // Sales View Mode: 'amount' | 'quantity' | 'details'
  const [mode, setMode] = useState("amount");

  // Mock Companies with Specific Colors and Logos
  const companies = [
    { id: 1, name: "کاله", color: "255, 100, 0", logo: "🥛" }, // Orange - Kalleh
    { id: 2, name: "پگاه", color: "0, 122, 255", logo: "🧀" }, // Blue - Pegah
    { id: 3, name: "شیرین عسل", color: "255, 0, 100", logo: "🍯" }, // Red/Pink
    { id: 4, name: "سولیکو", color: "0, 200, 100", logo: "🥬" }, // Green - Solico
    { id: 5, name: "زر ماکارون", color: "255, 200, 0", logo: "🍝" }, // Yellow - Zar Macaron
  ];

  const [selectedCompany, setSelectedCompany] = useState(companies[0]);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);

  // Date Range State (Persian strings for now)
  const [dateRange, setDateRange] = useState({
    from: "1404/01/01",
    to: "1404/12/29",
  });

  // Interactive Filters State
  const [activeFilters, setActiveFilters] = useState({
    month: null, // e.g., { name: "فروردین", year: 1404, index: 0 }
    productGroup: null, // e.g., { id: 0, name: "شیر کم‌چرب" }
    seller: null, // e.g., { id: 0, name: "علی محمدی" }
    customer: null, // e.g., { id: 0, name: "فروشگاه کوروش" }
  });

  // Clear all filters
  const clearAllFilters = () => {
    setActiveFilters({
      month: null,
      productGroup: null,
      seller: null,
      customer: null,
    });
  };

  // Clear specific filter
  const clearFilter = (filterType) => {
    setActiveFilters((prev) => ({ ...prev, [filterType]: null }));
  };

  // Check if any filter is active
  const hasActiveFilters = Object.values(activeFilters).some((v) => v !== null);

  // Mock Product Name based on ID (In real app, fetch from API/Store)
  // Using hardcoded names mapping to the IDs from Dashboard
  const getProductName = (id) => {
    switch (id) {
      case "1":
        return language === "fa" ? "داشبورد مدیریتی" : "Admin Dashboard";
      case "2":
        return language === "fa" ? "هوش مصنوعی" : "AI Assistant";
      case "3":
        return language === "fa" ? "تحلیل آماری" : "Analytics";
      default:
        return language === "fa" ? "محصول" : "Product";
    }
  };

  const productName = getProductName(id);

  // Updated templates with multiple years and ranges
  const dateTemplates = [
    // Quick access
    { label: "ماه آخر", value: "last_month" },
    { label: "۶ ماه اخیر", value: "last_6_months" },
    // Individual years
    { label: "۱۴۰۴", value: "1404" },
    { label: "۱۴۰۳", value: "1403" },
    { label: "۱۴۰۲", value: "1402" },
    { label: "۱۴۰۱", value: "1401" },
    { label: "۱۴۰۰", value: "1400" },
    // Multi-year ranges
    { label: "۲ سال اخیر", value: "last_2_years" },
    { label: "۳ سال اخیر", value: "last_3_years" },
    { label: "۵ سال اخیر", value: "last_5_years" },
    { label: "همه", value: "all" },
  ];

  const handleTemplateClick = (template) => {
    switch (template) {
      case "last_month":
        setDateRange({ from: "1404/11/01", to: "1404/12/29" });
        break;
      case "last_6_months":
        setDateRange({ from: "1404/07/01", to: "1404/12/29" });
        break;
      case "1404":
        setDateRange({ from: "1404/01/01", to: "1404/12/29" });
        break;
      case "1403":
        setDateRange({ from: "1403/01/01", to: "1403/12/29" });
        break;
      case "1402":
        setDateRange({ from: "1402/01/01", to: "1402/12/29" });
        break;
      case "1401":
        setDateRange({ from: "1401/01/01", to: "1401/12/29" });
        break;
      case "1400":
        setDateRange({ from: "1400/01/01", to: "1400/12/29" });
        break;
      case "last_2_years":
        setDateRange({ from: "1403/01/01", to: "1404/12/29" });
        break;
      case "last_3_years":
        setDateRange({ from: "1402/01/01", to: "1404/12/29" });
        break;
      case "last_5_years":
        setDateRange({ from: "1400/01/01", to: "1404/12/29" });
        break;
      case "all":
        setDateRange({ from: "1398/01/01", to: "1404/12/29" });
        break;
      default:
        setDateRange({ from: "1404/01/01", to: "1404/12/29" });
    }
  };

  // Helper to get metrics based on company ID and mode, with filter support
  const getCompanyMetrics = (companyId, dateRange, mode, filters = {}) => {
    // Simple hash of date range to vary numbers
    const dateModifier = (dateRange?.from?.charCodeAt(6) || 0) % 10;

    // Base values (Amount)
    let baseValues = {
      1: { sales: 15400, returns: 1200, invoiceCount: 145, lines: 1450 },
      2: { sales: 22100, returns: 550, invoiceCount: 210, lines: 2300 },
      3: { sales: 11800, returns: 900, invoiceCount: 98, lines: 890 },
      4: { sales: 18500, returns: 1800, invoiceCount: 160, lines: 1600 },
      5: { sales: 30200, returns: 300, invoiceCount: 320, lines: 4100 },
    }[companyId] || { sales: 0, returns: 0, invoiceCount: 0, lines: 0 };

    // Apply modifier based on date
    let mod = 1 + dateModifier * 0.05;

    // Apply filter modifiers - reduce values when a filter is active (to simulate subset)
    const filterCount = Object.values(filters).filter((v) => v !== null).length;
    if (filterCount > 0) {
      // Each filter reduces the scope by roughly 15-30%
      const filterMod = Math.pow(0.25 + Math.random() * 0.1, filterCount);
      mod *= filterMod;
    }

    // If month is selected, multiply by a monthly factor (roughly 1/12)
    if (filters.month) {
      mod *= 0.08 + (filters.month.index || 0) * 0.005;
    }

    // If product group is selected, reduce further
    if (filters.productGroup) {
      mod *= 0.15 + (filters.productGroup.id || 0) * 0.02;
    }

    // If seller/customer is selected, reduce further
    if (filters.seller) {
      mod *= 0.1 + (filters.seller.id || 0) * 0.01;
    }
    if (filters.customer) {
      mod *= 0.1 + (filters.customer.id || 0) * 0.01;
    }

    // Amount Logic
    const salesAmount = Math.floor(baseValues.sales * mod);
    const returnsAmount = Math.floor(baseValues.returns * (mod * 0.8));
    const ratioAmount = ((returnsAmount / salesAmount) * 100).toFixed(1);

    // Quantity Logic (Derived roughly from amount / avg price)
    const avgPrice = 0.85; // million rials
    const salesQty = Math.floor(salesAmount / avgPrice);
    const returnsQty = Math.floor(returnsAmount / avgPrice);
    const ratioQty =
      salesQty > 0 ? ((returnsQty / salesQty) * 100).toFixed(1) : "0.0";

    const invoiceCount = Math.floor(baseValues.invoiceCount * mod);
    const lines = Math.floor(baseValues.lines * mod);

    // Quantity Growth Logic (for Cards 4 & 5 in Quantity Mode)
    // Mocking growth ratios
    const growthLastYear = mod * 10 - 5; // -5 to +15 %
    const growthTwoYearsAgo = mod * 15 - 8; // -8 to +20 %

    // If mode is details (tables), we can just return default or amount metrics for the Bento (if shown)
    // But we will hide Bento in details mode, so this return might not be used directly, but let's keep it safe.
    const isQuantity = mode === "quantity";

    if (!isQuantity) {
      return {
        card1: {
          value: salesAmount.toLocaleString(),
          label: "فروش در بازه",
          desc: "میلیون ریال",
        },
        card2: {
          value: returnsAmount.toLocaleString(),
          label: "مجموع برگشتی",
          desc: "میلیون ریال",
        },
        card3: {
          value: ratioAmount + "%",
          label: "نسبت برگشتی به فروش",
          desc: "نرخ برگشتی",
        },
        card4: {
          value: invoiceCount.toLocaleString(),
          label: "تعداد فاکتور",
          desc: "عدد",
        },
        card5: {
          value: lines.toLocaleString(),
          label: "تعداد سطر فاکتور",
          desc: "سطر",
        },
      };
    } else {
      return {
        card1: {
          value: salesQty.toLocaleString(),
          label: "تعداد فروش",
          desc: "عدد",
        },
        card2: {
          value: returnsQty.toLocaleString(),
          label: "تعداد برگشتی",
          desc: "عدد",
        },
        card3: {
          value: ratioQty + "%",
          label: "نسبت تعداد برگشتی",
          desc: "نرخ تعداد",
        },
        // New Logic for Card 4 & 5 in Quantity Mode: Growth Ratios
        card4: {
          value:
            (growthLastYear > 0 ? "+" : "") + growthLastYear.toFixed(1) + "%",
          label: "نسبت به سال قبل",
          desc: "رشد/افت مقداری",
          isGrowth: true,
          positive: growthLastYear >= 0,
        },
        card5: {
          value:
            (growthTwoYearsAgo > 0 ? "+" : "") +
            growthTwoYearsAgo.toFixed(1) +
            "%",
          label: "نسبت به ۲ سال قبل",
          desc: "رشد/افت مقداری",
          isGrowth: true,
          positive: growthTwoYearsAgo >= 0,
        },
      };
    }
  };

  // Re-calculate metrics when company OR date OR mode OR filters changes
  const currentMetrics = useMemo(
    () => getCompanyMetrics(selectedCompany.id, dateRange, mode, activeFilters),
    [selectedCompany.id, dateRange, mode, activeFilters]
  );

  // Helper to generate mock ranking data based on mode
  const getRankingData = (companyId, type, currentMode) => {
    const seed = (s) => {
      return function () {
        s = Math.sin(s) * 10000;
        return s - Math.floor(s);
      };
    };
    // Unique seed per company and type
    const random = seed(companyId * (type === "sellers" ? 100 : 200));

    const sellersNames = [
      "علی محمدی",
      "رضا رضایی",
      "سارا کریمی",
      "حسین حسینی",
      "مریم احمدی",
      "محمد عباسی",
      "فاطمه رحیمی",
      "امیر اکبری",
      "زهرا موسوی",
      "نیما صادقی",
      "کاوه کاویانی",
      "لیلا حیدری",
      "پوریا پورسرخ",
      "الناز شاکردوست",
      "بهرام رادان",
    ];
    const customersNames = [
      "فروشگاه کوروش",
      "هایپراستار",
      "سوپرمارکت برادران",
      "فروشگاه رفاه",
      "پخش عقاب",
      "سوپرمارکت آنلاین",
      "فروشگاه شهروند",
      "پخش مواد غذایی البرز",
      "مینی مارکت آریا",
      "کافه رستوران بام",
      "هتل پارسیان",
      "بیمارستان مهر",
      "تعاونی فرهنگیان",
      "پروتئینی نمونه",
      "لبنیات سنتی",
    ];

    const names = type === "sellers" ? sellersNames : customersNames;
    const count = 15;
    const avgPrice = 0.85; // used to convert amount to quantity roughly

    const data = [];
    let totalSales = 0;

    // First pass: generate raw data
    for (let i = 0; i < count; i++) {
      const salesAmount = Math.floor(random() * 5000) + 500;
      const returnsAmount = Math.floor(salesAmount * (0.05 + random() * 0.15)); // 5-20% returns
      const netSales = salesAmount - returnsAmount;

      const salesQty = Math.floor(salesAmount / avgPrice);
      const returnsQty = Math.floor(returnsAmount / avgPrice);
      const netQty = salesQty - returnsQty;

      totalSales += currentMode === "amount" ? salesAmount : salesQty;

      data.push({
        id: i,
        name: names[i % names.length] + (i >= names.length ? ` ${i + 1}` : ""),
        sales: currentMode === "amount" ? salesAmount : salesQty,
        returns: currentMode === "amount" ? returnsAmount : returnsQty,
        netValue: currentMode === "amount" ? netSales : netQty,
      });
    }

    // Second pass: calculate percentages and sort
    return data
      .map((item) => ({
        ...item,
        percent: ((item.sales / totalSales) * 100).toFixed(1),
      }))
      .sort((a, b) => b.netValue - a.netValue);
  };

  const sellersData = useMemo(
    () => getRankingData(selectedCompany.id, "sellers", mode),
    [selectedCompany.id, mode]
  );
  const customersData = useMemo(
    () => getRankingData(selectedCompany.id, "customers", mode),
    [selectedCompany.id, mode]
  );

  // Metrics Data Structure for Bento
  const metricsData = [
    {
      title: currentMetrics.card1.value,
      description: currentMetrics.card1.desc,
      label: currentMetrics.card1.label,
      color: "#060010",
      glowColor: "34, 197, 94", // Green
      icon: <TrendingUp size={24} className="text-green-400" />,
    },
    {
      title: currentMetrics.card2.value,
      description: currentMetrics.card2.desc,
      label: currentMetrics.card2.label,
      color: "#060010",
      glowColor: "239, 68, 68", // Red
      icon: <RotateCcw size={24} className="text-red-400" />,
    },
    {
      title: currentMetrics.card3.value,
      description: currentMetrics.card3.desc,
      label: currentMetrics.card3.label,
      color: "#060010",
      glowColor: "250, 204, 21", // Yellow
      icon: <Percent size={24} className="text-yellow-400" />,
    },
    {
      title: currentMetrics.card4.value,
      description: currentMetrics.card4.desc,
      label: currentMetrics.card4.label,
      color: "#060010",
      glowColor: currentMetrics.card4.isGrowth
        ? currentMetrics.card4.positive
          ? "34, 197, 94" // Green
          : "239, 68, 68" // Red
        : "59, 130, 246", // Blue
      icon: currentMetrics.card4.isGrowth ? (
        currentMetrics.card4.positive ? (
          <ArrowUp size={24} className="text-green-400" />
        ) : (
          <ArrowDown size={24} className="text-red-400" />
        )
      ) : (
        <FileText size={24} className="text-blue-400" />
      ),
    },
    {
      title: currentMetrics.card5.value,
      description: currentMetrics.card5.desc,
      label: currentMetrics.card5.label,
      color: "#060010",
      glowColor: currentMetrics.card5.isGrowth
        ? currentMetrics.card5.positive
          ? "34, 197, 94" // Green
          : "239, 68, 68" // Red
        : "168, 85, 247", // Purple
      icon: currentMetrics.card5.isGrowth ? (
        currentMetrics.card5.positive ? (
          <ArrowUp size={24} className="text-green-400" />
        ) : (
          <ArrowDown size={24} className="text-red-400" />
        )
      ) : (
        <List size={24} className="text-purple-400" />
      ),
    },
  ];

  return (
    <div
      className="w-full min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 relative overflow-x-hidden"
      dir={language === "fa" ? "rtl" : "ltr"}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <FadeContent
          blur={true}
          duration={1000}
          easing="ease-out"
          initialOpacity={0}
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-4 md:gap-0"
        >
          {/* Right Side (Start in RTL) */}
          <div className="flex flex-wrap items-center gap-4 justify-start w-full">
            {/* Back Button */}
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all"
              onMouseEnter={() => setCursorVariant("button")}
              onMouseLeave={() => setCursorVariant("default")}
            >
              <ArrowLeft
                size={20}
                className={language === "fa" ? "rotate-180" : ""}
              />
            </button>

            <h1
              className="text-xl font-bold whitespace-nowrap hidden sm:block"
              onMouseEnter={() => setCursorVariant("text")}
              onMouseLeave={() => setCursorVariant("default")}
            >
              <BlurText
                text={productName}
                className="inline-block"
                delay={100}
              />
            </h1>

            {/* Date Picker */}
            <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1 px-2 border border-white/10 relative group">
              <Calendar size={16} className="text-gray-400" />
              <div className="flex items-center gap-2 text-sm font-mono">
                <input
                  type="text"
                  value={dateRange.from}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, from: e.target.value })
                  }
                  className="bg-transparent w-20 sm:w-24 text-center outline-none border-b border-transparent focus:border-blue-500 transition-colors"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="text"
                  value={dateRange.to}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, to: e.target.value })
                  }
                  className="bg-transparent w-20 sm:w-24 text-center outline-none border-b border-transparent focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Templates Dropdown */}
              <div className="absolute top-full right-0 mt-2 w-40 bg-[#111] border border-white/10 rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                {dateTemplates.map((tpl, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleTemplateClick(tpl.value)}
                    className="w-full text-start px-4 py-2 text-sm hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                    onMouseEnter={() => setCursorVariant("button")}
                    onMouseLeave={() => setCursorVariant("default")}
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center - Section Switcher & Brand */}
          <div className="flex flex-col items-center justify-center gap-3">
            <ShinyText
              text="TryBear"
              speed={3}
              className="text-xl font-bold tracking-widest cursor-default hidden md:block"
            />

            {/* Section Switcher (Sales vs Profit vs Financial) */}
            <div className="flex items-center p-0.5 bg-[#111] rounded-lg border border-white/10 relative">
              {/* Animated Background for Switcher */}
              <div
                className={`absolute top-0.5 bottom-0.5 rounded-md bg-white/10 transition-all duration-300 ease-out`}
                style={{
                  width: "calc(33.333% - 4px)",
                  right:
                    section === "sales"
                      ? "2px"
                      : section === "profit"
                      ? "calc(33.333% + 2px)"
                      : "calc(66.666% + 2px)",
                }}
              />

              <button
                onClick={() => setSection("sales")}
                className={`relative z-10 flex-1 px-3 py-1 rounded-md text-xs font-bold flex items-center justify-center gap-1.5 transition-colors duration-300 ${
                  section === "sales"
                    ? "text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
                onMouseEnter={() => setCursorVariant("button")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                <LayoutDashboard size={14} />
                <span>فروش</span>
              </button>
              <button
                onClick={() => setSection("profit")}
                className={`relative z-10 flex-1 px-3 py-1 rounded-md text-xs font-bold flex items-center justify-center gap-1.5 transition-colors duration-300 ${
                  section === "profit"
                    ? "text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
                onMouseEnter={() => setCursorVariant("button")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                <PieChart size={14} />
                <span>سود و زیان</span>
              </button>
              <button
                onClick={() => setSection("financial")}
                className={`relative z-10 flex-1 px-3 py-1 rounded-md text-xs font-bold flex items-center justify-center gap-1.5 transition-colors duration-300 ${
                  section === "financial"
                    ? "text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
                onMouseEnter={() => setCursorVariant("button")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                <Wallet size={14} />
                <span>مالی</span>
              </button>
            </div>

            {/* Sub-Controls: Sales Modes (Only visible if section === 'sales') */}
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                section === "sales"
                  ? "max-h-16 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="flex items-center p-1 bg-white/5 rounded-xl border border-white/10 mt-1">
                <button
                  onClick={() => setMode("amount")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all duration-300 ${
                    mode === "amount"
                      ? "bg-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                  onMouseEnter={() => setCursorVariant("button")}
                  onMouseLeave={() => setCursorVariant("default")}
                >
                  <Coins size={14} />
                  <span>مبلغی</span>
                </button>
                <button
                  onClick={() => setMode("quantity")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all duration-300 ${
                    mode === "quantity"
                      ? "bg-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                  onMouseEnter={() => setCursorVariant("button")}
                  onMouseLeave={() => setCursorVariant("default")}
                >
                  <Hash size={14} />
                  <span>تعدادی</span>
                </button>
                <button
                  onClick={() => setMode("details")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all duration-300 ${
                    mode === "details"
                      ? "bg-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                  onMouseEnter={() => setCursorVariant("button")}
                  onMouseLeave={() => setCursorVariant("default")}
                >
                  <TableIcon size={14} />
                  <span>جزئیات فروش</span>
                </button>
              </div>
            </div>
          </div>

          {/* Left Side (End in RTL) - Company Dropdown */}
          <div className="flex justify-end justify-self-end relative w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <button
                onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all w-full md:min-w-[180px] justify-between"
                onMouseEnter={() => setCursorVariant("button")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-base"
                    style={{
                      backgroundColor: `rgba(${selectedCompany.color}, 0.2)`,
                    }}
                  >
                    {selectedCompany.logo}
                  </span>
                  <span className="text-sm font-medium truncate">
                    {selectedCompany.name}
                  </span>
                </div>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${
                    isCompanyDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isCompanyDropdownOpen && (
                <div className="absolute top-full left-0 w-full mt-2 bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-xl z-50">
                  {companies.map((company) => (
                    <button
                      key={company.id}
                      onClick={() => {
                        setSelectedCompany(company);
                        setIsCompanyDropdownOpen(false);
                      }}
                      className={`w-full text-start px-4 py-3 text-sm hover:bg-blue-500/10 hover:text-blue-400 transition-colors border-b border-white/5 last:border-0 flex items-center gap-3 ${
                        selectedCompany.id === company.id ? "bg-white/5" : ""
                      }`}
                      onMouseEnter={() => setCursorVariant("button")}
                      onMouseLeave={() => setCursorVariant("default")}
                    >
                      <span
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-base"
                        style={{
                          backgroundColor: `rgba(${company.color}, 0.2)`,
                        }}
                      >
                        {company.logo}
                      </span>
                      <span>{company.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </FadeContent>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Active Filters Bar */}
        {hasActiveFilters && (
          <FadeContent blur={true} duration={300} className="w-full">
            <div
              dir="rtl"
              className="flex flex-wrap items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-2xl"
            >
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Filter size={16} />
                <span>فیلترهای فعال:</span>
              </div>

              {activeFilters.month && (
                <div className="flex items-center gap-1 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm">
                  <span>
                    {activeFilters.month.name}
                    {activeFilters.month.year && ` ${activeFilters.month.year}`}
                  </span>
                  <button
                    onClick={() => clearFilter("month")}
                    className="hover:bg-green-500/30 rounded-full p-0.5 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {activeFilters.productGroup && (
                <div className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 text-sm">
                  <span>{activeFilters.productGroup.name}</span>
                  <button
                    onClick={() => clearFilter("productGroup")}
                    className="hover:bg-blue-500/30 rounded-full p-0.5 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {activeFilters.seller && (
                <div className="flex items-center gap-1 px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-400 text-sm">
                  <span>{activeFilters.seller.name}</span>
                  <button
                    onClick={() => clearFilter("seller")}
                    className="hover:bg-purple-500/30 rounded-full p-0.5 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {activeFilters.customer && (
                <div className="flex items-center gap-1 px-3 py-1.5 bg-orange-500/20 border border-orange-500/30 rounded-full text-orange-400 text-sm">
                  <span>{activeFilters.customer.name}</span>
                  <button
                    onClick={() => clearFilter("customer")}
                    className="hover:bg-orange-500/30 rounded-full p-0.5 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              <button
                onClick={clearAllFilters}
                className="mr-auto px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-full text-red-400 text-sm transition-colors flex items-center gap-1"
              >
                <X size={14} />
                <span>پاک کردن همه</span>
              </button>
            </div>
          </FadeContent>
        )}

        {/* Key prop ensures component remounts/animates when company changes or mode changes */}
        <FadeContent
          key={`${selectedCompany.id}-${section}-${mode}`}
          blur={true}
          duration={1000}
          delay={200}
          initialOpacity={0}
        >
          {/* Main Section Switcher Logic */}
          {section === "financial" ? (
            <div dir="rtl" className="w-full">
              <FinancialTables
                companyId={selectedCompany.id}
                color={selectedCompany.color}
                dateRange={dateRange}
              />
            </div>
          ) : section === "profit" ? (
            <div dir="rtl" className="w-full">
              <ProfitLossContent
                companyId={selectedCompany.id}
                color={selectedCompany.color}
                dateRange={dateRange}
              />
            </div>
          ) : (
            /* SALES SECTION CONTENT */
            <>
              {mode === "details" ? (
                <div dir="rtl" className="w-full">
                  <SalesTables
                    companyId={selectedCompany.id}
                    color={selectedCompany.color}
                    dateRange={dateRange}
                  />
                </div>
              ) : (
                /* Standard Bento & Charts Layout for Amount/Quantity Modes */
                <div className="space-y-6">
                  {/* Magic Bento Grid with Company Color - Displaying Metrics */}
                  <div dir="rtl" className="w-full">
                    <MagicBento
                      data={metricsData}
                      textAutoHide={false}
                      enableStars={false}
                      enableSpotlight={true}
                      enableBorderGlow={true}
                      enableTilt={false}
                      enableMagnetism={true}
                      clickEffect={true}
                      spotlightRadius={300}
                      particleCount={8}
                      glowColor={selectedCompany.color}
                    />
                  </div>

                  {/* Charts Row */}
                  <div
                    dir="rtl"
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full"
                  >
                    {/* Sales & Returns Chart - 2 Columns (Visual Right) */}
                    <div className="lg:col-span-2">
                      <SalesChart
                        companyId={selectedCompany.id}
                        color={selectedCompany.color}
                        dateRange={dateRange}
                        mode={mode}
                        activeMonth={activeFilters.month}
                        onMonthClick={(monthData) =>
                          setActiveFilters((prev) => ({
                            ...prev,
                            month:
                              prev.month?.name === monthData.name &&
                              prev.month?.year === monthData.year
                                ? null
                                : monthData,
                          }))
                        }
                        activeFilters={activeFilters}
                      />
                    </div>

                    {/* Distribution Chart - 1 Column (Visual Left) */}
                    <div className="lg:col-span-1">
                      <ProductDistributionChart
                        companyId={selectedCompany.id}
                        color={selectedCompany.color}
                        dateRange={dateRange}
                        mode={mode}
                        activeProductGroup={activeFilters.productGroup}
                        onProductGroupClick={(productData) =>
                          setActiveFilters((prev) => ({
                            ...prev,
                            productGroup:
                              prev.productGroup?.id === productData.id
                                ? null
                                : productData,
                          }))
                        }
                        activeFilters={activeFilters}
                      />
                    </div>
                  </div>

                  {/* Rankings Row */}
                  <div
                    dir="rtl"
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full"
                  >
                    <RankingChart
                      title="رتبه‌بندی فروشندگان"
                      data={sellersData}
                      color={selectedCompany.color}
                      icon={Briefcase}
                      unit={mode === "amount" ? "میلیون ریال" : "عدد"}
                      activeItem={activeFilters.seller}
                      onItemClick={(item) =>
                        setActiveFilters((prev) => ({
                          ...prev,
                          seller:
                            prev.seller?.id === item.id ? null : item,
                        }))
                      }
                      activeFilters={activeFilters}
                      filterType="seller"
                    />
                    <RankingChart
                      title="رتبه‌بندی مشتریان"
                      data={customersData}
                      color={selectedCompany.color}
                      icon={User}
                      unit={mode === "amount" ? "میلیون ریال" : "عدد"}
                      activeItem={activeFilters.customer}
                      onItemClick={(item) =>
                        setActiveFilters((prev) => ({
                          ...prev,
                          customer:
                            prev.customer?.id === item.id ? null : item,
                        }))
                      }
                      activeFilters={activeFilters}
                      filterType="customer"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </FadeContent>
      </main>
    </div>
  );
};

export default ProductView;

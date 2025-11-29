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

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useContext(LanguageContext);
  const { setCursorVariant } = useCursor();

  // Top Level Section: 'sales' | 'financial'
  const [section, setSection] = useState("sales");
  // Sales View Mode: 'amount' | 'quantity' | 'details'
  const [mode, setMode] = useState("amount");

  // Mock Companies with Specific Colors
  const companies = [
    { id: 1, name: "کاله", color: "255, 100, 0" }, // Orange
    { id: 2, name: "میهن", color: "0, 122, 255" }, // Blue
    { id: 3, name: "شیرین عسل", color: "255, 0, 100" }, // Red/Pink
    { id: 4, name: "سولیکو", color: "0, 200, 100" }, // Green
    { id: 5, name: "زر ماکارون", color: "255, 200, 0" }, // Yellow
  ];

  const [selectedCompany, setSelectedCompany] = useState(companies[0]);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);

  // Date Range State (Persian strings for now)
  const [dateRange, setDateRange] = useState({
    from: "1404/01/01",
    to: "1404/12/29",
  });

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

  // Updated templates with 1404
  const dateTemplates = [
    { label: "ماه آخر", value: "last_month" },
    { label: "سال آخر", value: "last_year" },
    { label: "سال ۱۴۰۴", value: "1404" },
  ];

  const handleTemplateClick = (template) => {
    // Logic to set dates based on template would go here
    // For now just updating state to show interaction
    if (template === "last_month")
      setDateRange({ from: "1403/12/01", to: "1404/01/01" });
    if (template === "last_year")
      setDateRange({ from: "1404/01/01", to: "1404/12/29" });
    if (template === "1404")
      setDateRange({ from: "1404/01/01", to: "1404/12/29" });
  };

  // Helper to get metrics based on company ID and mode
  const getCompanyMetrics = (companyId, dateRange, mode) => {
    // Simple hash of date range to vary numbers
    const dateModifier = (dateRange?.from?.charCodeAt(6) || 0) % 10;

    // Base values (Amount)
    const baseValues = {
      1: { sales: 15400, returns: 1200, invoiceCount: 145, lines: 1450 },
      2: { sales: 22100, returns: 550, invoiceCount: 210, lines: 2300 },
      3: { sales: 11800, returns: 900, invoiceCount: 98, lines: 890 },
      4: { sales: 18500, returns: 1800, invoiceCount: 160, lines: 1600 },
      5: { sales: 30200, returns: 300, invoiceCount: 320, lines: 4100 },
    }[companyId] || { sales: 0, returns: 0, invoiceCount: 0, lines: 0 };

    // Apply modifier based on date
    const mod = 1 + dateModifier * 0.05;

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

  // Re-calculate metrics when company OR date OR mode changes
  const currentMetrics = useMemo(
    () => getCompanyMetrics(selectedCompany.id, dateRange, mode),
    [selectedCompany.id, dateRange, mode]
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
    for (let i = 0; i < count; i++) {
      const amountVal = Math.floor(random() * 5000) + 500;
      const qtyVal = Math.floor(amountVal / avgPrice);

      data.push({
        id: i,
        name: names[i % names.length] + (i >= names.length ? ` ${i + 1}` : ""),
        value: currentMode === "amount" ? amountVal : qtyVal,
      });
    }

    return data.sort((a, b) => b.value - a.value);
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
      icon: <TrendingUp size={24} className="text-green-400" />,
    },
    {
      title: currentMetrics.card2.value,
      description: currentMetrics.card2.desc,
      label: currentMetrics.card2.label,
      color: "#060010",
      icon: <RotateCcw size={24} className="text-red-400" />,
    },
    {
      title: currentMetrics.card3.value,
      description: currentMetrics.card3.desc,
      label: currentMetrics.card3.label,
      color: "#060010",
      icon: <Percent size={24} className="text-yellow-400" />,
    },
    {
      title: currentMetrics.card4.value,
      description: currentMetrics.card4.desc,
      label: currentMetrics.card4.label,
      color: "#060010",
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

            {/* Section Switcher (Sales vs Financial) */}
            <div className="flex items-center p-1 bg-[#111] rounded-xl border border-white/10 relative">
              {/* Animated Background for Switcher */}
              <div
                className={`absolute top-1 bottom-1 rounded-lg bg-white/10 transition-all duration-300 ease-out ${
                  section === "sales" ? "left-1 right-1/2" : "left-1/2 right-1"
                }`}
              />

              <button
                onClick={() => setSection("sales")}
                className={`relative z-10 flex-1 px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors duration-300 ${
                  section === "sales"
                    ? "text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
                onMouseEnter={() => setCursorVariant("button")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                <LayoutDashboard size={16} />
                <span>فروش</span>
              </button>
              <button
                onClick={() => setSection("financial")}
                className={`relative z-10 flex-1 px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors duration-300 ${
                  section === "financial"
                    ? "text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
                onMouseEnter={() => setCursorVariant("button")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                <Wallet size={16} />
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
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all w-full md:min-w-[160px] justify-between"
                onMouseEnter={() => setCursorVariant("button")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                <span className="text-sm font-medium truncate">
                  {selectedCompany.name}
                </span>
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
                      className="w-full text-start px-4 py-3 text-sm hover:bg-blue-500/10 hover:text-blue-400 transition-colors border-b border-white/5 last:border-0"
                      onMouseEnter={() => setCursorVariant("button")}
                      onMouseLeave={() => setCursorVariant("default")}
                    >
                      {company.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </FadeContent>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
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
                <>
                  {/* Magic Bento Grid with Company Color - Displaying Metrics */}
                  <div dir="rtl" className="w-full mb-8">
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
                      />
                    </div>

                    {/* Distribution Chart - 1 Column (Visual Left) */}
                    <div className="lg:col-span-1">
                      <ProductDistributionChart
                        companyId={selectedCompany.id}
                        color={selectedCompany.color}
                        dateRange={dateRange}
                        mode={mode}
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
                    />
                    <RankingChart
                      title="رتبه‌بندی مشتریان"
                      data={customersData}
                      color={selectedCompany.color}
                      icon={User}
                      unit={mode === "amount" ? "میلیون ریال" : "عدد"}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </FadeContent>
      </main>
    </div>
  );
};

export default ProductView;

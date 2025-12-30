import React, { useMemo } from "react";
import {
  Wallet,
  CreditCard,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart2,
} from "lucide-react";
import FadeContent from "./FadeContent";
import FinancialCompositionCharts from "./FinancialCompositionCharts";
import FinancialRatiosCharts from "./FinancialRatiosCharts";
import { motion } from "framer-motion";
import { Download, Filter } from "lucide-react";

// Custom Table Component with specific hover color
const FinancialTableCard = ({ 
  title, 
  icon: Icon, 
  columns, 
  data, 
  hoverColor = "255, 255, 255",
  maxHeight = "auto",
  className = "" 
}) => {
  const cardRef = React.useRef(null);

  React.useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    };

    card.addEventListener("mousemove", handleMouseMove);
    return () => card.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={cardRef}
      className={`w-full bg-[#060010] border border-white/10 rounded-3xl p-4 relative overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group/card ${className}`}
      style={{
        "--glow-color": hoverColor,
        maxHeight: maxHeight,
      }}
    >
      {/* Border Glow Effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(${hoverColor}, 0.15), transparent 40%)`,
          zIndex: 0,
        }}
      />
      
      {/* Border Highlight */}
      <div 
        className="absolute inset-0 rounded-3xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
            background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(${hoverColor}, 0.3), transparent 40%)`,
            maskImage: "linear-gradient(black, black), linear-gradient(black, black)",
            maskClip: "content-box, border-box",
            maskComposite: "exclude",
            WebkitMaskImage: "linear-gradient(black, black), linear-gradient(black, black)",
            WebkitMaskClip: "content-box, border-box",
            WebkitMaskComposite: "xor",
            padding: "1px",
            zIndex: 1,
        }}
      />

      {/* Content Container - Z-Index to be above glow */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
            <div 
              className="p-1.5 rounded-lg border border-white/10"
              style={{ backgroundColor: `rgba(${hoverColor}, 0.1)` }}
            >
                <Icon size={16} style={{ color: `rgb(${hoverColor})` }} />
            </div>
            <h3 className="text-sm font-bold text-white">{title}</h3>
            </div>
            <div className="flex gap-1">
            <button className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 transition-colors">
                <Filter size={14} />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 transition-colors">
                <Download size={14} />
            </button>
            </div>
        </div>

        {/* Table Content */}
        <div className="flex-grow overflow-auto custom-scrollbar">
            <table className="w-full text-right border-collapse">
            <thead className="sticky top-0 bg-[#060010] z-10">
                <tr>
                {columns.map((col, i) => (
                    <th
                    key={i}
                    className="pb-2 pt-1 px-3 text-gray-500 font-medium text-xs border-b border-white/10 whitespace-nowrap"
                    >
                    {col}
                    </th>
                ))}
                </tr>
            </thead>
            <tbody className="text-xs text-gray-300">
                {data.map((row, idx) => {
                const rowValues = Object.values(row);
                
                return (
                <motion.tr
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className={`group hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 ${
                    row.isTotal ? "font-bold text-white bg-white/5" : ""
                    }`}
                >
                    {rowValues.map((cellValue, cIdx) => (
                        <td key={cIdx} className="py-2 px-3 whitespace-nowrap">
                            {cellValue}
                        </td>
                    ))}
                </motion.tr>
                );
                })}
            </tbody>
            </table>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

const FinancialTables = ({ companyId, color, dateRange }) => {
  // Always use 3 years: 1402, 1403, 1404
  const years = [1404, 1403, 1402];
  
  // Generate data based on companyId
  const { 
    assetsData, 
    liabilitiesData, 
    equityData,
    compositionData, 
    ratiosData,
    yearColumns,
    rawAssetsForCharts,
    rawEquityForCharts,
    rawLiabilitiesForCharts,
  } = useMemo(() => {
    const dateSeed = (dateRange?.from?.charCodeAt(6) || 0) + (companyId * 100);
    
    const seed = (s) => {
        return function() {
            s = Math.sin(s) * 10000;
            return s - Math.floor(s);
        };
    };
    const random = seed(dateSeed);

    const formatMoney = (amount) => Math.floor(amount).toLocaleString() + " م.ر";

    // Column headers: سال 1404 | سال 1403 | سال 1402 | شرح
    const yearColumns = [...years.map(y => `سال ${y}`), "شرح"];

    // Helpers for raw data generation
    const generateRawValues = (baseMin, baseMax) => {
        const values = {};
        years.forEach(year => {
             const yearMod = 1 + ((1404 - year) * 0.08) + (random() * 0.1);
             values[year] = (random() * (baseMax - baseMin) + baseMin) * yearMod;
        });
        return values;
    };

    // --- 1. ASSETS (دارایی‌ها) ---
    const assetBaseMin = 5000000;
    const assetBaseMax = 15000000;
    
    const assetItemsRaw = [
        { label: "موجودی نقد و بانک", type: 'current', weight: 0.15 },
        { label: "حساب‌های دریافتنی", type: 'current', weight: 0.25 },
        { label: "موجودی کالا", type: 'current', weight: 0.35 },
        { label: "دارایی‌های ثابت مشهود", type: 'nonCurrent', weight: 0.6 },
        { label: "دارایی‌های ثابت نامشهود", type: 'nonCurrent', weight: 0.2 },
    ];

    const rawAssets = {};
    const totalAssetsByYear = {};
    const currentAssetsByYear = {};
    const nonCurrentAssetsByYear = {};

    years.forEach(year => {
        totalAssetsByYear[year] = 0;
        currentAssetsByYear[year] = 0;
        nonCurrentAssetsByYear[year] = 0;
    });

    assetItemsRaw.forEach(item => {
        rawAssets[item.label] = {};
        const baseVals = generateRawValues(assetBaseMin * item.weight, assetBaseMax * item.weight);
        years.forEach(year => {
            const val = baseVals[year];
            rawAssets[item.label][year] = val;
            totalAssetsByYear[year] += val;
            if (item.type === 'current') currentAssetsByYear[year] += val;
            else nonCurrentAssetsByYear[year] += val;
        });
    });

    // Format Assets Table - columns: سال 1404 | سال 1403 | سال 1402 | شرح
    const assetsData = [
        { ...years.reduce((acc, y) => ({ ...acc, [y]: rawAssets["موجودی نقد و بانک"][y] }), {}), item: "موجودی نقد و بانک" },
        { ...years.reduce((acc, y) => ({ ...acc, [y]: rawAssets["حساب‌های دریافتنی"][y] }), {}), item: "حساب‌های دریافتنی" },
        { ...years.reduce((acc, y) => ({ ...acc, [y]: rawAssets["موجودی کالا"][y] }), {}), item: "موجودی کالا" },
        { ...years.reduce((acc, y) => ({ ...acc, [y]: currentAssetsByYear[y] }), {}), item: "جمع دارایی‌های جاری", isTotal: true },
        { ...years.reduce((acc, y) => ({ ...acc, [y]: rawAssets["دارایی‌های ثابت مشهود"][y] }), {}), item: "دارایی‌های ثابت مشهود" },
        { ...years.reduce((acc, y) => ({ ...acc, [y]: rawAssets["دارایی‌های ثابت نامشهود"][y] }), {}), item: "دارایی‌های ثابت نامشهود" },
        { ...years.reduce((acc, y) => ({ ...acc, [y]: nonCurrentAssetsByYear[y] }), {}), item: "جمع دارایی‌های غیرجاری", isTotal: true },
        { ...years.reduce((acc, y) => ({ ...acc, [y]: totalAssetsByYear[y] }), {}), item: "جمع کل دارایی‌ها", isTotal: true },
    ].map(row => {
        const newRow = {};
        years.forEach(year => {
            newRow[year] = formatMoney(row[year]);
        });
        newRow.item = row.item;
        if (row.isTotal) newRow.isTotal = true;
        return newRow;
    });


    // --- 2. EQUITY (حقوق صاحبان سهام) - Broken down into 4 items ---
    const equityBaseMin = 2000000;
    const equityBaseMax = 5000000;

    const equityItemsRaw = [
        { label: "سرمایه", weight: 0.4 },
        { label: "اندوخته قانونی", weight: 0.2 },
        { label: "سود انباشته", weight: 0.3 },
        { label: "سایر اندوخته‌ها", weight: 0.1 },
    ];

    const rawEquity = {};
    const totalEquityByYear = {};
    years.forEach(year => totalEquityByYear[year] = 0);

    equityItemsRaw.forEach(item => {
        rawEquity[item.label] = {};
        const baseVals = generateRawValues(equityBaseMin * item.weight, equityBaseMax * item.weight);
        years.forEach(year => {
            const val = baseVals[year];
            rawEquity[item.label][year] = val;
            totalEquityByYear[year] += val;
        });
    });

    const equityData = [
        ...equityItemsRaw.map(item => ({
            ...years.reduce((acc, y) => ({ ...acc, [y]: rawEquity[item.label][y] }), {}),
            item: item.label
        })),
        { ...years.reduce((acc, y) => ({ ...acc, [y]: totalEquityByYear[y] }), {}), item: "جمع حقوق صاحبان سهام", isTotal: true },
    ].map(row => {
        const newRow = {};
        years.forEach(year => {
            newRow[year] = formatMoney(row[year]);
        });
        newRow.item = row.item;
        if (row.isTotal) newRow.isTotal = true;
        return newRow;
    });


    // --- 3. LIABILITIES (بدهی‌ها) ---
    // User Rule: Liabilities = Assets + Equity
    const totalLiabilitiesByYear = {};
    years.forEach(year => {
        totalLiabilitiesByYear[year] = totalAssetsByYear[year] + totalEquityByYear[year];
    });

    const liabilityItemsRaw = [
        { label: "حساب‌های پرداختنی", type: 'current', weight: 0.2 },
        { label: "پیش‌دریافت‌ها", type: 'current', weight: 0.15 },
        { label: "ذخیره مزایای پایان خدمت", type: 'nonCurrent', weight: 0.1 },
    ];

    const rawLiabilities = {};
    const currentLiabilitiesByYear = {};
    const nonCurrentLiabilitiesByYear = {};
    years.forEach(year => {
        currentLiabilitiesByYear[year] = 0;
        nonCurrentLiabilitiesByYear[year] = 0;
    });

    liabilityItemsRaw.forEach(item => {
        rawLiabilities[item.label] = {};
        const baseVals = generateRawValues(totalLiabilitiesByYear[1404] * 0.1, totalLiabilitiesByYear[1404] * 0.2); 
        years.forEach(year => {
            const val = baseVals[year];
            rawLiabilities[item.label][year] = val;
            if (item.type === 'current') currentLiabilitiesByYear[year] += val;
            else nonCurrentLiabilitiesByYear[year] += val;
        });
    });

    // Calculate Plug: تسهیلات مالی بلندمدت
    const plugLabel = "تسهیلات مالی بلند مدت";
    rawLiabilities[plugLabel] = {};
    years.forEach(year => {
        const currentSum = currentLiabilitiesByYear[year] + nonCurrentLiabilitiesByYear[year];
        const diff = totalLiabilitiesByYear[year] - currentSum;
        const plugVal = Math.max(0, diff);
        rawLiabilities[plugLabel][year] = plugVal;
        nonCurrentLiabilitiesByYear[year] += plugVal;
    });

    const liabilitiesData = [
        { ...years.reduce((acc, y) => ({ ...acc, [y]: rawLiabilities["حساب‌های پرداختنی"][y] }), {}), item: "حساب‌های پرداختنی" },
        { ...years.reduce((acc, y) => ({ ...acc, [y]: rawLiabilities["پیش‌دریافت‌ها"][y] }), {}), item: "پیش‌دریافت‌ها" },
        { ...years.reduce((acc, y) => ({ ...acc, [y]: currentLiabilitiesByYear[y] }), {}), item: "جمع بدهی‌های جاری", isTotal: true },
        { ...years.reduce((acc, y) => ({ ...acc, [y]: rawLiabilities["تسهیلات مالی بلند مدت"][y] }), {}), item: "تسهیلات مالی بلند مدت" },
        { ...years.reduce((acc, y) => ({ ...acc, [y]: rawLiabilities["ذخیره مزایای پایان خدمت"][y] }), {}), item: "ذخیره مزایای پایان خدمت" },
        { ...years.reduce((acc, y) => ({ ...acc, [y]: nonCurrentLiabilitiesByYear[y] }), {}), item: "جمع بدهی‌های غیرجاری", isTotal: true },
        { ...years.reduce((acc, y) => ({ ...acc, [y]: totalLiabilitiesByYear[y] }), {}), item: "جمع کل بدهی‌ها", isTotal: true },
    ].map(row => {
        const newRow = {};
        years.forEach(year => {
            newRow[year] = formatMoney(row[year]);
        });
        newRow.item = row.item;
        if (row.isTotal) newRow.isTotal = true;
        return newRow;
    });


    // 4. Composition Data for Pie Charts - Detailed breakdown with amounts
    const latestYear = 1404;
    
    // Assets composition - detailed breakdown
    const assetsTotal = totalAssetsByYear[latestYear];
    const rawAssetsForCharts = [
        { label: "موجودی نقد و بانک", value: rawAssets["موجودی نقد و بانک"][latestYear], percent: ((rawAssets["موجودی نقد و بانک"][latestYear] / assetsTotal) * 100).toFixed(1) },
        { label: "حساب‌های دریافتنی", value: rawAssets["حساب‌های دریافتنی"][latestYear], percent: ((rawAssets["حساب‌های دریافتنی"][latestYear] / assetsTotal) * 100).toFixed(1) },
        { label: "موجودی کالا", value: rawAssets["موجودی کالا"][latestYear], percent: ((rawAssets["موجودی کالا"][latestYear] / assetsTotal) * 100).toFixed(1) },
        { label: "دارایی‌های ثابت مشهود", value: rawAssets["دارایی‌های ثابت مشهود"][latestYear], percent: ((rawAssets["دارایی‌های ثابت مشهود"][latestYear] / assetsTotal) * 100).toFixed(1) },
        { label: "دارایی‌های ثابت نامشهود", value: rawAssets["دارایی‌های ثابت نامشهود"][latestYear], percent: ((rawAssets["دارایی‌های ثابت نامشهود"][latestYear] / assetsTotal) * 100).toFixed(1) },
    ].sort((a, b) => b.value - a.value);

    // Equity composition
    const equityTotal = totalEquityByYear[latestYear];
    const rawEquityForCharts = [
        { label: "سرمایه", value: rawEquity["سرمایه"][latestYear], percent: ((rawEquity["سرمایه"][latestYear] / equityTotal) * 100).toFixed(1) },
        { label: "اندوخته قانونی", value: rawEquity["اندوخته قانونی"][latestYear], percent: ((rawEquity["اندوخته قانونی"][latestYear] / equityTotal) * 100).toFixed(1) },
        { label: "سود انباشته", value: rawEquity["سود انباشته"][latestYear], percent: ((rawEquity["سود انباشته"][latestYear] / equityTotal) * 100).toFixed(1) },
        { label: "سایر اندوخته‌ها", value: rawEquity["سایر اندوخته‌ها"][latestYear], percent: ((rawEquity["سایر اندوخته‌ها"][latestYear] / equityTotal) * 100).toFixed(1) },
    ].sort((a, b) => b.value - a.value);

    // Liabilities composition
    const liabilitiesTotal = totalLiabilitiesByYear[latestYear];
    const rawLiabilitiesForCharts = [
        { label: "حساب‌های پرداختنی", value: rawLiabilities["حساب‌های پرداختنی"][latestYear], percent: ((rawLiabilities["حساب‌های پرداختنی"][latestYear] / liabilitiesTotal) * 100).toFixed(1) },
        { label: "پیش‌دریافت‌ها", value: rawLiabilities["پیش‌دریافت‌ها"][latestYear], percent: ((rawLiabilities["پیش‌دریافت‌ها"][latestYear] / liabilitiesTotal) * 100).toFixed(1) },
        { label: "تسهیلات مالی بلند مدت", value: rawLiabilities["تسهیلات مالی بلند مدت"][latestYear], percent: ((rawLiabilities["تسهیلات مالی بلند مدت"][latestYear] / liabilitiesTotal) * 100).toFixed(1) },
        { label: "ذخیره مزایای پایان خدمت", value: rawLiabilities["ذخیره مزایای پایان خدمت"][latestYear], percent: ((rawLiabilities["ذخیره مزایای پایان خدمت"][latestYear] / liabilitiesTotal) * 100).toFixed(1) },
    ].sort((a, b) => b.value - a.value);

    const compositionData = {
        assets: rawAssetsForCharts,
        liabilities: rawLiabilitiesForCharts,
        equity: rawEquityForCharts,
    };

    // 5. Ratios Data - Always 3 years
    const ratiosData = {
        debtToAsset: years.map(() => parseFloat((0.3 + random() * 0.3).toFixed(2))),
        currentRatio: years.map(() => parseFloat((0.8 + random() * 0.8).toFixed(1))),
        quickRatio: years.map(() => parseFloat((0.6 + random() * 0.6).toFixed(1))),
        equityRatio: years.map(() => parseFloat((0.2 + random() * 0.3).toFixed(2))),
        workingCapital: years.map(() => parseFloat((0.5 + random()).toFixed(1))),
        proprietaryRatio: years.map(() => parseFloat((0.4 + random() * 0.2).toFixed(1))),
    };


    return { 
        assetsData, 
        liabilitiesData, 
        equityData, 
        compositionData, 
        ratiosData,
        yearColumns, 
        rawAssetsForCharts,
        rawEquityForCharts,
        rawLiabilitiesForCharts,
    };
  }, [companyId, dateRange]);

  return (
    <div className="w-full space-y-12 pb-12">
       <FadeContent blur={true} duration={600}>
        
        {/* Section 1: Balance Sheet Tables */}
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                    <Wallet size={24} />
                </div>
                <h2 className="text-2xl font-bold text-white">ترازنامه مالی</h2>
            </div>
            
            {/* 
                Layout:
                Grid with 2 columns.
                Col 1 (Right in RTL): Assets + Equity (stacked)
                Col 2 (Left in RTL): Liabilities (limited height)
            */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                {/* Right Column: Assets + Equity stacked */}
                <div className="flex flex-col gap-4" style={{ maxHeight: '500px' }}>
                    <FinancialTableCard 
                        title="دارایی‌ها" 
                        icon={TrendingUp}
                        columns={yearColumns}
                        data={assetsData}
                        hoverColor="34, 197, 94"
                        className="flex-1"
                    />
                    <FinancialTableCard 
                        title="حقوق صاحبان سهام" 
                        icon={CreditCard}
                        columns={yearColumns}
                        data={equityData}
                        hoverColor="59, 130, 246"
                        className="flex-1"
                    />
                </div>
                
                {/* Left Column: Liabilities (limited height) */}
                <div style={{ maxHeight: '500px' }}>
                    <FinancialTableCard 
                        title="بدهی‌ها" 
                        icon={TrendingDown}
                        columns={yearColumns}
                        data={liabilitiesData}
                        hoverColor="239, 68, 68"
                        className="h-full"
                    />
                </div>
            </div>
        </div>

        {/* Section 2: Composition Charts */}
        <div className="space-y-6 mt-16">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-xl bg-green-500/10 text-green-400">
                    <PieChart size={24} />
                </div>
                <h2 className="text-2xl font-bold text-white">ترکیب دارایی، بدهی و حقوق صاحبان سهام</h2>
            </div>
            <FinancialCompositionCharts 
                assetsData={rawAssetsForCharts}
                equityData={rawEquityForCharts}
                liabilitiesData={rawLiabilitiesForCharts}
            />
        </div>

        {/* Section 3: Ratios Charts */}
        <div className="space-y-6 mt-16">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                    <BarChart2 size={24} />
                </div>
                <h2 className="text-2xl font-bold text-white">نسبت‌های مالی</h2>
            </div>
            <FinancialRatiosCharts data={ratiosData} years={years} color={color} />
        </div>

      </FadeContent>
    </div>
  );
};

export default FinancialTables;

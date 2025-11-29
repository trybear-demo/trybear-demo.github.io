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
import TableWrapper from "./TableWrapper";
import FinancialCompositionCharts from "./FinancialCompositionCharts";
import FinancialRatiosCharts from "./FinancialRatiosCharts";

const FinancialTables = ({ companyId, color, dateRange }) => {
  // Generate data based on companyId and dateRange
  const { 
    assetsData, 
    liabilitiesData, 
    equityData,
    compositionData, 
    ratiosData,
    yearColumns, 
    years 
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

    // Extract years from dateRange
    const startYear = parseInt(dateRange.from.split('/')[0]) || 1404;
    const endYear = parseInt(dateRange.to.split('/')[0]) || 1404;
    
    const years = [];
    // Descending order: 1404, 1403, 1402
    for (let y = endYear; y >= startYear; y--) {
        years.push(y);
    }
    if (years.length === 0) years.push(startYear);

    const yearColumns = ["شرح", ...years.map(y => `سال ${y}`)];

    // Helpers for raw data generation
    const generateRawValues = (baseMin, baseMax) => {
        const values = {};
        years.forEach(year => {
             const yearMod = 1 + ((year - startYear) * 0.05) + (random() * 0.1);
             values[year] = (random() * (baseMax - baseMin) + baseMin) * yearMod;
        });
        return values;
    };

    // --- 1. ASSETS (دارایی‌ها) ---
    // Scale: Millions
    const assetBaseMin = 5000000;
    const assetBaseMax = 15000000;
    
    const assetItemsRaw = [
        { label: "موجودی نقد و بانک", type: 'current', weight: 0.15 },
        { label: "حساب‌های دریافتنی", type: 'current', weight: 0.25 },
        { label: "موجودی کالا", type: 'current', weight: 0.35 },
        { label: "دارایی‌های ثابت مشهود", type: 'nonCurrent', weight: 0.6 },
        { label: "دارایی‌های نامشهود", type: 'nonCurrent', weight: 0.2 },
    ];

    const rawAssets = {}; // { label: { year: value } }
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

    // Format Assets Table
    const assetsData = [
        { item: "موجودی نقد و بانک", ...rawAssets["موجودی نقد و بانک"] },
        { item: "حساب‌های دریافتنی", ...rawAssets["حساب‌های دریافتنی"] },
        { item: "موجودی کالا", ...rawAssets["موجودی کالا"] },
        { item: "جمع دارایی‌های جاری", isTotal: true, ...currentAssetsByYear },
        { item: "دارایی‌های ثابت مشهود", ...rawAssets["دارایی‌های ثابت مشهود"] },
        { item: "دارایی‌های نامشهود", ...rawAssets["دارایی‌های نامشهود"] },
        { item: "جمع دارایی‌های غیرجاری", isTotal: true, ...nonCurrentAssetsByYear },
        { item: "جمع کل دارایی‌ها", isTotal: true, ...totalAssetsByYear },
    ].map(row => {
        const newRow = { item: row.item, isTotal: row.isTotal };
        years.forEach(year => {
            newRow[year] = formatMoney(row[year]);
        });
        return newRow;
    });


    // --- 2. EQUITY (حقوق صاحبان سهام) ---
    // Scale: 20-40% of Assets roughly, but user wants A + E = L, so E is additive.
    const equityBaseMin = 2000000;
    const equityBaseMax = 5000000;

    const rawEquity = {};
    const totalEquityByYear = {};
    years.forEach(year => totalEquityByYear[year] = 0);

    const equityLabel = "حقوق صاحبان سرمایه";
    const equityVals = generateRawValues(equityBaseMin, equityBaseMax);
    rawEquity[equityLabel] = equityVals;
    
    years.forEach(year => {
        totalEquityByYear[year] = equityVals[year];
    });

    const equityData = [
        { item: "حقوق صاحبان سرمایه", ...rawEquity[equityLabel] },
        { item: "مجموع حقوق صاحبان سرمایه", isTotal: true, ...totalEquityByYear },
    ].map(row => {
        const newRow = { item: row.item, isTotal: row.isTotal };
        years.forEach(year => {
            newRow[year] = formatMoney(row[year]);
        });
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
        // "تسهیلات مالی بلندمدت" will be the plug variable
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
        // Generate partial values
        const baseVals = generateRawValues(totalLiabilitiesByYear[years[0]] * 0.1, totalLiabilitiesByYear[years[0]] * 0.2); 
        years.forEach(year => {
            const val = baseVals[year];
            rawLiabilities[item.label][year] = val;
            if (item.type === 'current') currentLiabilitiesByYear[year] += val;
            else nonCurrentLiabilitiesByYear[year] += val;
        });
    });

    // Calculate Plug: تسهیلات مالی بلندمدت
    const plugLabel = "تسهیلات مالی بلندمدت";
    rawLiabilities[plugLabel] = {};
    years.forEach(year => {
        const currentSum = currentLiabilitiesByYear[year] + nonCurrentLiabilitiesByYear[year];
        const diff = totalLiabilitiesByYear[year] - currentSum;
        const plugVal = Math.max(0, diff); // Ensure non-negative
        rawLiabilities[plugLabel][year] = plugVal;
        nonCurrentLiabilitiesByYear[year] += plugVal;
    });

    const liabilitiesData = [
        { item: "حساب‌های پرداختنی", ...rawLiabilities["حساب‌های پرداختنی"] },
        { item: "پیش‌دریافت‌ها", ...rawLiabilities["پیش‌دریافت‌ها"] },
        { item: "جمع بدهی‌های جاری", isTotal: true, ...currentLiabilitiesByYear },
        { item: "تسهیلات مالی بلندمدت", ...rawLiabilities["تسهیلات مالی بلندمدت"] },
        { item: "ذخیره مزایای پایان خدمت", ...rawLiabilities["ذخیره مزایای پایان خدمت"] },
        { item: "جمع بدهی‌های غیرجاری", isTotal: true, ...nonCurrentLiabilitiesByYear },
        { item: "جمع کل بدهی‌ها", isTotal: true, ...totalLiabilitiesByYear }, 
    ].map(row => {
        const newRow = { item: row.item, isTotal: row.isTotal };
        years.forEach(year => {
            newRow[year] = formatMoney(row[year]);
        });
        return newRow;
    });


    // 4. Composition Data (Donut Charts) - Mock Percentages
    const compositionData = {
        assets: [
            { label: "دارایی‌های جاری", value: 38.6, color: "#3b82f6" },
            { label: "دارایی‌های غیرجاری", value: 61.4, color: "#10b981" },
        ],
        liabilities: [
            { label: "بدهی‌های جاری", value: 53.8, color: "#ef4444" },
            { label: "بدهی‌های غیرجاری", value: 46.2, color: "#f59e0b" },
        ],
        equity: [
            { label: "سرمایه پرداخت شده", value: 60.0, color: "#8b5cf6" },
            { label: "سود انباشته", value: 30.0, color: "#ec4899" },
            { label: "سایر اقلام", value: 10.0, color: "#06b6d4" },
        ]
    };

    // 5. Ratios Data (Bar/Line Charts) - Mock Trends
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
        years 
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
                Col 1 (Right in RTL): Assets + Equity
                Col 2 (Left in RTL): Liabilities (Full Height)
            */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <div className="space-y-6">
                    <TableWrapper 
                        title="دارایی‌ها" 
                        icon={TrendingUp}
                        columns={yearColumns}
                        data={assetsData}
                        color={color}
                        autoHeight={true}
                    />
                    <TableWrapper 
                        title="حقوق صاحبان سهام" 
                        icon={CreditCard}
                        columns={yearColumns}
                        data={equityData}
                        color={color}
                        autoHeight={true}
                    />
                </div>
                
                <div className="h-full">
                    <TableWrapper 
                        title="بدهی‌ها" 
                        icon={TrendingDown}
                        columns={yearColumns}
                        data={liabilitiesData}
                        color={color}
                        className="!h-full" 
                    />
                </div>
            </div>
        </div>

        {/* Section 2: Composition Charts */}
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-green-500/10 text-green-400">
                    <PieChart size={24} />
                </div>
                <h2 className="text-2xl font-bold text-white">ترکیب دارایی، بدهی و سرمایه</h2>
            </div>
            <FinancialCompositionCharts data={compositionData} />
        </div>

        {/* Section 3: Ratios Charts */}
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
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

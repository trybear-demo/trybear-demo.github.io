import React, { useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Download,
  Filter,
} from "lucide-react";
import FadeContent from "./FadeContent";

// Persian number formatter
const formatMoney = (num) => {
  return Math.floor(num).toLocaleString() + " م.ر";
};

// Generate mock P&L data for 3 years
const generateProfitLossData = (companyId) => {
  const seed = (s) => {
    return function () {
      s = Math.sin(s) * 10000;
      return s - Math.floor(s);
    };
  };

  const random = seed(companyId * 777);
  const years = [1404, 1403, 1402];

  const data = {};
  
  years.forEach((year, idx) => {
    const yearRandom = seed(companyId * 100 + year);
    const growthFactor = 1 + (2 - idx) * 0.12 + yearRandom() * 0.08;

    // Base revenue
    const netOperatingRevenue = Math.floor((180000 + random() * 80000) * growthFactor);
    
    // Cost breakdown (roughly 60-70% of revenue)
    const cogpRatio = 0.58 + yearRandom() * 0.12;
    const costOfGoodsProduced = Math.floor(netOperatingRevenue * cogpRatio);
    
    // Gross Profit
    const grossProfit = netOperatingRevenue - costOfGoodsProduced;
    
    // Operating expenses (8-12% of revenue)
    const adminExpenses = Math.floor(netOperatingRevenue * (0.04 + yearRandom() * 0.02));
    const sellingExpenses = Math.floor(netOperatingRevenue * (0.03 + yearRandom() * 0.02));
    const otherOperatingExpenses = Math.floor(netOperatingRevenue * (0.02 + yearRandom() * 0.01));
    const totalOperatingExpenses = adminExpenses + sellingExpenses + otherOperatingExpenses;
    
    // Operating Profit
    const operatingProfit = grossProfit - totalOperatingExpenses;
    
    // Non-operating items
    const financialIncome = Math.floor(netOperatingRevenue * (0.01 + yearRandom() * 0.015));
    const financialExpenses = Math.floor(netOperatingRevenue * (0.02 + yearRandom() * 0.02));
    const otherIncome = Math.floor(netOperatingRevenue * (0.005 + yearRandom() * 0.01));
    const otherExpenses = Math.floor(netOperatingRevenue * (0.003 + yearRandom() * 0.005));
    
    // Profit before tax
    const profitBeforeTax = operatingProfit + financialIncome - financialExpenses + otherIncome - otherExpenses;
    
    // Tax (25%)
    const incomeTax = Math.floor(Math.max(0, profitBeforeTax) * 0.25);
    
    // Net Profit
    const netProfit = profitBeforeTax - incomeTax;

    data[year] = {
      netOperatingRevenue,
      costOfGoodsProduced,
      grossProfit,
      adminExpenses,
      sellingExpenses,
      otherOperatingExpenses,
      totalOperatingExpenses,
      operatingProfit,
      financialIncome,
      financialExpenses,
      otherIncome,
      otherExpenses,
      profitBeforeTax,
      incomeTax,
      netProfit,
    };
  });

  return { data, years };
};

// Table row data structure
const createTableRows = (data, years) => {
  const rows = [
    { 
      label: "درآمد عملیاتی خالص", 
      type: "revenue",
      values: years.map(y => data[y].netOperatingRevenue),
      isHeader: false,
    },
    { 
      label: "بهای تمام شده کالای فروش رفته", 
      type: "expense",
      values: years.map(y => data[y].costOfGoodsProduced),
      isNegative: true,
    },
    { 
      label: "سود ناخالص", 
      type: "profit",
      values: years.map(y => data[y].grossProfit),
      isTotal: true,
    },
    { divider: true },
    { 
      label: "هزینه‌های اداری و عمومی", 
      type: "expense",
      values: years.map(y => data[y].adminExpenses),
      isNegative: true,
    },
    { 
      label: "هزینه‌های فروش و توزیع", 
      type: "expense",
      values: years.map(y => data[y].sellingExpenses),
      isNegative: true,
    },
    { 
      label: "سایر هزینه‌های عملیاتی", 
      type: "expense",
      values: years.map(y => data[y].otherOperatingExpenses),
      isNegative: true,
    },
    { 
      label: "جمع هزینه‌های عملیاتی", 
      type: "expense",
      values: years.map(y => data[y].totalOperatingExpenses),
      isNegative: true,
      isSubTotal: true,
    },
    { 
      label: "سود عملیاتی", 
      type: "profit",
      values: years.map(y => data[y].operatingProfit),
      isTotal: true,
    },
    { divider: true },
    { 
      label: "درآمدهای مالی", 
      type: "revenue",
      values: years.map(y => data[y].financialIncome),
    },
    { 
      label: "هزینه‌های مالی", 
      type: "expense",
      values: years.map(y => data[y].financialExpenses),
      isNegative: true,
    },
    { 
      label: "سایر درآمدها", 
      type: "revenue",
      values: years.map(y => data[y].otherIncome),
    },
    { 
      label: "سایر هزینه‌ها", 
      type: "expense",
      values: years.map(y => data[y].otherExpenses),
      isNegative: true,
    },
    { 
      label: "سود قبل از مالیات", 
      type: "profit",
      values: years.map(y => data[y].profitBeforeTax),
      isTotal: true,
    },
    { 
      label: "مالیات بر درآمد", 
      type: "expense",
      values: years.map(y => data[y].incomeTax),
      isNegative: true,
    },
    { 
      label: "سود خالص", 
      type: "netProfit",
      values: years.map(y => data[y].netProfit),
      isTotal: true,
      isFinal: true,
    },
  ];

  return rows;
};

const ProfitLossContent = ({ companyId, color, dateRange }) => {
  const cardRef = useRef(null);
  const { data, years } = useMemo(() => generateProfitLossData(companyId), [companyId]);
  const tableRows = useMemo(() => createTableRows(data, years), [data, years]);

  // Column headers
  const columns = [...years.map(y => `سال ${y}`), "شرح"];

  useEffect(() => {
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

  // Get row styling based on type
  const getRowStyle = (row) => {
    if (row.divider) return "";
    if (row.isFinal) return "bg-gradient-to-l from-emerald-500/20 to-transparent font-bold text-emerald-400";
    if (row.isTotal) return "font-bold text-white bg-white/5";
    if (row.isSubTotal) return "font-medium text-gray-300 bg-white/[0.02]";
    return "";
  };

  const getValueColor = (row, value) => {
    if (row.isFinal) return value >= 0 ? "text-emerald-400" : "text-rose-400";
    if (row.isTotal) return value >= 0 ? "text-white" : "text-rose-400";
    if (row.type === "revenue") return "text-emerald-400/80";
    if (row.type === "expense" || row.isNegative) return "text-rose-400/80";
    if (row.type === "profit") return value >= 0 ? "text-blue-400" : "text-rose-400";
    return "text-gray-300";
  };

  return (
    <FadeContent blur={true} duration={600}>
      <div className="w-full pb-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <TrendingUp size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white">صورت سود و زیان</h2>
        </div>

        {/* Table Card */}
        <div
          ref={cardRef}
          className="w-full bg-[#060010] border border-white/10 rounded-3xl p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group/card"
          style={{ "--glow-color": "34, 197, 94" }}
        >
          {/* Border Glow Effect */}
          <div
            className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(34, 197, 94, 0.1), transparent 40%)`,
              zIndex: 0,
            }}
          />

          {/* Content */}
          <div className="relative z-10">
            {/* Table Header Controls */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-emerald-500 to-blue-500" />
                <h3 className="text-base font-bold text-white">جدول صورت سود و زیان</h3>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 transition-colors">
                  <Filter size={16} />
                </button>
                <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 transition-colors">
                  <Download size={16} />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-right border-collapse min-w-[600px]">
                <thead className="sticky top-0 bg-[#060010] z-10">
                  <tr>
                    {columns.map((col, i) => (
                      <th
                        key={i}
                        className={`pb-4 pt-2 px-4 text-gray-500 font-medium text-sm border-b border-white/10 whitespace-nowrap ${
                          i === columns.length - 1 ? "text-right" : "text-center"
                        }`}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {tableRows.map((row, idx) => {
                    if (row.divider) {
                      return (
                        <tr key={idx}>
                          <td colSpan={columns.length} className="py-2">
                            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                          </td>
                        </tr>
                      );
                    }

                    return (
                      <motion.tr
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        className={`group hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 ${getRowStyle(row)}`}
                      >
                        {/* Year values */}
                        {row.values.map((val, vIdx) => (
                          <td 
                            key={vIdx} 
                            className={`py-3 px-4 whitespace-nowrap text-center font-mono ${getValueColor(row, val)}`}
                          >
                            {row.isNegative ? `(${formatMoney(val)})` : formatMoney(val)}
                          </td>
                        ))}
                        
                        {/* Label (last column) */}
                        <td className="py-3 px-4 whitespace-nowrap text-right text-gray-300">
                          {row.label}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <style>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
              height: 6px;
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
      </div>
    </FadeContent>
  );
};

export default ProfitLossContent;

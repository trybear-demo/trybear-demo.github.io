import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Percent,
  Receipt,
} from "lucide-react";
import { useCursor } from "../context/CursorContext";

// Persian number formatter
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + " میلیارد";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + " میلیون";
  }
  return num.toLocaleString("fa-IR");
};

const persianMonths = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
];

// Generate mock P&L data for 3 years
const generateProfitLossData = (companyId) => {
  const seed = (s) => {
    return function () {
      s = Math.sin(s) * 10000;
      return s - Math.floor(s);
    };
  };

  const random = seed(companyId * 777);
  const years = [1402, 1403, 1404];

  const data = years.map((year, idx) => {
    const yearRandom = seed(companyId * 100 + year);

    // Base values that grow over years
    const growthFactor = 1 + idx * 0.15 + yearRandom() * 0.1;

    // Net Operating Revenue (خالص درآمدهای عملیاتی)
    const netOperatingRevenue = Math.floor(
      (150000 + random() * 100000) * growthFactor
    );

    // Cost of Goods Produced (بهای تمام شده کالای تولید شده) - 55-70% of revenue
    const cogpRatio = 0.55 + yearRandom() * 0.15;
    const costOfGoodsProduced = Math.floor(netOperatingRevenue * cogpRatio);

    // Gross Profit (سود ناخالص)
    const grossProfit = netOperatingRevenue - costOfGoodsProduced;
    const grossProfitMargin = (grossProfit / netOperatingRevenue) * 100;

    // Other Operating Expenses (سایر هزینه‌های عملیاتی) - 8-15% of revenue
    const otherOpExpRatio = 0.08 + yearRandom() * 0.07;
    const otherOperatingExpenses = Math.floor(
      netOperatingRevenue * otherOpExpRatio
    );

    // Operating Profit (سود عملیاتی)
    const operatingProfit = grossProfit - otherOperatingExpenses;
    const operatingProfitMargin = (operatingProfit / netOperatingRevenue) * 100;

    // Other Non-Operating (سایر هزینه‌ها و درآمدهای غیرعملیاتی) - can be positive or negative
    const nonOpFactor = yearRandom() - 0.5;
    const otherNonOperating = Math.floor(netOperatingRevenue * 0.03 * nonOpFactor);

    // Net Profit Before Tax (سود خالص قبل از مالیات)
    const netProfitBeforeTax = operatingProfit + otherNonOperating;
    const netProfitMargin = (netProfitBeforeTax / netOperatingRevenue) * 100;

    return {
      year,
      netOperatingRevenue,
      costOfGoodsProduced,
      grossProfit,
      grossProfitMargin,
      otherOperatingExpenses,
      operatingProfit,
      operatingProfitMargin,
      otherNonOperating,
      netProfitBeforeTax,
      netProfitMargin,
    };
  });

  // Calculate YoY changes
  return data.map((item, idx) => {
    if (idx === 0) {
      return { ...item, changes: null };
    }
    const prev = data[idx - 1];
    return {
      ...item,
      changes: {
        netOperatingRevenue:
          ((item.netOperatingRevenue - prev.netOperatingRevenue) /
            prev.netOperatingRevenue) *
          100,
        costOfGoodsProduced:
          ((item.costOfGoodsProduced - prev.costOfGoodsProduced) /
            prev.costOfGoodsProduced) *
          100,
        grossProfit:
          ((item.grossProfit - prev.grossProfit) / prev.grossProfit) * 100,
        operatingProfit:
          ((item.operatingProfit - prev.operatingProfit) /
            prev.operatingProfit) *
          100,
        netProfitBeforeTax:
          ((item.netProfitBeforeTax - prev.netProfitBeforeTax) /
            Math.abs(prev.netProfitBeforeTax)) *
          100,
      },
    };
  });
};

// Generate monthly trend data
const generateMonthlyTrendData = (companyId, years) => {
  const seed = (s) => {
    return function () {
      s = Math.sin(s) * 10000;
      return s - Math.floor(s);
    };
  };

  const data = [];
  
  years.forEach((year) => {
    persianMonths.forEach((month, monthIdx) => {
      const random = seed(companyId * 1000 + year * 100 + monthIdx);
      
      // Base values with seasonal variation
      const seasonFactor = 1 + Math.sin((monthIdx / 12) * Math.PI * 2) * 0.2;
      const yearFactor = (year - 1402) * 0.1 + 1;
      
      const grossProfit = Math.floor((8000 + random() * 4000) * seasonFactor * yearFactor);
      const operatingProfit = Math.floor(grossProfit * (0.6 + random() * 0.2));
      const netProfit = Math.floor(operatingProfit * (0.85 + random() * 0.1));
      
      const revenue = Math.floor((25000 + random() * 10000) * seasonFactor * yearFactor);
      const grossMargin = (grossProfit / revenue) * 100;
      const operatingMargin = (operatingProfit / revenue) * 100;
      const netMargin = (netProfit / revenue) * 100;
      
      const costOfGoods = Math.floor(revenue * (0.55 + random() * 0.1));
      const operatingExpenses = Math.floor(revenue * (0.1 + random() * 0.05));
      const otherExpenses = Math.floor(revenue * (0.02 + random() * 0.02));
      
      data.push({
        year,
        month,
        monthIdx,
        grossProfit,
        operatingProfit,
        netProfit,
        grossMargin,
        operatingMargin,
        netMargin,
        costOfGoods,
        operatingExpenses,
        otherExpenses,
        totalExpenses: costOfGoods + operatingExpenses + otherExpenses,
      });
    });
  });
  
  return data;
};

// Generate expense breakdown data
const generateExpenseBreakdown = (companyId) => {
  const seed = (s) => {
    return function () {
      s = Math.sin(s) * 10000;
      return s - Math.floor(s);
    };
  };
  
  const random = seed(companyId * 555);
  
  const expenses = [
    { name: "بهای تمام شده کالا", color: "#ef4444", value: 120000 + Math.floor(random() * 30000) },
    { name: "هزینه‌های اداری", color: "#f97316", value: 15000 + Math.floor(random() * 5000) },
    { name: "هزینه‌های فروش", color: "#eab308", value: 12000 + Math.floor(random() * 4000) },
    { name: "هزینه‌های مالی", color: "#8b5cf6", value: 8000 + Math.floor(random() * 3000) },
    { name: "استهلاک", color: "#3b82f6", value: 5000 + Math.floor(random() * 2000) },
    { name: "سایر هزینه‌ها", color: "#6b7280", value: 3000 + Math.floor(random() * 1500) },
  ];
  
  const total = expenses.reduce((sum, e) => sum + e.value, 0);
  
  return expenses.map(e => ({
    ...e,
    percent: ((e.value / total) * 100).toFixed(1),
  }));
};

// Split Card Component for showing two metrics side by side
const SplitCard = ({ rightLabel, rightValue, leftLabel, leftValue, color, icon: Icon, delay = 0 }) => {
  const { setCursorVariant } = useCursor();
  const isPositive = typeof leftValue === "number" ? leftValue > 0 : true;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 rounded-2xl p-4 overflow-hidden group hover:border-white/20 transition-all duration-500 min-h-[100px]"
      onMouseEnter={() => setCursorVariant("button")}
      onMouseLeave={() => setCursorVariant("default")}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(${color}, 0.15), transparent 70%)`,
        }}
      />

      <div
        className="absolute top-3 left-3 w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: `rgba(${color}, 0.15)` }}
      >
        <Icon size={16} style={{ color: `rgb(${color})` }} />
      </div>

      <div className="relative z-10 flex items-center gap-3 mt-1">
        <div className="flex-1 text-right border-l border-white/10 pl-3">
          <p className="text-[10px] text-gray-500 mb-0.5">{rightLabel}</p>
          <p className="text-lg font-bold text-white">
            {typeof rightValue === "number"
              ? formatNumber(rightValue)
              : rightValue}
          </p>
        </div>

        <div className="flex-1 text-right">
          <p className="text-[10px] text-gray-500 mb-0.5">{leftLabel}</p>
          <p
            className={`text-lg font-bold ${
              isPositive ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {typeof leftValue === "number" ? leftValue.toFixed(1) + "%" : leftValue}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// Single Metric Card
const MetricCard = ({ label, value, subLabel, color, icon: Icon, delay = 0 }) => {
  const { setCursorVariant } = useCursor();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 rounded-2xl p-4 overflow-hidden group hover:border-white/20 transition-all duration-500 min-h-[100px]"
      onMouseEnter={() => setCursorVariant("button")}
      onMouseLeave={() => setCursorVariant("default")}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(${color}, 0.15), transparent 70%)`,
        }}
      />

      <div
        className="absolute top-3 left-3 w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: `rgba(${color}, 0.15)` }}
      >
        <Icon size={16} style={{ color: `rgb(${color})` }} />
      </div>

      <div className="relative z-10 text-right mt-1">
        <p className="text-[10px] text-gray-500 mb-0.5">{label}</p>
        <p className="text-xl font-bold text-white">
          {typeof value === "number" ? formatNumber(value) : value}
        </p>
        {subLabel && (
          <p className="text-[10px] text-gray-500 mt-0.5">{subLabel}</p>
        )}
      </div>
    </motion.div>
  );
};

// Waterfall Chart Item Row
const ChartRow = ({
  label,
  values,
  changes,
  maxValue,
  type = "positive",
  delay = 0,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getColor = (type, isProfit = false) => {
    if (type === "revenue") return "#22c55e";
    if (type === "cost") return "#ef4444";
    if (type === "expense") return "#f97316";
    if (type === "profit") return isProfit ? "#3b82f6" : "#8b5cf6";
    if (type === "mixed") return "#eab308";
    return "#6b7280";
  };

  const color = getColor(type, label.includes("خالص"));

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`grid grid-cols-12 gap-2 py-2.5 px-3 rounded-lg transition-all duration-300 ${
        isHovered ? "bg-white/5" : "bg-transparent"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="col-span-3 flex items-center gap-2">
        <div
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: color }}
        />
        <span className="text-xs text-white font-medium truncate">{label}</span>
      </div>

      {values.map((val, idx) => (
        <div key={idx} className="col-span-3 flex items-center gap-1.5">
          <div className="flex-1 h-7 bg-white/5 rounded-md overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(Math.abs(val) / maxValue) * 100}%` }}
              transition={{ duration: 0.8, delay: delay + idx * 0.1 }}
              className="h-full rounded-md"
              style={{
                backgroundColor: color,
                opacity: 0.7 + idx * 0.1,
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] text-white font-bold drop-shadow-lg">
                {formatNumber(Math.abs(val))}
              </span>
            </div>
          </div>

          {changes && changes[idx] !== null && (
            <div
              className={`flex items-center gap-0.5 text-[10px] min-w-[40px] justify-end ${
                changes[idx] >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {changes[idx] >= 0 ? (
                <ArrowUpRight size={10} />
              ) : (
                <ArrowDownRight size={10} />
              )}
              <span>{Math.abs(changes[idx]).toFixed(1)}%</span>
            </div>
          )}
        </div>
      ))}
    </motion.div>
  );
};

// Trend Line Chart Component
const TrendChart = ({ data, mode, color }) => {
  const { setCursorVariant } = useCursor();
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const width = 600;
  const height = 200;
  const padding = { top: 20, right: 20, bottom: 30, left: 10 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Get data series based on mode
  const getSeries = () => {
    if (mode === "profits") {
      return [
        { key: "grossProfit", name: "سود ناخالص", color: "#3b82f6" },
        { key: "operatingProfit", name: "سود عملیاتی", color: "#8b5cf6" },
        { key: "netProfit", name: "سود خالص", color: "#22c55e" },
      ];
    } else if (mode === "margins") {
      return [
        { key: "grossMargin", name: "حاشیه سود ناخالص", color: "#3b82f6" },
        { key: "operatingMargin", name: "حاشیه سود عملیاتی", color: "#8b5cf6" },
        { key: "netMargin", name: "حاشیه سود خالص", color: "#22c55e" },
      ];
    } else {
      return [
        { key: "totalExpenses", name: "کل هزینه‌ها", color: "#ef4444" },
      ];
    }
  };

  const series = getSeries();
  
  // Find max value for scaling
  const allValues = series.flatMap(s => data.map(d => d[s.key]));
  const maxVal = Math.max(...allValues) * 1.1;
  const minVal = Math.min(...allValues, 0);
  const range = maxVal - minVal;

  // Calculate point positions
  const getX = (idx) => padding.left + (idx / (data.length - 1)) * chartWidth;
  const getY = (val) => padding.top + chartHeight - ((val - minVal) / range) * chartHeight;

  // Create path for each series
  const createPath = (seriesKey) => {
    return data.map((d, i) => {
      const x = getX(i);
      const y = getY(d[seriesKey]);
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    }).join(" ");
  };

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={padding.left}
            y1={padding.top + chartHeight * (1 - t)}
            x2={width - padding.right}
            y2={padding.top + chartHeight * (1 - t)}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
        ))}

        {/* Lines and areas */}
        {series.map((s, sIdx) => (
          <g key={s.key}>
            {/* Area fill */}
            <path
              d={`${createPath(s.key)} L ${getX(data.length - 1)} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z`}
              fill={s.color}
              opacity="0.1"
            />
            {/* Line */}
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: sIdx * 0.2 }}
              d={createPath(s.key)}
              fill="none"
              stroke={s.color}
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Points */}
            {data.map((d, i) => (
              <motion.circle
                key={i}
                initial={{ r: 0 }}
                animate={{ r: hoveredPoint?.idx === i ? 5 : 3 }}
                cx={getX(i)}
                cy={getY(d[s.key])}
                fill={s.color}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint({ idx: i, series: s, value: d[s.key], data: d })}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            ))}
          </g>
        ))}

        {/* X-axis labels (every 3 months) */}
        {data.filter((_, i) => i % 3 === 0).map((d, i) => (
          <text
            key={i}
            x={getX(i * 3)}
            y={height - 5}
            fill="#666"
            fontSize="8"
            textAnchor="middle"
          >
            {d.month} {d.year}
          </text>
        ))}
      </svg>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredPoint && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-2 left-2 bg-black/95 backdrop-blur-md border border-white/10 rounded-xl p-3 text-xs z-10 min-w-[180px] shadow-xl"
          >
            <p className="text-white font-bold mb-2 border-b border-white/10 pb-2 text-right">
              {hoveredPoint.data.month} {hoveredPoint.data.year}
            </p>
            <div className="space-y-2">
              {series.map((s) => (
                <div key={s.key} className="flex items-center justify-between gap-3">
                  <span className="font-mono font-bold" style={{ color: s.color }}>
                    {mode === "margins" 
                      ? hoveredPoint.data[s.key].toFixed(1) + "%" 
                      : formatNumber(hoveredPoint.data[s.key])}
                  </span>
                  <span className="text-gray-400 text-[10px] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                    {s.name}
                  </span>
                </div>
              ))}
              
              {/* Extra info for specific modes */}
              {mode === "profits" && (
                <div className="border-t border-white/10 pt-2 mt-2 space-y-1">
                  <div className="flex items-center justify-between gap-3 text-[10px]">
                    <span className="text-gray-300 font-mono">
                      {formatNumber(hoveredPoint.data.costOfGoods)}
                    </span>
                    <span className="text-gray-500">بهای تمام شده:</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-[10px]">
                    <span className="text-gray-300 font-mono">
                      {formatNumber(hoveredPoint.data.operatingExpenses)}
                    </span>
                    <span className="text-gray-500">هزینه‌های عملیاتی:</span>
                  </div>
                </div>
              )}
              
              {mode === "expenses" && (
                <div className="border-t border-white/10 pt-2 mt-2 space-y-1">
                  <div className="flex items-center justify-between gap-3 text-[10px]">
                    <span className="text-gray-300 font-mono">
                      {formatNumber(hoveredPoint.data.costOfGoods)}
                    </span>
                    <span className="text-gray-500">بهای کالا:</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-[10px]">
                    <span className="text-gray-300 font-mono">
                      {formatNumber(hoveredPoint.data.operatingExpenses)}
                    </span>
                    <span className="text-gray-500">هزینه‌های عملیاتی:</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-[10px]">
                    <span className="text-gray-300 font-mono">
                      {formatNumber(hoveredPoint.data.otherExpenses)}
                    </span>
                    <span className="text-gray-500">سایر هزینه‌ها:</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center mt-2">
        {series.map((s) => (
          <div key={s.key} className="flex items-center gap-1.5 text-[10px]">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-gray-400">{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Pie Chart Component
const ExpensePieChart = ({ expenses, color }) => {
  const { setCursorVariant } = useCursor();
  const [hoveredSlice, setHoveredSlice] = useState(null);
  
  const total = expenses.reduce((sum, e) => sum + e.value, 0);
  const cx = 100;
  const cy = 100;
  const radius = 80;
  const innerRadius = 50;
  
  let currentAngle = -90;
  
  const slices = expenses.map((expense, idx) => {
    const angle = (expense.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;
    
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);
    
    const x1Inner = cx + innerRadius * Math.cos(startRad);
    const y1Inner = cy + innerRadius * Math.sin(startRad);
    const x2Inner = cx + innerRadius * Math.cos(endRad);
    const y2Inner = cy + innerRadius * Math.sin(endRad);
    
    const largeArc = angle > 180 ? 1 : 0;
    
    const d = `
      M ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
      L ${x2Inner} ${y2Inner}
      A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x1Inner} ${y1Inner}
      Z
    `;
    
    return {
      ...expense,
      d,
      midAngle: (startAngle + endAngle) / 2,
      idx,
    };
  });

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 200" className="w-48 h-48">
        {slices.map((slice) => (
          <motion.path
            key={slice.name}
            d={slice.d}
            fill={slice.color}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: hoveredSlice === slice.idx ? 1 : 0.8,
              scale: hoveredSlice === slice.idx ? 1.02 : 1,
            }}
            transition={{ duration: 0.3 }}
            className="cursor-pointer"
            onMouseEnter={() => {
              setHoveredSlice(slice.idx);
              setCursorVariant("button");
            }}
            onMouseLeave={() => {
              setHoveredSlice(null);
              setCursorVariant("default");
            }}
          />
        ))}
        
        {/* Center text */}
        <text x={cx} y={cy - 5} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">
          جمع هزینه‌ها
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="#9ca3af" fontSize="10">
          {formatNumber(total)}
        </text>
      </svg>

      {/* Legend */}
      <div className="w-full space-y-1.5 mt-2">
        {expenses.map((expense, idx) => (
          <motion.div
            key={expense.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`flex items-center justify-between text-[10px] px-2 py-1 rounded transition-colors ${
              hoveredSlice === idx ? "bg-white/10" : ""
            }`}
            onMouseEnter={() => setHoveredSlice(idx)}
            onMouseLeave={() => setHoveredSlice(null)}
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: expense.color }} />
              <span className="text-gray-300">{expense.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">{formatNumber(expense.value)}</span>
              <span className="text-white font-bold">{expense.percent}%</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ProfitLossContent = ({ companyId, color, dateRange }) => {
  const { setCursorVariant } = useCursor();
  const [trendMode, setTrendMode] = useState("profits");

  const data = useMemo(
    () => generateProfitLossData(companyId),
    [companyId]
  );

  const monthlyData = useMemo(
    () => generateMonthlyTrendData(companyId, [1402, 1403, 1404]),
    [companyId]
  );

  const expenseBreakdown = useMemo(
    () => generateExpenseBreakdown(companyId),
    [companyId]
  );

  const latestData = data[data.length - 1];

  const maxValue = Math.max(
    ...data.map((d) =>
      Math.max(
        d.netOperatingRevenue,
        d.costOfGoodsProduced,
        d.grossProfit,
        d.operatingProfit,
        Math.abs(d.netProfitBeforeTax)
      )
    )
  );

  const chartItems = [
    {
      label: "خالص درآمدهای عملیاتی",
      values: data.map((d) => d.netOperatingRevenue),
      changes: [null, ...data.slice(1).map((d) => d.changes?.netOperatingRevenue)],
      type: "revenue",
    },
    {
      label: "بهای تمام شده کالای تولید شده",
      values: data.map((d) => d.costOfGoodsProduced),
      changes: [null, ...data.slice(1).map((d) => d.changes?.costOfGoodsProduced)],
      type: "cost",
    },
    {
      label: "سود ناخالص",
      values: data.map((d) => d.grossProfit),
      changes: [null, ...data.slice(1).map((d) => d.changes?.grossProfit)],
      type: "profit",
    },
    {
      label: "سایر هزینه‌ها و درآمدهای عملیاتی",
      values: data.map((d) => d.otherOperatingExpenses),
      changes: [null, null, null],
      type: "expense",
    },
    {
      label: "سود عملیاتی",
      values: data.map((d) => d.operatingProfit),
      changes: [null, ...data.slice(1).map((d) => d.changes?.operatingProfit)],
      type: "profit",
    },
    {
      label: "سایر هزینه‌ها و درآمدهای غیرعملیاتی",
      values: data.map((d) => d.otherNonOperating),
      changes: [null, null, null],
      type: "mixed",
    },
    {
      label: "سود خالص قبل از مالیات",
      values: data.map((d) => d.netProfitBeforeTax),
      changes: [null, ...data.slice(1).map((d) => d.changes?.netProfitBeforeTax)],
      type: "profit",
    },
  ];

  const trendButtons = [
    { key: "profits", label: "روند سود", icon: TrendingUp },
    { key: "margins", label: "روند حاشیه", icon: Percent },
    { key: "expenses", label: "روند هزینه", icon: Receipt },
  ];

  return (
    <div className="space-y-6">
      {/* Top Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          label="درآمد عملیاتی خالص"
          value={latestData.netOperatingRevenue}
          subLabel="میلیون ریال"
          color="34, 197, 94"
          icon={DollarSign}
          delay={0}
        />

        <SplitCard
          rightLabel="سود ناخالص"
          rightValue={latestData.grossProfit}
          leftLabel="حاشیه سود ناخالص"
          leftValue={latestData.grossProfitMargin}
          color="59, 130, 246"
          icon={TrendingUp}
          delay={0.1}
        />

        <SplitCard
          rightLabel="سود عملیاتی"
          rightValue={latestData.operatingProfit}
          leftLabel="حاشیه سود عملیاتی"
          leftValue={latestData.operatingProfitMargin}
          color="168, 85, 247"
          icon={BarChart3}
          delay={0.2}
        />

        <SplitCard
          rightLabel="سود خالص قبل از مالیات"
          rightValue={latestData.netProfitBeforeTax}
          leftLabel="حاشیه سود خالص"
          leftValue={latestData.netProfitMargin}
          color={latestData.netProfitMargin >= 0 ? "34, 197, 94" : "239, 68, 68"}
          icon={latestData.netProfitMargin >= 0 ? TrendingUp : TrendingDown}
          delay={0.3}
        />
      </div>

      {/* P&L Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 rounded-2xl p-5 overflow-hidden"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-500 to-purple-500" />
            <h3 className="text-base font-bold text-white">صورت سود و زیان</h3>
          </div>

          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-gray-400">درآمد</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="text-gray-400">بهای تمام شده</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              <span className="text-gray-400">هزینه‌ها</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-gray-400">سود</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-2 mb-3 px-3">
          <div className="col-span-3" />
          {data.map((d, idx) => (
            <div
              key={d.year}
              className="col-span-3 text-center text-xs font-bold text-gray-400"
            >
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md"
                style={{
                  backgroundColor:
                    idx === data.length - 1
                      ? `rgba(${color}, 0.2)`
                      : "rgba(255,255,255,0.05)",
                }}
              >
                {d.year}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-0.5">
          {chartItems.map((item, idx) => (
            <ChartRow
              key={item.label}
              label={item.label}
              values={item.values}
              changes={item.changes}
              maxValue={maxValue}
              type={item.type}
              delay={0.5 + idx * 0.08}
            />
          ))}
        </div>
      </motion.div>

      {/* Bottom Row: Trend Chart + Expense Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Trend Chart - Right Side (2 columns) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="lg:col-span-2 bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 rounded-2xl p-4 overflow-hidden"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 rounded-full bg-gradient-to-b from-emerald-500 to-blue-500" />
              <h3 className="text-sm font-bold text-white">روند ماهانه</h3>
            </div>

            {/* Mode Buttons */}
            <div className="flex items-center gap-1 p-0.5 bg-white/5 rounded-lg">
              {trendButtons.map((btn) => (
                <button
                  key={btn.key}
                  onClick={() => setTrendMode(btn.key)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-medium transition-all ${
                    trendMode === btn.key
                      ? "bg-white/10 text-white"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                  onMouseEnter={() => setCursorVariant("button")}
                  onMouseLeave={() => setCursorVariant("default")}
                >
                  <btn.icon size={12} />
                  <span>{btn.label}</span>
                </button>
              ))}
            </div>
          </div>

          <TrendChart data={monthlyData} mode={trendMode} color={color} />
        </motion.div>

        {/* Expense Pie Chart - Left Side (1 column) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 rounded-2xl p-4 overflow-hidden"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-5 rounded-full bg-gradient-to-b from-red-500 to-orange-500" />
            <h3 className="text-sm font-bold text-white">ترکیب هزینه‌ها</h3>
          </div>

          <ExpensePieChart expenses={expenseBreakdown} color={color} />
        </motion.div>
      </div>
    </div>
  );
};

export default ProfitLossContent;

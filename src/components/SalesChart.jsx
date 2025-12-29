import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const persianMonths = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

const generateData = (companyId, dateRange) => {
  const seed = (s) => {
    return function () {
      s = Math.sin(s) * 10000;
      return s - Math.floor(s);
    };
  };

  const random = seed(companyId * 100);
  const data = [];

  // Parse start/end year and month from dateRange (e.g., "1404/01/01")
  let startYear = 1404;
  let endYear = 1404;
  let startMonthIndex = 0;
  let endMonthIndex = 11;

  if (dateRange && dateRange.from) {
    const parts = dateRange.from.split("/");
    if (parts.length === 3) {
      startYear = parseInt(parts[0], 10);
      startMonthIndex = parseInt(parts[1], 10) - 1;
    }
  }
  if (dateRange && dateRange.to) {
    const parts = dateRange.to.split("/");
    if (parts.length === 3) {
      endYear = parseInt(parts[0], 10);
      endMonthIndex = parseInt(parts[1], 10) - 1;
    }
  }

  // Ensure bounds
  startMonthIndex = Math.max(0, Math.min(11, startMonthIndex));
  endMonthIndex = Math.max(0, Math.min(11, endMonthIndex));

  // Check if multiple years are selected
  const isMultiYear = endYear > startYear;

  // Generate data points for each year-month combination
  const dataPoints = [];

  if (isMultiYear) {
    // Multiple years: iterate through each year and its months
    for (let year = startYear; year <= endYear; year++) {
      const monthStart = year === startYear ? startMonthIndex : 0;
      const monthEnd = year === endYear ? endMonthIndex : 11;

      for (let month = monthStart; month <= monthEnd; month++) {
        dataPoints.push({
          month: persianMonths[month],
          year: year,
          label: `${persianMonths[month]}`,
          yearLabel: `${year}`,
          showYear: true,
        });
      }
    }
  } else {
    // Single year: only show months
    if (endMonthIndex >= startMonthIndex) {
      for (let i = startMonthIndex; i <= endMonthIndex; i++) {
        dataPoints.push({
          month: persianMonths[i],
          year: startYear,
          label: persianMonths[i],
          yearLabel: null,
          showYear: false,
        });
      }
    } else {
      // Cross year boundary within same year (shouldn't happen normally)
      for (let i = startMonthIndex; i < 12; i++) {
        dataPoints.push({
          month: persianMonths[i],
          year: startYear,
          label: persianMonths[i],
          yearLabel: null,
          showYear: false,
        });
      }
      for (let i = 0; i <= endMonthIndex; i++) {
        dataPoints.push({
          month: persianMonths[i],
          year: startYear,
          label: persianMonths[i],
          yearLabel: null,
          showYear: false,
        });
      }
    }
  }

  // Generate points for each data point
  for (let i = 0; i < dataPoints.length; i++) {
    const point = dataPoints[i];
    // Use year in seed for different data per year
    const yearSeed = seed(companyId * 100 + point.year * 1000 + i);

    // Amount Data
    const baseSales = 1000 + Math.floor(yearSeed() * 4000);
    const sales = baseSales;
    const returns = Math.floor(sales * (0.05 + yearSeed() * 0.15));

    // Quantity Data (Count)
    const avgPrice = 0.8 + yearSeed() * 0.4;
    const salesCount = Math.floor(sales / avgPrice);
    const returnsCount = Math.floor(returns / avgPrice);

    data.push({
      name: point.label,
      year: point.year,
      yearLabel: point.yearLabel,
      showYear: point.showYear,
      sales,
      returns,
      salesCount,
      returnsCount,
      ratio: ((returns / sales) * 100).toFixed(1),
      ratioCount:
        salesCount > 0 ? ((returnsCount / salesCount) * 100).toFixed(1) : "0.0",
    });
  }
  return data;
};

const SalesChart = ({
  companyId,
  color = "59, 130, 246",
  dateRange,
  mode = "amount",
  activeMonth = null,
  onMonthClick = () => {},
  activeFilters = {},
}) => {
  const [hoveredBar, setHoveredBar] = useState(null);

  const data = useMemo(
    () => generateData(companyId, dateRange),
    [companyId, dateRange]
  );

  // Check if this month is selected
  const isMonthSelected = (d) =>
    activeMonth && activeMonth.name === d.name && activeMonth.year === d.year;

  // Determine keys and labels based on mode
  const salesKey = mode === "amount" ? "sales" : "salesCount";
  const returnsKey = mode === "amount" ? "returns" : "returnsCount";
  const ratioKey = mode === "amount" ? "ratio" : "ratioCount";
  const unit = mode === "amount" ? "م.ر" : "عدد";

  const maxVal = Math.max(...data.map((d) => d[salesKey])) * 1.15;

  // Check if we have multi-year data
  const hasMultiYear = data.some((d) => d.showYear);

  // Dimensions for SVG
  const width = 800;
  const height = hasMultiYear ? 300 : 280;
  const paddingTop = 20;
  const paddingBottom = hasMultiYear ? 50 : 40;
  const chartHeight = height - paddingTop - paddingBottom;

  // Bar calculations - adjust width based on number of data points
  const barGroupWidth = width / data.length;
  const barWidthRatio = data.length > 12 ? 0.35 : 0.3;
  const barWidth = Math.max(barGroupWidth * barWidthRatio, 8);
  const barGap = data.length > 12 ? 2 : 4;

  // Fixed colors - Green for sales, Red for returns
  const salesColor = "#22c55e"; // Green
  const returnsColor = "#ef4444"; // Red

  // Company color for ratio
  const companyColor = color.includes(",") ? `rgb(${color})` : color;

  return (
    <div
      className="w-full h-[400px] bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden group flex flex-col transition-all duration-500"
      dir="rtl"
    >
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-4 px-2 z-10 relative gap-4">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-1 h-6 rounded-full bg-green-500" />
            <span className="hidden md:inline">روند فروش و برگشتی</span>
            <span className="md:hidden">آمار فروش</span>
          </h3>
          <span className="text-xs text-gray-500 hidden lg:block">
            (برای فیلتر کلیک کنید)
          </span>
        </div>

        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-gray-400">فروش</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-gray-400">برگشتی</span>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative flex-grow w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
          {/* Defs for Gradients */}
          <defs>
            <linearGradient id="salesBarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={salesColor} stopOpacity="1" />
              <stop offset="100%" stopColor={salesColor} stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="returnsBarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={returnsColor} stopOpacity="1" />
              <stop offset="100%" stopColor={returnsColor} stopOpacity="0.6" />
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((t) => (
            <line
              key={t}
              x1="0"
              y1={paddingTop + chartHeight * (1 - t)}
              x2={width}
              y2={paddingTop + chartHeight * (1 - t)}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />
          ))}

          {/* Y Axis Labels */}
          {[0, 0.5, 1].map((t) => (
            <text
              key={t}
              x={width - 5}
              y={paddingTop + chartHeight * (1 - t)}
              fill="#666"
              fontSize="10"
              textAnchor="end"
              alignmentBaseline="middle"
              className="font-mono"
            >
              {mode === "amount"
                ? `${Math.round((maxVal * t) / 1000)}K`
                : `${Math.round(maxVal * t).toLocaleString()}`}
            </text>
          ))}

          {/* Bars */}
          {data.map((d, i) => {
            // First month on left, last month on right
            const groupX = i * barGroupWidth + barGroupWidth / 2;

            const salesHeight =
              maxVal > 0 ? (d[salesKey] / maxVal) * chartHeight : 0;
            const returnsHeight =
              maxVal > 0 ? (d[returnsKey] / maxVal) * chartHeight : 0;

            const salesX = groupX - barWidth - barGap / 2;
            const returnsX = groupX + barGap / 2;

            const isHovered = hoveredBar?.index === i;
            const isSelected = isMonthSelected(d);
            const hasOtherSelected = activeMonth && !isSelected;

            return (
              <g
                key={`${d.name}-${d.year}-${i}`}
                onMouseEnter={() => setHoveredBar({ ...d, index: i })}
                onMouseLeave={() => setHoveredBar(null)}
                onClick={() =>
                  onMonthClick({ name: d.name, year: d.year, index: i })
                }
                className="cursor-pointer"
              >
                {/* Selected Highlight Background */}
                {isSelected && (
                  <rect
                    x={groupX - barGroupWidth / 2}
                    y={paddingTop - 5}
                    width={barGroupWidth}
                    height={chartHeight + 10}
                    fill="rgba(34, 197, 94, 0.1)"
                    stroke="rgba(34, 197, 94, 0.3)"
                    strokeWidth="2"
                    rx={8}
                  />
                )}

                {/* Sales Bar */}
                <motion.rect
                  initial={{ height: 0, y: paddingTop + chartHeight }}
                  animate={{
                    height: salesHeight,
                    y: paddingTop + chartHeight - salesHeight,
                  }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  x={salesX}
                  width={barWidth}
                  rx={4}
                  fill="url(#salesBarGradient)"
                  className="transition-opacity duration-200"
                  style={{
                    opacity: hasOtherSelected ? 0.3 : isHovered || isSelected ? 1 : 0.8,
                  }}
                />

                {/* Returns Bar */}
                <motion.rect
                  initial={{ height: 0, y: paddingTop + chartHeight }}
                  animate={{
                    height: returnsHeight,
                    y: paddingTop + chartHeight - returnsHeight,
                  }}
                  transition={{ duration: 0.6, delay: i * 0.05 + 0.1 }}
                  x={returnsX}
                  width={barWidth}
                  rx={4}
                  fill="url(#returnsBarGradient)"
                  className="transition-opacity duration-200"
                  style={{
                    opacity: hasOtherSelected ? 0.3 : isHovered || isSelected ? 1 : 0.8,
                  }}
                />

                {/* Hover Highlight */}
                {isHovered && !isSelected && (
                  <rect
                    x={groupX - barGroupWidth / 2}
                    y={paddingTop}
                    width={barGroupWidth}
                    height={chartHeight}
                    fill="rgba(255,255,255,0.03)"
                    rx={8}
                  />
                )}

                {/* Month Label */}
                <text
                  x={groupX}
                  y={d.showYear ? height - 18 : height - 10}
                  fill={isSelected ? "#22c55e" : isHovered ? "#fff" : hasOtherSelected ? "#555" : "#888"}
                  fontSize={d.showYear ? "9" : "11"}
                  fontWeight={isSelected ? "bold" : "normal"}
                  textAnchor="middle"
                  className="transition-colors duration-200"
                >
                  {d.name}
                </text>
                {/* Year Label (only when multiple years) */}
                {d.showYear && (
                  <text
                    x={groupX}
                    y={height - 6}
                    fill={isSelected ? "#22c55e" : isHovered ? "#aaa" : hasOtherSelected ? "#333" : "#555"}
                    fontSize="8"
                    textAnchor="middle"
                    className="transition-colors duration-200"
                  >
                    {d.yearLabel}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Custom Tooltip */}
        <AnimatePresence>
          {hoveredBar && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-4 right-4 bg-[#111]/95 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl z-20 pointer-events-none min-w-[200px]"
            >
              <p className="text-white font-bold mb-2 border-b border-white/10 pb-2 text-right">
                {hoveredBar.showYear
                  ? `${hoveredBar.name} ${hoveredBar.year}`
                  : hoveredBar.name}
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-green-400 font-mono font-bold">
                    {hoveredBar[salesKey].toLocaleString()}{" "}
                    <span className="text-xs text-gray-500">{unit}</span>
                  </span>
                  <span className="text-gray-400 text-sm">فروش:</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-red-400 font-mono font-bold">
                    {hoveredBar[returnsKey].toLocaleString()}{" "}
                    <span className="text-xs text-gray-500">{unit}</span>
                  </span>
                  <span className="text-gray-400 text-sm">برگشتی:</span>
                </div>
                <div className="flex items-center justify-between gap-4 pt-2 border-t border-white/5">
                  <span
                    className="font-mono font-bold"
                    style={{ color: companyColor }}
                  >
                    {hoveredBar[ratioKey]}%
                  </span>
                  <span className="text-gray-400 text-sm">نسبت:</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SalesChart;

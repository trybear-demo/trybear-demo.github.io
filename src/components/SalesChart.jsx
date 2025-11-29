import React, { useMemo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, Hash } from "lucide-react";

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

  // Parse start/end month from dateRange (e.g., "1404/01/01")
  let startMonthIndex = 0;
  let endMonthIndex = 11;

  if (dateRange && dateRange.from) {
      const parts = dateRange.from.split('/');
      if (parts.length === 3) startMonthIndex = parseInt(parts[1], 10) - 1;
  }
  if (dateRange && dateRange.to) {
      const parts = dateRange.to.split('/');
      if (parts.length === 3) endMonthIndex = parseInt(parts[1], 10) - 1;
  }

  // Ensure bounds
  startMonthIndex = Math.max(0, Math.min(11, startMonthIndex));
  endMonthIndex = Math.max(0, Math.min(11, endMonthIndex));
  
  const activeMonths = [];
  if (endMonthIndex >= startMonthIndex) {
      for(let i = startMonthIndex; i <= endMonthIndex; i++) activeMonths.push(persianMonths[i]);
  } else {
      // Cross year boundary
      for(let i = startMonthIndex; i < 12; i++) activeMonths.push(persianMonths[i]);
      for(let i = 0; i <= endMonthIndex; i++) activeMonths.push(persianMonths[i]);
  }

  // Generate points for each active month
  for (let i = 0; i < activeMonths.length; i++) {
    // Amount Data
    const baseSales = 1000 + Math.floor(random() * 4000);
    const sales = baseSales;
    const returns = Math.floor(sales * (0.05 + random() * 0.15)); // Increased returns range slightly
    
    // Quantity Data (Count) - Correlated but with variance
    // Assuming varying average price per month
    const avgPrice = 0.8 + random() * 0.4; // e.g., 0.8 to 1.2 million rials per item (just mock)
    const salesCount = Math.floor(sales / avgPrice); 
    const returnsCount = Math.floor(returns / avgPrice);

    data.push({
      name: activeMonths[i],
      sales,
      returns,
      salesCount,
      returnsCount,
      ratio: ((returns / sales) * 100).toFixed(1),
      ratioCount: salesCount > 0 ? ((returnsCount / salesCount) * 100).toFixed(1) : "0.0",
    });
  }
  return data;
};

// Helper to create smooth bezier curves
const getPath = (data, key, width, height, maxVal, isRTL = false) => {
  if (data.length === 0) return { path: "", points: [] };

  const points = data.map((d, i) => {
    // Logic for RTL: 0 index is on the Right (width), last index is on Left (0)
    const xRatio = i / (data.length - 1 || 1);
    const x = isRTL ? width - (xRatio * width) : xRatio * width;
    
    // Use safe division to avoid NaN if maxVal is 0
    const normalizedVal = maxVal > 0 ? d[key] / maxVal : 0;
    const y = height - normalizedVal * height * 0.8 - height * 0.1; // Padding
    return [x, y];
  });

  // Simple Line for now to ensure robustness, or simple curve
  let path = `M ${points[0][0]},${points[0][1]}`;
  
  // Cubic Bezier for smoothness
  for (let i = 0; i < points.length - 1; i++) {
      const [x0, y0] = points[i];
      const [x1, y1] = points[i + 1];
      const mx = (x0 + x1) / 2;
      // Control points
      path += ` C ${mx},${y0} ${mx},${y1} ${x1},${y1}`;
  }

  return { path, points };
};

const SalesChart = ({ companyId, color = "59, 130, 246", dateRange, mode = 'amount' }) => {
  // Removed internal mode state, now receiving via props
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const containerRef = useRef(null);

  const data = useMemo(() => generateData(companyId, dateRange), [companyId, dateRange]);
  
  // Determine keys and labels based on mode
  const salesKey = mode === 'amount' ? 'sales' : 'salesCount';
  const returnsKey = mode === 'amount' ? 'returns' : 'returnsCount';
  const ratioKey = mode === 'amount' ? 'ratio' : 'ratioCount';
  const unit = mode === 'amount' ? 'م.ر' : 'عدد';

  const maxVal = Math.max(...data.map((d) => d[salesKey])) * 1.2;

  // Dimensions (assumed relative for SVG viewBox)
  const width = 800;
  const height = 300;

  // RTL is true to flip axis
  const salesPathData = useMemo(() => getPath(data, salesKey, width, height, maxVal, true), [data, maxVal, salesKey]);
  const returnsPathData = useMemo(() => getPath(data, returnsKey, width, height, maxVal, true), [data, maxVal, returnsKey]);

  // Colors - Handle inputs like "255, 100, 0" or "#ff0000"
  const getMainColor = (c) => {
      if(c.includes(',')) return `rgb(${c})`;
      return c;
  }
  const mainColor = getMainColor(color);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    // Find closest point
    // For RTL mapping: x goes from 0 (Left) to Width (Right).
    // The points[0] is at Right (Width).
    // We want index closest to this X.
    // Just scan points array for closest X
    let closestIndex = 0;
    let minDiff = Infinity;
    
    salesPathData.points.forEach((p, i) => {
        const diff = Math.abs(p[0] - x);
        if(diff < minDiff) {
            minDiff = diff;
            closestIndex = i;
        }
    });
    
    if (minDiff < 50) { // Snap threshold
        setHoveredPoint({ ...data[closestIndex], index: closestIndex });
    }
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  return (
    <div 
        className="w-full h-[400px] bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden group flex flex-col transition-all duration-500"
        dir="rtl"
    >
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-4 px-2 z-10 relative gap-4">
        <div className="flex items-center gap-4">
             <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="w-1 h-6 rounded-full transition-colors duration-500" style={{ backgroundColor: mainColor }} />
                <span className="hidden md:inline">آمار فروش و برگشتی</span>
                <span className="md:hidden">آمار فروش</span>
            </h3>
        </div>

        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full transition-colors duration-500" style={{ backgroundColor: mainColor }} />
            <span className="text-gray-400">فروش ({mode === 'amount' ? 'مبلغی' : 'تعدادی'})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-gray-400">برگشتی</span>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div 
        ref={containerRef}
        className="relative flex-grow w-full cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            {/* Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((t) => (
                <line 
                    key={t}
                    x1="0" 
                    y1={height * t} 
                    x2={width} 
                    y2={height * t} 
                    stroke="rgba(255,255,255,0.05)" 
                    strokeWidth="1" 
                />
            ))}
            
            {/* Y Axis Labels */}
             {[0, 0.5, 1].map((t) => (
                <text 
                    key={t}
                    x={width + 10}
                    y={height * (1-t) || 10}
                    fill="#666"
                    fontSize="10"
                    textAnchor="start"
                    alignmentBaseline="middle"
                    className="font-mono"
                >
                    {/* Conditional formatting for labels */}
                    {mode === 'amount' 
                        ? `${Math.round((maxVal * t) / 1000)}K` 
                        : `${Math.round(maxVal * t).toLocaleString()}`
                    }
                </text>
            ))}

            {/* Defs for Gradients */}
            <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={mainColor} stopOpacity="0.4" />
                    <stop offset="100%" stopColor={mainColor} stopOpacity="0" />
                </linearGradient>
                <linearGradient id="returnsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </linearGradient>
            </defs>

            {/* Areas */}
            <motion.path
                key={`area-sales-${mode}`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                d={`${salesPathData.path} L ${salesPathData.points[salesPathData.points.length-1]?.[0] || 0},${height} L ${salesPathData.points[0]?.[0] || width},${height} Z`}
                fill="url(#salesGradient)"
                stroke="none"
            />
             <motion.path
                key={`area-returns-${mode}`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                d={`${returnsPathData.path} L ${returnsPathData.points[returnsPathData.points.length-1]?.[0] || 0},${height} L ${returnsPathData.points[0]?.[0] || width},${height} Z`}
                fill="url(#returnsGradient)"
                stroke="none"
            />

            {/* Lines */}
            <motion.path
                key={`line-sales-${mode}`}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                d={salesPathData.path}
                fill="none"
                stroke={mainColor}
                strokeWidth="3"
                strokeLinecap="round"
            />
            <motion.path
                key={`line-returns-${mode}`}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                d={returnsPathData.path}
                fill="none"
                stroke="#ef4444"
                strokeWidth="3"
                strokeLinecap="round"
            />

            {/* Hover Line & Dot */}
            <AnimatePresence>
                {hoveredPoint && (
                    <g>
                        <motion.line
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            x1={salesPathData.points[hoveredPoint.index][0]}
                            y1={0}
                            x2={salesPathData.points[hoveredPoint.index][0]}
                            y2={height}
                            stroke="rgba(255,255,255,0.2)"
                            strokeWidth="1"
                            strokeDasharray="4 4"
                        />
                        <motion.circle
                             initial={{ r: 0 }}
                             animate={{ r: 6 }}
                             exit={{ r: 0 }}
                             cx={salesPathData.points[hoveredPoint.index][0]}
                             cy={salesPathData.points[hoveredPoint.index][1]}
                             fill={mainColor}
                             stroke="white"
                             strokeWidth="2"
                        />
                         <motion.circle
                             initial={{ r: 0 }}
                             animate={{ r: 6 }}
                             exit={{ r: 0 }}
                             cx={returnsPathData.points[hoveredPoint.index][0]}
                             cy={returnsPathData.points[hoveredPoint.index][1]}
                             fill="#ef4444"
                             stroke="white"
                             strokeWidth="2"
                        />
                    </g>
                )}
            </AnimatePresence>
        </svg>
        
        {/* Custom Tooltip (Absolute positioned div) */}
        <AnimatePresence>
            {hoveredPoint && (
                <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    style={{
                        left: salesPathData.points[hoveredPoint.index][0] < width/2 ? 'auto' : '1rem',
                        right: salesPathData.points[hoveredPoint.index][0] < width/2 ? '1rem' : 'auto',
                    }}
                    className="absolute top-4 bg-[#111]/90 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl z-20 pointer-events-none min-w-[200px]"
                >
                    <p className="text-white font-bold mb-2 border-b border-white/10 pb-2 text-right">{hoveredPoint.name}</p>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between gap-4">
                            <span className="font-mono font-bold" style={{ color: mainColor }}>
                            {hoveredPoint[salesKey].toLocaleString()} <span className="text-xs text-gray-500">{unit}</span>
                            </span>
                            <span className="text-gray-400 text-sm">فروش:</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-red-400 font-mono font-bold">
                            {hoveredPoint[returnsKey].toLocaleString()} <span className="text-xs text-gray-500">{unit}</span>
                            </span>
                            <span className="text-gray-400 text-sm">برگشتی:</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 pt-2 border-t border-white/5">
                            <span className="text-yellow-400 font-mono font-bold">
                            {hoveredPoint[ratioKey]}%
                            </span>
                            <span className="text-gray-400 text-sm">نسبت:</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Month Labels at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-2 pointer-events-none flex-row">
            {data.map((d, i) => (
                <div key={d.name} className="flex-1 text-center">
                    <span className="opacity-50">{d.name}</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SalesChart;

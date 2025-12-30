import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Format large numbers
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + " میلیارد";
  }
  if (num >= 1000) {
    return Math.floor(num / 1000).toLocaleString() + " میلیون";
  }
  return Math.floor(num).toLocaleString();
};

// Generate gradient colors from a base color
const generateGradientColors = (baseHue, count) => {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const saturation = 70 - (i * 8);
    const lightness = 50 + (i * 5);
    colors.push(`hsl(${baseHue}, ${saturation}%, ${lightness}%)`);
  }
  return colors;
};

const DonutChart = ({ title, data, baseHue, glowColor }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  const radius = 80;
  const strokeWidth = 22;
  const viewBoxSize = 220;
  const center = viewBoxSize / 2;
  const circumference = 2 * Math.PI * radius;

  // Generate gradient colors based on value (highest gets darkest)
  const colors = useMemo(() => generateGradientColors(baseHue, data.length), [baseHue, data.length]);

  // Calculate total value
  const total = useMemo(() => data.reduce((sum, item) => sum + item.value, 0), [data]);

  // Pre-calculate segments
  const segments = useMemo(() => {
    let accumulatedAngle = -90;
    return data.map((item, index) => {
      const percentage = (item.value / total) * 100;
      const angle = (percentage / 100) * 360;
      const startAngle = accumulatedAngle;
      accumulatedAngle += angle;

      return {
        ...item,
        index,
        percentage: percentage.toFixed(1),
        startAngle,
        strokeDasharray: `${(percentage / 100) * circumference} ${circumference}`,
        color: colors[index],
      };
    });
  }, [data, total, circumference, colors]);

  const hoveredItem = hoveredIndex !== null ? segments[hoveredIndex] : null;

  return (
    <div 
      className="flex flex-col items-center justify-center bg-[#060010] border border-white/10 rounded-3xl p-6 relative overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 h-[340px]"
      style={{
        boxShadow: hoveredIndex !== null ? `0 0 40px rgba(${glowColor}, 0.2)` : 'none'
      }}
    >
      <h3 className="text-base font-bold text-white mb-4 z-10 relative">{title}</h3>
      
      <div className="relative w-[200px] h-[200px] z-10">
        <svg width={viewBoxSize} height={viewBoxSize} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} className="w-full h-full">
          {/* Background Circle Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth={strokeWidth}
          />

          {segments.map((item) => (
            <motion.circle
              key={item.index}
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke={item.color}
              strokeWidth={strokeWidth}
              strokeDasharray={item.strokeDasharray}
              strokeDashoffset={0}
              strokeLinecap="butt"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                  pathLength: 1, 
                  opacity: hoveredIndex !== null && hoveredIndex !== item.index ? 0.3 : 1,
                  strokeWidth: hoveredIndex === item.index ? strokeWidth + 6 : strokeWidth
              }}
              transition={{ duration: 0.8, delay: item.index * 0.08, ease: "easeOut" }}
              style={{
                transformOrigin: "center",
                transform: `rotate(${item.startAngle}deg)`,
              }}
              onMouseEnter={() => setHoveredIndex(item.index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="cursor-pointer transition-all duration-300"
            />
          ))}
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4">
            <AnimatePresence mode="wait">
                <motion.div
                    key={hoveredIndex !== null ? hoveredIndex : "total"}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="text-center flex flex-col items-center"
                >
                    {hoveredItem ? (
                      <>
                        <span className="text-xs text-gray-400 mb-1 line-clamp-2 text-center max-w-[120px]">
                          {hoveredItem.label}
                        </span>
                        <span className="text-2xl font-bold text-white drop-shadow-lg">
                          {hoveredItem.percentage}%
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          {formatNumber(hoveredItem.value)} ریال
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-xs text-gray-400 mb-1">مجموع</span>
                        <span className="text-xl font-bold text-white drop-shadow-lg">
                          100%
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          {formatNumber(total)} ریال
                        </span>
                      </>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
      </div>

      {/* Ambient Background Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] rounded-full opacity-15 blur-3xl pointer-events-none -z-0 transition-all duration-500"
        style={{
            background: hoveredItem ? hoveredItem.color : `rgba(${glowColor}, 0.3)`
        }}
      />
    </div>
  );
};

const FinancialCompositionCharts = ({ assetsData, equityData, liabilitiesData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full" dir="rtl">
      {/* Right: Assets - Green gradient */}
      <DonutChart 
        title="ترکیب دارایی‌ها" 
        data={assetsData} 
        baseHue={142} // Green
        glowColor="34, 197, 94"
      />
      
      {/* Center: Equity - Blue gradient */}
      <DonutChart 
        title="ترکیب حقوق صاحبان سهام" 
        data={equityData} 
        baseHue={217} // Blue
        glowColor="59, 130, 246"
      />
      
      {/* Left: Liabilities - Red gradient */}
      <DonutChart 
        title="ترکیب بدهی‌ها" 
        data={liabilitiesData} 
        baseHue={0} // Red
        glowColor="239, 68, 68"
      />
    </div>
  );
};

export default FinancialCompositionCharts;

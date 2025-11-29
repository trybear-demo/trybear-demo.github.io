import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DonutChart = ({ title, data, color }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  const radius = 80;
  const strokeWidth = 20;
  const viewBoxSize = 220;
  const center = viewBoxSize / 2;
  const circumference = 2 * Math.PI * radius;

  // Pre-calculate segments to avoid render-loop side effects
  const segments = useMemo(() => {
    let accumulatedAngle = -90; // Start from top
    return data.map((item, index) => {
      const percentage = item.value;
      const angle = (percentage / 100) * 360;
      const startAngle = accumulatedAngle;
      accumulatedAngle += angle;

      return {
        ...item,
        index,
        percentage,
        startAngle,
        strokeDasharray: `${(percentage / 100) * circumference} ${circumference}`,
      };
    });
  }, [data, circumference]);

  return (
    <div className="flex flex-col items-center justify-center bg-[#060010] border border-white/10 rounded-3xl p-6 relative overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 h-[400px]">
      <h3 className="text-lg font-bold text-white mb-6 z-10 relative">{title}</h3>
      
      <div className="relative w-[220px] h-[220px] z-10">
        <svg width={viewBoxSize} height={viewBoxSize} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}>
          {/* Background Circle Track (Optional, for visual guide) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="rgba(255,255,255,0.05)"
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
              strokeLinecap="round" // Rounded ends for nicer look, but might overlap
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                  pathLength: 1, 
                  opacity: hoveredIndex !== null && hoveredIndex !== item.index ? 0.3 : 1,
                  strokeWidth: hoveredIndex === item.index ? strokeWidth + 4 : strokeWidth
              }}
              transition={{ duration: 0.8, delay: item.index * 0.1, ease: "easeOut" }}
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
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <AnimatePresence mode="wait">
                <motion.div
                    key={hoveredIndex !== null ? hoveredIndex : "total"}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="text-center flex flex-col items-center"
                >
                    <span className="text-3xl font-bold text-white drop-shadow-lg">
                        {hoveredIndex !== null ? `${segments[hoveredIndex].value}%` : "100%"}
                    </span>
                    <span className="text-xs text-gray-400 mt-1 px-2 line-clamp-1 max-w-[140px]">
                        {hoveredIndex !== null ? segments[hoveredIndex].label : "مجموع"}
                    </span>
                </motion.div>
            </AnimatePresence>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 w-full space-y-3 relative z-10">
        {data.map((item, index) => (
            <div 
                key={index} 
                className={`flex items-center justify-between text-sm transition-opacity duration-300 ${
                    hoveredIndex !== null && hoveredIndex !== index ? "opacity-30" : "opacity-100"
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
            >
                <div className="flex items-center gap-3">
                    <div 
                        className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]" 
                        style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}` }} 
                    />
                    <span className="text-gray-300 font-medium">{item.label}</span>
                </div>
                <span className="font-mono text-white font-bold">{item.value}%</span>
            </div>
        ))}
      </div>

      {/* Ambient Background Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full opacity-20 blur-3xl pointer-events-none -z-0"
        style={{
            background: hoveredIndex !== null ? segments[hoveredIndex].color : 'rgba(255,255,255,0.05)'
        }}
      />
    </div>
  );
};

const FinancialCompositionCharts = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full" dir="rtl">
      <DonutChart title="ترکیب دارایی‌ها" data={data.assets} />
      <DonutChart title="ترکیب بدهی‌ها" data={data.liabilities} />
      <DonutChart title="ترکیب حقوق صاحبان سهام" data={data.equity} />
    </div>
  );
};

export default FinancialCompositionCharts;

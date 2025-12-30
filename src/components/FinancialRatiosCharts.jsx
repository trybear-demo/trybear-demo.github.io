import React, { useState } from "react";
import { motion } from "framer-motion";

const RatioBarChart = ({ title, data, color, years, unit = "" }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const maxVal = Math.max(...data) * 1.3 || 1;

  // Convert RGB string to components for opacity variations
  const rgbMatch = color.match(/\d+/g);
  const r = rgbMatch ? rgbMatch[0] : 100;
  const g = rgbMatch ? rgbMatch[1] : 100;
  const b = rgbMatch ? rgbMatch[2] : 200;

  return (
    <div className="bg-[#060010] border border-white/10 rounded-3xl p-5 flex flex-col h-[280px] relative group hover:-translate-y-1 hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Title */}
      <h4 className="text-sm font-bold text-white mb-4 text-right">{title}</h4>
      
      {/* Chart Container */}
      <div className="flex-grow flex items-end justify-around gap-3 relative z-10 px-2">
        {data.map((val, i) => {
           const heightPercent = Math.max((val / maxVal) * 100, 5);
           const isHovered = hoveredIndex === i;
           
           return (
             <div 
               key={i} 
               className="flex flex-col items-center gap-2 flex-1 h-full justify-end relative"
               onMouseEnter={() => setHoveredIndex(i)}
               onMouseLeave={() => setHoveredIndex(null)}
             >
               {/* Tooltip */}
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ 
                   opacity: isHovered ? 1 : 0, 
                   y: isHovered ? 0 : 10 
                 }}
                 className="absolute -top-10 bg-black/90 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap pointer-events-none shadow-xl z-20"
               >
                  {val.toFixed(2)}{unit}
               </motion.div>

               {/* Bar */}
               <motion.div
                 initial={{ height: 0 }}
                 whileInView={{ height: `${heightPercent}%` }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.8, delay: i * 0.15, type: "spring", stiffness: 100 }}
                 className="w-full max-w-[50px] rounded-t-xl relative overflow-hidden cursor-pointer"
                 style={{ 
                   backgroundColor: `rgba(${r}, ${g}, ${b}, ${isHovered ? 0.8 : 0.25})`,
                   boxShadow: isHovered ? `0 0 20px rgba(${r}, ${g}, ${b}, 0.4)` : 'none',
                   transition: 'background-color 0.3s, box-shadow 0.3s'
                 }}
               >
                  {/* Gradient overlay */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10" 
                  />
                  
                  {/* Bottom accent line */}
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-1 rounded-b"
                    style={{ backgroundColor: `rgb(${r}, ${g}, ${b})` }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isHovered ? 1 : 0.5 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Full color overlay on hover */}
                  <motion.div 
                    className="absolute inset-0 rounded-t-xl"
                    style={{ backgroundColor: `rgb(${r}, ${g}, ${b})` }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 0.6 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Value inside bar */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span 
                      className="text-[10px] font-bold text-white drop-shadow-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isHovered ? 1 : 0.7 }}
                    >
                      {val.toFixed(1)}
                    </motion.span>
                  </div>
               </motion.div>
               
               {/* Year Label */}
               <span 
                 className="text-xs font-mono transition-colors duration-300"
                 style={{ 
                   color: isHovered ? `rgb(${r}, ${g}, ${b})` : '#6b7280'
                 }}
               >
                 {years[i]}
               </span>
             </div>
           )
        })}
      </div>
      
      {/* Background Grid Lines */}
      <div className="absolute inset-0 p-5 pointer-events-none">
        <div className="w-full h-full flex flex-col justify-between pt-8 pb-8">
            <div className="w-full h-px bg-white/5" />
            <div className="w-full h-px bg-white/5" />
            <div className="w-full h-px bg-white/5" />
            <div className="w-full h-px bg-white/5" />
        </div>
      </div>
      
      {/* Glow effect on hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
        style={{
          background: `radial-gradient(circle at 50% 100%, rgba(${r}, ${g}, ${b}, 0.1), transparent 60%)`
        }}
      />
    </div>
  );
};

const FinancialRatiosCharts = ({ data, years, color }) => {
  // Define colors for each ratio chart
  const chartConfigs = [
    { key: "debtToAsset", title: "نسبت بدهی به دارایی", color: "239, 68, 68", unit: "" },      // Red
    { key: "currentRatio", title: "نسبت جاری", color: "34, 197, 94", unit: "" },               // Green
    { key: "quickRatio", title: "نسبت آنی", color: "245, 158, 11", unit: "" },                 // Amber
    { key: "equityRatio", title: "نسبت حقوق صاحبان سهام", color: "59, 130, 246", unit: "" },   // Blue
    { key: "workingCapital", title: "سرمایه در گردش", color: "236, 72, 153", unit: " م.ر" },   // Pink
    { key: "proprietaryRatio", title: "نسبت مالکانه", color: "6, 182, 212", unit: "" },        // Cyan
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full" dir="rtl">
      {chartConfigs.map((config) => (
        <RatioBarChart 
          key={config.key}
          title={config.title} 
          data={data[config.key]} 
          color={config.color} 
          years={years}
          unit={config.unit}
        />
      ))}
    </div>
  );
};

export default FinancialRatiosCharts;

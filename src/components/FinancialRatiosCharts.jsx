import React, { useState } from "react";
import { motion } from "framer-motion";

const BarChart = ({ title, data, color, years }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const maxVal = Math.max(...data) * 1.2 || 1;

  return (
    <div className="bg-[#060010] border border-white/10 rounded-3xl p-6 flex flex-col h-[250px] relative group hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
      <h4 className="text-sm font-bold text-gray-400 mb-4">{title}</h4>
      
      <div className="flex-grow flex items-end justify-around gap-2 relative z-10">
        {data.map((val, i) => {
           const heightPercent = (val / maxVal) * 100;
           return (
             <div key={i} className="flex flex-col items-center gap-2 flex-1 h-full justify-end group/bar">
               {/* Tooltip */}
               <div className={`absolute -top-8 bg-white text-black text-xs font-bold px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none mb-1`}>
                  {val}
               </div>

               <motion.div
                 initial={{ height: 0 }}
                 whileInView={{ height: `${heightPercent}%` }}
                 transition={{ duration: 0.8, delay: i * 0.1, type: "spring" }}
                 className="w-full max-w-[40px] rounded-t-lg relative overflow-hidden"
                 style={{ backgroundColor: `${color}40` }} // low opacity base
                 onMouseEnter={() => setHoveredIndex(i)}
                 onMouseLeave={() => setHoveredIndex(null)}
               >
                  {/* Filled part */}
                  <div className="absolute bottom-0 left-0 right-0 top-0 bg-gradient-to-t from-transparent to-white/20" />
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-1" 
                    style={{ backgroundColor: color }}
                  />
                  <div 
                     className={`absolute inset-0 transition-opacity duration-300 ${hoveredIndex === i ? 'opacity-100' : 'opacity-0'}`}
                     style={{ backgroundColor: color }}
                  />
               </motion.div>
               
               <span className="text-xs text-gray-500 font-mono">{years[i]}</span>
             </div>
           )
        })}
      </div>
      
      {/* Background Grid */}
      <div className="absolute inset-0 p-6 pointer-events-none">
        <div className="w-full h-full border-b border-white/5 flex flex-col justify-between">
            <div className="w-full h-px bg-white/5" />
            <div className="w-full h-px bg-white/5" />
            <div className="w-full h-px bg-white/5" />
        </div>
      </div>
    </div>
  );
};

const FinancialRatiosCharts = ({ data, years, color }) => {
  // Helper to get color based on index for variety
  const colors = [
    "#3b82f6", // Blue
    "#10b981", // Green
    "#f59e0b", // Amber
    "#8b5cf6", // Purple
    "#ec4899", // Pink
    "#06b6d4", // Cyan
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full" dir="rtl">
      <BarChart title="نسبت بدهی به دارایی" data={data.debtToAsset} color={colors[0]} years={years} />
      <BarChart title="نسبت جاری" data={data.currentRatio} color={colors[1]} years={years} />
      <BarChart title="نسبت آنی" data={data.quickRatio} color={colors[2]} years={years} />
      <BarChart title="نسبت حقوق صاحبان" data={data.equityRatio} color={colors[3]} years={years} />
      <BarChart title="سرمایه در گردش (میلیون ریال)" data={data.workingCapital} color={colors[4]} years={years} />
      <BarChart title="نسبت مالکانه" data={data.proprietaryRatio} color={colors[5]} years={years} />
    </div>
  );
};

export default FinancialRatiosCharts;


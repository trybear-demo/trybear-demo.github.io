import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, User, Briefcase } from "lucide-react";

const RankingChart = ({
  title,
  data = [],
  color = "59, 130, 246", // RGB string
  icon: Icon = Trophy,
  unit = "میلیون ریال",
  activeItem = null,
  onItemClick = () => {},
  activeFilters = {},
  filterType = "seller", // "seller" or "customer"
}) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const maxVal = Math.max(...data.map((d) => d.netValue || d.value || 0));

  // Check if this item is selected
  const isItemSelected = (item) => activeItem && activeItem.id === item.id;

  return (
    <div
      className="w-full h-[400px] bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden flex flex-col"
      dir="rtl"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6 z-10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span
              className="w-1 h-6 rounded-full"
              style={{ backgroundColor: `rgb(${color})` }}
            />
            {title}
          </h3>
          <span className="text-xs text-gray-500 hidden lg:block">
            (کلیک = فیلتر)
          </span>
        </div>
        <div className="p-2 bg-white/5 rounded-xl">
          <Icon size={20} className="text-gray-400" />
        </div>
      </div>

      {/* Scrollable List */}
      <div className="flex-grow overflow-y-auto pl-4 pr-1 custom-scrollbar space-y-3">
        {data.map((item, index) => {
          const displayValue = item.netValue ?? item.value ?? 0;
          const percent = maxVal > 0 ? (displayValue / maxVal) * 100 : 0;
          const isHovered = hoveredItem?.id === item.id;
          const isSelected = isItemSelected(item);
          const hasOtherSelected = activeItem && !isSelected;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className={`group relative border rounded-xl p-3 flex items-center gap-4 transition-all cursor-pointer
                ${isSelected 
                  ? `bg-white/15 border-2 ${filterType === 'seller' ? 'border-purple-500/50' : 'border-orange-500/50'}` 
                  : hasOtherSelected 
                    ? 'bg-white/2 border-white/5 opacity-40' 
                    : 'bg-white/5 hover:bg-white/10 border-white/5'
                }`}
              onMouseEnter={() => setHoveredItem(item)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => onItemClick({ id: item.id, name: item.name })}
            >
              {/* Rank Badge */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0
                  ${
                    index === 0
                      ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50"
                      : index === 1
                      ? "bg-gray-400/20 text-gray-300 border border-gray-400/50"
                      : index === 2
                      ? "bg-orange-700/20 text-orange-400 border border-orange-700/50"
                      : "bg-white/5 text-gray-500"
                  }
                `}
              >
                {index + 1}
              </div>

              {/* Info */}
              <div className="flex-grow z-10 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-gray-200 truncate pl-2">
                    {item.name}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono font-bold text-white text-sm">
                      {displayValue.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500">{unit}</span>
                  </div>
                </div>

                {/* Bar Background */}
                <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percent}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="h-full rounded-full relative"
                    style={{
                      backgroundColor: `rgb(${color})`,
                      opacity: 0.8,
                    }}
                  >
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]" />
                  </motion.div>
                </div>
              </div>

              {/* Hover Tooltip */}
              <AnimatePresence>
                {isHovered && item.sales !== undefined && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 bg-[#111]/95 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-2xl z-50 min-w-[180px]"
                  >
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-green-400 font-mono font-bold">
                          {item.sales.toLocaleString()}
                        </span>
                        <span className="text-gray-400">فروش:</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-red-400 font-mono font-bold">
                          {item.returns.toLocaleString()}
                        </span>
                        <span className="text-gray-400">برگشتی:</span>
                      </div>
                      <div className="flex items-center justify-between gap-4 pt-2 border-t border-white/10">
                        <span className="text-blue-400 font-mono font-bold">
                          {item.percent}%
                        </span>
                        <span className="text-gray-400">سهم از کل:</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Fade out bottom for scroll hint */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#000000] to-transparent pointer-events-none rounded-b-3xl" />
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
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

export default RankingChart;

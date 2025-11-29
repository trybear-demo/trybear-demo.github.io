import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Trophy, User, Briefcase } from "lucide-react";

const RankingChart = ({
  title,
  data = [],
  color = "59, 130, 246", // RGB string
  icon: Icon = Trophy,
  unit = "میلیون ریال",
}) => {
  const maxVal = Math.max(...data.map((d) => d.value));

  return (
    <div
      className="w-full h-[400px] bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden flex flex-col"
      dir="rtl"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6 z-10 flex-shrink-0">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span
            className="w-1 h-6 rounded-full"
            style={{ backgroundColor: `rgb(${color})` }}
          />
          {title}
        </h3>
        <div className="p-2 bg-white/5 rounded-xl">
          <Icon size={20} className="text-gray-400" />
        </div>
      </div>

      {/* Scrollable List */}
      <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-3">
        {data.map((item, index) => {
          const percent = (item.value / maxVal) * 100;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group relative bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-3 flex items-center gap-4 transition-all"
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
                      {item.value.toLocaleString()}
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
            </motion.div>
          );
        })}
      </div>

      {/* Fade out bottom for scroll hint */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#000000] to-transparent pointer-events-none rounded-b-3xl" />
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
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

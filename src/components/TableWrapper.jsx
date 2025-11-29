import React, { useRef, useEffect } from "react";
import { Download, Filter } from "lucide-react";
import { motion } from "framer-motion";

const TableWrapper = ({ title, icon: Icon, columns, data, color = "255, 255, 255", autoHeight = false, className = "" }) => {
  const cardRef = useRef(null);

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

  return (
    <div
      ref={cardRef}
      className={`w-full bg-[#060010] border border-white/10 rounded-3xl p-6 relative overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group/card ${autoHeight ? 'h-auto min-h-[300px]' : 'h-[600px]'} ${className}`}
      style={{
        "--glow-color": color,
      }}
    >
      {/* Border Glow Effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(${color}, 0.15), transparent 40%)`,
          zIndex: 0,
        }}
      />
      
      {/* Border Highlight */}
      <div 
        className="absolute inset-0 rounded-3xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
            background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(${color}, 0.3), transparent 40%)`,
            maskImage: "linear-gradient(black, black), linear-gradient(black, black)",
            maskClip: "content-box, border-box",
            maskComposite: "exclude",
            WebkitMaskImage: "linear-gradient(black, black), linear-gradient(black, black)",
            WebkitMaskClip: "content-box, border-box",
            WebkitMaskComposite: "xor",
            padding: "1px",
            zIndex: 1,
        }}
      />

      {/* Content Container - Z-Index to be above glow */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <Icon size={20} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            </div>
            <div className="flex gap-2">
            <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 transition-colors">
                <Filter size={18} />
            </button>
            <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 transition-colors">
                <Download size={18} />
            </button>
            </div>
        </div>

        {/* Table Content */}
        <div className="flex-grow overflow-auto custom-scrollbar">
            <table className="w-full text-right border-collapse">
            <thead className="sticky top-0 bg-[#060010] z-10">
                <tr>
                {columns.map((col, i) => (
                    <th
                    key={i}
                    className="pb-4 pt-2 px-4 text-gray-500 font-medium text-sm border-b border-white/10 whitespace-nowrap"
                    >
                    {col}
                    </th>
                ))}
                </tr>
            </thead>
            <tbody className="text-sm text-gray-300">
                {data.map((row, idx) => (
                <motion.tr
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className={`group hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 ${
                    row.isTotal ? "font-bold text-white bg-white/5" : ""
                    }`}
                >
                    {columns.map((col, cIdx) => {
                    let cellValue;
                    if (cIdx === 0) {
                        cellValue = row.item;
                    } else {
                        const year = col.replace("سال ", "");
                        cellValue = row[year];
                    }

                    return (
                        <td key={cIdx} className="py-4 px-4 whitespace-nowrap">
                            {cellValue}
                        </td>
                    );
                    })}
                </motion.tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>

      <style jsx>{`
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
  );
};

export default TableWrapper;

import React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  RotateCcw,
  Percent,
  FileText,
  List,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useCursor } from "../context/CursorContext";

// Persian number formatter
const formatNumber = (num) => {
  if (typeof num === "string") return num;
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + " میلیارد";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + " میلیون";
  }
  return num.toLocaleString("fa-IR");
};

// Single Metric Card - matches ProfitLossContent style
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
        <p className="text-xl font-bold text-white">{value}</p>
        {subLabel && (
          <p className="text-[10px] text-gray-500 mt-0.5">{subLabel}</p>
        )}
      </div>
    </motion.div>
  );
};

// Split Card Component for showing two metrics side by side - matches ProfitLossContent style
const SplitCard = ({ rightLabel, rightValue, leftLabel, leftValue, color, icon: Icon, delay = 0, isPositive = true }) => {
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

      <div className="relative z-10 flex items-center gap-3 mt-1">
        <div className="flex-1 text-right border-l border-white/10 pl-3">
          <p className="text-[10px] text-gray-500 mb-0.5">{rightLabel}</p>
          <p className="text-lg font-bold text-white">{rightValue}</p>
        </div>

        <div className="flex-1 text-right">
          <p className="text-[10px] text-gray-500 mb-0.5">{leftLabel}</p>
          <p
            className={`text-lg font-bold ${
              isPositive ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {leftValue}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const SalesMetricCards = ({ metrics, companyColor }) => {
  // Determine if growth values are positive
  const card4Positive = metrics.card4.positive !== undefined ? metrics.card4.positive : true;
  const card5Positive = metrics.card5.positive !== undefined ? metrics.card5.positive : true;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      {/* Card 1: Sales Amount/Count */}
      <MetricCard
        label={metrics.card1.label}
        value={metrics.card1.value}
        subLabel={metrics.card1.desc}
        color="34, 197, 94" // Green
        icon={TrendingUp}
        delay={0}
      />

      {/* Card 2: Returns Amount/Count */}
      <MetricCard
        label={metrics.card2.label}
        value={metrics.card2.value}
        subLabel={metrics.card2.desc}
        color="239, 68, 68" // Red
        icon={RotateCcw}
        delay={0.1}
      />

      {/* Card 3: Return Ratio */}
      <MetricCard
        label={metrics.card3.label}
        value={metrics.card3.value}
        subLabel={metrics.card3.desc}
        color="250, 204, 21" // Yellow
        icon={Percent}
        delay={0.2}
      />

      {/* Card 4: Invoice Count OR Growth vs Last Year */}
      <MetricCard
        label={metrics.card4.label}
        value={metrics.card4.value}
        subLabel={metrics.card4.desc}
        color={metrics.card4.isGrowth 
          ? (card4Positive ? "34, 197, 94" : "239, 68, 68") 
          : "59, 130, 246"} // Blue for invoice count, Green/Red for growth
        icon={metrics.card4.isGrowth 
          ? (card4Positive ? ArrowUp : ArrowDown) 
          : FileText}
        delay={0.3}
      />

      {/* Card 5: Invoice Lines OR Growth vs 2 Years Ago */}
      <MetricCard
        label={metrics.card5.label}
        value={metrics.card5.value}
        subLabel={metrics.card5.desc}
        color={metrics.card5.isGrowth 
          ? (card5Positive ? "34, 197, 94" : "239, 68, 68") 
          : "168, 85, 247"} // Purple for lines, Green/Red for growth
        icon={metrics.card5.isGrowth 
          ? (card5Positive ? ArrowUp : ArrowDown) 
          : List}
        delay={0.4}
      />
    </div>
  );
};

export default SalesMetricCards;

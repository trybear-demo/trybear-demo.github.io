import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Timer,
  Banknote,
  Receipt,
} from "lucide-react";
import FadeContent from "./FadeContent";

// Persian number formatter
const formatMoney = (num) => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + " میلیارد";
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + " میلیون";
  }
  return Math.floor(num).toLocaleString();
};

const formatCount = (num) => {
  return Math.floor(num).toLocaleString("fa-IR");
};

// Seeded random function for consistent data
const createSeededRandom = (seed) => {
  return function () {
    seed = Math.sin(seed) * 10000;
    return seed - Math.floor(seed);
  };
};

// Persian months
const persianMonths = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
];

// Check statuses
const checkStatuses = [
  { id: "passed", label: "وصول شده", color: "#22c55e", icon: CheckCircle },
  { id: "pending", label: "در جریان", color: "#f59e0b", icon: Clock },
  { id: "returned", label: "برگشتی", color: "#ef4444", icon: XCircle },
  { id: "future", label: "آتی", color: "#3b82f6", icon: Timer },
];

// Generate mock data for checks
const generateChecksData = (type, companyId) => {
  const random = createSeededRandom(companyId * (type === "receivable" ? 100 : 200));
  
  // Total counts and amounts
  const totalCount = Math.floor(150 + random() * 200);
  const avgAmount = (type === "receivable" ? 50 : 40) + random() * 30;
  const totalAmount = totalCount * avgAmount * 1000000;

  // Status distribution
  const statusDistribution = [
    { ...checkStatuses[0], count: Math.floor(totalCount * (0.35 + random() * 0.1)), amount: 0 },
    { ...checkStatuses[1], count: Math.floor(totalCount * (0.25 + random() * 0.1)), amount: 0 },
    { ...checkStatuses[2], count: Math.floor(totalCount * (0.05 + random() * 0.05)), amount: 0 },
    { ...checkStatuses[3], count: Math.floor(totalCount * (0.2 + random() * 0.1)), amount: 0 },
  ];
  
  // Adjust to match total
  const countSum = statusDistribution.reduce((sum, s) => sum + s.count, 0);
  statusDistribution[0].count += totalCount - countSum;
  
  // Calculate amounts for each status
  statusDistribution.forEach(s => {
    s.amount = s.count * avgAmount * 1000000 * (0.8 + random() * 0.4);
  });

  // Monthly trend data (last 12 months)
  const monthlyData = persianMonths.map((month, idx) => ({
    month,
    count: Math.floor(10 + random() * 20),
    amount: Math.floor((3 + random() * 8) * 1000000000),
  }));

  // Collection/Payment period by month
  const periodByMonth = persianMonths.map((month, idx) => ({
    month,
    days: Math.floor(25 + random() * 60),
  }));

  // Customer/Vendor data
  const customers = Array.from({ length: 10 }, (_, i) => {
    const r = createSeededRandom(companyId * 1000 + type.charCodeAt(0) + i);
    const names = type === "receivable" 
      ? ["فروشگاه کوروش", "هایپراستار", "شهروند", "رفاه", "افق کوروش", "جانبو", "اتکا", "هفت", "سی‌بار", "دیجی‌کالا"]
      : ["پخش آریا", "شرکت البرز", "صنایع غذایی پارس", "تعاونی مصرف", "بازرگانی نوین", "پخش سراسری", "توزیع گستر", "لجستیک نوآور", "حمل و نقل سریع", "انبارداری پارسیان"];
    return {
      id: i,
      name: names[i],
      checkCount: Math.floor(5 + r() * 25),
      totalAmount: Math.floor((1 + r() * 10) * 1000000000),
      avgCollectionDays: Math.floor(20 + r() * 50),
    };
  }).sort((a, b) => b.totalAmount - a.totalAmount);

  // Future checks data (next 6 months)
  const futureChecks = Array.from({ length: 6 }, (_, i) => {
    const r = createSeededRandom(companyId * 500 + type.charCodeAt(0) + i);
    const monthIndex = (new Date().getMonth() + i + 1) % 12;
    return {
      month: persianMonths[monthIndex],
      count: Math.floor(5 + r() * 15),
      amount: Math.floor((1 + r() * 5) * 1000000000),
    };
  });

  return {
    totalCount,
    totalAmount,
    statusDistribution,
    monthlyData,
    periodByMonth,
    customers,
    futureChecks,
    avgCollectionDays: Math.floor(30 + random() * 30),
  };
};

// Stat Card Component
const StatCard = ({ title, value, subtitle, icon: Icon, color, trend }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#060010] border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300"
      style={{ boxShadow: `0 0 30px rgba(${color}, 0.1)` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
          <p className="text-gray-500 text-xs">{subtitle}</p>
        </div>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `rgba(${color}, 0.15)` }}
        >
          <Icon size={24} style={{ color: `rgb(${color})` }} />
        </div>
      </div>
      
      {trend !== undefined && (
        <div className={`flex items-center gap-1 mt-3 text-sm ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {trend >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          <span>{Math.abs(trend).toFixed(1)}% نسبت به ماه قبل</span>
        </div>
      )}
      
      <div
        className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"
        style={{ backgroundColor: `rgb(${color})` }}
      />
    </motion.div>
  );
};

// Status Distribution Donut Chart
const StatusDonutChart = ({ data, type }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const total = data.reduce((sum, d) => sum + d.count, 0);
  
  const radius = 70;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;
  
  let currentAngle = -90;
  const segments = data.map((item, index) => {
    const percentage = (item.count / total) * 100;
    const angle = (percentage / 100) * 360;
    const segment = {
      ...item,
      index,
      percentage: percentage.toFixed(1),
      startAngle: currentAngle,
      strokeDasharray: `${(percentage / 100) * circumference} ${circumference}`,
    };
    currentAngle += angle;
    return segment;
  });

  const hoveredItem = hoveredIndex !== null ? segments[hoveredIndex] : null;

  return (
    <div className="bg-[#060010] border border-white/10 rounded-2xl p-5 relative">
      <h4 className="text-sm font-bold text-white mb-4 text-right">
        توزیع وضعیت چک‌های {type === "receivable" ? "دریافتنی" : "پرداختنی"}
      </h4>
      
      <div className="flex items-center justify-between">
        {/* Legend */}
        <div className="flex flex-col gap-2">
          {segments.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-2 cursor-pointer transition-opacity ${
                hoveredIndex !== null && hoveredIndex !== item.index ? 'opacity-40' : ''
              }`}
              onMouseEnter={() => setHoveredIndex(item.index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-gray-400">{item.label}</span>
              <span className="text-xs font-bold text-white">{formatCount(item.count)}</span>
            </div>
          ))}
        </div>
        
        {/* Donut */}
        <div className="relative w-[160px] h-[160px]">
          <svg width="160" height="160" viewBox="0 0 180 180">
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="transparent"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth={strokeWidth}
            />
            {segments.map((item) => (
              <motion.circle
                key={item.id}
                cx="90"
                cy="90"
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={hoveredIndex === item.index ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={item.strokeDasharray}
                strokeDashoffset={0}
                strokeLinecap="butt"
                initial={{ pathLength: 0 }}
                animate={{ 
                  pathLength: 1,
                  opacity: hoveredIndex !== null && hoveredIndex !== item.index ? 0.3 : 1 
                }}
                transition={{ duration: 0.8, delay: item.index * 0.1 }}
                style={{
                  transformOrigin: "center",
                  transform: `rotate(${item.startAngle}deg)`,
                }}
                onMouseEnter={() => setHoveredIndex(item.index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              />
            ))}
          </svg>
          
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={hoveredIndex !== null ? hoveredIndex : "total"}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center"
              >
                {hoveredItem ? (
                  <>
                    <span className="text-2xl font-bold text-white">{hoveredItem.percentage}%</span>
                    <span className="text-xs text-gray-400 block">{hoveredItem.label}</span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl font-bold text-white">{formatCount(total)}</span>
                    <span className="text-xs text-gray-400 block">کل چک‌ها</span>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

// Monthly Bar Chart
const MonthlyBarChart = ({ data, color, title, unit }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const maxVal = Math.max(...data.map(d => d.amount)) * 1.2;

  return (
    <div className="bg-[#060010] border border-white/10 rounded-2xl p-5 h-[280px] relative overflow-hidden">
      <h4 className="text-sm font-bold text-white mb-4 text-right">{title}</h4>
      
      <div className="flex items-end justify-between gap-1 h-[180px] px-2">
        {data.map((item, idx) => {
          const height = maxVal > 0 ? (item.amount / maxVal) * 100 : 0;
          const isHovered = hoveredIndex === idx;
          
          return (
            <div
              key={item.month}
              className="flex flex-col items-center gap-1 flex-1"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute -top-2 bg-black/90 backdrop-blur border border-white/20 px-3 py-2 rounded-lg text-xs text-white z-10"
                  >
                    <div className="font-bold">{item.month}</div>
                    <div>{formatMoney(item.amount)} {unit}</div>
                    <div className="text-gray-400">{formatCount(item.count)} چک</div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                className="w-full max-w-[24px] rounded-t-md cursor-pointer transition-all duration-200"
                style={{
                  backgroundColor: isHovered ? color : `${color}66`,
                  boxShadow: isHovered ? `0 0 15px ${color}` : 'none',
                }}
              />
              
              <span className="text-[9px] text-gray-500 truncate w-full text-center">
                {item.month.slice(0, 3)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Collection Period Chart
const CollectionPeriodChart = ({ data, color, title }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const maxDays = Math.max(...data.map(d => d.days)) * 1.2;
  const avgDays = Math.round(data.reduce((sum, d) => sum + d.days, 0) / data.length);

  return (
    <div className="bg-[#060010] border border-white/10 rounded-2xl p-5 relative overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Clock size={16} style={{ color }} />
          <span className="text-gray-400 text-xs">میانگین: {avgDays} روز</span>
        </div>
        <h4 className="text-sm font-bold text-white text-right">{title}</h4>
      </div>
      
      <div className="space-y-2">
        {data.slice(0, 6).map((item, idx) => {
          const width = (item.days / maxDays) * 100;
          const isHovered = hoveredIndex === idx;
          
          return (
            <div
              key={item.month}
              className="flex items-center gap-3 cursor-pointer group"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <span className="text-xs text-gray-400 w-16 text-right">{item.month}</span>
              <div className="flex-1 h-4 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${width}%` }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="h-full rounded-full transition-all duration-200"
                  style={{
                    backgroundColor: isHovered ? color : `${color}88`,
                    boxShadow: isHovered ? `0 0 10px ${color}` : 'none',
                  }}
                />
              </div>
              <span className={`text-xs font-mono w-10 transition-colors ${isHovered ? 'text-white' : 'text-gray-500'}`}>
                {item.days} روز
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Customer/Vendor Table
const CustomerTable = ({ data, type, color }) => {
  const [hoveredRow, setHoveredRow] = useState(null);
  
  return (
    <div className="bg-[#060010] border border-white/10 rounded-2xl p-5 relative overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <Users size={18} style={{ color }} />
        <h4 className="text-sm font-bold text-white">
          {type === "receivable" ? "مبلغ چک به تفکیک مشتری" : "مبلغ چک به تفکیک تامین‌کننده"}
        </h4>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="pb-3 text-gray-500 font-medium">میانگین وصول</th>
              <th className="pb-3 text-gray-500 font-medium">مبلغ کل</th>
              <th className="pb-3 text-gray-500 font-medium">تعداد</th>
              <th className="pb-3 text-gray-500 font-medium">{type === "receivable" ? "مشتری" : "تامین‌کننده"}</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 5).map((item, idx) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`border-b border-white/5 cursor-pointer transition-colors ${
                  hoveredRow === idx ? 'bg-white/5' : ''
                }`}
                onMouseEnter={() => setHoveredRow(idx)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="py-3 text-gray-400">{item.avgCollectionDays} روز</td>
                <td className="py-3 font-mono" style={{ color: hoveredRow === idx ? color : '#fff' }}>
                  {formatMoney(item.totalAmount)}
                </td>
                <td className="py-3 text-gray-300">{formatCount(item.checkCount)}</td>
                <td className="py-3 text-white font-medium">{item.name}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Future Checks Chart (Combined)
const FutureChecksChart = ({ receivableData, payableData }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const maxVal = Math.max(
    ...receivableData.map(d => d.amount),
    ...payableData.map(d => d.amount)
  ) * 1.3;

  return (
    <div className="bg-[#060010] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm text-gray-400">دریافتنی</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="text-sm text-gray-400">پرداختنی</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={20} className="text-blue-400" />
          <h4 className="text-base font-bold text-white">چک‌های آتی (۶ ماه آینده)</h4>
        </div>
      </div>
      
      <div className="flex items-end justify-around gap-4 h-[250px]">
        {receivableData.map((item, idx) => {
          const receivableHeight = maxVal > 0 ? (item.amount / maxVal) * 100 : 0;
          const payableHeight = maxVal > 0 ? (payableData[idx].amount / maxVal) * 100 : 0;
          const isHovered = hoveredIndex === idx;
          
          return (
            <div
              key={item.month}
              className="flex flex-col items-center gap-2 flex-1 relative"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute -top-20 bg-black/95 backdrop-blur border border-white/20 px-4 py-3 rounded-xl z-20 min-w-[160px]"
                  >
                    <div className="font-bold text-white mb-2 border-b border-white/10 pb-2">{item.month}</div>
                    <div className="flex justify-between items-center gap-4 mb-1">
                      <span className="text-green-400 font-mono">{formatMoney(item.amount)}</span>
                      <span className="text-xs text-gray-400">دریافتنی:</span>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-rose-400 font-mono">{formatMoney(payableData[idx].amount)}</span>
                      <span className="text-xs text-gray-400">پرداختنی:</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="flex items-end gap-2 h-[200px]">
                {/* Receivable Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${receivableHeight}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                  className="w-8 rounded-t-lg cursor-pointer transition-all duration-200 relative overflow-hidden"
                  style={{
                    backgroundColor: isHovered ? '#22c55e' : 'rgba(34, 197, 94, 0.5)',
                    boxShadow: isHovered ? '0 0 20px rgba(34, 197, 94, 0.5)' : 'none',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
                </motion.div>
                
                {/* Payable Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${payableHeight}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.1 + 0.05 }}
                  className="w-8 rounded-t-lg cursor-pointer transition-all duration-200 relative overflow-hidden"
                  style={{
                    backgroundColor: isHovered ? '#f43f5e' : 'rgba(244, 63, 94, 0.5)',
                    boxShadow: isHovered ? '0 0 20px rgba(244, 63, 94, 0.5)' : 'none',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
                </motion.div>
              </div>
              
              <span className={`text-sm font-medium transition-colors ${isHovered ? 'text-white' : 'text-gray-500'}`}>
                {item.month}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={18} className="text-green-400" />
            <span className="text-green-400 text-sm">مجموع دریافتنی آتی</span>
          </div>
          <span className="text-2xl font-bold text-white">
            {formatMoney(receivableData.reduce((sum, d) => sum + d.amount, 0))}
          </span>
        </div>
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={18} className="text-rose-400" />
            <span className="text-rose-400 text-sm">مجموع پرداختنی آتی</span>
          </div>
          <span className="text-2xl font-bold text-white">
            {formatMoney(payableData.reduce((sum, d) => sum + d.amount, 0))}
          </span>
        </div>
      </div>
    </div>
  );
};

// Check Section Component
const CheckSection = ({ type, data, color }) => {
  const Icon = type === "receivable" ? TrendingUp : TrendingDown;
  const title = type === "receivable" ? "چک‌های دریافتنی" : "چک‌های پرداختنی";
  const iconBgClass = type === "receivable" ? "bg-green-500/15" : "bg-rose-500/15";
  const iconColorClass = type === "receivable" ? "text-green-400" : "text-rose-400";
  
  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-xl ${iconBgClass}`}>
          <Icon className={iconColorClass} size={24} />
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      
      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          title="تعداد چک"
          value={formatCount(data.totalCount)}
          subtitle="عدد"
          icon={Receipt}
          color={color}
        />
        <StatCard
          title="مبلغ کل"
          value={formatMoney(data.totalAmount)}
          subtitle="ریال"
          icon={Banknote}
          color={color}
          trend={type === "receivable" ? 12.5 : -5.2}
        />
      </div>
      
      {/* Status Distribution */}
      <StatusDonutChart data={data.statusDistribution} type={type} />
      
      {/* Monthly Trend */}
      <MonthlyBarChart
        data={data.monthlyData}
        color={color}
        title={`روند ماهانه چک‌های ${type === "receivable" ? "دریافتنی" : "پرداختنی"}`}
        unit="ریال"
      />
      
      {/* Collection Period by Month */}
      <CollectionPeriodChart
        data={data.periodByMonth}
        color={color}
        title={`میانگین دوره ${type === "receivable" ? "وصول" : "پرداخت"} به تفکیک ماه`}
      />
      
      {/* Customer/Vendor Table */}
      <CustomerTable data={data.customers} type={type} color={color} />
    </div>
  );
};

// Main Component
const ChecksContent = ({ companyId = 1, color = "132, 0, 255" }) => {
  const receivableData = useMemo(() => generateChecksData("receivable", companyId), [companyId]);
  const payableData = useMemo(() => generateChecksData("payable", companyId), [companyId]);

  return (
    <FadeContent blur={true} duration={600}>
      <div className="w-full pb-12 space-y-8" dir="rtl">
        {/* Page Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10">
            <FileText size={28} className="text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">مدیریت چک‌ها</h2>
            <p className="text-gray-500 text-sm">نمای کلی چک‌های دریافتنی و پرداختنی</p>
          </div>
        </div>
        
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Right: Receivable Checks */}
          <CheckSection
            type="receivable"
            data={receivableData}
            color="#22c55e"
          />
          
          {/* Left: Payable Checks */}
          <CheckSection
            type="payable"
            data={payableData}
            color="#f43f5e"
          />
        </div>
        
        {/* Bottom: Future Checks Chart */}
        <div className="mt-8">
          <FutureChecksChart
            receivableData={receivableData.futureChecks}
            payableData={payableData.futureChecks}
          />
        </div>
      </div>
    </FadeContent>
  );
};

export default ChecksContent;

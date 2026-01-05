import React, { useState, useMemo, useCallback } from "react";
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
  Timer,
  Banknote,
  Receipt,
  X,
  Filter,
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
  let s = seed;
  return function () {
    s = Math.sin(s) * 10000;
    return s - Math.floor(s);
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
  
  // Customer/Vendor names
  const customerNames = type === "receivable" 
    ? ["فروشگاه کوروش", "هایپراستار", "شهروند", "رفاه", "افق کوروش", "جانبو", "اتکا", "هفت", "سی‌بار", "دیجی‌کالا"]
    : ["پخش آریا", "شرکت البرز", "صنایع غذایی پارس", "تعاونی مصرف", "بازرگانی نوین", "پخش سراسری", "توزیع گستر", "لجستیک نوآور", "حمل و نقل سریع", "انبارداری پارسیان"];

  // Generate individual checks data
  const checks = [];
  const totalChecks = Math.floor(200 + random() * 150);
  
  for (let i = 0; i < totalChecks; i++) {
    const r = createSeededRandom(companyId * 1000 + type.charCodeAt(0) * 100 + i);
    const statusIndex = Math.floor(r() * 100);
    let status;
    if (statusIndex < 40) status = checkStatuses[0]; // passed
    else if (statusIndex < 65) status = checkStatuses[1]; // pending
    else if (statusIndex < 75) status = checkStatuses[2]; // returned
    else status = checkStatuses[3]; // future
    
    const monthIndex = Math.floor(r() * 12);
    const customerId = Math.floor(r() * 10);
    const amount = Math.floor((10 + r() * 90) * 1000000); // 10-100 million
    const collectionDays = Math.floor(15 + r() * 70);
    
    checks.push({
      id: i,
      status: status.id,
      statusLabel: status.label,
      statusColor: status.color,
      month: persianMonths[monthIndex],
      monthIndex,
      customerId,
      customerName: customerNames[customerId],
      amount,
      collectionDays,
    });
  }
  
  return checks;
};

// Filter and aggregate data
const aggregateData = (checks, filters) => {
  // Apply filters
  let filteredChecks = checks;
  
  if (filters.status) {
    filteredChecks = filteredChecks.filter(c => c.status === filters.status);
  }
  if (filters.month !== null && filters.month !== undefined) {
    filteredChecks = filteredChecks.filter(c => c.monthIndex === filters.month);
  }
  if (filters.customerId !== null && filters.customerId !== undefined) {
    filteredChecks = filteredChecks.filter(c => c.customerId === filters.customerId);
  }
  
  // Calculate totals
  const totalCount = filteredChecks.length;
  const totalAmount = filteredChecks.reduce((sum, c) => sum + c.amount, 0);
  
  // Status distribution
  const statusDistribution = checkStatuses.map(status => {
    const statusChecks = filteredChecks.filter(c => c.status === status.id);
    return {
      ...status,
      count: statusChecks.length,
      amount: statusChecks.reduce((sum, c) => sum + c.amount, 0),
    };
  });
  
  // Monthly data
  const monthlyData = persianMonths.map((month, idx) => {
    const monthChecks = filteredChecks.filter(c => c.monthIndex === idx);
    return {
      month,
      monthIndex: idx,
      count: monthChecks.length,
      amount: monthChecks.reduce((sum, c) => sum + c.amount, 0),
    };
  });
  
  // Period by month (average collection days)
  const periodByMonth = persianMonths.map((month, idx) => {
    const monthChecks = filteredChecks.filter(c => c.monthIndex === idx);
    const avgDays = monthChecks.length > 0 
      ? Math.round(monthChecks.reduce((sum, c) => sum + c.collectionDays, 0) / monthChecks.length)
      : 0;
    return { month, monthIndex: idx, days: avgDays };
  });
  
  // Customer aggregation
  const customerMap = {};
  filteredChecks.forEach(c => {
    if (!customerMap[c.customerId]) {
      customerMap[c.customerId] = {
        id: c.customerId,
        name: c.customerName,
        checkCount: 0,
        totalAmount: 0,
        totalDays: 0,
      };
    }
    customerMap[c.customerId].checkCount++;
    customerMap[c.customerId].totalAmount += c.amount;
    customerMap[c.customerId].totalDays += c.collectionDays;
  });
  
  const customers = Object.values(customerMap)
    .map(c => ({
      ...c,
      avgCollectionDays: c.checkCount > 0 ? Math.round(c.totalDays / c.checkCount) : 0,
    }))
    .sort((a, b) => b.totalAmount - a.totalAmount);
  
  // Future checks (only future status)
  const futureChecks = persianMonths.slice(0, 6).map((month, idx) => {
    const monthChecks = checks.filter(c => c.monthIndex === idx && c.status === 'future');
    return {
      month,
      monthIndex: idx,
      count: monthChecks.length,
      amount: monthChecks.reduce((sum, c) => sum + c.amount, 0),
    };
  });
  
  // Average collection days
  const avgCollectionDays = filteredChecks.length > 0
    ? Math.round(filteredChecks.reduce((sum, c) => sum + c.collectionDays, 0) / filteredChecks.length)
    : 0;
  
  return {
    totalCount,
    totalAmount,
    statusDistribution,
    monthlyData,
    periodByMonth,
    customers,
    futureChecks,
    avgCollectionDays,
  };
};

// Active Filters Bar
const ActiveFiltersBar = ({ filters, onClearFilter, onClearAll, type }) => {
  const hasFilters = filters.status || filters.month !== null || filters.customerId !== null;
  
  if (!hasFilters) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="flex flex-wrap items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-xl mb-4"
    >
      <div className="flex items-center gap-2 text-gray-400 text-xs">
        <Filter size={14} />
        <span>فیلترها:</span>
      </div>
      
      {filters.status && (
        <div className="flex items-center gap-1 px-2 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-400 text-xs">
          <span>{checkStatuses.find(s => s.id === filters.status)?.label}</span>
          <button onClick={() => onClearFilter('status')} className="hover:bg-amber-500/30 rounded-full p-0.5">
            <X size={12} />
          </button>
        </div>
      )}
      
      {filters.month !== null && (
        <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 text-xs">
          <span>{persianMonths[filters.month]}</span>
          <button onClick={() => onClearFilter('month')} className="hover:bg-blue-500/30 rounded-full p-0.5">
            <X size={12} />
          </button>
        </div>
      )}
      
      {filters.customerId !== null && (
        <div className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-400 text-xs">
          <span>{filters.customerName}</span>
          <button onClick={() => onClearFilter('customerId')} className="hover:bg-purple-500/30 rounded-full p-0.5">
            <X size={12} />
          </button>
        </div>
      )}
      
      <button
        onClick={onClearAll}
        className="mr-auto px-2 py-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-full text-red-400 text-xs flex items-center gap-1"
      >
        <X size={12} />
        <span>پاک کردن</span>
      </button>
    </motion.div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, subtitle, icon: Icon, color, trend }) => {
  const rgbColor = color.startsWith('#') 
    ? color.slice(1).match(/.{2}/g).map(hex => parseInt(hex, 16)).join(', ')
    : color.replace(/[^\d,]/g, '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#060010] border border-white/10 rounded-2xl p-4 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300"
      style={{ boxShadow: `0 0 30px rgba(${rgbColor}, 0.1)` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-xs mb-1">{title}</p>
          <h3 className="text-xl font-bold text-white mb-1">{value}</h3>
          <p className="text-gray-500 text-[10px]">{subtitle}</p>
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}22` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
      </div>
      
      {trend !== undefined && (
        <div className={`flex items-center gap-1 mt-2 text-xs ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          <span>{Math.abs(trend).toFixed(1)}%</span>
        </div>
      )}
      
      <div
        className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"
        style={{ backgroundColor: color }}
      />
    </motion.div>
  );
};

// Status Distribution Donut Chart
const StatusDonutChart = ({ data, type, activeStatus, onStatusClick }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const total = data.reduce((sum, d) => sum + d.count, 0);
  
  if (total === 0) {
    return (
      <div className="bg-[#060010] border border-white/10 rounded-2xl p-5 flex items-center justify-center h-[200px]">
        <p className="text-gray-500">داده‌ای برای نمایش وجود ندارد</p>
      </div>
    );
  }
  
  const radius = 60;
  const strokeWidth = 16;
  const circumference = 2 * Math.PI * radius;
  
  let currentAngle = -90;
  const segments = data.map((item, index) => {
    const percentage = total > 0 ? (item.count / total) * 100 : 0;
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
  }).filter(s => parseFloat(s.percentage) > 0);

  const hoveredItem = hoveredIndex !== null ? segments.find(s => s.index === hoveredIndex) : null;

  return (
    <div className="bg-[#060010] border border-white/10 rounded-2xl p-4 relative">
      <h4 className="text-xs font-bold text-white mb-3 text-right flex items-center gap-2">
        <span>توزیع وضعیت</span>
        <span className="text-gray-500 text-[10px]">(کلیک برای فیلتر)</span>
      </h4>
      
      <div className="flex items-center justify-between gap-4">
        {/* Legend */}
        <div className="flex flex-col gap-1.5">
          {data.map((item, idx) => {
            const isActive = activeStatus === item.id;
            const isOtherActive = activeStatus && activeStatus !== item.id;
            
            return (
              <div
                key={item.id}
                onClick={() => onStatusClick(item.id)}
                className={`flex items-center gap-2 cursor-pointer transition-all rounded-lg px-2 py-1 ${
                  isActive ? 'bg-white/10 ring-1 ring-white/20' : ''
                } ${isOtherActive ? 'opacity-40' : 'hover:bg-white/5'}`}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[10px] text-gray-400">{item.label}</span>
                <span className="text-[10px] font-bold text-white">{formatCount(item.count)}</span>
              </div>
            );
          })}
        </div>
        
        {/* Donut */}
        <div className="relative w-[130px] h-[130px]">
          <svg width="130" height="130" viewBox="0 0 150 150">
            <circle
              cx="75"
              cy="75"
              r={radius}
              fill="transparent"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth={strokeWidth}
            />
            {segments.map((item) => {
              const isActive = activeStatus === item.id;
              const isOtherActive = activeStatus && activeStatus !== item.id;
              
              return (
                <motion.circle
                  key={item.id}
                  cx="75"
                  cy="75"
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={hoveredIndex === item.index || isActive ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={item.strokeDasharray}
                  strokeDashoffset={0}
                  strokeLinecap="butt"
                  initial={{ pathLength: 0 }}
                  animate={{ 
                    pathLength: 1,
                    opacity: isOtherActive ? 0.3 : (hoveredIndex !== null && hoveredIndex !== item.index ? 0.5 : 1)
                  }}
                  transition={{ duration: 0.6, delay: item.index * 0.08 }}
                  style={{
                    transformOrigin: "center",
                    transform: `rotate(${item.startAngle}deg)`,
                    cursor: 'pointer',
                  }}
                  onClick={() => onStatusClick(item.id)}
                  onMouseEnter={() => setHoveredIndex(item.index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            })}
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
                    <span className="text-lg font-bold text-white">{hoveredItem.percentage}%</span>
                    <span className="text-[10px] text-gray-400 block">{hoveredItem.label}</span>
                  </>
                ) : (
                  <>
                    <span className="text-lg font-bold text-white">{formatCount(total)}</span>
                    <span className="text-[10px] text-gray-400 block">کل</span>
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

// Monthly Bar Chart - FIXED
const MonthlyBarChart = ({ data, color, title, activeMonth, onMonthClick }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const maxVal = Math.max(...data.map(d => d.amount), 1) * 1.2;

  return (
    <div className="bg-[#060010] border border-white/10 rounded-2xl p-4 relative overflow-hidden">
      <h4 className="text-xs font-bold text-white mb-3 text-right flex items-center gap-2">
        <span>{title}</span>
        <span className="text-gray-500 text-[10px]">(کلیک برای فیلتر)</span>
      </h4>
      
      <div className="relative h-[160px]">
        <svg width="100%" height="100%" viewBox="0 0 400 160" preserveAspectRatio="none">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
            <line
              key={i}
              x1="0"
              y1={140 - t * 120}
              x2="400"
              y2={140 - t * 120}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />
          ))}
          
          {/* Bars */}
          {data.map((item, idx) => {
            const barWidth = 25;
            const gap = (400 - barWidth * 12) / 13;
            const x = gap + idx * (barWidth + gap);
            const height = maxVal > 0 ? (item.amount / maxVal) * 120 : 0;
            const y = 140 - height;
            
            const isHovered = hoveredIndex === idx;
            const isActive = activeMonth === idx;
            const isOtherActive = activeMonth !== null && activeMonth !== idx;
            
            return (
              <g key={item.month}>
                {/* Bar */}
                <motion.rect
                  x={x}
                  y={y}
                  width={barWidth}
                  rx={4}
                  initial={{ height: 0, y: 140 }}
                  animate={{ 
                    height: Math.max(height, 2),
                    y: 140 - Math.max(height, 2),
                  }}
                  transition={{ duration: 0.5, delay: idx * 0.04 }}
                  fill={isActive ? color : isHovered ? color : `${color}66`}
                  opacity={isOtherActive ? 0.3 : 1}
                  style={{ cursor: 'pointer' }}
                  onClick={() => onMonthClick(idx)}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
                
                {/* Active indicator */}
                {isActive && (
                  <rect
                    x={x - 2}
                    y={y - 4}
                    width={barWidth + 4}
                    height={height + 6}
                    rx={6}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    opacity="0.5"
                  />
                )}
                
                {/* Month label */}
                <text
                  x={x + barWidth / 2}
                  y={155}
                  textAnchor="middle"
                  fill={isActive ? color : isOtherActive ? '#444' : '#666'}
                  fontSize="8"
                  fontWeight={isActive ? 'bold' : 'normal'}
                >
                  {item.month.slice(0, 2)}
                </text>
              </g>
            );
          })}
        </svg>
        
        {/* Tooltip */}
        <AnimatePresence>
          {hoveredIndex !== null && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute top-0 left-1/2 -translate-x-1/2 bg-black/95 backdrop-blur border border-white/20 px-3 py-2 rounded-lg text-xs z-10"
            >
              <div className="font-bold text-white">{data[hoveredIndex].month}</div>
              <div className="text-gray-300">{formatMoney(data[hoveredIndex].amount)}</div>
              <div className="text-gray-500">{formatCount(data[hoveredIndex].count)} چک</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Collection Period Chart
const CollectionPeriodChart = ({ data, color, title }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const validData = data.filter(d => d.days > 0);
  const maxDays = Math.max(...validData.map(d => d.days), 1) * 1.2;
  const avgDays = validData.length > 0 
    ? Math.round(validData.reduce((sum, d) => sum + d.days, 0) / validData.length)
    : 0;

  return (
    <div className="bg-[#060010] border border-white/10 rounded-2xl p-4 relative overflow-hidden">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <Clock size={14} style={{ color }} />
          <span className="text-gray-400 text-[10px]">میانگین: {avgDays} روز</span>
        </div>
        <h4 className="text-xs font-bold text-white text-right">{title}</h4>
      </div>
      
      <div className="space-y-1.5">
        {data.slice(0, 6).map((item, idx) => {
          const width = item.days > 0 ? (item.days / maxDays) * 100 : 0;
          const isHovered = hoveredIndex === idx;
          
          return (
            <div
              key={item.month}
              className="flex items-center gap-2 cursor-pointer group"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <span className="text-[10px] text-gray-400 w-14 text-right">{item.month}</span>
              <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${width}%` }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="h-full rounded-full transition-all duration-200"
                  style={{
                    backgroundColor: isHovered ? color : `${color}88`,
                    boxShadow: isHovered ? `0 0 8px ${color}` : 'none',
                  }}
                />
              </div>
              <span className={`text-[10px] font-mono w-10 transition-colors ${isHovered ? 'text-white' : 'text-gray-500'}`}>
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
const CustomerTable = ({ data, type, color, activeCustomerId, onCustomerClick }) => {
  const [hoveredRow, setHoveredRow] = useState(null);
  
  if (data.length === 0) {
    return (
      <div className="bg-[#060010] border border-white/10 rounded-2xl p-4 flex items-center justify-center h-[150px]">
        <p className="text-gray-500 text-sm">داده‌ای برای نمایش وجود ندارد</p>
      </div>
    );
  }
  
  return (
    <div className="bg-[#060010] border border-white/10 rounded-2xl p-4 relative overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <Users size={14} style={{ color }} />
        <h4 className="text-xs font-bold text-white">
          {type === "receivable" ? "به تفکیک مشتری" : "به تفکیک تامین‌کننده"}
        </h4>
        <span className="text-gray-500 text-[10px]">(کلیک برای فیلتر)</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-right text-xs">
          <thead>
            <tr className="border-b border-white/10">
              <th className="pb-2 text-gray-500 font-medium text-[10px]">وصول</th>
              <th className="pb-2 text-gray-500 font-medium text-[10px]">مبلغ</th>
              <th className="pb-2 text-gray-500 font-medium text-[10px]">تعداد</th>
              <th className="pb-2 text-gray-500 font-medium text-[10px]">{type === "receivable" ? "مشتری" : "تامین‌کننده"}</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 5).map((item, idx) => {
              const isActive = activeCustomerId === item.id;
              const isOtherActive = activeCustomerId !== null && activeCustomerId !== item.id;
              
              return (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  onClick={() => onCustomerClick(item.id, item.name)}
                  className={`border-b border-white/5 cursor-pointer transition-all ${
                    isActive ? 'bg-white/10' : hoveredRow === idx ? 'bg-white/5' : ''
                  } ${isOtherActive ? 'opacity-40' : ''}`}
                  onMouseEnter={() => setHoveredRow(idx)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="py-2 text-gray-400 text-[10px]">{item.avgCollectionDays} روز</td>
                  <td className="py-2 font-mono text-[10px]" style={{ color: hoveredRow === idx || isActive ? color : '#fff' }}>
                    {formatMoney(item.totalAmount)}
                  </td>
                  <td className="py-2 text-gray-300 text-[10px]">{formatCount(item.checkCount)}</td>
                  <td className="py-2 text-white font-medium text-[10px]">{item.name}</td>
                </motion.tr>
              );
            })}
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
    ...payableData.map(d => d.amount),
    1
  ) * 1.3;

  return (
    <div className="bg-[#060010] border border-white/10 rounded-2xl p-5 relative overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs text-gray-400">دریافتنی</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="text-xs text-gray-400">پرداختنی</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-blue-400" />
          <h4 className="text-sm font-bold text-white">چک‌های آتی (۶ ماه آینده)</h4>
        </div>
      </div>
      
      {/* SVG Based Chart */}
      <div className="relative h-[200px]">
        <svg width="100%" height="100%" viewBox="0 0 600 200" preserveAspectRatio="xMidYMid meet">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
            <line
              key={i}
              x1="0"
              y1={170 - t * 140}
              x2="600"
              y2={170 - t * 140}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />
          ))}
          
          {/* Bar groups */}
          {receivableData.map((item, idx) => {
            const groupWidth = 80;
            const barWidth = 30;
            const gap = (600 - groupWidth * 6) / 7;
            const groupX = gap + idx * (groupWidth + gap);
            
            const receivableHeight = maxVal > 0 ? (item.amount / maxVal) * 140 : 0;
            const payableHeight = maxVal > 0 ? (payableData[idx]?.amount || 0) / maxVal * 140 : 0;
            
            const isHovered = hoveredIndex === idx;
            
            return (
              <g
                key={item.month}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Receivable bar */}
                <motion.rect
                  x={groupX}
                  width={barWidth}
                  rx={4}
                  initial={{ height: 0, y: 170 }}
                  animate={{ 
                    height: Math.max(receivableHeight, 2),
                    y: 170 - Math.max(receivableHeight, 2),
                  }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  fill={isHovered ? '#22c55e' : 'rgba(34, 197, 94, 0.5)'}
                />
                
                {/* Payable bar */}
                <motion.rect
                  x={groupX + barWidth + 5}
                  width={barWidth}
                  rx={4}
                  initial={{ height: 0, y: 170 }}
                  animate={{ 
                    height: Math.max(payableHeight, 2),
                    y: 170 - Math.max(payableHeight, 2),
                  }}
                  transition={{ duration: 0.6, delay: idx * 0.1 + 0.05 }}
                  fill={isHovered ? '#f43f5e' : 'rgba(244, 63, 94, 0.5)'}
                />
                
                {/* Month label */}
                <text
                  x={groupX + groupWidth / 2}
                  y={190}
                  textAnchor="middle"
                  fill={isHovered ? '#fff' : '#666'}
                  fontSize="12"
                  fontWeight={isHovered ? 'bold' : 'normal'}
                >
                  {item.month}
                </text>
              </g>
            );
          })}
        </svg>
        
        {/* Tooltip */}
        <AnimatePresence>
          {hoveredIndex !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-0 left-1/2 -translate-x-1/2 bg-black/95 backdrop-blur border border-white/20 px-4 py-3 rounded-xl z-20"
            >
              <div className="font-bold text-white mb-2 border-b border-white/10 pb-2 text-center">
                {receivableData[hoveredIndex]?.month}
              </div>
              <div className="flex justify-between items-center gap-4 mb-1">
                <span className="text-green-400 font-mono text-sm">
                  {formatMoney(receivableData[hoveredIndex]?.amount || 0)}
                </span>
                <span className="text-xs text-gray-400">دریافتنی:</span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <span className="text-rose-400 font-mono text-sm">
                  {formatMoney(payableData[hoveredIndex]?.amount || 0)}
                </span>
                <span className="text-xs text-gray-400">پرداختنی:</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10">
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-green-400" />
            <span className="text-green-400 text-xs">مجموع دریافتنی آتی</span>
          </div>
          <span className="text-xl font-bold text-white">
            {formatMoney(receivableData.reduce((sum, d) => sum + d.amount, 0))}
          </span>
        </div>
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown size={16} className="text-rose-400" />
            <span className="text-rose-400 text-xs">مجموع پرداختنی آتی</span>
          </div>
          <span className="text-xl font-bold text-white">
            {formatMoney(payableData.reduce((sum, d) => sum + d.amount, 0))}
          </span>
        </div>
      </div>
    </div>
  );
};

// Check Section Component with Filters
const CheckSection = ({ type, rawChecks, color }) => {
  const [filters, setFilters] = useState({
    status: null,
    month: null,
    customerId: null,
    customerName: null,
  });
  
  const data = useMemo(() => aggregateData(rawChecks, filters), [rawChecks, filters]);
  
  const handleStatusClick = useCallback((statusId) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status === statusId ? null : statusId,
    }));
  }, []);
  
  const handleMonthClick = useCallback((monthIndex) => {
    setFilters(prev => ({
      ...prev,
      month: prev.month === monthIndex ? null : monthIndex,
    }));
  }, []);
  
  const handleCustomerClick = useCallback((customerId, customerName) => {
    setFilters(prev => ({
      ...prev,
      customerId: prev.customerId === customerId ? null : customerId,
      customerName: prev.customerId === customerId ? null : customerName,
    }));
  }, []);
  
  const clearFilter = useCallback((filterType) => {
    setFilters(prev => ({ ...prev, [filterType]: null, ...(filterType === 'customerId' ? { customerName: null } : {}) }));
  }, []);
  
  const clearAllFilters = useCallback(() => {
    setFilters({ status: null, month: null, customerId: null, customerName: null });
  }, []);
  
  const Icon = type === "receivable" ? TrendingUp : TrendingDown;
  const title = type === "receivable" ? "چک‌های دریافتنی" : "چک‌های پرداختنی";
  const iconBgClass = type === "receivable" ? "bg-green-500/15" : "bg-rose-500/15";
  const iconColorClass = type === "receivable" ? "text-green-400" : "text-rose-400";
  
  // Calculate trend (mock)
  const trend = type === "receivable" ? 12.5 : -5.2;
  
  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl ${iconBgClass}`}>
          <Icon className={iconColorClass} size={20} />
        </div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      
      {/* Active Filters */}
      <AnimatePresence>
        <ActiveFiltersBar 
          filters={filters} 
          onClearFilter={clearFilter} 
          onClearAll={clearAllFilters}
          type={type}
        />
      </AnimatePresence>
      
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
          trend={trend}
        />
      </div>
      
      {/* Status Distribution */}
      <StatusDonutChart 
        data={data.statusDistribution} 
        type={type}
        activeStatus={filters.status}
        onStatusClick={handleStatusClick}
      />
      
      {/* Monthly Trend */}
      <MonthlyBarChart
        data={data.monthlyData}
        color={color}
        title={`روند ماهانه`}
        activeMonth={filters.month}
        onMonthClick={handleMonthClick}
      />
      
      {/* Collection Period by Month */}
      <CollectionPeriodChart
        data={data.periodByMonth}
        color={color}
        title={`میانگین دوره ${type === "receivable" ? "وصول" : "پرداخت"}`}
      />
      
      {/* Customer/Vendor Table */}
      <CustomerTable 
        data={data.customers} 
        type={type} 
        color={color}
        activeCustomerId={filters.customerId}
        onCustomerClick={handleCustomerClick}
      />
    </div>
  );
};

// Main Component
const ChecksContent = ({ companyId = 1, color = "132, 0, 255" }) => {
  const receivableChecks = useMemo(() => generateChecksData("receivable", companyId), [companyId]);
  const payableChecks = useMemo(() => generateChecksData("payable", companyId), [companyId]);
  
  // Get future checks data (unfiltered)
  const receivableFuture = useMemo(() => {
    return persianMonths.slice(0, 6).map((month, idx) => {
      const monthChecks = receivableChecks.filter(c => c.monthIndex === idx && c.status === 'future');
      return {
        month,
        count: monthChecks.length,
        amount: monthChecks.reduce((sum, c) => sum + c.amount, 0),
      };
    });
  }, [receivableChecks]);
  
  const payableFuture = useMemo(() => {
    return persianMonths.slice(0, 6).map((month, idx) => {
      const monthChecks = payableChecks.filter(c => c.monthIndex === idx && c.status === 'future');
      return {
        month,
        count: monthChecks.length,
        amount: monthChecks.reduce((sum, c) => sum + c.amount, 0),
      };
    });
  }, [payableChecks]);

  return (
    <FadeContent blur={true} duration={600}>
      <div className="w-full pb-12 space-y-6" dir="rtl">
        {/* Page Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10">
            <FileText size={24} className="text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">مدیریت چک‌ها</h2>
            <p className="text-gray-500 text-xs">روی هر بخش کلیک کنید تا فیلتر شود</p>
          </div>
        </div>
        
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Right: Receivable Checks */}
          <CheckSection
            type="receivable"
            rawChecks={receivableChecks}
            color="#22c55e"
          />
          
          {/* Left: Payable Checks */}
          <CheckSection
            type="payable"
            rawChecks={payableChecks}
            color="#f43f5e"
          />
        </div>
        
        {/* Bottom: Future Checks Chart */}
        <div className="mt-6">
          <FutureChecksChart
            receivableData={receivableFuture}
            payableData={payableFuture}
          />
        </div>
      </div>
    </FadeContent>
  );
};

export default ChecksContent;

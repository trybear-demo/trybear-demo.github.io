import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Helper to generate random product data
const generateProductData = (companyId, dateRange, mode) => {
  const seed = (s) => {
    return function () {
      s = Math.sin(s) * 10000;
      return s - Math.floor(s);
    };
  };

  // Include dateRange in seed to change data on date change
  // Simple hash of date strings
  const dateHash =
    (dateRange?.from?.length || 0) +
    (dateRange?.to?.length || 0) +
    (dateRange?.from?.charCodeAt(5) || 0);
  const random = seed(companyId * 500 + dateHash);

  const productNames = [
    "شیر کم‌چرب",
    "پنیر فتا",
    "ماست سون",
    "کره حیوانی",
    "خامه عسلی",
    "دوغ نعنا",
    "شیرکاکائو",
    "بستنی وانیلی",
    "پنیر پیتزا",
    "ماست هم‌زده",
  ];

  // Pick 7 to 10 products
  const count = 7 + Math.floor(random() * 4); // 7-10
  const items = [];
  let total = 0;

  // Assuming average price roughly varies per product to distinguish quantity vs amount distribution
  // For simplicity, we just randomize values again if mode is quantity, but keep names consistent-ish

  const modeSeedOffset = mode === "quantity" ? 1000 : 0;
  const modeRandom = seed(companyId * 500 + dateHash + modeSeedOffset);

  for (let i = 0; i < count; i++) {
    // In real app, quantity would be amount / price. Here we just mock differently
    const baseValue = Math.floor(modeRandom() * 100) + 10;

    total += baseValue;
    items.push({
      id: i,
      name:
        productNames[i % productNames.length] +
        " " +
        (Math.floor(random() * 10) + 1),
      value: baseValue,
      color: "", // will fill later
    });
  }

  // Calculate percentages and angles
  let startAngle = 0;
  return items
    .map((item) => {
      const percent = item.value / total;
      const angle = percent * 360;
      const res = {
        ...item,
        percent: (percent * 100).toFixed(1),
        startAngle,
        endAngle: startAngle + angle,
      };
      startAngle += angle;
      return res;
    })
    .sort((a, b) => b.value - a.value); // Sort for better visuals
};

// SVG Arc Generator
const getCoordinatesForPercent = (percent) => {
  const x = Math.cos(2 * Math.PI * percent);
  const y = Math.sin(2 * Math.PI * percent);
  return [x, y];
};

const ProductDistributionChart = ({
  companyId,
  color = "59, 130, 246",
  dateRange,
  mode = "amount",
}) => {
  const [hoveredSlice, setHoveredSlice] = useState(null);

  // Update data when companyId or dateRange or mode changes
  const data = useMemo(
    () => generateProductData(companyId, dateRange, mode),
    [companyId, dateRange, mode]
  );

  // Generate colors based on the main company color but with variations
  // Simple palette generator or usage of HSL
  const getColors = (baseColorRGB, count) => {
    // Parse RGB "255, 100, 0"
    const [r, g, b] = baseColorRGB.split(",").map((n) => parseInt(n.trim()));

    // Generate variations
    return Array.from({ length: count }, (_, i) => {
      // Shift Hue slightly or change lightness/opacity
      // Let's try changing opacity/lightness for a monochromatic feel or complementary
      const opacity = 1 - i * 0.08;
      return `rgba(${r}, ${g}, ${b}, ${Math.max(0.2, opacity)})`;
    });
  };

  const colors = useMemo(
    () => getColors(color, data.length),
    [color, data.length]
  );

  // Path calculation
  const radius = 100;
  const holeRadius = 65; // For Donut

  const getSlicePath = (startAngle, endAngle) => {
    const start = (startAngle - 90) * (Math.PI / 180);
    const end = (endAngle - 90) * (Math.PI / 180);

    const x1 = radius * Math.cos(start);
    const y1 = radius * Math.sin(start);
    const x2 = radius * Math.cos(end);
    const y2 = radius * Math.sin(end);

    const x3 = holeRadius * Math.cos(end);
    const y3 = holeRadius * Math.sin(end);
    const x4 = holeRadius * Math.cos(start);
    const y4 = holeRadius * Math.sin(start);

    // Large arc flag
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `
          M ${x1} ${y1}
          A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
          L ${x3} ${y3}
          A ${holeRadius} ${holeRadius} 0 ${largeArc} 0 ${x4} ${y4}
          Z
      `;
  };

  const mainColor = `rgb(${color})`;

  return (
    <div
      className="w-full h-[400px] bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden flex flex-col"
      dir="rtl"
    >
      <div className="flex justify-between items-center mb-2 z-10">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span
            className="w-1 h-6 rounded-full"
            style={{ backgroundColor: mainColor }}
          />
          توزیع کالا ({mode === "amount" ? "مبلغی" : "تعدادی"})
        </h3>
      </div>

      <div className="relative flex-grow flex items-center justify-center">
        <svg
          viewBox="-110 -110 220 220"
          className="w-full h-full max-w-[300px] overflow-visible"
        >
          {data.map((slice, i) => (
            <motion.path
              key={slice.id}
              d={getSlicePath(slice.startAngle, slice.endAngle)}
              fill={colors[i]}
              stroke="rgba(0,0,0,0.2)"
              strokeWidth="1"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: hoveredSlice && hoveredSlice.id === slice.id ? 1.1 : 1,
                opacity: hoveredSlice && hoveredSlice.id !== slice.id ? 0.5 : 1,
              }}
              transition={{ duration: 0.3 }}
              onMouseEnter={() => setHoveredSlice(slice)}
              onMouseLeave={() => setHoveredSlice(null)}
              className="cursor-pointer"
              style={{ transformOrigin: "0 0" }}
            />
          ))}

          {/* Center Text */}
          <g pointerEvents="none">
            <text
              x="0"
              y="-10"
              textAnchor="middle"
              fill="white"
              fontSize="28"
              fontWeight="bold"
              style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
            >
              {hoveredSlice ? `${hoveredSlice.percent}%` : data.length}
            </text>
            <text
              x="0"
              y="20"
              textAnchor="middle"
              fill="white"
              fontSize="12"
              fontWeight="bold"
              opacity="0.9"
            >
              {hoveredSlice ? hoveredSlice.name : "محصول فعال"}
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default ProductDistributionChart;

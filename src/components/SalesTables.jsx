import React, { useMemo, useState, useCallback } from "react";
import {
  User,
  Briefcase,
  Box,
  FileText,
  ChevronUp,
  ChevronDown,
  X,
  Filter,
  Download,
  Search,
} from "lucide-react";
import FadeContent from "./FadeContent";
import { motion, AnimatePresence } from "framer-motion";

// Enhanced Table Component with Sort, Filter, and Dynamic Total
const SalesDetailTable = ({ data, color = "255, 255, 255" }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filters, setFilters] = useState({});
  const [activeFilterColumn, setActiveFilterColumn] = useState(null);

  const columns = [
    { key: "invoiceNumber", label: "شماره فاکتور", sortable: true, filterable: true },
    { key: "date", label: "تاریخ", sortable: true, filterable: true },
    { key: "customer", label: "مشتری", sortable: true, filterable: true },
    { key: "productName", label: "نام کالا", sortable: true, filterable: true },
    { key: "quantity", label: "تعداد", sortable: true, filterable: true, isNumeric: true },
    { key: "unit", label: "واحد کالا", sortable: true, filterable: true },
    { key: "amount", label: "مبلغ", sortable: true, filterable: true, isNumeric: true },
    { key: "seller", label: "فروشنده", sortable: true, filterable: true },
    { key: "saleType", label: "فروش / برگشتی", sortable: true, filterable: true },
    { key: "status", label: "وضعیت", sortable: true, filterable: true },
  ];

  // Get unique values for filter dropdowns
  const getUniqueValues = useCallback((key) => {
    const values = [...new Set(data.map((item) => item[key]))];
    return values.sort();
  }, [data]);

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      if (value === "" || value === null) {
        const newFilters = { ...prev };
        delete newFilters[key];
        return newFilters;
      }
      return { ...prev, [key]: value };
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({});
    setActiveFilterColumn(null);
  };

  // Filtered and sorted data
  const processedData = useMemo(() => {
    let result = [...data];

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter((item) => {
          const itemValue = String(item[key]).toLowerCase();
          return itemValue.includes(String(value).toLowerCase());
        });
      }
    });

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        // Handle numeric values
        const column = columns.find((c) => c.key === sortConfig.key);
        if (column?.isNumeric) {
          const aNum = typeof aVal === "number" ? aVal : parseFloat(String(aVal).replace(/[^0-9.-]/g, "")) || 0;
          const bNum = typeof bVal === "number" ? bVal : parseFloat(String(bVal).replace(/[^0-9.-]/g, "")) || 0;
          return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
        }

        // Handle string values
        const aStr = String(aVal || "");
        const bStr = String(bVal || "");
        return sortConfig.direction === "asc"
          ? aStr.localeCompare(bStr, "fa")
          : bStr.localeCompare(aStr, "fa");
      });
    }

    return result;
  }, [data, filters, sortConfig, columns]);

  // Calculate totals
  const totals = useMemo(() => {
    const totalQuantity = processedData.reduce((sum, item) => {
      const qty = typeof item.quantity === "number" ? item.quantity : parseFloat(String(item.quantity).replace(/[^0-9.-]/g, "")) || 0;
      return sum + qty;
    }, 0);

    const totalAmount = processedData.reduce((sum, item) => {
      const amt = typeof item.amount === "number" ? item.amount : parseFloat(String(item.amount).replace(/[^0-9.-]/g, "")) || 0;
      return sum + amt;
    }, 0);

    return { totalQuantity, totalAmount };
  }, [processedData]);

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div
      className="w-full bg-[#060010] border border-white/10 rounded-3xl p-6 relative overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group/card min-h-[500px]"
      style={{ "--glow-color": color }}
    >
      {/* Border Glow Effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(${color}, 0.15), transparent 40%)`,
          zIndex: 0,
        }}
      />

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/5 border border-white/10">
            <FileText size={20} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-white">جزئیات سطر فاکتور</h3>
        </div>
        <div className="flex gap-2 items-center">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30 transition-colors"
            >
              <X size={14} />
              پاک کردن فیلترها
            </button>
          )}
          <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 transition-colors">
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Active Filters Display */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="relative z-10 flex flex-wrap gap-2 mb-4"
          >
            {Object.entries(filters).map(([key, value]) => {
              const column = columns.find((c) => c.key === key);
              return (
                <div
                  key={key}
                  className="flex items-center gap-1 px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-400 text-sm"
                >
                  <span>{column?.label}: {value}</span>
                  <button
                    onClick={() => handleFilterChange(key, null)}
                    className="hover:bg-purple-500/30 rounded-full p-0.5 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table Content */}
      <div className="relative z-10 flex-grow overflow-auto custom-scrollbar">
        <table className="w-full text-right border-collapse min-w-max">
          <thead className="sticky top-0 bg-[#060010] z-20">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="pb-4 pt-2 px-4 text-gray-500 font-medium text-sm border-b border-white/10 whitespace-nowrap relative"
                >
                  <div className="flex items-center gap-2 justify-end">
                    {/* Filter Button */}
                    {col.filterable && (
                      <div className="relative">
                        <button
                          onClick={() => setActiveFilterColumn(activeFilterColumn === col.key ? null : col.key)}
                          className={`p-1 rounded hover:bg-white/10 transition-colors ${
                            filters[col.key] ? "text-purple-400" : "text-gray-500"
                          }`}
                        >
                          <Filter size={12} />
                        </button>

                        {/* Filter Dropdown */}
                        <AnimatePresence>
                          {activeFilterColumn === col.key && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute top-full right-0 mt-2 w-48 bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-xl z-50"
                            >
                              <div className="p-2">
                                <div className="relative">
                                  <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                  <input
                                    type="text"
                                    placeholder="جستجو..."
                                    value={filters[col.key] || ""}
                                    onChange={(e) => handleFilterChange(col.key, e.target.value)}
                                    className="w-full pr-9 pl-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500/50"
                                  />
                                </div>
                              </div>
                              <div className="max-h-48 overflow-auto border-t border-white/10">
                                {getUniqueValues(col.key).slice(0, 10).map((value, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => {
                                      handleFilterChange(col.key, value);
                                      setActiveFilterColumn(null);
                                    }}
                                    className="w-full text-right px-4 py-2 text-sm text-gray-300 hover:bg-purple-500/10 hover:text-purple-400 transition-colors"
                                  >
                                    {value}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* Column Label with Sort */}
                    <button
                      onClick={() => col.sortable && handleSort(col.key)}
                      className={`flex items-center gap-1 transition-colors ${
                        col.sortable ? "cursor-pointer hover:text-white" : ""
                      }`}
                    >
                      <span>{col.label}</span>
                      {col.sortable && (
                        <div className="flex flex-col">
                          <ChevronUp
                            size={10}
                            className={`-mb-1 ${
                              sortConfig.key === col.key && sortConfig.direction === "asc"
                                ? "text-purple-400"
                                : "text-gray-600"
                            }`}
                          />
                          <ChevronDown
                            size={10}
                            className={`-mt-1 ${
                              sortConfig.key === col.key && sortConfig.direction === "desc"
                                ? "text-purple-400"
                                : "text-gray-600"
                            }`}
                          />
                        </div>
                      )}
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm text-gray-300">
            {processedData.map((row, idx) => (
              <motion.tr
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.01 }}
                className="group hover:bg-white/5 transition-colors border-b border-white/5"
              >
                {columns.map((col) => {
                  const cellValue = row[col.key];
                  const isStatus = col.key === "status";
                  const isSaleType = col.key === "saleType";

                  return (
                    <td key={col.key} className="py-4 px-4 whitespace-nowrap">
                      {isStatus ? (
                        <span
                          className={`px-2 py-1 rounded-lg text-xs font-medium ${
                            cellValue === "پرداخت شده" || cellValue === "تایید شده"
                              ? "bg-green-500/20 text-green-400"
                              : cellValue === "معوق" || cellValue === "لغو شده"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {cellValue}
                        </span>
                      ) : isSaleType ? (
                        <span
                          className={`px-2 py-1 rounded-lg text-xs font-medium ${
                            cellValue === "فروش"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-orange-500/20 text-orange-400"
                          }`}
                        >
                          {cellValue}
                        </span>
                      ) : col.isNumeric ? (
                        <span className="font-mono">{typeof cellValue === "number" ? cellValue.toLocaleString("fa-IR") : cellValue}</span>
                      ) : (
                        cellValue
                      )}
                    </td>
                  );
                })}
              </motion.tr>
            ))}

            {/* Dynamic Total Row */}
            <motion.tr
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="sticky bottom-0 bg-gradient-to-t from-[#1a0a2e] to-[#0f0520] font-bold text-white border-t-2 border-purple-500/50"
            >
              <td className="py-4 px-4 whitespace-nowrap" colSpan={4}>
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-purple-400">جمع کل</span>
                  <span className="text-gray-400 text-sm">({processedData.length} ردیف)</span>
                </div>
              </td>
              <td className="py-4 px-4 whitespace-nowrap">
                <span className="font-mono bg-purple-500/20 px-3 py-1 rounded-lg text-purple-300">
                  {totals.totalQuantity.toLocaleString("fa-IR")}
                </span>
              </td>
              <td className="py-4 px-4 whitespace-nowrap"></td>
              <td className="py-4 px-4 whitespace-nowrap">
                <span className="font-mono bg-green-500/20 px-3 py-1 rounded-lg text-green-300">
                  {totals.totalAmount.toLocaleString("fa-IR")} ریال
                </span>
              </td>
              <td className="py-4 px-4" colSpan={3}></td>
            </motion.tr>
          </tbody>
        </table>
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

// Simple TableWrapper for other tabs (unchanged)
const TableWrapper = ({ title, icon: Icon, columns, data, color = "255, 255, 255" }) => {
  return (
    <div
      className="w-full bg-[#060010] border border-white/10 rounded-3xl p-6 relative overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group/card h-[600px]"
      style={{ "--glow-color": color }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(${color}, 0.15), transparent 40%)`,
          zIndex: 0,
        }}
      />

      <div className="relative z-10 flex flex-col h-full">
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
              {data.map((row, idx) => {
                const rowValues = Object.values(row);
                return (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className={`group hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 ${
                      row.isTotal ? "font-bold text-white bg-white/5" : ""
                    }`}
                  >
                    {rowValues.map((cellValue, cIdx) => {
                      const isStatus = cellValue === "پرداخت شده" || cellValue === "معوق";
                      return (
                        <td key={cIdx} className="py-4 px-4 whitespace-nowrap">
                          {isStatus ? (
                            <span
                              className={`px-2 py-1 rounded-lg text-xs font-medium ${
                                cellValue === "پرداخت شده"
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {cellValue}
                            </span>
                          ) : (
                            cellValue
                          )}
                        </td>
                      );
                    })}
                  </motion.tr>
                );
              })}
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

const SalesTables = ({ companyId, color, dateRange }) => {
  const [activeTab, setActiveTab] = useState("invoices");

  // Generate data based on companyId and dateRange
  const generateData = useMemo(() => {
    const dateSeed = (dateRange?.from?.charCodeAt(6) || 0) + (companyId * 100);

    const seed = (s) => {
      return function () {
        s = Math.sin(s) * 10000;
        return s - Math.floor(s);
      };
    };
    const random = seed(dateSeed);

    const sellersNames = [
      "علی محمدی", "رضا رضایی", "سارا کریمی", "حسین حسینی", "مریم احمدی",
      "محمد عباسی", "فاطمه رحیمی", "امیر اکبری", "زهرا موسوی", "نیما صادقی"
    ];
    const customersNames = [
      "فروشگاه کوروش", "هایپراستار", "سوپرمارکت برادران", "فروشگاه رفاه", "پخش عقاب",
      "سوپرمارکت آنلاین", "فروشگاه شهروند", "پخش مواد غذایی البرز", "مینی مارکت آریا", "کافه رستوران بام"
    ];
    const productNames = [
      "شیر کم‌چرب", "پنیر فتا", "ماست سون", "کره حیوانی", "خامه عسلی",
      "دوغ نعنا", "شیرکاکائو", "بستنی وانیلی", "پنیر پیتزا", "ماست هم‌زده"
    ];
    const units = ["عدد", "کیلوگرم", "بسته", "لیتر", "جعبه", "کارتن"];
    const statuses = ["پرداخت شده", "معوق", "در انتظار", "تایید شده"];
    const saleTypes = ["فروش", "برگشتی"];

    const months = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];

    // 1. Invoice Line Details - New structure
    const invoicesCount = 30 + Math.floor(random() * 25);
    const invoiceDetails = Array.from({ length: invoicesCount }).map((_, i) => {
      const month = Math.floor(random() * 12) + 1;
      const day = Math.floor(random() * 29) + 1;
      const mStr = month < 10 ? `0${month}` : month;
      const dStr = day < 10 ? `0${day}` : day;
      const quantity = Math.floor(random() * 100) + 1;
      const unitPrice = Math.floor(random() * 500000) + 10000;
      const isSale = random() > 0.15;

      return {
        invoiceNumber: `INV-${2000 + i + (companyId * 100)}`,
        date: `1404/${mStr}/${dStr}`,
        customer: customersNames[Math.floor(random() * customersNames.length)],
        productName: productNames[Math.floor(random() * productNames.length)],
        quantity: quantity,
        unit: units[Math.floor(random() * units.length)],
        amount: quantity * unitPrice,
        seller: sellersNames[Math.floor(random() * sellersNames.length)],
        saleType: isSale ? "فروش" : "برگشتی",
        status: statuses[Math.floor(random() * statuses.length)],
      };
    }).sort((a, b) => b.date.localeCompare(a.date));

    // 2. Sales by Product (Monthly)
    const productSales = productNames.map((prod) => {
      const row = { product: prod };
      let total = 0;
      months.forEach((m) => {
        const val = Math.floor(random() * 1500);
        row[m] = val === 0 ? "-" : val.toLocaleString();
        total += val;
      });
      row.total = total.toLocaleString();
      return row;
    });

    // 3. Sales by Customer (Monthly)
    const customerSales = customersNames.map((cust) => {
      const row = { customer: cust };
      let total = 0;
      months.forEach((m) => {
        const val = Math.floor(random() * 3000);
        row[m] = val === 0 ? "-" : val.toLocaleString();
        total += val;
      });
      row.total = total.toLocaleString();
      return row;
    });

    // 4. Sales by Seller (Monthly)
    const sellerSales = sellersNames.map((sel) => {
      const row = { seller: sel };
      let total = 0;
      months.forEach((m) => {
        const val = Math.floor(random() * 2500);
        row[m] = val === 0 ? "-" : val.toLocaleString();
        total += val;
      });
      row.total = total.toLocaleString();
      return row;
    });

    return { invoiceDetails, productSales, customerSales, sellerSales };
  }, [companyId, dateRange]);

  const tabs = [
    { id: "invoices", label: "جزئیات سطر فاکتور", icon: FileText },
    { id: "products", label: "تفکیک کالا", icon: Box },
    { id: "customers", label: "تفکیک مشتری", icon: User },
    { id: "sellers", label: "تفکیک فروشنده", icon: Briefcase },
  ];

  const renderContent = () => {
    const monthCols = [
      "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
      "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند", "جمع کل"
    ];

    switch (activeTab) {
      case "invoices":
        return (
          <SalesDetailTable
            data={generateData.invoiceDetails}
            color={color}
          />
        );
      case "products":
        return (
          <TableWrapper
            title="فروش به تفکیک کالا"
            icon={Box}
            columns={["نام کالا", ...monthCols]}
            data={generateData.productSales}
            color={color}
          />
        );
      case "customers":
        return (
          <TableWrapper
            title="فروش به تفکیک مشتری"
            icon={User}
            columns={["نام مشتری", ...monthCols]}
            data={generateData.customerSales}
            color={color}
          />
        );
      case "sellers":
        return (
          <TableWrapper
            title="فروش به تفکیک فروشنده"
            icon={Briefcase}
            columns={["نام فروشنده", ...monthCols]}
            data={generateData.sellerSales}
            color={color}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-4 p-1 bg-white/5 rounded-2xl w-fit mx-auto border border-white/10">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "bg-white text-black shadow-lg scale-105"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <FadeContent key={activeTab} blur={true} duration={400}>
        {renderContent()}
      </FadeContent>
    </div>
  );
};

export default SalesTables;

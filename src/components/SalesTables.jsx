import React, { useMemo, useState } from "react";
import {
  User,
  Briefcase,
  Box,
  FileText,
} from "lucide-react";
import FadeContent from "./FadeContent";
import TableWrapper from "./TableWrapper";

const SalesTables = ({ companyId, color, dateRange }) => {
  const [activeTab, setActiveTab] = useState("invoices");

  // Generate data based on companyId and dateRange to simulate filtering
  const generateData = useMemo(() => {
    // Seeds for random generation based on filters
    const dateSeed = (dateRange?.from?.charCodeAt(6) || 0) + (companyId * 100);
    
    // Seeded random function
    const seed = (s) => {
        return function() {
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

    const months = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
    
    // Filter months based on some logic if needed, for now showing all or subset
    // Let's assume dateRange affects the months shown or the values
    
    // 1. Invoice Details - Extended Data
    const invoicesCount = 25 + Math.floor(random() * 20);
    const invoices = Array.from({ length: invoicesCount }).map((_, i) => {
        const month = Math.floor(random() * 12) + 1;
        const day = Math.floor(random() * 29) + 1;
        const mStr = month < 10 ? `0${month}` : month;
        const dStr = day < 10 ? `0${day}` : day;
        
        return {
            date: `1404/${mStr}/${dStr}`,
            id: `#INV-${2000 + i + (companyId * 100)}`,
            customer: customersNames[Math.floor(random() * customersNames.length)],
            seller: sellersNames[Math.floor(random() * sellersNames.length)],
            amount: (Math.floor(random() * 8000) + 200).toLocaleString() + " م.ر",
            status: random() > 0.15 ? "پرداخت شده" : "معوق",
        };
    }).sort((a, b) => b.date.localeCompare(a.date));

    // 2. Sales by Product (Monthly) - Extended
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

    // 3. Sales by Customer (Monthly) - Extended
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

    // 4. Sales by Seller (Monthly) - Extended
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

    return { invoices, productSales, customerSales, sellerSales };
  }, [companyId, dateRange]);

  const tabs = [
    { id: "invoices", label: "جزئیات فاکتور", icon: FileText },
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
          <TableWrapper
            title="جزئیات فاکتور فروش"
            icon={FileText}
            columns={[
              "تاریخ",
              "شماره فاکتور",
              "مشتری",
              "فروشنده",
              "مبلغ",
              "وضعیت",
            ]}
            data={generateData.invoices}
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

import React, { useEffect, useState, useRef, useContext } from "react";
import { useCursor } from "../context/CursorContext";
import { LanguageContext } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  LogOut,
  LayoutDashboard,
  Bot,
  LineChart,
  Lock,
  Bell,
  Settings,
  ChevronLeft,
  ArrowUpRight,
  CreditCard,
  Eye,
} from "lucide-react";
import Magnet from "./Magnet";
import BlurText from "./BlurText";
import LanguageToggle from "./LanguageToggle";
import FadeContent from "./FadeContent";

const Dashboard = () => {
  const { setCursorVariant } = useCursor();
  const { t, language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // Mock Data with 3 Specific Products
  // In a real app, descriptions would come from translation keys
  const userData = {
    name: "علیرضا شاه‌محمدی",
    balance: "۱۲,۵۰۰,۰۰۰",
    currency: "تومان",
    avatar: "A",
    products: [
      {
        id: 1,
        nameKey: "product_1_title",
        descKey: "product_1_desc",
        active: true,
        icon: <LayoutDashboard size={32} />,
        gradient: "from-blue-500 to-cyan-400",
      },
      {
        id: 2,
        nameKey: "product_2_title",
        descKey: "product_2_desc",
        active: false,
        icon: <Bot size={32} />,
        gradient: "from-purple-500 to-pink-500",
      },
      {
        id: 3,
        nameKey: "product_3_title",
        descKey: "product_3_desc",
        active: false,
        icon: <LineChart size={32} />,
        gradient: "from-orange-500 to-red-500",
      },
    ],
  };

  // Date & Time State
  const [dateTime, setDateTime] = useState({ time: "", date: "" });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      // Configure based on selected language
      const locale = language === "fa" ? "fa-IR" : "en-US";
      const calendar = language === "fa" ? "persian" : "gregory";

      const timeOptions = {
        timeZone: "Asia/Tehran",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };
      const time = new Intl.DateTimeFormat(locale, timeOptions).format(now);

      const dateOptions = {
        timeZone: "Asia/Tehran",
        weekday: "long",
        day: "numeric",
        month: "long",
        calendar: calendar,
      };
      // Use the u-ca extension for calendar support
      const finalLocale = language === "fa" ? "fa-IR-u-ca-persian" : "en-US";
      const date = new Intl.DateTimeFormat(finalLocale, dateOptions).format(
        now
      );

      setDateTime({ time, date });
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, [language]);

  const handleLogout = () => setShowLogoutConfirm(true);

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    navigate("/login");
  };

  const cancelLogout = () => setShowLogoutConfirm(false);

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 relative overflow-x-hidden transition-all duration-500"
      dir={language === "fa" ? "rtl" : "ltr"}
    >
      {/* Ambient Background Removed for Pure Black */}
      {/* <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px]" />
      </div> */}

      {/* Language Toggle - Reusing the component but positioning it absolutely in header or fixed */}
      <div className="fixed top-4 left-4 z-[60]">
        {/* We can use the existing LanguageToggle or a custom one. 
              Since LanguageToggle has fixed positioning, let's use it but might need adjustments.
              The prompt asked to ADD it.
           */}
        <LanguageToggle visible={true} />
      </div>

      {/* Modern Header */}
      <header className="dash-header sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 mb-8">
        <FadeContent
          blur={true}
          duration={1000}
          easing="ease-out"
          initialOpacity={0}
          className="max-w-7xl mx-auto flex justify-between items-center"
        >
          {/* User Profile (End aligned based on direction) */}
          <div className="flex items-center gap-4 order-2 md:order-none">
            {/* In RTL: Right side. In LTR: Left side if we follow flow, but usually profile is on far end.
                 Let's keep consistent layout: Profile on 'Start' or 'End'?
                 Standard dashboard: Profile is usually at the END (Top Right in LTR, Top Left in RTL).
                 BUT the previous design had it on Right (Start in RTL).
                 Let's make it responsive to direction.
             */}
            <div className="flex items-center gap-4">
              <div className="relative group cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center text-lg font-bold shadow-lg group-hover:border-blue-500/50 transition-colors">
                  {userData.avatar}
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
              </div>
              <div
                className="hidden md:block text-start"
                onMouseEnter={() => setCursorVariant("text")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                <h1 className="font-bold text-lg leading-tight">
                  <BlurText
                    text={userData.name}
                    className="inline-block"
                    delay={200}
                    animateBy="words"
                  />
                </h1>
                <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  {language === "fa" ? "آنلاین" : "Online"}
                </p>
              </div>
            </div>
          </div>

          {/* Center: TryBear (Desktop) */}
          <div className="hidden lg:flex flex-col items-center absolute left-1/2 -translate-x-1/2">
            <div
              className="shiny-text text-3xl font-bold tracking-widest"
              style={{ animationDuration: "3s" }}
              onMouseEnter={() => setCursorVariant("text")}
              onMouseLeave={() => setCursorVariant("default")}
            >
              TryBear
            </div>
          </div>

          {/* Actions (Start aligned) */}
          <div className="flex items-center gap-3 order-1 md:order-none">
            <div className="hidden md:flex items-center gap-2 p-1 bg-white/5 rounded-full border border-white/5 mx-4">
              <div className="px-3 flex flex-col items-end justify-center border-r border-white/10 pr-4 mr-1">
                <span
                  className="font-mono text-sm font-bold text-white/90"
                  onMouseEnter={() => setCursorVariant("text")}
                  onMouseLeave={() => setCursorVariant("default")}
                >
                  {dateTime.time}
                </span>
                <span
                  className="text-[10px] text-gray-500"
                  onMouseEnter={() => setCursorVariant("text")}
                  onMouseLeave={() => setCursorVariant("default")}
                >
                  {dateTime.date}
                </span>
              </div>
              <button
                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all relative"
                onMouseEnter={() => setCursorVariant("button")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                <Bell size={18} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button
                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                onMouseEnter={() => setCursorVariant("button")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                <Settings size={18} />
              </button>
            </div>

            <Magnet padding={20} magnetStrength={3}>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 transition-all duration-300"
                onMouseEnter={() => setCursorVariant("button")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                <span className="text-sm font-medium hidden md:inline">
                  {language === "fa" ? "خروج" : "Logout"}
                </span>
                <LogOut
                  size={18}
                  className={language === "fa" ? "rotate-180" : ""}
                />
              </button>
            </Magnet>
          </div>
        </FadeContent>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-12 space-y-12">
        {/* Quick Stats Row */}
        <FadeContent
          blur={true}
          duration={1000}
          easing="ease-out"
          initialOpacity={0}
        >
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Wallet Card */}
            <div className="dash-stat col-span-1 md:col-span-3 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#111] to-black border border-white/10 p-8 group hover:border-blue-500/30 transition-all duration-500">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-blue-600/10 transition-all duration-700" />

              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                      <Wallet size={20} />
                    </div>
                    <span
                      className="text-sm font-medium uppercase tracking-wider text-white !text-white"
                      style={{ color: "white" }}
                      onMouseEnter={() => setCursorVariant("text")}
                      onMouseLeave={() => setCursorVariant("default")}
                    >
                      {language === "fa" ? "دارایی کل" : "Total Balance"}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span
                      className="text-5xl font-bold text-white !text-white tracking-tight"
                      style={{ color: "white" }}
                      onMouseEnter={() => setCursorVariant("text")}
                      onMouseLeave={() => setCursorVariant("default")}
                    >
                      <BlurText
                        text={userData.balance}
                        className="inline-block text-white !text-white"
                        delay={300}
                      />
                    </span>
                    <span
                      className="text-xl text-white !text-white font-light"
                      style={{ color: "white" }}
                    >
                      {userData.currency}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                  <button
                    className="flex-1 md:flex-none bg-white text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    onMouseEnter={() => setCursorVariant("button")}
                    onMouseLeave={() => setCursorVariant("default")}
                  >
                    <ArrowUpRight size={18} />
                    {language === "fa" ? "افزایش موجودی" : "Deposit"}
                  </button>
                  <button
                    className="px-4 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-white transition-colors"
                    onMouseEnter={() => setCursorVariant("button")}
                    onMouseLeave={() => setCursorVariant("default")}
                  >
                    <CreditCard size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Time Card (Mobile Only) */}
            <div className="dash-stat lg:hidden bg-[#111] border border-white/10 rounded-3xl p-6 flex flex-col justify-center items-center relative overflow-hidden">
              <div
                className="text-4xl font-mono font-bold text-blue-200 mb-2"
                onMouseEnter={() => setCursorVariant("text")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                {dateTime.time}
              </div>
              <div
                className="text-gray-500 text-sm"
                onMouseEnter={() => setCursorVariant("text")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                {dateTime.date}
              </div>
            </div>
          </section>
        </FadeContent>

        {/* Services Section */}
        <section>
          <FadeContent
            blur={true}
            duration={1000}
            easing="ease-out"
            initialOpacity={0}
            className="flex items-center justify-between mb-8 px-2"
          >
            <h2
              className="text-2xl font-bold flex items-center gap-3"
              onMouseEnter={() => setCursorVariant("text")}
              onMouseLeave={() => setCursorVariant("default")}
            >
              <span className="w-1 h-8 bg-blue-500 rounded-full" />
              <BlurText text={t("our_products")} className="inline-block" />
            </h2>
            <span className="text-sm text-gray-500">
              {language === "fa" ? "۳ سرویس موجود" : "3 Services Available"}
            </span>
          </FadeContent>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {userData.products.map((product, index) => (
              <FadeContent
                key={product.id}
                blur={true}
                duration={1000}
                delay={index * 200}
                easing="ease-out"
                initialOpacity={0}
                className="h-full"
              >
                <div
                  className={`product-card relative flex flex-col justify-between rounded-[2rem] p-1 transition-all duration-500 group
                  ${
                    product.active
                      ? "bg-gradient-to-b from-white/10 to-transparent"
                      : "grayscale opacity-70 hover:opacity-100 hover:grayscale-0"
                  }`}
                  onMouseEnter={() =>
                    setCursorVariant(product.active ? "card" : "default")
                  }
                  onMouseLeave={() => setCursorVariant("default")}
                >
                  {/* Inner Card Background */}
                  <div className="absolute inset-[1px] bg-[#0a0a0a] rounded-[1.9rem] -z-10" />

                  {/* Content */}
                  <div className="p-6 md:p-8 h-full flex flex-col">
                    {/* Icon Header */}
                    <div className="flex justify-between items-start mb-6">
                      <div
                        className={`p-4 rounded-2xl bg-gradient-to-br ${
                          product.gradient
                        } text-white shadow-lg transform ${
                          !product.active ? "group-hover:scale-110" : ""
                        } transition-transform duration-500`}
                      >
                        {product.icon}
                      </div>
                    </div>

                    <h3
                      className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors"
                      onMouseEnter={(e) => {
                        e.stopPropagation();
                        setCursorVariant("text");
                      }}
                      onMouseLeave={(e) => {
                        e.stopPropagation();
                        setCursorVariant("default");
                      }}
                    >
                      {t(product.nameKey)}
                    </h3>
                    <p
                      className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow"
                      onMouseEnter={(e) => {
                        e.stopPropagation();
                        setCursorVariant("text");
                      }}
                      onMouseLeave={(e) => {
                        e.stopPropagation();
                        setCursorVariant("default");
                      }}
                    >
                      {t(product.descKey)}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 mt-auto">
                      <button
                        disabled={!product.active}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click if any
                          if (product.active)
                            navigate(`/product/${product.id}`);
                        }}
                        className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300
                              ${
                                product.active
                                  ? "bg-white text-black hover:bg-blue-50 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                                  : "bg-white/5 text-gray-500 cursor-not-allowed border border-white/5"
                              }`}
                        onMouseEnter={(e) => {
                          e.stopPropagation();
                          setCursorVariant(
                            product.active ? "button" : "default"
                          );
                        }}
                        onMouseLeave={(e) => {
                          e.stopPropagation();
                          setCursorVariant("default");
                        }}
                      >
                        {product.active ? (
                          <>
                            {language === "fa"
                              ? "مشاهده محصول"
                              : "View Product"}
                            <ChevronLeft
                              size={18}
                              className={language === "fa" ? "" : "rotate-180"}
                            />
                          </>
                        ) : (
                          <>
                            {language === "fa" ? "خرید اشتراک" : "Purchase"}
                            <Lock size={16} className="opacity-50" />
                          </>
                        )}
                      </button>

                      <button
                        className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 border border-white/10 hover:bg-white/5 text-gray-300 hover:text-white"
                        onMouseEnter={(e) => {
                          e.stopPropagation();
                          setCursorVariant("button");
                        }}
                        onMouseLeave={(e) => {
                          e.stopPropagation();
                          setCursorVariant("default");
                        }}
                      >
                        {language === "fa" ? "مشاهده دمو" : "View Demo"}
                        <Eye size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </FadeContent>
            ))}
          </div>
        </section>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <FadeContent
            blur={true}
            duration={500}
            easing="ease-out"
            initialOpacity={0}
          >
            <div
              className="bg-[#111] border border-white/10 p-8 rounded-3xl max-w-sm w-full mx-4 text-center relative"
              dir={language === "fa" ? "rtl" : "ltr"}
            >
              <div className="mb-6 flex justify-center">
                <div className="p-4 rounded-full bg-red-500/10 text-red-500">
                  <LogOut
                    size={32}
                    className={language === "fa" ? "rotate-180" : ""}
                  />
                </div>
              </div>

              <h3
                className="text-xl font-bold mb-2 text-white"
                onMouseEnter={() => setCursorVariant("text")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                {language === "fa" ? "خروج از حساب" : "Sign Out"}
              </h3>

              <p
                className="text-gray-400 mb-8 text-sm leading-relaxed"
                onMouseEnter={() => setCursorVariant("text")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                {language === "fa"
                  ? "آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟"
                  : "Are you sure you want to sign out of your account?"}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={confirmLogout}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors"
                  onMouseEnter={() => setCursorVariant("button")}
                  onMouseLeave={() => setCursorVariant("default")}
                >
                  {language === "fa" ? "بله، خروج" : "Yes, Sign Out"}
                </button>
                <button
                  onClick={cancelLogout}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-colors"
                  onMouseEnter={() => setCursorVariant("button")}
                  onMouseLeave={() => setCursorVariant("default")}
                >
                  {language === "fa" ? "انصراف" : "Cancel"}
                </button>
              </div>
            </div>
          </FadeContent>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

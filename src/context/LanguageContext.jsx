import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
} from "react";

export const LanguageContext = createContext();

const translations = {
  en: {
    welcome_message: "Welcome to TryBear",
    description: "A modern React application with GSAP animations.",
    switch_lang: "Switch Language",
    menu_home: "Home",
    menu_products: "Products",
    menu_about_contact: "About & Contact",
    landing_title: "The Power of AI, in Your Hands",
    landing_subtitle:
      "We have transformed the complexities of technology into the simplest growth tools. Greater speed, higher precision, and intelligence in every dimension of your work.",
    scroll_hint: "Scroll",
    product_1_title: "Management Dashboard",
    product_1_category: "Business Intelligence",
    product_1_desc:
      "Analyze corporate data and provide actionable reports to executives with our comprehensive management dashboards.",
    product_1_long_desc:
      "Take the pulse of your business with our advanced management dashboards. Precise data analysis, interactive charts, and real-time reports help you make strategic decisions with complete confidence.",
    product_2_title: "AI Smart Assistant",
    product_2_category: "Artificial Intelligence",
    product_2_desc:
      "An intelligent AI chatbot acting as a smart assistant alongside company managers.",
    product_2_long_desc:
      "Your intelligent assistant, always awake and ready to answer. With a deep understanding of your needs, this AI can plan, answer customer queries, and simplify complex processes.",
    product_3_title: "No-Code Automation",
    product_3_category: "Workflow Automation",
    product_3_desc:
      "Create powerful automations and workflows without writing a single line of code.",
    product_3_long_desc:
      "Unleash your creativity without coding limitations. Our automation platform allows you to design and execute complex workflows, save time, and maximize your team's productivity.",
    click_for_more: "Click for details",
    our_products: "Our Products",
    view_product: "View",
    about_title: "About Us",
    about_subtitle:
      "We are a team of innovators committed to reshaping the future of technology. Our goal is to simplify complexities and provide solutions that transform your business.",
    contact_title: "Contact Us",
    contact_subtitle:
      "Ready to start your next project? Contact us to see how we can help you grow. We are always eager to hear new ideas.",
    login: "Login",
    load_more: "Load More",
    loading_more: "Loading...",
    // Login Page
    login_welcome: "Welcome",
    login_description: "Please enter your details.",
    email_placeholder: "Email address",
    username_placeholder: "Username",
    password_placeholder: "Password",
    forgot_password: "Forgot password?",
    sign_in: "Sign In",
    no_account: "Don't have an account?",
    sign_up: "Sign up",
    back: "Back",
    // Register Page
    register_welcome: "Create Account",
    register_description: "Please fill in your details.",
    full_name_placeholder: "Full Name",
    phone_placeholder: "Phone Number",
    confirm_password_placeholder: "Confirm Password",
    already_have_account: "Already have an account?",
  },
  fa: {
    welcome_message: "به ترای‌بر خوش آمدید",
    description: "یک برنامه مدرن ری‌اکت با انیمیشن‌های GSAP.",
    switch_lang: "تغییر زبان",
    menu_home: "خانه",
    menu_products: "محصولات",
    menu_about_contact: "تماس با ما",
    landing_title: "قدرت هوش مصنوعی، در دستان شما",
    landing_subtitle:
      "ما پیچیدگی‌های تکنولوژی را به ساده‌ترین ابزارهای رشد تبدیل کرده‌ایم. سرعتی بیشتر، دقتی بالاتر و هوشمندی در تمام ابعاد کار شما.",
    scroll_hint: "اسکرول کنید",
    product_1_title: "داشبورد مدیریتی",
    product_1_category: "هوش تجاری",
    product_1_desc:
      "بررسی و تحلیل داده‌های شرکتی و ارائه گزارش‌های دقیق به مدیران جهت تصمیم‌گیری بهتر.",
    product_1_long_desc:
      "با داشبوردهای مدیریتی پیشرفته ما، نبض کسب‌وکار خود را در دست بگیرید. تحلیل دقیق داده‌ها، نمودارهای تعاملی و گزارش‌های لحظه‌ای به شما کمک می‌کنند تا تصمیمات استراتژیک را با اطمینان کامل اتخاذ کنید.",
    product_2_title: "دستیار مدیرعامل",
    product_2_category: "هوش مصنوعی",
    product_2_desc:
      "یک چت‌بات هوشمند که به عنوان دستیار شخصی در کنار مدیران مجموعه ایفای نقش می‌کند.",
    product_2_long_desc:
      "دستیار هوشمند شما، همیشه بیدار و آماده پاسخگویی. این هوش مصنوعی با درک عمیق از نیازهای شما، می‌تواند برنامه‌ریزی کند، به سوالات مشتریان پاسخ دهد و فرآیندهای پیچیده را ساده‌سازی کند.",
    product_3_title: "اتوماسیون بدون کد",
    product_3_category: "اتوماسیون",
    product_3_desc:
      "بدون نوشتن حتی یک خط کد، فرآیندهای کاری خود را خودکار کنید و اتوماسیون بسازید.",
    product_3_long_desc:
      "خلاقیت خود را بدون محدودیت‌های کدنویسی رها کنید. پلتفرم اتوماسیون ما به شما اجازه می‌دهد تا گردش‌های کاری پیچیده را طراحی و اجرا کنید، در زمان صرفه‌جویی کنید و بهره‌وری تیم خود را به اوج برسانید.",
    click_for_more: "برای جزئیات کلیک کنید",
    our_products: "محصولات ما",
    view_product: "مشاهده",
    about_title: "درباره ما",
    about_subtitle:
      "ما تیمی از نوآوران هستیم که متعهد به تغییر آینده تکنولوژی‌ایم. هدف ما ساده‌سازی پیچیدگی‌ها و ارائه راهکارهایی است که کسب‌وکار شما را متحول می‌کند.",
    contact_title: "تماس با ما",
    contact_subtitle:
      "آماده‌اید پروژه بعدی خود را شروع کنید؟ با ما تماس بگیرید تا ببینیم چگونه می‌توانیم به رشد شما کمک کنیم. ما همیشه مشتاق شنیدن ایده‌های جدید هستیم.",
    login: "ورود",
    load_more: "نمایش بیشتر",
    loading_more: "در حال دریافت...",
    // Login Page
    login_welcome: "خوش آمدید",
    login_description: "لطفا اطلاعات خود را وارد کنید.",
    email_placeholder: "آدرس ایمیل",
    username_placeholder: "نام کاربری",
    password_placeholder: "رمز عبور",
    forgot_password: "رمز عبور را فراموش کرده‌اید؟",
    sign_in: "ورود",
    no_account: "حساب کاربری ندارید؟",
    sign_up: "ثبت نام",
    back: "بازگشت",
    // Register Page
    register_welcome: "ساخت حساب",
    register_description: "لطفا اطلاعات خود را وارد کنید.",
    full_name_placeholder: "نام کاربر",
    phone_placeholder: "شماره تماس",
    confirm_password_placeholder: "تایید رمز عبور",
    already_have_account: "قبلاً ثبت نام کرده‌اید؟",
  },
};

// Custom hook for Scramble Effect
export const useScrambleText = (text) => {
  const [display, setDisplay] = useState(text);
  const frameRequest = useRef(null);
  const chars = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

  useEffect(() => {
    let iteration = 0;

    const update = () => {
      setDisplay(
        text
          .split("")
          .map((char, index) => {
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration < text.length) {
        iteration += 1 / 3; // Control speed here
        frameRequest.current = requestAnimationFrame(update);
      } else {
        setDisplay(text);
      }
    };

    // Start scramble
    cancelAnimationFrame(frameRequest.current);
    update();

    return () => cancelAnimationFrame(frameRequest.current);
  }, [text]);

  return display;
};

export const LanguageProvider = ({ children }) => {
  // Default to 'fa' as per spec
  const [language, setLanguage] = useState("fa");

  // Initialize state from localStorage - Prevent flash of wrong lang
  useLayoutEffect(() => {
    const savedLang = localStorage.getItem("app-preferences-lang");
    if (savedLang) {
      setLanguage(savedLang);
    } else {
      // Default is fa
      setLanguage("fa");
    }
  }, []);

  // Update HTML dir attribute and persist
  useLayoutEffect(() => {
    localStorage.setItem("app-preferences-lang", language);
    document.documentElement.setAttribute(
      "dir",
      language === "fa" ? "rtl" : "ltr"
    );
    document.documentElement.setAttribute("lang", language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "fa" ? "en" : "fa"));
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{ language, toggleLanguage, t, useScrambleText }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

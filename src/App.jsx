import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import CustomCursor from "./components/CustomCursor";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import ProductView from "./components/ProductView";
import withTransition from "./components/withTransition";

const HomeWithTransition = withTransition(Home, "TryBear");
const LoginWithTransition = withTransition(Login, "Login");
const RegisterWithTransition = withTransition(Register, "Register");
const DashboardWithTransition = withTransition(Dashboard, "Dashboard");
const ProductViewWithTransition = withTransition(ProductView, "ProductView");

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route index element={<HomeWithTransition />} />
        <Route path="/login" element={<LoginWithTransition />} />
        <Route path="/register" element={<RegisterWithTransition />} />
        <Route path="/dashboard" element={<DashboardWithTransition />} />
        <Route path="/product/:id" element={<ProductViewWithTransition />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div className="bg-brand-bg text-brand-text min-h-screen">
        <CustomCursor />
        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App;

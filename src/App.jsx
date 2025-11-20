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
import withTransition from "./components/withTransition";

const HomeWithTransition = withTransition(Home);
const LoginWithTransition = withTransition(Login);

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route index element={<HomeWithTransition />} />
        <Route path="/login" element={<LoginWithTransition />} />
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

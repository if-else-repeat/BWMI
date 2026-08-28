import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { NetworkProvider, useNetwork } from "./context/NetworkContext";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import PrototypePF from "./pages/PrototypePF";
import PrototypeGateway from "./pages/PrototypeGateway";
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from "lucide-react";
import ScrollToTop from "./components/ScrollToTop";

function ToastContainer() {
  const { toasts, removeToast } = useNetwork();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full font-mono text-xs pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`p-3 brutal-border brutal-shadow pointer-events-auto flex items-start gap-2.5 animate-in slide-in-from-bottom-2 duration-150 ${
            t.type === "success"
              ? "bg-[#10b981] text-black font-bold"
              : t.type === "warning"
                ? "bg-[#f59e0b] text-black font-bold"
                : t.type === "error"
                  ? "bg-[#e61919] text-white font-bold"
                  : "bg-black text-[#f4f4f0]"
          }`}
        >
          <div className="mt-0.5">
            {t.type === "success" && (
              <CheckCircle className="w-4 h-4 text-black" />
            )}
            {t.type === "warning" && (
              <AlertTriangle className="w-4 h-4 text-black" />
            )}
            {t.type === "error" && (
              <AlertCircle className="w-4 h-4 text-white" />
            )}
            {t.type === "info" && <Info className="w-4 h-4 text-[#10b981]" />}
          </div>
          <div className="flex-1">
            <div className="font-black text-[11px] uppercase tracking-wider">
              {t.title}
            </div>
            <div className="text-[10px] opacity-95 font-sans mt-0.5">
              {t.message}
            </div>
          </div>
          <button
            onClick={() => removeToast(t.id)}
            className="p-0.5 opacity-70 hover:opacity-100"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  return (
    <NetworkProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-[#f4f4f0] text-[#050505]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/prototype/epfo" element={<PrototypePF />} />
            <Route path="/prototype/pf" element={<PrototypePF />} />
            <Route path="/prototype/gateway" element={<PrototypeGateway />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
          <ToastContainer />
        </div>
      </Router>
    </NetworkProvider>
  );
}

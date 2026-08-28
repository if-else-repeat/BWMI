import React from "react";
import { useLocation } from "react-router-dom";

export default function Footer() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  // Only render on the submission brief home page
  if (!isHomePage) {
    return null;
  }

  return (
    <footer className="mt-auto bg-[#f4f4f0] brutal-border-t py-8 px-4 text-center">
      <div className="max-w-4xl mx-auto space-y-2">
        <a 
          href="https://oldmill.in" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm font-mono tracking-widest uppercase font-bold text-black text-center hover:underline cursor-pointer block"
        >
          An OLDMILL Project
        </a>
      </div>
    </footer>
  );
}

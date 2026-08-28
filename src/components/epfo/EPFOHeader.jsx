import React, { useState, useRef, useEffect } from 'react';
import { Wifi, WifiOff, Database, LogOut, Globe, User } from 'lucide-react';
import { useNetwork } from '../../context/NetworkContext';
import { t } from './i18n';

export default function EPFOHeader({ lang, onLangChange, isAuthenticated, activeUser, onLogout, lastSavedTime }) {
  const { isOnline, toggleNetwork } = useNetwork();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full flex flex-col font-sans brutal-shadow brutal-border-b bg-white">
      {/* Top Accessibility Bar - Thin strip, constant width */}
      <div className="bg-[#e4e4e4] border-b border-gray-300 w-full">
        <div className="max-w-7xl mx-auto px-4 py-1 flex justify-between items-center text-[10px] sm:text-xs text-gray-800">
          
          <div className="flex items-center space-x-2">
            <Globe size={14} className="text-gray-500" />
            <button 
              onClick={() => onLangChange('en')} 
              className={`hover:underline ${lang === 'en' ? 'font-bold' : ''}`}
            >
              English
            </button>
            <span className="text-gray-400">|</span>
            <button 
              onClick={() => onLangChange('hi')} 
              className={`hover:underline ${lang === 'hi' ? 'font-bold' : ''}`}
            >
              हिन्दी
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleNetwork}
              className={`flex items-center space-x-1 px-1.5 py-0.5 rounded font-bold ${isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
            >
              {isOnline ? <Wifi size={10} /> : <WifiOff size={10} />}
              <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header - Constant width */}
      <div className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          
          {/* Logo & Org Name */}
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-black flex flex-col justify-center items-center text-[#f4f4f0] brutal-border brutal-shadow flex-shrink-0">
              <div className="text-sm font-black tracking-widest">EPFO</div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-[#048282] font-bold text-base md:text-lg leading-tight uppercase tracking-tight">
                {t('Header', lang)}
              </h1>
              <h2 className="text-[#C1622D] font-semibold text-xs md:text-sm tracking-wide">
                {t('Ministry', lang)}
              </h2>
            </div>
          </div>

          {/* Profile Circle with Dropdown */}
          {isAuthenticated && activeUser && (
            <div className="relative" ref={profileMenuRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 rounded-full bg-[#048282] text-white flex items-center justify-center font-bold text-lg brutal-border brutal-shadow hover:scale-105 transition-transform focus:outline-none"
              >
                {activeUser.name.charAt(0)}
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white brutal-border brutal-shadow z-50">
                  <div className="p-3 bg-gray-50 border-b border-gray-200">
                    <div className="font-bold text-sm text-gray-800 truncate">{activeUser.name}</div>
                    <div className="text-xs font-mono text-gray-600 mt-1">UAN: {activeUser.uan}</div>
                  </div>
                  <div className="p-2">
                    <button 
                      onClick={() => {
                        setIsProfileOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 font-bold transition-colors"
                    >
                      <LogOut size={16} />
                      <span>{t('Logout', lang)}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </header>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { t } from './i18n';

const MENU = [
  { id: 'home', labelKey: 'Home', children: null },
  {
    id: 'view', labelKey: 'View', children: [
      { id: 'profile', labelKey: 'Profile' },
      { id: 'service_book', labelKey: 'Service Book' },
      { id: 'uan_card', labelKey: 'UAN Card' },
      { id: 'passbook', labelKey: 'Passbook' },
    ]
  },
  {
    id: 'manage', labelKey: 'Manage', children: [
      { id: 'kyc', labelKey: 'KYC' },
      { id: 'nomination', labelKey: 'E-Nomination' },
      { id: 'contact', labelKey: 'Contact Details' },
      { id: 'mark_exit', labelKey: 'Mark Exit' },
    ]
  },
  {
    id: 'online_services', labelKey: 'Online Services', children: [
      { id: 'claim', labelKey: 'Claim (Form-31, 19, 10C & 10D)' },
      { id: 'transfer', labelKey: 'Transfer Request' },
      { id: 'track_claims', labelKey: 'Track Claim Status' },
    ]
  },
];

export default function EPFONav({ currentView, onNavigate, lang }) {
  const [openMenu, setOpenMenu] = useState(null);
  const navRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (item) => {
    if (item.children) {
      return item.children.some(c => c.id === currentView);
    }
    return item.id === currentView;
  };

  return (
    <nav ref={navRef} className="bg-[#048282] text-white px-4 shadow-md relative z-40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center">
        {MENU.map((item) => (
          <div key={item.id} className="relative">
            {item.children ? (
              <>
                <button
                  onClick={() => setOpenMenu(prev => prev === item.id ? null : item.id)}
                  className={`px-4 py-2.5 text-[13px] font-semibold flex items-center gap-1 transition-colors whitespace-nowrap ${
                    isActive(item) ? 'bg-white/20' : 'hover:bg-white/10'
                  }`}
                >
                  <span>{t(item.labelKey, lang)}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openMenu === item.id ? 'rotate-180' : ''}`} />
                </button>
                {openMenu === item.id && (
                  <div className="absolute left-0 top-full w-64 bg-white text-gray-800 shadow-xl rounded-b-lg border border-gray-200 z-50 py-1 animate-in slide-in-from-top-1 duration-100">
                    {item.children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => { onNavigate(child.id); setOpenMenu(null); }}
                        className={`w-full text-left px-4 py-2.5 text-[13px] font-medium hover:bg-[#048282]/10 hover:text-[#048282] transition-colors flex items-center justify-between ${
                          currentView === child.id ? 'bg-[#048282]/10 text-[#048282] font-bold' : ''
                        }`}
                      >
                        <span>{t(child.labelKey, lang)}</span>
                        {child.id === 'claim' && (
                          <span className="bg-green-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">ONLINE</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => { onNavigate(item.id); setOpenMenu(null); }}
                className={`px-4 py-2.5 text-[13px] font-semibold transition-colors whitespace-nowrap ${
                  isActive(item) ? 'bg-white/20' : 'hover:bg-white/10'
                }`}
              >
                {t(item.labelKey, lang)}
              </button>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}

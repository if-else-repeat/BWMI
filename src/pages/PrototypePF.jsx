import React, { useState, useCallback, useEffect } from 'react';
import { SYNTHETIC_USERS, DEFAULT_USER_UAN } from '../db/dexie';
import { useNetwork } from '../context/NetworkContext';
import EPFOHeader from '../components/epfo/EPFOHeader';
import EPFONav from '../components/epfo/EPFONav';
import EPFOLogin from '../components/epfo/EPFOLogin';
import EPFOPortalViews from '../components/epfo/EPFOPortalViews';
import EPFOClaim from '../components/epfo/EPFOClaim';
import EPFOFooter from '../components/epfo/EPFOFooter';
import usePersistentState from '../hooks/usePersistentState';

export default function PrototypePF() {
  const { addToast } = useNetwork();

  // Language
  const [lang, setLang] = usePersistentState('epfo_lang', 'en');

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = usePersistentState('epfo_auth', false);
  const [currentUan, setCurrentUan] = usePersistentState('epfo_uan', DEFAULT_USER_UAN);
  const activeUser = SYNTHETIC_USERS[currentUan] || SYNTHETIC_USERS[DEFAULT_USER_UAN];

  // Navigation
  const [currentView, setCurrentView] = usePersistentState('epfo_view', 'home');

  // Autosave time display
  const [lastSavedTime, setLastSavedTime] = useState(null);

  // Font size CSS class mapping

  // Login handler
  const handleLogin = useCallback((uan) => {
    const cleanUan = uan.replace(/\s+/g, '');
    const matchedUan = Object.keys(SYNTHETIC_USERS).find(u => u === cleanUan) || DEFAULT_USER_UAN;
    setCurrentUan(matchedUan);
    setIsAuthenticated(true);
    setCurrentView('home');
    addToast({
      type: 'success',
      title: lang === 'hi' ? 'सफलतापूर्वक लॉगिन' : 'LOGIN SUCCESSFUL',
      message: `${lang === 'hi' ? 'स्वागत है' : 'Welcome'}, ${SYNTHETIC_USERS[matchedUan]?.name}`
    });
  }, [addToast, lang]);

  // Passkey login handler
  const handlePasskeyLogin = useCallback(async (uan) => {
    const targetUan = uan || DEFAULT_USER_UAN;
    // Simulate biometric verification delay
    await new Promise(r => setTimeout(r, 400));
    setCurrentUan(targetUan);
    setIsAuthenticated(true);
    setCurrentView('home');
    addToast({
      type: 'success',
      title: lang === 'hi' ? 'पासकी से सत्यापित' : 'PASSKEY VERIFIED',
      message: `${SYNTHETIC_USERS[targetUan]?.name} — WebAuthn biometric authentication successful`
    });
  }, [addToast, lang]);

  // Logout handler
  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentView('home');
    setLastSavedTime(null);
    addToast({
      type: 'info',
      title: lang === 'hi' ? 'लॉगआउट' : 'SIGNED OUT',
      message: lang === 'hi' ? 'सत्र समाप्त हो गया है।' : 'Your session has been terminated securely.'
    });
  }, [addToast, lang]);

  // Navigation handler
  const handleNavigate = useCallback((view) => {
    setCurrentView(view);
  }, [setCurrentView]);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);


  return (
    <div className={`min-h-screen flex flex-col bg-[#f5f5f5] font-sans text-[15px] selection:bg-[#048282] selection:text-white`}>
      
      {/* EPFO Header: Accessibility Bar + Official Branding */}
      <EPFOHeader
        lang={lang}
        onLangChange={setLang}
        isAuthenticated={isAuthenticated}
        activeUser={activeUser}
        onLogout={handleLogout}
        lastSavedTime={lastSavedTime}
      />

      {/* Navigation Bar (only when logged in) */}
      {isAuthenticated && (
        <EPFONav
          currentView={currentView}
          onNavigate={handleNavigate}
          lang={lang}
        />
      )}

      {/* Main Content Area */}
      <main id="main-content" className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {!isAuthenticated ? (
            // Login / Landing Page
            <EPFOLogin
              lang={lang}
              onLogin={handleLogin}
              onPasskeyLogin={handlePasskeyLogin}
            />
          ) : currentView === 'claim' ? (
            // Claim Form (separate component with Dexie integration)
            <EPFOClaim
              activeUser={activeUser}
              lang={lang}
              currentUan={currentUan}
            />
          ) : (
            // All other portal views
            <EPFOPortalViews
              view={currentView}
              activeUser={activeUser}
              lang={lang}
              onNavigate={handleNavigate}
            />
          )}
        </div>
      </main>

      {/* Official Government Footer */}
      <EPFOFooter lang={lang} />
    </div>
  );
}

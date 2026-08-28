import React, { useState } from 'react';
import { 
  Key, Search, BadgeCheck, UserPlus, CreditCard, 
  FileHeart, ArrowRight, Eye, EyeOff, Fingerprint, 
  RefreshCw, AlertTriangle, FileText, Bell, ChevronRight, Shield 
} from 'lucide-react';
import { t } from './i18n';

const EPFOLogin = ({ lang = 'en', onLogin, onPasskeyLogin }) => {
  const [loginUan, setLoginUan] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaInput, setCaptchaInput] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginUan) {
      onLogin(loginUan);
    }
  };

  const handlePasskeyLogin = async (uan) => {
    setIsAuthenticating(true);
    setTimeout(() => {
      onPasskeyLogin(uan);
      setIsAuthenticating(false);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border-l-4 border-red-600 shadow-sm rounded-r-lg p-4 flex items-start space-x-3">
            <AlertTriangle className="text-red-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="text-red-600 font-bold text-lg mb-1">{t('Important Cyber Security Alert for EPF Members', lang)}</h3>
              <p className="text-gray-700 text-sm">
                {t('Please be vigilant against credential theft. EPFO never asks for personal details like Aadhaar, PAN, UAN, Password, or OTP over phone, social media, or WhatsApp. Do not share your login credentials with anyone.', lang)}
              </p>
            </div>
          </div>

          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-[#048282] px-4 py-3 flex items-center text-white">
              <FileText size={20} className="mr-2" />
              <h3 className="font-semibold text-lg">{t('Dear EPF Members !! Notices & Circulars', lang)}</h3>
              <span className="ml-auto bg-red-600 text-xs px-2 py-1 rounded animate-pulse font-bold tracking-wider">LATEST</span>
            </div>
            <div className="p-4 space-y-4">
              <ul className="space-y-4 text-sm text-gray-800">
                <li className="flex items-start">
                  <BadgeCheck className="text-green-600 mr-2 flex-shrink-0 mt-0.5" size={18} />
                  <span>{t('UAN activation and new UAN generation can now be done through Face Authentication on UMANG app.', lang)}</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="text-[#048282] mr-2 flex-shrink-0 mt-0.5" size={18} />
                  <span className="flex-1">{t('Benefits for Unorganised workers registering on e-SHRAM portal.', lang)}</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="text-[#048282] mr-2 flex-shrink-0 mt-0.5" size={18} />
                  <span className="flex-1">{t('Important notice about EDLI (Employees Deposit Linked Insurance Scheme).', lang)}</span>
                </li>
                <li className="flex items-start">
                  <Bell className="text-orange-500 mr-2 flex-shrink-0 mt-0.5" size={18} />
                  <span>{t('Filing of e-Nominations by members is mandatory as per EPF Scheme, 2026. E-Nominations can be filed and updated during service period.', lang)}</span>
                </li>
                <li className="flex items-start bg-teal-50 p-3 rounded border border-teal-100">
                  <Shield className="text-[#048282] mr-2 flex-shrink-0 mt-0.5" size={18} />
                  <span className="font-semibold text-[#048282]">{t('Members can now file Online Claims (Form 31 Advance) with offline resilience - claims are preserved locally even if the server is unreachable.', lang)}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800 mb-4">{t('Quick Services', lang)}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              
              <div className="border border-gray-200 rounded p-4 hover:shadow-md transition-shadow cursor-pointer group flex flex-col justify-between">
                <div className="flex items-center mb-2">
                  <div className="bg-teal-50 p-2 rounded-full mr-3 group-hover:bg-teal-100 transition-colors">
                    <Key className="text-[#048282]" size={24} />
                  </div>
                  <h4 className="font-semibold text-gray-800">{t('Activate UAN', lang)}</h4>
                </div>
                <p className="text-xs text-gray-600 flex-1">{t('Activate your UAN to access EPF services online', lang)}</p>
                <div className="mt-3 flex justify-end">
                  <ArrowRight size={16} className="text-[#048282] opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                </div>
              </div>

              <div className="border border-gray-200 rounded p-4 hover:shadow-md transition-shadow cursor-pointer group flex flex-col justify-between">
                <div className="flex items-center mb-2">
                  <div className="bg-blue-50 p-2 rounded-full mr-3 group-hover:bg-blue-100 transition-colors">
                    <Search className="text-blue-600" size={24} />
                  </div>
                  <h4 className="font-semibold text-gray-800">{t('Track Application Status', lang)}</h4>
                </div>
                <p className="text-xs text-gray-600 flex-1">{t('Check the progress of your application', lang)}</p>
                <div className="mt-3 flex justify-end">
                  <ArrowRight size={16} className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                </div>
              </div>

              <div className="border border-gray-200 rounded p-4 hover:shadow-md transition-shadow cursor-pointer group flex flex-col justify-between">
                <div className="flex items-center mb-2">
                  <div className="bg-green-50 p-2 rounded-full mr-3 group-hover:bg-green-100 transition-colors">
                    <BadgeCheck className="text-green-600" size={24} />
                  </div>
                  <h4 className="font-semibold text-gray-800">{t('Know Your UAN', lang)}</h4>
                </div>
                <p className="text-xs text-gray-600 flex-1">{t('Retrieve your UAN using basic details', lang)}</p>
                <div className="mt-3 flex justify-end">
                  <ArrowRight size={16} className="text-green-600 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                </div>
              </div>

              <div className="border border-gray-200 rounded p-4 hover:shadow-md transition-shadow cursor-pointer group flex flex-col justify-between">
                <div className="flex items-center mb-2">
                  <div className="bg-teal-50 p-2 rounded-full mr-3 group-hover:bg-teal-100 transition-colors">
                    <UserPlus className="text-[#048282]" size={24} />
                  </div>
                  <h4 className="font-semibold text-gray-800">{t('Direct UAN Allotment', lang)}</h4>
                </div>
                <p className="text-xs text-gray-600 flex-1">{t('Self-generate your UAN without employer', lang)}</p>
                <div className="mt-3 flex justify-end">
                  <ArrowRight size={16} className="text-[#048282] opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                </div>
              </div>

              <div className="border border-gray-200 rounded p-4 hover:shadow-md transition-shadow cursor-pointer group flex flex-col justify-between">
                <div className="flex items-center mb-2">
                  <div className="bg-purple-50 p-2 rounded-full mr-3 group-hover:bg-purple-100 transition-colors">
                    <CreditCard className="text-purple-600" size={24} />
                  </div>
                  <h4 className="font-semibold text-gray-800">{t('UAN for Existing PF', lang)}</h4>
                </div>
                <p className="text-xs text-gray-600 flex-1">{t('Generate UAN for members with active PF', lang)}</p>
                <div className="mt-3 flex justify-end">
                  <ArrowRight size={16} className="text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                </div>
              </div>

              <div className="border border-gray-200 rounded p-4 hover:shadow-md transition-shadow cursor-pointer group flex flex-col justify-between">
                <div className="flex items-center mb-2">
                  <div className="bg-orange-50 p-2 rounded-full mr-3 group-hover:bg-orange-100 transition-colors">
                    <FileHeart className="text-orange-500" size={24} />
                  </div>
                  <h4 className="font-semibold text-gray-800">{t('Death Claim Filing', lang)}</h4>
                </div>
                <p className="text-xs text-gray-600 flex-1">{t('Nominee claim filing under EDLI scheme', lang)}</p>
                <div className="mt-3 flex justify-end">
                  <ArrowRight size={16} className="text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 pb-4 flex flex-col items-center border-b border-gray-100">
              <div className="bg-gray-900 text-white font-bold text-2xl w-16 h-16 flex items-center justify-center rounded-lg shadow-inner mb-3">
                EPF
              </div>
              <h2 className="text-xl font-bold text-gray-800 text-center">{t('Member e-Sewa Login', lang)}</h2>
              <p className="text-sm text-gray-500 text-center mt-1">{t('Universal Account Number Portal', lang)}</p>
            </div>

            <div className="p-4 bg-gray-50 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">{t('Quick Access — Test Profiles:', lang)}</p>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => handlePasskeyLogin('101294829101')}
                  disabled={isAuthenticating}
                  className="bg-white border border-gray-300 hover:border-[#048282] hover:bg-teal-50 rounded p-2 text-left transition-colors flex flex-col"
                >
                  <span className="font-semibold text-sm text-gray-800 block truncate w-full">Ramesh Kumar</span>
                  <span className="text-xs text-gray-500 block">₹1,48,200 • 7 Yrs</span>
                </button>
                <button 
                  onClick={() => handlePasskeyLogin('101940281192')}
                  disabled={isAuthenticating}
                  className="bg-white border border-gray-300 hover:border-[#048282] hover:bg-teal-50 rounded p-2 text-left transition-colors flex flex-col"
                >
                  <span className="font-semibold text-sm text-gray-800 block truncate w-full">Priya Sharma</span>
                  <span className="text-xs text-gray-500 block">₹18,500 • New</span>
                </button>
              </div>
            </div>

            <div className="p-6">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('UAN Number', lang)}</label>
                  <input
                    type="text"
                    value={loginUan}
                    onChange={(e) => setLoginUan(e.target.value.replace(/[^0-9]/g, ''))}
                    maxLength={12}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#048282] focus:border-[#048282] font-mono text-sm"
                    placeholder="Enter 12-digit UAN"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('Password', lang)}</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#048282] focus:border-[#048282] text-sm pr-10"
                      placeholder="Enter Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('Captcha', lang)}</label>
                  <div className="flex gap-2 mb-2">
                    <div className="bg-gray-800 text-white font-mono tracking-[0.3em] font-bold px-4 py-2 rounded flex-1 text-center italic relative overflow-hidden flex items-center justify-center">
                      <span className="relative z-10 text-lg">7K9P2</span>
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjEiLz4KPC9zdmc+')] opacity-50"></div>
                      <div className="absolute w-full h-0.5 bg-white/20 top-1/2 -translate-y-1/2 rotate-3"></div>
                      <div className="absolute w-full h-0.5 bg-white/20 top-1/3 -translate-y-1/3 -rotate-6"></div>
                    </div>
                    <button type="button" className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded px-3 text-gray-600 transition-colors">
                      <RefreshCw size={18} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#048282] focus:border-[#048282] text-sm"
                    placeholder="Enter Captcha"
                  />
                </div>

                <div className="pt-2 space-y-3">
                  <button
                    type="submit"
                    className="w-full bg-[#28a745] hover:bg-[#218838] text-white font-medium py-2 px-4 rounded-md transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#28a745]"
                  >
                    {t('Sign In', lang)}
                  </button>

                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase font-medium">or</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePasskeyLogin(loginUan || '101294829101')}
                    disabled={isAuthenticating}
                    className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium py-2.5 px-4 rounded-md transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563eb] flex items-center justify-center space-x-2"
                  >
                    <Fingerprint size={20} />
                    <span>
                      {isAuthenticating ? 'Authenticating...' : t('Verify with Device (Passkey)', lang)}
                    </span>
                  </button>
                </div>
              </form>
              
              <div className="mt-6 text-center">
                <a href="#" className="text-sm text-[#048282] hover:text-[#036666] font-medium hover:underline">
                  {t('Forgot Password?', lang)}
                </a>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default EPFOLogin;

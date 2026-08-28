import React from 'react';
import { Phone, ExternalLink } from 'lucide-react';
import { t } from './i18n';

export default function EPFOFooter({ lang = 'en' }) {
  return (
    <footer className="mt-auto bg-[#1a3c3c] text-white/90">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-6 border-b border-white/15">
          
          {/* Column 1: About */}
          <div className="space-y-3">
            <h4 className="text-[#5ce0d6] text-xs font-bold uppercase tracking-wider border-b-2 border-[#5ce0d6]/30 pb-2 inline-block">
              {lang === 'hi' ? 'हमारे बारे में' : 'About'}
            </h4>
            <ul className="space-y-2 text-[13px] text-white/70">
              <li><a href="https://www.epfo.gov.in/about-us/" target="_blank" rel="noopener noreferrer" className="hover:text-[#5ce0d6] transition-colors">
                {lang === 'hi' ? 'EPFO के बारे में' : 'About EPFO'}
              </a></li>
              <li><a href="https://www.epfo.gov.in/epf-scheme/" target="_blank" rel="noopener noreferrer" className="hover:text-[#5ce0d6] transition-colors">
                {lang === 'hi' ? 'EPF योजना' : 'EPF Scheme'}
              </a></li>
              <li><a href="https://www.epfo.gov.in/pension-scheme-eps/" target="_blank" rel="noopener noreferrer" className="hover:text-[#5ce0d6] transition-colors">
                {lang === 'hi' ? 'पेंशन योजना (EPS)' : 'Pension Scheme (EPS)'}
              </a></li>
              <li><a href="https://www.epfo.gov.in/insurance-scheme-edli/" target="_blank" rel="noopener noreferrer" className="hover:text-[#5ce0d6] transition-colors">
                {lang === 'hi' ? 'बीमा योजना (EDLI)' : 'Insurance Scheme (EDLI)'}
              </a></li>
              <li><a href="https://www.epfo.gov.in/faq-epfo/" target="_blank" rel="noopener noreferrer" className="hover:text-[#5ce0d6] transition-colors">
                {lang === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न' : 'FAQs'}
              </a></li>
            </ul>
          </div>

          {/* Column 2: Important Links */}
          <div className="space-y-3">
            <h4 className="text-[#5ce0d6] text-xs font-bold uppercase tracking-wider border-b-2 border-[#5ce0d6]/30 pb-2 inline-block">
              {lang === 'hi' ? 'महत्वपूर्ण लिंक' : 'Important Links'}
            </h4>
            <ul className="space-y-2 text-[13px] text-white/70">
              <li><a href="https://www.epfo.gov.in/epfo-sitemap/" target="_blank" rel="noopener noreferrer" className="hover:text-[#5ce0d6] transition-colors">
                {lang === 'hi' ? 'साइट मैप' : 'Sitemap'}
              </a></li>
              <li><a href="https://www.epfo.gov.in/rti-epfo/" target="_blank" rel="noopener noreferrer" className="hover:text-[#5ce0d6] transition-colors">
                {lang === 'hi' ? 'सूचना का अधिकार' : 'RTI'}
              </a></li>
              <li><a href="https://epfigms.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-[#5ce0d6] transition-colors">
                EPFiGMS
              </a></li>
              <li><a href="https://web.umang.gov.in/landing/department/epfo.html" target="_blank" rel="noopener noreferrer" className="hover:text-[#5ce0d6] transition-colors">
                {lang === 'hi' ? 'एम-गवर्नेंस (UMANG)' : 'mGovernance (UMANG)'}
              </a></li>
              <li><a href="https://www.epfo.gov.in/circulars/" target="_blank" rel="noopener noreferrer" className="hover:text-[#5ce0d6] transition-colors">
                {lang === 'hi' ? 'परिपत्र' : 'Circulars'}
              </a></li>
            </ul>
          </div>

          {/* Column 3: Other Links */}
          <div className="space-y-3">
            <h4 className="text-[#5ce0d6] text-xs font-bold uppercase tracking-wider border-b-2 border-[#5ce0d6]/30 pb-2 inline-block">
              {lang === 'hi' ? 'अन्य लिंक' : 'Other Links'}
            </h4>
            <ul className="space-y-2 text-[13px] text-white/70">
              <li><a href="https://labour.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-[#5ce0d6] transition-colors flex items-center gap-1">
                {lang === 'hi' ? 'श्रम और रोजगार मंत्रालय' : 'M/o L&E'} <ExternalLink className="w-3 h-3" />
              </a></li>
              <li><a href="https://www.india.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-[#5ce0d6] transition-colors flex items-center gap-1">
                {lang === 'hi' ? 'भारत सरकार पोर्टल' : 'India.gov.in'} <ExternalLink className="w-3 h-3" />
              </a></li>
              <li><a href="https://www.epfo.gov.in/data-hub/" target="_blank" rel="noopener noreferrer" className="hover:text-[#5ce0d6] transition-colors">
                {lang === 'hi' ? 'डेटा हब' : 'Data Hub'}
              </a></li>
              <li><a href="https://www.epfo.gov.in/locate-epfo-office/" target="_blank" rel="noopener noreferrer" className="hover:text-[#5ce0d6] transition-colors">
                {lang === 'hi' ? 'EPFO कार्यालय खोजें' : 'Locate EPFO Office'}
              </a></li>
            </ul>
          </div>

          {/* Column 4: Helpline */}
          <div className="space-y-3">
            <h4 className="text-[#5ce0d6] text-xs font-bold uppercase tracking-wider border-b-2 border-[#5ce0d6]/30 pb-2 inline-block">
              {t('helpdesk', lang)}
            </h4>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-[#5ce0d6]" />
                <span className="text-2xl font-bold text-[#5ce0d6]">14470</span>
              </div>
              <p className="text-xs text-white/50">{t('helpdesk', lang)}</p>
              <p className="text-xs text-white/50">
                {lang === 'hi' ? 'सोम-शनि: सुबह 9:15 - शाम 5:45' : 'Mon-Sat: 9:15 AM - 5:45 PM'}
              </p>
            </div>
            <div className="pt-2">
              <a href="https://www.epfo.gov.in/contact-us" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[13px] text-[#5ce0d6] hover:text-white transition-colors font-medium">
                {t('contactUs', lang)} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Policy Links Row */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-4 pb-3 text-[12px] text-white/60">
          <a href="https://www.epfo.gov.in/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{t('privacyPolicy', lang)}</a>
          <span className="text-white/30">|</span>
          <a href="https://www.epfo.gov.in/terms-of-use" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{t('termsConditions', lang)}</a>
          <span className="text-white/30">|</span>
          <a href="https://www.epfo.gov.in/hyperlinking-policy" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{t('hyperlinkingPolicy', lang)}</a>
          <span className="text-white/30">|</span>
          <a href="https://www.epfo.gov.in/disclaimer-epfo/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            {lang === 'hi' ? 'अस्वीकरण' : 'Disclaimer'}
          </a>
          <span className="text-white/30">|</span>
          <a href="https://www.epfo.gov.in/copyright-policy/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            {lang === 'hi' ? 'कॉपीराइट नीति' : 'Copyright Policy'}
          </a>
        </div>

        {/* Social Row */}
        <div className="flex items-center justify-center gap-3 py-3 border-t border-white/10">
          <span className="text-xs text-white/40 font-semibold uppercase tracking-wider">Follow us</span>
          <div className="flex gap-2">
            <a href="https://www.facebook.com/socialepfo" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
              className="w-8 h-8 rounded-full bg-[#1877f2] flex items-center justify-center text-white text-sm hover:scale-110 transition-transform">f</a>
            <a href="https://x.com/officialepfo" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)"
              className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-sm hover:scale-110 transition-transform">𝕏</a>
            <a href="https://www.instagram.com/officialepfo/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
              className="w-8 h-8 rounded-full bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#515bd4] flex items-center justify-center text-white text-sm hover:scale-110 transition-transform">ig</a>
            <a href="https://youtube.com/@officialepfo" target="_blank" rel="noopener noreferrer" aria-label="YouTube"
              className="w-8 h-8 rounded-full bg-[#ff0000] flex items-center justify-center text-white text-sm hover:scale-110 transition-transform">▶</a>
            <a href="https://linkedin.com/company/epfoofficial" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
              className="w-8 h-8 rounded-full bg-[#0a66c2] flex items-center justify-center text-white text-sm hover:scale-110 transition-transform">in</a>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="bg-[#142e2e] py-3 text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="text-[11px] text-white/50">
            {t('copyrightLine1', lang)}
          </p>
          <p className="text-[11px] text-white/40">
            {t('copyrightLine2', lang)}
          </p>
          <p className="text-[10px] text-white/30 mt-1">
            Plate A Ground Floor, Office Block-II, East Kidwai Nagar, New Delhi - 110023
          </p>
        </div>
      </div>
    </footer>
  );
}

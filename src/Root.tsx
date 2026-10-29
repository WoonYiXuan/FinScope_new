// @ts-nocheck
import React, { useState } from 'react';
import App from './App';
import VendorApp from './VendorApp';

export default function Root() {
  const [mode, setMode] = useState('vendor'); // 'personal' | 'vendor'
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('finscope.lang') || 'en';
    } catch {
      return 'en';
    }
  });
  const changeLang = (l) => {
    setLang(l);
    try {
      localStorage.setItem('finscope.lang', l);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#040812]">
      {mode === 'personal' ? (
        <App currentMode={mode} onSwitchMode={setMode} />
      ) : (
        <VendorApp
          currentMode={mode}
          onSwitchMode={setMode}
          lang={lang}
          onLang={changeLang}
        />
      )}
    </div>
  );
}

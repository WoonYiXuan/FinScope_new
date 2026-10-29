// @ts-nocheck
import React from 'react';

/* Shared Personal / Vendor switch. Same size and position in both phases. */
export default function ModeSwitch({ currentMode, onSwitchMode }) {
  return (
    <div
      className="flex w-44 shrink-0 items-center rounded-xl border border-white/15 bg-[#0B1726] p-1 text-xs"
      role="group"
      aria-label="Mode"
    >
      {[
        ['personal', 'Personal'],
        ['vendor', 'Vendor'],
      ].map(([k, l]) => (
        <button
          key={k}
          type="button"
          aria-pressed={currentMode === k}
          onClick={() => onSwitchMode && onSwitchMode(k)}
          className={`w-1/2 rounded-lg px-3 py-1.5 text-center font-bold transition ${
            currentMode === k
              ? 'bg-cyan-400 text-[#040812] shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

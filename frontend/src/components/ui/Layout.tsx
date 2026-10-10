import React, { useState } from 'react';
import {
  SlidersHorizontal,
  ChevronUp,
  ChevronDown,
  Compass,
  MousePointer,
  RotateCcw,
} from 'lucide-react';

interface LayoutProps {
  children3D: React.ReactNode;
  childrenControls: React.ReactNode;
  onResetView?: () => void;
  isDoorOpen?: boolean;
  onToggleDoor?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children3D,
  childrenControls,
  onResetView,
  isDoorOpen,
  onToggleDoor,
}) => {
  // Mobile bottom-sheet expanded state
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 flex flex-col md:flex-row">
      {/* ================= 3D VIEWPORT CANVAS ================= */}
      <main className="relative flex-1 w-full h-full min-h-0 min-w-0 overflow-hidden">
        {children3D}

        {/* Floating Top Brand & Navigation Pill */}
        <header className="absolute top-4 left-4 right-4 md:right-auto z-20 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto px-4 py-2 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-xl">
            <div>
              <div className="text-xs font-bold text-white tracking-wide">
                CABINET 3D
              </div>
              <div className="text-[10px] text-slate-400">
                Studio Configurator
              </div>
            </div>
          </div>

          {/* Quick interaction hints pill (Desktop) */}
          <div className="hidden lg:flex items-center gap-4 px-4 py-2 rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/10 text-xs text-slate-400 select-none shadow-lg">
            <span className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              Айналдыру: тінтуірмен сүйреу
            </span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1.5">
              <MousePointer className="w-3.5 h-3.5 text-sky-400" />
              Есікті басып ашу / жабу
            </span>
          </div>
        </header>

        {/* Floating Quick Action Overlay on Canvas */}
        <div className="absolute bottom-20 md:bottom-6 left-4 z-20 flex items-center gap-2">
          {onToggleDoor && (
            <button
              type="button"
              onClick={onToggleDoor}
              className="px-3 py-2 rounded-xl bg-slate-900/80 backdrop-blur-xl border border-white/10 text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800 transition-all shadow-lg flex items-center gap-1.5 active:scale-95"
            >
              <span className={`w-2 h-2 rounded-full ${isDoorOpen ? 'bg-amber-400' : 'bg-slate-500'}`} />
              <span>{isDoorOpen ? 'Жабу' : 'Есікті ашу'}</span>
            </button>
          )}

          {onResetView && (
            <button
              type="button"
              onClick={onResetView}
              title="Reset View"
              className="p-2 rounded-xl bg-slate-900/80 backdrop-blur-xl border border-white/10 text-slate-300 hover:text-white hover:bg-slate-800 transition-all shadow-lg active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </main>

      {/* ================= DESKTOP SIDEBAR PANEL ================= */}
      <aside className="hidden md:flex flex-col w-96 lg:w-[420px] h-full z-30 bg-slate-900/90 backdrop-blur-2xl border-l border-white/10 shadow-2xl">
        {childrenControls}
      </aside>

      {/* ================= MOBILE BOTTOM SHEET ================= */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
        {/* Mobile Bar Pill to expand / collapse */}
        <div
          onClick={() => setIsMobileSheetOpen(!isMobileSheetOpen)}
          className="cursor-pointer mx-3 mb-2 p-3 rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-white/15 shadow-2xl flex items-center justify-between"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
            <span>Параметрлерді баптау (Settings)</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400 text-xs">
            {isMobileSheetOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </div>
        </div>

        {/* Mobile Drawer Body */}
        {isMobileSheetOpen && (
          <div className="bg-slate-900/95 backdrop-blur-2xl border-t border-white/15 rounded-t-3xl max-h-[70vh] overflow-y-auto shadow-2xl transition-all duration-300">
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto my-2" />
            {childrenControls}
          </div>
        )}
      </div>
    </div>
  );
};

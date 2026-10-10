import React from 'react';
import {
  Box,
  Layers,
  RotateCw,
  Eye,
  Sliders,
  Sparkles,
  Maximize2,
  Check,
  DoorClosed,
  DoorOpen,
  Ruler,
} from 'lucide-react';
import type { CabinetColor, CabinetDimensions, CabinetConfig } from '../../types';
import { COLOR_OPTIONS, DIMENSION_LIMITS } from '../../types';

interface ControlPanelProps {
  config: CabinetConfig;
  onChangeDimension: (key: keyof CabinetDimensions, value: number) => void;
  onChangeColor: (color: CabinetColor) => void;
  onToggleDoor: () => void;
  onToggleDimensions: () => void;
  onToggleWireframe: () => void;
  onToggleAutoRotate: () => void;
  onResetCamera: () => void;
  onApplyPreset: (preset: { name: string; dims: CabinetDimensions }) => void;
}

const PRESETS: { name: string; label: string; dims: CabinetDimensions }[] = [
  { name: 'Standard', label: 'Стандарт', dims: { width: 800, height: 650, depth: 450 } },
  { name: 'Compact', label: 'Шағын тумба', dims: { width: 500, height: 500, depth: 380 } },
  { name: 'Wide', label: 'Кең комод', dims: { width: 1200, height: 750, depth: 500 } },
];

export const ControlPanel: React.FC<ControlPanelProps> = ({
  config,
  onChangeDimension,
  onChangeColor,
  onToggleDoor,
  onToggleDimensions,
  onToggleWireframe,
  onToggleAutoRotate,
  onResetCamera,
  onApplyPreset,
}) => {
  // Volume in cubic meters & liters
  const volumeM3 = (
    (config.dimensions.width / 1000) *
    (config.dimensions.height / 1000) *
    (config.dimensions.depth / 1000)
  ).toFixed(3);
  const volumeLiters = Math.round(Number(volumeM3) * 1000);

  return (
    <div className="flex flex-col h-full overflow-y-auto text-slate-100 p-5 space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Box className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              3D Тумба Конфигураторы
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time interactive cabinet customizer
          </p>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          R3F Live
        </span>
      </div>

      {/* ================= PRESET QUICK SELECT ================= */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Дайын өлшемдер (Presets)
        </label>
        <div className="grid grid-cols-3 gap-2">
          {PRESETS.map((preset) => {
            const isActive =
              config.dimensions.width === preset.dims.width &&
              config.dimensions.height === preset.dims.height &&
              config.dimensions.depth === preset.dims.depth;

            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => onApplyPreset(preset)}
                className={`px-2.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 border text-center ${
                  isActive
                    ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-sm shadow-indigo-500/20'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div>{preset.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {preset.dims.width}×{preset.dims.height}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= 1. DIMENSION CONTROLS (3 FIELDS) ================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-sky-400" />
            Өлшемдері (Dimensions in mm)
          </label>
          <span className="text-[11px] text-slate-400 font-mono">
            {config.dimensions.width} × {config.dimensions.height} × {config.dimensions.depth} mm
          </span>
        </div>

        {/* WIDTH CONTROL */}
        <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              Ені (Width)
            </span>
            <div className="flex items-center gap-1.5">
              <input
                id="input-width"
                type="number"
                min={DIMENSION_LIMITS.width.min}
                max={DIMENSION_LIMITS.width.max}
                step={DIMENSION_LIMITS.width.step}
                value={config.dimensions.width}
                onChange={(e) =>
                  onChangeDimension('width', Number(e.target.value))
                }
                className="w-20 px-2 py-1 text-right text-xs font-mono font-semibold bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-sky-500"
              />
              <span className="text-[11px] text-slate-400 font-mono">mm</span>
            </div>
          </div>
          <input
            id="slider-width"
            type="range"
            min={DIMENSION_LIMITS.width.min}
            max={DIMENSION_LIMITS.width.max}
            step={DIMENSION_LIMITS.width.step}
            value={config.dimensions.width}
            onChange={(e) =>
              onChangeDimension('width', Number(e.target.value))
            }
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-400 focus:outline-none"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>{DIMENSION_LIMITS.width.min} mm</span>
            <span>{DIMENSION_LIMITS.width.max} mm</span>
          </div>
        </div>

        {/* HEIGHT CONTROL */}
        <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              Биіктігі (Height)
            </span>
            <div className="flex items-center gap-1.5">
              <input
                id="input-height"
                type="number"
                min={DIMENSION_LIMITS.height.min}
                max={DIMENSION_LIMITS.height.max}
                step={DIMENSION_LIMITS.height.step}
                value={config.dimensions.height}
                onChange={(e) =>
                  onChangeDimension('height', Number(e.target.value))
                }
                className="w-20 px-2 py-1 text-right text-xs font-mono font-semibold bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
              />
              <span className="text-[11px] text-slate-400 font-mono">mm</span>
            </div>
          </div>
          <input
            id="slider-height"
            type="range"
            min={DIMENSION_LIMITS.height.min}
            max={DIMENSION_LIMITS.height.max}
            step={DIMENSION_LIMITS.height.step}
            value={config.dimensions.height}
            onChange={(e) =>
              onChangeDimension('height', Number(e.target.value))
            }
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-400 focus:outline-none"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>{DIMENSION_LIMITS.height.min} mm</span>
            <span>{DIMENSION_LIMITS.height.max} mm</span>
          </div>
        </div>

        {/* DEPTH CONTROL */}
        <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Тереңдігі (Depth)
            </span>
            <div className="flex items-center gap-1.5">
              <input
                id="input-depth"
                type="number"
                min={DIMENSION_LIMITS.depth.min}
                max={DIMENSION_LIMITS.depth.max}
                step={DIMENSION_LIMITS.depth.step}
                value={config.dimensions.depth}
                onChange={(e) =>
                  onChangeDimension('depth', Number(e.target.value))
                }
                className="w-20 px-2 py-1 text-right text-xs font-mono font-semibold bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[11px] text-slate-400 font-mono">mm</span>
            </div>
          </div>
          <input
            id="slider-depth"
            type="range"
            min={DIMENSION_LIMITS.depth.min}
            max={DIMENSION_LIMITS.depth.max}
            step={DIMENSION_LIMITS.depth.step}
            value={config.dimensions.depth}
            onChange={(e) =>
              onChangeDimension('depth', Number(e.target.value))
            }
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>{DIMENSION_LIMITS.depth.min} mm</span>
            <span>{DIMENSION_LIMITS.depth.max} mm</span>
          </div>
        </div>
      </div>

      {/* ================= 2. COLOR SELECTION (3 BUTTONS) ================= */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-3">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          Түс пен Материал (Color & Material)
        </label>
        <div className="grid grid-cols-1 gap-2.5">
          {COLOR_OPTIONS.map((colorOpt) => {
            const isSelected = config.color === colorOpt.id;
            return (
              <button
                key={colorOpt.id}
                id={`color-btn-${colorOpt.id}`}
                type="button"
                onClick={() => onChangeColor(colorOpt.id)}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-200 group ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 shadow-md shadow-indigo-500/10'
                    : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/80 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Color Swatch */}
                  <div
                    className={`w-9 h-9 rounded-lg border shadow-inner flex items-center justify-center transition-transform group-hover:scale-105 ${
                      colorOpt.id === 'walnut'
                        ? 'bg-[url(/textures/walnut.jpg)] bg-cover bg-center border-amber-900/60'
                        : 'border-white/20'
                    }`}
                    style={
                      colorOpt.id !== 'walnut'
                        ? { backgroundColor: colorOpt.hex }
                        : undefined
                    }
                  >
                    {isSelected && (
                      <Check
                        className={`w-4 h-4 drop-shadow ${
                          colorOpt.id === 'white' ? 'text-slate-900' : 'text-white'
                        }`}
                      />
                    )}
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-white">
                      {colorOpt.name}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {colorOpt.subname}
                    </div>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-slate-400">
                  {colorOpt.id === 'walnut' ? 'Texture Map' : colorOpt.hex}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= 3. BONUS FEATURES & INTERACTIONS ================= */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-3">
          <Eye className="w-3.5 h-3.5 text-indigo-400" />
          Интерактив басқару (Interactions)
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          {/* DOOR TOGGLE */}
          <button
            id="btn-toggle-door"
            type="button"
            onClick={onToggleDoor}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${
              config.isDoorOpen
                ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {config.isDoorOpen ? (
              <DoorOpen className="w-4 h-4 text-amber-400" />
            ) : (
              <DoorClosed className="w-4 h-4 text-slate-400" />
            )}
            <span>{config.isDoorOpen ? 'Есікті жабу' : 'Есікті ашу'}</span>
          </button>

          {/* DIMENSION LABELS TOGGLE */}
          <button
            id="btn-toggle-dimensions"
            type="button"
            onClick={onToggleDimensions}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${
              config.showDimensions
                ? 'bg-sky-500/20 border-sky-500/60 text-sky-300'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Ruler className="w-4 h-4 text-sky-400" />
            <span>{config.showDimensions ? 'Өлшемдер: Қосулы' : 'Өлшемдер: Өшірулі'}</span>
          </button>

          {/* AUTO-ROTATE TURNTABLE */}
          <button
            id="btn-toggle-rotate"
            type="button"
            onClick={onToggleAutoRotate}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${
              config.autoRotate
                ? 'bg-indigo-500/20 border-indigo-500/60 text-indigo-300'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <RotateCw className={`w-4 h-4 ${config.autoRotate ? 'animate-spin' : 'text-slate-400'}`} />
            <span>360° Айналдыру</span>
          </button>

          {/* WIREFRAME TOGGLE */}
          <button
            id="btn-toggle-wireframe"
            type="button"
            onClick={onToggleWireframe}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${
              config.wireframe
                ? 'bg-purple-500/20 border-purple-500/60 text-purple-300'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Box className="w-4 h-4 text-purple-400" />
            <span>{config.wireframe ? 'Wireframe: ON' : 'Wireframe'}</span>
          </button>
        </div>

        {/* RESET CAMERA */}
        <button
          id="btn-reset-camera"
          type="button"
          onClick={onResetCamera}
          className="w-full mt-2.5 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-800/40 border border-slate-700/40 hover:bg-slate-800 hover:border-slate-600 text-xs text-slate-400 hover:text-white transition-all"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Камераны бастапқы қалпына келтіру (Reset View)</span>
        </button>
      </div>

      {/* ================= SUMMARY STATS CARD ================= */}
      <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-950/40 to-slate-900/60 border border-indigo-500/20 text-xs space-y-2">
        <div className="font-semibold text-slate-200 flex items-center justify-between">
          <span>Көлемі мен параметрлері</span>
          <span className="font-mono text-indigo-300">{volumeLiters} L</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1 border-t border-white/5">
          <div>
            Жалпы көлемі: <span className="font-mono text-slate-200">{volumeM3} м³</span>
          </div>
          <div>
            Материал: <span className="capitalize text-slate-200">{config.color}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

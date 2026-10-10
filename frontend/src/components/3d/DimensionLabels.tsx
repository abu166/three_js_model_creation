import React, { useState, useEffect } from 'react';
import { Html } from '@react-three/drei';
import type { CabinetDimensions } from '../../types';

interface DimensionLabelsProps {
  dimensions: CabinetDimensions;
  visible: boolean;
}

/**
 * DimensionLabels Component
 * Renders sleek, compact architectural leader lines and slim measurement badges (L, H, D).
 */
export const DimensionLabels: React.FC<DimensionLabelsProps> = ({ dimensions, visible }) => {
  // Sync trigger to ensure Drei Html elements settle projection matrices on initial page load
  const [syncKey, setSyncKey] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSyncKey((prev) => prev + 1);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  // Convert mm to meters for Three.js coordinates
  const w = dimensions.width / 1000;
  const h = dimensions.height / 1000;
  const d = dimensions.depth / 1000;

  // Offsets to float labels slightly away from the model with clean clearance
  const widthOffsetZ = d / 2 + 0.08;
  const heightOffsetX = -w / 2 - 0.08;
  const depthOffsetX = w / 2 + 0.08;

  return (
    <group name="dimension-labels" key={`dim-group-${syncKey}`}>
      {/* ================= LENGTH / WIDTH DIMENSION (X-axis, front bottom) ================= */}
      <group position={[0, 0.06, widthOffsetZ]}>
        {/* Leader line along bottom front */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[w, 0.0015, 0.0015]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} />
        </mesh>
        {/* Left tick */}
        <mesh position={[-w / 2, 0, 0]}>
          <boxGeometry args={[0.0015, 0.025, 0.0015]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} />
        </mesh>
        {/* Right tick */}
        <mesh position={[w / 2, 0, 0]}>
          <boxGeometry args={[0.0015, 0.025, 0.0015]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} />
        </mesh>

        {/* Slim, compact HTML Badge Label */}
        <Html center position={[0, 0.035, 0]} zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-950/85 border border-sky-400/40 backdrop-blur-sm text-[10px] font-mono text-slate-200 select-none whitespace-nowrap shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0"></span>
            <span className="text-slate-400 font-normal">L:</span>
            <span className="font-normal text-white">{dimensions.width}</span>
            <span className="text-[9px] text-slate-400 font-normal">mm</span>
          </div>
        </Html>
      </group>

      {/* ================= HEIGHT DIMENSION (Y-axis, left edge) ================= */}
      <group position={[heightOffsetX, h / 2, d / 2]}>
        {/* Vertical leader line */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.0015, h, 0.0015]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.6} />
        </mesh>
        {/* Bottom tick */}
        <mesh position={[0, -h / 2, 0]}>
          <boxGeometry args={[0.025, 0.0015, 0.0015]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.8} />
        </mesh>
        {/* Top tick */}
        <mesh position={[0, h / 2, 0]}>
          <boxGeometry args={[0.025, 0.0015, 0.0015]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.8} />
        </mesh>

        {/* Slim, compact HTML Badge Label */}
        <Html center position={[-0.04, 0, 0]} zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-950/85 border border-purple-400/40 backdrop-blur-sm text-[10px] font-mono text-slate-200 select-none whitespace-nowrap shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0"></span>
            <span className="text-slate-400 font-normal">H:</span>
            <span className="font-normal text-white">{dimensions.height}</span>
            <span className="text-[9px] text-slate-400 font-normal">mm</span>
          </div>
        </Html>
      </group>

      {/* ================= DEPTH DIMENSION (Z-axis, right side) ================= */}
      <group position={[depthOffsetX, 0.04, 0]}>
        {/* Depth leader line */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.0015, 0.0015, d]} />
          <meshBasicMaterial color="#34d399" transparent opacity={0.6} />
        </mesh>
        {/* Back tick */}
        <mesh position={[0, 0, -d / 2]}>
          <boxGeometry args={[0.025, 0.0015, 0.0015]} />
          <meshBasicMaterial color="#34d399" transparent opacity={0.8} />
        </mesh>
        {/* Front tick */}
        <mesh position={[0, 0, d / 2]}>
          <boxGeometry args={[0.025, 0.0015, 0.0015]} />
          <meshBasicMaterial color="#34d399" transparent opacity={0.8} />
        </mesh>

        {/* Slim, compact HTML Badge Label */}
        <Html center position={[0.04, 0, 0]} zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-950/85 border border-emerald-400/40 backdrop-blur-sm text-[10px] font-mono text-slate-200 select-none whitespace-nowrap shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
            <span className="text-slate-400 font-normal">D:</span>
            <span className="font-normal text-white">{dimensions.depth}</span>
            <span className="text-[9px] text-slate-400 font-normal">mm</span>
          </div>
        </Html>
      </group>
    </group>
  );
};

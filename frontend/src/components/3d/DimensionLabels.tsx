import React from 'react';
import { Html } from '@react-three/drei';
import type { CabinetDimensions } from '../../types';

interface DimensionLabelsProps {
  dimensions: CabinetDimensions;
  visible: boolean;
}

/**
 * DimensionLabels Component
 * Renders sleek, compact architectural leader lines and subtle measurement badges (L, H, D).
 */
export const DimensionLabels: React.FC<DimensionLabelsProps> = ({ dimensions, visible }) => {
  if (!visible) return null;

  // Convert mm to meters for Three.js coordinates
  const w = dimensions.width / 1000;
  const h = dimensions.height / 1000;
  const d = dimensions.depth / 1000;

  // Offsets to float labels slightly away from the model with generous clearance
  const widthOffsetZ = d / 2 + 0.08;
  const heightOffsetX = -w / 2 - 0.08;
  const depthOffsetX = w / 2 + 0.08;

  return (
    <group name="dimension-labels">
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

        {/* Sleek compact HTML Badge Label */}
        <Html center position={[0, 0.035, 0]} distanceFactor={5.2} style={{ pointerEvents: 'none' }}>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-900/90 border border-sky-400/40 backdrop-blur-md text-[11px] font-mono text-sky-200 select-none whitespace-nowrap shadow-md">
            <span className="w-1 h-1 rounded-full bg-sky-400"></span>
            <span className="text-slate-400 text-[10px]">L:</span>
            <span className="font-normal text-white">{dimensions.width}</span>
            <span className="text-[10px] text-slate-400">mm</span>
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

        {/* Sleek compact HTML Badge Label */}
        <Html center position={[-0.05, 0, 0]} distanceFactor={5.2} style={{ pointerEvents: 'none' }}>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-900/90 border border-purple-400/40 backdrop-blur-md text-[11px] font-mono text-purple-200 select-none whitespace-nowrap shadow-md">
            <span className="w-1 h-1 rounded-full bg-purple-400"></span>
            <span className="text-slate-400 text-[10px]">H:</span>
            <span className="font-normal text-white">{dimensions.height}</span>
            <span className="text-[10px] text-slate-400">mm</span>
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

        {/* Sleek compact HTML Badge Label */}
        <Html center position={[0.05, 0, 0]} distanceFactor={5.2} style={{ pointerEvents: 'none' }}>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-900/90 border border-emerald-400/40 backdrop-blur-md text-[11px] font-mono text-emerald-200 select-none whitespace-nowrap shadow-md">
            <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
            <span className="text-slate-400 text-[10px]">D:</span>
            <span className="font-normal text-white">{dimensions.depth}</span>
            <span className="text-[10px] text-slate-400">mm</span>
          </div>
        </Html>
      </group>
    </group>
  );
};

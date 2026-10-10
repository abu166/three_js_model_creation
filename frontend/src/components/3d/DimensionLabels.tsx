import React from 'react';
import { Html } from '@react-three/drei';
import type { CabinetDimensions } from '../../types';

interface DimensionLabelsProps {
  dimensions: CabinetDimensions;
  visible: boolean;
}

/**
 * DimensionLabels Component
 * Renders 3D leader lines and dynamic measurement badges (Width, Height, Depth)
 * using @react-three/drei's Html component.
 *
 * Coordinates are computed in meters (1 unit = 1 meter):
 * - Width (X-axis): spanned across [-w/2, w/2]
 * - Height (Y-axis): spanned from [0, h]
 * - Depth (Z-axis): spanned across [-d/2, d/2]
 */
export const DimensionLabels: React.FC<DimensionLabelsProps> = ({ dimensions, visible }) => {
  if (!visible) return null;

  // Convert mm to meters for Three.js coordinates
  const w = dimensions.width / 1000;
  const h = dimensions.height / 1000;
  const d = dimensions.depth / 1000;

  // Offsets to float labels slightly away from the model
  const widthOffsetZ = d / 2 + 0.08;
  const heightOffsetX = -w / 2 - 0.08;
  const depthOffsetX = w / 2 + 0.08;

  return (
    <group name="dimension-labels">
      {/* ================= WIDTH DIMENSION (X-axis, front bottom) ================= */}
      <group position={[0, 0.02, widthOffsetZ]}>
        {/* Leader line along bottom front */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[w, 0.002, 0.002]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} />
        </mesh>
        {/* Left tick */}
        <mesh position={[-w / 2, 0, 0]}>
          <boxGeometry args={[0.002, 0.03, 0.002]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} />
        </mesh>
        {/* Right tick */}
        <mesh position={[w / 2, 0, 0]}>
          <boxGeometry args={[0.002, 0.03, 0.002]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} />
        </mesh>

        {/* HTML Badge Label */}
        <Html center position={[0, -0.05, 0]} distanceFactor={3.2} style={{ pointerEvents: 'none' }}>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-sky-400/50 shadow-lg shadow-sky-500/20 backdrop-blur-md text-xs font-mono text-sky-200 select-none whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
            <span className="text-slate-400 font-sans font-medium text-[10px]">W:</span>
            <span className="font-semibold text-white">{dimensions.width}</span>
            <span className="text-[10px] text-sky-400">mm</span>
          </div>
        </Html>
      </group>

      {/* ================= HEIGHT DIMENSION (Y-axis, left edge) ================= */}
      <group position={[heightOffsetX, h / 2, d / 2]}>
        {/* Vertical leader line */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.002, h, 0.002]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.6} />
        </mesh>
        {/* Bottom tick */}
        <mesh position={[0, -h / 2, 0]}>
          <boxGeometry args={[0.03, 0.002, 0.002]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.8} />
        </mesh>
        {/* Top tick */}
        <mesh position={[0, h / 2, 0]}>
          <boxGeometry args={[0.03, 0.002, 0.002]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.8} />
        </mesh>

        {/* HTML Badge Label */}
        <Html center position={[-0.07, 0, 0]} distanceFactor={3.2} style={{ pointerEvents: 'none' }}>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-purple-400/50 shadow-lg shadow-purple-500/20 backdrop-blur-md text-xs font-mono text-purple-200 select-none whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
            <span className="text-slate-400 font-sans font-medium text-[10px]">H:</span>
            <span className="font-semibold text-white">{dimensions.height}</span>
            <span className="text-[10px] text-purple-400">mm</span>
          </div>
        </Html>
      </group>

      {/* ================= DEPTH DIMENSION (Z-axis, right side) ================= */}
      <group position={[depthOffsetX, 0.02, 0]}>
        {/* Depth leader line */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.002, 0.002, d]} />
          <meshBasicMaterial color="#34d399" transparent opacity={0.6} />
        </mesh>
        {/* Back tick */}
        <mesh position={[0, 0, -d / 2]}>
          <boxGeometry args={[0.03, 0.002, 0.002]} />
          <meshBasicMaterial color="#34d399" transparent opacity={0.8} />
        </mesh>
        {/* Front tick */}
        <mesh position={[0, 0, d / 2]}>
          <boxGeometry args={[0.03, 0.002, 0.002]} />
          <meshBasicMaterial color="#34d399" transparent opacity={0.8} />
        </mesh>

        {/* HTML Badge Label */}
        <Html center position={[0.07, 0, 0]} distanceFactor={3.2} style={{ pointerEvents: 'none' }}>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-emerald-400/50 shadow-lg shadow-emerald-500/20 backdrop-blur-md text-xs font-mono text-emerald-200 select-none whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-400 font-sans font-medium text-[10px]">D:</span>
            <span className="font-semibold text-white">{dimensions.depth}</span>
            <span className="text-[10px] text-emerald-400">mm</span>
          </div>
        </Html>
      </group>
    </group>
  );
};

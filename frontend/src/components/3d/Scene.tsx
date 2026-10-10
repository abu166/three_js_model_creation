import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { Cabinet } from './Cabinet';
import { DimensionLabels } from './DimensionLabels';
import type { CabinetColor, CabinetDimensions } from '../../types';

interface SceneProps {
  dimensions: CabinetDimensions;
  color: CabinetColor;
  isDoorOpen: boolean;
  showDimensions: boolean;
  wireframe: boolean;
  autoRotate: boolean;
  onToggleDoor: () => void;
  resetCameraTrigger?: number;
}

/**
 * Camera & Controls synchronizer
 * Adjusts target center as cabinet height dynamically updates
 */
const ControlsManager: React.FC<{
  targetY: number;
  autoRotate: boolean;
  resetTrigger?: number;
}> = ({ targetY, autoRotate, resetTrigger }) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  // Smoothly align target Y center to middle of cabinet
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.set(0, targetY, 0);
      controlsRef.current.update();
    }
  }, [targetY]);

  // Handle manual camera reset button
  useEffect(() => {
    if (controlsRef.current && resetTrigger && resetTrigger > 0) {
      controlsRef.current.reset();
      controlsRef.current.target.set(0, targetY, 0);
      controlsRef.current.update();
    }
  }, [resetTrigger, targetY]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.06}
      minDistance={0.7}
      maxDistance={4.5}
      maxPolarAngle={Math.PI / 2 - 0.04} // Prevent camera from going beneath floor plane
      minPolarAngle={0.1}
      autoRotate={autoRotate}
      autoRotateSpeed={1.2}
      target={[0, targetY, 0]}
    />
  );
};

/**
 * 3D Canvas Scene
 * Encapsulates:
 * - Three.js WebGL Canvas with PBR tone mapping
 * - Realistic studio three-point lighting & shadow mapping
 * - HDRI City environment for natural reflections
 * - Contact shadows floor plane
 * - Interactive Cabinet & dynamic Dimension labels
 */
export const Scene: React.FC<SceneProps> = ({
  dimensions,
  color,
  isDoorOpen,
  showDimensions,
  wireframe,
  autoRotate,
  onToggleDoor,
  resetCameraTrigger,
}) => {
  // Center of the cabinet in meters (1 unit = 1m)
  const targetY = (dimensions.height / 1000) / 2;

  return (
    <div className="absolute inset-0 w-full h-full select-none overflow-hidden">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{
          position: [1.75, 1.35, 2.1],
          fov: 38,
          near: 0.1,
          far: 20,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'default',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        {/* ================= LIGHTING SETUP ================= */}
        {/* Ambient & Hemisphere fill lights - guarantees visibility even if external HDR is blocked */}
        <ambientLight intensity={0.5} />
        <hemisphereLight intensity={0.55} groundColor="#1e293b" color="#ffffff" />

        {/* Primary Key Light with Apple Metal / Safari compatible shadow params */}
        <directionalLight
          position={[3.5, 5, 3]}
          intensity={1.9}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0005}
          shadow-normalBias={0.02}
          shadow-camera-near={0.5}
          shadow-camera-far={12}
          shadow-camera-left={-2}
          shadow-camera-right={2}
          shadow-camera-top={2}
          shadow-camera-bottom={-2}
        />

        {/* Cool Rim / Fill light from the opposite quadrant */}
        <directionalLight
          position={[-3, 3, -2.5]}
          intensity={0.6}
          color="#93c5fd"
        />

        {/* Subtle warm under-bounce fill */}
        <directionalLight
          position={[0, -2, 2]}
          intensity={0.15}
          color="#fde68a"
        />

        {/* ================= ENVIRONMENT & REFLECTIONS ================= */}
        {/* Isolated in Suspense so if external HDR CDN is blocked by Safari ITP, canvas does not freeze */}
        <Suspense fallback={null}>
          <Environment preset="city" environmentIntensity={0.65} />
        </Suspense>

        {/* ================= 3D CABINET MODEL & LABELS ================= */}
        <group name="interactive-scene">
          <Cabinet
            dimensions={dimensions}
            color={color}
            isDoorOpen={isDoorOpen}
            wireframe={wireframe}
            onToggleDoor={onToggleDoor}
          />

          <DimensionLabels
            dimensions={dimensions}
            visible={showDimensions}
          />
        </group>

        {/* ================= CONTACT SHADOWS FLOOR ================= */}
        <Suspense fallback={null}>
          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.7}
            scale={5}
            blur={1.8}
            far={1.6}
            resolution={1024}
            color="#030712"
          />
        </Suspense>

        {/* Subtle studio circular floor pedestal */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.002, 0]}
          receiveShadow
        >
          <circleGeometry args={[2.8, 64]} />
          <meshStandardMaterial
            color="#0f172a"
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>

        {/* Orbit Camera Controls with responsive focal target */}
        <ControlsManager
          targetY={targetY}
          autoRotate={autoRotate}
          resetTrigger={resetCameraTrigger}
        />
      </Canvas>
    </div>
  );
};

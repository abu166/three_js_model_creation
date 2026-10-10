import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { Cabinet } from './Cabinet';
import { DimensionLabels } from './DimensionLabels';
import type { CabinetColor, CabinetDimensions, AmbientTheme } from '../../types';

interface SceneProps {
  dimensions: CabinetDimensions;
  color: CabinetColor;
  ambientTheme: AmbientTheme;
  isDoorOpen: boolean;
  showDimensions: boolean;
  wireframe: boolean;
  autoRotate: boolean;
  onToggleDoor: () => void;
  resetCameraTrigger?: number;
}

// Global cached textures for room interior
let cachedFloorTexture: THREE.Texture | null = null;
let cachedArtTexture: THREE.Texture | null = null;

/**
 * Camera & Controls synchronizer
 * Adjusts focal target smoothly as cabinet height changes
 */
const ControlsManager: React.FC<{
  targetY: number;
  autoRotate: boolean;
  resetTrigger?: number;
}> = ({ targetY, autoRotate, resetTrigger }) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.set(0, targetY, 0);
      controlsRef.current.update();
    }
  }, [targetY]);

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
      minDistance={0.8}
      maxDistance={4.5}
      maxPolarAngle={Math.PI / 2 - 0.02} // Stop camera at floor level
      minPolarAngle={0.15}
      autoRotate={autoRotate}
      autoRotateSpeed={1.2}
      target={[0, targetY, 0]}
    />
  );
};

/**
 * Modern Sculpted Indoor Plant Component
 * Fluted ceramic pot, organic soil, slender stems, and sculpted monstera leaves
 */
const IndoorPlant: React.FC = () => {
  return (
    <group position={[-1.25, 0, -0.15]}>
      {/* Ceramic Fluted Planter Pot */}
      <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.15, 0.11, 0.36, 32]} />
        <meshStandardMaterial
          color="#f4eee7"
          roughness={0.75}
          metalness={0.05}
        />
      </mesh>

      {/* Dark Potting Soil */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.02, 24]} />
        <meshStandardMaterial color="#2b1d14" roughness={0.95} />
      </mesh>

      {/* Leaf 1 (Tall center-left) */}
      <group position={[-0.03, 0.36, 0.02]} rotation={[0.15, 0.3, -0.2]}>
        <mesh position={[0, 0.28, 0]} castShadow>
          <cylinderGeometry args={[0.005, 0.008, 0.55, 8]} />
          <meshStandardMaterial color="#365314" roughness={0.6} />
        </mesh>
        <mesh position={[-0.05, 0.55, 0.04]} rotation={[0.4, 0.2, -0.3]} castShadow>
          <boxGeometry args={[0.18, 0.26, 0.002]} />
          <meshStandardMaterial color="#2d4a1d" roughness={0.5} />
        </mesh>
      </group>

      {/* Leaf 2 (Upper right spread toward cabinet) */}
      <group position={[0.04, 0.36, -0.02]} rotation={[-0.1, -0.4, 0.25]}>
        <mesh position={[0, 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.005, 0.008, 0.5, 8]} />
          <meshStandardMaterial color="#365314" roughness={0.6} />
        </mesh>
        <mesh position={[0.06, 0.48, -0.04]} rotation={[-0.3, -0.3, 0.3]} castShadow>
          <boxGeometry args={[0.17, 0.24, 0.002]} />
          <meshStandardMaterial color="#365314" roughness={0.5} />
        </mesh>
      </group>

      {/* Leaf 3 (Front drooping leaf) */}
      <group position={[0.02, 0.36, 0.06]} rotation={[0.4, 0.1, 0.1]}>
        <mesh position={[0, 0.18, 0]} castShadow>
          <cylinderGeometry args={[0.004, 0.007, 0.36, 8]} />
          <meshStandardMaterial color="#3f6212" roughness={0.6} />
        </mesh>
        <mesh position={[0.02, 0.34, 0.05]} rotation={[0.5, 0, 0.1]} castShadow>
          <boxGeometry args={[0.15, 0.22, 0.002]} />
          <meshStandardMaterial color="#2d4a1d" roughness={0.5} />
        </mesh>
      </group>

      {/* Leaf 4 (Back wall angled leaf) */}
      <group position={[-0.03, 0.36, -0.05]} rotation={[-0.3, 0.4, -0.2]}>
        <mesh position={[0, 0.22, 0]} castShadow>
          <cylinderGeometry args={[0.004, 0.007, 0.42, 8]} />
          <meshStandardMaterial color="#3f6212" roughness={0.6} />
        </mesh>
        <mesh position={[-0.04, 0.42, -0.05]} rotation={[-0.4, 0.2, -0.2]} castShadow>
          <boxGeometry args={[0.16, 0.23, 0.002]} />
          <meshStandardMaterial color="#365314" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
};

/**
 * Designer Minimalist Floor Lamp (Active in Night mode)
 */
const CozyFloorLamp: React.FC<{ active: boolean }> = ({ active }) => {
  if (!active) return null;

  return (
    <group position={[-1.35, 0, 0.1]}>
      {/* Heavy brass circular base */}
      <mesh position={[0, 0.015, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.11, 0.03, 24]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Slender vertical stand */}
      <mesh position={[0, 0.72, 0]} castShadow>
        <cylinderGeometry args={[0.006, 0.006, 1.4, 16]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Modern dome lamp shade */}
      <mesh position={[0, 1.38, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.14, 0.12, 24, 1, true]} />
        <meshStandardMaterial
          color="#1e293b"
          metalness={0.7}
          roughness={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Glowing Warm Light Bulb Mesh */}
      <mesh position={[0, 1.35, 0]}>
        <sphereGeometry args={[0.032, 16, 16]} />
        <meshBasicMaterial color="#fed7aa" />
      </mesh>

      {/* Warm 2700K pointLight casting lamp glow */}
      <pointLight
        position={[0, 1.32, 0]}
        intensity={1.8}
        color="#fed7aa"
        distance={4.5}
        decay={2}
        castShadow
        shadow-bias={-0.001}
      />
    </group>
  );
};

/**
 * RoomInterior Component
 * Renders realistic hardwood floor, warm backdrop wall, architectural baseboards,
 * framed modern wall art, and cozy indoor plant
 */
const RoomInterior: React.FC<{ ambientTheme: AmbientTheme }> = ({ ambientTheme }) => {
  const [floorTexture, setFloorTexture] = useState<THREE.Texture | null>(cachedFloorTexture);
  const [artTexture, setArtTexture] = useState<THREE.Texture | null>(cachedArtTexture);

  useEffect(() => {
    const loader = new THREE.TextureLoader();

    if (!cachedFloorTexture) {
      loader.load('/textures/hardwood_floor.jpg', (tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(5, 5);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.needsUpdate = true;
        cachedFloorTexture = tex;
        setFloorTexture(tex);
      });
    }

    if (!cachedArtTexture) {
      loader.load('/textures/wall_art.jpg', (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.needsUpdate = true;
        cachedArtTexture = tex;
        setArtTexture(tex);
      });
    }
  }, []);

  // Theme-tailored colors
  const wallColor =
    ambientTheme === 'day'
      ? '#f5f1eb'
      : ambientTheme === 'night'
      ? '#181b24'
      : '#1e293b';

  const baseboardColor =
    ambientTheme === 'day'
      ? '#ffffff'
      : ambientTheme === 'night'
      ? '#111827'
      : '#0f172a';

  return (
    <group name="room-interior">
      {/* ================= 1. HARDWOOD FLOOR PLANE ================= */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial
          key={`floor-${Boolean(floorTexture)}`}
          color={ambientTheme === 'night' ? '#c5b8a8' : '#ffffff'}
          map={floorTexture}
          roughness={ambientTheme === 'night' ? 0.65 : 0.55}
          metalness={0.04}
        />
      </mesh>

      {/* ================= 2. WARM INTERIOR BACK WALL ================= */}
      <mesh position={[0, 3.5, -1.35]} receiveShadow>
        <planeGeometry args={[16, 7]} />
        <meshStandardMaterial
          color={wallColor}
          roughness={0.92}
          metalness={0.02}
        />
      </mesh>

      {/* ================= 3. ARCHITECTURAL BASEBOARD TRIM ================= */}
      <mesh position={[0, 0.055, -1.34]} receiveShadow castShadow>
        <boxGeometry args={[16, 0.11, 0.02]} />
        <meshStandardMaterial
          color={baseboardColor}
          roughness={0.65}
          metalness={0.05}
        />
      </mesh>
      {/* Top baseboard bevel accent */}
      <mesh position={[0, 0.112, -1.338]}>
        <boxGeometry args={[16, 0.006, 0.016]} />
        <meshStandardMaterial
          color={baseboardColor}
          roughness={0.5}
          metalness={0.05}
        />
      </mesh>

      {/* ================= 4. FRAMED GALLERY WALL ART ================= */}
      <group position={[-0.2, 1.35, -1.33]}>
        {/* Gallery Outer Frame (Matte Black / Walnut) */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.08, 1.44, 0.02]} />
          <meshStandardMaterial
            color={ambientTheme === 'night' ? '#0f172a' : '#1e293b'}
            roughness={0.5}
            metalness={0.2}
          />
        </mesh>
        {/* White Gallery Mat Border */}
        <mesh position={[0, 0, 0.011]}>
          <planeGeometry args={[1.02, 1.38]} />
          <meshStandardMaterial color="#faf8f5" roughness={0.9} />
        </mesh>
        {/* Canvas Artwork Print */}
        <mesh position={[0, 0, 0.012]}>
          <planeGeometry args={[0.88, 1.22]} />
          <meshStandardMaterial
            key={`art-${Boolean(artTexture)}`}
            color="#ffffff"
            map={artTexture}
            roughness={0.65}
            metalness={0.02}
          />
        </mesh>
      </group>

      {/* ================= 5. INDOOR DECOR ASSETS ================= */}
      <IndoorPlant />
      <CozyFloorLamp active={ambientTheme === 'night'} />
    </group>
  );
};

/**
 * Natural Ambient Lighting System
 * Handles 'day', 'night', and 'studio' atmospheric themes
 */
const CinematicLighting: React.FC<{ ambientTheme: AmbientTheme }> = ({ ambientTheme }) => {
  return (
    <>
      {/* ================= DAY THEME: Natural Window Sunlight ================= */}
      {ambientTheme === 'day' && (
        <>
          {/* Soft ambient & sky fill */}
          <ambientLight intensity={0.55} color="#ffffff" />
          <hemisphereLight
            intensity={0.6}
            color="#f8fafc"
            groundColor="#e2e8f0"
          />

          {/* High-intensity streaming sunlight through invisible left window */}
          <directionalLight
            position={[-4.5, 5.2, 3.2]}
            intensity={2.8}
            color="#fffbf0"
            castShadow
            shadow-bias={-0.0001}
            shadow-normalBias={0.02}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-near={0.5}
            shadow-camera-far={14}
            shadow-camera-left={-2.5}
            shadow-camera-right={2.5}
            shadow-camera-top={3.2}
            shadow-camera-bottom={-1.5}
          />

          {/* Gentle room ambient bounce from opposite quadrant */}
          <directionalLight
            position={[3, 3, 2]}
            intensity={0.45}
            color="#f1f5f9"
          />

          {/* Soft window skylight glow */}
          <directionalLight
            position={[-5, 2, 0.5]}
            intensity={0.55}
            color="#e0f2fe"
          />
        </>
      )}

      {/* ================= NIGHT THEME: Warm Cozy Overhead & Accent Lamp ================= */}
      {ambientTheme === 'night' && (
        <>
          {/* Dim evening room ambient */}
          <ambientLight intensity={0.22} color="#1e1b4b" />
          <hemisphereLight
            intensity={0.28}
            color="#334155"
            groundColor="#0f172a"
          />

          {/* Warm overhead recessed spotlight casting rich, soft shadows */}
          <spotLight
            position={[0, 4.2, 0.8]}
            intensity={2.5}
            color="#fed7aa"
            angle={Math.PI / 3}
            penumbra={1}
            castShadow
            shadow-bias={-0.0001}
            shadow-normalBias={0.02}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />

          {/* Subtle soft rim fill to preserve cabinet edges */}
          <directionalLight
            position={[-2.5, 2, -1]}
            intensity={0.3}
            color="#94a3b8"
          />

          {/* Warm front fill light to illuminate front cabinet door and brass handle */}
          <directionalLight
            position={[1.2, 2.2, 2.8]}
            intensity={0.75}
            color="#fde68a"
          />

          {/* Warm under-cabinet floor bounce */}
          <pointLight
            position={[0, 0.08, 0]}
            intensity={0.4}
            color="#fb923c"
            distance={1.6}
            decay={2}
          />
        </>
      )}

      {/* ================= STUDIO THEME: Clean Gallery 3-Point Lighting ================= */}
      {ambientTheme === 'studio' && (
        <>
          <ambientLight intensity={0.5} color="#ffffff" />
          <hemisphereLight
            intensity={0.55}
            color="#ffffff"
            groundColor="#1e293b"
          />

          {/* Key Light */}
          <directionalLight
            position={[3.5, 5, 3]}
            intensity={2.2}
            color="#ffffff"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-bias={-0.0005}
            shadow-normalBias={0.02}
            shadow-camera-near={0.5}
            shadow-camera-far={12}
            shadow-camera-left={-2.5}
            shadow-camera-right={2.5}
            shadow-camera-top={2.5}
            shadow-camera-bottom={-2}
          />

          {/* Cool Rim / Fill light */}
          <directionalLight
            position={[-3.5, 3.5, -2.5]}
            intensity={0.7}
            color="#93c5fd"
          />

          {/* Soft Front Fill */}
          <directionalLight
            position={[0, 2, 3.5]}
            intensity={0.35}
            color="#ffffff"
          />
        </>
      )}
    </>
  );
};

/**
 * 3D Canvas Scene
 * Encapsulates:
 * - Three.js WebGL Canvas with ACESFilmic tone mapping
 * - Realistic indoor room backdrop (hardwood floor, warm wall, baseboards, art, plant)
 * - Cinematic dual/tri ambient lighting (Day sunlight, Night cozy, Studio photoshoot)
 * - Grounding ContactShadows
 * - Interactive Cabinet & dynamic Dimension labels
 */
export const Scene: React.FC<SceneProps> = ({
  dimensions,
  color,
  ambientTheme,
  isDoorOpen,
  showDimensions,
  wireframe,
  autoRotate,
  onToggleDoor,
  resetCameraTrigger,
}) => {
  // Center focal height of the cabinet in meters
  const targetY = (dimensions.height / 1000) / 2;

  // Environment preset tailored to active theme
  const envPreset =
    ambientTheme === 'day'
      ? 'apartment'
      : ambientTheme === 'night'
      ? 'night'
      : 'city';

  const envIntensity =
    ambientTheme === 'day'
      ? 0.65
      : ambientTheme === 'night'
      ? 0.25
      : 0.7;

  return (
    <div className="absolute inset-0 w-full h-full select-none overflow-hidden">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{
          position: [1.85, 1.4, 2.2],
          fov: 38,
          near: 0.1,
          far: 25,
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'default',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: ambientTheme === 'night' ? 1.05 : 1.18,
        }}
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        {/* ================= CAMERA CONTROLS ================= */}
        <ControlsManager
          targetY={targetY}
          autoRotate={autoRotate}
          resetTrigger={resetCameraTrigger}
        />

        {/* ================= CINEMATIC LIGHTING ================= */}
        <CinematicLighting ambientTheme={ambientTheme} />

        {/* ================= NATURAL ENVIRONMENT REFLECTIONS ================= */}
        <Suspense fallback={null}>
          <Environment
            key={envPreset}
            preset={envPreset}
            background={false}
            environmentIntensity={envIntensity}
          />
        </Suspense>

        {/* ================= ROOM INTERIOR BACKDROP ================= */}
        <RoomInterior ambientTheme={ambientTheme} />

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

        {/* ================= CONTACT SHADOWS (GROUNDING) ================= */}
        <Suspense fallback={null}>
          <ContactShadows
            position={[0, 0.001, 0]}
            opacity={ambientTheme === 'night' ? 0.75 : 0.6}
            scale={10}
            blur={2.5}
            far={2}
            color={ambientTheme === 'night' ? '#030712' : '#0f172a'}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

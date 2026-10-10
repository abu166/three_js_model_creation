import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { CabinetColor, CabinetDimensions } from '../../types';
import { COLOR_OPTIONS } from '../../types';

// Global texture cache across re-renders
let cachedWalnutTexture: THREE.Texture | null = null;

interface CabinetProps {
  dimensions: CabinetDimensions;
  color: CabinetColor;
  isDoorOpen?: boolean;
  wireframe?: boolean;
  onToggleDoor?: () => void;
}

/**
 * Universal Cabinet Material Selector
 * Non-blocking, cross-browser resilient material loader (Chrome, Safari, Firefox, Mobile)
 * Displays rich walnut fallback immediately and seamlessly applies texture once loaded.
 */
const CabinetMaterial: React.FC<{ color: CabinetColor; wireframe?: boolean }> = ({
  color,
  wireframe = false,
}) => {
  const [texture, setTexture] = useState<THREE.Texture | null>(cachedWalnutTexture);

  useEffect(() => {
    if (color === 'walnut' && !cachedWalnutTexture) {
      const loader = new THREE.TextureLoader();
      loader.load(
        '/textures/walnut.jpg',
        (loadedTex) => {
          loadedTex.wrapS = THREE.RepeatWrapping;
          loadedTex.wrapT = THREE.RepeatWrapping;
          loadedTex.repeat.set(1.8, 1.8);
          loadedTex.colorSpace = THREE.SRGBColorSpace;
          loadedTex.needsUpdate = true;
          cachedWalnutTexture = loadedTex;
          setTexture(loadedTex);
        },
        undefined,
        (err) => {
          console.warn('Walnut texture load error, using fallback:', err);
        }
      );
    }
  }, [color]);

  if (color === 'walnut') {
    return (
      <meshStandardMaterial
        color={texture ? undefined : '#4A3222'}
        map={texture || undefined}
        roughness={0.45}
        metalness={0.05}
        wireframe={wireframe}
      />
    );
  }

  const colorDef = COLOR_OPTIONS.find((c) => c.id === color) || COLOR_OPTIONS[0];

  return (
    <meshStandardMaterial
      color={colorDef.hex}
      roughness={colorDef.roughness}
      metalness={colorDef.metalness}
      wireframe={wireframe}
    />
  );
};

/**
 * Cabinet 3D Model Component
 * Features:
 * - Dynamic scaling based on Width, Height, Depth (1 unit = 1 meter)
 * - Carcase panels (top, bottom, sides, back, internal shelf)
 * - Offset front door panel with smooth opening/closing hinge physics
 * - Sleek modern metal handle (brushed gold/brass)
 * - 4 tapered designer metal legs with brass tips
 * - Casts & receives realistic shadows
 */
export const Cabinet: React.FC<CabinetProps> = ({
  dimensions,
  color,
  isDoorOpen = false,
  wireframe = false,
  onToggleDoor,
}) => {
  // Convert mm to meters (1 unit = 1 meter)
  const w = dimensions.width / 1000;
  const h = dimensions.height / 1000;
  const d = dimensions.depth / 1000;

  // Structural constants
  const legH = 0.1; // 100mm legs
  const panelT = 0.018; // 18mm board thickness
  const carcaseH = Math.max(0.18, h - legH);
  const internalH = Math.max(0.1, carcaseH - 2 * panelT);

  // Door hinge animation ref: opens forward (+Z direction) into the room
  const doorHingeRef = useRef<THREE.Group>(null);
  const targetRotation = isDoorOpen ? -Math.PI * 0.45 : 0; // -80 degrees outward/forward toward the viewer

  // Smooth lerp for door opening/closing animation
  useFrame((_, delta) => {
    if (doorHingeRef.current) {
      doorHingeRef.current.rotation.y = THREE.MathUtils.damp(
        doorHingeRef.current.rotation.y,
        targetRotation,
        8,
        delta
      );
    }
  });

  // Door dimensions
  const doorW = w - 0.008;
  const doorH = carcaseH - 0.008;
  const doorT = 0.018;

  // Legs positioning (inset slightly from corners)
  const legInsetX = Math.min(0.06, w * 0.15);
  const legInsetZ = Math.min(0.06, d * 0.15);
  const legX = w / 2 - legInsetX;
  const legZ = d / 2 - legInsetZ;

  return (
    <group name="cabinet-root">
      {/* ================= 1. LEGS (4 Tapered Legs) ================= */}
      {[
        [-legX, -legZ],
        [legX, -legZ],
        [-legX, legZ],
        [legX, legZ],
      ].map(([x, z], idx) => (
        <group key={`leg-${idx}`} position={[x, 0, z]}>
          {/* Main leg cylinder */}
          <mesh position={[0, legH / 2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.012, 0.008, legH, 16]} />
            <meshStandardMaterial
              color="#1e293b"
              metalness={0.8}
              roughness={0.3}
              wireframe={wireframe}
            />
          </mesh>
          {/* Brass foot accent ring */}
          <mesh position={[0, 0.01, 0]} castShadow>
            <cylinderGeometry args={[0.009, 0.008, 0.02, 16]} />
            <meshStandardMaterial
              color="#d4af37"
              metalness={0.9}
              roughness={0.2}
              wireframe={wireframe}
            />
          </mesh>
        </group>
      ))}

      {/* ================= 2. CARCASE (Main Cabinet Body) ================= */}
      <group position={[0, legH, 0]}>
        {/* Bottom panel */}
        <mesh position={[0, panelT / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[w, panelT, d]} />
          <CabinetMaterial color={color} wireframe={wireframe} />
        </mesh>

        {/* Top panel */}
        <mesh position={[0, carcaseH - panelT / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[w, panelT, d]} />
          <CabinetMaterial color={color} wireframe={wireframe} />
        </mesh>

        {/* Left panel */}
        <mesh
          position={[-w / 2 + panelT / 2, carcaseH / 2, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[panelT, internalH, d]} />
          <CabinetMaterial color={color} wireframe={wireframe} />
        </mesh>

        {/* Right panel */}
        <mesh
          position={[w / 2 - panelT / 2, carcaseH / 2, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[panelT, internalH, d]} />
          <CabinetMaterial color={color} wireframe={wireframe} />
        </mesh>

        {/* Back panel */}
        <mesh
          position={[0, carcaseH / 2, -d / 2 + panelT / 2]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[w - 2 * panelT, internalH, panelT]} />
          <CabinetMaterial color={color} wireframe={wireframe} />
        </mesh>

        {/* Internal shelf */}
        <mesh
          position={[0, carcaseH / 2, -panelT]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[w - 2 * panelT, panelT, d - 2 * panelT]} />
          <CabinetMaterial color={color} wireframe={wireframe} />
        </mesh>

        {/* ================= 3. DOOR & HINGE ================= */}
        {/*
          Door Hinge is placed at the left edge of the cabinet face:
          x = -w/2 + 0.004, z = d/2 + doorT/2 + 0.002
          Rotating this group smoothly opens the door like a real cabinet hinge.
        */}
        <group
          ref={doorHingeRef}
          position={[-w / 2 + 0.004, carcaseH / 2, d / 2 + doorT / 2 + 0.002]}
        >
          {/* Door panel - offset to pivot on its left edge */}
          <mesh
            position={[doorW / 2, 0, 0]}
            castShadow
            receiveShadow
            onClick={(e) => {
              e.stopPropagation();
              onToggleDoor?.();
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'auto';
            }}
          >
            <boxGeometry args={[doorW, doorH, doorT]} />
            <CabinetMaterial color={color} wireframe={wireframe} />
          </mesh>

          {/* ================= 4. DOOR HANDLE ================= */}
          {/*
            Sleek cylindrical pull handle placed on the right side of the door.
            Crafted from luxurious brushed champagne brass.
          */}
          <group
            position={[doorW - 0.045, 0, doorT / 2 + 0.015]}
            onClick={(e) => {
              e.stopPropagation();
              onToggleDoor?.();
            }}
          >
            {/* Main vertical bar handle */}
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.006, 0.006, 0.14, 24]} />
              <meshStandardMaterial
                color="#d4af37"
                metalness={0.9}
                roughness={0.2}
                wireframe={wireframe}
              />
            </mesh>

            {/* Top mounting standoff post */}
            <mesh
              position={[0, 0.05, -0.01]}
              rotation={[Math.PI / 2, 0, 0]}
              castShadow
            >
              <cylinderGeometry args={[0.004, 0.004, 0.02, 16]} />
              <meshStandardMaterial
                color="#c59b27"
                metalness={0.9}
                roughness={0.25}
                wireframe={wireframe}
              />
            </mesh>

            {/* Bottom mounting standoff post */}
            <mesh
              position={[0, -0.05, -0.01]}
              rotation={[Math.PI / 2, 0, 0]}
              castShadow
            >
              <cylinderGeometry args={[0.004, 0.004, 0.02, 16]} />
              <meshStandardMaterial
                color="#c59b27"
                metalness={0.9}
                roughness={0.25}
                wireframe={wireframe}
              />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
};

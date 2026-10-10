import React, { useState, useCallback } from 'react';
import { Scene } from './3d/Scene';
import { ControlPanel } from './ui/ControlPanel';
import { Layout } from './ui/Layout';
import type { CabinetColor, CabinetDimensions, CabinetConfig, AmbientTheme } from '../types';
import { DIMENSION_LIMITS } from '../types';

export const App: React.FC = () => {
  // Main Configurator State
  const [config, setConfig] = useState<CabinetConfig>({
    dimensions: {
      width: 800,
      height: 650,
      depth: 450,
    },
    color: 'walnut', // Default to Walnut to immediately showcase rich texture mapping
    ambientTheme: 'day', // Cinematic indoor natural daylight by default
    isDoorOpen: false,
    showDimensions: true,
    wireframe: false,
    autoRotate: false,
  });

  // Camera reset trigger
  const [resetCameraTrigger, setResetCameraTrigger] = useState<number>(0);

  // Dimension handler with safe clamping
  const handleDimensionChange = useCallback(
    (key: keyof CabinetDimensions, value: number) => {
      const limits = DIMENSION_LIMITS[key];
      const clampedValue = Math.min(Math.max(value, limits.min), limits.max);

      setConfig((prev) => ({
        ...prev,
        dimensions: {
          ...prev.dimensions,
          [key]: isNaN(clampedValue) ? limits.min : clampedValue,
        },
      }));
    },
    []
  );

  // Color selection handler
  const handleColorChange = useCallback((color: CabinetColor) => {
    setConfig((prev) => ({ ...prev, color }));
  }, []);

  // Ambient theme selection handler (day, night, studio)
  const handleAmbientThemeChange = useCallback((ambientTheme: AmbientTheme) => {
    setConfig((prev) => ({ ...prev, ambientTheme }));
  }, []);

  // Door animation toggle
  const handleToggleDoor = useCallback(() => {
    setConfig((prev) => ({ ...prev, isDoorOpen: !prev.isDoorOpen }));
  }, []);

  // Dimension labels toggle
  const handleToggleDimensions = useCallback(() => {
    setConfig((prev) => ({ ...prev, showDimensions: !prev.showDimensions }));
  }, []);

  // Wireframe toggle
  const handleToggleWireframe = useCallback(() => {
    setConfig((prev) => ({ ...prev, wireframe: !prev.wireframe }));
  }, []);

  // Auto-rotate turntable toggle
  const handleToggleAutoRotate = useCallback(() => {
    setConfig((prev) => ({ ...prev, autoRotate: !prev.autoRotate }));
  }, []);

  // Camera view reset
  const handleResetCamera = useCallback(() => {
    setResetCameraTrigger((prev) => prev + 1);
  }, []);

  // Preset applicator
  const handleApplyPreset = useCallback(
    (preset: { name: string; dims: CabinetDimensions }) => {
      setConfig((prev) => ({
        ...prev,
        dimensions: { ...preset.dims },
      }));
    },
    []
  );

  return (
    <Layout
      onResetView={handleResetCamera}
      isDoorOpen={config.isDoorOpen}
      onToggleDoor={handleToggleDoor}
      children3D={
        <Scene
          dimensions={config.dimensions}
          color={config.color}
          ambientTheme={config.ambientTheme}
          isDoorOpen={config.isDoorOpen}
          showDimensions={config.showDimensions}
          wireframe={config.wireframe}
          autoRotate={config.autoRotate}
          onToggleDoor={handleToggleDoor}
          resetCameraTrigger={resetCameraTrigger}
        />
      }
      childrenControls={
        <ControlPanel
          config={config}
          onChangeDimension={handleDimensionChange}
          onChangeColor={handleColorChange}
          onChangeAmbientTheme={handleAmbientThemeChange}
          onToggleDoor={handleToggleDoor}
          onToggleDimensions={handleToggleDimensions}
          onToggleWireframe={handleToggleWireframe}
          onToggleAutoRotate={handleToggleAutoRotate}
          onResetCamera={handleResetCamera}
          onApplyPreset={handleApplyPreset}
        />
      }
    />
  );
};

export default App;

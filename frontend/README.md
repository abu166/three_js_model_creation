# 3D Cabinet Configurator

A real-time 3D furniture configurator built with Vite, React, TypeScript, React Three Fiber, and Tailwind CSS.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## Features
- **Dynamic 3D Scaling:** Sliders & numeric inputs for Width, Height, Depth in mm ($1\text{ unit} = 1\text{ meter}$).
- **Material Selection:** Satin White, Matte Gray, and Walnut Wood (texture mapped with fallback).
- **Interactive Door & Handle:** Click door or button to open forward with realistic hinge animation.
- **Dynamic 3D Labels:** Live dimension badges with leader lines for W, H, D.
- **Camera Controls:** Orbit, zoom, turntable rotation, and reset view.
- **Responsive Layout:** Desktop sidebar and mobile bottom drawer.

---

## Project Structure
```text
frontend/
├── public/textures/walnut.jpg   # Wood grain texture
├── src/
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── Scene.tsx        # Canvas, lights, shadows, orbit controls
│   │   │   ├── Cabinet.tsx      # 3D cabinet geometry, door, handle, legs
│   │   │   └── DimensionLabels.tsx # 3D leader lines & measurement badges
│   │   ├── ui/
│   │   │   ├── ControlPanel.tsx # Sliders, color pickers, presets, toggles
│   │   │   └── Layout.tsx       # Responsive layout wrapper
│   │   └── App.tsx              # Main state & composition
│   ├── types.ts                 # Configurator types & constants
│   ├── index.css                # Tailwind directives
│   └── main.tsx                 # Entry point
```

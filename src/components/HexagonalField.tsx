import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { useState } from 'react';
import { Vector3 } from 'three';
import { Hexagon } from './Hexagon';
import { HexGrid } from './HexGrid';

export interface HexCoord {
  q: number;
  r: number;
}

export function HexagonalField() {
  const [hexagons, setHexagons] = useState<HexCoord[]>([
    { q: 0, r: 0 },
    { q: 1, r: 0 },
    { q: 0, r: 1 },
    { q: -1, r: 1 },
  ]);

  const addHexagon = (coord: HexCoord) => {
    const exists = hexagons.some(h => h.q === coord.q && h.r === coord.r);
    if (!exists) {
      setHexagons([...hexagons, coord]);
    }
  };

  const removeHexagon = (coord: HexCoord) => {
    setHexagons(hexagons.filter(h => !(h.q === coord.q && h.r === coord.r)));
  };

  const hexToWorld = (q: number, r: number): Vector3 => {
    const size = 1;
    const x = size * (Math.sqrt(3) * q + Math.sqrt(3) / 2 * r);
    const z = size * (3 / 2 * r);
    return new Vector3(x, 0, z);
  };

  return (
    <div className="w-full h-screen bg-slate-900">
      <div className="absolute top-4 left-4 z-10 bg-slate-800/90 backdrop-blur-sm p-4 rounded-lg border border-slate-700 shadow-xl">
        <h1 className="text-xl font-bold text-white mb-2">Hexagonal Field Builder</h1>
        <div className="text-sm text-slate-300 space-y-1">
          <p>• Click hexagons to remove them</p>
          <p>• Click grid positions to add new hexagons</p>
          <p>• Drag to rotate the camera</p>
          <p>• Scroll to zoom in/out</p>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-600">
          <p className="text-sm text-slate-400">Hexagons: {hexagons.length}</p>
        </div>
      </div>

      <Canvas
        camera={{
          position: [8, 10, 8],
          fov: 50,
        }}
        shadows
      >
        <color attach="background" args={['#0f172a']} />

        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 15, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[-10, 10, -10]} intensity={0.5} color="#4f46e5" />

        {/* Ground grid */}
        <Grid
          args={[20, 20]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#334155"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#475569"
          fadeDistance={30}
          fadeStrength={1}
          followCamera={false}
          position={[0, -0.01, 0]}
        />

        {/* Hexagonal grid helper */}
        <HexGrid hexToWorld={hexToWorld} onGridClick={addHexagon} />

        {/* Existing hexagons */}
        {hexagons.map((hex, index) => {
          const pos = hexToWorld(hex.q, hex.r);
          return (
            <Hexagon
              key={`${hex.q}-${hex.r}`}
              position={pos}
              coord={hex}
              onRemove={() => removeHexagon(hex)}
              index={index}
            />
          );
        })}

        {/* Camera controls */}
        <OrbitControls
          makeDefault
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.5}
          minDistance={5}
          maxDistance={30}
          enablePan={true}
        />
      </Canvas>
    </div>
  );
}

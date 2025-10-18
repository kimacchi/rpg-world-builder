import { useRef, useState } from 'react';
import { Mesh, Vector3 } from 'three';
import { HexCoord } from './HexagonalField';

interface HexGridProps {
  hexToWorld: (q: number, r: number) => Vector3;
  onGridClick: (coord: HexCoord) => void;
}

export function HexGrid({ hexToWorld, onGridClick }: HexGridProps) {
  const gridRadius = 5;
  const hexagons: HexCoord[] = [];

  // Generate hexagonal grid
  for (let q = -gridRadius; q <= gridRadius; q++) {
    for (let r = -gridRadius; r <= gridRadius; r++) {
      if (Math.abs(q + r) <= gridRadius) {
        hexagons.push({ q, r, type: 'Empty' });
      }
    }
  }

  return (
    <>
      {hexagons.map((hex) => (
        <HexGridCell
          key={`${hex.q}-${hex.r}`}
          coord={hex}
          position={hexToWorld(hex.q, hex.r)}
          onGridClick={onGridClick}
        />
      ))}
    </>
  );
}

interface HexGridCellProps {
  coord: HexCoord;
  position: Vector3;
  onGridClick: (coord: HexCoord) => void;
}

function HexGridCell({ coord, position, onGridClick }: HexGridCellProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const createHexOutline = () => {
    const radius = 0.9;
    const points: Vector3[] = [];

    for (let i = 0; i <= 6; i++) {
      const angle = (Math.PI / 3) * i;
      points.push(
        new Vector3(
          radius * Math.cos(angle),
          0,
          radius * Math.sin(angle)
        )
      );
    }

    return points;
  };

  const points = createHexOutline();

  return (
    <group position={[position.x, 0, position.z]}>
      {/* Invisible clickable surface */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onGridClick(coord);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <cylinderGeometry args={[0.9, 0.9, 0.1, 6]} />
        <meshBasicMaterial
          color={hovered ? '#22d3ee' : '#334155'}
          opacity={hovered ? 0.3 : 0.1}
          transparent
        />
      </mesh>

      {/* Hexagon outline */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={points.length}
            array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={hovered ? '#22d3ee' : '#475569'}
          opacity={hovered ? 0.8 : 0.3}
          transparent
          linewidth={1}
        />
      </lineSegments>
    </group>
  );
}

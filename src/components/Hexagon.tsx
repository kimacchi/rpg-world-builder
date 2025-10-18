import { useRef, useState } from 'react';
import { Mesh, Vector3, CylinderGeometry } from 'three';
import { useFrame } from '@react-three/fiber';
import { HexCoord } from './HexagonalField';

interface HexagonProps {
  position: Vector3;
  coord: HexCoord;
  onRemove: () => void;
  index: number;
}

export function Hexagon({ position, onRemove, index }: HexagonProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      // Gentle floating animation
      meshRef.current.position.y = Math.sin(time * 0.5 + index * 0.3) * 0.1;

      // Smooth scale on hover
      const targetScale = hovered ? 1.15 : 1;
      meshRef.current.scale.lerp(
        new Vector3(targetScale, targetScale, targetScale),
        0.1
      );

      // Pulse effect when clicked
      if (clicked) {
        const pulse = 1 + Math.sin(time * 10) * 0.05;
        meshRef.current.scale.set(pulse, pulse, pulse);
      }
    }
  });

  const hexagonShape = () => {
    const height = 0.3;
    return { height };
  };

  const { height } = hexagonShape();

  return (
    <mesh
      ref={meshRef}
      position={[position.x, 0, position.z]}
      onClick={(e) => {
        e.stopPropagation();
        setClicked(true);
        setTimeout(() => {
          setClicked(false);
          onRemove();
        }, 200);
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
      castShadow
      receiveShadow
    >
      <cylinderGeometry args={[0.9, 0.9, height, 6]} />
      <meshStandardMaterial
        color={hovered ? '#60a5fa' : '#3b82f6'}
        metalness={0.3}
        roughness={0.4}
        emissive={hovered ? '#2563eb' : '#1e40af'}
        emissiveIntensity={hovered ? 0.3 : 0.1}
      />

      {/* Top edge highlight */}
      <lineSegments position={[0, height / 2 + 0.01, 0]} rotation={[0, 0, 0]}>
        <edgesGeometry
          args={[
            (() => {
              const geom = new CylinderGeometry(0.9, 0.9, 0.01, 6);
              return geom;
            })()
          ]}
        />
        <lineBasicMaterial color="#93c5fd" opacity={0.6} transparent />
      </lineSegments>
    </mesh>
  );
}

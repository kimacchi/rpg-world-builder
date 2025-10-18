import { useRef, useState } from 'react';
import { Mesh, Vector3, CylinderGeometry } from 'three';
import { useFrame } from '@react-three/fiber';
import { HexCoord } from './HexagonalField';
import { EnvironmentType, EnvironmentPalette } from '../palette';
import * as THREE from 'three';

interface HexagonProps {
  position: Vector3;
  coord: HexCoord;
  onRemove: () => void;
  index: number;
  type: EnvironmentType;
}


// --- Component to render the 3D Props ---

// Placeholder components - REPLACE with useGLTF and your actual models later!
function PropRenderer({ type, meshRef }: { type: EnvironmentType; meshRef: React.RefObject<Mesh> }) {
  const env = EnvironmentPalette[type as EnvironmentType];
  const model = env.prop;
  const propScale = 0.5;
  const propRef = useRef<THREE.Group>(null);

  // *** TO USE YOUR OWN 3D MODELS: ***
  // 1. Uncomment and use useGLTF and Clone (make sure to install @react-three/drei)
  // 2. Adjust prop names in Palette.ts to match your GLTF loading logic.
  // const { scene: treeScene } = useGLTF('/models/low_poly_tree.glb'); 
  // if (model === 'Tree') return <Clone object={treeScene} {...props} />
  // ***********************************

  // Continuously update prop position to follow the animated mesh
  useFrame(() => {
    if (propRef.current && meshRef.current) {
      // Position props on top of the hexagon (height/2 + small offset)
      propRef.current.position.y = meshRef.current.position.y + 0.15 + 0.05;
    }
  });

  switch (model) {
    case 'Tree':
      return (
        <group ref={propRef} position={[0, 0, 0]} scale={propScale}>
          {/* Trunk */}
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.5, 4]} />
            <meshStandardMaterial color="#8b5c40" />
          </mesh>
          {/* Leaves/Crown */}
          <mesh position={[0, 0.7, 0]} castShadow>
            <coneGeometry args={[0.4, 0.8, 6]} />
            <meshStandardMaterial color={type === 'SnowyForest' ? '#a0a0a0' : '#4f7942'} />
          </mesh>
          {type === 'SnowyForest' && (
            // Simple snow cap
            <mesh position={[0, 0.9, 0]}>
              <coneGeometry args={[0.3, 0.2, 6]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          )}
        </group>
      );
    case 'House':
      return (
        <group ref={propRef} position={[0, 0, 0]} scale={propScale}>
          {/* Body */}
          <mesh position={[0, 0.3, 0]} castShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#f0f0f0" />
          </mesh>
          {/* Roof */}
          <mesh position={[0, 0.9, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[0.9, 0.5, 4]} />
            <meshStandardMaterial color="#a0522d" />
          </mesh>
        </group>
      );
    case 'Rock':
      return (
        <group ref={propRef} position={[0, 0, 0]} scale={propScale}>
          <mesh position={[0, 0.35, 0]} castShadow>
            <octahedronGeometry args={[0.7, 0]} />
            <meshStandardMaterial color="#6b7280" roughness={0.7} metalness={0.1} />
          </mesh>
        </group>
      );
    default:
      return null;
  }
}

export function Hexagon({ position, coord, type, onRemove, index }: HexagonProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const env = EnvironmentPalette[type]; // Get the environment data

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
    <group position={[position.x, 0, position.z]}>
      <mesh
        ref={meshRef}
        // y-position is now handled by the useFrame animation
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
          // Use the palette colors
          color={hovered ? env.color : env.baseColor}
          metalness={0.3}
          roughness={0.4}
          emissive={hovered ? env.color : env.baseColor}
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

      {/* Render the 3D prop on top */}
      {env.prop && (
        <PropRenderer 
          type={type} 
          meshRef={meshRef}
        />
      )}
    </group>
  );
}

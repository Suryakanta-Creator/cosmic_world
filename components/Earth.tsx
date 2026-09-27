import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Fix for TypeScript not recognizing React Three Fiber elements in JSX
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      pointLight: any;
      directionalLight: any;
      mesh: any;
      sphereGeometry: any;
      ringGeometry: any;
      meshPhongMaterial: any;
      meshBasicMaterial: any;
      instancedMesh: any;
      dodecahedronGeometry: any;
      meshStandardMaterial: any;
      group: any;
      lineLoop: any;
      bufferGeometry: any;
      bufferAttribute: any;
      lineBasicMaterial: any;
    }
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      pointLight: any;
      directionalLight: any;
      mesh: any;
      sphereGeometry: any;
      ringGeometry: any;
      meshPhongMaterial: any;
      meshBasicMaterial: any;
      instancedMesh: any;
      dodecahedronGeometry: any;
      meshStandardMaterial: any;
      group: any;
      lineLoop: any;
      bufferGeometry: any;
      bufferAttribute: any;
      lineBasicMaterial: any;
    }
  }
}

// ------------------------------------------------------------------
// FALLBACK COMPONENT
// ------------------------------------------------------------------
const FallbackEarth = () => {
  return (
    <group>
        <mesh>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshStandardMaterial 
            color="#1c4e91" 
            roughness={0.5} 
            metalness={0.8}
            emissive="#001133"
            emissiveIntensity={0.2}
            wireframe={true}
        />
        </mesh>
        <mesh scale={[1.05, 1.05, 1.05]}>
            <sphereGeometry args={[2.5, 32, 32]} />
            <meshBasicMaterial color="#00ffff" wireframe transparent opacity={0.1} />
        </mesh>
    </group>
  );
};

// ------------------------------------------------------------------
// ORBIT PATH COMPONENT
// ------------------------------------------------------------------
const OrbitPath = ({ radiusX = 12, radiusZ = 12, color = "#4b96f3", opacity = 0.2 }) => {
  const points = useMemo(() => {
    const pts = [];
    // Create ellipse points
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(theta) * radiusX, 0, Math.sin(theta) * radiusZ));
    }
    return pts;
  }, [radiusX, radiusZ]);

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  return (
    <lineLoop geometry={geometry}>
       <lineBasicMaterial color={color} transparent opacity={opacity} />
    </lineLoop>
  );
};

// ------------------------------------------------------------------
// ORBITING ASTEROIDS COMPONENT
// ------------------------------------------------------------------
const OrbitingAsteroids = () => {
  const count = 200;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Asteroids data
  const asteroids = useMemo(() => {
    return new Array(count).fill(0).map(() => {
      const angle = Math.random() * Math.PI * 2;
      const radiusX = 12 + (Math.random() - 0.5) * 3; // Orbit around radius 12
      const radiusZ = 12 + (Math.random() - 0.5) * 3;
      return {
        angle,
        radiusX,
        radiusZ,
        speed: (Math.random() * 0.002) + 0.0005,
        yOffset: (Math.random() - 0.5) * 2, // Vertical scatter
        rotationSpeed: Math.random() * 0.02,
        scale: Math.random() * 0.12 + 0.02
      };
    });
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;

    asteroids.forEach((asteroid, i) => {
      // Update orbit angle
      asteroid.angle += asteroid.speed;

      // Calculate position
      const x = Math.cos(asteroid.angle) * asteroid.radiusX;
      const z = Math.sin(asteroid.angle) * asteroid.radiusZ;

      dummy.position.set(x, asteroid.yOffset, z);

      // Rotate asteroid
      dummy.rotation.x += asteroid.rotationSpeed;
      dummy.rotation.y += asteroid.rotationSpeed;

      dummy.scale.setScalar(asteroid.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial 
        color="#aaccff" 
        roughness={0.6} 
        metalness={0.4}
        flatShading={true} 
      />
    </instancedMesh>
  );
};

// ------------------------------------------------------------------
// EARTH MESH COMPONENT (REAL + VIRTUAL MIX)
// ------------------------------------------------------------------
const EarthMesh = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);

  // Using reliable S3 bucket textures
  const [colorMap, bumpMap, specularMap, cloudsMap] = useLoader(THREE.TextureLoader, [
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/earthmap1k.jpg',
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/earthbump1k.jpg',
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/earthspec1k.jpg',
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/earthcloudmap.jpg'
  ]);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    
    // Rotate Earth
    if (earthRef.current) earthRef.current.rotation.y = elapsedTime * 0.05;
    
    // Rotate Clouds slightly faster
    if (cloudsRef.current) cloudsRef.current.rotation.y = elapsedTime * 0.06;
    
    // Rotate Wireframe Shell slightly slower
    if (wireframeRef.current) {
        wireframeRef.current.rotation.y = elapsedTime * 0.04;
        wireframeRef.current.rotation.x = Math.sin(elapsedTime * 0.2) * 0.05;
    }

    // Animate Rings
    if (ringsRef.current) {
        ringsRef.current.rotation.y = elapsedTime * 0.02;
        ringsRef.current.rotation.z = Math.PI / 6 + Math.sin(elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <>
      {/* 1. Cinematic & Cyber Lighting */}
      <ambientLight intensity={0.1} color="#001133" />
      <pointLight position={[50, 20, 30]} intensity={2} color="#ffffff" />
      <directionalLight position={[-10, 5, 0]} intensity={1.5} color="#4b96f3" /> {/* Cyan/Blue Rim Light */}
      <directionalLight position={[0, -10, 5]} intensity={0.8} color="#a239ca" /> {/* Purple Underglow */}
      
      {/* 2. Realistic Earth Base */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshPhongMaterial 
          map={colorMap}
          bumpMap={bumpMap}
          bumpScale={0.05}
          specularMap={specularMap}
          specular={new THREE.Color(0x333333)}
          shininess={15}
        />
      </mesh>

      {/* 3. Cloud Layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[2.53, 64, 64]} />
        <meshPhongMaterial 
          map={cloudsMap}
          transparent={true}
          opacity={0.6}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 4. Virtual Wireframe Shell (The "Mix") */}
      <mesh ref={wireframeRef} scale={[1.02, 1.02, 1.02]}>
         <sphereGeometry args={[2.5, 24, 24]} />
         <meshBasicMaterial 
            color="#00ffff"
            wireframe={true}
            transparent={true}
            opacity={0.08}
            blending={THREE.AdditiveBlending}
         />
      </mesh>

      {/* 5. Holographic Data Rings */}
      <group ref={ringsRef}>
         {/* Main Ring */}
         <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[3.2, 3.22, 128]} />
            <meshBasicMaterial color="#4b96f3" side={THREE.DoubleSide} transparent opacity={0.6} blending={THREE.AdditiveBlending} />
         </mesh>
         {/* Secondary Ring */}
         <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[3.5, 3.52, 64]} />
            <meshBasicMaterial color="#a239ca" side={THREE.DoubleSide} transparent opacity={0.3} blending={THREE.AdditiveBlending} />
         </mesh>
      </group>
      
      {/* 6. Atmosphere Glow */}
      <mesh scale={[1.2, 1.2, 1.2]}>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshBasicMaterial
          color="#1c4e91"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </>
  );
};

// ------------------------------------------------------------------
// MAIN COMPONENT
// ------------------------------------------------------------------
export const Earth: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[500px] cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 5, 18], fov: 45 }} dpr={[1, 2]}>
        {/* Background Stars */}
        <Stars radius={300} depth={60} count={20000} factor={6} saturation={0} fade speed={0.5} />
        
        {/* Scene Group with Tilt */}
        <group rotation={[0.3, 0, 0.2]}>
            {/* Render Earth with Fallback */}
            <Suspense fallback={<FallbackEarth />}>
                <EarthMesh />
            </Suspense>

            {/* Orbit System */}
            <OrbitPath radiusX={12} radiusZ={12} color="#4b96f3" opacity={0.3} />
            <OrbitPath radiusX={16} radiusZ={14} color="#a239ca" opacity={0.1} /> {/* Secondary faint orbit */}
            <OrbitingAsteroids />
        </group>
        
        <OrbitControls 
            enableZoom={true} 
            maxDistance={40}
            minDistance={8}
            enablePan={false} 
            enableRotate={true}
            rotateSpeed={0.5}
            minPolarAngle={0}
            maxPolarAngle={Math.PI}
            autoRotate={true}
            autoRotateSpeed={0.3}
        />
      </Canvas>
    </div>
  );
};
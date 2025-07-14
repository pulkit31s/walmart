"use client";
import { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Stats,
  Html,
  Line,
} from "@react-three/drei";
import * as THREE from "three";
import { Suspense } from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

const currentDateTime = "2025-03-04 06:40:40";
const currentUser = "vkhare2909";

const CONFIG = {
  pointCount: 300,
  globeDetail: 64,
  showStats: process.env.NODE_ENV === "development",
  enableSelect: true,
  globeRadius: 1,
  atmosphereColor: "#4066ff",
};

const TEXTURE_PATHS = {
  earthMap: "/textures/earth-blue-marble.jpg",
  earthBumpMap: "/textures/earth-topology.png",
  earthSpecularMap: "/textures/earth-water.png",
};

const CAPITAL_CITIES = [
  { name: "London", lat: 51.5074, lng: -0.1278, size: 1.2 },
  { name: "New York", lat: 40.7128, lng: -74.006, size: 1.3 },
  { name: "Tokyo", lat: 35.6762, lng: 139.6503, size: 1.2 },
  { name: "Beijing", lat: 39.9042, lng: 116.4074, size: 1.1 },
  { name: "Moscow", lat: 55.7558, lng: 37.6173, size: 1.0 },
  { name: "Paris", lat: 48.8566, lng: 2.3522, size: 1.1 },
  { name: "Delhi", lat: 28.6139, lng: 77.209, size: 1.0 },
  { name: "Sydney", lat: -33.8688, lng: 151.2093, size: 1.0 },
  { name: "Cairo", lat: 30.0444, lng: 31.2357, size: 0.9 },
  { name: "Rio de Janeiro", lat: -22.9068, lng: -43.1729, size: 1.0 },
  { name: "Dubai", lat: 25.2048, lng: 55.2708, size: 1.1 },
  { name: "Singapore", lat: 1.3521, lng: 103.8198, size: 0.9 },
  { name: "Cape Town", lat: -33.9249, lng: 18.4241, size: 0.8 },
  { name: "Mumbai", lat: 19.076, lng: 72.8777, size: 1.0 },
  { name: "San Francisco", lat: 37.7749, lng: -122.4194, size: 0.9 },
];

const FLIGHT_ROUTES = [
  ["New York", "London"],
  ["London", "Tokyo"],
  ["London", "Dubai"],
  ["Tokyo", "Sydney"],
  ["New York", "Rio de Janeiro"],
  ["Beijing", "London"],
  ["Beijing", "Tokyo"],
  ["Dubai", "Singapore"],
  ["Singapore", "Sydney"],
  ["Paris", "Cairo"],
  ["Moscow", "Beijing"],
  ["New York", "San Francisco"],
  ["Mumbai", "Dubai"],
  ["Singapore", "Mumbai"],
  ["London", "Paris"],
];

const latLngToVector3 = (
  lat: number,
  lng: number,
  radius: number = CONFIG.globeRadius
): THREE.Vector3 => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
};

const UserActivity = ({ visible = true }) => {
  const [activity, setActivity] = useState({
    rotations: 0,
    interactions: 0,
    lastActive: currentDateTime,
  });

  useEffect(() => {
    const trackInteraction = () => {
      setActivity((prev) => ({
        ...prev,
        interactions: prev.interactions + 1,
        lastActive: new Date().toISOString(),
      }));
    };

    window.addEventListener("mousedown", trackInteraction);
    window.addEventListener("touchstart", trackInteraction);

    return () => {
      window.removeEventListener("mousedown", trackInteraction);
      window.removeEventListener("touchstart", trackInteraction);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="absolute bottom-2 left-2 z-10 bg-black/30 backdrop-blur-sm text-xs text-white/70 p-2 rounded-md">
      <div>User: {currentUser}</div>
      <div>Session: {currentDateTime}</div>
      <div>Interactions: {activity.interactions}</div>
    </div>
  );
};

const useGlobeTextures = () => {
  const [earthMap, earthBumpMap, earthSpecularMap] = useLoader(TextureLoader, [
    TEXTURE_PATHS.earthMap,
    TEXTURE_PATHS.earthBumpMap,
    TEXTURE_PATHS.earthSpecularMap,
  ]);

  return { earthMap, earthBumpMap, earthSpecularMap };
};

const CityMarkers = ({
  onHover,
}: {
  onHover: (city: string | null) => void;
}) => {
  const pointsRef = useRef<THREE.Group>(null);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  const cityPoints = useMemo(
    () =>
      CAPITAL_CITIES.map((city) => {
        const position = latLngToVector3(
          city.lat,
          city.lng,
          CONFIG.globeRadius * 1.01
        );
        return { ...city, position };
      }),
    []
  );

  return (
    <group ref={pointsRef}>
      {cityPoints.map((city, index) => (
        <mesh
          key={`city-${index}`}
          position={[city.position.x, city.position.y, city.position.z]}
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            setHoveredCity(city.name);
            onHover(city.name);
          }}
          onPointerOut={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            setHoveredCity(null);
            onHover(null);
          }}
        >
          <sphereGeometry args={[0.01 * city.size, 8, 8]} />
          <meshBasicMaterial
            color={hoveredCity === city.name ? "#ffffff" : "#ffcc00"}
          />

          {hoveredCity === city.name && (
            <Html position={[0, 0.02, 0]} center>
              <div className="px-2 py-1 rounded bg-black/70 text-white text-xs whitespace-nowrap">
                {city.name}
              </div>
            </Html>
          )}
        </mesh>
      ))}
    </group>
  );
};

const FlightPaths = ({ animate = true }) => {
  const linesRef = useRef<THREE.Group>(null);
  const [flightProgress, setFlightProgress] = useState<number[]>(
    Array(FLIGHT_ROUTES.length).fill(0)
  );

  const cityPositions = useMemo(() => {
    const positions: { [key: string]: THREE.Vector3 } = {};
    CAPITAL_CITIES.forEach((city) => {
      positions[city.name] = latLngToVector3(
        city.lat,
        city.lng,
        CONFIG.globeRadius * 1.01
      );
    });
    return positions;
  }, []);

  useFrame(({ clock }) => {
    if (animate && linesRef.current) {
      const newProgress = flightProgress.map((_, i) => {
        const speed = 0.2 + (i % 5) * 0.05;
        const time = clock.getElapsedTime() * speed;
        return (Math.sin(time + i * 0.5) + 1) / 2;
      });
      setFlightProgress(newProgress);
    }
  });

  return (
    <group ref={linesRef}>
      {FLIGHT_ROUTES.map((route, i) => {
        const startCity = route[0];
        const endCity = route[1];
        const startPos = cityPositions[startCity];
        const endPos = cityPositions[endCity];

        if (!startPos || !endPos) return null;

        const midPoint = new THREE.Vector3()
          .addVectors(startPos, endPos)
          .multiplyScalar(0.5);
        const distance = startPos.distanceTo(endPos);
        midPoint
          .normalize()
          .multiplyScalar(CONFIG.globeRadius * 1.15 + distance * 0.15);

        const curve = new THREE.QuadraticBezierCurve3(
          startPos,
          midPoint,
          endPos
        );

        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        const flightPosition = curve.getPointAt(flightProgress[i]);

        return (
          <group key={`flight-${i}`}>
            <Line points={points} color="#4f7eff" opacity={0.6} transparent />

            <mesh position={flightPosition}>
              <sphereGeometry args={[0.008, 6, 6]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

const Globe = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [selected, setSelected] = useState(false);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const { viewport } = useThree();

  const { earthMap, earthBumpMap, earthSpecularMap } = useGlobeTextures();

  useEffect(() => {
    if (hovered || hoveredCity) {
      document.body.style.cursor = "pointer";
    } else {
      document.body.style.cursor = "auto";
    }

    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered, hoveredCity]);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const speed = hovered || hoveredCity ? 0.05 : 0.1;
      meshRef.current.rotation.y = clock.getElapsedTime() * speed;
    }
  });

  const scale = useMemo(() => {
    return viewport.width > 10 ? 2 : viewport.width / 5;
  }, [viewport.width]);

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(false);
  };

  return (
    <group>
      <mesh
        ref={meshRef}
        scale={scale}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={() => CONFIG.enableSelect && setSelected(!selected)}
      >
        <sphereGeometry
          args={[CONFIG.globeRadius, CONFIG.globeDetail, CONFIG.globeDetail]}
        />
        <meshPhongMaterial
          map={earthMap}
          bumpMap={earthBumpMap}
          bumpScale={0.05}
          specularMap={earthSpecularMap}
          shininess={10}
          specular={new THREE.Color(0x4f76ff)}
        />

        <mesh>
          <sphereGeometry args={[CONFIG.globeRadius * 1.01, 32, 32]} />
          <meshBasicMaterial
            color={CONFIG.atmosphereColor}
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </mesh>

        <CityMarkers onHover={setHoveredCity} />
        <FlightPaths animate={true} />

        {(hovered || hoveredCity) && !selected && (
          <Html position={[0, 1.2, 0]} center>
            <div className="px-2 py-1 rounded bg-black/70 text-white text-xs border-0 shadow-lg backdrop-blur-sm">
              {hoveredCity
                ? `${hoveredCity}`
                : `Interactive Career Globe • ${currentUser}`}
            </div>
          </Html>
        )}

        {selected && (
          <mesh>
            <sphereGeometry args={[CONFIG.globeRadius * 1.02, 32, 32]} />
            <meshBasicMaterial
              color="#4f46e5"
              wireframe
              transparent
              opacity={0.2}
            />
          </mesh>
        )}
      </mesh>
    </group>
  );
};

const CareerPoints = () => {
  const pointsRef = useRef<THREE.Points>(null);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.03;
      pointsRef.current.rotation.x =
        Math.sin(clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  const { positions, colors, sizes } = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];
    const sizes: number[] = [];
    const color = new THREE.Color();

    for (let i = 0; i < CONFIG.pointCount; i++) {
      const r = CONFIG.globeRadius * (1.2 + Math.random() * 0.5);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions.push(x, y, z);

      const hue = (theta / (Math.PI * 2)) * 0.3 + 0.5;
      color.setHSL(hue, 1, 0.6);
      colors.push(color.r, color.g, color.b);

      const size = 0.5 + Math.random();
      sizes.push(size);
    }

    return { positions, colors, sizes };
  }, []);

  const geometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));
    return geometry;
  }, [positions, colors, sizes]);

  return (
    <points ref={pointsRef}>
      <bufferGeometry attach="geometry" {...geometry} />
      <pointsMaterial
        attach="material"
        size={0.02}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        opacity={0.6}
      />
    </points>
  );
};

const GlobeScene = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4f76ff" />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />

      <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={50} />
      <OrbitControls
        enableZoom={true}
        minDistance={2}
        maxDistance={6}
        enablePan={false}
        rotateSpeed={0.5}
        autoRotate
        autoRotateSpeed={0.4}
      />

      <Suspense fallback={<LoadingFallback />}>
        <Globe />
        <CareerPoints />
      </Suspense>

      {CONFIG.showStats && <Stats className="stats" />}
    </>
  );
};

const LoadingFallback = () => {
  return (
    <Html center>
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-white">Loading Globe...</p>
        <p className="text-xs text-gray-400 mt-2">User: {currentUser}</p>
      </div>
    </Html>
  );
};

export default function GlobeVisualization() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [canvasHeight, setCanvasHeight] = useState("500px");
  const [isTextureLoading, setIsTextureLoading] = useState(true);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const updateHeight = () => {
      if (wrapperRef.current) {
        setCanvasHeight(`${wrapperRef.current.clientWidth * 0.75}px`);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsTextureLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full overflow-hidden rounded-lg shadow-2xl bg-gradient-to-b from-gray-900 to-black"
      style={{ height: canvasHeight }}
      data-user={currentUser}
      data-timestamp={currentDateTime}
    >
      <Canvas dpr={[1, 2]}>
        <GlobeScene />
      </Canvas>
    </div>
  );
}

"use client";
import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Text,
  Html,
  Stats,
  useDetectGPU,
} from "@react-three/drei";
import * as THREE from "three";

const CONFIG = {
  roadmap: {
    nodes: 10,
    animationSpeed: 0.5,
    colorStart: 0.6,
    colorEnd: 1.1,
  },
  forest: {
    gridSize: 5,
    treeSparsity: 0.3,
    groundColor: "#1e293b",
    trunkColor: "#78350f",
  },
  network: {
    nodes: 30,
    edges: 3,
    radius: 1.5,
  },
  debug: process.env.NODE_ENV === "development",
};

const TABS = ["Career Roadmap", "Skill Forest", "Connection Network"];

const PerformanceMonitor = () => {
  const gpuInfo = useDetectGPU();
  const [fps, setFps] = useState<number>(0);
  const fpsRef = useRef<number[]>([]);
  const lastTimeRef = useRef<number>(performance.now());

  useFrame(() => {
    const now = performance.now();
    const delta = now - lastTimeRef.current;
    lastTimeRef.current = now;

    const currentFps = 1000 / delta;
    fpsRef.current.push(currentFps);

    if (fpsRef.current.length > 60) {
      fpsRef.current.shift();
    }

    if (fpsRef.current.length % 10 === 0) {
      const avgFps =
        fpsRef.current.reduce((sum, val) => sum + val, 0) /
        fpsRef.current.length;
      setFps(Math.round(avgFps));
    }
  });

  if (!CONFIG.debug) return null;
};

const CareerRoadmap = ({ isActive }: { isActive: boolean }) => {
  const roadRef = useRef<THREE.Group>(null);
  const activeNodesRef = useRef<number>(0);

  const nodes = useMemo(() => {
    const roadNodes = [];

    for (let i = 0; i < CONFIG.roadmap.nodes; i++) {
      const xOffset = Math.sin(i * 0.6) * 0.3;
      roadNodes.push({
        position: new THREE.Vector3(xOffset, i * 0.25 - 1, 0),
        scale: Math.max(0.15, 0.2 - i * 0.01),
        color: new THREE.Color().setHSL(
          (i * (CONFIG.roadmap.colorEnd - CONFIG.roadmap.colorStart)) /
            CONFIG.roadmap.nodes +
            CONFIG.roadmap.colorStart,
          0.8,
          0.5
        ),
        name: `Career Stage ${i + 1}`,
      });
    }

    return roadNodes;
  }, []);

  useFrame(({ clock }) => {
    if (roadRef.current && isActive) {
      roadRef.current.rotation.y =
        Math.sin(clock.getElapsedTime() * CONFIG.roadmap.animationSpeed) * 0.2;

      const time = clock.getElapsedTime();
      const targetNodes = Math.min(Math.floor(time * 1.5), nodes.length);
      if (targetNodes !== activeNodesRef.current) {
        activeNodesRef.current = targetNodes;
      }
    }
  });

  return (
    <group ref={roadRef} visible={isActive}>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array(
                nodes.flatMap((node) => node.position.toArray())
              ),
              3,
            ]}
            count={nodes.length}
            array={
              new Float32Array(nodes.flatMap((node) => node.position.toArray()))
            }
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#4f46e5" linewidth={2} />
      </line>

      {nodes.map((node, i) => (
        <group key={i} position={node.position}>
          <mesh>
            <sphereGeometry args={[node.scale, 32, 32]} />
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={0.5}
            />
          </mesh>
          <Text
            position={[0.3, 0, 0]}
            fontSize={0.08}
            color="white"
            anchorX="left"
            maxWidth={0.5}
            font="/fonts/Inter-Medium.woff"
          >
            {node.name}
          </Text>
        </group>
      ))}

      <mesh
        position={[
          nodes[1].position.x,
          nodes[1].position.y,
          nodes[1].position.z,
        ]}
        scale={0.07}
      >
        <sphereGeometry />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
};

const SkillForest = ({ isActive }: { isActive: boolean }) => {
  const forestRef = useRef<THREE.Group>(null);

  const trees = useMemo(() => {
    const skillTrees = [];
    const gridSize = CONFIG.forest.gridSize;

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (Math.random() < CONFIG.forest.treeSparsity) continue;

        const height = Math.random() * 0.5 + 0.2;
        const x = (i - gridSize / 2 + 0.5) * 0.5;
        const z = (j - gridSize / 2 + 0.5) * 0.5;

        const skills = [
          "React",
          "TypeScript",
          "Node.js",
          "GraphQL",
          "CSS",
          "Three.js",
          "AI",
          "DevOps",
          "Testing",
          "UX Design",
          "SEO",
          "Analytics",
        ];
        const skillIndex = Math.floor(Math.random() * skills.length);

        skillTrees.push({
          position: [x, 0, z],
          height,

          color: new THREE.Color().setHSL(skillIndex * 0.08 + 0.3, 0.8, 0.4),
          name: skills[skillIndex],
          userSkill:
            skills[skillIndex] === "React" ||
            skills[skillIndex] === "TypeScript",
        });
      }
    }

    return skillTrees;
  }, []);

  useFrame(({ clock }) => {
    if (forestRef.current && isActive) {
      forestRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group ref={forestRef} visible={isActive}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[5, 5]} />
        <meshStandardMaterial
          color={CONFIG.forest.groundColor}
          roughness={0.8}
        />
      </mesh>

      {trees.map((tree, i) => (
        <group key={i} position={tree.position as [number, number, number]}>
          <mesh position={[0, tree.height / 2, 0]}>
            <cylinderGeometry args={[0.03, 0.05, tree.height, 8]} />
            <meshStandardMaterial
              color={CONFIG.forest.trunkColor}
              roughness={0.9}
            />
          </mesh>

          <mesh position={[0, tree.height, 0]}>
            <coneGeometry args={[0.2, 0.4, 8]} />
            <meshStandardMaterial
              color={tree.color}
              roughness={0.6}
              emissive={tree.color}
              emissiveIntensity={tree.userSkill ? 0.8 : 0.2}
            />
          </mesh>

          <Html position={[0, tree.height + 0.3, 0]} center>
            <div
              className={`px-1.5 py-0.5 rounded text-[8px] whitespace-nowrap ${
                tree.userSkill
                  ? "bg-indigo-500/50 text-white"
                  : "bg-gray-900/50 text-gray-300"
              }`}
            >
              {tree.name}
              {tree.userSkill && (
                <span className="ml-1 text-yellow-300">★</span>
              )}
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
};

const NetworkGraph = ({ isActive }: { isActive: boolean }) => {
  const graphRef = useRef<THREE.Group>(null);

  const graph = useMemo(() => {
    const nodes = [];
    const edges = [];

    for (let i = 0; i < CONFIG.network.nodes; i++) {
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      const radius = Math.random() * CONFIG.network.radius + 0.5;

      const x = radius * Math.sin(theta) * Math.cos(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(theta);

      const isUserNode = i === 0;

      nodes.push({
        position: new THREE.Vector3(x, y, z),
        size: isUserNode ? 0.06 : Math.random() * 0.03 + 0.02,
        color: isUserNode
          ? new THREE.Color(0x4f46e5)
          : new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 0.7, 0.5),
        isUserNode,
      });
    }

    for (let i = 0; i < nodes.length; i++) {
      const connections =
        i === 0
          ? Math.floor(nodes.length / 3)
          : Math.floor(Math.random() * CONFIG.network.edges) + 1;

      for (let j = 0; j < connections; j++) {
        const target =
          i === 0 ? j + 1 : Math.floor(Math.random() * nodes.length);

        if (i !== target && target < nodes.length) {
          const isUserConnection = i === 0 || target === 0;
          edges.push({
            start: nodes[i].position,
            end: nodes[target].position,
            isUserConnection,
          });
        }
      }
    }

    return { nodes, edges };
  }, []);

  useFrame(({ clock }) => {
    if (graphRef.current && isActive) {
      graphRef.current.rotation.y = clock.getElapsedTime() * 0.1;
      graphRef.current.rotation.z =
        Math.sin(clock.getElapsedTime() * 0.1) * 0.1;
    }
  });

  return (
    <group ref={graphRef} visible={isActive}>
      {graph.nodes.map((node, i) => (
        <group key={`node-${i}`} position={node.position}>
          <mesh>
            <sphereGeometry args={[node.size, 16, 16]} />
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={node.isUserNode ? 0.6 : 0.3}
            />
          </mesh>
        </group>
      ))}

      {graph.edges.map((edge, i) => (
        <line key={`edge-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[
                new Float32Array([
                  ...edge.start.toArray(),
                  ...edge.end.toArray(),
                ]),
                3,
              ]}
              count={2}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={edge.isUserConnection ? "#4f46e5" : "#4b5563"}
            transparent
            opacity={0.4}
          />
        </line>
      ))}
    </group>
  );
};

const Scene = ({ activeTab }: { activeTab: number }) => {
  return (
    <>
      <color attach="background" args={["#121212"]} />
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      <pointLight position={[-5, -5, -5]} intensity={0.2} color="#38bdf8" />

      <CareerRoadmap isActive={activeTab === 0} />
      <SkillForest isActive={activeTab === 1} />
      <NetworkGraph isActive={activeTab === 2} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        autoRotate={false}
      />

      {CONFIG.debug && <PerformanceMonitor />}
    </>
  );
};

export default function VisualizationScene({
  activeTab,
}: {
  activeTab: number;
}) {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 3], fov: 60 }}>
      <Scene activeTab={activeTab} />
    </Canvas>
  );
}

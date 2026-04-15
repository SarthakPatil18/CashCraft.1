import { useRef, useMemo, Suspense, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Float } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { useGetDashboardSummary, useGetUserProfile } from "@workspace/api-client-react";
import { Globe, TrendingUp, Zap, AlertTriangle } from "lucide-react";

// ─── WebGL support check ──────────────────────────────────────────────────────
function isWebGLSupported(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const ctx =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return !!ctx;
  } catch {
    return false;
  }
}

// ─── Helper: score tier ──────────────────────────────────────────────────────
function getScoreTier(score: number) {
  if (score >= 800) return { label: "Ascended", color: "#ffffff", glowIntensity: 2.5, decay: false };
  if (score >= 600) return { label: "Prospering", color: "#e2e8f0", glowIntensity: 1.5, decay: false };
  if (score >= 400) return { label: "Recovering", color: "#94a3b8", glowIntensity: 0.8, decay: false };
  if (score >= 200) return { label: "Struggling", color: "#475569", glowIntensity: 0.3, decay: true };
  return { label: "Wasteland", color: "#1e293b", glowIntensity: 0.1, decay: true };
}

// ─── Obelisk / Central Monolith ──────────────────────────────────────────────
function CentralMonolith({ score }: { score: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const tier = getScoreTier(score);
  const height = 1 + (score / 1000) * 5;
  const glitch = score < 300;

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    if (glitch) {
      meshRef.current.position.x = Math.sin(t * 20) * 0.03 * Math.random();
      meshRef.current.position.z = Math.cos(t * 15) * 0.03 * Math.random();
    } else {
      meshRef.current.position.x = 0;
      meshRef.current.position.z = 0;
    }
    meshRef.current.rotation.y = t * 0.05;
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Base */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[1.4, 0.3, 1.4]} />
        <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Main shaft */}
      <mesh ref={meshRef} position={[0, height / 2 + 0.3, 0]}>
        <boxGeometry args={[0.5, height, 0.5]} />
        <meshStandardMaterial
          color={tier.color}
          emissive={tier.color}
          emissiveIntensity={tier.glowIntensity * 0.3}
          metalness={0.8}
          roughness={0.1}
        />
      </mesh>

      {/* Apex crystal */}
      {score > 300 && (
        <Float speed={2} rotationIntensity={0.4} floatIntensity={0.3}>
          <mesh position={[0, height + 0.7, 0]}>
            <octahedronGeometry args={[0.25, 0]} />
            <meshStandardMaterial
              color={tier.color}
              emissive={tier.color}
              emissiveIntensity={tier.glowIntensity}
              metalness={1}
              roughness={0}
            />
          </mesh>
        </Float>
      )}

      {/* Point light emanating from monolith */}
      <pointLight
        position={[0, height / 2, 0]}
        color={tier.color}
        intensity={tier.glowIntensity * 2}
        distance={8}
        decay={2}
      />
    </group>
  );
}

// ─── Ring of Quest Pillars ────────────────────────────────────────────────────
function QuestPillar({
  index,
  total,
  completed,
  score,
}: {
  index: number;
  total: number;
  completed: boolean;
  score: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const angle = (index / total) * Math.PI * 2;
  const radius = 4;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  const pillarHeight = completed ? 1.2 + Math.random() * 0.8 : 0.3;
  const glitch = score < 300 && !completed;

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    if (glitch) {
      meshRef.current.scale.y = 1 + Math.sin(t * 30 + index) * 0.1;
    }
    if (completed) {
      meshRef.current.rotation.y = t * 0.1 + index;
    }
  });

  return (
    <group position={[x, 0, z]}>
      <mesh ref={meshRef} position={[0, pillarHeight / 2, 0]}>
        <cylinderGeometry args={[0.12, 0.18, pillarHeight, 6]} />
        <meshStandardMaterial
          color={completed ? "#ffffff" : "#1a1a1a"}
          emissive={completed ? "#ffffff" : "#000000"}
          emissiveIntensity={completed ? 0.5 : 0}
          metalness={0.9}
          roughness={0.1}
          wireframe={glitch}
        />
      </mesh>
      {completed && (
        <pointLight
          position={[0, pillarHeight, 0]}
          color="#ffffff"
          intensity={0.8}
          distance={2}
          decay={2}
        />
      )}
    </group>
  );
}

// ─── Floating Crystal Shards (streak bonus) ───────────────────────────────────
function CrystalShard({ index, streak }: { index: number; streak: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const angle = (index / 8) * Math.PI * 2;
  const r = 2 + (index % 2) * 0.5;
  const active = index < Math.min(streak / 3, 8);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.position.y = 2 + Math.sin(t * 0.8 + index * 1.2) * 0.3;
    ref.current.rotation.x = t * 0.3 + index;
    ref.current.rotation.z = t * 0.2;
  });

  if (!active) return null;

  return (
    <mesh
      ref={ref}
      position={[Math.cos(angle) * r, 2, Math.sin(angle) * r]}
    >
      <tetrahedronGeometry args={[0.12, 0]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#ffffff"
        emissiveIntensity={0.6}
        metalness={1}
        roughness={0}
      />
    </mesh>
  );
}

// ─── Ground Plane with Grid ───────────────────────────────────────────────────
function GroundPlane({ score }: { score: number }) {
  const tier = getScoreTier(score);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[30, 30, 30, 30]} />
        <meshStandardMaterial
          color="#050505"
          metalness={0.5}
          roughness={0.8}
          wireframe={score < 200}
        />
      </mesh>
      {/* Grid lines overlay */}
      <gridHelper
        args={[30, 30, tier.color, "#111111"]}
        position={[0, 0, 0]}
      />
    </group>
  );
}

// ─── Decay Particles (low score rubble) ───────────────────────────────────────
function DecayParticles({ score }: { score: number }) {
  const points = useRef<THREE.Points>(null);
  const count = Math.max(0, Math.floor((400 - score) / 10));

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = Math.random() * 3;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return [pos];
  }, [count]);

  useFrame((state) => {
    if (!points.current) return;
    const t = state.clock.getElapsedTime();
    points.current.rotation.y = t * 0.02;
  });

  if (count === 0) return null;

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#333333" size={0.06} sizeAttenuation />
    </points>
  );
}

// ─── Ascended Halo Ring (score > 800) ────────────────────────────────────────
function AscendedRing({ score }: { score: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.getElapsedTime() * 0.3;
    ref.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.2;
  });
  if (score < 800) return null;
  return (
    <mesh ref={ref} position={[0, 4.5, 0]}>
      <torusGeometry args={[1.5, 0.04, 16, 80]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#ffffff"
        emissiveIntensity={1.5}
        metalness={1}
        roughness={0}
      />
    </mesh>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────
function WorldScene({
  score,
  streak,
  completedQuests,
  totalQuests,
}: {
  score: number;
  streak: number;
  completedQuests: number;
  totalQuests: number;
}) {
  const questPillars = Array.from({ length: Math.max(totalQuests, 6) });

  return (
    <>
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 12, 30]} />

      {/* Lighting */}
      <ambientLight intensity={0.1} />
      <directionalLight position={[5, 10, 5]} intensity={0.3} color="#ffffff" />

      {/* Stars */}
      <Stars
        radius={40}
        depth={40}
        count={score > 400 ? 3000 : 800}
        factor={3}
        fade
        speed={0.5}
      />

      {/* World elements */}
      <GroundPlane score={score} />
      <CentralMonolith score={score} />
      <AscendedRing score={score} />
      <DecayParticles score={score} />

      {/* Quest pillars */}
      {questPillars.map((_, i) => (
        <QuestPillar
          key={i}
          index={i}
          total={questPillars.length}
          completed={i < completedQuests}
          score={score}
        />
      ))}

      {/* Crystal shards from streak */}
      {Array.from({ length: 8 }).map((_, i) => (
        <CrystalShard key={i} index={i} streak={streak} />
      ))}
    </>
  );
}

// ─── Mobile Animated Preview (no canvas) ─────────────────────────────────────
function MobileWorldPreview({
  score,
  tier,
}: {
  score: number;
  tier: ReturnType<typeof getScoreTier>;
}) {
  const structures = [
    { height: 0.3 + (score / 1000) * 0.7, delay: 0 },
    { height: 0.5 + (score / 1000) * 0.5, delay: 0.1 },
    { height: 0.2 + (score / 1000) * 0.8, delay: 0.2 },
    { height: 0.6 + (score / 1000) * 0.4, delay: 0.05 },
    { height: 0.1 + (score / 1000) * 0.6, delay: 0.15 },
  ];

  return (
    <div className="relative w-full h-56 flex items-end justify-center gap-3 overflow-hidden">
      {/* Ground line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20" />

      {/* Glow orb */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(ellipse at 50% 100%, ${tier.color}18 0%, transparent 70%)`,
        }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {structures.map((s, i) => (
        <motion.div
          key={i}
          className="relative rounded-sm"
          style={{
            width: 18 + i * 4,
            backgroundColor: tier.color,
            opacity: 0.7 + (score / 1000) * 0.3,
            boxShadow: score > 400 ? `0 0 12px ${tier.color}60` : "none",
          }}
          initial={{ height: 0 }}
          animate={{
            height: `${s.height * 100}%`,
            x: score < 300 ? [0, Math.random() * 2 - 1, 0] : 0,
          }}
          transition={{
            height: { duration: 1.2, delay: s.delay, ease: [0.16, 1, 0.3, 1] },
            x: { duration: 0.1, repeat: score < 300 ? Infinity : 0 },
          }}
        >
          {/* Crystal tip */}
          {score > 500 && (
            <motion.div
              className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45"
              style={{ backgroundColor: tier.color }}
              animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, delay: s.delay }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}

// ─── Desktop 2D Fallback (when WebGL unavailable) ─────────────────────────────
function DesktopWorldFallback({
  score,
  tier,
  streak,
  completedQuests,
}: {
  score: number;
  tier: ReturnType<typeof getScoreTier>;
  streak: number;
  completedQuests: number;
}) {
  return (
    <div className="relative w-full h-full bg-black flex items-end justify-center overflow-hidden">
      {/* Stars */}
      {Array.from({ length: 60 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: Math.random() * 2 + 1,
            height: Math.random() * 2 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 60}%`,
          }}
          animate={{ opacity: [0.1, 0.7, 0.1] }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 4,
          }}
        />
      ))}

      {/* Ground grid */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "35%",
          background: `linear-gradient(to top, ${tier.color}08, transparent)`,
          borderTop: `1px solid ${tier.color}20`,
        }}
      />

      {/* Glow beneath monolith */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 200,
          height: 80,
          bottom: "33%",
          left: "50%",
          transform: "translateX(-50%)",
          background: `radial-gradient(ellipse, ${tier.color}25 0%, transparent 70%)`,
          filter: "blur(20px)",
        }}
        animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Quest pillars left */}
      <div className="absolute bottom-[33%] flex items-end gap-5" style={{ left: "12%" }}>
        {Array.from({ length: 3 }).map((_, i) => {
          const done = i < Math.min(completedQuests, 3);
          const h = done ? 40 + i * 20 : 12;
          return (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: h }}
              transition={{ duration: 1.4, delay: 0.2 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              style={{
                width: 10,
                backgroundColor: done ? tier.color : "#1a1a1a",
                boxShadow: done ? `0 0 10px ${tier.color}60` : "none",
                borderRadius: "2px 2px 0 0",
              }}
            />
          );
        })}
      </div>

      {/* Quest pillars right */}
      <div className="absolute bottom-[33%] flex items-end gap-5" style={{ right: "12%" }}>
        {Array.from({ length: 3 }).map((_, i) => {
          const done = i + 3 < completedQuests;
          const h = done ? 50 - i * 12 : 12;
          return (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: h }}
              transition={{ duration: 1.4, delay: 0.3 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              style={{
                width: 10,
                backgroundColor: done ? tier.color : "#1a1a1a",
                boxShadow: done ? `0 0 10px ${tier.color}60` : "none",
                borderRadius: "2px 2px 0 0",
              }}
            />
          );
        })}
      </div>

      {/* Central monolith */}
      <div className="absolute bottom-[33%] left-1/2 -translate-x-1/2 flex flex-col items-center">
        {/* Apex crystal */}
        {score > 300 && (
          <motion.div
            className="w-4 h-4 rotate-45 mb-1"
            style={{
              backgroundColor: tier.color,
              boxShadow: `0 0 16px ${tier.color}`,
            }}
            animate={{
              opacity: [0.7, 1, 0.7],
              rotate: [45, 90, 45],
              scale: score < 300 ? [1, 0.8, 1.2, 1] : [1, 1.1, 1],
              y: [0, -4, 0],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        {/* Shaft */}
        <motion.div
          initial={{ height: 0 }}
          animate={{
            height: 30 + (score / 1000) * 200,
            x: score < 300 ? [0, -2, 2, -1, 1, 0] : 0,
          }}
          transition={{
            height: { duration: 1.8, ease: [0.16, 1, 0.3, 1] },
            x: { duration: 0.15, repeat: score < 300 ? Infinity : 0 },
          }}
          style={{
            width: 18,
            backgroundColor: tier.color,
            boxShadow: `0 0 30px ${tier.color}60, 0 0 60px ${tier.color}30`,
          }}
        />

        {/* Base */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            width: 48,
            height: 6,
            backgroundColor: tier.color,
            opacity: 0.5,
          }}
        />
      </div>

      {/* Crystal shards (streak) */}
      {Array.from({ length: Math.min(Math.floor(streak / 3), 8) }).map((_, i) => {
        const angle = (i / 8) * 360;
        const r = 80 + (i % 2) * 20;
        const x = Math.cos((angle * Math.PI) / 180) * r;
        const y = -Math.abs(Math.sin((angle * Math.PI) / 180)) * 40 - 60;
        return (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rotate-45"
            style={{
              left: `calc(50% + ${x}px)`,
              bottom: `calc(33% + ${-y}px)`,
              backgroundColor: tier.color,
              boxShadow: `0 0 8px ${tier.color}`,
            }}
            animate={{
              y: [0, -6, 0],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        );
      })}

      {/* Ascended ring */}
      {score >= 800 && (
        <motion.div
          className="absolute rounded-full border-2"
          style={{
            width: 80,
            height: 80,
            borderColor: tier.color,
            bottom: `calc(33% + ${30 + (score / 1000) * 200 + 20}px)`,
            left: "50%",
            translateX: "-50%",
            boxShadow: `0 0 20px ${tier.color}80`,
            marginLeft: -40,
          }}
          animate={{ rotate: 360, opacity: [0.6, 1, 0.6] }}
          transition={{ rotate: { duration: 8, repeat: Infinity, ease: "linear" }, opacity: { duration: 3, repeat: Infinity } }}
        />
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function FutureWorld() {
  const dashboard = useGetDashboardSummary({ userId: 1 });
  const profile = useGetUserProfile({ userId: 1 });
  const [webglOk, setWebglOk] = useState<boolean | null>(null);

  useEffect(() => {
    setWebglOk(isWebGLSupported());
  }, []);

  const score = dashboard.data?.futureScore ?? 720;
  const streak = dashboard.data?.streak ?? 0;
  const completedQuests = dashboard.data?.questsCompleted ?? 3;
  const totalQuests = 6;
  const tier = getScoreTier(score);

  const stats = [
    {
      icon: TrendingUp,
      label: "Future Score",
      value: score,
      sub: tier.label,
    },
    {
      icon: Zap,
      label: "Day Streak",
      value: streak,
      sub: "days active",
    },
    {
      icon: Globe,
      label: "Structures",
      value: completedQuests,
      sub: `of ${totalQuests} built`,
    },
    {
      icon: AlertTriangle,
      label: "World State",
      value: tier.label,
      sub: score >= 600 ? "Thriving" : score >= 300 ? "Fragile" : "Critical",
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">Future World</h1>
          <p className="text-zinc-500 mt-1">
            A living reflection of your financial discipline.
          </p>
        </motion.div>

        {/* Tier badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm"
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: tier.color, boxShadow: `0 0 8px ${tier.color}` }}
          />
          <span className="font-medium text-white">{tier.label}</span>
          <span className="text-zinc-500">— Score {score}</span>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
              className="glass-card bg-white/[0.03] border border-white/8 rounded-2xl p-4"
            >
              <stat.icon className="w-4 h-4 text-zinc-500 mb-2" />
              <p className="text-xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* 3D Canvas — Desktop (with 2D fallback) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="hidden md:block relative w-full rounded-2xl overflow-hidden border border-white/8 bg-black"
          style={{ height: 480 }}
        >
          {/* Corner labels */}
          <div className="absolute top-4 left-4 z-10 text-xs text-zinc-600 font-mono select-none pointer-events-none">
            FUTURE WORLD — {tier.label.toUpperCase()}
          </div>
          <div className="absolute top-4 right-4 z-10 text-xs text-zinc-600 font-mono select-none pointer-events-none">
            SCORE {score} / 1000
          </div>
          <div className="absolute bottom-4 left-4 z-10 text-xs text-zinc-600 select-none pointer-events-none">
            Drag to explore · Scroll to zoom
          </div>

          {webglOk === null ? (
            <div className="w-full h-full flex items-center justify-center bg-black text-zinc-600 text-sm">
              Initializing…
            </div>
          ) : webglOk ? (
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center bg-black text-zinc-600 text-sm">
                Rendering world…
              </div>
            }>
              <Canvas
                camera={{ position: [6, 5, 8], fov: 55 }}
                dpr={[1, 1.5]}
                gl={{ antialias: true, alpha: false, failIfMajorPerformanceCaveat: false }}
                onCreated={({ gl }) => {
                  gl.setClearColor(new THREE.Color("#000000"));
                }}
              >
                <WorldScene
                  score={score}
                  streak={streak}
                  completedQuests={completedQuests}
                  totalQuests={totalQuests}
                />
                <OrbitControls
                  enablePan
                  enableZoom
                  enableRotate
                  minDistance={3}
                  maxDistance={20}
                  maxPolarAngle={Math.PI / 2.1}
                  autoRotate
                  autoRotateSpeed={0.4}
                />
              </Canvas>
            </Suspense>
          ) : (
            <DesktopWorldFallback score={score} tier={tier} streak={streak} completedQuests={completedQuests} />
          )}
        </motion.div>

        {/* Mobile preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="md:hidden glass-card bg-black/60 border border-white/8 rounded-2xl p-6"
        >
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-4">World Preview</p>
          <MobileWorldPreview score={score} tier={tier} />
          <p className="text-center text-xs text-zinc-600 mt-4">View on desktop for full 3D exploration</p>
        </motion.div>

        {/* World legend */}
        <div className="grid md:grid-cols-3 gap-3">
          {[
            {
              label: "Central Monolith",
              desc: "Grows with your Future Score. Glitches below 300.",
              active: true,
            },
            {
              label: "Quest Pillars",
              desc: "Each completed quest raises a pillar. Empty ring = missed opportunities.",
              active: completedQuests > 0,
            },
            {
              label: "Crystal Shards",
              desc: "Appear for every 3 streak days. Orbit the monolith.",
              active: streak >= 3,
            },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
              className={`rounded-2xl p-4 border transition-all ${
                item.active
                  ? "border-white/15 bg-white/[0.04]"
                  : "border-white/5 bg-black/20 opacity-50"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: item.active ? "#ffffff" : "#333333",
                    boxShadow: item.active ? "0 0 6px #ffffff80" : "none",
                  }}
                />
                <p className="text-sm font-medium text-white">{item.label}</p>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* World state message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="rounded-2xl border border-white/8 bg-white/[0.02] p-5"
        >
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">World Message</p>
          <p className="text-white leading-relaxed">
            {score >= 800
              ? "Your world has ascended. The monolith stands eternal — a monument to relentless discipline. Your future self walks in light."
              : score >= 600
              ? "The city of your future rises steadily. Each decision you make lays another stone. Keep building."
              : score >= 400
              ? "Structures are emerging from the dust. There is progress here, but fragility too. Stay consistent."
              : score >= 200
              ? "The world is scarred. Broken pillars litter the ground. Your future self is waiting for you to act."
              : "Wasteland. The monolith flickers. Every day without discipline is another crack in the foundation."}
          </p>
        </motion.div>
      </div>
    </AppLayout>
  );
}

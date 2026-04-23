import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const MOBILE_PARTICLE_COUNT = 400;
const MOBILE_INITIAL_COUNT = 300;
const DESKTOP_PARTICLE_COUNT = 800;
const DESKTOP_INITIAL_COUNT = 600;
const MOBILE_HALF = MOBILE_INITIAL_COUNT / 2;
const DESKTOP_HALF = DESKTOP_INITIAL_COUNT / 2;

function Particles({ simulationMode }: { simulationMode: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const scrollRef = useRef(0);
  const maxScrollRef = useRef(1);
  const frameRef = useRef(0);

  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  }, []);

  const timings = useMemo(() => {
    return isMobile
      ? { approachEnd: 0.05, collisionEnd: 0.1 }
      : { approachEnd: 0.08, collisionEnd: 0.15 };
  }, [isMobile]);

  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
      maxScrollRef.current = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const animatedProgress = useRef(0);

  const PARTICLE_COUNT = isMobile
    ? MOBILE_PARTICLE_COUNT
    : DESKTOP_PARTICLE_COUNT;

  const INITIAL_COUNT = isMobile
    ? MOBILE_INITIAL_COUNT
    : DESKTOP_INITIAL_COUNT;

  const HALF = isMobile ? MOBILE_HALF : DESKTOP_HALF;

  // ✅ TYPED ARRAYS (major perf win)
  const particles = useMemo(() => {
    const data = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const isInitial = i < INITIAL_COUNT;
      const isLeft = i < HALF;

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.pow(Math.random(), 1 / 3) * 1.5;

      const ex = Math.random() - 0.5;
      const ey = Math.random() - 0.5;
      const ez = (Math.random() - 0.5) * 0.5;

      const elen = Math.sqrt(ex * ex + ey * ey + ez * ez) || 1;

      const dx = Math.random() * 2 - 1;
      const dy = Math.random() * 2 - 1;
      const dz = Math.random() * 2 - 1;

      const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;

      const speed = 4 + Math.random() * 6;

      data.push({
        homeX: r * Math.sin(phi) * Math.cos(theta),
        homeY: r * Math.sin(phi) * Math.sin(theta),
        homeZ: r * Math.cos(phi) * 0.6,

        explodeX: ex / elen,
        explodeY: ey / elen,
        explodeZ: ez / elen,

        velX: (dx / len) * speed,
        velY: (dy / len) * speed,
        velZ: (dz / len) * speed,

        flowX: Math.random() * 100,
        flowY: Math.random() * 100,
        flowZ: Math.random() * 100,

        sinOffset1: Math.random() * Math.PI * 2,
        sinOffset2: Math.random() * Math.PI * 2,

        chaosSpeed: 0.8 + Math.random() * 1.4,
        scale: Math.random() * 0.4 + 0.25,

        atom: isLeft ? 0 : 1,
        isInitial,
        spawnDelay: isInitial ? 0 : 0.15 + Math.random() * 0.4,

        speed,
      });
    }

    return data;
  }, []);

  const matrix = new THREE.Matrix4();
  const color = new THREE.Color();

  useFrame((state) => {
    if (!meshRef.current) return;

    frameRef.current++;

    const time = state.clock.elapsedTime;
    const targetProgress = scrollRef.current / maxScrollRef.current;

    animatedProgress.current +=
      (targetProgress - animatedProgress.current) *
      (isMobile ? 0.25 : 0.16);

    const sp = animatedProgress.current;

    const approachT = Math.min(sp / timings.approachEnd, 1);
    const collisionRaw =
      (sp - timings.approachEnd) /
      (timings.collisionEnd - timings.approachEnd);

    const collisionT = Math.max(0, Math.min(collisionRaw, 1));
    const chaosT = Math.max(
      0,
      (sp - timings.collisionEnd) / (1 - timings.collisionEnd)
    );

    const separation = 6 * (1 - approachT);

    // ✅ precomputed phase
    const phase =
      collisionT < 0.01 ? 0 : chaosT < 0.01 ? 1 : 2;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particles[i];

      if (!p.isInitial && collisionT < p.spawnDelay / 0.5) {
        matrix.setPosition(0, 0, -100);
        meshRef.current.setMatrixAt(i, matrix);
        continue;
      }

      const centerOffset = p.atom === 0 ? -separation : separation;
      const sin1 = Math.sin(time * 0.6 + p.sinOffset1);
      const sin2 = Math.sin(time * 0.3 + p.sinOffset2);

      let px = 0, py = 0, pz = 0;

      // --- PHASE SWITCH ---
      if (phase === 0) {
        const wobble = sin2 * 0.12;

        if (isMobile) {
          px = p.homeX + wobble;
          py = centerOffset + p.homeY + sin1 * 0.08;
        } else {
          px = centerOffset + p.homeX + wobble;
          py = p.homeY + sin1 * 0.08;
        }

        pz = p.homeZ;
      }

      else if (phase === 1) {
        const ease = collisionT * collisionT;
        const explodeDist = (p.speed * 0.05 + 0.6) * ease;

        let cx = isMobile ? p.homeX : centerOffset + p.homeX;
        let cy = isMobile ? centerOffset + p.homeY : p.homeY;

        px = cx * (1 - ease) + p.explodeX * explodeDist;
        py = cy * (1 - ease) + p.explodeY * explodeDist;
        pz = p.homeZ * (1 - ease) + p.explodeZ * explodeDist * 0.6;

        if (isMobile) [px, py] = [py, px];
      }

      else {
        const blend = Math.min(1, chaosT * 1.5);
        const radiusGain = 1 + chaosT * 1.4;
        const drift = 0.4 + chaosT * 2.8;
        const flowStrength = chaosT * 1.2;

        px = p.velX * radiusGain;
        py = p.velY * radiusGain;
        pz = p.velZ * radiusGain;

        const t = time * (0.6 + p.chaosSpeed);

        const flowX = Math.sin(t + p.flowX) + Math.cos(t * 0.7 + p.flowY);
        const flowY = Math.cos(t + p.flowY) - Math.sin(t * 0.8 + p.flowZ);
        const flowZ = Math.sin(t * 0.9 + p.flowZ);

        px += flowX * drift * flowStrength;
        py += flowY * drift * flowStrength;
        pz += flowZ * drift * flowStrength * 0.6;

        px *= blend;
        py *= blend;
        pz *= blend;
      }

      const s = p.scale * (1 + sin1 * 0.12);

      // ✅ manual matrix (no Object3D)
      matrix.makeScale(s * 0.06, s * 0.06, s * 0.06);
      matrix.setPosition(px, py, pz);

      meshRef.current.setMatrixAt(i, matrix);

      // ✅ update color every 2 frames
      let hue: number;

      if (phase === 0) {
        hue = p.atom === 0 ? 0.6 : 0.5;
      } else {
        hue = 0.55 - (collisionT * 0.2 + chaosT * 0.3);
      }

      const saturation = 0.65 + collisionT * 0.2 + chaosT * 0.15;
      const lightness = 0.45 + collisionT * 0.2 + chaosT * 0.2;

      color.setHSL(
        hue < 0.05 ? 0.05 : hue > 0.65 ? 0.65 : hue,
        saturation > 1 ? 1 : saturation,
        lightness > 0.85 ? 0.85 : lightness
      );

      meshRef.current.setColorAt(i, color);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial transparent opacity={0.85} toneMapped={false} />
    </instancedMesh>
  );
}

export default function ParticleCanvas({ simulationMode }: { simulationMode: boolean }) {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.25]}
        gl={{ antialias: false, alpha: true }}
      >
        <Particles simulationMode={simulationMode} />
      </Canvas>
    </div>
  );
}
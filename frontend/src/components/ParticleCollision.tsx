import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";


const MOBILE_PARTICLE_COUNT = 400;
const MOBILE_INITIAL_COUNT = 300;
const DESKTOP_PARTICLE_COUNT = 800;
const DESKTOP_INITIAL_COUNT = 600;
const MOBILE_HALF = MOBILE_INITIAL_COUNT / 2;
const DESKTOP_HALF = DESKTOP_INITIAL_COUNT / 2;

function Particles() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const scrollRef = useRef(0);
  const maxScrollRef = useRef(1);

  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  }, []);

  const timings = useMemo(() => {
    return isMobile
      ? {
          approachEnd: 0.05,   // faster (was 0.08)
          collisionEnd: 0.10,  // faster (was 0.15)
        }
      : {
          approachEnd: 0.08,
          collisionEnd: 0.15,
        };
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

  const PARTICLE_COUNT = useMemo(
    () => isMobile ? MOBILE_PARTICLE_COUNT : DESKTOP_PARTICLE_COUNT, 
    [isMobile]
  );

  const INITIAL_COUNT = useMemo(
    () => isMobile ? MOBILE_INITIAL_COUNT : DESKTOP_INITIAL_COUNT, 
    [isMobile]
  );

  const HALF = useMemo(
    () => isMobile ? MOBILE_HALF : DESKTOP_HALF, 
    [isMobile]
  );

  const particles = useMemo(() => {
    const data = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const isInitial = i < INITIAL_COUNT;
      const isLeft = i < HALF;

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.pow(Math.random(), 1 / 3) * 1.5;

      const ox = r * Math.sin(phi) * Math.cos(theta);
      const oy = r * Math.sin(phi) * Math.sin(theta);
      const oz = r * Math.cos(phi) * 0.6;

      const explodeDir = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        (Math.random() - 0.5) * 0.5
      ).normalize();

      const dir = new THREE.Vector3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      ).normalize();

      const speed = 4 + Math.random() * 6;
      data.push({
        homeOffset: new THREE.Vector3(ox, oy, oz),
        explodeDir,
        velocity: dir.multiplyScalar(speed),
        chaosOffset: Math.random() * Math.PI * 2,
        chaosSpeed: 0.8 + Math.random() * 1.4,
        flowOffset: new THREE.Vector3(
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100
        ),
        scale: Math.random() * 0.4 + 0.25,
        atom: isLeft ? 0 : 1,
        isInitial,
        spawnDelay: isInitial ? 0 : 0.15 + Math.random() * 0.4,
      });
    }
    return data;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);

  useFrame((state) => {
    if (!meshRef.current) return;

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
      (sp - timings.collisionEnd) /
        (1 - timings.collisionEnd)
    );

    const separation = 6 * (1 - approachT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particles[i];
      const centerOffset = p.atom === 0 ? -separation : separation;

      if (!p.isInitial) {
        if (collisionT < p.spawnDelay / 0.5) {
          dummy.position.set(0, 0, -100);
          dummy.scale.setScalar(0);
          dummy.updateMatrix();
          meshRef.current.setMatrixAt(i, dummy.matrix);
          continue;
        }
      }

      let px: number, py: number, pz: number;

      // --- PRE COLLISION ---
      if (collisionT < 0.01) {
        const wobble = Math.sin(time * 0.5 + i * 0.1) * 0.12;
        if (isMobile) {
          px = p.homeOffset.x + wobble;
          py = centerOffset + p.homeOffset.y + Math.sin(time * 0.3 + i * 0.2) * 0.08;
        } else {
          px = centerOffset + p.homeOffset.x + wobble;
          py = p.homeOffset.y + Math.sin(time * 0.3 + i * 0.2) * 0.08;
        }
        pz = p.homeOffset.z;
      }

      // --- COLLISION BURST ---
      else if (chaosT < 0.01) {
        const ease = collisionT * collisionT;

        const explodeDist =
          (p.velocity.length() * 0.05 + 0.6) * ease;

        const clusterX = isMobile
          ? p.homeOffset.x
          : centerOffset + p.homeOffset.x;
        const clusterY = isMobile
          ? centerOffset + p.homeOffset.y
          : p.homeOffset.y;
        const clusterZ = p.homeOffset.z;

        px = clusterX * (1 - ease) + p.explodeDir.x * explodeDist;
        py = clusterY * (1 - ease) + p.explodeDir.y * explodeDist;
        pz = clusterZ * (1 - ease) + p.explodeDir.z * explodeDist * 0.6;
        if (isMobile) {
          const temp = px;
          px = py;
          py = temp;
        }
      }

      // --- 🌊 FLUID CHAOS ---
      else {
        const blend = Math.min(1, chaosT * 1.5);

        const radiusGain = 1 + chaosT * 1.4;
        const drift = 0.4 + chaosT * 2.8;
        const flowStrength = chaosT * 1.2;

        px = p.velocity.x * radiusGain;
        py = p.velocity.y * radiusGain;
        pz = p.velocity.z * radiusGain;

        const t = time * (0.6 + p.chaosSpeed);

        const flowX =
          Math.sin(t + p.flowOffset.x) +
          Math.cos(t * 0.7 + p.flowOffset.y);

        const flowY =
          Math.cos(t + p.flowOffset.y) -
          Math.sin(t * 0.8 + p.flowOffset.z);

        const flowZ = Math.sin(t * 0.9 + p.flowOffset.z);

        px += flowX * drift * flowStrength;
        py += flowY * drift * flowStrength;
        pz += flowZ * drift * flowStrength * 0.6;

        const swirl = Math.sin(time * 0.3 + i * 0.1) * chaosT;
        px += swirl * py * 0.05;
        py += swirl * px * 0.05;

        px *= blend;
        py *= blend;
        pz *= blend;
      }

      const s = p.scale * (1 + Math.sin(time * 0.6 + i) * 0.12);

      dummy.position.set(px, py, pz);
      dummy.scale.setScalar(s * 0.06);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      // Color evolution
      let hue =
        collisionT < 0.01
          ? p.atom === 0
            ? 0.6
            : 0.5
          : 0.55 - (collisionT * 0.2 + chaosT * 0.3);

      const saturation = 0.65 + collisionT * 0.2 + chaosT * 0.15;
      const lightness = 0.45 + collisionT * 0.2 + chaosT * 0.2;

      color.setHSL(
        Math.max(0.05, Math.min(0.65, hue)),
        Math.min(1, saturation),
        Math.min(0.85, lightness)
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

export default function ParticleCanvas() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Particles />
      </Canvas>
    </div>
  );
}
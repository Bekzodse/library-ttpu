import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  RotateCw, ZoomIn, ZoomOut, Maximize2, Minimize2, Sun, Moon,
  Box, Eye, Layers, Check, ArrowRight, Sparkles, Compass, ChevronDown, Info
} from "lucide-react";
import {
  buildRoom1Capsule,
  buildRoom2Bunk,
  buildRoom3Twin,
  buildRoom4Studio,
  ROOM_3D_METADATA
} from "./rooms3d.js";

/**
 * SingleRoom3DCanvas: A self-contained, high-performance, full-width 3D interactive viewer for one room.
 * Uses IntersectionObserver to pause the render loop when scrolled offscreen.
 */
export function SingleRoom3DCanvas({ roomIndex = 0, onBookRoom, isFullScrollMode = true }) {
  const mountRef = useRef(null);
  const meta = ROOM_3D_METADATA[roomIndex] || ROOM_3D_METADATA[0];

  const [cameraView, setCameraView] = useState("perspective"); // "perspective", "inside", "dollhouse"
  const [isNight, setIsNight] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [showRefCompare, setShowRefCompare] = useState(false);

  const sceneRefs = useRef({
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    roomConfig: null,
    targetCamPos: new THREE.Vector3(),
    targetLookAt: new THREE.Vector3(),
    isTransitioning: false,
    hemiLight: null,
    sunLight: null,
    roomGroup: null,
    isVisible: true
  });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const bgColor = isNight ? "#0a1320" : "#edf2f7";
    scene.background = new THREE.Color(bgColor);
    scene.fog = new THREE.Fog(bgColor, 11, 32);

    const camera = new THREE.PerspectiveCamera(52, mount.clientWidth / mount.clientHeight, 0.1, 80);
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    // 2. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.055;
    controls.maxDistance = 14;
    controls.minDistance = 0.5;
    controls.maxPolarAngle = Math.PI / 2 + 0.04; // prevent going beneath floor
    controls.target.set(0, 1.4, 0);

    // 3. Build the specific room model
    const roomGroup = new THREE.Group();
    scene.add(roomGroup);

    let roomConfig;
    if (roomIndex === 0) {
      roomConfig = buildRoom1Capsule(roomGroup);
    } else if (roomIndex === 1) {
      roomConfig = buildRoom2Bunk(roomGroup);
    } else if (roomIndex === 2) {
      roomConfig = buildRoom3Twin(roomGroup);
    } else {
      roomConfig = buildRoom4Studio(roomGroup);
    }

    // 4. Lighting
    const hemiLight = new THREE.HemisphereLight(
      isNight ? "#1e293b" : "#ffffff",
      isNight ? "#0f172a" : "#cbd5e1",
      isNight ? 0.6 : 1.35
    );
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(isNight ? "#38bdf8" : "#fff8ee", isNight ? 0.7 : 2.1);
    sunLight.position.set(9, 16, 11);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(1024, 1024);
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Initial Camera
    camera.position.copy(roomConfig.defaultCameraPos);
    controls.target.copy(roomConfig.cameraTarget);
    controls.update();

    sceneRefs.current = {
      scene,
      camera,
      renderer,
      controls,
      roomConfig,
      targetCamPos: new THREE.Vector3().copy(roomConfig.defaultCameraPos),
      targetLookAt: new THREE.Vector3().copy(roomConfig.cameraTarget),
      isTransitioning: false,
      hemiLight,
      sunLight,
      roomGroup,
      isVisible: true
    };

    // 5. Responsive Resize
    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mount);

    // 6. Viewport Visibility IntersectionObserver (Pauses loop when off-screen)
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        sceneRefs.current.isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    visibilityObserver.observe(mount);

    // 7. Render Loop
    let frameId;
    const animate = () => {
      const s = sceneRefs.current;
      if (s.isVisible) {
        if (s.isTransitioning) {
          camera.position.lerp(s.targetCamPos, 0.065);
          controls.target.lerp(s.targetLookAt, 0.065);
          if (
            camera.position.distanceTo(s.targetCamPos) < 0.04 &&
            controls.target.distanceTo(s.targetLookAt) < 0.04
          ) {
            s.isTransitioning = false;
          }
        }
        controls.autoRotate = autoRotate;
        controls.autoRotateSpeed = 0.65;
        controls.update();
        renderer.render(scene, camera);
      }
      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [roomIndex]);

  // Lighting theme update
  useEffect(() => {
    const s = sceneRefs.current;
    if (!s.scene) return;
    const bg = isNight ? "#0a1320" : "#edf2f7";
    s.scene.background = new THREE.Color(bg);
    s.scene.fog.color = new THREE.Color(bg);
    if (s.hemiLight) {
      s.hemiLight.color.set(isNight ? "#1e293b" : "#ffffff");
      s.hemiLight.groundColor.set(isNight ? "#0f172a" : "#cbd5e1");
      s.hemiLight.intensity = isNight ? 0.5 : 1.35;
    }
    if (s.sunLight) {
      s.sunLight.color.set(isNight ? "#38bdf8" : "#fff8ee");
      s.sunLight.intensity = isNight ? 0.7 : 2.1;
    }
  }, [isNight]);

  // Camera preset transitions
  const applyCameraView = useCallback((view) => {
    setCameraView(view);
    const s = sceneRefs.current;
    if (!s.camera || !s.roomConfig) return;

    const cfg = s.roomConfig;
    if (view === "inside") {
      s.targetCamPos.set(0, 1.55, 0.15);
      s.targetLookAt.set(0, 1.45, -1.8);
    } else if (view === "dollhouse") {
      s.targetCamPos.copy(cfg.dollhousePos);
      s.targetLookAt.copy(cfg.cameraTarget);
    } else {
      s.targetCamPos.copy(cfg.defaultCameraPos);
      s.targetLookAt.copy(cfg.cameraTarget);
    }
    s.isTransitioning = true;
    setActiveHotspot(null);
  }, []);

  const zoomCamera = (delta) => {
    const s = sceneRefs.current;
    if (!s.camera) return;
    const dir = new THREE.Vector3().subVectors(s.camera.position, s.controls.target).normalize();
    s.camera.position.addScaledVector(dir, delta);
    s.controls.update();
  };

  const focusHotspot = (hotspot) => {
    setActiveHotspot(hotspot);
    const s = sceneRefs.current;
    if (!s.camera || !hotspot.pos) return;
    const [hx, hy, hz] = hotspot.pos;
    s.targetLookAt.set(hx, hy, hz);
    s.targetCamPos.set(hx + 0.8, hy + 0.6, hz + 1.2);
    s.isTransitioning = true;
  };

  const currentHotspots = sceneRefs.current.roomConfig?.hotspots || [];

  return (
    <article
      id={`room-3d-section-${roomIndex}`}
      className={`room-3d-section ${isFullscreen ? "is-fullscreen" : ""}`}
      aria-label={meta.name}
    >
      {/* 3D CANVAS VIEWPORT */}
      <div className="room-3d-canvas-wrap" ref={mountRef} />

      {/* TOP OVERLAY HEADER */}
      <div className="room-3d-top-nav">
        <div className="room-3d-branding">
          <span className="live-3d-badge">
            <span className="live-dot" /> 100% REAL 3D XONA
          </span>
          <span className="room-badge-title">{meta.name}</span>
        </div>

        {/* TOP CONTROLS */}
        <div className="room-3d-top-actions">
          <button
            type="button"
            className={`tool-pill ${showRefCompare ? "active" : ""}`}
            onClick={() => setShowRefCompare((c) => !c)}
            title="Haqiqiy fotosurat bilan solishtirish"
          >
            <Eye size={14} /> Solishtirish
          </button>
          <button
            type="button"
            className="tool-pill"
            onClick={() => setIsNight((n) => !n)}
            title="Kunduzgi / Tungi yorug‘lik"
          >
            {isNight ? <Moon size={14} color="#38bdf8" /> : <Sun size={14} color="#f59e0b" />}
            {isNight ? "Tun" : "Kun"}
          </button>
          <button
            type="button"
            className="tool-icon-btn"
            onClick={() => zoomCamera(-1.2)}
            title="Kattalashtirish (Zoom In)"
          >
            <ZoomIn size={15} />
          </button>
          <button
            type="button"
            className="tool-icon-btn"
            onClick={() => zoomCamera(1.2)}
            title="Kichiklashtirish (Zoom Out)"
          >
            <ZoomOut size={15} />
          </button>
          <button
            type="button"
            className="tool-icon-btn"
            onClick={() => setIsFullscreen((f) => !f)}
            title="To‘liq ekran"
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </div>

      {/* REFERENCE IMAGE COMPARISON (PIP) */}
      {showRefCompare && (
        <div className="room-ref-compare-card" role="dialog" aria-label="Haqiqiy rasm taqqoslash">
          <div className="ref-header">
            <span>Haqiqiy xona fotosurati</span>
            <button type="button" onClick={() => setShowRefCompare(false)} aria-label="Yopish">×</button>
          </div>
          <img src={meta.refImage} alt={meta.name} />
          <small>3D model aynan shu rasm asosida aniq mebel, tekstura va ranglar bilan yaratildi.</small>
        </div>
      )}

      {/* FLOATING CAMERA VIEW PRESETS */}
      <div className="room-camera-presets">
        <span className="presets-label"><Compass size={13} /> Kamera:</span>
        <button
          type="button"
          className={`cam-btn ${cameraView === "perspective" ? "active" : ""}`}
          onClick={() => applyCameraView("perspective")}
        >
          <Box size={13} /> 3D Burchak
        </button>
        <button
          type="button"
          className={`cam-btn ${cameraView === "inside" ? "active" : ""}`}
          onClick={() => applyCameraView("inside")}
        >
          <RotateCw size={13} /> Xona Ichidan (360°)
        </button>
        <button
          type="button"
          className={`cam-btn ${cameraView === "dollhouse" ? "active" : ""}`}
          onClick={() => applyCameraView("dollhouse")}
        >
          <Layers size={13} /> Yuqoridan
        </button>
        <button
          type="button"
          className={`cam-btn ${autoRotate ? "active" : ""}`}
          onClick={() => setAutoRotate((a) => !a)}
          title="Avtomatik 360° aylantirish"
        >
          <RotateCw size={13} /> {autoRotate ? "To‘xtatish" : "Avto-aylanish"}
        </button>
      </div>

      {/* HOTSPOTS BAR */}
      <div className="room-hotspots-bar">
        <span className="hotspot-title"><Sparkles size={13} /> Jihozlar:</span>
        {currentHotspots.map((h) => (
          <button
            key={h.id}
            type="button"
            className={`hotspot-btn ${activeHotspot?.id === h.id ? "active" : ""}`}
            onClick={() => (activeHotspot?.id === h.id ? setActiveHotspot(null) : focusHotspot(h))}
          >
            <Info size={12} /> {h.title}
          </button>
        ))}
      </div>

      {/* ACTIVE HOTSPOT POPOVER */}
      {activeHotspot && (
        <div className="hotspot-popover">
          <div className="popover-header">
            <b>{activeHotspot.title}</b>
            <button type="button" onClick={() => setActiveHotspot(null)}>×</button>
          </div>
          <p>{activeHotspot.desc}</p>
        </div>
      )}

      {/* SPECS & BOOKING PANEL */}
      <div className="room-specs-card">
        <div className="specs-top">
          <span className="specs-tag">{meta.tag}</span>
          <span className="specs-cap">{meta.capacity}</span>
        </div>
        <h3>{meta.name}</h3>
        <p className="specs-desc">{meta.description}</p>
        <div className="specs-amenities">
          {meta.amenities.slice(0, 4).map((a) => (
            <span key={a}><Check size={13} /> {a}</span>
          ))}
        </div>
        <div className="specs-bottom">
          <div className="specs-price">
            <strong>{meta.price}</strong>
            <small> / {meta.period}</small>
          </div>
          <button
            type="button"
            className="btn btn-primary room-book-btn"
            onClick={() => onBookRoom?.(meta)}
          >
            Xonani band qilish <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* INTERACTION HINT */}
      <div className="room-interaction-hint">
        <span>Sichqoncha yoki barmoq bilan 360° aylantiring · Zoom uchun g‘ildirakdan foydalaning</span>
      </div>

      {/* SCROLL DOWN INDICATOR TO NEXT 3D ROOM (if in feed mode) */}
      {isFullScrollMode && roomIndex < ROOM_3D_METADATA.length - 1 && (
        <div
          className="scroll-next-room-cue"
          onClick={() => {
            const nextEl = document.getElementById(`room-3d-section-${roomIndex + 1}`);
            if (nextEl) nextEl.scrollIntoView({ behavior: "smooth" });
          }}
          title="Keyingi 3D xonani ko‘rish"
        >
          <span>Keyingi 3D xona: 0{roomIndex + 2}</span>
          <ChevronDown size={18} />
        </div>
      )}
    </article>
  );
}

/**
 * Full-page 3D Dormitory Experience:
 * Displays all rooms sequentially as full-width 3D sections as the user scrolls down,
 * with a sticky navigation bar to quickly jump between rooms.
 */
export default function Room3DExperience({ onBookRoom, initialRoomIndex = null }) {
  const [activeSection, setActiveSection] = useState(initialRoomIndex !== null ? initialRoomIndex : 0);

  // If a specific room index is requested exclusively (e.g. single room modal)
  if (initialRoomIndex !== null && initialRoomIndex >= 0 && initialRoomIndex < ROOM_3D_METADATA.length) {
    return (
      <div className="room-3d-showcase single-room-mode">
        <SingleRoom3DCanvas
          roomIndex={initialRoomIndex}
          onBookRoom={onBookRoom}
          isFullScrollMode={false}
        />
      </div>
    );
  }

  // Scroll spy to update sticky pill active tab
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.4;
      for (let i = 0; i < ROOM_3D_METADATA.length; i++) {
        const el = document.getElementById(`room-3d-section-${i}`);
        if (el) {
          const top = el.offsetTop;
          const bottom = top + el.offsetHeight;
          if (scrollPos >= top && scrollPos < bottom) {
            setActiveSection(i);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToRoom = (index) => {
    setActiveSection(index);
    const target = document.getElementById(`room-3d-section-${index}`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="rooms-3d-scroll-feed" id="rooms-3d-experience">
      {/* SECTION INTRO HEADER */}
      <div className="rooms-3d-feed-header">
        <span className="section-kicker"><i /> 100% Interaktiv 3D</span>
        <h2>Haqiqiy Fotosuratlar Asosidagi 3D Xonalar</h2>
        <p>
          Fotosuratlar asosida yaratilgan to‘liq interaktiv 3D xonalar. Sahifani pastga surib,
          har bir xonani 360° burchak ostida kashf qiling yoki ichkariga virtual sayohat qiling.
        </p>

        {/* STICKY ROOM QUICK-JUMP TABS */}
        <div className="rooms-3d-sticky-nav">
          {ROOM_3D_METADATA.map((room, idx) => (
            <button
              key={room.id}
              type="button"
              className={`feed-nav-pill ${activeSection === idx ? "active" : ""}`}
              onClick={() => scrollToRoom(idx)}
            >
              <span className="pill-index">0{idx + 1}</span>
              <span className="pill-title">{room.name.replace(/^0\d\s*\/\s*/, "")}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3 FULL-WIDTH 3D SECTIONS */}
      <div className="rooms-3d-sections-wrap">
        {ROOM_3D_METADATA.map((room, idx) => (
          <SingleRoom3DCanvas
            key={room.id}
            roomIndex={idx}
            onBookRoom={onBookRoom}
            isFullScrollMode={true}
          />
        ))}
      </div>
    </div>
  );
}

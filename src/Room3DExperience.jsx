import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  RotateCw, ZoomIn, ZoomOut, Maximize2, Minimize2, Sun, Moon,
  Box, Eye, Check, ArrowRight, Sparkles, Compass, ChevronDown, Info
} from "lucide-react";
import { ROOM_3D_METADATA } from "./rooms3d.js";

/**
 * SingleRoom3DCanvas:
 * Photorealistic 360° Three.js interactive viewer using the actual reference photo.
 * Allows full 360-degree rotation, zoom, auto-rotation, day/night lighting, and direct booking.
 */
export function SingleRoom3DCanvas({ roomIndex = 0, onBookRoom, isFullScrollMode = true }) {
  const mountRef = useRef(null);
  const meta = ROOM_3D_METADATA[roomIndex] || ROOM_3D_METADATA[0];

  const [isNight, setIsNight] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [showRefCompare, setShowRefCompare] = useState(false);

  const sceneRefs = useRef({
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    sphereMat: null,
    isVisible: true
  });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isNight ? "#06101c" : "#0d1b2a");

    const camera = new THREE.PerspectiveCamera(65, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 0.01);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    // 2. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.rotateSpeed = -0.3; // natural inverted drag
    controls.enableZoom = true;
    controls.minDistance = 0.001;
    controls.maxDistance = 10;
    controls.minPolarAngle = 0.1;
    controls.maxPolarAngle = Math.PI - 0.1;

    // 3. 360° Photorealistic Inverted Sphere of the ACTUAL room image
    const sphereGeo = new THREE.SphereGeometry(50, 64, 40);
    sphereGeo.scale(-1, 1, 1);

    const sphereMat = new THREE.MeshBasicMaterial({
      color: isNight ? 0x94a3b8 : 0xffffff
    });

    const loader = new THREE.TextureLoader();
    loader.load(
      meta.refImage,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        sphereMat.map = texture;
        sphereMat.needsUpdate = true;
      },
      undefined,
      (err) => console.error("Error loading room texture:", err)
    );

    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphereMesh);

    sceneRefs.current = {
      scene,
      camera,
      renderer,
      controls,
      sphereMat,
      isVisible: true
    };

    // 4. Resize Observer
    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mount);

    // 5. Intersection Observer (Pauses rendering when scrolled out of view)
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        sceneRefs.current.isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    visibilityObserver.observe(mount);

    // 6. Render Loop
    let frameId;
    const animate = () => {
      const s = sceneRefs.current;
      if (s.isVisible) {
        controls.autoRotate = autoRotate;
        controls.autoRotateSpeed = 0.45;
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
  }, [meta.refImage]);

  // Lighting / Night ambiance
  useEffect(() => {
    const s = sceneRefs.current;
    if (s.sphereMat) {
      s.sphereMat.color.set(isNight ? 0x94a3b8 : 0xffffff);
      s.sphereMat.needsUpdate = true;
    }
  }, [isNight]);

  const zoomCamera = (delta) => {
    const s = sceneRefs.current;
    if (!s.camera) return;
    s.camera.fov = Math.max(30, Math.min(95, s.camera.fov + delta * 10));
    s.camera.updateProjectionMatrix();
  };

  const currentHotspots = meta.amenities.map((amenity, i) => ({
    id: `amenity-${i}`,
    title: amenity,
    desc: `${meta.name} xonasida to‘liq jihozlangan ${amenity.toLowerCase()}.`
  }));

  return (
    <article
      id={`room-3d-section-${roomIndex}`}
      className={`room-3d-section ${isFullscreen ? "is-fullscreen" : ""}`}
      aria-label={meta.name}
    >
      {/* 360° THREE.JS CANVAS */}
      <div className="room-3d-canvas-wrap" ref={mountRef} />

      {/* TOP OVERLAY HEADER */}
      <div className="room-3d-top-nav">
        <div className="room-3d-branding">
          <span className="live-3d-badge">
            <span className="live-dot" /> 360° REAL 3D XONA
          </span>
          <span className="room-badge-title">{meta.name}</span>
        </div>

        {/* TOP CONTROLS */}
        <div className="room-3d-top-actions">
          <button
            type="button"
            className={`tool-pill ${showRefCompare ? "active" : ""}`}
            onClick={() => setShowRefCompare((c) => !c)}
            title="Asl fotosurat bilan solishtirish"
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
            onClick={() => zoomCamera(-1)}
            title="Kattalashtirish (Zoom In)"
          >
            <ZoomIn size={15} />
          </button>
          <button
            type="button"
            className="tool-icon-btn"
            onClick={() => zoomCamera(1)}
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
        <div className="room-ref-compare-card" role="dialog" aria-label="Asl fotosurat">
          <div className="ref-header">
            <span>Asl Reference Fotosurat</span>
            <button type="button" onClick={() => setShowRefCompare(false)} aria-label="Yopish">×</button>
          </div>
          <img src={meta.refImage} alt={meta.name} />
          <small>3D muhit aynan shu xona fotosurati asosida 360° sferada interaktiv yaratilgan.</small>
        </div>
      )}

      {/* FLOATING CONTROLS */}
      <div className="room-camera-presets">
        <span className="presets-label"><Compass size={13} /> Kamera:</span>
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
        {currentHotspots.slice(0, 4).map((h) => (
          <button
            key={h.id}
            type="button"
            className={`hotspot-btn ${activeHotspot?.id === h.id ? "active" : ""}`}
            onClick={() => setActiveHotspot(activeHotspot?.id === h.id ? null : h)}
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
        <span>Sichqoncha yoki barmoq bilan xonani 360° aylantiring · Zoom uchun g‘ildirakdan foydalaning</span>
      </div>

      {/* SCROLL DOWN INDICATOR TO NEXT ROOM */}
      {isFullScrollMode && roomIndex < ROOM_3D_METADATA.length - 1 && (
        <div
          className="scroll-next-room-cue"
          onClick={() => {
            const nextEl = document.getElementById(`room-3d-section-${roomIndex + 1}`);
            if (nextEl) nextEl.scrollIntoView({ behavior: "smooth" });
          }}
          title="Keyingi xonani ko‘rish"
        >
          <span>Keyingi xona: 0{roomIndex + 2}</span>
          <ChevronDown size={18} />
        </div>
      )}
    </article>
  );
}

/**
 * Full-page 3D Dormitory Experience:
 * Displays all 4 rooms sequentially as full-width 3D sections as the user scrolls down,
 * with a sticky navigation bar to quickly jump between rooms.
 */
export default function Room3DExperience({ onBookRoom, initialRoomIndex = null }) {
  const [activeSection, setActiveSection] = useState(initialRoomIndex !== null ? initialRoomIndex : 0);

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
          har bir xonani 360° burchak ostida kashf qiling.
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

      {/* 4 FULL-WIDTH 3D SECTIONS */}
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

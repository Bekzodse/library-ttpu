import * as THREE from "three";

// --- PROCEDURAL TEXTURES ---

export function createWoodPlankTexture(baseHex = "#964e22", grainHex = "#783914") {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, 512, 512);

  const plankHeight = 64;
  for (let y = 0; y < 512; y += plankHeight) {
    const shadeOffset = (Math.sin(y * 12.3) * 15) | 0;
    ctx.fillStyle = `rgba(0,0,0,${0.08 + Math.random() * 0.08})`;
    ctx.fillRect(0, y, 512, plankHeight);

    // Grain lines
    ctx.strokeStyle = grainHex;
    ctx.lineWidth = 1;
    for (let i = 0; i < 18; i++) {
      ctx.beginPath();
      const lineY = y + Math.random() * plankHeight;
      ctx.moveTo(0, lineY);
      ctx.bezierCurveTo(
        150, lineY + (Math.random() - 0.5) * 8,
        350, lineY + (Math.random() - 0.5) * 8,
        512, lineY
      );
      ctx.globalAlpha = 0.18 + Math.random() * 0.15;
      ctx.stroke();
    }

    // Seam line between planks
    ctx.globalAlpha = 0.65;
    ctx.strokeStyle = "#2b1406";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  ctx.globalAlpha = 1.0;
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createBirchTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#dfc8a9";
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = "#cbb08c";
  ctx.lineWidth = 1;
  for (let i = 0; i < 40; i++) {
    const y = Math.random() * 512;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(180, y + (Math.random() - 0.5) * 6, 340, y + (Math.random() - 0.5) * 6, 512, y);
    ctx.globalAlpha = 0.25;
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createTileTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#fcfdfd";
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 3;
  const tileSize = 128;
  for (let x = 0; x <= 512; x += tileSize) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 512); ctx.stroke();
  }
  for (let y = 0; y <= 512; y += tileSize) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createZebraBlindsTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, 256, 512);
  const stripeH = 24;
  for (let y = 0; y < 512; y += stripeH * 2) {
    // Dark stripe
    ctx.fillStyle = "#525b68";
    ctx.fillRect(0, y, 256, stripeH);
    // Sheer stripe
    ctx.fillStyle = "rgba(245, 247, 250, 0.45)";
    ctx.fillRect(0, y + stripeH, 256, stripeH);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createCarpetTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#3f4652";
  ctx.fillRect(0, 0, 256, 256);

  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    ctx.fillStyle = Math.random() > 0.5 ? "#4b5563" : "#2f3640";
    ctx.fillRect(x, y, 2, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// --- HELPER BUILDER ---

function makeBox(size, pos, mat, parent) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), mat);
  mesh.position.set(...pos);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function makeCylinder(radius, height, pos, mat, parent, rot = [0, 0, 0]) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 16), mat);
  mesh.position.set(...pos);
  mesh.rotation.set(...rot);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

// ============================================================================
// ROOM 1: CAPSULE / POD DORMITORY (Reference: room1.jpeg)
// Warm teak/cherry wood, 2-tier built-in capsule sleeping pods on left, right,
// and back wall, white mattresses, red foot runners, rolled towels, white pillows,
// integrated warm LED strip inside each pod, black ladders, under-bed storage drawers.
// ============================================================================

export function buildRoom1Capsule(group) {
  const woodPlankTex = createWoodPlankTexture("#a35422", "#7e3914");
  const woodCherryTex = createWoodPlankTexture("#8f4216", "#6c2f0e");

  const mat = {
    floor: new THREE.MeshStandardMaterial({ map: woodPlankTex, roughness: 0.35, metalness: 0.08 }),
    ceiling: new THREE.MeshStandardMaterial({ color: "#f2ede4", roughness: 0.9 }),
    wall: new THREE.MeshStandardMaterial({ color: "#e8dfd3", roughness: 0.9 }),
    podWood: new THREE.MeshStandardMaterial({ map: woodCherryTex, roughness: 0.38, metalness: 0.05 }),
    drawerWood: new THREE.MeshStandardMaterial({ map: woodPlankTex, roughness: 0.4, metalness: 0.06 }),
    mattress: new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.7 }),
    pillow: new THREE.MeshStandardMaterial({ color: "#fcfcfa", roughness: 0.8 }),
    runnerRed: new THREE.MeshStandardMaterial({ color: "#8c1527", roughness: 0.65 }),
    towelWhite: new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.9 }),
    ladderBlack: new THREE.MeshStandardMaterial({ color: "#18181b", metalness: 0.75, roughness: 0.25 }),
    lightLed: new THREE.MeshStandardMaterial({ color: "#fffbeb", emissive: "#fed7aa", emissiveIntensity: 2.2 }),
    socketBlack: new THREE.MeshStandardMaterial({ color: "#09090b", metalness: 0.6, roughness: 0.4 })
  };

  const W = 6.8;
  const L = 7.4;
  const H = 3.3;

  // Shell (Room box)
  // Floor
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, L), mat.floor);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  group.add(floor);

  // Ceiling
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W, L), mat.ceiling);
  ceil.rotation.x = Math.PI / 2;
  ceil.position.y = H;
  group.add(ceil);

  // Central recessed ceiling light
  makeBox([1.2, 0.06, 1.2], [0, H - 0.03, 0], mat.lightLed, group);

  // Back wall
  makeBox([W, H, 0.2], [0, H / 2, -L / 2], mat.wall, group);
  // Left wall
  makeBox([0.2, H, L], [-W / 2, H / 2, 0], mat.wall, group);
  // Right wall
  makeBox([0.2, H, L], [W / 2, H / 2, 0], mat.wall, group);

  // Helper for a single capsule bed pod
  function createCapsulePod(pos, rotY = 0, podW = 2.4, podL = 1.15, podH = 1.25) {
    const podGroup = new THREE.Group();
    podGroup.position.set(...pos);
    podGroup.rotation.y = rotY;
    group.add(podGroup);

    // Pod outer casing
    makeBox([podW, 0.08, podL], [0, 0, 0], mat.podWood, podGroup); // bottom plate
    makeBox([podW, 0.08, podL], [0, podH, 0], mat.podWood, podGroup); // top plate
    makeBox([0.08, podH, podL], [-podW / 2, podH / 2, 0], mat.podWood, podGroup); // side 1
    makeBox([0.08, podH, podL], [podW / 2, podH / 2, 0], mat.podWood, podGroup); // side 2
    makeBox([podW, podH, 0.08], [0, podH / 2, -podL / 2], mat.podWood, podGroup); // back wall

    // Mattress
    const mW = podW - 0.2;
    const mL = podL - 0.15;
    makeBox([mW, 0.18, mL], [0, 0.12, 0], mat.mattress, podGroup);

    // Red foot runner
    makeBox([0.65, 0.02, mL + 0.02], [mW / 2 - 0.45, 0.22, 0], mat.runnerRed, podGroup);

    // Rolled white towel on top of red runner
    makeCylinder(0.06, 0.4, [mW / 2 - 0.45, 0.29, 0], mat.towelWhite, podGroup, [Math.PI / 2, 0, 0]);

    // Fluffy white pillow
    const pillow = makeBox([0.52, 0.12, 0.72], [-mW / 2 + 0.38, 0.24, 0], mat.pillow, podGroup);
    pillow.rotation.z = -0.15;

    // Interior warm LED strip
    makeBox([podW - 0.4, 0.04, 0.06], [0, podH - 0.05, 0], mat.lightLed, podGroup);

    // Interior black socket plate
    makeBox([0.16, 0.12, 0.02], [-mW / 2 + 0.3, podH * 0.65, -podL / 2 + 0.05], mat.socketBlack, podGroup);

    // Safety guard rail (upper pods or front opening)
    makeCylinder(0.018, podW * 0.75, [0, 0.35, podL / 2 - 0.02], mat.ladderBlack, podGroup, [0, 0, Math.PI / 2]);
    makeCylinder(0.018, 0.35, [-podW * 0.35, 0.18, podL / 2 - 0.02], mat.ladderBlack, podGroup);
    makeCylinder(0.018, 0.35, [podW * 0.35, 0.18, podL / 2 - 0.02], mat.ladderBlack, podGroup);

    return podGroup;
  }

  // Under-bed storage drawer unit
  function createStorageDrawers(pos, width, length, height = 0.4) {
    const dGroup = new THREE.Group();
    dGroup.position.set(...pos);
    group.add(dGroup);

    makeBox([width, height, length], [0, height / 2, 0], mat.drawerWood, dGroup);
    // Drawer divider lines & handles
    const numDrawers = 3;
    const step = width / numDrawers;
    for (let i = 0; i < numDrawers; i++) {
      const dx = -width / 2 + step * (i + 0.5);
      makeBox([0.22, 0.03, 0.03], [dx, height / 2, length / 2 + 0.02], mat.ladderBlack, dGroup);
    }
  }

  // Vertical black steel ladder
  function createLadder(pos, height = 2.8) {
    const lGroup = new THREE.Group();
    lGroup.position.set(...pos);
    group.add(lGroup);

    const railSpacing = 0.44;
    makeCylinder(0.022, height, [-railSpacing / 2, height / 2, 0], mat.ladderBlack, lGroup);
    makeCylinder(0.022, height, [railSpacing / 2, height / 2, 0], mat.ladderBlack, lGroup);

    const rungs = 7;
    for (let i = 1; i < rungs; i++) {
      const ry = (height / rungs) * i;
      makeCylinder(0.016, railSpacing, [0, ry, 0], mat.ladderBlack, lGroup, [0, 0, Math.PI / 2]);
    }
  }

  // === LEFT WALL PODS (2-Tier Bunk Pods) ===
  const podDepth = 1.25;
  const podLength = 2.45;
  const podHeight = 1.35;
  const drawerH = 0.42;

  // Left Drawers
  createStorageDrawers([-W / 2 + podDepth / 2, 0, 0.6], podDepth, podLength * 2, drawerH);

  // Left Lower Pods
  createCapsulePod([-W / 2 + podDepth / 2, drawerH, -0.65], Math.PI / 2, podLength, podDepth, podHeight);
  createCapsulePod([-W / 2 + podDepth / 2, drawerH, 1.85], Math.PI / 2, podLength, podDepth, podHeight);

  // Left Upper Pods
  createCapsulePod([-W / 2 + podDepth / 2, drawerH + podHeight, -0.65], Math.PI / 2, podLength, podDepth, podHeight);
  createCapsulePod([-W / 2 + podDepth / 2, drawerH + podHeight, 1.85], Math.PI / 2, podLength, podDepth, podHeight);

  // Left Ladders
  createLadder([-W / 2 + podDepth + 0.05, 0, 0.55], 3.1);

  // === RIGHT WALL PODS (2-Tier Bunk Pods) ===
  // Right Drawers
  createStorageDrawers([W / 2 - podDepth / 2, 0, 0.6], podDepth, podLength * 2, drawerH);

  // Right Lower Pods
  createCapsulePod([W / 2 - podDepth / 2, drawerH, -0.65], -Math.PI / 2, podLength, podDepth, podHeight);
  createCapsulePod([W / 2 - podDepth / 2, drawerH, 1.85], -Math.PI / 2, podLength, podDepth, podHeight);

  // Right Upper Pods
  createCapsulePod([W / 2 - podDepth / 2, drawerH + podHeight, -0.65], -Math.PI / 2, podLength, podDepth, podHeight);
  createCapsulePod([W / 2 - podDepth / 2, drawerH + podHeight, 1.85], -Math.PI / 2, podLength, podDepth, podHeight);

  // Right Ladders
  createLadder([W / 2 - podDepth - 0.05, 0, 0.55], 3.1);

  // === BACK WALL PODS (2 Adjacent Pods, 2-Tier = 4 Pods) ===
  const backPodW = 1.95;
  // Back Drawers
  createStorageDrawers([0, 0, -L / 2 + podDepth / 2], backPodW * 2 + 0.1, podDepth, drawerH);

  // Back Lower Pods
  createCapsulePod([-backPodW / 2 - 0.05, drawerH, -L / 2 + podDepth / 2], 0, backPodW, podDepth, podHeight);
  createCapsulePod([backPodW / 2 + 0.05, drawerH, -L / 2 + podDepth / 2], 0, backPodW, podDepth, podHeight);

  // Back Upper Pods
  createCapsulePod([-backPodW / 2 - 0.05, drawerH + podHeight, -L / 2 + podDepth / 2], 0, backPodW, podDepth, podHeight);
  createCapsulePod([backPodW / 2 + 0.05, drawerH + podHeight, -L / 2 + podDepth / 2], 0, backPodW, podDepth, podHeight);

  // Central Ladder for back wall
  createLadder([0, 0, -L / 2 + podDepth + 0.05], 3.1);

  // Lights for Room 1
  const ceilingLight = new THREE.PointLight("#fff5eb", 1.8, 15);
  ceilingLight.position.set(0, H - 0.3, 0);
  ceilingLight.castShadow = true;
  group.add(ceilingLight);

  const leftFill = new THREE.PointLight("#ffedd5", 0.9, 8);
  leftFill.position.set(-W / 4, 1.8, 0);
  group.add(leftFill);

  const rightFill = new THREE.PointLight("#ffedd5", 0.9, 8);
  rightFill.position.set(W / 4, 1.8, 0);
  group.add(rightFill);

  return {
    cameraTarget: new THREE.Vector3(0, 1.6, -0.4),
    defaultCameraPos: new THREE.Vector3(0, 1.8, 2.7),
    dollhousePos: new THREE.Vector3(0, 5.8, 3.8),
    hotspots: [
      { id: "capsule-bed", title: "Kapsula Yotoq", desc: "Maxsus yog‘och panelli kapsula xona, to‘liq shaxsiy hudud va sokin muhit.", pos: [-2.1, 1.1, 0.8] },
      { id: "runner", title: "Qizil Choyshab & Sochiq", desc: "Mehmonxona darajasidagi toza oq to‘shak, qizil choyshab va sochiq to‘plami.", pos: [-1.8, 1.0, 1.6] },
      { id: "led", title: "Shaxsiy LED Yoritish", desc: "Har bir kapsula ichida o‘qish uchun qulay yumshoq LED yoritish va rozetka paneli.", pos: [-2.2, 2.4, 0.2] },
      { id: "storage", title: "Pastki Saqlash Tortmalari", desc: "Yotoq tagidagi keng yog‘och tortmalar talaba yuklari va narsalari uchun.", pos: [0, 0.35, -2.4] },
      { id: "ladder", title: "Metall Narvon", desc: "Ikkinchi qavatga chiqish uchun xavfsiz va mustahkam qora po‘lat narvon.", pos: [0, 1.6, -2.4] }
    ]
  };
}

// ============================================================================
// ROOM 2: MINIMALIST WHITE METAL BUNK ROOM (Reference: room2.jpeg)
// Ultra-clean white architecture, glossy reflective white porcelain tile floor,
// rows of white tubular steel bunk beds, terracotta/rust fitted bedsheets & pillows,
// folded mustard-yellow/ochre blankets at the foot, ceiling beams with black fans.
// ============================================================================

export function buildRoom2Bunk(group) {
  const tileTex = createTileTexture();

  const mat = {
    floor: new THREE.MeshStandardMaterial({
      map: tileTex,
      color: "#f8fafc",
      roughness: 0.08,
      metalness: 0.12
    }),
    wall: new THREE.MeshStandardMaterial({ color: "#f8fafc", roughness: 0.88 }),
    beam: new THREE.MeshStandardMaterial({ color: "#f1f5f9", roughness: 0.85 }),
    metalWhite: new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.25, metalness: 0.35 }),
    sheetTerracotta: new THREE.MeshStandardMaterial({ color: "#be5a3e", roughness: 0.65 }),
    blanketOchre: new THREE.MeshStandardMaterial({ color: "#d99726", roughness: 0.72 }),
    pillow: new THREE.MeshStandardMaterial({ color: "#bf583c", roughness: 0.68 }),
    stoolWhite: new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.3 }),
    fanBlack: new THREE.MeshStandardMaterial({ color: "#18181b", metalness: 0.8, roughness: 0.25 }),
    spotLight: new THREE.MeshStandardMaterial({ color: "#ffffff", emissive: "#ffffff", emissiveIntensity: 2.2 })
  };

  const W = 7.4;
  const L = 8.6;
  const H = 3.6;

  // Floor (Glossy porcelain tiles)
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, L), mat.floor);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  group.add(floor);

  // Ceiling
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W, L), mat.wall);
  ceil.rotation.x = Math.PI / 2;
  ceil.position.y = H;
  group.add(ceil);

  // Walls
  makeBox([W, H, 0.2], [0, H / 2, -L / 2], mat.wall, group);
  makeBox([0.2, H, L], [-W / 2, H / 2, 0], mat.wall, group);
  makeBox([0.2, H, L], [W / 2, H / 2, 0], mat.wall, group);

  // Ceiling structural beams & spotlights
  for (let z = -L / 2 + 2; z < L / 2; z += 2.5) {
    makeBox([W, 0.35, 0.45], [0, H - 0.175, z], mat.beam, group);

    // Recessed circular LED spots
    for (let x = -2.2; x <= 2.2; x += 2.2) {
      makeCylinder(0.12, 0.05, [x, H - 0.02, z - 0.8], mat.spotLight, group);
    }
  }

  // Black circular ceiling fan/exhaust fixtures
  makeCylinder(0.38, 0.14, [0, H - 0.08, -1.5], mat.fanBlack, group);
  makeCylinder(0.38, 0.14, [0, H - 0.08, 1.8], mat.fanBlack, group);

  // Single White Metal Bunk Bed Unit
  function createMetalBunkBed(pos, rotY = 0) {
    const bedGroup = new THREE.Group();
    bedGroup.position.set(...pos);
    bedGroup.rotation.y = rotY;
    group.add(bedGroup);

    const bW = 1.05;
    const bL = 2.15;
    const postH = 2.1;
    const rTube = 0.025;

    // 4 Corner Posts
    const halfW = bW / 2 - rTube;
    const halfL = bL / 2 - rTube;
    makeCylinder(rTube, postH, [-halfW, postH / 2, -halfL], mat.metalWhite, bedGroup);
    makeCylinder(rTube, postH, [halfW, postH / 2, -halfL], mat.metalWhite, bedGroup);
    makeCylinder(rTube, postH, [-halfW, postH / 2, halfL], mat.metalWhite, bedGroup);
    makeCylinder(rTube, postH, [halfW, postH / 2, halfL], mat.metalWhite, bedGroup);

    // Top horizontal connecting bars
    makeCylinder(rTube, bW, [0, postH - 0.03, -halfL], mat.metalWhite, bedGroup, [0, 0, Math.PI / 2]);
    makeCylinder(rTube, bW, [0, postH - 0.03, halfL], mat.metalWhite, bedGroup, [0, 0, Math.PI / 2]);
    makeCylinder(rTube, bL, [-halfW, postH - 0.03, 0], mat.metalWhite, bedGroup, [Math.PI / 2, 0, 0]);
    makeCylinder(rTube, bL, [halfW, postH - 0.03, 0], mat.metalWhite, bedGroup, [Math.PI / 2, 0, 0]);

    // Lower bunk mattress base (y = 0.45)
    makeBox([bW - 0.06, 0.05, bL - 0.06], [0, 0.45, 0], mat.metalWhite, bedGroup);
    // Lower mattress with Terracotta bedsheet
    makeBox([bW - 0.1, 0.22, bL - 0.1], [0, 0.58, 0], mat.sheetTerracotta, bedGroup);
    // Lower Pillow
    makeBox([bW - 0.35, 0.12, 0.55], [0, 0.72, -halfL + 0.4], mat.pillow, bedGroup);
    // Lower Ochre folded blanket at foot
    makeBox([bW - 0.2, 0.08, 0.6], [0, 0.72, halfL - 0.45], mat.blanketOchre, bedGroup);

    // Upper bunk mattress base (y = 1.45)
    makeBox([bW - 0.06, 0.05, bL - 0.06], [0, 1.45, 0], mat.metalWhite, bedGroup);
    // Upper mattress with Terracotta bedsheet
    makeBox([bW - 0.1, 0.22, bL - 0.1], [0, 1.58, 0], mat.sheetTerracotta, bedGroup);
    // Upper Pillow
    makeBox([bW - 0.35, 0.12, 0.55], [0, 1.72, -halfL + 0.4], mat.pillow, bedGroup);
    // Upper Ochre folded blanket at foot
    makeBox([bW - 0.2, 0.08, 0.6], [0, 1.72, halfL - 0.45], mat.blanketOchre, bedGroup);

    // Upper Safety Guard Rail
    makeCylinder(rTube * 0.8, bL, [halfW, 1.85, 0], mat.metalWhite, bedGroup, [Math.PI / 2, 0, 0]);
    makeCylinder(rTube * 0.8, bL, [-halfW, 1.85, 0], mat.metalWhite, bedGroup, [Math.PI / 2, 0, 0]);
    makeCylinder(rTube * 0.8, 0.4, [halfW, 1.65, -0.4], mat.metalWhite, bedGroup);
    makeCylinder(rTube * 0.8, 0.4, [halfW, 1.65, 0.4], mat.metalWhite, bedGroup);

    // Access Ladder on front/side
    const ladX = -halfW;
    makeCylinder(rTube * 0.8, 1.5, [ladX - 0.04, 0.75, halfL - 0.4], mat.metalWhite, bedGroup);
    for (let r = 0.5; r <= 1.4; r += 0.3) {
      makeCylinder(rTube * 0.7, 0.35, [ladX - 0.04, r, halfL - 0.2], mat.metalWhite, bedGroup, [Math.PI / 2, 0, 0]);
    }

    // Small white bedside table next to bed
    makeBox([0.38, 0.48, 0.38], [halfW + 0.32, 0.24, halfL - 0.3], mat.stoolWhite, bedGroup);

    return bedGroup;
  }

  // Row of Bunk beds on the Right (as in reference room2.jpeg)
  createMetalBunkBed([2.0, 0, -2.6], 0);
  createMetalBunkBed([2.0, 0, 0.0], 0);
  createMetalBunkBed([2.0, 0, 2.6], 0);

  // Row of Bunk beds on the Left
  createMetalBunkBed([-2.0, 0, -2.6], Math.PI);
  createMetalBunkBed([-2.0, 0, 0.0], Math.PI);
  createMetalBunkBed([-2.0, 0, 2.6], Math.PI);

  // Wall double socket faceplates
  makeBox([0.16, 0.1, 0.02], [W / 2 - 0.02, 0.8, 0], mat.metalWhite, group);
  makeBox([0.16, 0.1, 0.02], [-W / 2 + 0.02, 0.8, 0], mat.metalWhite, group);

  // Bright architectural lighting
  const mainLight1 = new THREE.DirectionalLight("#ffffff", 2.2);
  mainLight1.position.set(0, H - 0.5, 0);
  mainLight1.castShadow = true;
  group.add(mainLight1);

  const fillAmbient = new THREE.HemisphereLight("#ffffff", "#e2e8f0", 1.8);
  group.add(fillAmbient);

  return {
    cameraTarget: new THREE.Vector3(0, 1.4, 0),
    defaultCameraPos: new THREE.Vector3(0, 1.9, 3.4),
    dollhousePos: new THREE.Vector3(0, 6.2, 4.2),
    hotspots: [
      { id: "metal-bunks", title: "Oq Metall Karavotlar", desc: "Zamonaviy oq polimer bo‘yoqli mustahkam ikki qavatli po‘lat karkas.", pos: [1.8, 1.6, 0.0] },
      { id: "terracotta-bedding", title: "Terracotta Choyshablar", desc: "Issiq terracotta rangidagi nafis choyshab va yumshoq yostiqlar.", pos: [1.8, 0.7, 0.0] },
      { id: "ochre-blanket", title: "Ocher Rangli Adyol", desc: "Talaba oyoq qismiga buklab qo‘yilgan issiq sariq-ocher adyol.", pos: [1.8, 0.75, 0.8] },
      { id: "glossy-floor", title: "Yaltiroq Kafel Pol", desc: "Oyna kabi aks etuvchi, oson tozalanuvchi oq chinni plitkalar.", pos: [0, 0.05, 0] },
      { id: "ventilation", title: "Ventilyatsiya Tizimi", desc: "Shiftdagi zamonaviy qora ventilyatsiya va havoni tozalash qurilmalari.", pos: [0, 3.4, 1.8] }
    ]
  };
}

// ============================================================================
// ROOM 3: TWIN BED STUDENT ROOM WITH ZEBRA BLINDS (Reference: room3.jpeg)
// 2 single beds with dark slate-grey headboards/footboards, light birch drawers,
// center matching 2-drawer nightstand, foreground nightstand, back window with
// zebra blinds, radiator underneath, two-tone floor (linoleum border + center carpet).
// ============================================================================

export function buildRoom3Twin(group) {
  const carpetTex = createCarpetTexture();
  const zebraTex = createZebraBlindsTexture();
  const birchTex = createBirchTexture();

  const mat = {
    floorBorder: new THREE.MeshStandardMaterial({ color: "#eadfcb", roughness: 0.6 }),
    carpet: new THREE.MeshStandardMaterial({ map: carpetTex, roughness: 0.85 }),
    wall: new THREE.MeshStandardMaterial({ color: "#eae3d4", roughness: 0.9 }),
    slateHeadboard: new THREE.MeshStandardMaterial({ color: "#2d3748", roughness: 0.45, metalness: 0.2 }),
    birchWood: new THREE.MeshStandardMaterial({ map: birchTex, roughness: 0.42, metalness: 0.05 }),
    mattressWhite: new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.72 }),
    pillow: new THREE.MeshStandardMaterial({ color: "#f8fafc", roughness: 0.8 }),
    handleBlack: new THREE.MeshStandardMaterial({ color: "#111827", metalness: 0.8, roughness: 0.3 }),
    zebraBlinds: new THREE.MeshStandardMaterial({
      map: zebraTex,
      transparent: true,
      roughness: 0.5,
      side: THREE.DoubleSide
    }),
    radiatorWhite: new THREE.MeshStandardMaterial({ color: "#f1f5f9", metalness: 0.3, roughness: 0.35 }),
    windowFrame: new THREE.MeshStandardMaterial({ color: "#1e293b", roughness: 0.4 })
  };

  const W = 5.8;
  const L = 6.4;
  const H = 3.2;

  // Floor (Two-tone: cream perimeter + large central grey carpet)
  const floorBorder = new THREE.Mesh(new THREE.PlaneGeometry(W, L), mat.floorBorder);
  floorBorder.rotation.x = -Math.PI / 2;
  floorBorder.receiveShadow = true;
  group.add(floorBorder);

  // Center grey carpet (covers area between the beds)
  const carpet = new THREE.Mesh(new THREE.PlaneGeometry(W - 1.2, L - 1.4), mat.carpet);
  carpet.rotation.x = -Math.PI / 2;
  carpet.position.set(0, 0.015, -0.1);
  carpet.receiveShadow = true;
  group.add(carpet);

  // Ceiling
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W, L), mat.wall);
  ceil.rotation.x = Math.PI / 2;
  ceil.position.y = H;
  group.add(ceil);

  // Walls
  makeBox([W, H, 0.2], [0, H / 2, -L / 2], mat.wall, group);
  makeBox([0.2, H, L], [-W / 2, H / 2, 0], mat.wall, group);
  makeBox([0.2, H, L], [W / 2, H / 2, 0], mat.wall, group);

  // Back Wall Window with Zebra Blinds
  const winW = 1.65;
  const winH = 1.75;
  const winY = 1.95;
  // Window frame & sill
  makeBox([winW + 0.1, winH + 0.1, 0.08], [0, winY, -L / 2 + 0.05], mat.windowFrame, group);
  makeBox([winW + 0.25, 0.06, 0.22], [0, winY - winH / 2, -L / 2 + 0.12], mat.windowFrame, group);

  // Zebra Roller Blinds
  const blinds = new THREE.Mesh(new THREE.PlaneGeometry(winW, winH), mat.zebraBlinds);
  blinds.position.set(0, winY, -L / 2 + 0.12);
  group.add(blinds);

  // Radiator under window
  const radGroup = new THREE.Group();
  radGroup.position.set(0, 0.65, -L / 2 + 0.14);
  group.add(radGroup);
  const radW = 0.95;
  const radH = 0.55;
  makeBox([radW, radH, 0.1], [0, 0, 0], mat.radiatorWhite, radGroup);
  // Radiator vertical ribs
  for (let rx = -radW / 2 + 0.05; rx <= radW / 2 - 0.05; rx += 0.09) {
    makeCylinder(0.015, radH, [rx, 0, 0.06], mat.radiatorWhite, radGroup);
  }

  // Helper for Student Single Bed
  function createStudentBed(pos, rotY = 0) {
    const bed = new THREE.Group();
    bed.position.set(...pos);
    bed.rotation.y = rotY;
    group.add(bed);

    const bW = 1.25;
    const bL = 2.15;

    // Dark slate-grey headboard (height 0.95)
    makeBox([bW, 0.95, 0.08], [0, 0.475, -bL / 2], mat.slateHeadboard, bed);
    // Dark slate-grey footboard (height 0.65)
    makeBox([bW, 0.65, 0.08], [0, 0.325, bL / 2], mat.slateHeadboard, bed);

    // Light birch wood base box with drawers
    makeBox([bW - 0.04, 0.4, bL - 0.16], [0, 0.2, 0], mat.birchWood, bed);

    // Pull-out drawer fronts & black handles on outer side
    const numDrawers = 2;
    const dwL = (bL - 0.25) / numDrawers;
    for (let i = 0; i < numDrawers; i++) {
      const zOffset = -bL / 4 + i * (bL / 2);
      makeBox([0.02, 0.3, dwL - 0.05], [bW / 2 - 0.01, 0.2, zOffset], mat.birchWood, bed);
      // Black handle
      makeBox([0.04, 0.03, 0.18], [bW / 2 + 0.02, 0.2, zOffset], mat.handleBlack, bed);
    }

    // Crisp white mattress
    makeBox([bW - 0.08, 0.22, bL - 0.2], [0, 0.49, 0], mat.mattressWhite, bed);

    // Large fluffy white pillow angled on headboard
    const pillow = makeBox([bW - 0.35, 0.15, 0.65], [0, 0.66, -bL / 2 + 0.45], mat.pillow, bed);
    pillow.rotation.x = -0.25;

    return bed;
  }

  // 2-Drawer Nightstand Cabinet
  function createNightstand(pos, rotY = 0) {
    const ns = new THREE.Group();
    ns.position.set(...pos);
    ns.rotation.y = rotY;
    group.add(ns);

    const nW = 0.58;
    const nH = 0.65;
    const nD = 0.48;

    // Dark grey top and casing
    makeBox([nW, nH, nD], [0, nH / 2, 0], mat.slateHeadboard, ns);

    // 2 Light birch drawers
    const dH = (nH - 0.1) / 2;
    for (let i = 0; i < 2; i++) {
      const dy = 0.08 + i * (dH + 0.03) + dH / 2;
      makeBox([nW - 0.06, dH, 0.02], [0, dy, nD / 2 + 0.01], mat.birchWood, ns);
      // Black handle
      makeBox([0.16, 0.025, 0.03], [0, dy, nD / 2 + 0.03], mat.handleBlack, ns);
    }
  }

  // Left Bed (against back wall area)
  createStudentBed([-1.85, 0, -0.65], 0);

  // Right Bed (parallel to left bed)
  createStudentBed([1.85, 0, -0.65], 0);

  // Center Nightstand (between the two beds under radiator/window)
  createNightstand([0, 0, -L / 2 + 0.4], 0);

  // Left Foreground Nightstand
  createNightstand([-2.1, 0, 1.8], Math.PI / 2);

  // Wall electrical outlets
  makeBox([0.08, 0.08, 0.02], [W / 2 - 0.02, 1.1, -1.2], mat.radiatorWhite, group);

  // Warm natural room lighting
  const sunLight = new THREE.DirectionalLight("#fffbeb", 1.8);
  sunLight.position.set(0, 2.6, -2.5);
  sunLight.castShadow = true;
  group.add(sunLight);

  const ambientLight = new THREE.HemisphereLight("#fff7ed", "#cbd5e1", 1.6);
  group.add(ambientLight);

  return {
    cameraTarget: new THREE.Vector3(0, 1.2, -0.6),
    defaultCameraPos: new THREE.Vector3(0, 1.8, 2.6),
    dollhousePos: new THREE.Vector3(0, 5.2, 3.4),
    hotspots: [
      { id: "twin-beds", title: "2 Kishilik Yotoqlar", desc: "Kulrang zamonaviy boshkora va qulay oq matrasli alohida yotoqlar.", pos: [-1.85, 0.9, -0.65] },
      { id: "drawers", title: "Taglik Tortmalari", desc: "Har bir yotoq ostidagi tabiiy qayin yog‘ochidan yasalgan keng tortmalar.", pos: [-1.2, 0.3, -0.65] },
      { id: "zebra-blinds", title: "Zebra Rolikli Parda", desc: "Kun va tun rejimini qulay boshqaruvchi zamonaviy gorizontal rolikli parda.", pos: [0, 2.0, -3.0] },
      { id: "radiator", title: "Isitish Radiatori", desc: "Deraza ostidagi qishki sovuqda xonani bir tekis isituvchi radiator.", pos: [0, 0.7, -2.9] },
      { id: "nightstand", title: "2 Tortmali Tungi Stol", desc: "Yotoqlar orasidagi qora tutqichli, hujjatlar va telefon qo‘yish uchun qulay shkafcha.", pos: [0, 0.65, -2.7] }
    ]
  };
}

// Room definitions metadata matching the reference images
export const ROOM_3D_METADATA = [
  {
    id: 1,
    name: "01 / Kapsula Pod Yotoqxona",
    refImage: "/images/room1.jpeg",
    type: "Kapsula tipi",
    capacity: "4-8 o‘rin",
    price: "$120",
    period: "oyiga",
    tag: "Eng ommabop",
    description: "Yapon uslubidagi zamonaviy yog‘och kapsula podlar. Shaxsiy LED yorug‘lik, qizil choyshab, oq sochiq to‘plami va pastki saqlash tortmalari bilan to‘liq jihozlangan.",
    amenities: ["Shaxsiy kapsula pod", "Ichki LED yorug‘lik", "Qizil choyshab & sochiq", "Yog‘och saqlash tortmalari", "24/7 sokinlik"]
  },
  {
    id: 2,
    name: "02 / Minimalist Oq Bunk Xona",
    refImage: "/images/room2.jpeg",
    type: "Kop o‘rinli zamonaviy",
    capacity: "6 o‘rin",
    price: "$100",
    period: "oyiga",
    tag: "Mavjud",
    description: "Yorug‘ oq metall karkasli ikki qavatli karavotlar, issiq terracotta to‘shaklari, ocher adyollar va oyna kabi yaltiroq chinni kafel pol.",
    amenities: ["Oq po‘lat karkas", "Terracotta choyshablar", "Ocher issiq adyol", "Yaltiroq chinni kafel", "Ventilyatsiya tizimi"]
  },
  {
    id: 3,
    name: "03 / Standart 2 Kishilik Xona",
    refImage: "/images/room3.jpeg",
    type: "2 kishilik qulay",
    capacity: "2 o‘rin",
    price: "$180",
    period: "oyiga",
    tag: "Premium",
    description: "Ikkita alohida bir kishilik yotoq, kulrang boshkoralar, tabiiy yog‘och tortmalar, zebra rolikli parda, markaziy isitish va o‘rtadagi gilam bilan tinch o‘qish muhiti.",
    amenities: ["2 ta alohida to‘shak", "Zebra rolikli parda", "Taglik tortmalari", "Markaziy isitish", "Yumshoq gilam"]
  }
];

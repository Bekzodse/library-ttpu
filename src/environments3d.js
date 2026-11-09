import * as THREE from "three";

// ============================================================================
// 1. PROCEDURAL TEXTURE GENERATORS (High-Performance & Photorealistic)
// ============================================================================

export function createWoodPlankTexture(baseHex = "#964e22", grainHex = "#783914") {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, 512, 512);

  const plankHeight = 64;
  for (let y = 0; y < 512; y += plankHeight) {
    ctx.fillStyle = `rgba(0,0,0,${0.08 + Math.random() * 0.08})`;
    ctx.fillRect(0, y, 512, plankHeight);

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
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createMarbleTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#0c1928";
  ctx.fillRect(0, 0, 512, 512);

  // Gold and cyan marble veins
  for (let v = 0; v < 14; v++) {
    ctx.strokeStyle = v % 2 === 0 ? "rgba(245, 158, 11, 0.35)" : "rgba(56, 189, 248, 0.3)";
    ctx.lineWidth = 1 + Math.random() * 2;
    ctx.beginPath();
    let x = Math.random() * 512;
    let y = 0;
    ctx.moveTo(x, y);
    while (y < 512) {
      x += (Math.random() - 0.5) * 45;
      y += 20 + Math.random() * 30;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createKitchenCounterTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#1e293b";
  ctx.fillRect(0, 0, 512, 512);

  // Mineral specks
  for (let i = 0; i < 1200; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const size = Math.random() * 2 + 1;
    ctx.fillStyle = Math.random() > 0.5 ? "rgba(255,255,255,0.4)" : "rgba(148, 163, 184, 0.35)";
    ctx.fillRect(x, y, size, size);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createBookSpinesTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#1e293b";
  ctx.fillRect(0, 0, 512, 256);

  const colors = ["#b91c1c", "#1d4ed8", "#047857", "#b45309", "#4338ca", "#0e7490", "#374151", "#be185d"];
  let curX = 0;
  while (curX < 512) {
    const bookWidth = 14 + (Math.random() * 16) | 0;
    const col = colors[(Math.random() * colors.length) | 0];
    ctx.fillStyle = col;
    ctx.fillRect(curX, 8, bookWidth - 2, 240);

    // Gold spine foil line
    ctx.fillStyle = "rgba(253, 230, 138, 0.75)";
    ctx.fillRect(curX + 2, 40, bookWidth - 6, 4);
    ctx.fillRect(curX + 2, 190, bookWidth - 6, 3);

    curX += bookWidth;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createBasketballCourtTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  // Modern court blue & terracotta surface
  ctx.fillStyle = "#1e3a8a";
  ctx.fillRect(0, 0, 512, 512);

  // Key / Paint area
  ctx.fillStyle = "#ea580c";
  ctx.fillRect(128, 256, 256, 256);

  // Court lines
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 6;
  ctx.strokeRect(32, 32, 448, 448);

  // Key box
  ctx.strokeRect(128, 256, 256, 256);

  // Free throw circle
  ctx.beginPath();
  ctx.arc(256, 256, 80, 0, Math.PI * 2);
  ctx.stroke();

  // 3-point line arc
  ctx.beginPath();
  ctx.arc(256, 480, 200, Math.PI, 0, false);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createZebraBlindsTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  const stripeH = 16;
  for (let y = 0; y < 256; y += stripeH * 2) {
    ctx.fillStyle = "rgba(245, 245, 245, 0.95)";
    ctx.fillRect(0, y, 256, stripeH);
    ctx.fillStyle = "rgba(180, 180, 180, 0.4)";
    ctx.fillRect(0, y + stripeH, 256, stripeH);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createCarpetTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#334155";
  ctx.fillRect(0, 0, 256, 256);

  ctx.fillStyle = "rgba(255,255,255,0.08)";
  for (let i = 0; i < 4000; i++) {
    const rx = Math.random() * 256;
    const ry = Math.random() * 256;
    ctx.fillRect(rx, ry, 1.5, 1.5);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// ============================================================================
// 2. SHARED 3D GEOMETRY UTILITIES
// ============================================================================

export function createBox(size, pos, mat, parent) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), mat);
  mesh.position.set(...pos);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  if (parent) parent.add(mesh);
  return mesh;
}

export function createCylinder(r, h, pos, mat, parent) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 16), mat);
  mesh.position.set(...pos);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  if (parent) parent.add(mesh);
  return mesh;
}

// ============================================================================
// 3. COMPLETE 3D ENVIRONMENT BUILDERS (MATCHING ALL 22 REFERENCE IMAGES)
// ============================================================================

/**
 * 1. BUILDING EXTERIOR & CAMPUS GROUNDS
 * References: dormitory-building.png, university-campus.png, d1.jpg, d2.jpeg, d3.jpg, d4.jpg, d6.jpeg
 */
export function buildBuildingExterior(group) {
  const concreteMat = new THREE.MeshStandardMaterial({ color: "#e2e8f0", roughness: 0.7 });
  const darkSteelMat = new THREE.MeshStandardMaterial({ color: "#0f172a", roughness: 0.4 });
  const glassMat = new THREE.MeshPhysicalMaterial({ color: "#93c5fd", roughness: 0.1, transmission: 0.65, transparent: true, opacity: 0.75 });
  const lawnMat = new THREE.MeshStandardMaterial({ color: "#166534", roughness: 0.9 });
  const goldSignMat = new THREE.MeshStandardMaterial({ color: "#f59e0b", emissive: "#d97706", emissiveIntensity: 0.6 });

  // Ground Plaza & Lawns
  createBox([70, 0.3, 70], [0, -0.15, 15], lawnMat, group);
  createBox([10, 0.15, 34], [0, 0.05, 14], concreteMat, group); // Entrance granite walkway

  // Trees and Landscaping along walkway
  for (let z = 6; z <= 26; z += 5) {
    // Left tree
    createCylinder(0.18, 2.2, [-7, 1.1, z], darkSteelMat, group);
    const foliageL = new THREE.Mesh(new THREE.IcosahedronGeometry(1.6, 1), lawnMat);
    foliageL.position.set(-7, 2.8, z);
    group.add(foliageL);

    // Right tree
    createCylinder(0.18, 2.2, [7, 1.1, z], darkSteelMat, group);
    const foliageR = new THREE.Mesh(new THREE.IcosahedronGeometry(1.6, 1), lawnMat);
    foliageR.position.set(7, 2.8, z);
    group.add(foliageR);
  }

  // Multi-story Main Dormitory Building Structure (Matching dormitory-building.png)
  const bW = 38;
  const bH = 18;
  const bD = 24;
  createBox([bW, bH, bD], [0, bH / 2, -bD / 2], darkSteelMat, group);

  // Modern Window Bands & Balconies (4 Floors)
  for (let f = 0; f < 4; f++) {
    const fy = 2.4 + f * 3.8;
    // Window strip
    createBox([bW - 2, 2.2, 0.3], [0, fy, 0.15], glassMat, group);
    // Floor division ledges
    createBox([bW + 0.8, 0.4, 0.8], [0, fy - 1.3, 0.4], concreteMat, group);
    // Vertical architectural louvers
    for (let lx = -bW / 2 + 2; lx <= bW / 2 - 2; lx += 3.2) {
      createBox([0.15, 2.8, 0.4], [lx, fy, 0.35], goldSignMat, group);
    }
  }

  // Grand Architectural Canopy & Roof Crown
  createBox([12, 0.3, 5], [0, 4.8, 2.5], darkSteelMat, group);
  createBox([10, 0.1, 4.2], [0, 4.95, 2.5], glassMat, group);
  createCylinder(0.12, 4.8, [-5.5, 2.4, 4.5], darkSteelMat, group);
  createCylinder(0.12, 4.8, [5.5, 2.4, 4.5], darkSteelMat, group);

  // Illuminated TPU Signboard
  createBox([7.2, 0.8, 0.2], [0, 5.6, 2.6], darkSteelMat, group);
  createBox([6.8, 0.5, 0.22], [0, 5.6, 2.62], goldSignMat, group);

  return {
    defaultCameraPos: new THREE.Vector3(0, 4.2, 22),
    cameraTarget: new THREE.Vector3(0, 3.5, 0),
    dollhousePos: new THREE.Vector3(0, 24, 28)
  };
}

/**
 * 2. MAIN ENTRANCE & RECEPTION
 * References: Grand entry doors, Reception desk, Registration kiosk, Turnstiles, Lounge
 */
export function buildMainEntranceReception(group) {
  const marbleMat = new THREE.MeshStandardMaterial({
    map: createMarbleTexture(),
    roughness: 0.25,
    metalness: 0.1
  });
  const darkMat = new THREE.MeshStandardMaterial({ color: "#0f172a", roughness: 0.4 });
  const woodMat = new THREE.MeshStandardMaterial({ map: createWoodPlankTexture(), roughness: 0.5 });
  const goldMat = new THREE.MeshStandardMaterial({ color: "#f59e0b", metalness: 0.7, roughness: 0.3 });
  const glassMat = new THREE.MeshPhysicalMaterial({ color: "#93c5fd", roughness: 0.1, transmission: 0.7, transparent: true, opacity: 0.8 });

  // Entrance Lobby Floor & Walls
  createBox([22, 0.2, 18], [0, 0, 0], marbleMat, group);
  createBox([22, 5.4, 0.3], [0, 2.7, -9], darkMat, group);
  createBox([0.3, 5.4, 18], [-11, 2.7, 0], darkMat, group);
  createBox([0.3, 5.4, 18], [11, 2.7, 0], darkMat, group);
  createBox([22, 0.3, 18], [0, 5.4, 0], darkMat, group);

  // Modern Reception Desk (Marble top + Warm wood slats)
  createBox([6.4, 1.15, 1.6], [0, 0.58, -4.5], darkMat, group);
  createBox([6.8, 0.12, 1.8], [0, 1.18, -4.5], marbleMat, group);
  // Reception front gold glowing badge
  createBox([2.2, 0.5, 0.08], [0, 0.65, -3.65], goldMat, group);

  // Security Turnstiles (Left & Right of reception)
  for (let tx of [-5.5, -4.0, 4.0, 5.5]) {
    createBox([0.25, 1.05, 1.2], [tx, 0.53, 0], darkMat, group);
    createBox([0.45, 0.04, 0.2], [tx + 0.3, 0.85, 0], glassMat, group);
  }

  // Welcome Lounge Seating Area (Left corner)
  createBox([3.2, 0.45, 1.4], [-7.5, 0.23, 4], darkMat, group);
  createBox([3.2, 0.5, 0.3], [-7.5, 0.7, 4.6], darkMat, group);
  createBox([1.6, 0.4, 1.0], [-7.5, 0.2, 2.4], woodMat, group); // Coffee table

  // Digital Information Display Board
  createBox([2.2, 3.4, 0.2], [7.5, 2.0, 4], darkMat, group);
  createBox([1.9, 2.8, 0.05], [7.5, 2.1, 3.9], goldMat, group);

  // Ceiling recessed LED strip troughs
  for (let cz = -6; cz <= 6; cz += 4) {
    createBox([16, 0.08, 0.3], [0, 5.35, cz], goldMat, group);
  }

  return {
    defaultCameraPos: new THREE.Vector3(0, 1.8, 6.5),
    cameraTarget: new THREE.Vector3(0, 1.5, -3.5),
    dollhousePos: new THREE.Vector3(0, 12, 10)
  };
}

/**
 * 3. MAIN HALL & ATRIUM
 * References: Grand multi-story interior, Mezzanine, Pillars, Modern seating clusters
 */
export function buildMainHall(group) {
  const marbleMat = new THREE.MeshStandardMaterial({ map: createMarbleTexture(), roughness: 0.2 });
  const darkMat = new THREE.MeshStandardMaterial({ color: "#0b1623", roughness: 0.4 });
  const goldMat = new THREE.MeshStandardMaterial({ color: "#f59e0b", metalness: 0.7, roughness: 0.3 });
  const glassMat = new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.05, transmission: 0.8, transparent: true, opacity: 0.85 });
  const plantMat = new THREE.MeshStandardMaterial({ color: "#15803d", roughness: 0.8 });

  // Atrium Floor & 2-Story Double Height Ceiling
  createBox([28, 0.2, 24], [0, 0, 0], marbleMat, group);
  createBox([28, 8.4, 0.4], [0, 4.2, -12], darkMat, group);
  createBox([0.4, 8.4, 24], [-14, 4.2, 0], darkMat, group);
  createBox([0.4, 8.4, 24], [14, 4.2, 0], darkMat, group);

  // Grand Architectural Columns (Round columns with gold bases)
  for (let cx of [-8, 8]) {
    for (let cz of [-6, 6]) {
      createCylinder(0.55, 8.4, [cx, 4.2, cz], darkMat, group);
      createCylinder(0.65, 0.4, [cx, 0.2, cz], goldMat, group);
      createCylinder(0.65, 0.4, [cx, 8.2, cz], goldMat, group);
    }
  }

  // Mezzanine 2nd-Floor Balcony Railing (Glass + Brass top rail)
  createBox([24, 0.4, 3.5], [0, 4.2, -10], darkMat, group);
  createBox([24, 1.1, 0.08], [0, 4.95, -8.2], glassMat, group);
  createBox([24, 0.08, 0.12], [0, 5.5, -8.2], goldMat, group);

  // Center Lounge Island (Modular circular seating + Indoor Olive Tree)
  createCylinder(2.6, 0.45, [0, 0.23, 0], darkMat, group);
  createCylinder(1.2, 0.8, [0, 0.4, 0], goldMat, group); // Planter pot
  createCylinder(0.12, 3.2, [0, 2.0, 0], darkMat, group); // Trunk
  const foliage = new THREE.Mesh(new THREE.IcosahedronGeometry(1.8, 2), plantMat);
  foliage.position.set(0, 3.8, 0);
  group.add(foliage);

  // Skylight Grid on Roof
  for (let sx = -8; sx <= 8; sx += 4) {
    createBox([0.2, 0.2, 18], [sx, 8.4, 0], goldMat, group);
  }

  return {
    defaultCameraPos: new THREE.Vector3(0, 2.2, 9),
    cameraTarget: new THREE.Vector3(0, 2.0, 0),
    dollhousePos: new THREE.Vector3(0, 16, 12)
  };
}

/**
 * 4. SHARED KITCHEN & DINING HALL
 * References: k1.jpeg (prep islands & hobs), k2.jpeg (communal dining table), k3.jpeg (refrigerators & microwaves)
 */
export function buildSharedKitchen(group) {
  const tileMat = new THREE.MeshStandardMaterial({ map: createTileTexture(), roughness: 0.15 });
  const darkCabinetMat = new THREE.MeshStandardMaterial({ color: "#1e293b", roughness: 0.4 });
  const whiteCabinetMat = new THREE.MeshStandardMaterial({ color: "#f8fafc", roughness: 0.3 });
  const steelMat = new THREE.MeshStandardMaterial({ color: "#cbd5e1", metalness: 0.8, roughness: 0.2 });
  const woodTableMat = new THREE.MeshStandardMaterial({ map: createWoodPlankTexture("#a16207", "#78350f"), roughness: 0.6 });
  const quartzCounterMat = new THREE.MeshStandardMaterial({ map: createKitchenCounterTexture(), roughness: 0.3 });
  const inductionMat = new THREE.MeshStandardMaterial({ color: "#09090b", roughness: 0.1, metalness: 0.5 });
  const warmLightMat = new THREE.MeshStandardMaterial({ color: "#fef08a", emissive: "#facc15", emissiveIntensity: 0.6 });

  // Room shell
  createBox([16, 0.2, 14], [0, 0, 0], tileMat, group);
  createBox([16, 4.4, 0.2], [0, 2.2, -7], whiteCabinetMat, group);
  createBox([0.2, 4.4, 14], [-8, 2.2, 0], whiteCabinetMat, group);
  createBox([0.2, 4.4, 14], [8, 2.2, 0], whiteCabinetMat, group);

  // Back Wall Kitchen Counter (Hobs & Sinks) - matching k1.jpeg
  createBox([14, 0.9, 1.2], [0, 0.45, -6.4], darkCabinetMat, group);
  createBox([14.2, 0.08, 1.3], [0, 0.94, -6.4], quartzCounterMat, group);
  // Overhead cabinets
  createBox([14, 0.9, 0.7], [0, 3.2, -6.65], whiteCabinetMat, group);
  // Under-cabinet warm LED strip
  createBox([14, 0.04, 0.04], [0, 2.73, -6.4], warmLightMat, group);

  // 4 Built-in Induction Hobs & Stainless Steel Sinks (k1.jpeg)
  for (let hx of [-4.5, -1.8, 1.8, 4.5]) {
    createBox([1.2, 0.02, 0.9], [hx, 0.99, -6.4], inductionMat, group);
    // Overhead stainless steel cooker hood
    createBox([1.4, 0.6, 0.8], [hx, 2.3, -6.3], steelMat, group);
  }

  // Dual Double-Door Stainless Steel Refrigerators (matching k3.jpeg)
  for (let rx of [-6.8, -5.4]) {
    createBox([1.2, 2.2, 1.1], [rx, 1.1, -4.5], steelMat, group);
    // Door handles
    createBox([0.04, 0.8, 0.04], [rx - 0.2, 1.1, -3.9], darkCabinetMat, group);
    createBox([0.04, 0.8, 0.04], [rx + 0.2, 1.1, -3.9], darkCabinetMat, group);
  }

  // Microwave Oven Bank (matching k3.jpeg)
  createBox([2.2, 2.2, 0.8], [6.6, 1.1, -4.5], darkCabinetMat, group);
  for (let my of [0.8, 1.4, 2.0]) {
    createBox([0.9, 0.45, 0.75], [6.6, my, -4.5], steelMat, group);
  }

  // Long Communal Wooden Dining Table & 8 Scandinavian Chairs (matching k2.jpeg)
  createBox([5.6, 0.08, 1.8], [0, 0.85, 1.5], woodTableMat, group);
  // Table legs
  createBox([0.1, 0.8, 1.6], [-2.5, 0.4, 1.5], darkCabinetMat, group);
  createBox([0.1, 0.8, 1.6], [2.5, 0.4, 1.5], darkCabinetMat, group);

  // 8 Dining Chairs
  for (let cx = -2.0; cx <= 2.0; cx += 1.3) {
    // Side A
    createBox([0.5, 0.45, 0.5], [cx, 0.22, 0.2], darkCabinetMat, group);
    createBox([0.5, 0.45, 0.06], [cx, 0.68, -0.02], whiteCabinetMat, group);
    // Side B
    createBox([0.5, 0.45, 0.5], [cx, 0.22, 2.8], darkCabinetMat, group);
    createBox([0.5, 0.45, 0.06], [cx, 0.68, 3.02], whiteCabinetMat, group);
  }

  // Hanging Modern Pendant Lights over Table
  for (let px of [-1.8, 0, 1.8]) {
    createCylinder(0.02, 1.6, [px, 3.4, 1.5], darkCabinetMat, group);
    createCylinder(0.25, 0.35, [px, 2.5, 1.5], darkCabinetMat, group);
    createCylinder(0.18, 0.05, [px, 2.3, 1.5], warmLightMat, group);
  }

  return {
    defaultCameraPos: new THREE.Vector3(0, 1.9, 5.5),
    cameraTarget: new THREE.Vector3(0, 1.3, -2.0),
    dollhousePos: new THREE.Vector3(0, 9, 8)
  };
}

/**
 * 5. LIBRARY, STUDY CARRELS & COWORKING HUB
 * References: l1.jpeg (floor-to-ceiling bookshelves), l2.jpeg (individual study carrels), l3.jpeg (coworking screens)
 */
export function buildLibraryStudy(group) {
  const carpetMat = new THREE.MeshStandardMaterial({ map: createCarpetTexture(), roughness: 0.85 });
  const woodMat = new THREE.MeshStandardMaterial({ map: createBirchTexture(), roughness: 0.6 });
  const darkMat = new THREE.MeshStandardMaterial({ color: "#0f172a", roughness: 0.4 });
  const booksMat = new THREE.MeshStandardMaterial({ map: createBookSpinesTexture(), roughness: 0.5 });
  const warmLedMat = new THREE.MeshStandardMaterial({ color: "#fef08a", emissive: "#facc15", emissiveIntensity: 0.6 });
  const screenMat = new THREE.MeshStandardMaterial({ color: "#1e3a8a", emissive: "#0284c7", emissiveIntensity: 0.45 });

  // Library floor & walls
  createBox([18, 0.2, 15], [0, 0, 0], carpetMat, group);
  createBox([18, 4.6, 0.2], [0, 2.3, -7.5], darkMat, group);
  createBox([0.2, 4.6, 15], [-9, 2.3, 0], darkMat, group);
  createBox([0.2, 4.6, 15], [9, 2.3, 0], darkMat, group);

  // Floor-to-Ceiling Library Book Shelving Wall (matching l1.jpeg)
  createBox([16, 4.2, 0.6], [0, 2.1, -7.1], woodMat, group);
  for (let by = 0.7; by <= 3.8; by += 0.75) {
    // Row of books
    createBox([15.6, 0.65, 0.5], [0, by, -6.9], booksMat, group);
    // Shelf divider
    createBox([15.8, 0.06, 0.65], [0, by + 0.35, -7.0], woodMat, group);
  }

  // Row of 4 Individual Private Study Carrels (matching l2.jpeg)
  const carrelY = 0.85;
  for (let cx = -5.4; cx <= -1.2; cx += 1.4) {
    // Desk surface
    createBox([1.2, 0.06, 1.0], [cx, carrelY, 0], woodMat, group);
    // Acoustic privacy side dividers
    createBox([0.05, 0.8, 1.0], [cx - 0.6, carrelY + 0.35, 0], darkMat, group);
    createBox([0.05, 0.8, 1.0], [cx + 0.6, carrelY + 0.35, 0], darkMat, group);
    createBox([1.2, 0.8, 0.05], [cx, carrelY + 0.35, -0.5], darkMat, group);

    // Warm LED task lamp
    createBox([0.6, 0.04, 0.04], [cx, carrelY + 0.65, -0.4], warmLedMat, group);
    // Laptop
    createBox([0.45, 0.02, 0.32], [cx, carrelY + 0.05, 0], darkMat, group);
    const lapScreen = createBox([0.45, 0.28, 0.02], [cx, carrelY + 0.18, -0.15], screenMat, group);
    lapScreen.rotation.x = -0.25;

    // Ergonomic study chair
    createBox([0.5, 0.45, 0.5], [cx, 0.22, 0.9], darkMat, group);
    createBox([0.5, 0.5, 0.06], [cx, 0.7, 1.15], darkMat, group);
  }

  // Collaborative Coworking Hub & Presentation Screen (matching l3.jpeg)
  createBox([4.2, 2.4, 0.1], [4.5, 2.5, 0], darkMat, group);
  createBox([4.0, 2.2, 0.05], [4.5, 2.5, 0.06], screenMat, group); // Big presentation display
  // Round discussion table & poufs
  createCylinder(1.5, 0.08, [4.5, 0.8, 3.2], woodMat, group);
  createCylinder(0.12, 0.8, [4.5, 0.4, 3.2], darkMat, group);
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 2) {
    const px = 4.5 + Math.cos(a) * 1.8;
    const pz = 3.2 + Math.sin(a) * 1.8;
    createCylinder(0.4, 0.45, [px, 0.22, pz], darkMat, group);
  }

  return {
    defaultCameraPos: new THREE.Vector3(0, 2.0, 6.2),
    cameraTarget: new THREE.Vector3(0, 1.6, -1.5),
    dollhousePos: new THREE.Vector3(0, 11, 8)
  };
}

/**
 * 6. SPORTS & BASKETBALL ARENA
 * References: b1.jpeg (outdoor/indoor hard court), b2.webp (gym workout zone), b3.jpeg (sports equipment lockers)
 */
export function buildSportsBasketball(group) {
  const courtMat = new THREE.MeshStandardMaterial({ map: createBasketballCourtTexture(), roughness: 0.35 });
  const darkWallMat = new THREE.MeshStandardMaterial({ color: "#09131f", roughness: 0.5 });
  const steelMat = new THREE.MeshStandardMaterial({ color: "#94a3b8", metalness: 0.8, roughness: 0.2 });
  const glassBackboardMat = new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.05, transmission: 0.85, transparent: true, opacity: 0.85 });
  const orangeRimMat = new THREE.MeshStandardMaterial({ color: "#f97316", metalness: 0.5, roughness: 0.3 });
  const rubberGymMat = new THREE.MeshStandardMaterial({ color: "#1e293b", roughness: 0.9 });

  // Half-court Floor & Gym Floor
  createBox([18, 0.2, 16], [0, 0, 0], courtMat, group);
  createBox([18, 5.6, 0.3], [0, 2.8, -8], darkWallMat, group);
  createBox([0.3, 5.6, 16], [-9, 2.8, 0], darkWallMat, group);
  createBox([0.3, 5.6, 16], [9, 2.8, 0], darkWallMat, group);

  // Regulation Basketball Stanchion & Hoop (matching b1.jpeg)
  createCylinder(0.16, 4.4, [0, 2.2, -7.2], steelMat, group); // Main pole
  createBox([0.16, 0.16, 2.2], [0, 4.2, -6.2], steelMat, group); // Overhang arm
  // Glass Backboard
  createBox([2.4, 1.6, 0.06], [0, 3.8, -5.1], glassBackboardMat, group);
  // Target square on backboard
  createBox([0.8, 0.6, 0.08], [0, 3.6, -5.09], orangeRimMat, group);
  // Orange Rim Hoop
  createCylinder(0.35, 0.04, [0, 3.3, -4.7], orangeRimMat, group);

  // Gym / Fitness Workout Area (matching b2.webp) on the Right Side
  createBox([5.4, 0.25, 6.0], [5.8, 0.03, 3.5], rubberGymMat, group);
  // Dumbbell Rack
  createBox([3.2, 0.9, 0.6], [5.8, 0.45, 1.2], steelMat, group);
  for (let dx = 4.6; dx <= 7.0; dx += 0.8) {
    createCylinder(0.12, 0.35, [dx, 0.95, 1.2], darkWallMat, group);
  }
  // Workout Flat Bench
  createBox([1.8, 0.45, 0.6], [5.8, 0.22, 3.5], darkWallMat, group);

  // Sports Equipment & Ball Locker Station (matching b3.jpeg) on Left Side
  createBox([4.8, 2.2, 0.8], [-6.2, 1.1, -4.5], steelMat, group);
  // Basketball ball storage cage
  for (let b = 0; b < 6; b++) {
    const ballMesh = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), orangeRimMat);
    ballMesh.position.set(-6.6 + (b % 3) * 0.55, 0.3 + ((b / 3) | 0) * 0.5, -4.5);
    group.add(ballMesh);
  }

  return {
    defaultCameraPos: new THREE.Vector3(0, 2.2, 7.5),
    cameraTarget: new THREE.Vector3(0, 2.0, -3.5),
    dollhousePos: new THREE.Vector3(0, 12, 10)
  };
}

/**
 * 7. INDIVIDUAL ROOM 01 — KAPSULA POD DORMITORY
 * Exact Match to reference image room1.jpeg
 */
export function buildRoom1Capsule(roomGroup) {
  const woodMat = new THREE.MeshStandardMaterial({ map: createWoodPlankTexture(), roughness: 0.5, metalness: 0.05 });
  const darkWoodMat = new THREE.MeshStandardMaterial({ color: "#2d1609", roughness: 0.6 });
  const mattressMat = new THREE.MeshStandardMaterial({ color: "#fafafa", roughness: 0.9 });
  const redRunnerMat = new THREE.MeshStandardMaterial({ color: "#b91c1c", roughness: 0.7 });
  const towelMat = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.85 });
  const pillowMat = new THREE.MeshStandardMaterial({ color: "#f8fafc", roughness: 0.8 });
  const ledWarmMat = new THREE.MeshStandardMaterial({ color: "#fef08a", emissive: "#facc15", emissiveIntensity: 0.85 });
  const blackLadderMat = new THREE.MeshStandardMaterial({ color: "#18181b", metalness: 0.8, roughness: 0.2 });
  const wallMat = new THREE.MeshStandardMaterial({ color: "#f1f5f9", roughness: 0.85 });

  // Room Shell
  createBox([7.2, 0.2, 6.4], [0, 0, 0], woodMat, roomGroup);
  createBox([7.2, 4.4, 0.2], [0, 2.2, -3.2], woodMat, roomGroup);
  createBox([0.2, 4.4, 6.4], [-3.6, 2.2, 0], wallMat, roomGroup);
  createBox([0.2, 4.4, 6.4], [3.6, 2.2, 0], wallMat, roomGroup);
  createBox([7.2, 0.2, 6.4], [0, 4.4, 0], wallMat, roomGroup);

  // Helper for 2-tier Pod
  const createPod = (x, z, rotY) => {
    const podGroup = new THREE.Group();
    podGroup.position.set(x, 0, z);
    podGroup.rotation.y = rotY;
    roomGroup.add(podGroup);

    // Outer Shell (Width: 1.6, Height: 3.8, Length: 2.4)
    createBox([1.6, 3.8, 2.4], [0, 1.9, 0], woodMat, podGroup);

    // Lower Pod Cavity
    createBox([1.4, 1.6, 2.2], [0, 0.95, 0.05], darkWoodMat, podGroup);
    // Lower Mattress & Bedding
    createBox([1.25, 0.22, 2.0], [0, 0.32, 0.05], mattressMat, podGroup);
    createBox([1.27, 0.04, 0.55], [0, 0.44, 0.75], redRunnerMat, podGroup); // Red runner
    createCylinder(0.1, 0.65, [0, 0.5, 0.25], towelMat, podGroup); // Rolled towel
    createBox([0.9, 0.18, 0.45], [0, 0.46, -0.7], pillowMat, podGroup); // Pillow
    createBox([1.2, 0.03, 0.03], [0, 1.65, -0.85], ledWarmMat, podGroup); // LED strip

    // Upper Pod Divider
    createBox([1.5, 0.12, 2.3], [0, 1.82, 0], woodMat, podGroup);

    // Upper Pod Cavity
    createBox([1.4, 1.6, 2.2], [0, 2.7, 0.05], darkWoodMat, podGroup);
    createBox([1.25, 0.22, 2.0], [0, 2.05, 0.05], mattressMat, podGroup);
    createBox([1.27, 0.04, 0.55], [0, 2.18, 0.75], redRunnerMat, podGroup);
    createCylinder(0.1, 0.65, [0, 2.24, 0.25], towelMat, podGroup);
    createBox([0.9, 0.18, 0.45], [0, 2.2, -0.7], pillowMat, podGroup);
    createBox([1.2, 0.03, 0.03], [0, 3.45, -0.85], ledWarmMat, podGroup);

    // Black Metal Ladder
    createCylinder(0.025, 3.6, [0.72, 1.8, 1.05], blackLadderMat, podGroup);
    createCylinder(0.025, 3.6, [0.72, 1.8, 0.65], blackLadderMat, podGroup);
    for (let r = 0.5; r <= 3.2; r += 0.45) {
      createBox([0.02, 0.02, 0.4], [0.72, r, 0.85], blackLadderMat, podGroup);
    }

    // Under-bed Storage Drawer
    createBox([1.4, 0.22, 1.8], [0, 0.11, 0.05], darkWoodMat, podGroup);
    createBox([0.3, 0.03, 0.04], [0, 0.11, 1.0], blackLadderMat, podGroup);
  };

  // Pods Layout (Left, Right, Back)
  createPod(-2.55, -0.6, Math.PI / 2);
  createPod(2.55, -0.6, -Math.PI / 2);
  createPod(0, -2.1, 0);

  return {
    defaultCameraPos: new THREE.Vector3(0, 1.7, 2.6),
    cameraTarget: new THREE.Vector3(0, 1.5, -0.6),
    dollhousePos: new THREE.Vector3(0, 5.5, 3.2),
    hotspots: [
      { id: "pod-inside", title: "Kapsula Ichki LED", desc: "Shaxsiy issiq sariq LED yoritgich va elektr rozetkalari.", pos: [0, 1.4, -2.1] },
      { id: "runner", title: "Qizil Choyshab & Sochiq", desc: "Mehmonxona darajasidagi toza choyshablar to‘plami.", pos: [-2.1, 0.45, -0.6] },
      { id: "ladder", title: "Qora Po‘lat Zinapoya", desc: "Yuqori qavatga chiqish uchun xavfsiz qora po‘lat zina.", pos: [-1.8, 1.8, 0.2] },
      { id: "storage", title: "Keng Saqlash Tortmasi", desc: "Kapsula ostidagi shaxsiy buyumlar uchun keng tortma.", pos: [2.1, 0.12, -0.6] }
    ]
  };
}

/**
 * 8. INDIVIDUAL ROOM 02 — MINIMALIST WHITE BUNK ROOM
 * Exact Match to reference image room2.jpeg
 */
export function buildRoom2Bunk(roomGroup) {
  const tileMat = new THREE.MeshStandardMaterial({ map: createTileTexture(), roughness: 0.1, metalness: 0.15 });
  const whiteSteelMat = new THREE.MeshStandardMaterial({ color: "#f8fafc", metalness: 0.85, roughness: 0.15 });
  const terracottaMat = new THREE.MeshStandardMaterial({ color: "#c2410c", roughness: 0.75 });
  const ochreBlanketMat = new THREE.MeshStandardMaterial({ color: "#d97706", roughness: 0.8 });
  const pillowMat = new THREE.MeshStandardMaterial({ color: "#c2410c", roughness: 0.8 });
  const fanBlackMat = new THREE.MeshStandardMaterial({ color: "#18181b", metalness: 0.7, roughness: 0.3 });
  const spotlightMat = new THREE.MeshStandardMaterial({ color: "#fef08a", emissive: "#facc15", emissiveIntensity: 0.8 });
  const wallMat = new THREE.MeshStandardMaterial({ color: "#f1f5f9", roughness: 0.9 });

  // Glossy Tile Floor & Walls
  createBox([7.2, 0.2, 6.4], [0, 0, 0], tileMat, roomGroup);
  createBox([7.2, 4.4, 0.2], [0, 2.2, -3.2], wallMat, roomGroup);
  createBox([0.2, 4.4, 6.4], [-3.6, 2.2, 0], wallMat, roomGroup);
  createBox([0.2, 4.4, 6.4], [3.6, 2.2, 0], wallMat, roomGroup);
  createBox([7.2, 0.2, 6.4], [0, 4.4, 0], wallMat, roomGroup);

  // Ceiling Beams with Ventilation Fan & Spotlights (matching room2.jpeg)
  createBox([0.25, 0.35, 6.4], [-1.8, 4.22, 0], whiteSteelMat, roomGroup);
  createBox([0.25, 0.35, 6.4], [1.8, 4.22, 0], whiteSteelMat, roomGroup);
  // Ceiling ventilation fan at center
  createCylinder(0.25, 0.3, [0, 4.25, -0.6], fanBlackMat, roomGroup);
  for (let a = 0; a < Math.PI * 2; a += (Math.PI * 2) / 3) {
    const blade = createBox([0.9, 0.02, 0.18], [Math.cos(a) * 0.5, 4.15, -0.6 + Math.sin(a) * 0.5], fanBlackMat, roomGroup);
    blade.rotation.y = a;
  }
  // LED spotlights along ceiling
  for (let sz = -2.2; sz <= 2.2; sz += 1.4) {
    createCylinder(0.08, 0.05, [-1.8, 4.02, sz], spotlightMat, roomGroup);
    createCylinder(0.08, 0.05, [1.8, 4.02, sz], spotlightMat, roomGroup);
  }

  // Helper for Double-Decker Bunk Bed (matching room2.jpeg)
  const createBunkBed = (x, z, rotY) => {
    const bunkGroup = new THREE.Group();
    bunkGroup.position.set(x, 0, z);
    bunkGroup.rotation.y = rotY;
    roomGroup.add(bunkGroup);

    const bW = 1.25;
    const bL = 2.3;
    const bH = 2.4;

    // 4 Corner White Tubular Steel Posts
    createCylinder(0.035, bH, [-bW / 2, bH / 2, -bL / 2], whiteSteelMat, bunkGroup);
    createCylinder(0.035, bH, [bW / 2, bH / 2, -bL / 2], whiteSteelMat, bunkGroup);
    createCylinder(0.035, bH, [-bW / 2, bH / 2, bL / 2], whiteSteelMat, bunkGroup);
    createCylinder(0.035, bH, [bW / 2, bH / 2, bL / 2], whiteSteelMat, bunkGroup);

    // Lower Tier (Terracotta bedding + folded ochre blanket)
    createBox([bW, 0.06, bL], [0, 0.45, 0], whiteSteelMat, bunkGroup);
    createBox([bW - 0.08, 0.22, bL - 0.08], [0, 0.58, 0], terracottaMat, bunkGroup);
    createBox([bW - 0.06, 0.06, 0.65], [0, 0.72, 0.65], ochreBlanketMat, bunkGroup);
    createBox([0.8, 0.18, 0.45], [0, 0.75, -0.75], pillowMat, bunkGroup);

    // Upper Tier (Terracotta bedding + folded ochre blanket)
    createBox([bW, 0.06, bL], [0, 1.7, 0], whiteSteelMat, bunkGroup);
    createBox([bW - 0.08, 0.22, bL - 0.08], [0, 1.83, 0], terracottaMat, bunkGroup);
    createBox([bW - 0.06, 0.06, 0.65], [0, 1.97, 0.65], ochreBlanketMat, bunkGroup);
    createBox([0.8, 0.18, 0.45], [0, 2.0, -0.75], pillowMat, bunkGroup);

    // Upper Safety Guardrails
    createBox([bW, 0.04, 0.04], [0, 2.1, -bL / 2], whiteSteelMat, bunkGroup);
    createBox([0.04, 0.04, bL], [-bW / 2, 2.1, 0], whiteSteelMat, bunkGroup);

    // Integrated White Steel Climbing Ladder
    createCylinder(0.025, 1.8, [bW / 2 + 0.02, 0.9, 0.4], whiteSteelMat, bunkGroup);
    createCylinder(0.025, 1.8, [bW / 2 + 0.02, 0.9, 0.8], whiteSteelMat, bunkGroup);
    for (let r = 0.45; r <= 1.6; r += 0.35) {
      createBox([0.03, 0.03, 0.4], [bW / 2 + 0.02, r, 0.6], whiteSteelMat, bunkGroup);
    }
  };

  createBunkBed(-2.4, -0.8, Math.PI / 2);
  createBunkBed(2.4, -0.8, -Math.PI / 2);

  return {
    defaultCameraPos: new THREE.Vector3(0, 1.8, 2.6),
    cameraTarget: new THREE.Vector3(0, 1.5, -0.8),
    dollhousePos: new THREE.Vector3(0, 5.6, 3.2),
    hotspots: [
      { id: "bunk-frame", title: "Oq Po‘lat Karkas", desc: "Mustahkam oq yaltiroq po‘lat quvurli ikki qavatli karavotlar.", pos: [-2.1, 1.4, -0.8] },
      { id: "sheets", title: "Terracotta Choyshablar", desc: "Issiq g‘isht rangli (terracotta) paxtali sifatli choyshab to‘plami.", pos: [-2.1, 0.65, -0.8] },
      { id: "blanket", title: "Ocher Adyol", desc: "Xantal / oxra rangli issiq qishki adyol.", pos: [2.1, 0.72, -0.2] },
      { id: "floor-tiles", title: "Yaltiroq Chinni Kafel", desc: "Oyna kabi aks etuvchi 60x60 sm chinni oq kafel pol.", pos: [0, 0.15, 0] },
      { id: "fan", title: "Shift Shamollatgichi", desc: "Shiftga o‘rnatilgan avtomatlashtirilgan havo aylantirgich.", pos: [0, 4.1, -0.6] }
    ]
  };
}

/**
 * 9. INDIVIDUAL ROOM 03 — STANDART TWIN STUDENT ROOM
 * Exact Match to reference image room3.jpeg
 */
export function buildRoom3Twin(roomGroup) {
  const carpetMat = new THREE.MeshStandardMaterial({ map: createCarpetTexture(), roughness: 0.85 });
  const woodBorderMat = new THREE.MeshStandardMaterial({ map: createWoodPlankTexture(), roughness: 0.5 });
  const birchMat = new THREE.MeshStandardMaterial({ map: createBirchTexture(), roughness: 0.6 });
  const slateGreyMat = new THREE.MeshStandardMaterial({ color: "#334155", roughness: 0.6 });
  const whiteMattressMat = new THREE.MeshStandardMaterial({ color: "#f8fafc", roughness: 0.85 });
  const zebraBlindsMat = new THREE.MeshStandardMaterial({ map: createZebraBlindsTexture(), roughness: 0.4, transparent: true, opacity: 0.95 });
  const radiatorMat = new THREE.MeshStandardMaterial({ color: "#ffffff", metalness: 0.8, roughness: 0.2 });
  const wallMat = new THREE.MeshStandardMaterial({ color: "#f8fafc", roughness: 0.9 });
  const glassMat = new THREE.MeshPhysicalMaterial({ color: "#e2e8f0", roughness: 0.1, transmission: 0.9, transparent: true, opacity: 0.9 });

  // Two-tone Floor (Linoleum border + Center charcoal carpet)
  createBox([7.2, 0.2, 6.4], [0, 0, 0], woodBorderMat, roomGroup);
  createBox([4.6, 0.21, 5.0], [0, 0.01, 0], carpetMat, roomGroup);

  // Walls & Ceiling
  createBox([7.2, 4.4, 0.2], [0, 2.2, -3.2], wallMat, roomGroup);
  createBox([0.2, 4.4, 6.4], [-3.6, 2.2, 0], wallMat, roomGroup);
  createBox([0.2, 4.4, 6.4], [3.6, 2.2, 0], wallMat, roomGroup);
  createBox([7.2, 0.2, 6.4], [0, 4.4, 0], wallMat, roomGroup);

  // Back Window with Zebra Blinds & Radiator (matching room3.jpeg)
  createBox([3.2, 2.4, 0.1], [0, 2.4, -3.15], glassMat, roomGroup);
  createBox([3.2, 2.3, 0.04], [0, 2.4, -3.08], zebraBlindsMat, roomGroup);
  // Radiator under window
  createBox([2.4, 0.65, 0.16], [0, 0.65, -3.0], radiatorMat, roomGroup);
  for (let rx = -1.1; rx <= 1.1; rx += 0.12) {
    createBox([0.03, 0.6, 0.18], [rx, 0.65, -3.0], radiatorMat, roomGroup);
  }

  // 2 Single Student Beds (Slate-grey headboards & birch drawers)
  const createTwinBed = (x) => {
    const bedGroup = new THREE.Group();
    bedGroup.position.set(x, 0, -0.65);
    roomGroup.add(bedGroup);

    // Bed frame
    createBox([1.2, 0.35, 2.1], [0, 0.25, 0], birchMat, bedGroup);
    // Slate-grey Headboard & Footboard
    createBox([1.24, 0.9, 0.08], [0, 0.65, -1.05], slateGreyMat, bedGroup);
    createBox([1.24, 0.55, 0.08], [0, 0.45, 1.05], slateGreyMat, bedGroup);
    // White mattress & quilt
    createBox([1.16, 0.25, 2.0], [0, 0.5, 0], whiteMattressMat, bedGroup);
    createBox([0.8, 0.16, 0.45], [0, 0.68, -0.75], whiteMattressMat, bedGroup); // Pillow

    // Natural Birch Storage Drawers Underneath
    createBox([0.55, 0.2, 0.8], [-0.3, 0.15, 0], birchMat, bedGroup);
    createBox([0.55, 0.2, 0.8], [0.3, 0.15, 0], birchMat, bedGroup);
    createBox([0.16, 0.02, 0.02], [-0.3, 0.15, 0.41], slateGreyMat, bedGroup);
    createBox([0.16, 0.02, 0.02], [0.3, 0.15, 0.41], slateGreyMat, bedGroup);
  };

  createTwinBed(-1.85);
  createTwinBed(1.85);

  // Center 2-Drawer Nightstand
  createBox([0.65, 0.6, 0.65], [0, 0.35, -2.65], birchMat, roomGroup);
  createBox([0.16, 0.02, 0.02], [0, 0.45, -2.32], slateGreyMat, roomGroup);
  createBox([0.16, 0.02, 0.02], [0, 0.25, -2.32], slateGreyMat, roomGroup);

  return {
    defaultCameraPos: new THREE.Vector3(0, 1.8, 2.6),
    cameraTarget: new THREE.Vector3(0, 1.5, -0.65),
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

/**
 * 10. INDIVIDUAL ROOM 04 — DELUXE SINGLE STUDIO DORM
 * Exact Match to reference image hero-dorm-room.jpeg / hero-dorm-room.png
 */
export function buildRoom4Studio(roomGroup) {
  const woodMat = new THREE.MeshStandardMaterial({ map: createWoodPlankTexture("#b45309", "#78350f"), roughness: 0.5 });
  const darkMat = new THREE.MeshStandardMaterial({ color: "#1e293b", roughness: 0.4 });
  const whiteMat = new THREE.MeshStandardMaterial({ color: "#f8fafc", roughness: 0.85 });
  const warmLedMat = new THREE.MeshStandardMaterial({ color: "#fef08a", emissive: "#facc15", emissiveIntensity: 0.8 });
  const blueDuvetMat = new THREE.MeshStandardMaterial({ color: "#0369a1", roughness: 0.8 });
  const screenMat = new THREE.MeshStandardMaterial({ color: "#0284c7", emissive: "#0369a1", emissiveIntensity: 0.5 });

  // Room Shell
  createBox([7.2, 0.2, 6.4], [0, 0, 0], woodMat, roomGroup);
  createBox([7.2, 4.4, 0.2], [0, 2.2, -3.2], whiteMat, roomGroup);
  createBox([0.2, 4.4, 6.4], [-3.6, 2.2, 0], whiteMat, roomGroup);
  createBox([0.2, 4.4, 6.4], [3.6, 2.2, 0], whiteMat, roomGroup);
  createBox([7.2, 0.2, 6.4], [0, 4.4, 0], whiteMat, roomGroup);

  // Single Bed (Left wall)
  createBox([1.3, 0.45, 2.2], [-2.6, 0.25, -1.5], darkMat, roomGroup);
  createBox([1.25, 0.25, 2.1], [-2.6, 0.55, -1.5], whiteMat, roomGroup);
  createBox([1.27, 0.1, 1.4], [-2.6, 0.68, -1.15], blueDuvetMat, roomGroup); // Blue duvet
  createBox([0.8, 0.2, 0.45], [-2.6, 0.75, -2.2], whiteMat, roomGroup); // Pillow

  // Study Desk, Chair & Laptop (Right wall)
  createBox([2.4, 0.08, 1.1], [2.2, 0.85, -1.5], woodMat, roomGroup);
  createBox([0.08, 0.8, 1.0], [1.1, 0.4, -1.5], darkMat, roomGroup);
  createBox([0.08, 0.8, 1.0], [3.3, 0.4, -1.5], darkMat, roomGroup);

  // Modern Student Chair
  createBox([0.5, 0.45, 0.5], [2.2, 0.25, -0.6], darkMat, roomGroup);
  createBox([0.5, 0.5, 0.06], [2.2, 0.72, -0.35], darkMat, roomGroup);

  // Laptop & Desk Lamp
  createBox([0.45, 0.02, 0.32], [2.2, 0.9, -1.5], darkMat, roomGroup);
  const lapScreen = createBox([0.45, 0.28, 0.02], [2.2, 1.05, -1.65], screenMat, roomGroup);
  lapScreen.rotation.x = -0.25;
  createCylinder(0.08, 0.45, [3.0, 1.1, -1.7], warmLedMat, roomGroup); // Lamp

  // Modern Wardrobe
  createBox([1.6, 3.2, 0.8], [-2.6, 1.6, 1.6], darkMat, roomGroup);

  return {
    defaultCameraPos: new THREE.Vector3(0, 1.8, 2.6),
    cameraTarget: new THREE.Vector3(0, 1.5, -1.2),
    dollhousePos: new THREE.Vector3(0, 5.4, 3.2),
    hotspots: [
      { id: "studio-bed", title: "Shaxsiy Yotoq", desc: "Moviy choyshabli keng qulay bir kishilik yotoq.", pos: [-2.6, 0.7, -1.5] },
      { id: "desk", title: "O‘qish Maydoni", desc: "Keng yog‘och stol, noutbuk va LED yoritgich.", pos: [2.2, 1.0, -1.5] },
      { id: "wardrobe", title: "Kiyim Shkafi", desc: "Katta 2 eshikli shaxsiy kiyim va poyabzal shkafi.", pos: [-2.6, 1.6, 1.6] }
    ]
  };
}

// ============================================================================
// 4. METADATA FOR ALL ENVIRONMENTS & ROOMS
// ============================================================================

export const ALL_3D_ENVIRONMENTS_METADATA = [
  {
    id: "exterior",
    name: "01 / TPU Bino Arxitekturasi",
    category: "exterior",
    refImages: ["/images/dormitory-building.png", "/images/university-campus.png", "/images/d1.jpg", "/images/d2.jpeg", "/images/d3.jpg", "/images/d4.jpg", "/images/d6.jpeg"],
    refImage: "/images/dormitory-building.png",
    tag: "Tashqi ko‘rinish",
    type: "Fasad & Kampus",
    description: "Tashkent Perfect University talabalar turar joyi binosi. Zamonaviy shisha fasad, arxitekturaviy soyabon, yashil xiyobon va kechki 24/7 yorug‘lik tizimi.",
    amenities: ["Zamonaviy fasad", "Yashil kampus bog‘i", "24/7 tashqi yoritgich", "Granit piyodalar yo‘lagi", "Xavfsiz hudud"]
  },
  {
    id: "reception",
    name: "02 / Asosiy Kirish & Qabulxona",
    category: "entrance",
    refImages: ["/images/contact-background.jpeg"],
    refImage: "/images/contact-background.jpeg",
    tag: "Kirish qismi",
    type: "Qabulxona & Lobbi",
    description: "Katta ikki tavaqali avtomat eshiklar, marmar qabulxona peshtaxtasi, xavfsizlik turniketlari va kutish zali.",
    amenities: ["Marmar qabulxona", "Elektron turniketlar", "Kutish divanlari", "Axborot monitori", "LED yoritgichlar"]
  },
  {
    id: "atrium",
    name: "03 / Asosiy Katta Xoll (Atrium)",
    category: "hall",
    refImages: ["/images/d2.jpeg"],
    refImage: "/images/d2.jpeg",
    tag: "Markaziy bino",
    type: "Katta Xoll & Atrium",
    description: "2 qavatli baland shiftli markaziy atrium, shisha to‘siqli mezzanin balkoni, aylanma dam olish oroli va tirik daraxt kompozitsiyasi.",
    amenities: ["Baland 2 qavatli shift", "Shisha balkon to‘sig‘i", "Dumaloq dam olish oroli", "Tirik o‘simliklar", "Tabiiy osmon nuri"]
  },
  {
    id: "kitchen",
    name: "04 / Umumiy Oshxona & Ovqatlanish",
    category: "kitchen",
    refImages: ["/images/k1.jpeg", "/images/k2.jpeg", "/images/k3.jpeg"],
    refImage: "/images/k1.jpeg",
    tag: "Umumiy maydon",
    type: "Zamonaviy Oshxona",
    description: "4 ta induksion plita va dudburonlar, 2 ta katta zanglamas muzlatgich, mikroto‘lqinli pechlar banki va 8 kishilik yog‘och tushlik stoli.",
    amenities: ["4 ta induksion plita", "Katta zanglamas muzlatgichlar", "Mikroto‘lqinli pechlar", "Keng ovqatlanish stoli", "Chiqindi saralash"]
  },
  {
    id: "library",
    name: "05 / Kutubxona & O‘quv Kovorking",
    category: "library",
    refImages: ["/images/l1.jpeg", "/images/l2.jpeg", "/images/l3.jpeg"],
    refImage: "/images/l1.jpeg",
    tag: "Ta’lim & Mutolaa",
    type: "Kutubxona & Kovorking",
    description: "Shiftgacha kitob javonlari, shaxsiy o‘qish kabinalari (carrels), noutbuk va LED chiroqlar, guruh ishi uchun taqdimot ekrani.",
    amenities: ["Katta kitob javoni", "Shaxsiy o‘qish kabinalari", "LED stol chiroqlari", "Taqdimot ekrani", "Yuqori tezlikdagi Wi-Fi"]
  },
  {
    id: "sports",
    name: "06 / Basketbol & Fitnes Maydoni",
    category: "sports",
    refImages: ["/images/b1.jpeg", "/images/b2.webp", "/images/b3.jpeg"],
    refImage: "/images/b1.jpeg",
    tag: "Sport & Sog‘lom hayot",
    type: "Basketbol & Fitnes",
    description: "Standart basketbol yarim maydoni va shisha shit, gantellar va fitnes skameykasi, sport anjomlari saqlash shkafi.",
    amenities: ["Standart basketbol shiti", "Maxsus akril qoplama", "Gantellar & skameyka", "Koptoklar saqlash steli", "Yumshoq rezina pol"]
  },
  {
    id: "room1",
    name: "07 / Kapsula Pod Yotoqxona",
    category: "room",
    refImages: ["/images/room1.jpeg"],
    refImage: "/images/room1.jpeg",
    capacity: "4-8 o‘rin",
    price: "$120",
    period: "oyiga",
    tag: "Eng ommabop",
    type: "Kapsula tipi",
    description: "Yapon uslubidagi zamonaviy yog‘och kapsula podlar. Shaxsiy LED yorug‘lik, qizil choyshab, oq sochiq to‘plami va pastki saqlash tortmalari.",
    amenities: ["Shaxsiy kapsula pod", "Ichki LED yorug‘lik", "Qizil choyshab & sochiq", "Yog‘och saqlash tortmalari", "24/7 sokinlik"]
  },
  {
    id: "room2",
    name: "08 / Minimalist Oq Bunk Xona",
    category: "room",
    refImages: ["/images/room2.jpeg"],
    refImage: "/images/room2.jpeg",
    capacity: "4-6 o‘rin",
    price: "$100",
    period: "oyiga",
    tag: "Mavjud",
    type: "Kop o‘rinli zamonaviy",
    description: "Yorug‘ oq metall karkasli ikki qavatli karavotlar, issiq terracotta to‘shaklari, ocher adyollar va oyna kabi yaltiroq chinni kafel pol.",
    amenities: ["Oq po‘lat karkas", "Terracotta choyshablar", "Ocher issiq adyol", "Yaltiroq chinni kafel", "Ventilyatsiya tizimi"]
  },
  {
    id: "room3",
    name: "09 / Standart 2 Kishilik Xona",
    category: "room",
    refImages: ["/images/room3.jpeg"],
    refImage: "/images/room3.jpeg",
    capacity: "2 o‘rin",
    price: "$180",
    period: "oyiga",
    tag: "Premium",
    type: "2 kishilik qulay",
    description: "Ikkita alohida bir kishilik yotoq, kulrang boshkoralar, tabiiy yog‘och tortmalar, zebra rolikli parda, markaziy isitish va o‘rtadagi gilam.",
    amenities: ["2 ta alohida to‘shak", "Zebra rolikli parda", "Taglik tortmalari", "Markaziy isitish", "Yumshoq gilam"]
  },
  {
    id: "room4",
    name: "10 / Deluxe Studio Talabalar Xonasi",
    category: "room",
    refImages: ["/images/hero-dorm-room.jpeg", "/images/hero-dorm-room.png"],
    refImage: "/images/hero-dorm-room.jpeg",
    capacity: "1 o‘rin",
    price: "$240",
    period: "oyiga",
    tag: "Eksklyuziv",
    type: "Shaxsiy studio",
    description: "Mustaqil va sokin yashashni xohlovchilar uchun shaxsiy xona: keng yog‘och yotoq, moviy adyol, o‘qish stoli, ergonomik kreslo va katta kiyim shkafi.",
    amenities: ["Shaxsiy xona", "Keng o‘qish stoli", "Ergonomik kreslo", "Katta kiyim shkafi", "Shaxsiy shinamlik"]
  }
];

// Backward-compatible room list for existing components
export const ROOM_3D_METADATA = ALL_3D_ENVIRONMENTS_METADATA.filter((m) => m.category === "room");

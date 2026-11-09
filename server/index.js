import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import Database from "better-sqlite3";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "server", "data");
fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, "auth.sqlite"));
db.pragma("journal_mode = WAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS authorized_students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    university_id TEXT UNIQUE,
    passport_hash TEXT UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    active INTEGER NOT NULL DEFAULT 1
  );
  CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    login TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    registration_method TEXT NOT NULL CHECK (registration_method IN ('universityId', 'passport')),
    university_id TEXT UNIQUE,
    passport_ciphertext TEXT UNIQUE,
    verified INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (university_id) REFERENCES authorized_students(university_id)
  );
`);

const app = express();
const sessions = new Map();
const sessionMaxAge = 1000 * 60 * 60 * 8;
const passportKey = crypto.createHash("sha256")
  .update(process.env.AUTH_ENCRYPTION_KEY || "development-only-change-me")
  .digest();

app.use(express.json({ limit: "20kb" }));

function hashValue(value) {
  return crypto.createHash("sha256").update(value.trim().toUpperCase()).digest("hex");
}

function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16);
    crypto.scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) reject(error);
      else resolve(`${salt.toString("hex")}:${derivedKey.toString("hex")}`);
    });
  });
}

function verifyPassword(password, stored) {
  return new Promise((resolve, reject) => {
    const [saltHex, hashHex] = stored.split(":");
    crypto.scrypt(password, Buffer.from(saltHex, "hex"), 64, (error, derivedKey) => {
      if (error) reject(error);
      else resolve(crypto.timingSafeEqual(Buffer.from(hashHex, "hex"), derivedKey));
    });
  });
}

function encryptPassport(passport) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", passportKey, iv);
  const encrypted = Buffer.concat([cipher.update(passport.trim().toUpperCase(), "utf8"), cipher.final()]);
  return `${iv.toString("hex")}:${cipher.getAuthTag().toString("hex")}:${encrypted.toString("hex")}`;
}

function getSession(request) {
  const token = request.headers.cookie?.match(/student_session=([^;]+)/)?.[1];
  if (!token) return null;
  const session = sessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    sessions.delete(token);
    return null;
  }
  return session;
}

function publicStudent(account) {
  return { id: account.id, firstName: account.first_name, lastName: account.last_name, login: account.login };
}

app.post("/api/auth/register", async (request, response) => {
  const {
    firstName, lastName, login, password, registrationMethod, universityId, passport
  } = request.body;
  const cleanLogin = String(login || "").trim();
  const cleanFirstName = String(firstName || "").trim();
  const cleanLastName = String(lastName || "").trim();
  const loginPattern = /^[A-Za-z0-9]{8,}$/;
  const passportPattern = /^[A-Z]{2}\d{7}$/;

  if (!cleanFirstName || !cleanLastName || !loginPattern.test(cleanLogin)) {
    return response.status(400).json({ message: "Ism, familiya va login ma’lumotlarini to‘g‘ri kiriting." });
  }
  if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password || "")) {
    return response.status(400).json({ message: "Parol kamida 8 belgidan iborat bo‘lib, harf va raqamni o‘z ichiga olishi kerak." });
  }
  if (!["universityId", "passport"].includes(registrationMethod)) {
    return response.status(400).json({ message: "Ro‘yxatdan o‘tish usulini tanlang." });
  }

  const existingLogin = db.prepare("SELECT id FROM accounts WHERE login = ? COLLATE NOCASE").get(cleanLogin);
  if (existingLogin) return response.status(409).json({ message: "Bu login allaqachon band." });

  let authorized;
  if (registrationMethod === "universityId") {
    const cleanId = String(universityId || "").trim();
    authorized = db.prepare("SELECT * FROM authorized_students WHERE university_id = ? AND active = 1").get(cleanId);
    if (!authorized) return response.status(403).json({ message: "Universitet ID raqami talaba reyestrida topilmadi yoki tasdiqlanmagan." });
  } else {
    const cleanPassport = String(passport || "").trim().toUpperCase();
    if (!passportPattern.test(cleanPassport)) return response.status(400).json({ message: "Pasport formati AD1234567 ko‘rinishida bo‘lishi kerak." });
    authorized = db.prepare("SELECT * FROM authorized_students WHERE passport_hash = ? AND active = 1").get(hashValue(cleanPassport));
    if (!authorized) return response.status(403).json({ message: "Pasport ma’lumotlari talaba reyestrida topilmadi yoki tasdiqlanmagan." });
  }

  try {
    const passwordHash = await hashPassword(password);
    const result = db.prepare(`
      INSERT INTO accounts (first_name, last_name, login, password_hash, registration_method, university_id, passport_ciphertext, verified)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `).run(
      cleanFirstName, cleanLastName, cleanLogin, passwordHash, registrationMethod,
      registrationMethod === "universityId" ? authorized.university_id : null,
      registrationMethod === "passport" ? encryptPassport(String(passport).trim()) : null
    );
    const account = db.prepare("SELECT * FROM accounts WHERE id = ?").get(result.lastInsertRowid);
    const token = crypto.randomBytes(32).toString("base64url");
    sessions.set(token, { accountId: account.id, expiresAt: Date.now() + sessionMaxAge });
    response.setHeader("Set-Cookie", `student_session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${sessionMaxAge / 1000}`);
    return response.status(201).json({ student: publicStudent(account), message: "Tabriklaymiz! Siz tizimdan muvaffaqiyatli ro‘yxatdan o‘tdingiz." });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") return response.status(409).json({ message: "Bu talaba uchun akkaunt allaqachon mavjud." });
    return response.status(500).json({ message: "Ro‘yxatdan o‘tishda server xatosi yuz berdi." });
  }
});

app.post("/api/auth/login", async (request, response) => {
  const { login, password } = request.body;
  const account = db.prepare("SELECT * FROM accounts WHERE login = ? COLLATE NOCASE AND verified = 1").get(String(login || "").trim());
  if (!account || !(await verifyPassword(String(password || ""), account.password_hash))) {
    return response.status(401).json({ message: "Login yoki parol noto‘g‘ri." });
  }
  const token = crypto.randomBytes(32).toString("base64url");
  sessions.set(token, { accountId: account.id, expiresAt: Date.now() + sessionMaxAge });
  response.setHeader("Set-Cookie", `student_session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${sessionMaxAge / 1000}`);
  return response.json({ student: publicStudent(account) });
});

app.get("/api/auth/me", (request, response) => {
  const session = getSession(request);
  if (!session) return response.status(401).json({ message: "Sessiya topilmadi." });
  const account = db.prepare("SELECT * FROM accounts WHERE id = ? AND verified = 1").get(session.accountId);
  if (!account) return response.status(401).json({ message: "Akkaunt tasdiqlanmagan." });
  return response.json({ student: publicStudent(account) });
});

app.post("/api/auth/logout", (request, response) => {
  const token = request.headers.cookie?.match(/student_session=([^;]+)/)?.[1];
  if (token) sessions.delete(token);
  response.setHeader("Set-Cookie", "student_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0");
  return response.status(204).end();
});

const port = Number(process.env.PORT || 4173);
if (process.env.NODE_ENV === "production") app.use(express.static(path.join(root, "dist")));
app.listen(port, () => console.log(`Auth server listening on http://localhost:${port}`));

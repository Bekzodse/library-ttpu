import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight, Armchair, BookOpen, CalendarDays, Check, ChevronRight,
  GraduationCap, MapPin, Menu, ShieldCheck, Wifi, Wallet, Users, Utensils,
  WashingMachine, Dumbbell, Play, X, Phone, Instagram, Send, CarFront,
  Eye, EyeOff, UserCircle, LogOut, Settings, KeyRound,
  Box, RotateCw, Maximize2, Minimize2, Sun, Moon, Grid, Layers, Sparkles, ChevronLeft, ZoomIn, ZoomOut
} from "lucide-react";
import Room3DExperience, { SingleRoom3DCanvas } from "./Room3DExperience.jsx";
import { ROOM_3D_METADATA, buildRoom1Capsule, buildRoom2Bunk, buildRoom3Twin } from "./rooms3d.js";

gsap.registerPlugin(ScrollTrigger);

const tourAssets = {
  campus: {
    d1: "/images/d1.jpg",
    d2: "/images/d2.jpeg",
    d3: "/images/d3.jpg",
    d4: "/images/d4.jpg",
    d5: "/images/dormitory-building.png",
    d6: "/images/d6.jpeg"
  },
  rooms: {
    room1: "/images/room1.jpeg",
    room2: "/images/room2.jpeg",
    room3: "/images/room3.jpeg"
  },
  basketball: {
    b1: "/images/b1.jpeg",
    b2: "/images/b2.webp",
    b3: "/images/b3.jpeg"
  },
  kitchen: {
    k1: "/images/k1.jpeg",
    k2: "/images/k2.jpeg",
    k3: "/images/k3.jpeg"
  },
  library: {
    l1: "/images/l1.jpeg",
    l2: "/images/l2.jpeg",
    l3: "/images/l3.jpeg"
  }
};

const assetLabels = {
  campus: "Talabalar shaharchasi",
  rooms: "Talabalar xonasi",
  basketball: "Basketbol maydoni",
  kitchen: "Oshxona",
  library: "Kutubxona"
};

const allProjectAssets = [
  { id: "room1", group: "rooms", title: "2 kishilik talabalar xonasi", subtitle: "Qulay va yorug‘ xona", url: "/images/room1.jpeg", defaultMode: "sphere" },
  { id: "room2", group: "rooms", title: "1 kishilik shaxsiy xona", subtitle: "Tinch va mustaqil o‘qish muhiti", url: "/images/room2.jpeg", defaultMode: "sphere" },
  { id: "room3", group: "rooms", title: "4 kishilik umumiy xona", subtitle: "Do‘stlar bilan qulay yashash", url: "/images/room3.jpeg", defaultMode: "sphere" },
  { id: "d1", group: "campus", title: "TPU Kampus asosiy binosi", subtitle: "Zamonaviy me’moriy ko‘rinish", url: "/images/d1.jpg", defaultMode: "card" },
  { id: "d2", group: "campus", title: "Yotoqxona fasad qismi", subtitle: "Kirish va hovli maydoni", url: "/images/d2.jpeg", defaultMode: "card" },
  { id: "d3", group: "campus", title: "Kampus xiyoboni", subtitle: "Yashil hudud va dam olish joylari", url: "/images/d3.jpg", defaultMode: "card" },
  { id: "d4", group: "campus", title: "Talabalar turar joyi binosi", subtitle: "Yorug‘ va zamonaviy korpus", url: "/images/d4.jpg", defaultMode: "card" },
  { id: "d5", group: "campus", title: "Yotoqxona umumiy majmuasi", subtitle: "Universitet hududi", url: "/images/dormitory-building.png", defaultMode: "card" },
  { id: "d6", group: "campus", title: "Kechki kampus manzarasi", subtitle: "24/7 yoritilgan xavfsiz hudud", url: "/images/d6.jpeg", defaultMode: "card" },
  { id: "k1", group: "kitchen", title: "Zamonaviy oshxona", subtitle: "To‘liq jihozlangan pishirish maydoni", url: "/images/k1.jpeg", defaultMode: "card" },
  { id: "k2", group: "kitchen", title: "Oshxona umumiy stoli", subtitle: "Talabalar birga ovqatlanish maydoni", url: "/images/k2.jpeg", defaultMode: "card" },
  { id: "k3", group: "kitchen", title: "Oshxona maishiy texnikasi", subtitle: "Muzlatgich va mikroto‘lqinli pechlar", url: "/images/k3.jpeg", defaultMode: "card" },
  { id: "l1", group: "library", title: "Talabalar kutubxonasi", subtitle: "Keng kitob zaxirasi", url: "/images/l1.jpeg", defaultMode: "card" },
  { id: "l2", group: "library", title: "O‘quv va mutolaa zali", subtitle: "Tinch va osoyishta muhit", url: "/images/l2.jpeg", defaultMode: "card" },
  { id: "l3", group: "library", title: "Kovorking va guruh ishi zali", subtitle: "Internet va taqdimot zonalari", url: "/images/l3.jpeg", defaultMode: "card" },
  { id: "b1", group: "basketball", title: "Basketbol va sport maydoni", subtitle: "Ochiq havoda faol sport", url: "/images/b1.jpeg", defaultMode: "card" },
  { id: "b2", group: "basketball", title: "Sport zali maydoni", subtitle: "Mashg‘ulotlar va turnirlar", url: "/images/b2.webp", defaultMode: "card" },
  { id: "b3", group: "basketball", title: "Sport anjomlari zonasi", subtitle: "Sog‘lom talabalar hayoti", url: "/images/b3.jpeg", defaultMode: "card" }
];

const rooms = [
  {
    id: 1, title: "2 kishilik xona", people: "2 o‘rin", price: "$120", tag: "Mavjud",
    image: "/images/room1.jpeg",
    description: "Ikki talaba uchun qulay va yorug‘ xona.",
    gallery: ["/images/room1.jpeg", "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=90", "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=90", "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=90"],
    amenities: ["2 ta qulay yotoq", "O‘qish stoli", "Shaxsiy shkaf", "Tezkor Wi-Fi"]
  },
  {
    id: 2, title: "1 kishilik xona", people: "1 o‘rin", price: "$180", tag: "Mavjud",
    image: "/images/room2.jpeg",
    description: "Shaxsiy hudud va tinch o‘qish muhiti.",
    gallery: ["/images/room2.jpeg", "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=90", "https://images.unsplash.com/photo-1617104678098-de229db51175?auto=format&fit=crop&w=1200&q=90", "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=90"],
    amenities: ["1 ta keng yotoq", "Shaxsiy o‘qish joyi", "Katta shkaf", "24/7 xavfsizlik"]
  },
  {
    id: 3, title: "4 kishilik xona", people: "4 o‘rin", price: "$100", tag: "Mavjud",
    image: "/images/room3.jpeg",
    description: "Do‘stlar bilan yashash uchun keng xona.",
    gallery: ["/images/room3.jpeg", "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=90", "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=90", "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=90"],
    amenities: ["4 ta yotoq", "Umumiy o‘qish stoli", "Kiyim shkafi", "Oshxonaga yaqin"]
  }
];

const facilities = [
  { icon: Wifi, title: "Bepul Wi-Fi", sub: "Yotoqxona bo‘ylab tezkor internet." },
  { icon: ShieldCheck, title: "24/7 Xavfsizlik", sub: "Kuzatuv kameralari va himoyalangan kirish." },
  { icon: Utensils, title: "Zamonaviy oshxona", sub: "Talabalar uchun to‘liq jihozlangan oshxona." },
  { icon: WashingMachine, title: "Kir yuvish xonasi", sub: "Qulay kir yuvish jihozlari." },
  { icon: Dumbbell, title: "Sport zali", sub: "Talabalar uchun maxsus mashg‘ulot maydoni." },
  { icon: BookOpen, title: "O‘quv xonasi", sub: "Tinch va qulay o‘qish muhiti." },
  { icon: Armchair, title: "Dam olish hududi", sub: "Hordiq uchun qulay umumiy maydon." },
  { icon: CarFront, title: "Avtoturargoh", sub: "Velosiped va avtomobillar uchun xavfsiz joy." }
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState(() => {
    const hash = window.location.hash;
    return ["#rooms", "#facilities", "#tour", "#contact"].includes(hash) ? hash.slice(1) : "home";
  });
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [detailRoom, setDetailRoom] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", room: "2 kishilik xona" });
  const [authMode, setAuthMode] = useState(null);
  const [student, setStudent] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [inspectAsset, setInspectAsset] = useState(null);

  const open3D = (target, defaultMode = null) => {
    if (!target) return;
    if (typeof target === "string") {
      const found = allProjectAssets.find((a) => a.id === target || a.url === target);
      if (found) setInspectAsset(defaultMode ? { ...found, defaultMode } : found);
      return;
    }
    if (target.id && allProjectAssets.find((a) => a.id === `room${target.id}`)) {
      const found = allProjectAssets.find((a) => a.id === `room${target.id}`);
      setInspectAsset(defaultMode ? { ...found, defaultMode } : found);
      return;
    }
    setInspectAsset(defaultMode ? { ...target, defaultMode } : target);
  };

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => { if (data?.student) setStudent(data.student); })
      .catch(() => {});

    const handlePopState = () => {
      const hash = window.location.hash;
      setActiveView(["#rooms", "#facilities", "#tour", "#contact"].includes(hash) ? hash.slice(1) : "home");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const openBooking = (room = null) => {
    setSelectedRoom(room);
    setForm((old) => ({ ...old, room: room?.title || old.room }));
    setSubmitted(false);
  };

  const closeBooking = () => setSelectedRoom(null);
  const submitBooking = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const openAuth = (mode = "login") => {
    setProfileOpen(false);
    setAuthMode(mode);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setStudent(null);
    setProfileOpen(false);
  };

  const navigate = (href) => {
    setMenuOpen(false);
    if (href === "#rooms" || href === "#facilities" || href === "#tour" || href === "#contact") {
      setActiveView(href.slice(1));
      if (window.location.hash !== href) {
        window.history.pushState(null, "", href);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setActiveView("home");
    if (window.location.hash !== href) {
      window.history.pushState(null, "", href);
    }
    requestAnimationFrame(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    });
  };

  const navItems = [
    ["Bosh sahifa", "#home"], ["Xonalar", "#rooms"], ["3D sayohat", "#tour"],
    ["Qulayliklar", "#facilities"], ["Aloqa", "#contact"]
  ];

  return (
    <div className="site-shell">
      <header className="header">
        <button className="brand brand-button" onClick={() => navigate("#home")} aria-label="TPU Smart Dormitory">
          <span className="brand-mark">TPU</span>
          <span className="brand-copy"><b>Tashkent</b><b>Perfect University</b></span>
        </button>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menyuni ochish">
          {menuOpen ? <X /> : <Menu />}
        </button>
        <nav className={menuOpen ? "nav nav-open" : "nav"}>
          {navItems.map(([label, href], i) => (
            <a
              key={label}
              className={`nav-link ${(activeView === "rooms" && href === "#rooms") || (activeView === "facilities" && href === "#facilities") || (activeView === "tour" && href === "#tour") || (activeView === "contact" && href === "#contact") || (activeView === "home" && i === 0) ? "active" : ""}`}
              href={href}
              onClick={(event) => { event.preventDefault(); navigate(href); }}
            >
              {label}
            </a>
          ))}
        </nav>
        {student ? <div className="profile-area">
          <button className="profile-trigger" onClick={() => setProfileOpen((open) => !open)} aria-expanded={profileOpen}>
            <span className="profile-initials">{`${student.firstName[0]}${student.lastName[0]}`.toUpperCase()}</span>
            <span className="profile-name">{student.firstName} {student.lastName}</span>
          </button>
          {profileOpen && <div className="profile-menu">
            <b>{student.firstName} {student.lastName}</b>
            <span>{student.login}</span>
            <button><UserCircle size={15} /> Mening profilim</button>
            <button><KeyRound size={15} /> Shaxsiy ma’lumotlarim</button>
            <button><Users size={15} /> Yotoqxona ma’lumotlari</button>
            <button><Settings size={15} /> Sozlamalar</button>
            <button onClick={logout}><LogOut size={15} /> Tizimdan chiqish</button>
          </div>}
        </div> : <button className="login-btn" onClick={() => openAuth()}><Users size={16} /> Tizimga kirish</button>}
      </header>

      <main>
        {activeView === "rooms" ? <RoomsOnly openBooking={openBooking} openDetails={setDetailRoom} open3D={open3D} /> : activeView === "facilities" ? <FacilitiesOnly facilities={facilities} /> : activeView === "tour" ? <CampusTour onOpen3D={open3D} /> : activeView === "contact" ? <ContactSection /> : <>
        <section className="hero" id="home">
          <div className="hero-copy">
            <div className="eyebrow"><GraduationCap size={17} /> Talabalar uchun zamonaviy yotoqxona</div>
            <h1>Sizning yangi uyingiz — qulay, xavfsiz va hamyonbop!</h1>
            <p>Talabalar uchun qulay narxlarda yotoqxona. O‘zingizga mos xonani hoziroq tanlang va band qiling!</p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={() => openBooking()}><CalendarDays size={18} /> Xonani band qilish <ArrowRight size={17} /></button>
              <a className="btn btn-outline" href="#tour" onClick={(event) => { event.preventDefault(); navigate("#tour"); }}><Play size={16} fill="currentColor" /> 3D sayohatni ko‘rish</a>
            </div>
            <div className="hero-note"><ShieldCheck size={16} /> Ishonchli va qulay yashash muhiti</div>
            <div className="hero-stats" aria-label="Yotoqxona ko‘rsatkichlari">
              <span><strong>24/7</strong><small>Xavfsizlik</small></span>
              <span><strong>5 min</strong><small>Universitetgacha</small></span>
              <span><strong>100%</strong><small>Qulaylik</small></span>
            </div>
          </div>
          <div className="hero-image">
            <img src="/images/hero-dorm-room.jpeg" alt="Zamonaviy talabalar yotoqxonasi xonasi" />
            <div className="image-label"><span className="live-dot" /> Zamonaviy talabalar xonasi</div>
            <div className="image-float-card"><span className="float-icon"><Check size={16} /></span><span><b>Joylar mavjud</b><small>Arizalar qabul qilinmoqda</small></span></div>
          </div>
          <div className="hero-curve" />
        </section>

        <section className="benefit-carousel" aria-label="Asosiy afzalliklar">
          <div className="benefit-strip">
            <div className="benefit-group">
              <Benefit icon={Wallet} title="Hamyonbop narxlar" text="Talabalar uchun qulay to‘lov" />
              <Benefit icon={ShieldCheck} title="24/7 xavfsizlik" text="Xavfsiz yashash muhiti" />
              <Benefit icon={Wifi} title="Bepul Wi-Fi" text="O‘qish uchun internet" />
              <Benefit icon={MapPin} title="Qulay joylashuv" text="Universitetga yaqin" />
            </div>
            <div className="benefit-group" aria-hidden="true">
              <Benefit icon={Wallet} title="Hamyonbop narxlar" text="Talabalar uchun qulay to‘lov" />
              <Benefit icon={ShieldCheck} title="24/7 xavfsizlik" text="Xavfsiz yashash muhiti" />
              <Benefit icon={Wifi} title="Bepul Wi-Fi" text="O‘qish uchun internet" />
              <Benefit icon={MapPin} title="Qulay joylashuv" text="Universitetga yaqin" />
            </div>
          </div>
        </section>

        <section className="rooms-section" id="rooms" style={{ width: "100%", padding: 0 }}>
          <Room3DExperience
            onBookRoom={(meta) =>
              openBooking({
                title: meta?.name || "Xona",
                price: meta?.price || "$120"
              })
            }
          />
        </section>

        <section className="booking-cta" id="about">
          <div className="cta-icon"><CalendarDays size={31} /></div>
          <div><h2>Xonani hoziroq band qiling!</h2><p>Bir necha daqiqada onlayn ariza qoldiring va qulay yashashni boshlang.</p></div>
          <button className="btn btn-white" onClick={() => openBooking()}>Band qilish <ArrowRight size={16} /></button>
          <div className="cta-decoration">TPU</div>
        </section>
        </>}
      </main>

      {activeView === "home" && <footer className="footer" id="contact-footer">
        <div className="footer-main">
          <a className="brand footer-brand" href="#home"><span className="brand-mark">TPU</span><span className="brand-copy"><b>Tashkent</b><b>Perfect University</b></span></a>
          <div className="footer-contact"><MapPin /><span>Zarqaynar ko‘chasi, 10-uy<br /><small>Toshkent, O‘zbekiston</small></span></div>
          <a className="footer-contact" href="tel:+998771292929"><Phone /><span>+998 77 129 29 29</span></a>
          <div className="socials"><a href="#contact" aria-label="Telegram"><Send /></a><a href="#contact" aria-label="Instagram"><Instagram /></a></div>
        </div>
        <div className="footer-bottom"><span>© 2026 Tashkent Perfect University. Barcha huquqlar himoyalangan.</span><span><a href="#contact">Foydalanish shartlari</a>　|　<a href="#contact">Maxfiylik siyosati</a></span></div>
      </footer>}

      {detailRoom && <RoomDetails room={detailRoom} closeDetails={() => setDetailRoom(null)} openBooking={openBooking} open3D={open3D} />}
      {selectedRoom && <div className="modal-backdrop" onClick={closeBooking}>
        <div className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={closeBooking} aria-label="Yopish"><X /></button>
          {submitted ? <div className="success-state"><span><Check size={30} /></span><h2>Arizangiz qabul qilindi!</h2><p>Rahmat, {form.name}. Administrator siz bilan bog‘lanadi.</p><button className="btn btn-primary" onClick={closeBooking}>Yopish</button></div> :
            <form onSubmit={submitBooking}>
              <span className="section-kicker"><i /> Online bron</span><h2 id="booking-title">Xonani band qilish</h2>
              <p className="modal-desc">Ma’lumotlaringizni qoldiring. Administrator siz bilan bog‘lanadi.</p>
              <label>Ism va familiya<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Masalan, Ali Valiyev" /></label>
              <label>Telefon raqam<input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+998 90 123 45 67" /></label>
              <label>Xona turi<select value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })}>{rooms.map((r) => <option key={r.id}>{r.title}</option>)}</select></label>
              <button className="btn btn-primary submit-btn" type="submit">Ariza yuborish <ArrowRight size={17} /></button>
              <small className="form-disclaimer">Demo shakl: ariza hozircha serverga yuborilmaydi.</small>
            </form>}
        </div>
      </div>}
      {authMode && <AuthModal mode={authMode} onModeChange={setAuthMode} onClose={() => setAuthMode(null)} onSuccess={(account) => { setStudent(account); setAuthMode(null); setActiveView("home"); }} />}
      {inspectAsset && <Image3DInspector asset={inspectAsset} onClose={() => setInspectAsset(null)} onSelectAsset={setInspectAsset} />}
    </div>
  );
}

function ContactSection() {
  const [values, setValues] = useState({ firstName: "", lastName: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    setSent(true);
  };

  return <section className="contact-section contact-page section-wrap" id="contact-form">
    <div className="contact-heading">
      <span className="section-kicker"><i /> Biz bilan bog‘laning</span>
      <h2>Aloqa</h2>
      <p>Savollaringiz bo‘lsa, bizga yozing. Tez orada siz bilan bog‘lanamiz.</p>
    </div>
    <div className="contact-layout">
      <form className="contact-form" onSubmit={submit}>
        {sent ? <div className="contact-success"><span><Check size={26} /></span><h3>Xabaringiz yuborildi!</h3><p>Rahmat. Tez orada siz bilan bog‘lanamiz.</p><button type="button" className="btn btn-outline" onClick={() => { setSent(false); setValues({ firstName: "", lastName: "", phone: "", message: "" }); }}>Yana xabar yuborish</button></div> :
          <>
            <div className="contact-fields">
              <label>Ism<input required value={values.firstName} onChange={(event) => setValues({ ...values, firstName: event.target.value })} placeholder="Ismingizni kiriting" /></label>
              <label>Familiya<input required value={values.lastName} onChange={(event) => setValues({ ...values, lastName: event.target.value })} placeholder="Familiyangizni kiriting" /></label>
            </div>
            <label>Telefon raqami<input required type="tel" value={values.phone} onChange={(event) => setValues({ ...values, phone: event.target.value })} placeholder="+998 90 123 45 67" /></label>
            <label>Xabar yoki murojaat<textarea required value={values.message} onChange={(event) => setValues({ ...values, message: event.target.value })} placeholder="Xabaringizni yozing..." rows="5" /></label>
            <button className="btn btn-primary contact-submit" type="submit">Xabar yuborish <ArrowRight size={17} /></button>
          </>}
      </form>
      <aside className="contact-info">
        <div className="contact-map"><span className="map-road road-one" /><span className="map-road road-two" /><span className="map-water" /><span className="map-pin"><MapPin size={22} /></span><b>TPU</b></div>
        <div className="contact-detail"><MapPin size={19} /><span><b>Manzil</b><small>Zarqaynar ko‘chasi, 10-uy<br />Toshkent, O‘zbekiston</small></span></div>
        <a className="contact-detail" href="tel:+998771292929"><Phone size={19} /><span><b>Telefon</b><small>+998 77 129 29 29</small></span></a>
      </aside>
    </div>
  </section>;
}

function AuthModal({ mode, onModeChange, onClose, onSuccess }) {
 const [method, setMethod] = useState("universityId");
 const [showPassword, setShowPassword] = useState(false);
 const [showConfirm, setShowConfirm] = useState(false);
 const [message, setMessage] = useState("");
 const [loading, setLoading] = useState(false);
 const [values, setValues] = useState({
   firstName: "", lastName: "", universityId: "", passport: "",
   login: "", password: "", confirmPassword: ""
 });
 const registration = mode === "register";
 const update = (key, value) => setValues((old) => ({ ...old, [key]: value }));

 const submit = async (event) => {
   event.preventDefault();
   setMessage("");
   if (registration && values.password !== values.confirmPassword) {
     setMessage("Parol va tasdiqlash paroli bir xil bo‘lishi kerak.");
     return;
   }
   setLoading(true);
   try {
     const payload = registration
       ? { ...values, registrationMethod: method, passport: method === "passport" ? values.passport.toUpperCase() : undefined }
       : { login: values.login, password: values.password };
     const response = await fetch(`/api/auth/${registration ? "register" : "login"}`, {
       method: "POST", headers: { "Content-Type": "application/json" },
       credentials: "include", body: JSON.stringify(payload)
     });
     const data = await response.json();
     if (!response.ok) throw new Error(data.message || "Amalni bajarib bo‘lmadi.");
     onSuccess(data.student);
   } catch (error) {
     setMessage(error.message);
   } finally {
     setLoading(false);
   }
 };

 return <div className="modal-backdrop" onClick={onClose}>
   <div className="auth-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
     <button className="modal-close" onClick={onClose} aria-label="Yopish"><X /></button>
     <div className="auth-heading"><span className="auth-logo"><GraduationCap size={24} /></span><span className="section-kicker"><i /> Talabalar platformasi</span>
       <h2>{registration ? "Ro‘yxatdan o‘tish" : "Tizimga kirish"}</h2>
       <p>{registration ? "Yotoqxona xizmatlaridan foydalanish uchun akkaunt yarating." : "Tasdiqlangan talaba akkauntingiz orqali kiring."}</p>
     </div>
     <form className="auth-form" onSubmit={submit}>
       {registration && <div className="auth-two-columns">
         <label>Ism<input required value={values.firstName} onChange={(event) => update("firstName", event.target.value)} placeholder="Ismingizni kiriting" /></label>
         <label>Familiya<input required value={values.lastName} onChange={(event) => update("lastName", event.target.value)} placeholder="Familiyangizni kiriting" /></label>
       </div>}
       {registration && <div className="auth-methods">
         <span className="auth-label">Ro‘yxatdan o‘tish usuli</span>
         <button type="button" className={method === "universityId" ? "method-card selected" : "method-card"} onClick={() => setMethod("universityId")}><GraduationCap size={18} /><span>Universitet ID orqali<small>Talaba ID raqami bilan</small></span></button>
         <button type="button" className={method === "passport" ? "method-card selected" : "method-card"} onClick={() => setMethod("passport")}><UserCircle size={18} /><span>Pasport ma’lumotlari orqali<small>AD1234567 formatida</small></span></button>
       </div>}
       {registration && method === "universityId" && <label>Universitet ID raqami<input required value={values.universityId} onChange={(event) => update("universityId", event.target.value)} placeholder="Universitet ID raqamingizni kiriting" /></label>}
       {registration && method === "passport" && <label>Pasport seriyasi va raqami<input required pattern="[A-Za-z]{2}[0-9]{7}" value={values.passport} onChange={(event) => update("passport", event.target.value.toUpperCase())} placeholder="AD1234567" /></label>}
       <label>Login<input required minLength={8} pattern="[A-Za-z0-9]{8,}" value={values.login} onChange={(event) => update("login", event.target.value)} placeholder="Masalan, talaba2026" /><small className="field-hint">Kamida 8 ta harf va raqam.</small></label>
       <label>Parol<span className="password-field"><input required minLength={8} type={showPassword ? "text" : "password"} value={values.password} onChange={(event) => update("password", event.target.value)} placeholder="Parolingizni kiriting" /><button type="button" onClick={() => setShowPassword((show) => !show)} aria-label={showPassword ? "Parolni yashirish" : "Parolni ko‘rsatish"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span>{registration && <small className="field-hint">Kamida 8 belgi, kamida bitta harf va raqam.</small>}</label>
       {registration && <label>Parolni tasdiqlash<span className="password-field"><input required minLength={8} type={showConfirm ? "text" : "password"} value={values.confirmPassword} onChange={(event) => update("confirmPassword", event.target.value)} placeholder="Parolni qayta kiriting" /><button type="button" onClick={() => setShowConfirm((show) => !show)} aria-label={showConfirm ? "Parolni yashirish" : "Parolni ko‘rsatish"}>{showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>}
       {message && <div className="auth-error" role="alert">{message}</div>}
       <button className="btn btn-primary auth-submit" disabled={loading}>{loading ? "Yuklanmoqda..." : registration ? "Ro‘yxatdan o‘tish" : "Tizimga kirish"} <ArrowRight size={17} /></button>
       {!registration && <button type="button" className="forgot-password" onClick={() => setMessage("Parolni tiklash uchun administrator bilan bog‘laning.")}>Parolni unutdingizmi?</button>}
     </form>
     <div className="auth-switch">{registration ? "Akkauntingiz bormi?" : "Ro‘yxatdan o‘tmaganmisiz?"} <button type="button" onClick={() => { setMessage(""); onModeChange(registration ? "login" : "register"); }}>{registration ? "Tizimga kirish" : "Ro‘yxatdan o‘tish"}</button></div>
   </div>
 </div>;
}

function RoomsOnly({ openBooking }) {
  return (
    <section className="rooms-only" id="rooms" style={{ width: "100%", padding: 0 }}>
      <Room3DExperience
        onBookRoom={(meta) =>
          openBooking({
            title: meta?.name || "Xona",
            price: meta?.price || "$120"
          })
        }
      />
    </section>
  );
}

function FacilitiesOnly({ facilities }) {
  return (
    <section className="facilities-page">
      <div className="facilities-section section-wrap facilities-visible">
        <div className="facility-heading">
          <span className="section-kicker"><i /> Qulayliklar</span>
          <h1>Qulay talabalar hayoti uchun barcha imkoniyatlar</h1>
          <p>Universitet hayotingizni oson, xavfsiz va qulay qilish uchun zamonaviy imkoniyatlardan foydalaning.</p>
        </div>
        <FacilityCards facilities={facilities} />
      </div>
    </section>
  );
}

function FacilityCards({ facilities }) {
  return (
    <div className="facility-grid">
      {facilities.map(({ icon: Icon, title, sub }, index) => (
        <article className="facility-card" key={title} style={{ "--facility-delay": `${index * 70}ms` }}>
          <span className="facility-icon"><Icon size={24} strokeWidth={2} /></span>
          <div><b>{title}</b><small>{sub}</small></div>
          <span className="facility-arrow"><ArrowRight size={15} /></span>
        </article>
      ))}
    </div>
  );
}

function RoomCards({ openBooking, openDetails, open3D }) {
  return rooms.map((room) => (
    <article className="room-card" key={room.id} onClick={() => openDetails(room)} tabIndex="0" onKeyDown={(event) => event.key === "Enter" && openDetails(room)}>
      <div className="room-photo">
        <img src={room.image} alt={room.title} />
        <span className="availability"><i /> {room.tag}</span>
        <span
          className="view-360-badge"
          onClick={(event) => {
            event.stopPropagation();
            if (open3D) open3D(room, "sphere");
            else openDetails(room);
          }}
          title="360° va 3D fazoda ko‘rish"
        >
          <RotateCw size={11} style={{ marginRight: 3, verticalAlign: "middle" }} /> 360° / 3D ko‘rish
        </span>
      </div>
      <div className="room-info">
        <div><h3>{room.title}</h3><p>{room.description}</p></div>
        <div className="room-bottom">
          <span><Users size={15} /> {room.people}</span>
        <strong className="card-price">{room.price}<small> / oy</small></strong>
          <button className="circle-btn" onClick={(event) => { event.stopPropagation(); openBooking(room); }} aria-label={`${room.title} band qilish`}><ArrowRight size={17} /></button>
        </div>
      </div>
    </article>
  ));
}

function CampusTour({ onOpen3D }) {
  const mountRef = useRef(null);
  const sectionRef = useRef(null);
  const scrollTimelineRef = useRef(null);
  const tourState = useRef({ progress: 0, room: 0, controls: null, camera: null });
  const [scene, setScene] = useState(0);
  const [room, setRoom] = useState(0);
  const [isAutoTour, setIsAutoTour] = useState(false);
  const roomNames = ["Xona 01", "Xona 02", "Xona 03"];
  const locations = ["Talabalar shaharchasi", "Kirish qismi", "Qabulxona", "Yo‘lak", "Talabalar xonasi", "Umumiy joylar", "Terassa"];
  const visibleAssets = scene < 2
    ? [{ group: "campus", entries: Object.entries(tourAssets.campus) }]
    : scene === 4
      ? [{ group: "rooms", entries: Object.entries(tourAssets.rooms) }]
      : scene === 5
        ? [
          { group: "kitchen", entries: Object.entries(tourAssets.kitchen) },
          { group: "library", entries: Object.entries(tourAssets.library) },
          { group: "basketball", entries: Object.entries(tourAssets.basketball) }
        ]
        : [];
  const assetLabels = { campus: "Talabalar shaharchasi", rooms: "Talabalar xonasi", kitchen: "Oshxona", library: "Kutubxona", basketball: "Basketbol maydoni" };

  const jumpToScene = (index) => {
    const trigger = scrollTimelineRef.current?.scrollTrigger;
    if (trigger) {
      const sceneProgress = [0.03, 0.22, 0.35, 0.52, 0.74, 0.86, 0.97];
      const targetY = trigger.start + (trigger.end - trigger.start) * sceneProgress[index];
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }
  };

  const toggleAutoTour = () => {
    setIsAutoTour((prev) => !prev);
  };

  useEffect(() => {
    if (!isAutoTour) return;
    const interval = setInterval(() => {
      const trigger = scrollTimelineRef.current?.scrollTrigger;
      if (!trigger) return;
      const currentY = window.scrollY;
      if (currentY >= trigger.end - 60) {
        setIsAutoTour(false);
        return;
      }
      window.scrollBy({ top: 3.5, behavior: "auto" });
    }, 28);
    return () => clearInterval(interval);
  }, [isAutoTour]);

  const toggleTourFullscreen = async () => {
    const canvas = mountRef.current;
    if (!canvas) return;
    if (document.fullscreenElement) await document.exitFullscreen();
    else await canvas.requestFullscreen();
  };

  React.useEffect(() => {
    const mount = mountRef.current;
    const section = sectionRef.current;
    if (!mount || !section) return undefined;
    const world = new THREE.Scene();
    world.background = new THREE.Color("#071a2c");
    world.fog = new THREE.Fog("#071a2c", 30, 115);
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 180);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);
    tourState.current.camera = camera;

    const interactiveObjects = [];

    world.add(new THREE.HemisphereLight("#d9edff", "#172b43", 2.2));
    const sun = new THREE.DirectionalLight("#fff1d2", 4);
    sun.position.set(12, 22, 14);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    world.add(sun);

    const materials = {
      ground: new THREE.MeshStandardMaterial({ color: "#b9c9c4", roughness: 0.95 }),
      concrete: new THREE.MeshStandardMaterial({ color: "#dce3e1", roughness: 0.72 }),
      glass: new THREE.MeshPhysicalMaterial({ color: "#5e9bb2", metalness: 0.15, roughness: 0.12, transmission: 0.15, transparent: true, opacity: 0.78 }),
      dark: new THREE.MeshStandardMaterial({ color: "#172d3a", roughness: 0.42 }),
      wood: new THREE.MeshStandardMaterial({ color: "#a8754d", roughness: 0.7 }),
      green: new THREE.MeshStandardMaterial({ color: "#315e4c", roughness: 0.9 }),
      warm: new THREE.MeshStandardMaterial({ color: "#e5aa5e", emissive: "#8f4e1f", emissiveIntensity: 0.55 }),
      white: new THREE.MeshStandardMaterial({ color: "#f7f3e9", roughness: 0.8 }),
      glowCyan: new THREE.MeshBasicMaterial({ color: "#38bdf8", transparent: true, opacity: 0.55 })
    };
    const box = (size, position, material, parent = world) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
      mesh.position.set(...position);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    };
    const cylinder = (radius, height, position, material, parent = world) => {
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 1.08, height, 12), material);
      mesh.position.set(...position);
      mesh.castShadow = true;
      parent.add(mesh);
      return mesh;
    };
    const tree = (x, z, scale = 1) => {
      cylinder(0.13 * scale, 1.4 * scale, [x, 0.7 * scale, z], materials.wood);
      const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(1.05 * scale, 1), materials.green);
      crown.position.set(x, 2 * scale, z);
      crown.castShadow = true;
      world.add(crown);
    };

    box([38, 0.25, 115], [0, -0.15, -29], materials.ground);
    box([5, 0.08, 88], [0, 0.03, -29], materials.concrete);
    for (let x = -17; x <= 17; x += 8) { tree(x, 3, 0.9); tree(x, -19, 0.75); }
    for (let x = -15; x <= 15; x += 6) tree(x, -72, 0.72);

    const campus = new THREE.Group();
    campus.position.z = 0;
    world.add(campus);
    box([24, 6.8, 12], [0, 3.4, 0], materials.concrete, campus);
    box([20, 3, 1.2], [0, 8.3, 0], materials.dark, campus);
    box([24.5, 0.22, 12.5], [0, 0.18, 0], materials.dark, campus);
    box([24.5, 0.22, 12.5], [0, 3.45, 0], materials.dark, campus);
    box([24.5, 0.22, 12.5], [0, 6.8, 0], materials.dark, campus);
    box([12, 1.7, 3.2], [0, 7.3, -6.6], materials.white, campus);
    for (let floor = 0; floor < 2; floor += 1) {
      const y = 2.1 + floor * 3.35;
      for (let x = -9; x <= 9; x += 3) {
        box([1.7, 2.35, 0.14], [x, y, -6.1], materials.glass, campus);
        box([1.95, 0.08, 0.24], [x, y - 1.3, -6.22], materials.dark, campus);
      }
    }
    for (let x = -9; x <= 9; x += 3) {
      box([1.55, 2.2, 0.12], [x, 2.1, 6.08], materials.glass, campus);
      box([1.55, 2.2, 0.12], [x, 5.45, 6.08], materials.glass, campus);
    }
    for (let z = -4; z <= 4; z += 2.4) {
      box([0.12, 2.15, 1.45], [-12.08, 2.1, z], materials.glass, campus);
      box([0.12, 2.15, 1.45], [12.08, 2.1, z], materials.glass, campus);
    }
    box([25.5, 0.35, 13.5], [0, 9.95, 0], materials.dark, campus);
    box([22, 0.22, 10], [0, 10.25, 0], materials.concrete, campus);
    const entrance = new THREE.Group();
    entrance.position.set(0, 2.1, -6.3);
    campus.add(entrance);
    box([1.8, 4.1, 0.16], [-1, 0, 0], materials.glass, entrance);
    box([1.8, 4.1, 0.16], [1, 0, 0], materials.glass, entrance);
    box([0.16, 4.5, 0.3], [0, 0, 0], materials.dark, entrance);
    const doorL = box([0.88, 3.7, 0.1], [-0.48, 0, -0.18], materials.wood, entrance);
    const doorR = box([0.88, 3.7, 0.1], [0.48, 0, -0.18], materials.wood, entrance);
    doorL.geometry.translate(0.44, 0, 0); doorR.geometry.translate(-0.44, 0, 0);
    box([16, 0.12, 5], [0, 0.05, -9], materials.dark, campus);
    for (let x = -7; x <= 7; x += 3.5) box([1.8, 2.8, 0.12], [x, 3.2, -6.12], materials.glass, campus);

    const assetTexture = (path, material, label) => {
      if (!path) {
        console.error(`[CampusTour] Rasm topilmadi: ${label}`);
        return;
      }
      new THREE.TextureLoader().load(path, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        material.map = texture;
        material.needsUpdate = true;
      }, undefined, () => console.error(`[CampusTour] Rasm yuklanmadi: ${label}`));
    };

    // 3D Photo Monoliths / Pylons for Campus Assets (d1 to d6)
    const createPylon = (position, rotationY, assetId) => {
      const asset = allProjectAssets.find((a) => a.id === assetId);
      if (!asset) return;
      const pylon = new THREE.Group();
      pylon.position.set(...position);
      pylon.rotation.y = rotationY;
      world.add(pylon);

      // Base with glowing trim
      box([2.4, 0.25, 0.9], [0, 0.125, 0], materials.dark, pylon);
      const glowGeo = new THREE.PlaneGeometry(2.5, 1.0);
      const glowMesh = new THREE.Mesh(glowGeo, materials.glowCyan);
      glowMesh.rotation.x = Math.PI / 2;
      glowMesh.position.y = 0.02;
      pylon.add(glowMesh);

      // Frame chassis
      const frameHeight = 3.4;
      const frameWidth = 2.3;
      box([frameWidth + 0.16, frameHeight + 0.16, 0.16], [0, frameHeight / 2 + 0.35, 0], materials.dark, pylon);
      box([frameWidth + 0.2, 0.15, 0.2], [0, frameHeight + 0.42, 0], materials.warm, pylon);

      // Photo Mesh with texture
      const photoGeo = new THREE.PlaneGeometry(frameWidth, frameHeight);
      const photoMat = new THREE.MeshStandardMaterial({ color: "#cadbe0", roughness: 0.3, metalness: 0.05 });
      assetTexture(asset.url, photoMat, asset.title);
      const photoMesh = new THREE.Mesh(photoGeo, photoMat);
      photoMesh.position.set(0, frameHeight / 2 + 0.35, 0.09);
      photoMesh.userData = { asset };
      pylon.add(photoMesh);
      interactiveObjects.push(photoMesh);

      // Front glass reflection plate
      const glassMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(frameWidth, frameHeight),
        new THREE.MeshPhysicalMaterial({ color: "#ffffff", transparent: true, opacity: 0.2, roughness: 0.06, transmission: 0.65 })
      );
      glassMesh.position.set(0, frameHeight / 2 + 0.35, 0.11);
      pylon.add(glassMesh);
    };

    createPylon([-4.6, 0, 1.5], 0.28, "d1");
    createPylon([4.6, 0, 1.5], -0.28, "d2");
    createPylon([-5.0, 0, -4.5], 0.2, "d3");
    createPylon([5.0, 0, -4.5], -0.2, "d4");
    createPylon([-5.5, 0, -9.5], 0.15, "d5");
    createPylon([5.5, 0, -9.5], -0.15, "d6");

    const lobby = new THREE.Group();
    world.add(lobby);
    box([14, 5, 10], [0, 2.5, -17], materials.dark, lobby);
    box([11, 0.3, 6], [0, 0.18, -17], materials.wood, lobby);
    box([4.8, 1.2, 1.2], [0, 0.8, -20.5], materials.wood, lobby);
    box([0.35, 2.5, 0.35], [0, 2.25, -20.5], materials.warm, lobby);
    for (let x = -5; x <= 5; x += 2.5) box([1.35, 2.7, 0.08], [x, 2.5, -21.8], materials.glass, lobby);
    for (let x = -4; x <= 4; x += 4) { cylinder(0.35, 0.8, [x, 0.55, -14], materials.wood, lobby); cylinder(0.85, 0.9, [x, 1.3, -14], materials.green, lobby); }

    const roomGroup = new THREE.Group();
    world.add(roomGroup);
    const corridor = new THREE.Group();
    world.add(corridor);
    box([7, 3, 35], [0, 1.5, -49], materials.dark, corridor);
    box([5, 0.1, 30], [0, 3.05, -49], materials.warm, corridor);
    for (let z = -38; z >= -60; z -= 5) box([1.7, 2.2, 0.12], [-3.45, 1.5, z], materials.wood, corridor);

    // 3D Picture Frames along corridor walls
    const createCorridorArt = (x, z, rotationY, assetId) => {
      const asset = allProjectAssets.find((a) => a.id === assetId);
      if (!asset) return;
      const artGroup = new THREE.Group();
      artGroup.position.set(x, 1.8, z);
      artGroup.rotation.y = rotationY;
      corridor.add(artGroup);

      const fWidth = 2.4;
      const fHeight = 1.6;
      box([fWidth + 0.12, fHeight + 0.12, 0.12], [0, 0, 0], materials.dark, artGroup);
      box([fWidth + 0.16, 0.04, 0.16], [0, fHeight / 2 + 0.08, 0], materials.warm, artGroup);

      const photoMat = new THREE.MeshStandardMaterial({ color: "#b9d1d6", roughness: 0.35 });
      assetTexture(asset.url, photoMat, asset.title);
      const photoMesh = new THREE.Mesh(new THREE.PlaneGeometry(fWidth, fHeight), photoMat);
      photoMesh.position.z = 0.07;
      photoMesh.userData = { asset };
      artGroup.add(photoMesh);
      interactiveObjects.push(photoMesh);

      const spotMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.18, 0.25, 8), materials.warm);
      spotMesh.position.set(0, fHeight / 2 + 0.22, 0.12);
      artGroup.add(spotMesh);
    };

    createCorridorArt(-3.4, -41, Math.PI / 2, "k1");
    createCorridorArt(-3.4, -46, Math.PI / 2, "k2");
    createCorridorArt(-3.4, -51, Math.PI / 2, "l1");
    createCorridorArt(-3.4, -56, Math.PI / 2, "l2");
    createCorridorArt(3.4, -41, -Math.PI / 2, "k3");
    createCorridorArt(3.4, -46, -Math.PI / 2, "b1");
    createCorridorArt(3.4, -51, -Math.PI / 2, "b2");
    createCorridorArt(3.4, -56, -Math.PI / 2, "b3");
    createCorridorArt(3.4, -60, -Math.PI / 2, "l3");

    const terrace = new THREE.Group();
    world.add(terrace);
    box([18, 0.3, 13], [0, 0.18, -70], materials.wood, terrace);
    box([18, 3.2, 0.2], [0, 1.8, -76], materials.glass, terrace);
    for (let x = -6; x <= 6; x += 3) { box([1.7, 0.18, 1.7], [x, 1.1, -68], materials.white, terrace); cylinder(0.12, 1.4, [x - 0.65, 0.7, -68], materials.dark, terrace); }
    for (let x = -7; x <= 7; x += 3.5) cylinder(0.28, 1.5, [x, 0.95, -73], materials.green, terrace);

    // High Detail 3D Room Builder
    const buildRoom = (index) => {
      roomGroup.clear();
      const subGroup = new THREE.Group();
      subGroup.position.set(0, 0, -30);
      roomGroup.add(subGroup);

      if (index === 0) {
        buildRoom1Capsule(subGroup);
      } else if (index === 1) {
        buildRoom2Bunk(subGroup);
      } else {
        buildRoom3Twin(subGroup);
      }
    };

    buildRoom(0);
    const changeRoom = (event) => buildRoom(event.detail);
    mount.addEventListener("campus-room-change", changeRoom);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.dampingFactor = 0.06; controls.enablePan = false; controls.enableZoom = false;
    controls.minDistance = 0.1; controls.maxDistance = 0.1; controls.minPolarAngle = 0.22; controls.maxPolarAngle = Math.PI - 0.22; controls.enabled = false;
    tourState.current.controls = controls;

    // Raycasting for clicking 3D picture frames
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let pointerDownCoord = { x: 0, y: 0 };

    const handlePointerMove = (e) => {
      const rect = mount.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(interactiveObjects);
      mount.style.cursor = hits.length > 0 ? "pointer" : "default";
    };

    const handlePointerDown = (e) => {
      pointerDownCoord = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e) => {
      const dist = Math.hypot(e.clientX - pointerDownCoord.x, e.clientY - pointerDownCoord.y);
      if (dist > 6) return;
      const rect = mount.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(interactiveObjects);
      if (hits.length > 0 && hits[0].object.userData?.asset) {
        onOpen3D?.(hits[0].object.userData.asset);
      }
    };

    mount.addEventListener("pointermove", handlePointerMove);
    mount.addEventListener("pointerdown", handlePointerDown);
    mount.addEventListener("pointerup", handlePointerUp);

    const resize = () => {
      const { clientWidth, clientHeight } = mount;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    const scrollTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${window.innerHeight * 5}`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: ({ progress }) => {
          tourState.current.progress = progress;
          const sceneIndex = progress < 0.16 ? 0 : progress < 0.3 ? 1 : progress < 0.42 ? 2 : progress < 0.69 ? 3 : progress < 0.8 ? 4 : progress < 0.91 ? 5 : 6;
          setScene(sceneIndex);
        }
      }
    });
    scrollTimeline.to(tourState.current, { progress: 1, duration: 1, ease: "none" });
    scrollTimelineRef.current = scrollTimeline;
    resize();
    let frame;
    const render = () => {
      const progress = tourState.current.progress;
      const cameraPath = progress < 0.2
        ? { position: [10 - progress * 12, 8 - progress * 8, 15 - progress * 38], target: [0, 2.8, -progress * 45] }
        : progress < 0.42
          ? { position: [0, 2.4, -9 - (progress - 0.2) * 40], target: [0, 2.4, -18] }
          : progress < 0.69
          ? { position: [0, 2, -29.5], target: [0, 2, -31] }
            : { position: [0, 2.2, -48 - (progress - 0.69) * 75], target: [0, 1.7, -55 - (progress - 0.69) * 55] };
      if (!controls.enabled) {
        camera.position.lerp(new THREE.Vector3(...cameraPath.position), 0.065);
        camera.lookAt(...cameraPath.target);
      } else {
        controls.target.set(0, 2, -30);
        controls.update();
      }
      const doorProgress = THREE.MathUtils.clamp((progress - 0.12) / 0.18, 0, 1);
      doorL.rotation.y = -doorProgress * 1.2; doorR.rotation.y = doorProgress * 1.2;
      controls.enabled = progress > 0.42 && progress < 0.69;
      renderer.render(world, camera);
      frame = requestAnimationFrame(render);
    };
    render();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      mount.removeEventListener("pointermove", handlePointerMove);
      mount.removeEventListener("pointerdown", handlePointerDown);
      mount.removeEventListener("pointerup", handlePointerUp);
      scrollTimeline.scrollTrigger?.kill();
      scrollTimeline.kill();
      mount.removeEventListener("campus-room-change", changeRoom);
      controls.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  React.useEffect(() => {
    tourState.current.room = room;
    const event = new CustomEvent("campus-room-change", { detail: room });
    mountRef.current?.dispatchEvent(event);
  }, [room]);

  const currentRoomAsset = allProjectAssets.find((a) => a.id === `room${room + 1}`);

  return (
    <section className="campus-tour" id="tour" ref={sectionRef}>
      <div className="campus-stage">
        <div className="campus-canvas" ref={mountRef} />
        <div className="campus-vignette" />
        <div className="campus-topbar">
          <span className="campus-logo">TPU / <b>TALABALAR SHAHARCHASI</b></span>
          <span>{String(scene + 1).padStart(2, "0")} / 07</span>
        </div>
        <div className="campus-copy">
          <span className="tour-kicker">Talabalar shaharchasi bo‘ylab sayohat</span>
          <h2>{["Talabalar shaharchasidagi yangi manzil", "Uyimizga yaqinroq", "Ichkariga qadam qo‘ying", "Hamjihatlik yo‘lagi", "Sizning xonangiz, sizning nigohingiz", "Talabalar hayoti uchun yaratilgan", "Ochiq havodagi terassa"][scene]}</h2>
          <p>{["Toshkent Perfect University talabalar turar joyiga kirish uchun aylantiring.", "Me’moriy ko‘rinish har bir detal bilan ochiladi.", "Qabulxona, xavfsizlik va lobbidagi yorug‘lik bo‘ylab yuring.", "Xonalar, umumiy oshxona, o‘quv xonasi va basketbol maydonidan o‘ting.", "Markazdan turib talabalar xonasini 360° ko‘ring.", "Oshxona, kutubxona, dam olish va umumiy joylar.", "Kampus ustidagi rezidentlar uchun maxsus terassa."][scene]}</p>
        </div>

        {scene === 4 && (
          <button
            className="enter-360-btn"
            onClick={() => onOpen3D?.(currentRoomAsset, "sphere")}
            title="Xonani to‘liq 360° sferada ko‘rish"
          >
            <RotateCw size={16} /> Xonani 360° / 3D fazoda ko‘rish
          </button>
        )}

        <div className="campus-asset-wall" aria-label="Virtual tur rasmlari">
          {visibleAssets.map(({ group, entries }) => (
            <div className="campus-asset-group" key={group}>
              <span className="campus-asset-title">
                {assetLabels[group]}
                <small>3D ko‘rish uchun bosing</small>
              </span>
              <div className="campus-asset-grid">
                {entries.map(([name, path]) => {
                  const assetObj = allProjectAssets.find((a) => a.id === name || a.url === path);
                  return path ? (
                    <figure
                      key={name}
                      className={group === "rooms" && name === `room${room + 1}` ? "selected" : ""}
                      onClick={() => onOpen3D?.(assetObj || { url: path, title: `${assetLabels[group]} ${name}`, group })}
                      title={`${assetLabels[group]} - 3D ko‘rinishda ochish`}
                    >
                      <img src={path} alt={`${assetLabels[group]} ${name}`} loading="eager" />
                      <span className="asset-3d-pill"><Box size={9} /> 3D</span>
                      <figcaption>{name}</figcaption>
                    </figure>
                  ) : (
                    <figure key={name} className="missing-asset">
                      <figcaption>{name} — rasm topilmadi</figcaption>
                    </figure>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {scene === 3 && (
          <div className="campus-room-picker" aria-label="Xona tanlash">
            {roomNames.map((name, index) => (
              <button
                key={name}
                className={room === index ? "active" : ""}
                onClick={() => setRoom(index)}
              >
                {name}
                <small>Xona 0{index + 1}</small>
              </button>
            ))}
          </div>
        )}

        {/* 3D SCENE NAVIGATION PILLS */}
        <div className="campus-scenes-nav">
          {locations.map((loc, idx) => (
            <button
              key={loc}
              className={`scene-pill ${scene === idx ? "active" : ""}`}
              onClick={() => jumpToScene(idx)}
            >
              <span className="pill-num">0{idx + 1}</span>
              <span>{loc}</span>
            </button>
          ))}
          <button
            className={`scene-pill auto-pill ${isAutoTour ? "active" : ""}`}
            onClick={toggleAutoTour}
            title={isAutoTour ? "Avtomatik sayohatni to‘xtatish" : "Avtomatik sayohatni yoqish"}
          >
            <Play size={12} fill={isAutoTour ? "currentColor" : "none"} /> {isAutoTour ? "To‘xtatish" : "Avto sayohat"}
          </button>
          <button
            className="scene-pill gallery-pill"
            onClick={() => onOpen3D?.(allProjectAssets[0])}
            title="Barcha rasmlarni 3D fazoda ko‘rish"
          >
            <Sparkles size={12} /> Barcha 3D rasmlar
          </button>
        </div>

        <div className="campus-location"><span className="location-dot" /> {locations[scene]}</div>
        <div className="campus-scroll-hint"><span className="scroll-line" /> <span>Ko‘rish uchun pastga aylantiring</span></div>
        <div className="campus-progress"><span style={{ width: `${((scene + 1) / 7) * 100}%` }} /></div>
        <div className="campus-controls-note">
          {scene === 4 ? "360° da ko‘rish" : "Aylantirish orqali sayohat"}
          <span>↕</span>
          <button onClick={toggleTourFullscreen} aria-label="To‘liq ekran">⛶</button>
        </div>
      </div>
    </section>
  );
}

function RoomDetails({ room, closeDetails, openBooking }) {
  const roomIndex = Math.max(0, Math.min(2, (room?.id ? room.id - 1 : 0)));

  return (
    <div className="room-detail-backdrop" onClick={closeDetails}>
      <div
        className="room-detail-modal tour-open"
        role="dialog"
        aria-modal="true"
        aria-labelledby="room-detail-title"
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "94vw",
          maxWidth: 1280,
          height: "88vh",
          padding: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          position: "relative"
        }}
      >
        <button
          className="modal-close"
          onClick={closeDetails}
          aria-label="Yopish"
          style={{ zIndex: 100, position: "absolute", top: 16, right: 16 }}
        >
          <X />
        </button>
        <div style={{ flex: 1, position: "relative", width: "100%", height: "100%" }}>
          <SingleRoom3DCanvas
            roomIndex={roomIndex}
            onBookRoom={(meta) => {
              closeDetails();
              openBooking({ title: meta?.name || room?.title || "Xona", price: meta?.price || room?.price || "$120" });
            }}
            isFullScrollMode={false}
          />
        </div>
      </div>
    </div>
  );
}

function Image3DInspector({ asset, onClose, onSelectAsset }) {
  const mountRef = useRef(null);
  const [mode, setMode] = useState(asset?.defaultMode || "card");
  const [wireframe, setWireframe] = useState(false);
  const [theme, setTheme] = useState("night");
  const [autoRotate, setAutoRotate] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);

  const currentIndex = allProjectAssets.findIndex((a) => a.url === asset?.url || a.id === asset?.id);
  const currentAsset = currentIndex !== -1 ? allProjectAssets[currentIndex] : asset;
  const groupAssets = allProjectAssets.filter((a) => a.group === currentAsset?.group);

  const prevAsset = () => {
    if (currentIndex <= 0) {
      onSelectAsset(allProjectAssets[allProjectAssets.length - 1]);
    } else {
      onSelectAsset(allProjectAssets[currentIndex - 1]);
    }
  };

  const nextAsset = () => {
    if (currentIndex >= allProjectAssets.length - 1) {
      onSelectAsset(allProjectAssets[0]);
    } else {
      onSelectAsset(allProjectAssets[currentIndex + 1]);
    }
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prevAsset();
      if (e.key === "ArrowRight") nextAsset();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(theme === "night" ? "#040d1a" : "#0f2038");

    const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.8;
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight(theme === "night" ? "#1e293b" : "#ffffff", theme === "night" ? 1.4 : 2.0);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(theme === "night" ? "#38bdf8" : "#fffbeb", theme === "night" ? 2.5 : 3.2);
    mainLight.position.set(5, 8, 7);
    scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(theme === "night" ? "#f59e0b" : "#93c5fd", 1.8);
    rimLight.position.set(-6, -4, -5);
    scene.add(rimLight);

    const pointLight = new THREE.PointLight(theme === "night" ? "#0284c7" : "#fef08a", 2.2, 20);
    pointLight.position.set(0, 0, 4);
    scene.add(pointLight);

    let cardGroup = null;

    const loader = new THREE.TextureLoader();
    loader.load(currentAsset?.url, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;

      if (mode === "sphere") {
        camera.position.set(0, 0, 0.01);
        controls.rotateSpeed = -0.3;
        controls.enableZoom = true;
        controls.minDistance = 0.01;
        controls.maxDistance = 10;
        const sphereGeo = new THREE.SphereGeometry(60, 64, 40);
        sphereGeo.scale(-1, 1, 1);
        const sphereMat = new THREE.MeshBasicMaterial({ map: texture, wireframe });
        const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
        scene.add(sphereMesh);
      } else if (mode === "curved") {
        camera.position.set(0, 0, 0);
        controls.rotateSpeed = -0.28;
        const radius = 7.5;
        const arc = Math.PI * 0.85;
        const height = 5.2;
        const curveGeo = new THREE.CylinderGeometry(radius, radius, height, 64, 1, true, -arc / 2, arc);
        curveGeo.scale(-1, 1, 1);
        const curveMat = new THREE.MeshBasicMaterial({ map: texture, wireframe, side: THREE.DoubleSide });
        const curveMesh = new THREE.Mesh(curveGeo, curveMat);
        scene.add(curveMesh);
      } else {
        camera.position.set(0, 0, 5.8);
        controls.rotateSpeed = 0.6;
        controls.enableZoom = true;
        controls.minDistance = 2.5;
        controls.maxDistance = 14;

        cardGroup = new THREE.Group();
        scene.add(cardGroup);

        const imgWidth = 4.8;
        const imgHeight = 3.2;

        const chassisGeo = new THREE.BoxGeometry(imgWidth + 0.16, imgHeight + 0.16, 0.22);
        const chassisMat = new THREE.MeshStandardMaterial({
          color: theme === "night" ? "#0a192f" : "#1e293b",
          metalness: 0.85,
          roughness: 0.2,
          wireframe
        });
        const chassis = new THREE.Mesh(chassisGeo, chassisMat);
        cardGroup.add(chassis);

        const photoGeo = new THREE.PlaneGeometry(imgWidth, imgHeight);
        const photoMat = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.25,
          metalness: 0.08,
          wireframe
        });
        const photoMesh = new THREE.Mesh(photoGeo, photoMat);
        photoMesh.position.z = 0.115;
        cardGroup.add(photoMesh);

        const glassGeo = new THREE.PlaneGeometry(imgWidth, imgHeight);
        const glassMat = new THREE.MeshPhysicalMaterial({
          color: "#ffffff",
          transparent: true,
          opacity: 0.18,
          roughness: 0.04,
          transmission: 0.7,
          reflectivity: 0.9
        });
        const glassMesh = new THREE.Mesh(glassGeo, glassMat);
        glassMesh.position.z = 0.135;
        cardGroup.add(glassMesh);

        const rimGeo = new THREE.RingGeometry(2.35, 2.42, 4);
        const rimMat = new THREE.MeshBasicMaterial({ color: "#38bdf8", side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
        const rimMesh = new THREE.Mesh(rimGeo, rimMat);
        rimMesh.position.z = 0.12;
        rimMesh.scale.set(imgWidth / 4.7, imgHeight / 4.7, 1);
        cardGroup.add(rimMesh);

        const backBadgeGeo = new THREE.PlaneGeometry(1.6, 0.8);
        const backBadgeMat = new THREE.MeshStandardMaterial({ color: "#d8b27b", metalness: 0.8, roughness: 0.3 });
        const backBadge = new THREE.Mesh(backBadgeGeo, backBadgeMat);
        backBadge.rotation.y = Math.PI;
        backBadge.position.z = -0.115;
        cardGroup.add(backBadge);
      }
    });

    const resize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    let mousePos = { x: 0, y: 0 };
    const handlePointerMove = (e) => {
      const rect = mount.getBoundingClientRect();
      mousePos.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mousePos.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    mount.addEventListener("pointermove", handlePointerMove);

    let frame;
    const animate = () => {
      controls.update();
      if (mode === "card" && cardGroup) {
        if (!controls.state || controls.state === -1) {
          cardGroup.rotation.y += (mousePos.x * 0.25 - cardGroup.rotation.y) * 0.05;
          cardGroup.rotation.x += (-mousePos.y * 0.18 - cardGroup.rotation.x) * 0.05;
        }
      }
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      mount.removeEventListener("pointermove", handlePointerMove);
      controls.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [currentAsset?.url, mode, wireframe, theme, autoRotate]);

  const changeZoom = (delta) => {
    setZoom((old) => {
      const next = Math.min(2.2, Math.max(0.6, Number((old + delta).toFixed(2))));
      if (cameraRef.current) {
        cameraRef.current.zoom = next;
        cameraRef.current.updateProjectionMatrix();
      }
      return next;
    });
  };

  const resetZoom = () => {
    setZoom(1);
    if (cameraRef.current) {
      cameraRef.current.zoom = 1;
      cameraRef.current.updateProjectionMatrix();
    }
    controlsRef.current?.reset();
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  return (
    <div className="image-3d-modal-backdrop" onClick={onClose}>
      <div className={`image-3d-modal ${isFullscreen ? "is-fullscreen" : ""}`} onClick={(e) => e.stopPropagation()}>
        <div className="image-3d-topbar">
          <div className="image-3d-title-group">
            <span className="cat-badge">{assetLabels[currentAsset?.group] || currentAsset?.group || "TPU 3D"}</span>
            <div>
              <h3>{currentAsset?.title || "3D Ko‘rinish"}</h3>
              <small>{currentAsset?.subtitle || "Fazoviy 3D ko‘rinish va panorama"}</small>
            </div>
          </div>

          <div className="image-3d-modes">
            <button
              className={`image-3d-mode-btn ${mode === "card" ? "active" : ""}`}
              onClick={() => setMode("card")}
            >
              <Box size={14} /> 3D Kartochka
            </button>
            <button
              className={`image-3d-mode-btn ${mode === "sphere" ? "active" : ""}`}
              onClick={() => setMode("sphere")}
            >
              <RotateCw size={14} /> 360° Sfera
            </button>
            <button
              className={`image-3d-mode-btn ${mode === "curved" ? "active" : ""}`}
              onClick={() => setMode("curved")}
            >
              <Layers size={14} /> Qavariq Ekran
            </button>
          </div>

          <div className="image-3d-actions">
            <button className="image-3d-icon-btn" onClick={toggleFullscreen} title="To‘liq ekran">
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button className="image-3d-icon-btn image-3d-close-btn" onClick={onClose} title="Yopish (Esc)">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="image-3d-viewport">
          <div className="image-3d-canvas-wrap" ref={mountRef} />

          <div className="image-3d-hint">
            <Sparkles size={13} color="#38bdf8" />
            <span>{mode === "sphere" ? "Sichqoncha yoki barmoq bilan 360° aylantiring" : "3D fazoda erkin aylantiring va yaqinlashtiring"}</span>
          </div>

          <button className="image-3d-nav-arrow image-3d-nav-prev" onClick={prevAsset} title="Oldingi rasm">
            <ChevronLeft size={22} />
          </button>
          <button className="image-3d-nav-arrow image-3d-nav-next" onClick={nextAsset} title="Keyingi rasm">
            <ChevronRight size={22} />
          </button>
        </div>

        <div className="image-3d-bottombar">
          <div className="image-3d-tools">
            <button
              className={`image-3d-tool-toggle ${autoRotate ? "active" : ""}`}
              onClick={() => setAutoRotate((r) => !r)}
              title="Avtomatik aylanish"
            >
              <RotateCw size={13} /> Avto-aylanish: {autoRotate ? "ON" : "OFF"}
            </button>
            <button
              className={`image-3d-tool-toggle ${wireframe ? "active" : ""}`}
              onClick={() => setWireframe((w) => !w)}
              title="3D to‘r (wireframe) ko‘rinishi"
            >
              <Grid size={13} /> 3D To‘r
            </button>
            <button
              className="image-3d-tool-toggle"
              onClick={() => setTheme((t) => (t === "night" ? "day" : "night"))}
              title="Yorug‘lik amansiyasi"
            >
              {theme === "night" ? <Moon size={13} /> : <Sun size={13} />} {theme === "night" ? "Neon Tun" : "Kunduzgi"}
            </button>

            <div className="image-3d-zoom-group">
              <button onClick={() => changeZoom(-0.15)} title="Uzoqlashtirish">−</button>
              <span>{Math.round(zoom * 100)}%</span>
              <button onClick={() => changeZoom(0.15)} title="Yaqinlashtirish">+</button>
              <button onClick={resetZoom} title="Tiklash">↺</button>
            </div>
          </div>

          <div className="image-3d-strip">
            {groupAssets.map((item) => (
              <div
                key={item.id}
                className={`image-3d-strip-thumb ${item.id === currentAsset?.id ? "active" : ""}`}
                onClick={() => onSelectAsset(item)}
                title={item.title}
              >
                <img src={item.url} alt={item.title} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PanoramaViewer({ room, onExit }) {
  const mountRef = useRef(null);
  const viewerRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  React.useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1100);
    camera.position.set(0, 0, 0.01);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = -0.25;
    controls.minPolarAngle = 0.08;
    controls.maxPolarAngle = Math.PI - 0.08;
    const geometry = new THREE.SphereGeometry(50, 64, 40);
    geometry.scale(-1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const panorama = new THREE.Mesh(geometry, material);
    scene.add(panorama);
    const loader = new THREE.TextureLoader();
    const panoramaSource = tourAssets.rooms[`room${room.id}`] || room.panorama || room.gallery[0];
    loader.load(panoramaSource, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      material.map = texture;
      material.needsUpdate = true;
    }, undefined, () => console.error(`[PanoramaViewer] Failed to load ${panoramaSource}`));
    const resize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    let frame;
    const render = () => {
      controls.update();
      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    };
    render();
    viewerRef.current = { camera, controls, renderer };
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      controls.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (material.map) material.map.dispose();
      mount.removeChild(renderer.domElement);
      viewerRef.current = null;
    };
  }, [room]);

  React.useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const changeZoom = (amount) => {
    setZoom((current) => {
      const next = Math.min(2, Math.max(0.7, Number((current + amount).toFixed(1))));
      if (viewerRef.current) {
        viewerRef.current.camera.fov = 75 / next;
        viewerRef.current.camera.updateProjectionMatrix();
      }
      return next;
    });
  };

  

  const jumpToHotspot = (azimuth, elevation = 0) => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    viewer.controls.reset();
    viewer.controls.rotateLeft(azimuth);
    viewer.controls.rotateUp(elevation);
    viewer.controls.update();
  };

  const toggleFullscreen = async () => {
    if (!mountRef.current) return;
    if (document.fullscreenElement) await document.exitFullscreen();
    else await mountRef.current.requestFullscreen();
    setIsFullscreen(Boolean(document.fullscreenElement));
  };

  return (
    <div className={`panorama-viewer ${isFullscreen ? "is-fullscreen" : ""}`} ref={mountRef}>
      <div className="panorama-overlay">
        <span className="panorama-badge">360° HAQIQIY KO‘RINISH</span>
        <span className="panorama-help">Suring: aylantirish · Teging: ko‘rish</span>
      </div>
      <div className="panorama-hotspots" aria-label="Xona nuqtalari">
        <button onClick={() => jumpToHotspot(1.2, 0.1)} title="Yotoqlar">Yotoqlar</button>
        <button onClick={() => jumpToHotspot(-1.3, 0)} title="O‘qish stoli">Stol</button>
        <button onClick={() => jumpToHotspot(3, -0.1)} title="Deraza">Deraza</button>
      </div>
      <div className="panorama-controls">
        <button onClick={() => changeZoom(0.15)} aria-label="Yaqinlashtirish">+</button>
        <span>{Math.round(zoom * 100)}%</span>
        <button onClick={() => changeZoom(-0.15)} aria-label="Uzoqlashtirish">−</button>
        <button onClick={() => setZoom(1)} aria-label="Zoomni tiklash">↺</button>
        <button onClick={toggleFullscreen} aria-label="To‘liq ekran">⛶</button>
        <button onClick={onExit} aria-label="360° rejimdan chiqish">×</button>
      </div>
    </div>
  );
}



function Benefit({ icon: Icon, title, text }) {
  const benefitIndex = ["Hamyonbop narxlar", "24/7 xavfsizlik", "Bepul Wi-Fi", "Qulay joylashuv"].indexOf(title);
  const direction = benefitIndex % 2 === 0 ? "benefit-from-left" : "benefit-from-right";
  return <div className={`benefit ${direction}`} style={{ "--benefit-index": benefitIndex }}><span className="benefit-icon"><Icon size={24} strokeWidth={2.2} fill={title.includes("Wi-Fi") ? "none" : "currentColor"} /></span><div className="benefit-copy"><b>{title}</b><small>{text}</small></div><span className="benefit-arrow">↗</span></div>;
}

export default App;
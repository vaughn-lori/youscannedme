import { useState, useRef, useEffect } from "react";

// ─── Design tokens ────────────────────────────────────────────────────────────
// Palette: deep navy ink, warm blush, electric coral accent, off-white canvas
// Type: Playfair Display (display), DM Sans (body)
// Signature: the QR code itself treated as art — large, centered, framed in blush

const TAGLINES = [
  { id: "t1", text: "This is either a terrible idea or a great story." },
  { id: "t2", text: "You look like someone who scans QR codes." },
  { id: "t3", text: "YOU FOUND ME. Curiosity rewarded." },
  { id: "t4", text: "Scan if you're single. No pressure. (Some pressure.)" },
  { id: "t5", text: "Bold move. Let's see where this goes." },
  { id: "t6", text: "I put a QR code on a bag. You scanned it. We're basically dating." },
  { id: "t7", text: "Shoot your shot. I clearly already did." },
  { id: "t8", text: "This was brave. Of both of us." },
  { id: "t9", text: "Single. Verified. Mildly chaotic. Interested?" },
  { id: "t10", text: "The audacity of this QR code is the point." },
  { id: "custom", text: "" },
];

// Lori's pre-generated QR (points to youscannedme.com/lori)
const LORI_QR = "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";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --ink: #12112A;
    --blush: #F0C4C4;
    --coral: #D95F5F;
    --canvas: #FDF8F3;
    --muted: #8A8599;
    --white: #FFFFFF;
    --border: #EDE8E1;
    --bubble: #FFF5F5;
  }
  body { background: var(--canvas); color: var(--ink); font-family: 'DM Sans', sans-serif; min-height: 100vh; }
  .page { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem 1.25rem; }

  /* NAV */
  .nav { width: 100%; max-width: 600px; display: flex; justify-content: space-between; align-items: center; padding: 0 0 1.5rem; }
  .nav-logo { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-style: italic; color: var(--coral); text-decoration: none; }
  .nav-link { font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); text-decoration: none; font-weight: 500; }
  .nav-link:hover { color: var(--coral); }

  /* CARD */
  .card { background: var(--white); border-radius: 24px; padding: 2.5rem 2rem; max-width: 440px; width: 100%; box-shadow: 0 4px 32px rgba(18,17,42,0.07); }

  /* HOME PAGE */
  .home-eyebrow { font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--coral); font-weight: 600; margin-bottom: 0.75rem; }
  .home-h1 { font-family: 'Playfair Display', serif; font-size: 2.6rem; line-height: 1.1; margin-bottom: 0.75rem; }
  .home-h1 em { font-style: italic; color: var(--coral); }
  .home-sub { color: var(--muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 2rem; }
  .home-cta { display: block; width: 100%; padding: 1rem; background: var(--ink); color: var(--white); border: none; border-radius: 14px; font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.2s, transform 0.15s; text-align: center; }
  .home-cta:hover { background: var(--coral); transform: translateY(-1px); }
  .home-divider { border: none; border-top: 1.5px solid var(--border); margin: 1.75rem 0; }
  .home-lori-link { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--muted); justify-content: center; text-decoration: none; }
  .home-lori-link span { color: var(--coral); font-weight: 500; }

  /* PROFILE PAGE */
  .profile-tagline { font-family: 'Playfair Display', serif; font-size: 1.3rem; line-height: 1.4; margin-bottom: 0.4rem; font-style: italic; }
  .profile-name { font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--coral); font-weight: 600; margin-bottom: 1.75rem; }
  .profile-ig { display: inline-flex; align-items: center; gap: 0.5rem; background: var(--ink); color: white; text-decoration: none; font-size: 0.85rem; font-weight: 500; padding: 0.65rem 1.4rem; border-radius: 100px; transition: background 0.2s; margin-bottom: 0.4rem; }
  .profile-ig:hover { background: var(--coral); }
  .profile-ig-hint { font-size: 0.72rem; color: var(--muted); margin-bottom: 1.75rem; display: block; }
  .profile-form-head { font-family: 'Playfair Display', serif; font-size: 1rem; margin-bottom: 0.2rem; }
  .profile-form-sub { font-size: 0.8rem; color: var(--muted); margin-bottom: 1.25rem; }
  label.field-label { display: block; font-size: 0.7rem; letter-spacing: 0.13em; text-transform: uppercase; color: var(--muted); font-weight: 500; margin-bottom: 0.3rem; margin-top: 0.9rem; }
  input.field, textarea.field { width: 100%; padding: 0.7rem 0.9rem; border: 1.5px solid var(--border); border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; background: var(--bubble); color: var(--ink); outline: none; transition: border-color 0.2s; }
  input.field:focus, textarea.field:focus { border-color: var(--coral); }
  textarea.field { resize: vertical; min-height: 80px; }
  .submit-btn { width: 100%; margin-top: 1.25rem; padding: 0.85rem; background: var(--coral); color: white; border: none; border-radius: 12px; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: background 0.2s, transform 0.15s; }
  .submit-btn:hover { background: #c04f4f; transform: translateY(-1px); }
  .fine-print { font-size: 0.68rem; color: #ccc; margin-top: 0.85rem; line-height: 1.5; }
  .success-box { text-align: center; padding: 1rem 0; }
  .success-box .emoji { font-size: 2.25rem; display: block; margin-bottom: 0.5rem; }
  .success-box p { color: var(--muted); font-size: 0.9rem; line-height: 1.6; }
  hr.divider { border: none; border-top: 1.5px solid var(--border); margin: 1.5rem 0; }

  /* CREATE PAGE */
  .create-h1 { font-family: 'Playfair Display', serif; font-size: 2rem; line-height: 1.2; margin-bottom: 0.4rem; }
  .create-h1 em { color: var(--coral); font-style: italic; }
  .create-sub { font-size: 0.9rem; color: var(--muted); line-height: 1.6; margin-bottom: 1.75rem; }
  .tagline-grid { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 0.75rem; }
  .tagline-option { padding: 0.75rem 1rem; border: 1.5px solid var(--border); border-radius: 10px; font-size: 0.85rem; cursor: pointer; transition: border-color 0.2s, background 0.2s; line-height: 1.4; text-align: left; background: var(--bubble); color: var(--ink); font-family: 'DM Sans', sans-serif; }
  .tagline-option.selected { border-color: var(--coral); background: #FFF0F0; }
  .tagline-option:hover:not(.selected) { border-color: var(--blush); }

  /* QR CARD OUTPUT */
  .qr-output { text-align: center; }
  .qr-card-preview { display: inline-block; background: white; border: 2.5px solid var(--blush); border-radius: 20px; padding: 2rem 1.75rem; margin: 1.25rem 0; box-shadow: 0 4px 24px rgba(18,17,42,0.08); }
  .qr-card-top { font-family: 'Playfair Display', serif; font-size: 1.15rem; font-style: italic; margin-bottom: 0.2rem; line-height: 1.35; }
  .qr-card-arrow { color: var(--coral); font-size: 1.1rem; display: block; margin: 0.5rem 0; }
  .qr-card-img { display: block; width: 180px; height: 180px; margin: 0 auto; }
  .qr-card-badge { display: inline-block; background: var(--ink); color: white; font-size: 0.8rem; font-weight: 600; padding: 0.35rem 1rem; border-radius: 100px; margin-top: 0.85rem; letter-spacing: 0.08em; }
  .qr-card-sub { font-family: 'Playfair Display', serif; font-style: italic; font-size: 0.85rem; color: var(--coral); margin-top: 0.5rem; }
  .download-btn { display: inline-block; padding: 0.75rem 1.75rem; background: var(--ink); color: white; border: none; border-radius: 12px; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 600; cursor: pointer; text-decoration: none; transition: background 0.2s; margin: 0.35rem; }
  .download-btn:hover { background: var(--coral); }
  .download-btn.secondary { background: transparent; border: 1.5px solid var(--ink); color: var(--ink); }
  .download-btn.secondary:hover { background: var(--ink); color: white; }
  .url-chip { background: var(--bubble); border: 1.5px solid var(--blush); border-radius: 8px; padding: 0.6rem 1rem; font-size: 0.85rem; color: var(--coral); font-weight: 500; margin-top: 0.75rem; display: inline-block; }
  .step-label { font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); font-weight: 600; margin-bottom: 1rem; display: block; }
  .back-link { font-size: 0.8rem; color: var(--muted); cursor: pointer; text-decoration: underline; display: inline-block; margin-bottom: 1rem; }
  .back-link:hover { color: var(--coral); }
`;

// ─── Inline QR generator using a simple matrix approach via canvas ────────────
function generateQRDataURL(text) {
  // We'll use the Anthropic API to get a QR or just construct a URL
  // For the demo, we generate a placeholder and note they need real QR lib
  // In production this would call an API; for now return a data URL using
  // the Google Charts QR API pattern rendered via an img
  return `https://api.qrserver.com/v1/create-qr-code/?size=540x540&data=${encodeURIComponent(text)}&color=12112A&bgcolor=FFFFFF&margin=2`;
}

// ─── Pages ────────────────────────────────────────────────────────────────────

function HomePage({ onNavigate }) {
  return (
    <div className="page">
      <nav className="nav">
        <span className="nav-logo">youscannedme</span>
        <a className="nav-link" onClick={() => onNavigate("create")} style={{cursor:"pointer"}}>Make yours →</a>
      </nav>
      <div className="card">
        <p className="home-eyebrow">The dating app that fits in your pocket</p>
        <h1 className="home-h1">Put yourself <em>out there.</em> Literally.</h1>
        <p className="home-sub">
          A QR code on your bag, your jacket, your coffee cup — whatever.
          Someone scans it. They land on your page. They shoot their shot.
          You decide what happens next.
        </p>
        <button className="home-cta" onClick={() => onNavigate("create")}>
          Make my QR page →
        </button>
        <hr className="home-divider" />
        <a className="home-lori-link" onClick={() => onNavigate("lori")} style={{cursor:"pointer"}}>
          See an example: <span>youscannedme.com/lori</span>
        </a>
      </div>
    </div>
  );
}

function ProfilePage({ profile, onNavigate }) {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");

  const p = profile || {
    name: "Lori",
    slug: "lori",
    ig: "curlier_lori",
    email: "lori@example.com",
    tagline: "This is either a terrible idea or a great story.",
  };

  function handleSubmit() {
    if (!name || !contact) { alert("Name and a way to reach you — that's the minimum. 💌"); return; }
    const subject = encodeURIComponent(`Someone scanned your bag 👀 — ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nContact: ${contact}\n\nMessage:\n${message || "(They let their audacity speak for itself.)"}`);
    window.location.href = `mailto:${p.email}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  return (
    <div className="page">
      <nav className="nav">
        <span className="nav-logo">youscannedme</span>
        <a className="nav-link" onClick={() => onNavigate("create")} style={{cursor:"pointer"}}>Make yours →</a>
      </nav>
      <div className="card" style={{textAlign:"center"}}>
        <p className="profile-tagline">"{p.tagline}"</p>
        <p className="profile-name">— {p.name}</p>

        {p.ig && (
          <>
            <a className="profile-ig" href={`https://instagram.com/${p.ig}`} target="_blank" rel="noopener noreferrer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              @{p.ig}
            </a>
            <span className="profile-ig-hint">Do your due diligence. She'll wait.</span>
          </>
        )}

        <hr className="divider" />

        {!submitted ? (
          <>
            <p className="profile-form-head">Or shoot your shot right here.</p>
            <p className="profile-form-sub">Please use your powers for good.</p>
            <label className="field-label">Your name</label>
            <input className="field" type="text" placeholder="First name is fine" value={name} onChange={e=>setName(e.target.value)} />
            <label className="field-label">Your number or IG</label>
            <input className="field" type="text" placeholder="How should they reach you?" value={contact} onChange={e=>setContact(e.target.value)} />
            <label className="field-label">Your opener</label>
            <textarea className="field" placeholder="Don't overthink it. You scanned a QR code on someone's bag. That's already the bit." value={message} onChange={e=>setMessage(e.target.value)} />
            <button className="submit-btn" onClick={handleSubmit}>Send it 🎯</button>
            <p className="fine-print">Goes straight to {p.name}. No algorithms. No middlemen. Just you and your audacity.</p>
          </>
        ) : (
          <div className="success-box">
            <span className="emoji">🎉</span>
            <p><strong>Delivered.</strong><br />Bold move. {p.name} respects it.<br />Check your DMs.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CreatePage({ onNavigate, onCreated }) {
  const [step, setStep] = useState(1); // 1=form, 2=result
  const [firstName, setFirstName] = useState("");
  const [slug, setSlug] = useState("");
  const [ig, setIg] = useState("");
  const [email, setEmail] = useState("");
  const [selectedTagline, setSelectedTagline] = useState("t1");
  const [customTagline, setCustomTagline] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [profile, setProfile] = useState(null);

  const chosenTagline = selectedTagline === "custom" ? customTagline : TAGLINES.find(t => t.id === selectedTagline)?.text;

  function handleCreate() {
    if (!firstName || !email) { alert("We need at least your name and email."); return; }
    if (selectedTagline === "custom" && !customTagline) { alert("Add your custom tagline or pick one from the list."); return; }
    const cleanSlug = slug || firstName.toLowerCase().replace(/\s+/g, "");
    const pageUrl = `https://youscannedme.com/${cleanSlug}`;
    const qr = generateQRDataURL(pageUrl);
    const newProfile = { name: firstName, slug: cleanSlug, ig: ig.replace("@",""), email, tagline: chosenTagline };
    setQrUrl(qr);
    setProfile(newProfile);
    setStep(2);
  }

  function downloadCard() {
    // Open printable card in new tab
    const html = buildPrintableCard(profile, qrUrl);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  }

  if (step === 2 && profile) {
    const pageUrl = `https://youscannedme.com/${profile.slug}`;
    return (
      <div className="page">
        <nav className="nav">
          <span className="nav-logo">youscannedme</span>
          <span className="back-link" onClick={() => setStep(1)}>← Start over</span>
        </nav>
        <div className="card qr-output">
          <span className="step-label">✓ Your page is ready</span>
          <p style={{fontFamily:"'Playfair Display',serif", fontSize:"1.5rem", marginBottom:"0.35rem"}}>
            Here you go, <em style={{color:"var(--coral)"}}>{profile.name}.</em>
          </p>
          <p style={{fontSize:"0.85rem", color:"var(--muted)", marginBottom:"0.5rem"}}>
            Your page URL:
          </p>
          <div className="url-chip">{pageUrl}</div>

          <div className="qr-card-preview">
            <p className="qr-card-top">"{profile.tagline}"</p>
            <span className="qr-card-arrow">⬇️</span>
            <img className="qr-card-img" src={qrUrl} alt="Your QR code" crossOrigin="anonymous" />
            <div className="qr-card-badge">Single.</div>
            <p className="qr-card-sub">Please use your powers for good.</p>
          </div>

          <div>
            <button className="download-btn" onClick={downloadCard}>Open print-ready card</button>
            <button className="download-btn secondary" onClick={() => onNavigate("profile", profile)}>Preview my page →</button>
          </div>

          <hr className="divider" />
          <p style={{fontSize:"0.78rem", color:"var(--muted)", lineHeight:"1.6"}}>
            <strong>To go live:</strong> Buy youscannedme.com, host this on Vercel, and your page will be live at <strong>{pageUrl}</strong>. The QR above already points there — print it and go.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <nav className="nav">
        <span className="nav-logo">youscannedme</span>
        <a className="nav-link" onClick={() => onNavigate("home")} style={{cursor:"pointer"}}>← Home</a>
      </nav>
      <div className="card">
        <h1 className="create-h1">Make your <em>own</em> page.</h1>
        <p className="create-sub">Takes two minutes. Gets you a QR card to print and a live page where people can shoot their shot.</p>

        <label className="field-label">Your first name *</label>
        <input className="field" type="text" placeholder="Lori" value={firstName} onChange={e=>setFirstName(e.target.value)} />

        <label className="field-label">Your URL slug (optional)</label>
        <input className="field" type="text" placeholder={firstName ? firstName.toLowerCase() : "yourname"} value={slug} onChange={e=>setSlug(e.target.value.toLowerCase().replace(/\s+/g,""))} />
        <p style={{fontSize:"0.7rem", color:"var(--muted)", marginTop:"0.25rem"}}>youscannedme.com/<strong>{slug || (firstName ? firstName.toLowerCase() : "yourname")}</strong></p>

        <label className="field-label">Instagram handle</label>
        <input className="field" type="text" placeholder="@yourhandle" value={ig} onChange={e=>setIg(e.target.value)} />

        <label className="field-label">Your email (for receiving messages) *</label>
        <input className="field" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />

        <label className="field-label" style={{marginTop:"1.25rem"}}>Pick your tagline *</label>
        <div className="tagline-grid">
          {TAGLINES.filter(t => t.id !== "custom").map(t => (
            <button key={t.id} className={`tagline-option${selectedTagline === t.id ? " selected" : ""}`} onClick={() => setSelectedTagline(t.id)}>
              {t.text}
            </button>
          ))}
          <button className={`tagline-option${selectedTagline === "custom" ? " selected" : ""}`} onClick={() => setSelectedTagline("custom")}>
            ✏️ Write my own…
          </button>
        </div>
        {selectedTagline === "custom" && (
          <input className="field" type="text" placeholder="This is your moment. Make it good." value={customTagline} onChange={e=>setCustomTagline(e.target.value)} style={{marginTop:"0.25rem"}} />
        )}

        <button className="submit-btn" onClick={handleCreate} style={{marginTop:"1.5rem"}}>
          Generate my page + QR card →
        </button>
        <p className="fine-print">No account needed. No data sold. Just vibes and QR codes.</p>
      </div>
    </div>
  );
}

function buildPrintableCard(profile, qrUrl) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>QR Card — ${profile.name}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=DM+Sans:wght@400;600&display=swap');
body { background: #f5f0eb; display:flex; align-items:center; justify-content:center; min-height:100vh; margin:0; font-family:'DM Sans',sans-serif; }
.card { background:white; width:340px; padding:2.5rem 2rem; border-radius:20px; text-align:center; box-shadow:0 8px 40px rgba(0,0,0,0.08); }
.tagline { font-family:'Playfair Display',serif; font-size:1.2rem; font-style:italic; line-height:1.35; margin-bottom:0.5rem; color:#12112A; }
.arrow { color:#D95F5F; font-size:1.2rem; display:block; margin:0.75rem 0; }
.qr { width:200px; height:200px; display:block; margin:0 auto; border:2.5px solid #F0C4C4; border-radius:12px; padding:6px; }
.badge { display:inline-block; background:#12112A; color:white; font-size:0.85rem; font-weight:600; padding:0.4rem 1.1rem; border-radius:100px; margin-top:1rem; }
.sub { font-family:'Playfair Display',serif; font-style:italic; font-size:0.9rem; color:#D95F5F; margin-top:0.6rem; }
@media print { body{background:white;} .card{box-shadow:none;} }
</style>
</head>
<body>
<div class="card">
  <p class="tagline">"${profile.tagline}"</p>
  <span class="arrow">⬇️</span>
  <img class="qr" src="${qrUrl}" alt="QR code" />
  <div class="badge">Single.</div>
  <p class="sub">Please use your powers for good.</p>
</div>
</body>
</html>`;
}

// ─── App router ───────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [activeProfile, setActiveProfile] = useState(null);

  function navigate(to, profile = null) {
    setPage(to);
    if (profile) setActiveProfile(profile);
  }

  const loriProfile = {
    name: "Lori",
    slug: "lori",
    ig: "curlier_lori",
    email: "lori@example.com",
    tagline: "This is either a terrible idea or a great story.",
  };

  return (
    <>
      <style>{STYLES}</style>
      {page === "home" && <HomePage onNavigate={navigate} />}
      {page === "lori" && <ProfilePage profile={loriProfile} onNavigate={navigate} />}
      {page === "profile" && <ProfilePage profile={activeProfile} onNavigate={navigate} />}
      {page === "create" && <CreatePage onNavigate={navigate} onCreated={(p) => navigate("profile", p)} />}
    </>
  );
}

import { useEffect, useRef, useState, useCallback } from "react";

// ─── Utility ────────────────────────────────────────────────────────────────
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const invLerp = (a, b, v) => clamp((v - a) / (b - a), 0, 1);
const mapRange = (v, a, b, c, d) => lerp(c, d, invLerp(a, b, v));

// ─── Scene Config ────────────────────────────────────────────────────────────
const SCENES = [
  {
    id: "intro",
    title: "Before the Storm",
    subtitle: "2019 — The World Was Open",
    palette: { bg: "#e8f4e8", sky: "#b8ddb8", ground: "#7ab87a", accent: "#2d6a2d" },
    bodyColor: "#f4c994",
    shirtColor: "#4a90d9",
    pantsColor: "#2c3e50",
    mood: "free",
  },
  {
    id: "lockdown",
    title: "The World Shrinks",
    subtitle: "March 2020 — The Lockdown",
    palette: { bg: "#f0e6d3", sky: "#c9b99a", ground: "#8b7355", accent: "#5c4a32" },
    bodyColor: "#f4c994",
    shirtColor: "#7f8c8d",
    pantsColor: "#2c3e50",
    mood: "isolated",
  },
  {
    id: "digital",
    title: "Screens Become Life",
    subtitle: "Mid 2020 — Forced Digital Adoption",
    palette: { bg: "#1a1a2e", sky: "#16213e", ground: "#0f3460", accent: "#e94560" },
    bodyColor: "#f4c994",
    shirtColor: "#533483",
    pantsColor: "#1a1a2e",
    mood: "focused",
  },
  {
    id: "habit",
    title: "The Loop Forms",
    subtitle: "2021 — Habit Crystallizes",
    palette: { bg: "#0d0d1a", sky: "#0a0a14", ground: "#1a0a2e", accent: "#ff6b35" },
    bodyColor: "#f4c994",
    shirtColor: "#2d1b69",
    pantsColor: "#0d0d1a",
    mood: "addicted",
  },
  {
    id: "postcovid",
    title: "Everything at Once",
    subtitle: "2022 — Post-COVID Chaos",
    palette: { bg: "#1a0a0a", sky: "#2d0000", ground: "#1a1a00", accent: "#ffd700" },
    bodyColor: "#f4c994",
    shirtColor: "#8b0000",
    pantsColor: "#1a1a00",
    mood: "overwhelmed",
  },
  {
    id: "ai",
    title: "The AI Companion",
    subtitle: "2024 — Cognitive Offloading",
    palette: { bg: "#050510", sky: "#020208", ground: "#080818", accent: "#00d4ff" },
    bodyColor: "#f4c994",
    shirtColor: "#003366",
    pantsColor: "#050510",
    mood: "dependent",
  },
  {
    id: "reflection",
    title: "Who Am I Now?",
    subtitle: "A Moment of Stillness",
    palette: { bg: "#0a0a0a", sky: "#000000", ground: "#111111", accent: "#ffffff" },
    bodyColor: "#f4c994",
    shirtColor: "#222222",
    pantsColor: "#111111",
    mood: "reflective",
  },
];

// ─── SVG Character ────────────────────────────────────────────────────────────
function ArjunCharacter({ progress, mood, bodyColor, shirtColor, pantsColor, globalProgress }) {
  // Posture morphing based on mood
  const postures = {
    free:        { spineAngle: 0,   headTilt: 0,   shoulderDrop: 0,   armLeft: -30, armRight: 30,  legSpread: 15, eyeOpen: 1,   mouthCurve: 6,  phoneScale: 0,   laptopScale: 0   },
    isolated:    { spineAngle: -5,  headTilt: -8,  shoulderDrop: 4,   armLeft: -10, armRight: 10,  legSpread: 5,  eyeOpen: 0.7, mouthCurve: -4, phoneScale: 0.3, laptopScale: 0   },
    focused:     { spineAngle: 12,  headTilt: 15,  shoulderDrop: 6,   armLeft: 5,   armRight: -5,  legSpread: 0,  eyeOpen: 0.9, mouthCurve: 0,  phoneScale: 0.5, laptopScale: 0.7 },
    addicted:    { spineAngle: 22,  headTilt: 25,  shoulderDrop: 10,  armLeft: 15,  armRight: -15, legSpread: -5, eyeOpen: 0.5, mouthCurve: -2, phoneScale: 1,   laptopScale: 0.4 },
    overwhelmed: { spineAngle: 8,   headTilt: 5,   shoulderDrop: 8,   armLeft: -25, armRight: 25,  legSpread: 10, eyeOpen: 1.1, mouthCurve: -8, phoneScale: 0.8, laptopScale: 0.8 },
    dependent:   { spineAngle: 15,  headTilt: 18,  shoulderDrop: 5,   armLeft: 10,  armRight: -10, legSpread: 0,  eyeOpen: 0.8, mouthCurve: 2,  phoneScale: 0.6, laptopScale: 0.5 },
    reflective:  { spineAngle: 0,   headTilt: -5,  shoulderDrop: 2,   armLeft: -5,  armRight: 5,   legSpread: 8,  eyeOpen: 1.2, mouthCurve: 3,  phoneScale: 0,   laptopScale: 0   },
  };

  const currentPosture = postures[mood] || postures.free;

  const sa = currentPosture.spineAngle;
  const ht = currentPosture.headTilt;
  const sd = currentPosture.shoulderDrop;
  const eo = currentPosture.eyeOpen;
  const mc = currentPosture.mouthCurve;
  const ls = currentPosture.legSpread;
  const ps = currentPosture.phoneScale;
  const laps = currentPosture.laptopScale;

  // Breathing animation
  const breathe = Math.sin(Date.now() * 0.001) * 1.5;

  return (
    <g>
      {/* Shadow */}
      <ellipse cx="0" cy="118" rx={22 - Math.abs(sa) * 0.3} ry="5" fill="rgba(0,0,0,0.2)" />

      {/* Body group rotated by spine angle */}
      <g transform={`rotate(${sa}, 0, 60)`}>
        {/* Pants / Legs */}
        <rect x={-8 + ls * 0.3} y="70" width="7" height="46" rx="3.5"
          fill={pantsColor} transform={`rotate(${ls * 0.5}, -4, 70)`} />
        <rect x={1 - ls * 0.3} y="70" width="7" height="46" rx="3.5"
          fill={pantsColor} transform={`rotate(${-ls * 0.5}, 4, 70)`} />
        {/* Shoes */}
        <ellipse cx={-4 + ls * 0.5} cy="117" rx="6" ry="3" fill="#1a1a1a" transform={`rotate(${ls * 0.5}, -4, 117)`} />
        <ellipse cx={4 - ls * 0.5} cy="117" rx="6" ry="3" fill="#1a1a1a" transform={`rotate(${-ls * 0.5}, 4, 117)`} />

        {/* Torso */}
        <rect x="-12" y={30 + breathe * 0.3} width="24" height={42 - sd}
          rx="4" fill={shirtColor} />

        {/* Left arm */}
        <g transform={`rotate(${currentPosture.armLeft}, -12, 38)`}>
          <rect x="-18" y="36" width="7" height="28" rx="3.5" fill={bodyColor} />
          <circle cx="-14.5" cy="65" r="4" fill={bodyColor} />
        </g>

        {/* Right arm */}
        <g transform={`rotate(${currentPosture.armRight}, 12, 38)`}>
          <rect x="11" y="36" width="7" height="28" rx="3.5" fill={bodyColor} />
          <circle cx="14.5" cy="65" r="4" fill={bodyColor} />
        </g>

        {/* Phone in right hand */}
        {ps > 0.05 && (
          <g transform={`rotate(${currentPosture.armRight}, 12, 38) translate(11, 62) scale(${ps})`}>
            <rect x="0" y="0" width="10" height="17" rx="2" fill="#222" />
            <rect x="1" y="1" width="8" height="13" rx="1" fill="#4fc3f7" opacity="0.8" />
            <rect x="3" y="15" width="4" height="1" rx="0.5" fill="#555" />
          </g>
        )}

        {/* Laptop in lap (for seated/hunched poses) */}
        {laps > 0.1 && (
          <g transform={`translate(-14, ${55 + sd * 0.5}) scale(${laps})`}>
            <rect x="0" y="0" width="28" height="18" rx="2" fill="#333" />
            <rect x="1" y="1" width="26" height="14" rx="1" fill="#1a6fa8" opacity="0.9" />
            <rect x="-2" y="18" width="32" height="3" rx="1" fill="#222" />
          </g>
        )}

        {/* Neck */}
        <rect x="-4" y="22" width="8" height="10" rx="3" fill={bodyColor} />

        {/* Head (tilts with head tilt) */}
        <g transform={`rotate(${ht}, 0, 22)`}>
          {/* Head shape */}
          <ellipse cx="0" cy="10" rx="14" ry="16" fill={bodyColor} />
          {/* Hair */}
          <path d="M -13 6 Q -10 -12 0 -14 Q 10 -12 13 6 Q 8 -4 0 -5 Q -8 -4 -13 6Z"
            fill="#2c1a0e" />
          {/* Eyes */}
          <ellipse cx="-5" cy="9" rx="3" ry={3 * eo} fill="#fff" />
          <ellipse cx="5" cy="9" rx="3" ry={3 * eo} fill="#fff" />
          <circle cx="-5" cy="9" r={1.5 * eo} fill="#2c1a0e" />
          <circle cx="5" cy="9" r={1.5 * eo} fill="#2c1a0e" />
          {/* Eyebrows */}
          <path d={`M -8 ${4 + (mood === 'overwhelmed' ? -2 : 0)} Q -5 ${2 + (mood === 'free' ? -1 : 1)} -2 ${4 + (mood === 'overwhelmed' ? -2 : 0)}`}
            stroke="#2c1a0e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d={`M 2 ${4 + (mood === 'overwhelmed' ? -2 : 0)} Q 5 ${2 + (mood === 'free' ? -1 : 1)} 8 ${4 + (mood === 'overwhelmed' ? -2 : 0)}`}
            stroke="#2c1a0e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          {/* Mouth */}
          <path d={`M -5 ${17} Q 0 ${17 + mc} 5 ${17}`}
            stroke="#8b5e3c" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          {/* Ear */}
          <ellipse cx="-14" cy="10" rx="3" ry="4" fill={bodyColor} />
          <ellipse cx="14" cy="10" rx="3" ry="4" fill={bodyColor} />

          {/* Thought bubble for reflective */}
          {mood === 'reflective' && (
            <g>
              <circle cx="20" cy="-5" r="3" fill="rgba(255,255,255,0.3)" />
              <circle cx="28" cy="-12" r="5" fill="rgba(255,255,255,0.3)" />
              <circle cx="38" cy="-20" r="8" fill="rgba(255,255,255,0.25)" />
              <text x="32" y="-17" fontSize="7" fill="rgba(255,255,255,0.8)" textAnchor="middle">?</text>
            </g>
          )}
        </g>
      </g>
    </g>
  );
}

// ─── Floating Notification ────────────────────────────────────────────────────
function FloatingNotif({ x, y, text, icon, delay, color }) {
  return (
    <div style={{
      position: "absolute", left: x, top: y,
      background: "rgba(0,0,0,0.85)",
      border: `1px solid ${color}40`,
      borderRadius: "12px",
      padding: "8px 14px",
      display: "flex", alignItems: "center", gap: "8px",
      fontSize: "12px", color: "#fff",
      backdropFilter: "blur(12px)",
      animation: `floatNotif 3s ease-in-out ${delay}s infinite`,
      boxShadow: `0 4px 20px ${color}30`,
      whiteSpace: "nowrap",
      zIndex: 10,
    }}>
      <span style={{ fontSize: "16px" }}>{icon}</span>
      <span style={{ opacity: 0.9, fontFamily: "'DM Sans', sans-serif", fontSize: "11px" }}>{text}</span>
    </div>
  );
}

// ─── Scene Environment ────────────────────────────────────────────────────────
function SceneEnvironment({ scene, progress }) {
  const { palette, id } = scene;

  if (id === "intro") return (
    <g>
      {/* Sun */}
      <circle cx="300" cy="80" r="45" fill="#ffd54f" opacity="0.9" />
      <g stroke="#ffd54f" strokeWidth="2" opacity="0.5">
        {[0,45,90,135,180,225,270,315].map(a => (
          <line key={a}
            x1={300 + Math.cos(a * Math.PI / 180) * 55}
            y1={80 + Math.sin(a * Math.PI / 180) * 55}
            x2={300 + Math.cos(a * Math.PI / 180) * 70}
            y2={80 + Math.sin(a * Math.PI / 180) * 70}
          />
        ))}
      </g>
      {/* Clouds */}
      <g fill="white" opacity="0.8">
        <ellipse cx="100" cy="70" rx="40" ry="20" />
        <ellipse cx="130" cy="60" rx="30" ry="22" />
        <ellipse cx="80" cy="65" rx="28" ry="18" />
      </g>
      <g fill="white" opacity="0.6">
        <ellipse cx="480" cy="90" rx="35" ry="18" />
        <ellipse cx="505" cy="80" rx="25" ry="20" />
      </g>
      {/* Trees */}
      {[50, 500, 520].map((tx, i) => (
        <g key={i}>
          <rect x={tx - 5} y="260" width="10" height="40" fill="#795548" />
          <circle cx={tx} cy="240" r="30" fill="#388e3c" />
          <circle cx={tx - 15} cy="255" r="22" fill="#43a047" />
          <circle cx={tx + 15} cy="255" r="22" fill="#2e7d32" />
        </g>
      ))}
      {/* Birds */}
      {[{x:200,y:50},{x:220,y:40},{x:380,y:60}].map((b,i) => (
        <path key={i} d={`M ${b.x} ${b.y} Q ${b.x+8} ${b.y-5} ${b.x+16} ${b.y}`}
          stroke="#2d6a2d" strokeWidth="1.5" fill="none" />
      ))}
    </g>
  );

  if (id === "lockdown") return (
    <g>
      {/* Indoor room walls */}
      <rect x="60" y="40" width="480" height="330" fill="#d4c4a8" rx="4" />
      <rect x="60" y="40" width="480" height="8" fill="#bfae94" />
      {/* Wallpaper pattern */}
      {Array.from({length: 8}).map((_, i) =>
        Array.from({length: 5}).map((__, j) => (
          <circle key={`${i}-${j}`} cx={80 + i*65} cy={60 + j*55} r="2"
            fill="#c4b49a" opacity="0.4" />
        ))
      )}
      {/* Window */}
      <rect x="160" y="70" width="120" height="100" fill="#87ceeb" rx="3" />
      <rect x="160" y="70" width="120" height="100" fill="none"
        stroke="#8b7355" strokeWidth="4" rx="3" />
      <line x1="220" y1="70" x2="220" y2="170" stroke="#8b7355" strokeWidth="3" />
      <line x1="160" y1="120" x2="280" y2="120" stroke="#8b7355" strokeWidth="3" />
      {/* Curtains */}
      <path d="M 155 65 Q 170 120 160 175" stroke="#9c7a5a" strokeWidth="12"
        fill="none" strokeLinecap="round" />
      <path d="M 285 65 Q 270 120 280 175" stroke="#9c7a5a" strokeWidth="12"
        fill="none" strokeLinecap="round" />
      {/* Grey sky through window */}
      <rect x="163" y="73" width="114" height="94" fill="#b0b8c0" opacity="0.5" />
      {/* Rain on window */}
      {Array.from({length: 8}).map((_, i) => (
        <line key={i} x1={170 + i*14} y1="75" x2={168 + i*14} y2="115"
          stroke="#7090a0" strokeWidth="1" opacity="0.4" />
      ))}
      {/* Floor */}
      <rect x="60" y="340" width="480" height="30" fill="#c4a882" />
      {/* Floor lines */}
      {[120,180,240,300,360,420,480].map(x => (
        <line key={x} x1={x} y1="340" x2={x} y2="370" stroke="#b8997a" strokeWidth="1" />
      ))}
    </g>
  );

  if (id === "digital") return (
    <g>
      {/* Dark room */}
      <rect x="60" y="40" width="480" height="330" fill="#0d0d1a" rx="4" />
      {/* Desk */}
      <rect x="80" y="290" width="440" height="20" rx="4" fill="#1a1a2e" />
      <rect x="120" y="310" width="12" height="60" rx="3" fill="#16213e" />
      <rect x="468" y="310" width="12" height="60" rx="3" fill="#16213e" />
      {/* Monitor glow */}
      <rect x="180" y="160" width="240" height="140" rx="8" fill="#0a0a1a" />
      <rect x="185" y="165" width="230" height="128" rx="5" fill="#0d2137" />
      {/* Screen content */}
      <rect x="190" y="170" width="220" height="8" rx="2" fill="#1a6fa8" opacity="0.7" />
      {[0,1,2,3,4,5,6].map(i => (
        <rect key={i} x="190" y={182 + i * 14} width={80 + Math.random() * 80} height="6"
          rx="2" fill="#1a4a6a" opacity="0.5" />
      ))}
      {/* Monitor stand */}
      <rect x="290" y="300" width="20" height="20" rx="2" fill="#111" />
      <rect x="260" y="318" width="80" height="6" rx="3" fill="#111" />
      {/* Screen glow effect */}
      <ellipse cx="300" cy="250" rx="130" ry="80"
        fill="url(#screenGlow)" opacity="0.15" />
      <defs>
        <radialGradient id="screenGlow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#4fc3f7" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
    </g>
  );

  if (id === "habit") return (
    <g>
      {/* Very dark */}
      <rect x="60" y="40" width="480" height="330" fill="#080810" rx="4" />
      {/* Scattered device glows */}
      {[{x:100,y:180,w:60,h:40},{x:430,y:200,w:50,h:35},{x:150,y:280,w:70,h:45}].map((d,i) => (
        <g key={i}>
          <rect x={d.x} y={d.y} width={d.w} height={d.h} rx="4" fill="#0a0a20" />
          <rect x={d.x+2} y={d.y+2} width={d.w-4} height={d.h-4} rx="3" fill="#0d1a3a" />
          <ellipse cx={d.x + d.w/2} cy={d.y + d.h/2}
            rx={d.w * 0.6} ry={d.h * 0.6}
            fill="#3a2fa0" opacity="0.12" />
        </g>
      ))}
      {/* App icons grid */}
      {[-3,-1,1,3].map(col =>
        [-2,0,2].map(row => (
          <g key={`${col}-${row}`} transform={`translate(${300+col*50}, ${200+row*50})`}
            opacity="0.25">
            <rect x="-15" y="-15" width="30" height="30" rx="8"
              fill={['#e74c3c','#3498db','#2ecc71','#f39c12','#9b59b6','#1abc9c',
                     '#e67e22','#34495e','#e91e63','#00bcd4','#ff5722','#607d8b'][Math.abs(col)+Math.abs(row)]||'#444'} />
          </g>
        ))
      )}
      {/* Notification dots */}
      {[{cx:340,cy:120},{cx:250,cy:150},{cx:400,cy:180}].map((d,i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r="5" fill="#e74c3c"
          opacity="0.6" />
      ))}
    </g>
  );

  if (id === "postcovid") return (
    <g>
      {/* Chaotic environment */}
      <rect x="60" y="40" width="480" height="330" fill="#100808" rx="4" />
      {/* Multiple overlapping screens */}
      {[
        {x:70,y:80,w:160,h:100,color:"#1a0000"},
        {x:380,y:60,w:140,h:90,color:"#001a00"},
        {x:200,y:250,w:200,h:90,color:"#1a1a00"},
      ].map((s,i) => (
        <g key={i}>
          <rect x={s.x} y={s.y} width={s.w} height={s.h} rx="6" fill={s.color} />
          <rect x={s.x+2} y={s.y+2} width={s.w-4} height={s.h-4} rx="5"
            fill={`${s.color}80`} />
          {Array.from({length:4}).map((_,j) => (
            <rect key={j} x={s.x+8} y={s.y+12+j*16} width={s.w-16-j*10} height="6"
              rx="2" fill="rgba(255,255,255,0.08)" />
          ))}
        </g>
      ))}
      {/* Calendar chaos */}
      <text x="100" y="210" fontSize="9" fill="#ff6b35" opacity="0.6"
        fontFamily="monospace">
        09:00 Standup | 10:30 Review | 11:00 1:1...
      </text>
      {/* Speed lines */}
      {Array.from({length:6}).map((_,i) => (
        <line key={i} x1="0" y1={120+i*30} x2="600" y2={120+i*30}
          stroke="#ffffff" strokeWidth="0.5" opacity="0.03" />
      ))}
    </g>
  );

  if (id === "ai") return (
    <g>
      {/* Deep space digital */}
      <rect x="60" y="40" width="480" height="330" fill="#020208" rx="4" />
      {/* AI interface orb */}
      <defs>
        <radialGradient id="aiOrb" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#0077aa" stopOpacity="0.2" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="400" cy="180" r="70" fill="url(#aiOrb)" />
      <circle cx="400" cy="180" r="55" fill="none" stroke="#00d4ff" strokeWidth="1" opacity="0.4" />
      <circle cx="400" cy="180" r="40" fill="none" stroke="#00d4ff" strokeWidth="0.5" opacity="0.6" />
      {/* AI text suggestions */}
      {[
        {x:340,y:140,w:120,t:"Summarizing…"},
        {x:330,y:168,w:140,t:"Generating reply…"},
        {x:345,y:196,w:110,t:"Decision made ✓"},
      ].map((l,i) => (
        <g key={i}>
          <rect x={l.x} y={l.y-10} width={l.w} height="14" rx="7"
            fill="#003344" opacity="0.7" />
          <text x={l.x+8} y={l.y} fontSize="7" fill="#00d4ff" opacity="0.9"
            fontFamily="monospace">{l.t}</text>
        </g>
      ))}
      {/* Connection lines from Arjun to AI */}
      <line x1="200" y1="200" x2="340" y2="180"
        stroke="#00d4ff" strokeWidth="1" opacity="0.3" strokeDasharray="4,4" />
      {/* Constellation dots */}
      {Array.from({length:20}).map((_,i) => (
        <circle key={i} cx={70 + (i*27)%500} cy={50 + (i*37)%310}
          r={0.5 + (i%3)*0.5} fill="#00d4ff" opacity="0.3" />
      ))}
    </g>
  );

  if (id === "reflection") return (
    <g>
      {/* Pure void */}
      <rect x="0" y="0" width="600" height="420" fill="#000" />
      {/* Spotlight */}
      <defs>
        <radialGradient id="spotlight" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="300" cy="240" rx="200" ry="160" fill="url(#spotlight)" />
      {/* Faint timeline */}
      <line x1="60" y1="380" x2="540" y2="380" stroke="#ffffff" strokeWidth="0.5" opacity="0.1" />
      {["2019","2020","2021","2022","2023","2024"].map((y,i) => (
        <g key={y}>
          <circle cx={80 + i * 90} cy="380" r="3" fill="#ffffff" opacity="0.15" />
          <text x={80 + i * 90} y="396" fontSize="7" fill="#ffffff"
            opacity="0.2" textAnchor="middle" fontFamily="monospace">{y}</text>
        </g>
      ))}
    </g>
  );

  return <rect x="60" y="40" width="480" height="330" fill={palette.bg} />;
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [sceneProgress, setSceneProgress] = useState(0);
  const [blendFactor, setBlendFactor] = useState(0);
  const rafRef = useRef(null);
  const lastScrollRef = useRef(0);
  const [tick, setTick] = useState(0);

  // For breathing animation
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 50);
    return () => clearInterval(id);
  }, []);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const total = el.scrollHeight - el.clientHeight;
    const raw = el.scrollTop / total;
    const progress = clamp(raw, 0, 1);

    const sceneCount = SCENES.length;
    const sceneSize = 1 / sceneCount;
    const sceneIdx = Math.min(Math.floor(progress / sceneSize), sceneCount - 1);
    const sp = invLerp(sceneIdx * sceneSize, (sceneIdx + 1) * sceneSize, progress);

    setScrollProgress(progress);
    setCurrentSceneIndex(sceneIdx);
    setSceneProgress(sp);
    lastScrollRef.current = el.scrollTop;
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scene = SCENES[currentSceneIndex];
  const nextScene = SCENES[Math.min(currentSceneIndex + 1, SCENES.length - 1)];

  // Blend colors between scenes
  const blendColor = (c1, c2, t) => {
    if (!c1 || !c2) return c1 || "#000";
    const parse = hex => {
      const r = parseInt(hex.slice(1,3),16);
      const g = parseInt(hex.slice(3,5),16);
      const b = parseInt(hex.slice(5,7),16);
      return [r,g,b];
    };
    const [r1,g1,b1] = parse(c1);
    const [r2,g2,b2] = parse(c2);
    const blend = sceneProgress > 0.7 ? (sceneProgress - 0.7) / 0.3 : 0;
    return `rgb(${Math.round(lerp(r1,r2,blend))},${Math.round(lerp(g1,g2,blend))},${Math.round(lerp(b1,b2,blend))})`;
  };

  const bgColor = blendColor(scene.palette.bg, nextScene.palette.bg, sceneProgress);

  // Character X position: walk in from sides
  const charX = 300 + mapRange(sceneProgress, 0, 0.3, -20, 0) *
    (currentSceneIndex % 2 === 0 ? 1 : -1);

  // Ground Y
  const groundY = currentSceneIndex === 0 ? 370 :
                  currentSceneIndex <= 1 ? 370 :
                  330; // seated for digital+ scenes

  // Parallax offset
  const parallaxOffset = scrollProgress * -40;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500&family=DM+Mono&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --accent: ${scene.palette.accent};
          --bg: ${bgColor};
        }

        body { background: #000; overflow: hidden; }

        .scroll-container {
          position: fixed; inset: 0;
          overflow-y: scroll;
          scroll-behavior: auto;
        }

        .scroll-spacer {
          height: ${SCENES.length * 120}vh;
        }

        .cinematic-frame {
          position: fixed; inset: 0;
          display: flex; flex-direction: column;
          background: ${bgColor};
          transition: background 0.8s ease;
          overflow: hidden;
        }

        /* Top bar */
        .top-bar {
          position: absolute; top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg,
            transparent,
            ${scene.palette.accent},
            transparent
          );
          z-index: 100;
        }

        /* Progress bar */
        .progress-bar {
          position: absolute; top: 0; left: 0;
          height: 3px;
          width: ${scrollProgress * 100}%;
          background: ${scene.palette.accent};
          z-index: 101;
          transition: width 0.1s linear;
          box-shadow: 0 0 10px ${scene.palette.accent};
        }

        /* Scene counter */
        .scene-counter {
          position: absolute; top: 20px; right: 20px;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: ${scene.palette.accent};
          opacity: 0.7;
          z-index: 50;
          letter-spacing: 3px;
        }

        /* Scene title */
        .scene-title-container {
          position: absolute; bottom: 60px; left: 0; right: 0;
          text-align: center;
          z-index: 50;
          pointer-events: none;
        }

        .scene-era {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 5px;
          text-transform: uppercase;
          color: ${scene.palette.accent};
          opacity: 0.8;
          margin-bottom: 8px;
        }

        .scene-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 4vw, 52px);
          font-weight: 700;
          color: ${currentSceneIndex >= 2 ? '#ffffff' : '#1a1a1a'};
          line-height: 1.1;
          opacity: ${sceneProgress < 0.15 ? sceneProgress / 0.15 : sceneProgress > 0.85 ? (1 - sceneProgress) / 0.15 : 1};
          transform: translateY(${sceneProgress < 0.15 ? (1 - sceneProgress / 0.15) * 20 : 0}px);
          transition: opacity 0.3s, transform 0.3s;
          text-shadow: ${currentSceneIndex >= 2 ? '0 0 40px rgba(255,255,255,0.1)' : 'none'};
        }

        /* Scroll hint */
        .scroll-hint {
          position: absolute; bottom: 20px; left: 50%;
          transform: translateX(-50%);
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 3px;
          color: ${scene.palette.accent};
          opacity: ${scrollProgress < 0.05 ? 1 : 0};
          transition: opacity 0.5s;
          display: flex; flex-direction: column; align-items: center; gap: 6px;
        }

        .scroll-arrow {
          width: 1px; height: 30px;
          background: linear-gradient(${scene.palette.accent}, transparent);
          animation: scrollArrow 1.5s ease-in-out infinite;
        }

        /* Notifications */
        .notif-layer {
          position: absolute; inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 20;
        }

        @keyframes floatNotif {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @keyframes scrollArrow {
          0%, 100% { opacity: 0; transform: scaleY(0.5); }
          50% { opacity: 1; transform: scaleY(1); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }

        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }

        /* Scanline overlay for digital scenes */
        .scanlines {
          position: absolute; inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.03) 2px,
            rgba(0,0,0,0.03) 4px
          );
          pointer-events: none;
          z-index: 5;
          opacity: ${currentSceneIndex >= 2 ? 1 : 0};
          transition: opacity 1s;
        }

        /* Vignette */
        .vignette {
          position: absolute; inset: 0;
          background: radial-gradient(
            ellipse at center,
            transparent 40%,
            rgba(0,0,0,${0.2 + currentSceneIndex * 0.08}) 100%
          );
          pointer-events: none;
          z-index: 6;
        }

        /* Scene dots navigation */
        .scene-dots {
          position: absolute; left: 20px; top: 50%;
          transform: translateY(-50%);
          display: flex; flex-direction: column; gap: 12px;
          z-index: 50;
        }

        .scene-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s;
        }

        /* Habit-mode clutter */
        .app-grid {
          position: absolute; inset: 0;
          pointer-events: none;
          z-index: 15;
          opacity: ${currentSceneIndex === 3 ? Math.min(sceneProgress * 2, 0.6) : currentSceneIndex > 3 ? 0.3 : 0};
          transition: opacity 1s;
        }

        /* AI orb */
        .ai-orb {
          position: absolute; right: 80px; top: 50%;
          transform: translateY(-50%);
          width: 140px; height: 140px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,212,255,0.15), transparent);
          border: 1px solid rgba(0,212,255,0.3);
          animation: pulse 3s ease-in-out infinite;
          display: flex; align-items: center; justify-content: center;
          z-index: 20;
          opacity: ${currentSceneIndex === 5 ? Math.min(sceneProgress * 3, 1) : currentSceneIndex > 5 ? 0.5 : 0};
          transition: opacity 0.8s;
        }

        .ai-orb-inner {
          width: 80px; height: 80px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,212,255,0.3), transparent);
          border: 1px solid rgba(0,212,255,0.5);
        }

        /* Reflection overlay text */
        .reflection-text {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          z-index: 30;
          opacity: ${currentSceneIndex === 6 ? Math.min(sceneProgress * 5, 1) : 0};
          transition: opacity 1s;
          pointer-events: none;
          padding: 0 40px;
          text-align: center;
        }

        .reflection-quote {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: clamp(14px, 2vw, 22px);
          color: rgba(255,255,255,0.6);
          line-height: 1.7;
          max-width: 480px;
          margin-bottom: 20px;
        }

        .reflection-cta {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 4px;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
          margin-top: 30px;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 10px 20px;
          border-radius: 2px;
        }

        /* Scene-specific tints */
        .color-overlay {
          position: absolute; inset: 0;
          pointer-events: none;
          z-index: 4;
        }

        .ground-plane {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 30%;
          z-index: 3;
        }
      `}</style>

      {/* Scroll container */}
      <div className="scroll-container" ref={containerRef}>
        <div className="scroll-spacer" />
      </div>

      {/* Fixed cinematic frame */}
      <div className="cinematic-frame" style={{ pointerEvents: "none" }}>
        <div className="top-bar" />
        <div className="progress-bar" />
        <div className="scanlines" />
        <div className="vignette" />

        {/* Scene counter */}
        <div className="scene-counter">
          {String(currentSceneIndex + 1).padStart(2,"0")} / {String(SCENES.length).padStart(2,"0")}
        </div>

        {/* Scene navigation dots */}
        <div className="scene-dots">
          {SCENES.map((s, i) => (
            <div key={s.id} className="scene-dot" style={{
              background: i === currentSceneIndex ? s.palette.accent : "rgba(255,255,255,0.2)",
              boxShadow: i === currentSceneIndex ? `0 0 8px ${s.palette.accent}` : "none",
              transform: i === currentSceneIndex ? "scale(1.5)" : "scale(1)",
            }} />
          ))}
        </div>

        {/* Main SVG stage */}
        <svg viewBox="0 0 600 420" style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          zIndex: 10,
        }}>
          {/* Parallax background layer */}
          <g transform={`translate(0, ${parallaxOffset * 0.3})`}>
            <SceneEnvironment scene={scene} progress={sceneProgress} />
          </g>

          {/* Ground */}
          <rect x="0" y="355" width="600" height="65"
            fill={scene.palette.ground}
            opacity={currentSceneIndex >= 2 ? 0.3 : 0.8}
          />

          {/* Arjun character — centered with posture-based offset */}
          <g transform={`translate(${charX}, ${groundY - 235})`}
            style={{ transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
            <ArjunCharacter
              progress={sceneProgress}
              mood={scene.mood}
              bodyColor={scene.bodyColor}
              shirtColor={scene.shirtColor}
              pantsColor={scene.pantsColor}
              globalProgress={scrollProgress}
              tick={tick}
            />
          </g>

          {/* Scene-specific overlays on SVG */}
          {currentSceneIndex === 0 && (
            <g opacity={Math.min(sceneProgress * 3, 0.8)}>
              {/* Flowers near Arjun */}
              {[{x:240,y:360},{x:260,y:365},{x:340,y:362},{x:355,y:358}].map((f,i) => (
                <g key={i}>
                  <circle cx={f.x} cy={f.y} r="4"
                    fill={["#ff8a65","#ffb74d","#fff176","#f48fb1"][i]} />
                  <line x1={f.x} y1={f.y} x2={f.x} y2={f.y+10}
                    stroke="#4caf50" strokeWidth="1.5" />
                </g>
              ))}
            </g>
          )}

          {/* Lockdown bars */}
          {currentSceneIndex === 1 && sceneProgress > 0.3 && (
            <g opacity={Math.min((sceneProgress - 0.3) * 3, 0.25)}>
              {[220,250,280,310,340,370].map(x => (
                <rect key={x} x={x} y="40" width="6" height="340"
                  fill="#5c4a32" rx="3" />
              ))}
            </g>
          )}

          {/* Digital particle rain */}
          {currentSceneIndex >= 2 && (
            <g opacity="0.15">
              {Array.from({length: 15}).map((_,i) => (
                <text key={i}
                  x={80 + (i * 37) % 500}
                  y={((Date.now() * (0.01 + i * 0.002) + i * 50) % 380) + 40}
                  fontSize="8" fill={scene.palette.accent}
                  fontFamily="monospace">
                  {["01","10","1","0","11","00"][i%6]}
                </text>
              ))}
            </g>
          )}
        </svg>

        {/* Floating notifications — habit phase */}
        <div className="notif-layer">
          {currentSceneIndex >= 3 && (
            <>
              <FloatingNotif x="8%" y="15%" text="You have 47 unread messages" icon="💬"
                delay={0} color="#3498db" />
              <FloatingNotif x="60%" y="12%" text="Your screen time: 8h 42m" icon="📱"
                delay={0.5} color="#e74c3c" />
              <FloatingNotif x="5%" y="55%" text="Reminder: Stand up! (ignored)" icon="⚡"
                delay={1} color="#f39c12" />
              <FloatingNotif x="62%" y="65%" text="New dopamine loop available" icon="🔔"
                delay={1.5} color="#9b59b6" />
            </>
          )}
          {currentSceneIndex >= 4 && (
            <>
              <FloatingNotif x="15%" y="30%" text="3 meetings in the next hour" icon="📅"
                delay={0.3} color="#2ecc71" />
              <FloatingNotif x="55%" y="40%" text="Slack: 12 mentions" icon="💼"
                delay={0.8} color="#1abc9c" />
            </>
          )}
          {currentSceneIndex === 5 && (
            <FloatingNotif x="30%" y="20%" text="AI completed 6 tasks for you" icon="🤖"
              delay={0} color="#00d4ff" />
          )}
        </div>

        {/* AI orb */}
        <div className="ai-orb">
          <div className="ai-orb-inner" />
        </div>

        {/* Scene title */}
        <div className="scene-title-container">
          <div className="scene-era">{scene.subtitle}</div>
          <div className="scene-title">{scene.title}</div>
        </div>

        {/* Reflection overlay */}
        {currentSceneIndex === 6 && (
          <div className="reflection-text" style={{ pointerEvents: "auto" }}>
            <div className="reflection-quote">
              "Every tool I adopted was meant to free me.<br />
              Yet here I stand — wondering<br />
              which parts of me are still my own."
            </div>
            <div style={{
              width: "1px", height: "40px",
              background: "linear-gradient(rgba(255,255,255,0.4), transparent)",
              margin: "10px auto"
            }} />
            <div className="reflection-cta">
              Arjun's Journey — 2019 to 2024
            </div>
          </div>
        )}

        {/* Scroll hint */}
        <div className="scroll-hint">
          <span>SCROLL</span>
          <div className="scroll-arrow" />
        </div>

        {/* Color grading overlay — darkens as story progresses */}
        <div style={{
          position: "absolute", inset: 0,
          background: `rgba(0,0,0,${currentSceneIndex * 0.04})`,
          pointerEvents: "none",
          zIndex: 2,
          transition: "background 1s",
        }} />

        {/* Cinematic letterbox */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "6vh",
          background: "#000", zIndex: 8,
        }} />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "6vh",
          background: "#000", zIndex: 8,
        }} />

        {/* Scene transition flash */}
        <div style={{
          position: "absolute", inset: 0,
          background: scene.palette.accent,
          opacity: sceneProgress < 0.05 ? (0.05 - sceneProgress) / 0.05 * 0.3 : 0,
          pointerEvents: "none",
          zIndex: 7,
          transition: "opacity 0.2s",
        }} />
      </div>
    </>
  );
}

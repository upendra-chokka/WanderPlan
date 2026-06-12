import { useState, useEffect } from "react";

// ── Default seed trip ──────────────────────────────────────────────────────────
const SEED_TRIP = {
  id: "trip-nashik-2025",
  title: "Mumbai → Bhandardara → Nashik",
  subtitle: "Weekend Family Escape",
  travellers: "Upendra & Family • 4-year-old daughter • In-laws",
  duration: "2 Days",
  distance: "~350 km",
  travelType: "Family",
  coverEmoji: "🏞️",
  days: [
    {
      id: "d1", day: 1, label: "Saturday",
      theme: "Lakes, Waterfalls & Arrival",
      color: "#2D6A4F", accent: "#52B788",
      stops: [
        { id: "s1", time: "05:00 AM", icon: "🚗", title: "Depart Mumbai", note: "Early start for smooth drive" },
        { id: "s2", time: "07:00 AM", icon: "🍽️", title: "Breakfast near Kasara / Igatpuri", note: "Poha, Misal, Tea — Peruchi Wadi or Chulivarachi Misal" },
        { id: "s3", time: "09:00 AM", icon: "🏞️", title: "Arthur Lake, Bhandardara", note: "Let the little one throw pebbles & collect leaves" },
        { id: "s4", time: "09:45 AM", icon: "🌊", title: "Wilson Dam", note: "Stunning colonial-era dam, great photo stop" },
        { id: "s5", time: "10:30 AM", icon: "💧", title: "Randha Falls", note: "Powerful waterfall — keep little ones close" },
        { id: "s6", time: "12:00 PM", icon: "🛣️", title: "Scenic Drive to Nashik via Ghoti", note: "Igatpuri–Ghoti stretch is breathtaking" },
        { id: "s7", time: "02:00 PM", icon: "🏨", title: "Check-in: MTDC Grape Park Resort", note: "Settle in, rest, let the child nap" },
        { id: "s8", time: "04:30 PM", icon: "🌿", title: "Gangapur Backwaters Walk", note: "Nature walk — watch butterflies & birds" },
        { id: "s9", time: "05:30 PM", icon: "🌅", title: "Sunset Viewing", note: "No screens — just the golden hour together" },
        { id: "s10", time: "07:30 PM", icon: "🍛", title: "Traditional Maharashtrian Dinner", note: "Mutton Bhakri, Chicken Sukka, local grapes" },
      ],
    },
    {
      id: "d2", day: 2, label: "Sunday",
      theme: "Hanuman Darshan & Return",
      color: "#7B2D00", accent: "#E07B39",
      stops: [
        { id: "s11", time: "05:45 AM", icon: "🌄", title: "Wake up & Freshen up", note: "Sunrise walk on the resort grounds" },
        { id: "s12", time: "06:30 AM", icon: "🚗", title: "Drive to Anjaneri", note: "Cool morning air, scenic 45-min drive" },
        { id: "s13", time: "07:15 AM", icon: "🙏", title: "Hanuman Temple & Foothills", note: "Hanuman's birthplace — read the Chalisa together" },
        { id: "s14", time: "08:30 AM", icon: "🍽️", title: "Breakfast Stop", note: "Fresh local breakfast near Trimbak road" },
        { id: "s15", time: "09:15 AM", icon: "🛣️", title: "Scenic Trimbak Road Drive", note: "One of the best stretches of the trip" },
        { id: "s16", time: "09:45 AM", icon: "⛩️", title: "Trimbakeshwar (Optional)", note: "One of 12 Jyotirlingas — peaceful early morning" },
        { id: "s17", time: "12:30 PM", icon: "🍗", title: "Lunch — Non-veg Special", note: "Local Nashik dhaba for a farewell meal" },
        { id: "s18", time: "02:00 PM", icon: "🏠", title: "Return to Mumbai via Igatpuri", note: "Kasara Ghat descent is scenic" },
        { id: "s19", time: "06:00 PM", icon: "🏙️", title: "Reach Mumbai", note: "Home sweet home — with beautiful memories" },
      ],
    },
  ],
  food: [
    { id: "f1", name: "Peruchi Wadi", desc: "Village-style breakfast", emoji: "🌾" },
    { id: "f2", name: "Chulivarachi Misal", desc: "Authentic Nashik misal", emoji: "🌶️" },
    { id: "f3", name: "Mutton Bhakri", desc: "Classic Maharashtrian combo", emoji: "🍖" },
    { id: "f4", name: "Chicken Sukka", desc: "Dry spiced chicken", emoji: "🍗" },
    { id: "f5", name: "Local Grapes & Fruits", desc: "Fresh from Nashik vineyards", emoji: "🍇" },
  ],
  activities: [
    { id: "a1", activity: "Collect fallen leaves and identify shapes", emoji: "🍂" },
    { id: "a2", activity: "Watch butterflies and birds", emoji: "🦋" },
    { id: "a3", activity: "Walk barefoot on grass", emoji: "🌿" },
    { id: "a4", activity: "Throw pebbles into the lake", emoji: "💦" },
    { id: "a5", activity: "Enjoy sunrise & sunset without screens", emoji: "🌅" },
  ],
  packing: ["Umbrellas / Rain jackets", "Extra clothes for child", "Water bottles", "Snacks and fruits", "Power bank", "Hanuman Chalisa booklet", "Basic medicines"],
  scenicRoutes: ["Kasara Ghat", "Igatpuri–Ghoti stretch", "Bhandardara lake region", "Trimbak–Anjaneri road", "Gangapur backwaters"],
  tip: "Spend more time enjoying nature than covering attractions. The memories will come from the experience, not the checklist.",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 9);
const STORAGE_KEY = "wanderplan_trips_v2";

function loadTrips() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [SEED_TRIP];
}
function saveTrips(trips) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(trips)); } catch {}
}

// ── Colour palette options for days ──────────────────────────────────────────
const DAY_PALETTES = [
  { color: "#2D6A4F", accent: "#52B788", label: "Forest" },
  { color: "#7B2D00", accent: "#E07B39", label: "Terracotta" },
  { color: "#1A3A5C", accent: "#4A9ECA", label: "Ocean" },
  { color: "#4A1A6E", accent: "#A855F7", label: "Lavender" },
  { color: "#5C3A00", accent: "#D4A017", label: "Golden" },
  { color: "#1A4A4A", accent: "#2DD4BF", label: "Teal" },
];

const TRIP_EMOJIS = ["🏞️","🏔️","🌊","🏜️","🏙️","🌴","⛩️","🗺️","✈️","🚂","🚢","🏕️"];

// ── Tiny input component ───────────────────────────────────────────────────────
function Field({ label, value, onChange, multiline, placeholder }) {
  const base = {
    width: "100%", boxSizing: "border-box",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 8, padding: "10px 12px",
    color: "#F0EBE3", fontSize: 13, fontFamily: "'Georgia', serif",
    outline: "none", resize: multiline ? "vertical" : "none",
  };
  return (
    <div style={{ marginBottom: 12 }}>
      {label && <div style={{ fontSize: 10, color: "#7A9A85", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 5 }}>{label}</div>}
      {multiline
        ? <textarea rows={2} style={base} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
        : <input style={base} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      }
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", small, style: extra }) {
  const styles = {
    primary: { background: "linear-gradient(135deg,#2D6A4F,#52B788)", color: "#fff", border: "none" },
    danger:  { background: "rgba(220,60,60,0.15)", color: "#f87171", border: "1px solid rgba(220,60,60,0.3)" },
    ghost:   { background: "rgba(255,255,255,0.06)", color: "#D4C9BC", border: "1px solid rgba(255,255,255,0.12)" },
    accent:  { background: "linear-gradient(135deg,#7B2D00,#E07B39)", color: "#fff", border: "none" },
  };
  return (
    <button onClick={onClick} style={{
      ...styles[variant],
      padding: small ? "6px 12px" : "10px 18px",
      borderRadius: 8, fontSize: small ? 11 : 13,
      fontFamily: "'Georgia', serif", cursor: "pointer",
      transition: "opacity 0.2s", letterSpacing: 0.3,
      ...extra,
    }}>
      {children}
    </button>
  );
}

// ── SCREEN: Dashboard ──────────────────────────────────────────────────────────
function Dashboard({ trips, onOpen, onNew, onDelete }) {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#0D1B2A 0%,#1A2E20 60%,#2C1A0E 100%)", color: "#F0EBE3", fontFamily: "'Georgia',serif" }}>
      {/* Header */}
      <div style={{ padding: "48px 24px 32px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: "#52B788", textTransform: "uppercase", marginBottom: 10 }}>✦ WanderPlan</div>
        <h1 style={{ fontSize: "clamp(24px,6vw,36px)", fontWeight: 700, margin: "0 0 8px", lineHeight: 1.15 }}>Your Travel<br />Planner</h1>
        <p style={{ fontSize: 13, color: "#8A9A90", margin: 0 }}>Plan, edit, and carry your trips — all in one place.</p>
      </div>

      {/* Trip cards */}
      <div style={{ padding: "24px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ fontSize: 11, letterSpacing: 2, color: "#7A8F85", textTransform: "uppercase" }}>My Trips ({trips.length})</div>
          <Btn onClick={onNew} small>+ New Trip</Btn>
        </div>

        {trips.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 24px", color: "#5A7060" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🗺️</div>
            <div style={{ fontSize: 15 }}>No trips yet. Create your first one!</div>
          </div>
        )}

        {trips.map(trip => (
          <div key={trip.id} style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16, marginBottom: 14, overflow: "hidden",
          }}>
            <div onClick={() => onOpen(trip.id)} style={{
              padding: "20px", cursor: "pointer",
              display: "flex", gap: 16, alignItems: "flex-start",
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: "linear-gradient(135deg,#2D6A4F,#52B788)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, flexShrink: 0,
              }}>{trip.coverEmoji || "🗺️"}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#F0EBE3", marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {trip.title}
                </div>
                <div style={{ fontSize: 12, color: "#8A9A90", marginBottom: 8 }}>{trip.travellers}</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[trip.duration, trip.distance, `${trip.days?.length || 0} days`].filter(Boolean).map(b => (
                    <span key={b} style={{ background: "rgba(82,183,136,0.12)", color: "#7AB898", borderRadius: 20, padding: "3px 10px", fontSize: 11 }}>{b}</span>
                  ))}
                </div>
              </div>
              <div style={{ color: "#4A6A55", fontSize: 20 }}>›</div>
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "10px 20px", display: "flex", gap: 8 }}>
              <Btn small variant="ghost" onClick={() => onOpen(trip.id)}>View</Btn>
              <Btn small variant="danger" onClick={() => onDelete(trip.id)}>Delete</Btn>
            </div>
          </div>
        ))}
      </div>

      {/* Footer brand */}
      <div style={{ padding: "32px 24px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: 8 }}>
        <div style={{ fontSize: 11, color: "#3A5040", letterSpacing: 2 }}>✦ WANDERPLAN · TRAVEL YOUR WAY</div>
      </div>
    </div>
  );
}

// ── SCREEN: Trip View (tabs) ───────────────────────────────────────────────────
const VIEW_TABS = ["Itinerary", "Food", "Activities", "Pack & Go"];

function TripView({ trip, onBack, onEdit }) {
  const [activeTab, setActiveTab] = useState("Itinerary");
  const [expandedDay, setExpandedDay] = useState(trip.days?.[0]?.day ?? 1);
  const [checked, setChecked] = useState({});

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#0D1B2A 0%,#1A2E20 50%,#2C1A0E 100%)", fontFamily: "'Georgia',serif", color: "#F0EBE3" }}>
      {/* Top bar */}
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.3)" }}>
        <button onClick={onBack} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#D4C9BC", padding: "6px 12px", cursor: "pointer", fontSize: 13, fontFamily: "'Georgia',serif" }}>← Back</button>
        <div style={{ flex: 1, fontSize: 13, color: "#A8C5A0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{trip.title}</div>
        <Btn small onClick={onEdit}>✏️ Edit</Btn>
      </div>

      {/* Hero */}
      <div style={{ padding: "28px 24px 22px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ fontSize: 36, marginBottom: 10 }}>{trip.coverEmoji || "🗺️"}</div>
        <div style={{ fontSize: 11, letterSpacing: 3, color: "#A8C5A0", textTransform: "uppercase", marginBottom: 8 }}>{trip.subtitle}</div>
        <h1 style={{ fontSize: "clamp(18px,4.5vw,26px)", fontWeight: 700, margin: "0 0 6px", lineHeight: 1.2 }}>{trip.title}</h1>
        <p style={{ fontSize: 12, color: "#B8A898", margin: "6px 0 14px" }}>{trip.travellers}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
          {[trip.duration, trip.distance, trip.travelType].filter(Boolean).map(b => (
            <span key={b} style={{ background: "rgba(255,255,255,0.07)", borderRadius: 20, padding: "5px 14px", fontSize: 12, color: "#D4C9BC", border: "1px solid rgba(255,255,255,0.1)" }}>{b}</span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.2)", overflowX: "auto" }}>
        {VIEW_TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            flex: "1 0 auto", padding: "13px 14px", fontSize: 12, fontFamily: "'Georgia',serif",
            border: "none", background: "transparent",
            color: activeTab === t ? "#A8C5A0" : "#6A7A70",
            borderBottom: activeTab === t ? "2px solid #52B788" : "2px solid transparent",
            cursor: "pointer", whiteSpace: "nowrap",
          }}>{t}</button>
        ))}
      </div>

      <div style={{ paddingBottom: 60 }}>
        {/* ITINERARY */}
        {activeTab === "Itinerary" && (
          <div>
            {(trip.days || []).map(day => (
              <div key={day.id}>
                <button onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)} style={{
                  width: "100%", padding: "18px 24px",
                  background: expandedDay === day.day ? `linear-gradient(90deg,${day.color}55,transparent)` : "transparent",
                  border: "none", borderBottom: "1px solid rgba(255,255,255,0.06)",
                  cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 14,
                }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg,${day.color},${day.accent})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#fff", flexShrink: 0, boxShadow: `0 4px 10px ${day.color}55` }}>{day.day}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: day.accent, letterSpacing: 2, textTransform: "uppercase", marginBottom: 2 }}>{day.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#F0EBE3" }}>{day.theme}</div>
                  </div>
                  <div style={{ color: "#4A6A55", transition: "transform 0.2s", transform: expandedDay === day.day ? "rotate(90deg)" : "rotate(0)" }}>›</div>
                </button>
                {expandedDay === day.day && (
                  <div style={{ padding: "6px 24px 12px", background: "rgba(255,255,255,0.015)" }}>
                    {(day.stops || []).map((stop, i) => (
                      <div key={stop.id} style={{ display: "flex", gap: 12, position: "relative" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 34 }}>
                          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: `1px solid ${day.accent}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, marginTop: 12 }}>{stop.icon}</div>
                          {i < day.stops.length - 1 && <div style={{ width: 1, flex: 1, minHeight: 16, background: `${day.accent}25`, margin: "3px 0" }} />}
                        </div>
                        <div style={{ flex: 1, paddingTop: 13, paddingBottom: 14 }}>
                          <div style={{ fontSize: 10, color: day.accent, fontFamily: "monospace", letterSpacing: 1, marginBottom: 1 }}>{stop.time}</div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "#F0EBE3", marginBottom: 2 }}>{stop.title}</div>
                          <div style={{ fontSize: 12, color: "#8A9898", lineHeight: 1.5 }}>{stop.note}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {(trip.scenicRoutes || []).length > 0 && (
              <div style={{ padding: "20px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 10, letterSpacing: 2, color: "#A8C5A0", textTransform: "uppercase", marginBottom: 12 }}>🌄 Scenic Sections</div>
                {trip.scenicRoutes.map((r, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <span style={{ color: "#52B788", fontFamily: "monospace", fontSize: 11, minWidth: 18 }}>{String(i + 1).padStart(2, "0")}</span>
                    <span style={{ fontSize: 13, color: "#D4C9BC" }}>{r}</span>
                  </div>
                ))}
              </div>
            )}
            {trip.tip && (
              <div style={{ margin: "16px 24px", background: "rgba(82,183,136,0.07)", border: "1px solid rgba(82,183,136,0.2)", borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 11, color: "#52B788", fontWeight: 600, marginBottom: 5 }}>💡 Trip Tip</div>
                <div style={{ fontSize: 13, color: "#A8C5A0", lineHeight: 1.6, fontStyle: "italic" }}>{trip.tip}</div>
              </div>
            )}
          </div>
        )}

        {/* FOOD */}
        {activeTab === "Food" && (
          <div style={{ padding: "20px" }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: "#E07B39", textTransform: "uppercase", marginBottom: 16 }}>Local Eats</div>
            {(trip.food || []).map(item => (
              <div key={item.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 16, marginBottom: 10, display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ fontSize: 28 }}>{item.emoji}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#F0EBE3", marginBottom: 3 }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: "#9AA898" }}>{item.desc}</div>
                </div>
              </div>
            ))}
            {(trip.food || []).length === 0 && <div style={{ color: "#5A7060", textAlign: "center", padding: 40 }}>No food spots added yet.</div>}
          </div>
        )}

        {/* ACTIVITIES */}
        {activeTab === "Activities" && (
          <div style={{ padding: "20px" }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: "#52B788", textTransform: "uppercase", marginBottom: 16 }}>Things To Do</div>
            {(trip.activities || []).map(item => (
              <div key={item.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(82,183,136,0.12)", borderRadius: 12, padding: "14px 16px", marginBottom: 10, display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ fontSize: 26 }}>{item.emoji}</div>
                <div style={{ fontSize: 13, color: "#D4C9BC", lineHeight: 1.4 }}>{item.activity}</div>
              </div>
            ))}
            {(trip.activities || []).length === 0 && <div style={{ color: "#5A7060", textAlign: "center", padding: 40 }}>No activities added yet.</div>}
          </div>
        )}

        {/* PACK & GO */}
        {activeTab === "Pack & Go" && (
          <div style={{ padding: "20px" }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: "#A8C5A0", textTransform: "uppercase", marginBottom: 16 }}>Packing Checklist</div>
            {(trip.packing || []).map((item, i) => (
              <button key={i} onClick={() => setChecked(p => ({ ...p, [i]: !p[i] }))} style={{
                width: "100%", textAlign: "left",
                background: checked[i] ? "rgba(82,183,136,0.1)" : "rgba(255,255,255,0.04)",
                border: checked[i] ? "1px solid rgba(82,183,136,0.25)" : "1px solid rgba(255,255,255,0.07)",
                borderRadius: 10, padding: "13px 14px", marginBottom: 8,
                display: "flex", gap: 12, alignItems: "center", cursor: "pointer", transition: "all 0.2s",
              }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", border: checked[i] ? "2px solid #52B788" : "2px solid rgba(255,255,255,0.2)", background: checked[i] ? "#52B788" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0, transition: "all 0.2s" }}>{checked[i] ? "✓" : ""}</div>
                <div style={{ fontSize: 13, color: checked[i] ? "#7AB898" : "#D4C9BC", textDecoration: checked[i] ? "line-through" : "none", transition: "all 0.2s" }}>{item}</div>
              </button>
            ))}
            {(trip.packing || []).length === 0 && <div style={{ color: "#5A7060", textAlign: "center", padding: 40 }}>Packing list is empty.</div>}
            <div style={{ marginTop: 8, fontSize: 12, color: "#4A6A55", textAlign: "center" }}>
              {Object.values(checked).filter(Boolean).length} / {(trip.packing || []).length} packed
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── SCREEN: Trip Editor ────────────────────────────────────────────────────────
function TripEditor({ trip: initial, onSave, onCancel }) {
  const [trip, setTrip] = useState(() => JSON.parse(JSON.stringify(initial)));
  const [section, setSection] = useState("info"); // info | days | food | activities | packing
  const [editingStop, setEditingStop] = useState(null); // { dayId, stopId }
  const [editingDay, setEditingDay] = useState(null);

  const set = (path, val) => {
    setTrip(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const parts = path.split(".");
      let cur = next;
      for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
      cur[parts[parts.length - 1]] = val;
      return next;
    });
  };

  // ── Day helpers
  const addDay = () => setTrip(p => {
    const n = JSON.parse(JSON.stringify(p));
    const palette = DAY_PALETTES[n.days.length % DAY_PALETTES.length];
    n.days.push({ id: uid(), day: n.days.length + 1, label: `Day ${n.days.length + 1}`, theme: "New Day Theme", ...palette, stops: [] });
    return n;
  });
  const removeDay = (dayId) => setTrip(p => ({ ...p, days: p.days.filter(d => d.id !== dayId).map((d, i) => ({ ...d, day: i + 1 })) }));
  const setDayField = (dayId, field, val) => setTrip(p => ({ ...p, days: p.days.map(d => d.id === dayId ? { ...d, [field]: val } : d) }));

  // ── Stop helpers
  const addStop = (dayId) => setTrip(p => ({
    ...p, days: p.days.map(d => d.id === dayId ? { ...d, stops: [...d.stops, { id: uid(), time: "12:00 PM", icon: "📍", title: "New Stop", note: "" }] } : d)
  }));
  const removeStop = (dayId, stopId) => setTrip(p => ({ ...p, days: p.days.map(d => d.id === dayId ? { ...d, stops: d.stops.filter(s => s.id !== stopId) } : d) }));
  const setStopField = (dayId, stopId, field, val) => setTrip(p => ({ ...p, days: p.days.map(d => d.id === dayId ? { ...d, stops: d.stops.map(s => s.id === stopId ? { ...s, [field]: val } : s) } : d) }));

  // ── List helpers (food, activities, packing, scenicRoutes)
  const addListItem = (key, item) => setTrip(p => ({ ...p, [key]: [...(p[key] || []), item] }));
  const removeListItem = (key, id) => setTrip(p => ({ ...p, [key]: p[key].filter(x => (x.id || x) !== id) }));
  const setListField = (key, id, field, val) => setTrip(p => ({ ...p, [key]: p[key].map(x => x.id === id ? { ...x, [field]: val } : x) }));

  const EDITOR_SECTIONS = [
    { id: "info", label: "🗺️ Info" },
    { id: "days", label: "📅 Days" },
    { id: "food", label: "🍽️ Food" },
    { id: "activities", label: "🎯 Activities" },
    { id: "packing", label: "🎒 Packing" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#0D1B2A 0%,#162A1C 100%)", fontFamily: "'Georgia',serif", color: "#F0EBE3" }}>
      {/* Top bar */}
      <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.35)", position: "sticky", top: 0, zIndex: 10 }}>
        <button onClick={onCancel} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#D4C9BC", padding: "6px 12px", cursor: "pointer", fontSize: 12, fontFamily: "'Georgia',serif" }}>✕ Cancel</button>
        <div style={{ flex: 1, fontSize: 13, color: "#A8C5A0", fontWeight: 600 }}>Edit Trip</div>
        <Btn small onClick={() => onSave(trip)}>Save ✓</Btn>
      </div>

      {/* Section tabs */}
      <div style={{ display: "flex", overflowX: "auto", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.2)" }}>
        {EDITOR_SECTIONS.map(s => (
          <button key={s.id} onClick={() => setSection(s.id)} style={{
            flex: "1 0 auto", padding: "12px 12px", fontSize: 11, fontFamily: "'Georgia',serif",
            border: "none", background: "transparent",
            color: section === s.id ? "#A8C5A0" : "#5A7060",
            borderBottom: section === s.id ? "2px solid #52B788" : "2px solid transparent",
            cursor: "pointer", whiteSpace: "nowrap",
          }}>{s.label}</button>
        ))}
      </div>

      <div style={{ padding: "20px 20px 80px" }}>

        {/* INFO SECTION */}
        {section === "info" && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: "#7A9A85", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>Cover Emoji</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {TRIP_EMOJIS.map(e => (
                  <button key={e} onClick={() => set("coverEmoji", e)} style={{
                    width: 40, height: 40, borderRadius: 10, fontSize: 20, border: trip.coverEmoji === e ? "2px solid #52B788" : "1px solid rgba(255,255,255,0.12)",
                    background: trip.coverEmoji === e ? "rgba(82,183,136,0.2)" : "rgba(255,255,255,0.05)", cursor: "pointer",
                  }}>{e}</button>
                ))}
              </div>
            </div>
            <Field label="Trip Title" value={trip.title} onChange={v => set("title", v)} placeholder="e.g. Mumbai → Goa" />
            <Field label="Subtitle" value={trip.subtitle} onChange={v => set("subtitle", v)} placeholder="e.g. Weekend Road Trip" />
            <Field label="Travellers" value={trip.travellers} onChange={v => set("travellers", v)} placeholder="e.g. Family of 4" />
            <Field label="Duration" value={trip.duration} onChange={v => set("duration", v)} placeholder="e.g. 3 Days" />
            <Field label="Distance" value={trip.distance} onChange={v => set("distance", v)} placeholder="e.g. ~450 km" />
            <Field label="Travel Type" value={trip.travelType} onChange={v => set("travelType", v)} placeholder="e.g. Family, Solo, Couple" />
            <Field label="Trip Tip / Wisdom" value={trip.tip} onChange={v => set("tip", v)} multiline placeholder="One piece of advice for this trip..." />
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: "#7A9A85", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>Scenic Routes</div>
              {(trip.scenicRoutes || []).map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                  <input value={r} onChange={e => setTrip(p => { const n = { ...p, scenicRoutes: [...p.scenicRoutes] }; n.scenicRoutes[i] = e.target.value; return n; })}
                    style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "8px 12px", color: "#F0EBE3", fontSize: 13, fontFamily: "'Georgia',serif", outline: "none" }} />
                  <Btn small variant="danger" onClick={() => setTrip(p => ({ ...p, scenicRoutes: p.scenicRoutes.filter((_, j) => j !== i) }))}>✕</Btn>
                </div>
              ))}
              <Btn small variant="ghost" onClick={() => setTrip(p => ({ ...p, scenicRoutes: [...(p.scenicRoutes || []), ""] }))}>+ Add Route</Btn>
            </div>
          </div>
        )}

        {/* DAYS SECTION */}
        {section === "days" && (
          <div>
            {(trip.days || []).map(day => (
              <div key={day.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, marginBottom: 16, overflow: "hidden" }}>
                {/* Day header */}
                <div style={{ padding: "14px 16px", background: `linear-gradient(90deg,${day.color}44,transparent)`, display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg,${day.color},${day.accent})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{day.day}</div>
                  <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "#F0EBE3" }}>{day.label} — {day.theme}</div>
                  <Btn small variant="danger" onClick={() => removeDay(day.id)}>✕</Btn>
                </div>
                <div style={{ padding: "14px 16px" }}>
                  <Field label="Day Label" value={day.label} onChange={v => setDayField(day.id, "label", v)} placeholder="e.g. Saturday" />
                  <Field label="Theme" value={day.theme} onChange={v => setDayField(day.id, "theme", v)} placeholder="e.g. Mountains & Lakes" />
                  <div style={{ fontSize: 10, color: "#7A9A85", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>Day Colour</div>
                  <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                    {DAY_PALETTES.map(p => (
                      <button key={p.label} onClick={() => { setDayField(day.id, "color", p.color); setDayField(day.id, "accent", p.accent); }} style={{
                        width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg,${p.color},${p.accent})`,
                        border: day.color === p.color ? "2px solid #fff" : "2px solid transparent", cursor: "pointer", flexShrink: 0,
                        title: p.label,
                      }} />
                    ))}
                  </div>

                  {/* Stops */}
                  <div style={{ fontSize: 10, color: "#7A9A85", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>Stops ({day.stops.length})</div>
                  {day.stops.map(stop => (
                    <div key={stop.id} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "12px", marginBottom: 8, border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                        <input value={stop.icon} onChange={e => setStopField(day.id, stop.id, "icon", e.target.value)} style={{ width: 44, textAlign: "center", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "6px", color: "#F0EBE3", fontSize: 18, outline: "none" }} />
                        <input value={stop.time} onChange={e => setStopField(day.id, stop.id, "time", e.target.value)} style={{ width: 90, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "6px 10px", color: "#F0EBE3", fontSize: 12, fontFamily: "monospace", outline: "none" }} placeholder="09:00 AM" />
                        <input value={stop.title} onChange={e => setStopField(day.id, stop.id, "title", e.target.value)} style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "6px 10px", color: "#F0EBE3", fontSize: 13, fontFamily: "'Georgia',serif", outline: "none" }} placeholder="Stop name" />
                        <Btn small variant="danger" onClick={() => removeStop(day.id, stop.id)}>✕</Btn>
                      </div>
                      <input value={stop.note} onChange={e => setStopField(day.id, stop.id, "note", e.target.value)} style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "7px 10px", color: "#9AA898", fontSize: 12, fontFamily: "'Georgia',serif", outline: "none" }} placeholder="Notes / tips for this stop..." />
                    </div>
                  ))}
                  <Btn small variant="ghost" onClick={() => addStop(day.id)}>+ Add Stop</Btn>
                </div>
              </div>
            ))}
            <Btn variant="ghost" onClick={addDay} style={{ width: "100%" }}>+ Add Day</Btn>
          </div>
        )}

        {/* FOOD SECTION */}
        {section === "food" && (
          <div>
            {(trip.food || []).map(item => (
              <div key={item.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "14px", marginBottom: 10 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <input value={item.emoji} onChange={e => setListField("food", item.id, "emoji", e.target.value)} style={{ width: 44, textAlign: "center", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "6px", color: "#F0EBE3", fontSize: 18, outline: "none" }} />
                  <input value={item.name} onChange={e => setListField("food", item.id, "name", e.target.value)} style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "6px 10px", color: "#F0EBE3", fontSize: 13, fontFamily: "'Georgia',serif", outline: "none" }} placeholder="Dish name" />
                  <Btn small variant="danger" onClick={() => removeListItem("food", item.id)}>✕</Btn>
                </div>
                <input value={item.desc} onChange={e => setListField("food", item.id, "desc", e.target.value)} style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "7px 10px", color: "#9AA898", fontSize: 12, fontFamily: "'Georgia',serif", outline: "none" }} placeholder="Short description..." />
              </div>
            ))}
            <Btn variant="ghost" onClick={() => addListItem("food", { id: uid(), emoji: "🍽️", name: "", desc: "" })} style={{ width: "100%" }}>+ Add Food Item</Btn>
          </div>
        )}

        {/* ACTIVITIES SECTION */}
        {section === "activities" && (
          <div>
            {(trip.activities || []).map(item => (
              <div key={item.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px", marginBottom: 10, display: "flex", gap: 8, alignItems: "center" }}>
                <input value={item.emoji} onChange={e => setListField("activities", item.id, "emoji", e.target.value)} style={{ width: 44, textAlign: "center", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "6px", color: "#F0EBE3", fontSize: 18, outline: "none" }} />
                <input value={item.activity} onChange={e => setListField("activities", item.id, "activity", e.target.value)} style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "8px 10px", color: "#F0EBE3", fontSize: 13, fontFamily: "'Georgia',serif", outline: "none" }} placeholder="Activity description" />
                <Btn small variant="danger" onClick={() => removeListItem("activities", item.id)}>✕</Btn>
              </div>
            ))}
            <Btn variant="ghost" onClick={() => addListItem("activities", { id: uid(), emoji: "🎯", activity: "" })} style={{ width: "100%" }}>+ Add Activity</Btn>
          </div>
        )}

        {/* PACKING SECTION */}
        {section === "packing" && (
          <div>
            {(trip.packing || []).map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input value={item} onChange={e => setTrip(p => { const n = { ...p, packing: [...p.packing] }; n.packing[i] = e.target.value; return n; })}
                  style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "10px 12px", color: "#F0EBE3", fontSize: 13, fontFamily: "'Georgia',serif", outline: "none" }} placeholder="Item to pack..." />
                <Btn small variant="danger" onClick={() => setTrip(p => ({ ...p, packing: p.packing.filter((_, j) => j !== i) }))}>✕</Btn>
              </div>
            ))}
            <Btn variant="ghost" onClick={() => setTrip(p => ({ ...p, packing: [...(p.packing || []), ""] }))} style={{ width: "100%" }}>+ Add Item</Btn>
          </div>
        )}

      </div>
    </div>
  );
}

// ── ROOT ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [trips, setTrips] = useState(loadTrips);
  const [screen, setScreen] = useState("dashboard"); // dashboard | view | edit | new
  const [activeId, setActiveId] = useState(null);

  useEffect(() => { saveTrips(trips); }, [trips]);

  const activeTrip = trips.find(t => t.id === activeId);

  const handleNew = () => {
    const id = "trip-" + uid();
    const blank = {
      id, title: "New Trip", subtitle: "", travellers: "", duration: "", distance: "", travelType: "",
      coverEmoji: "🗺️", days: [], food: [], activities: [], packing: [], scenicRoutes: [], tip: "",
    };
    setTrips(p => [blank, ...p]);
    setActiveId(id);
    setScreen("edit");
  };

  const handleSave = (updated) => {
    setTrips(p => p.map(t => t.id === updated.id ? updated : t));
    setActiveId(updated.id);
    setScreen("view");
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this trip?")) {
      setTrips(p => p.filter(t => t.id !== id));
    }
  };

  if (screen === "dashboard") return <Dashboard trips={trips} onOpen={id => { setActiveId(id); setScreen("view"); }} onNew={handleNew} onDelete={handleDelete} />;
  if (screen === "view" && activeTrip) return <TripView trip={activeTrip} onBack={() => setScreen("dashboard")} onEdit={() => setScreen("edit")} />;
  if (screen === "edit" && activeTrip) return <TripEditor trip={activeTrip} onSave={handleSave} onCancel={() => setScreen(activeTrip.title === "New Trip" && !activeTrip.days.length ? "dashboard" : "view")} />;
  return <Dashboard trips={trips} onOpen={id => { setActiveId(id); setScreen("view"); }} onNew={handleNew} onDelete={handleDelete} />;
}

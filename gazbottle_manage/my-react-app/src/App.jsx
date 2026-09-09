import React, { useState, useEffect } from "react";
import { Flame, Plus, Target, Package, CheckCircle2, Gauge } from "lucide-react";

const BRANDS = [
  { key: "SCTM", label: "SCTM" },
  { key: "Oilibiya", label: "Oilibiya" },
  { key: "Tradex", label: "Tradex" },
  { key: "GreenOil", label: "Green Oil" },
  { key: "Afrigaz", label: "Afrigaz" },
  { key: "Total", label: "Total" },
  { key: "PleinGaz", label: "Plein Gaz" },
  { key: "GlocalGaz", label: "Glocal Gaz" },
  { key: "Bocom", label: "Bocom" },
  { key: "Camgaz", label: "Camgaz" },
];

const ACCENTS = ["#FF6A3D", "#3E92CC", "#4CAF7D", "#D9A441", "#B36BFF"];

const COLORS = {
  bg: "#12151A",
  bgAlt: "#0D0F13",
  panel: "#1B2028",
  panelAlt: "#232935",
  border: "#2A313C",
  text: "#F1F3F6",
  muted: "#8B93A3",
  flame: "#FF6A3D",
  butane: "#3E92CC",
};

const STOCK_KEY = "gaz-stock";
const OBJECTIF_KEY = "gaz-objectif";

function emptyStock() {
  const s = {};
  BRANDS.forEach((b) => (s[b.key] = 0));
  return s;
}

export default function App() {
  const [stock, setStock] = useState(() => {
    try {
      const raw = localStorage.getItem(STOCK_KEY);
      return raw ? { ...emptyStock(), ...JSON.parse(raw) } : emptyStock();
    } catch (e) {
      return emptyStock();
    }
  });

  const [objectif, setObjectif] = useState(() => {
    try {
      const raw = localStorage.getItem(OBJECTIF_KEY);
      return raw ? JSON.parse(raw) : 500;
    } catch (e) {
      return 500;
    }
  });

  const [objectifDraft, setObjectifDraft] = useState(String(objectif));
  const [inputs, setInputs] = useState({});
  const [confirmed, setConfirmed] = useState({});

  useEffect(() => {
    try {
      localStorage.setItem(STOCK_KEY, JSON.stringify(stock));
    } catch (e) {}
  }, [stock]);

  useEffect(() => {
    try {
      localStorage.setItem(OBJECTIF_KEY, JSON.stringify(objectif));
    } catch (e) {}
  }, [objectif]);

  const handleAdd = (key) => {
    const raw = inputs[key];
    const amount = parseInt(raw, 10);
    if (!amount || amount <= 0) return;
    setStock((prev) => ({ ...prev, [key]: (prev[key] || 0) + amount }));
    setInputs((prev) => ({ ...prev, [key]: "" }));
    setConfirmed((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => setConfirmed((prev) => ({ ...prev, [key]: false })), 1400);
  };

  const handleObjectifSave = () => {
    const v = parseInt(objectifDraft, 10);
    if (!v || v <= 0) return;
    setObjectif(v);
  };

  const total = BRANDS.reduce((sum, b) => sum + (stock[b.key] || 0), 0);
  const remaining = Math.max(objectif - total, 0);
  const pct = objectif > 0 ? Math.min((total / objectif) * 100, 100) : 0;

  const globalStyles = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');

      .gaz-app {
        font-family: 'Inter', sans-serif;
        background-color: ${COLORS.bg};
        background-image:
          radial-gradient(circle at 12% 8%, rgba(255,106,61,0.09), transparent 42%),
          radial-gradient(circle at 88% 92%, rgba(62,146,204,0.08), transparent 45%),
          linear-gradient(180deg, ${COLORS.bg} 0%, ${COLORS.bgAlt} 100%);
        min-height: 100vh;
      }
      .gaz-heading { font-family: 'Oswald', sans-serif; letter-spacing: 0.01em; }
      .gaz-num { font-variant-numeric: tabular-nums; }

      .gaz-container { max-width: 1080px; margin: 0 auto; padding: 20px 16px 48px; }
      @media (min-width: 640px)  { .gaz-container { padding: 28px 24px 56px; } }
      @media (min-width: 1024px) { .gaz-container { padding: 36px 32px 64px; } }

      .gaz-header {
        display: flex; align-items: center; gap: 12px;
        margin-bottom: 20px;
      }
      @media (min-width: 640px) { .gaz-header { margin-bottom: 28px; } }

      .gaz-logo {
        width: 42px; height: 42px; border-radius: 12px; flex-shrink: 0;
        display: flex; align-items: center; justify-content: center;
        background: linear-gradient(135deg, rgba(255,106,61,0.22), rgba(255,106,61,0.06));
        border: 1px solid rgba(255,106,61,0.25);
      }

      .gaz-stats-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 14px;
        margin-bottom: 14px;
      }
      @media (min-width: 640px) {
        .gaz-stats-grid { grid-template-columns: 1fr 1.2fr; gap: 16px; margin-bottom: 16px; }
      }

      .gaz-panel {
        position: relative;
        overflow: hidden;
        background: linear-gradient(165deg, ${COLORS.panel}, ${COLORS.panelAlt});
        border: 1px solid ${COLORS.border};
        border-radius: 16px;
        padding: 18px 20px;
        box-shadow: 0 1px 0 rgba(255,255,255,0.03) inset, 0 10px 24px -16px rgba(0,0,0,0.6);
      }
      @media (min-width: 640px) { .gaz-panel { padding: 22px 24px; } }

      .gaz-watermark {
        position: absolute;
        right: -10px; bottom: -18px;
        opacity: 0.07;
        pointer-events: none;
      }

      .gaz-total-number {
        font-size: clamp(2.4rem, 8vw, 3.2rem);
        line-height: 1;
        color: ${COLORS.text};
      }
      .gaz-unit { font-size: 0.9rem; color: ${COLORS.muted}; margin-left: 8px; font-family: 'Inter', sans-serif; }

      .gaz-input {
        background: ${COLORS.bgAlt};
        border: 1px solid ${COLORS.border};
        color: ${COLORS.text};
        border-radius: 10px;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
      }
      .gaz-input:focus {
        outline: none;
        border-color: ${COLORS.flame};
        box-shadow: 0 0 0 3px rgba(255,106,61,0.15);
      }
      input[type=number]::-webkit-outer-spin-button,
      input[type=number]::-webkit-inner-spin-button { opacity: 1; }

      .gaz-btn {
        border: none;
        cursor: pointer;
        transition: transform 0.1s ease, filter 0.15s ease, box-shadow 0.15s ease;
      }
      .gaz-btn:hover { filter: brightness(1.08); }
      .gaz-btn:active { transform: scale(0.96); }
      .gaz-btn:focus-visible { outline: 2px solid ${COLORS.flame}; outline-offset: 2px; }

      .gaz-progress-track {
        width: 100%; height: 12px; border-radius: 999px;
        background: ${COLORS.bgAlt};
        border: 1px solid ${COLORS.border};
        overflow: hidden;
        position: relative;
      }
      .gaz-progress-fill {
        height: 100%; border-radius: 999px;
        background: linear-gradient(90deg, ${COLORS.butane}, ${COLORS.flame});
        box-shadow: 0 0 12px rgba(255,106,61,0.45);
        transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
      }
      .gaz-ticks {
        position: absolute; inset: 0;
        background-image: repeating-linear-gradient(90deg, rgba(0,0,0,0.25) 0 1px, transparent 1px 10%);
        pointer-events: none;
      }

      .gaz-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }
      @media (min-width: 480px) {
        .gaz-grid { grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 14px; }
      }
      @media (min-width: 1024px) {
        .gaz-grid { gap: 16px; }
      }

      .gaz-card {
        position: relative;
        background: linear-gradient(165deg, ${COLORS.panel}, ${COLORS.panelAlt});
        border: 1px solid ${COLORS.border};
        border-radius: 14px;
        padding: 14px 16px;
        transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
      }
      @media (min-width: 640px) { .gaz-card { padding: 16px 18px; } }
      .gaz-card:hover {
        border-color: #3A4250;
        transform: translateY(-2px);
        box-shadow: 0 12px 24px -16px rgba(0,0,0,0.7);
      }

      .gaz-card-stock {
        font-size: clamp(1.5rem, 5vw, 1.75rem);
      }

      .gaz-section-label {
        display: flex; align-items: center; gap: 8px;
        color: ${COLORS.muted}; font-size: 0.85rem; margin-bottom: 10px;
      }

      .gaz-footer-note {
        text-align: center; font-size: 0.75rem; color: #566072; margin-top: 32px;
      }
    `}</style>
  );

  return (
    <div className="gaz-app">
      {globalStyles}
      <div className="gaz-container">
        <header className="gaz-header">
          <div className="gaz-logo">
            <Flame size={20} color={COLORS.flame} />
          </div>
          <div>
            <h1 className="gaz-heading" style={{ color: COLORS.text, fontSize: "1.15rem", lineHeight: 1.2 }}>
              Dépôt de gaz
            </h1>
            <p style={{ color: COLORS.muted, fontSize: "0.8rem" }}>Suivi du stock par fournisseur</p>
          </div>
        </header>

        {/* Total + Objectif */}
        <div className="gaz-stats-grid">
          <div className="gaz-panel">
            <Gauge size={110} className="gaz-watermark" color={COLORS.flame} />
            <div className="gaz-section-label">
              <Package size={16} />
              <span>Stock total</span>
            </div>
            <div className="gaz-heading gaz-num gaz-total-number">
              {total}
              <span className="gaz-unit">bouteille{total > 1 ? "s" : ""}</span>
            </div>
          </div>

          <div className="gaz-panel">
            <div className="gaz-section-label" style={{ marginBottom: 12 }}>
              <Target size={16} />
              <span>Objectif</span>
            </div>
            <div className="flex items-end gap-2 mb-4 flex-wrap">
              <input
                type="number"
                min="1"
                inputMode="numeric"
                className="gaz-input gaz-num"
                style={{ padding: "8px 12px", fontSize: "1.1rem", width: "8rem" }}
                value={objectifDraft}
                onChange={(e) => setObjectifDraft(e.target.value)}
              />
              <button
                onClick={handleObjectifSave}
                className="gaz-btn"
                style={{ background: COLORS.butane, color: "#0E1620", fontSize: "0.85rem", padding: "8px 14px", borderRadius: 10, fontWeight: 500 }}
              >
                Modifier
              </button>
            </div>
            <ProgressBar pct={pct} />
            <p style={{ color: COLORS.muted, fontSize: "0.85rem", marginTop: 10 }}>
              {remaining === 0
                ? "Objectif atteint."
                : `Il reste ${remaining} bouteille${remaining > 1 ? "s" : ""} pour atteindre l'objectif.`}
            </p>
          </div>
        </div>

        {/* Brand cards */}
        <div className="gaz-grid">
          {BRANDS.map((b, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <div
                key={b.key}
                className="gaz-card"
                style={{ borderLeft: `3px solid ${accent}` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="gaz-heading" style={{ color: COLORS.text, fontSize: "0.95rem" }}>{b.label}</h3>
                  {confirmed[b.key] && <CheckCircle2 size={15} color={accent} />}
                </div>
                <p className="gaz-heading gaz-num gaz-card-stock mb-3" style={{ color: accent }}>
                  {stock[b.key] || 0}
                  <span style={{ fontFamily: "Inter", fontSize: "0.7rem", color: COLORS.muted, marginLeft: 6 }}>
                    en stock
                  </span>
                </p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    inputMode="numeric"
                    placeholder="Quantité"
                    className="gaz-input"
                    style={{ padding: "7px 10px", fontSize: "0.85rem", width: "100%", minWidth: 0 }}
                    value={inputs[b.key] || ""}
                    onChange={(e) => setInputs((prev) => ({ ...prev, [b.key]: e.target.value }))}
                    onKeyDown={(e) => { if (e.key === "Enter") handleAdd(b.key); }}
                  />
                  <button
                    onClick={() => handleAdd(b.key)}
                    className="gaz-btn flex items-center justify-center flex-shrink-0"
                    style={{ background: accent, color: "#14171C", borderRadius: 10, width: 36, height: 36 }}
                    aria-label={`Ajouter des bouteilles ${b.label}`}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <p className="gaz-footer-note">Les données sont enregistrées automatiquement sur cet appareil.</p>
      </div>
    </div>
  );
}

function ProgressBar({ pct }) {
  return (
    <div>
      <div className="gaz-progress-track">
        <div className="gaz-ticks" />
        <div className="gaz-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-end mt-1.5">
        <span className="gaz-heading gaz-num" style={{ color: "#F1F3F6", fontSize: "0.8rem" }}>
          {Math.round(pct)}%
        </span>
      </div>
    </div>
  );
}

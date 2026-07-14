// Componentes de interface reutilizáveis: botões, campos, cartões e o "selo" da marca.
import React from "react";
import { BRAND } from "../styles/theme";

export function Seal({ text = "APROVADO", size = 92 }) {
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%",
        border: `3px solid ${BRAND.gold}`, display: "flex",
        alignItems: "center", justifyContent: "center", position: "relative",
        flexShrink: 0, background: "radial-gradient(circle at 35% 30%, #123a6b, #071F3D)",
        boxShadow: "0 0 0 4px rgba(201,162,39,0.15)",
      }}
    >
      <div style={{
        width: size - 14, height: size - 14, borderRadius: "50%",
        border: `1px dashed ${BRAND.goldLight}`, display: "flex",
        alignItems: "center", justifyContent: "center", textAlign: "center", padding: 4,
      }}>
        <span style={{
          fontFamily: "'Space Mono', monospace", fontSize: size * 0.12, letterSpacing: 1,
          color: BRAND.goldLight, fontWeight: 700, transform: "rotate(-8deg)",
        }}>{text}</span>
      </div>
    </div>
  );
}

export function Btn({ children, onClick, variant = "primary", style, type = "button", disabled }) {
  const base = {
    fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 14,
    padding: "12px 22px", borderRadius: 8, border: "none",
    cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.6 : 1,
    transition: "transform .15s ease, box-shadow .15s ease",
  };
  const variants = {
    primary: { background: BRAND.red, color: "#fff", boxShadow: "0 4px 14px rgba(214,40,40,0.35)" },
    gold: { background: BRAND.gold, color: BRAND.navyDark, boxShadow: "0 4px 14px rgba(201,162,39,0.35)" },
    outline: { background: "transparent", color: "#fff", border: `1.5px solid ${BRAND.goldLight}` },
    ghost: { background: "rgba(255,255,255,0.08)", color: "#fff" },
    dark: { background: BRAND.navy, color: "#fff" },
  };
  return (
    <button
      type={type} disabled={disabled} onClick={onClick}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
      style={{ ...base, ...variants[variant], ...style }}
    >
      {children}
    </button>
  );
}

export function Field({ label, ...props }) {
  return (
    <label style={{ display: "block", marginBottom: 14, textAlign: "left" }}>
      <span style={{ fontSize: 12.5, fontWeight: 600, color: BRAND.navy, letterSpacing: 0.3 }}>{label}</span>
      <input
        {...props}
        style={{
          width: "100%", marginTop: 6, padding: "11px 13px", borderRadius: 7,
          border: "1.5px solid #D8DCE3", fontSize: 14.5, fontFamily: "'Inter', sans-serif",
          outline: "none", boxSizing: "border-box",
        }}
      />
    </label>
  );
}

export function Card({ children, style }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 14, padding: 22,
      boxShadow: "0 2px 18px rgba(11,46,89,0.08)", border: "1px solid #ECEFF3", ...style,
    }}>
      {children}
    </div>
  );
}

export function Toast({ msg, tone }) {
  return (
    <div style={{
      position: "fixed", top: 14, left: "50%", transform: "translateX(-50%)", zIndex: 999,
      background: tone === "error" ? BRAND.red : BRAND.navyDark, color: "#fff",
      padding: "11px 20px", borderRadius: 8, fontSize: 13.5, fontWeight: 600,
      boxShadow: "0 6px 20px rgba(0,0,0,0.25)", maxWidth: "90vw",
    }}>
      {msg}
    </div>
  );
}

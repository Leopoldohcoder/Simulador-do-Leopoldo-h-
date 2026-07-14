import React from "react";
import { BRAND } from "../styles/theme";

export default function Footer() {
  return (
    <footer style={{ background: BRAND.navyDark, color: "#C9D2DE", marginTop: 48, padding: "26px 18px", textAlign: "center", fontSize: 12.5 }}>
      <div style={{ borderTop: "1px solid rgba(201,162,39,0.25)", paddingTop: 18, maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ fontWeight: 600, color: "#fff", marginBottom: 4 }}>Desenvolvido por Leopoldo Nicolau</div>
        <div>Suporte: +244 931 619 002</div>
        <div style={{ marginTop: 6, color: BRAND.goldLight }}>© 2026 Simulador do Leopoldo'H</div>
      </div>
    </footer>
  );
}

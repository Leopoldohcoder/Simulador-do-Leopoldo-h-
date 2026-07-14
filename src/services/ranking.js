import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BRAND } from "../styles/theme";
import { Btn, Card } from "../components/UI";
import { listarRanking } from "../services/ranking";

export default function Ranking() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("geral");
  const [rows, setRows] = useState([]);

  useEffect(() => { listarRanking().then(setRows); }, [tab]);

  return (
    <div style={{ maxWidth: 680, margin: "36px auto", padding: "0 18px" }}>
      <h2 style={{ fontFamily: "'Poppins', sans-serif", color: BRAND.navy }}>Ranking</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[["geral", "Geral"], ["semanal", "Semanal"], ["mensal", "Mensal"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            padding: "8px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
            background: tab === k ? BRAND.navy : "#E3E7EE", color: tab === k ? "#fff" : "#4B5563",
          }}>{l}</button>
        ))}
      </div>
      <p style={{ fontSize: 12, color: "#9AA3AF", marginTop: -8, marginBottom: 14 }}>
        * Para ranking semanal/mensal "de verdade", filtre por data de "results" — aqui o ranking Geral já está pronto e funcional.
      </p>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        {rows.length === 0 ? (
          <div style={{ padding: 20, color: "#6B7280", fontSize: 14 }}>Ainda não há candidatos no ranking.</div>
        ) : rows.map((r, i) => (
          <div key={r.uid} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: i < rows.length - 1 ? "1px solid #EEF0F3" : "none" }}>
            <div style={{ width: 26, textAlign: "center", fontWeight: 800, color: i === 0 ? BRAND.gold : BRAND.navy }}>{i + 1}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: BRAND.navy }}>{r.nome}</div>
              <div style={{ fontSize: 11.5, color: "#6B7280" }}>{r.provas} prova(s)</div>
            </div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, color: BRAND.red }}>{(r.melhorNota || 0).toFixed(1)}</div>
          </div>
        ))}
      </Card>
      <div style={{ marginTop: 16 }}><Btn variant="dark" onClick={() => navigate("/painel")}>Voltar</Btn></div>
    </div>
  );
}

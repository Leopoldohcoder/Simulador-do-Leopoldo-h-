import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BRAND, fmtTime } from "../styles/theme";
import { Btn, Card } from "../components/UI";
import { useAuth } from "../hooks/useAuth";
import { listarHistorico } from "../services/results";
import SimuladoResultado from "./SimuladoResultado";

export default function Historico() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [ver, setVer] = useState(null);

  useEffect(() => { listarHistorico(user.uid).then(setResults); }, [user.uid]);

  if (ver) return <SimuladoResultado result={ver} />;

  return (
    <div style={{ maxWidth: 780, margin: "36px auto", padding: "0 18px" }}>
      <h2 style={{ fontFamily: "'Poppins', sans-serif", color: BRAND.navy }}>Meu Histórico</h2>
      {results.length === 0 ? (
        <Card><p style={{ color: "#6B7280" }}>Ainda não realizou nenhum simulado.</p></Card>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {results.map((r) => (
            <Card key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <div>
                <div style={{ fontWeight: 700, color: BRAND.navy }}>{r.disciplina}</div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>{new Date(r.data).toLocaleString("pt-PT")} · {fmtTime(r.tempoGasto)}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, color: BRAND.navy }}>{r.nota.toFixed(1)}/20</span>
                <Btn variant="dark" onClick={() => setVer(r)}>Ver correção</Btn>
              </div>
            </Card>
          ))}
        </div>
      )}
      <div style={{ marginTop: 16 }}><Btn variant="dark" onClick={() => navigate("/painel")}>Voltar</Btn></div>
    </div>
  );
}

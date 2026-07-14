import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BRAND, CATEGORIES } from "../styles/theme";
import { Btn, Card } from "../components/UI";
import { listarQuestoes } from "../services/questions";

export default function SimuladoSetup({ setSimCfg }) {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [categoria, setCategoria] = useState("Todas");
  const [qtd, setQtd] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listarQuestoes().then((qs) => { setQuestions(qs); setLoading(false); });
  }, []);

  const available = categoria === "Todas" ? questions : questions.filter((q) => q.categoria === categoria);

  const iniciar = () => {
    const shuffled = [...available].sort(() => Math.random() - 0.5).slice(0, Math.min(qtd, available.length));
    setSimCfg({ perguntas: shuffled, categoria, tempoTotal: Math.max(shuffled.length * 60, 300) });
    navigate("/simulado/prova");
  };

  return (
    <div style={{ maxWidth: 520, margin: "44px auto", padding: "0 18px" }}>
      <Card>
        <h2 style={{ fontFamily: "'Poppins', sans-serif", color: BRAND.navy, marginTop: 0 }}>Configurar Simulado</h2>
        <label style={{ display: "block", marginBottom: 14 }}>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: BRAND.navy }}>Disciplina</span>
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)} style={{ width: "100%", marginTop: 6, padding: 11, borderRadius: 7, border: "1.5px solid #D8DCE3" }}>
            <option>Todas</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label style={{ display: "block", marginBottom: 14 }}>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: BRAND.navy }}>Número de questões</span>
          <select value={qtd} onChange={(e) => setQtd(Number(e.target.value))} style={{ width: "100%", marginTop: 6, padding: 11, borderRadius: 7, border: "1.5px solid #D8DCE3" }}>
            {[5, 10, 15, 20].map((n) => <option key={n} value={n}>{n} questões</option>)}
          </select>
        </label>
        <p style={{ fontSize: 12.5, color: "#6B7280" }}>{loading ? "A carregar questões…" : `${available.length} questões disponíveis nesta disciplina.`}</p>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="dark" onClick={() => navigate("/painel")}>Cancelar</Btn>
          <Btn variant="primary" disabled={available.length === 0} onClick={iniciar}>Iniciar Prova</Btn>
        </div>
      </Card>
    </div>
  );
}

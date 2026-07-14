import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BRAND } from "../styles/theme";
import { Btn, Card } from "../components/UI";
import { useAuth } from "../hooks/useAuth";
import { listarHistorico } from "../services/results";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

export default function Painel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    (async () => {
      const rankSnap = await getDoc(doc(db, "ranking", user.uid));
      const r = rankSnap.exists() ? rankSnap.data() : { provas: 0, melhorNota: 0, somaNotas: 0 };
      const historico = await listarHistorico(user.uid);
      setStats({
        provas: r.provas || 0,
        melhorNota: r.melhorNota || 0,
        media: r.provas ? (r.somaNotas / r.provas).toFixed(1) : "0.0",
        ultimo: historico[0] ? new Date(historico[0].data).toLocaleString("pt-PT") : "—",
      });
    })();
  }, [user.uid]);

  return (
    <div style={{ maxWidth: 900, margin: "36px auto", padding: "0 18px" }}>
      <h2 style={{ fontFamily: "'Poppins', sans-serif", color: BRAND.navy }}>Olá, {user.nome.split(" ")[0]} 👋</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 22 }}>
        {stats && [
          ["Simulados realizados", stats.provas],
          ["Melhor nota", stats.melhorNota],
          ["Média", stats.media],
          ["Último acesso", stats.ultimo],
        ].map(([l, v]) => (
          <Card key={l} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 22, fontWeight: 700, color: BRAND.navy }}>{v}</div>
            <div style={{ fontSize: 11.5, color: "#6B7280", marginTop: 4 }}>{l}</div>
          </Card>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Btn variant="primary" onClick={() => navigate("/simulado")}>Iniciar Simulado</Btn>
        <Btn variant="dark" onClick={() => navigate("/historico")}>Meu Histórico</Btn>
        <Btn variant="dark" onClick={() => navigate("/ranking")}>Ranking</Btn>
        <Btn variant="dark" onClick={() => navigate("/material")}>Material de Estudo</Btn>
        <Btn variant="dark" onClick={() => navigate("/perfil")}>Perfil</Btn>
      </div>
    </div>
  );
}

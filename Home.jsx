import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BRAND } from "../styles/theme";
import { Btn, Card, Seal } from "../components/UI";
import { obterAvisoAtual } from "../services/notifications";

export default function Home() {
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    obterAvisoAtual().then(setNotice).catch(() => {});
  }, []);

  return (
    <div>
      <section style={{ background: `linear-gradient(160deg, ${BRAND.navyDark}, ${BRAND.navy})`, color: "#fff", padding: "60px 18px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", alignItems: "center", gap: 34, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 380px" }}>
            <div style={{ color: BRAND.goldLight, fontWeight: 700, fontSize: 13, letterSpacing: 1.5, marginBottom: 10 }}>
              PREPARAÇÃO PARA CONCURSOS PÚBLICOS DE ANGOLA
            </div>
            <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 800, lineHeight: 1.15, margin: "0 0 14px" }}>
              SIMULADOR DO<br />LEOPOLDO'H
            </h1>
            <p style={{ fontSize: 16, color: "#D7DEEA", maxWidth: 460, marginBottom: 26 }}>
              Treine com questões reais de concursos públicos, cronómetro de prova, correção comentada
              e acompanhe a sua evolução até à aprovação.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Btn variant="primary" onClick={() => navigate("/cadastro")}>Criar Conta</Btn>
              <Btn variant="outline" onClick={() => navigate("/login")}>Entrar</Btn>
            </div>
          </div>
          <div style={{ flex: "0 0 auto", display: "flex", justifyContent: "center", width: "100%", maxWidth: 220 }}>
            <Seal text="APROVADO" size={190} />
          </div>
        </div>
      </section>

      {notice && (
        <div style={{ maxWidth: 1080, margin: "18px auto 0", padding: "0 18px" }}>
          <div style={{ background: "#FFF6E0", border: `1px solid ${BRAND.gold}`, borderRadius: 10, padding: "12px 16px", fontSize: 13.5 }}>
            <strong style={{ color: BRAND.navy }}>Aviso: </strong>{notice.texto}
          </div>
        </div>
      )}

      <section style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 18px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          {[
            ["11 Disciplinas", "Do Português à Aptidão Física, cobrindo o edital completo."],
            ["Provas cronometradas", "Simule a pressão real do dia do exame."],
            ["Correção comentada", "Entenda o porquê de cada resposta certa e errada."],
            ["Ranking", "Compare o seu desempenho com outros candidatos."],
          ].map(([t, d]) => (
            <Card key={t}>
              <div style={{ width: 8, height: 8, background: BRAND.red, borderRadius: 2, marginBottom: 10 }} />
              <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: BRAND.navy, marginBottom: 6 }}>{t}</div>
              <div style={{ fontSize: 13.5, color: "#4B5563" }}>{d}</div>
            </Card>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 26, flexWrap: "wrap" }}>
          <Btn variant="dark" onClick={() => navigate("/material")}>Material de Estudo</Btn>
          <Btn variant="dark" onClick={() => navigate("/sobre")}>Sobre</Btn>
          <Btn variant="dark" onClick={() => navigate("/suporte")}>Suporte</Btn>
        </div>
      </section>
    </div>
  );
}

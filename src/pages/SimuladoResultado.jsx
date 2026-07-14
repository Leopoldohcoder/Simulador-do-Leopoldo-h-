import React from "react";
import { useNavigate } from "react-router-dom";
import { BRAND, fmtTime } from "../styles/theme";
import { Btn, Card, Seal } from "../components/UI";

export default function SimuladoResultado({ result }) {
  const navigate = useNavigate();
  if (!result) { navigate("/painel"); return null; }
  const aprovado = result.nota >= 10;

  return (
    <div style={{ maxWidth: 680, margin: "36px auto", padding: "0 18px" }}>
      <Card style={{ textAlign: "center", marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
          <Seal text={aprovado ? "APROVADO" : "REVER"} size={100} />
        </div>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 34, fontWeight: 700, color: BRAND.navy }}>{result.nota.toFixed(1)}/20</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 22, marginTop: 14, flexWrap: "wrap" }}>
          <div><div style={{ fontWeight: 700, color: "#16A34A" }}>{result.acertos}</div><div style={{ fontSize: 11.5, color: "#6B7280" }}>Acertos</div></div>
          <div><div style={{ fontWeight: 700, color: BRAND.red }}>{result.erros}</div><div style={{ fontSize: 11.5, color: "#6B7280" }}>Erros</div></div>
          <div><div style={{ fontWeight: 700, color: BRAND.navy }}>{fmtTime(result.tempoGasto)}</div><div style={{ fontSize: 11.5, color: "#6B7280" }}>Tempo</div></div>
        </div>
      </Card>

      <h3 style={{ fontFamily: "'Poppins', sans-serif", color: BRAND.navy }}>Correção comentada</h3>
      <div style={{ display: "grid", gap: 10 }}>
        {result.respostas.map((r, i) => {
          const acertou = r.escolhida === r.correta;
          return (
            <Card key={i} style={{ borderLeft: `4px solid ${acertou ? "#16A34A" : BRAND.red}` }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{i + 1}. {r.pergunta}</div>
              <div style={{ fontSize: 13, color: "#374151", marginBottom: 4 }}>
                Sua resposta: {r.escolhida != null ? r.alternativas[r.escolhida] : "Não respondida"} {acertou ? "✔" : "✘"}
              </div>
              {!acertou && <div style={{ fontSize: 13, color: "#16A34A", marginBottom: 4 }}>Correta: {r.alternativas[r.correta]}</div>}
              <div style={{ fontSize: 12.5, color: "#6B7280" }}>{r.explicacao}</div>
            </Card>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <Btn variant="dark" onClick={() => navigate("/painel")}>Voltar ao Painel</Btn>
        <Btn variant="primary" onClick={() => navigate("/simulado")}>Novo Simulado</Btn>
      </div>
    </div>
  );
}

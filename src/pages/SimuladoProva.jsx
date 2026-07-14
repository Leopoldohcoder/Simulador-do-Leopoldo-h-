import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BRAND, fmtTime } from "../styles/theme";
import { Btn, Card } from "../components/UI";
import { useAuth } from "../hooks/useAuth";
import { salvarResultado } from "../services/results";

export default function SimuladoProva({ cfg, setLastResult, showToast }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const [respostas, setRespostas] = useState([]);
  const [selected, setSelected] = useState(null);
  const [tempo, setTempo] = useState(cfg?.tempoTotal || 300);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    if (!cfg) { navigate("/simulado"); return; }
    const t = setInterval(() => {
      setTempo((prev) => {
        if (prev <= 1) { clearInterval(t); finalizar(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!cfg) return null;
  const perguntas = cfg.perguntas;
  const atual = perguntas[idx];

  const next = () => {
    const novo = [...respostas, { pergunta: atual.pergunta, escolhida: selected, correta: atual.correta, alternativas: atual.alternativas, explicacao: atual.explicacao, categoria: atual.categoria }];
    setRespostas(novo);
    setSelected(null);
    if (idx + 1 < perguntas.length) setIdx(idx + 1);
    else finalizarComRespostas(novo);
  };

  const finalizar = (auto) => {
    const novo = selected !== null
      ? [...respostas, { pergunta: atual.pergunta, escolhida: selected, correta: atual.correta, alternativas: atual.alternativas, explicacao: atual.explicacao, categoria: atual.categoria }]
      : respostas;
    finalizarComRespostas(novo, auto);
  };

  const finalizarComRespostas = async (todas, auto) => {
    const acertos = todas.filter((r) => r.escolhida === r.correta).length;
    const total = perguntas.length;
    const naoRespondidas = total - todas.length;
    const nota = total ? Math.round((acertos / total) * 20 * 10) / 10 : 0;
    const tempoGasto = Math.round((Date.now() - startedAt.current) / 1000);

    const result = {
      disciplina: cfg.categoria,
      data: new Date().toISOString(),
      nota, acertos, erros: (todas.length - acertos) + naoRespondidas, total, tempoGasto, respostas: todas,
    };
    await salvarResultado(user.uid, result);
    setLastResult(result);
    if (auto) showToast("Tempo esgotado! Prova finalizada automaticamente.");
    navigate("/simulado/resultado");
  };

  const progresso = (idx / perguntas.length) * 100;

  return (
    <div style={{ maxWidth: 640, margin: "30px auto", padding: "0 18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 12.5, color: "#6B7280", fontWeight: 600 }}>Questão {idx + 1} de {perguntas.length} · {atual.categoria}</span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, color: tempo < 30 ? BRAND.red : BRAND.navy, fontSize: 16 }}>{fmtTime(tempo)}</span>
      </div>
      <div style={{ height: 8, background: "#E3E7EE", borderRadius: 4, marginBottom: 20, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${progresso}%`, background: BRAND.red, transition: "width .3s" }} />
      </div>
      <Card>
        <div style={{ fontWeight: 700, fontSize: 16, color: BRAND.navy, marginBottom: 16, lineHeight: 1.5 }}>{atual.pergunta}</div>
        <div style={{ display: "grid", gap: 9 }}>
          {atual.alternativas.map((alt, i) => (
            <div key={i} onClick={() => setSelected(i)} style={{
              padding: "12px 14px", borderRadius: 8,
              border: `1.5px solid ${selected === i ? BRAND.navy : "#E3E7EE"}`,
              background: selected === i ? "#EEF2F8" : "#fff", cursor: "pointer", fontSize: 14,
              display: "flex", gap: 10, alignItems: "center",
            }}>
              <span style={{ width: 22, height: 22, borderRadius: "50%", border: `1.5px solid ${selected === i ? BRAND.navy : "#C9CFD8"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11.5, fontWeight: 700, color: selected === i ? BRAND.navy : "#9AA3AF", flexShrink: 0 }}>
                {String.fromCharCode(65 + i)}
              </span>
              {alt}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
          <Btn variant="outline" style={{ color: BRAND.red, borderColor: BRAND.red }} onClick={() => finalizar(false)}>Finalizar</Btn>
          <Btn variant="primary" disabled={selected === null} onClick={next}>{idx + 1 === perguntas.length ? "Concluir" : "Próxima"}</Btn>
        </div>
      </Card>
    </div>
  );
}

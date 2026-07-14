import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BRAND, CATEGORIES } from "../styles/theme";
import { Btn, Card, Field } from "../components/UI";
import { listarQuestoes, criarQuestao, atualizarQuestao, excluirQuestao } from "../services/questions";
import { listarCandidatos, definirBloqueio } from "../services/users";
import { listarRanking } from "../services/ranking";
import { publicarAviso } from "../services/notifications";

function questaoVazia() {
  return { categoria: CATEGORIES[0], dificuldade: "Fácil", tema: "", pergunta: "", alternativas: ["", "", "", ""], correta: 0, explicacao: "" };
}

export default function Admin({ showToast }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState("questoes");
  const [questions, setQuestions] = useState([]);
  const [candidatos, setCandidatos] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [novo, setNovo] = useState(questaoVazia());
  const [editId, setEditId] = useState(null);
  const [aviso, setAviso] = useState("");
  const [busca, setBusca] = useState("");

  const loadQuestions = () => listarQuestoes().then(setQuestions);
  useEffect(() => { loadQuestions(); }, []);
  useEffect(() => { if (tab === "candidatos") listarCandidatos().then(setCandidatos); }, [tab]);
  useEffect(() => { if (tab === "estatisticas") listarRanking().then(setRanking); }, [tab]);

  const salvarQuestao = async () => {
    if (!novo.pergunta || novo.alternativas.some((a) => !a)) return showToast("Preencha a pergunta e as 4 alternativas.", "error");
    if (editId) await atualizarQuestao(editId, novo);
    else await criarQuestao(novo);
    showToast(editId ? "Questão atualizada." : "Questão adicionada.");
    setNovo(questaoVazia());
    setEditId(null);
    loadQuestions();
  };

  const editar = (q) => { setNovo(q); setEditId(q.id); setTab("questoes"); };
  const excluir = async (id) => { await excluirQuestao(id); loadQuestions(); showToast("Questão excluída."); };

  const bloquear = async (c, bloq) => {
    await definirBloqueio(c.uid, bloq);
    listarCandidatos().then(setCandidatos);
  };

  const enviarAviso = async () => {
    if (!aviso) return;
    await publicarAviso(aviso);
    showToast("Aviso publicado na página inicial.");
    setAviso("");
  };

  const candidatosFiltrados = candidatos.filter((c) => !c.isAdmin && (c.nome.toLowerCase().includes(busca.toLowerCase()) || c.telefone.includes(busca)));
  const totalProvas = ranking.reduce((s, r) => s + (r.provas || 0), 0);
  const mediaGeral = totalProvas ? (ranking.reduce((s, r) => s + (r.somaNotas || 0), 0) / totalProvas).toFixed(1) : "0.0";

  return (
    <div style={{ maxWidth: 900, margin: "30px auto", padding: "0 18px" }}>
      <h2 style={{ fontFamily: "'Poppins', sans-serif", color: BRAND.navy }}>Área Administrativa</h2>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
        {[["questoes", "Questões"], ["candidatos", "Candidatos"], ["estatisticas", "Estatísticas"], ["avisos", "Avisos"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{ padding: "8px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: tab === k ? BRAND.navy : "#E3E7EE", color: tab === k ? "#fff" : "#4B5563" }}>{l}</button>
        ))}
      </div>

      {tab === "questoes" && (
        <div>
          <Card style={{ marginBottom: 18 }}>
            <div style={{ fontWeight: 700, color: BRAND.navy, marginBottom: 10 }}>{editId ? "Editar questão" : "Adicionar questão"}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <label style={{ display: "block", marginBottom: 10 }}>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: BRAND.navy }}>Categoria</span>
                <select value={novo.categoria} onChange={(e) => setNovo({ ...novo, categoria: e.target.value })} style={{ width: "100%", marginTop: 6, padding: 10, borderRadius: 7, border: "1.5px solid #D8DCE3" }}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </label>
              <label style={{ display: "block", marginBottom: 10 }}>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: BRAND.navy }}>Dificuldade</span>
                <select value={novo.dificuldade} onChange={(e) => setNovo({ ...novo, dificuldade: e.target.value })} style={{ width: "100%", marginTop: 6, padding: 10, borderRadius: 7, border: "1.5px solid #D8DCE3" }}>
                  <option>Fácil</option><option>Médio</option><option>Difícil</option>
                </select>
              </label>
            </div>
            <Field label="Tema" value={novo.tema} onChange={(e) => setNovo({ ...novo, tema: e.target.value })} />
            <Field label="Pergunta" value={novo.pergunta} onChange={(e) => setNovo({ ...novo, pergunta: e.target.value })} />
            {novo.alternativas.map((a, i) => (
              <Field key={i} label={`Alternativa ${String.fromCharCode(65 + i)}`} value={a} onChange={(e) => { const arr = [...novo.alternativas]; arr[i] = e.target.value; setNovo({ ...novo, alternativas: arr }); }} />
            ))}
            <label style={{ display: "block", marginBottom: 10 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: BRAND.navy }}>Resposta correta</span>
              <select value={novo.correta} onChange={(e) => setNovo({ ...novo, correta: Number(e.target.value) })} style={{ width: "100%", marginTop: 6, padding: 10, borderRadius: 7, border: "1.5px solid #D8DCE3" }}>
                {novo.alternativas.map((_, i) => <option key={i} value={i}>{String.fromCharCode(65 + i)}</option>)}
              </select>
            </label>
            <Field label="Explicação" value={novo.explicacao} onChange={(e) => setNovo({ ...novo, explicacao: e.target.value })} />
            <div style={{ display: "flex", gap: 10 }}>
              <Btn variant="primary" onClick={salvarQuestao}>{editId ? "Guardar alterações" : "Adicionar questão"}</Btn>
              {editId && <Btn variant="outline" onClick={() => { setNovo(questaoVazia()); setEditId(null); }}>Cancelar edição</Btn>}
            </div>
          </Card>

          <div style={{ fontWeight: 700, color: BRAND.navy, marginBottom: 8 }}>Banco de questões ({questions.length})</div>
          <div style={{ display: "grid", gap: 8 }}>
            {questions.map((q) => (
              <Card key={q.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{q.pergunta}</div>
                  <div style={{ fontSize: 11.5, color: "#6B7280" }}>{q.categoria} · {q.dificuldade}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn variant="dark" onClick={() => editar(q)}>Editar</Btn>
                  <Btn variant="outline" style={{ color: BRAND.red, borderColor: BRAND.red }} onClick={() => excluir(q.id)}>Excluir</Btn>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab === "candidatos" && (
        <div>
          <Field label="Pesquisar candidato (nome ou telefone)" value={busca} onChange={(e) => setBusca(e.target.value)} />
          <div style={{ display: "grid", gap: 8 }}>
            {candidatosFiltrados.map((c) => (
              <Card key={c.uid} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                <div>
                  <div style={{ fontWeight: 700, color: BRAND.navy }}>{c.nome}</div>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>{c.telefone} · {c.bloqueado ? "Bloqueado" : "Ativo"}</div>
                </div>
                {c.bloqueado ? (
                  <Btn variant="dark" onClick={() => bloquear(c, false)}>Desbloquear</Btn>
                ) : (
                  <Btn variant="outline" style={{ color: BRAND.red, borderColor: BRAND.red }} onClick={() => bloquear(c, true)}>Bloquear</Btn>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab === "estatisticas" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12 }}>
          {[["Candidatos", candidatos.filter((c) => !c.isAdmin).length], ["Questões no banco", questions.length], ["Provas realizadas", totalProvas], ["Média geral", mediaGeral]].map(([l, v]) => (
            <Card key={l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 22, fontWeight: 700, color: BRAND.navy }}>{v}</div>
              <div style={{ fontSize: 11.5, color: "#6B7280", marginTop: 4 }}>{l}</div>
            </Card>
          ))}
        </div>
      )}

      {tab === "avisos" && (
        <Card>
          <div style={{ fontWeight: 700, color: BRAND.navy, marginBottom: 10 }}>Publicar aviso na página inicial</div>
          <Field label="Mensagem" value={aviso} onChange={(e) => setAviso(e.target.value)} />
          <Btn variant="primary" onClick={enviarAviso}>Publicar Aviso</Btn>
        </Card>
      )}

      <div style={{ marginTop: 18 }}><Btn variant="dark" onClick={() => navigate("/")}>Sair da Área Admin</Btn></div>
    </div>
  );
}

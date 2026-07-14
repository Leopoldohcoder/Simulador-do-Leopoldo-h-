import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BRAND } from "../styles/theme";
import { Btn, Card, Field } from "../components/UI";
import { useAuth } from "../hooks/useAuth";
import { listarMateriais, adicionarMaterial, excluirMaterial } from "../services/materials";

export default function Material({ showToast }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ titulo: "", tipo: "Link", url: "" });

  const load = () => listarMateriais().then(setItems);
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.titulo || !form.url) return showToast("Preencha título e link.", "error");
    await adicionarMaterial(form);
    showToast("Material adicionado.");
    setForm({ titulo: "", tipo: "Link", url: "" });
    load();
  };

  const remove = async (id) => { await excluirMaterial(id); load(); };

  return (
    <div style={{ maxWidth: 780, margin: "40px auto", padding: "0 18px" }}>
      <h2 style={{ fontFamily: "'Poppins', sans-serif", color: BRAND.navy }}>Material de Estudo</h2>
      {user?.isAdmin && (
        <Card style={{ marginBottom: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Título" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
            <label style={{ display: "block", marginBottom: 14 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: BRAND.navy }}>Tipo</span>
              <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} style={{ width: "100%", marginTop: 6, padding: 10, borderRadius: 7, border: "1.5px solid #D8DCE3" }}>
                <option>Link</option><option>PDF</option><option>Vídeo</option><option>Resumo</option>
              </select>
            </label>
          </div>
          <Field label="URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
          <Btn variant="primary" onClick={add}>Adicionar</Btn>
        </Card>
      )}
      {items.length === 0 ? (
        <Card><p style={{ color: "#6B7280", fontSize: 14 }}>Ainda não há materiais publicados.</p></Card>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {items.map((m) => (
            <Card key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <div>
                <div style={{ fontWeight: 700, color: BRAND.navy }}>{m.titulo}</div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>{m.tipo}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <a href={m.url} target="_blank" rel="noreferrer"><Btn variant="dark">Abrir</Btn></a>
                {user?.isAdmin && <Btn variant="outline" style={{ color: BRAND.red, borderColor: BRAND.red }} onClick={() => remove(m.id)}>Excluir</Btn>}
              </div>
            </Card>
          ))}
        </div>
      )}
      <div style={{ marginTop: 16 }}><Btn variant="dark" onClick={() => navigate("/")}>Voltar</Btn></div>
    </div>
  );
}

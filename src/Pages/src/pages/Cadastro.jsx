import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BRAND } from "../styles/theme";
import { Btn, Card, Field } from "../components/UI";
import { registar } from "../firebase/auth";
import { useAuth } from "../hooks/useAuth";

export default function Cadastro({ showToast }) {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [f, setF] = useState({ nome: "", telefone: "", senha: "", confirmar: "" });
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!f.nome || !f.telefone || !f.senha || !f.confirmar) return showToast("Preencha todos os campos.", "error");
    if (f.senha !== f.confirmar) return showToast("As palavras-passe não coincidem.", "error");
    if (f.senha.length < 6) return showToast("A palavra-passe deve ter pelo menos 6 caracteres.", "error");
    setBusy(true);
    try {
      const perfil = await registar(f.nome, f.telefone, f.senha);
      setUser(perfil);
      showToast("Conta criada com sucesso!");
      navigate("/painel");
    } catch (e) {
      if (e.code === "auth/email-already-in-use") showToast("Este número já está cadastrado.", "error");
      else showToast("Não foi possível criar a conta. Tente novamente.", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ maxWidth: 440, margin: "44px auto", padding: "0 18px" }}>
      <Card>
        <h2 style={{ fontFamily: "'Poppins', sans-serif", color: BRAND.navy, marginTop: 0 }}>Criar Conta</h2>
        <Field label="Nome completo" value={f.nome} onChange={(e) => setF({ ...f, nome: e.target.value })} />
        <Field label="Número de telefone" value={f.telefone} onChange={(e) => setF({ ...f, telefone: e.target.value })} placeholder="9XXXXXXXX" />
        <Field label="Palavra-passe" type="password" value={f.senha} onChange={(e) => setF({ ...f, senha: e.target.value })} />
        <Field label="Confirmar palavra-passe" type="password" value={f.confirmar} onChange={(e) => setF({ ...f, confirmar: e.target.value })} />
        <Btn variant="primary" onClick={submit} disabled={busy} style={{ width: "100%" }}>{busy ? "A criar…" : "Criar Conta"}</Btn>
        <div style={{ marginTop: 12, fontSize: 13, textAlign: "center", color: "#6B7280" }}>
          Já tem conta? <span style={{ color: BRAND.red, cursor: "pointer", fontWeight: 600 }} onClick={() => navigate("/login")}>Entrar</span>
        </div>
      </Card>
    </div>
  );
}

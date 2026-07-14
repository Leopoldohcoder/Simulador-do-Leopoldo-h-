import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BRAND } from "../styles/theme";
import { Btn, Card, Field } from "../components/UI";
import { entrar } from "../firebase/auth";
import { useAuth } from "../hooks/useAuth";

export default function Login({ showToast }) {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!telefone || !senha) return showToast("Preencha número e palavra-passe.", "error");
    setBusy(true);
    try {
      const perfil = await entrar(telefone, senha);
      setUser(perfil);
      showToast(`Bem-vindo(a), ${perfil.nome}!`);
      navigate(perfil.isAdmin ? "/admin" : "/painel");
    } catch (e) {
      if (e.message === "conta-bloqueada") showToast("A sua conta está bloqueada. Contacte o suporte.", "error");
      else if (e.code === "auth/user-not-found" || e.code === "auth/invalid-credential") showToast("Número ou palavra-passe incorretos.", "error");
      else showToast("Palavra-passe incorreta. Tente novamente.", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "60px auto", padding: "0 18px" }}>
      <Card>
        <h2 style={{ fontFamily: "'Poppins', sans-serif", color: BRAND.navy, marginTop: 0 }}>Entrar</h2>
        <Field label="Número" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="9XXXXXXXX" />
        <Field label="Palavra-passe" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
        <Btn variant="primary" onClick={submit} disabled={busy} style={{ width: "100%" }}>{busy ? "A entrar…" : "Entrar"}</Btn>
        <div style={{ marginTop: 12, fontSize: 13, textAlign: "center", color: "#6B7280" }}>
          Não tem conta? <span style={{ color: BRAND.red, cursor: "pointer", fontWeight: 600 }} onClick={() => navigate("/cadastro")}>Criar Conta</span>
        </div>
      </Card>
    </div>
  );
}

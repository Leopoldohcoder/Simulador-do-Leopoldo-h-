import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updatePassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { BRAND } from "../styles/theme";
import { Btn, Card, Field } from "../components/UI";
import { useAuth } from "../hooks/useAuth";
import { atualizarPerfil } from "../services/users";

export default function Perfil({ showToast }) {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [nome, setNome] = useState(user.nome);
  const [novaSenha, setNovaSenha] = useState("");

  const salvar = async () => {
    try {
      await atualizarPerfil(user.uid, { nome });
      if (novaSenha) {
        if (novaSenha.length < 6) return showToast("A nova palavra-passe deve ter pelo menos 6 caracteres.", "error");
        await updatePassword(auth.currentUser, novaSenha);
      }
      setUser({ ...user, nome });
      showToast("Perfil atualizado.");
      setNovaSenha("");
    } catch (e) {
      showToast("Não foi possível guardar. Tente sair e entrar novamente.", "error");
    }
  };

  return (
    <div style={{ maxWidth: 440, margin: "44px auto", padding: "0 18px" }}>
      <Card>
        <h2 style={{ fontFamily: "'Poppins', sans-serif", color: BRAND.navy, marginTop: 0 }}>Meu Perfil</h2>
        <Field label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        <Field label="Telefone" value={user.telefone} disabled />
        <Field label="Nova palavra-passe (opcional)" type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} />
        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="dark" onClick={() => navigate("/painel")}>Voltar</Btn>
          <Btn variant="primary" onClick={salvar}>Guardar</Btn>
        </div>
      </Card>
    </div>
  );
}

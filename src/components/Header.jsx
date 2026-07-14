import React from "react";
import { useNavigate } from "react-router-dom";
import { BRAND } from "../styles/theme";
import { Btn, Seal } from "./UI";

export default function Header({ user, onLogout }) {
  const navigate = useNavigate();
  return (
    <header style={{ background: BRAND.navyDark, borderBottom: `3px solid ${BRAND.gold}`, position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "12px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => navigate("/")}>
          <Seal text="LH" size={38} />
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, color: "#fff", fontSize: 15.5 }}>SIMULADOR DO LEOPOLDO'H</div>
            <div style={{ fontSize: 10.5, color: BRAND.goldLight, fontWeight: 500 }}>Sua aprovação começa aqui.</div>
          </div>
        </div>
        <nav style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
          {user ? (
            <>
              <Btn variant="ghost" onClick={() => navigate("/painel")}>Painel</Btn>
              {user.isAdmin && <Btn variant="ghost" onClick={() => navigate("/admin")}>Admin</Btn>}
              <Btn variant="outline" onClick={onLogout}>Sair</Btn>
            </>
          ) : (
            <>
              <Btn variant="ghost" onClick={() => navigate("/sobre")}>Sobre</Btn>
              <Btn variant="ghost" onClick={() => navigate("/material")}>Material</Btn>
              <Btn variant="outline" onClick={() => navigate("/login")}>Entrar</Btn>
              <Btn variant="gold" onClick={() => navigate("/cadastro")}>Criar Conta</Btn>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

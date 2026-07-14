import React from "react";
import { useNavigate } from "react-router-dom";
import { BRAND } from "../styles/theme";
import { Btn, Card } from "../components/UI";

export default function Suporte() {
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: "0 18px" }}>
      <Card>
        <h2 style={{ fontFamily: "'Poppins', sans-serif", color: BRAND.navy }}>Suporte</h2>
        <p style={{ color: "#4B5563", fontSize: 14.5 }}>Para dúvidas, sugestões ou problemas técnicos, contacte:</p>
        <p style={{ fontWeight: 700, color: BRAND.navy, fontSize: 16 }}>+244 931 619 002</p>
        <Btn variant="dark" onClick={() => navigate("/")}>Voltar</Btn>
      </Card>
    </div>
  );
}

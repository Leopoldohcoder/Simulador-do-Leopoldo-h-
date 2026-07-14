import React from "react";
import { useNavigate } from "react-router-dom";
import { BRAND } from "../styles/theme";
import { Btn, Card } from "../components/UI";

export default function Sobre() {
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: "0 18px" }}>
      <Card>
        <h2 style={{ fontFamily: "'Poppins', sans-serif", color: BRAND.navy }}>Sobre o Simulador</h2>
        <p style={{ color: "#4B5563", fontSize: 14.5, lineHeight: 1.7 }}>
          O Simulador do Leopoldo'H foi criado para apoiar candidatos a concursos públicos em Angola,
          reunindo questões organizadas por disciplina, provas cronometradas e correção comentada,
          para que cada candidato chegue ao dia do exame com confiança.
        </p>
        <Btn variant="dark" onClick={() => navigate("/")}>Voltar</Btn>
      </Card>
    </div>
  );
}

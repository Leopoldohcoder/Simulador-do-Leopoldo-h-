// Componente raiz: define as rotas da aplicação e o estado partilhado
// entre o fluxo de simulado (setup -> prova -> resultado).
import React, { useState, useCallback } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Toast } from "./components/UI";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import { sair } from "./firebase/auth";
import { BRAND } from "./styles/theme";

import Home from "./pages/Home";
import Sobre from "./pages/Sobre";
import Suporte from "./pages/Suporte";
import Material from "./pages/Material";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import Painel from "./pages/Painel";
import Perfil from "./pages/Perfil";
import SimuladoSetup from "./pages/SimuladoSetup";
import SimuladoProva from "./pages/SimuladoProva";
import SimuladoResultado from "./pages/SimuladoResultado";
import Historico from "./pages/Historico";
import Ranking from "./pages/Ranking";
import Admin from "./pages/Admin";

export default function App() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [simCfg, setSimCfg] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  const showToast = useCallback((msg, tone = "ok") => {
    setToast({ msg, tone });
    setTimeout(() => setToast(null), 3200);
  }, []);

  const handleLogout = async () => {
    await sair();
    navigate("/");
  };

  if (loading) {
    return <div style={{ padding: 80, textAlign: "center", color: BRAND.navy }}>A carregar…</div>;
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh", background: BRAND.paper, color: BRAND.ink }}>
      <Header user={user} onLogout={handleLogout} />
      {toast && <Toast msg={toast.msg} tone={toast.tone} />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/suporte" element={<Suporte />} />
          <Route path="/material" element={<Material showToast={showToast} />} />
          <Route path="/cadastro" element={<Cadastro showToast={showToast} />} />
          <Route path="/login" element={<Login showToast={showToast} />} />

          <Route path="/painel" element={<ProtectedRoute><Painel /></ProtectedRoute>} />
          <Route path="/perfil" element={<ProtectedRoute><Perfil showToast={showToast} /></ProtectedRoute>} />
          <Route path="/historico" element={<ProtectedRoute><Historico /></ProtectedRoute>} />
          <Route path="/ranking" element={<ProtectedRoute><Ranking /></ProtectedRoute>} />
          <Route path="/simulado" element={<ProtectedRoute><SimuladoSetup setSimCfg={setSimCfg} /></ProtectedRoute>} />
          <Route path="/simulado/prova" element={<ProtectedRoute><SimuladoProva cfg={simCfg} setLastResult={setLastResult} showToast={showToast} /></ProtectedRoute>} />
          <Route path="/simulado/resultado" element={<ProtectedRoute><SimuladoResultado result={lastResult} /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><Admin showToast={showToast} /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

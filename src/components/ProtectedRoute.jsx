// Protege rotas privadas: sem sessão ativa, redireciona para /login.
// Com adminOnly, exige também que o utilizador seja administrador.
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: 80, textAlign: "center" }}>A carregar…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !user.isAdmin) return <Navigate to="/painel" replace />;
  return children;
}

// Avisos exibidos na página inicial (coleção "notifications", documento único "latest").
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export async function obterAvisoAtual() {
  const snap = await getDoc(doc(db, "notifications", "latest"));
  return snap.exists() ? snap.data() : null;
}

export async function publicarAviso(texto) {
  await setDoc(doc(db, "notifications", "latest"), { texto, data: new Date().toISOString() });
}

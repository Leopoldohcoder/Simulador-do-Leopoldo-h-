// Gestão de candidatos para a área administrativa (coleção "users").
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export async function listarCandidatos() {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
}

export async function definirBloqueio(uid, bloqueado) {
  await setDoc(doc(db, "users", uid), { bloqueado }, { merge: true });
}

export async function atualizarPerfil(uid, dados) {
  await setDoc(doc(db, "users", uid), dados, { merge: true });
}

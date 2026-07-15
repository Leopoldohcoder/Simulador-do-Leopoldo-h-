// Leitura do ranking (coleção "ranking", um documento por utilizador).
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

export async function listarRanking() {
  const snap = await getDocs(collection(db, "ranking"));
  const list = snap.docs
    .map((d) => ({ uid: d.id, ...d.data() }))
    .filter((r) => (r.provas || 0) > 0);
  list.sort((a, b) => (b.melhorNota || 0) - (a.melhorNota || 0));
  return list;
}

// Resultados de simulados (coleção "results") e atualização do ranking agregado.
import { collection, doc, getDocs, query, where, addDoc, getDoc, setDoc, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";

export async function salvarResultado(uid, resultado) {
  await addDoc(collection(db, "results"), { uid, ...resultado });

  const rankRef = doc(db, "ranking", uid);
  const rankSnap = await getDoc(rankRef);
  const atual = rankSnap.exists() ? rankSnap.data() : { provas: 0, melhorNota: 0, somaNotas: 0 };
  await setDoc(
    rankRef,
    {
      provas: (atual.provas || 0) + 1,
      somaNotas: (atual.somaNotas || 0) + resultado.nota,
      melhorNota: Math.max(atual.melhorNota || 0, resultado.nota),
    },
    { merge: true }
  );
}

export async function listarHistorico(uid) {
  const q = query(collection(db, "results"), where("uid", "==", uid));
  const snap = await getDocs(q);
  const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  list.sort((a, b) => new Date(b.data) - new Date(a.data));
  return list;
}

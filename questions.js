// CRUD do banco de questões (coleção "questions" no Firestore).
import { collection, doc, getDocs, setDoc, deleteDoc, addDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const col = collection(db, "questions");

export async function listarQuestoes() {
  const snap = await getDocs(col);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function criarQuestao(questao) {
  const ref = await addDoc(col, questao);
  return ref.id;
}

export async function atualizarQuestao(id, questao) {
  await setDoc(doc(db, "questions", id), questao, { merge: true });
}

export async function excluirQuestao(id) {
  await deleteDoc(doc(db, "questions", id));
}

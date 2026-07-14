// Biblioteca de material de estudo (coleção "materials").
import { collection, doc, getDocs, addDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export async function listarMateriais() {
  const snap = await getDocs(collection(db, "materials"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function adicionarMaterial(material) {
  await addDoc(collection(db, "materials"), material);
}

export async function excluirMaterial(id) {
  await deleteDoc(doc(db, "materials", id));
}

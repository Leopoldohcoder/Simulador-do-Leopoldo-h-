// Camada de autenticação.
// O sistema pede apenas "número de telefone + palavra-passe" (sem e-mail),
// então internamente convertemos o número num e-mail sintético para usar
// o Firebase Authentication (email/senha), o método mais estável e gratuito
// do Firebase. O utilizador nunca vê esse "e-mail".
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./config";

const DOMAIN = "@simuladorleopoldoh.ao";
const ADMIN_PHONE = "244931619002";

function phoneToEmail(telefoneLimpo) {
  return `${telefoneLimpo}${DOMAIN}`;
}

export function limparTelefone(telefone) {
  return telefone.replace(/\D/g, "");
}

export async function registar(nome, telefoneRaw, senha) {
  const telefone = limparTelefone(telefoneRaw);
  const email = phoneToEmail(telefone);
  const cred = await createUserWithEmailAndPassword(auth, email, senha);
  const isAdmin = telefone === ADMIN_PHONE;

  const perfil = {
    nome,
    telefone,
    isAdmin,
    bloqueado: false,
    foto: "",
    criadoEm: new Date().toISOString(),
    ultimoAcesso: new Date().toISOString(),
  };
  await setDoc(doc(db, "users", cred.user.uid), perfil);
  await setDoc(doc(db, "ranking", cred.user.uid), {
    nome,
    telefone,
    provas: 0,
    melhorNota: 0,
    somaNotas: 0,
  });
  return { uid: cred.user.uid, ...perfil };
}

export async function entrar(telefoneRaw, senha) {
  const telefone = limparTelefone(telefoneRaw);
  const email = phoneToEmail(telefone);
  const cred = await signInWithEmailAndPassword(auth, email, senha);
  const snap = await getDoc(doc(db, "users", cred.user.uid));
  if (!snap.exists()) throw new Error("perfil-nao-encontrado");
  const perfil = snap.data();
  if (perfil.bloqueado) {
    await signOut(auth);
    throw new Error("conta-bloqueada");
  }
  await setDoc(doc(db, "users", cred.user.uid), { ...perfil, ultimoAcesso: new Date().toISOString() }, { merge: true });
  return { uid: cred.user.uid, ...perfil };
}

export function sair() {
  return signOut(auth);
}

export function ouvirAutenticacao(callback) {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) return callback(null);
    const snap = await getDoc(doc(db, "users", firebaseUser.uid));
    if (!snap.exists()) return callback(null);
    callback({ uid: firebaseUser.uid, ...snap.data() });
  });
}

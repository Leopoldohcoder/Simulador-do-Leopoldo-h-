// Script único: importa as questões de exemplo (src/data/seedQuestions.js)
// para a coleção "questions" do seu Firestore.
// Execute UMA vez, depois de configurar o .env: `node scripts/seedFirestore.js`
import "dotenv/config";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { SEED_QUESTIONS } from "../src/data/seedQuestions.js";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const existing = await getDocs(collection(db, "questions"));
  if (!existing.empty) {
    console.log(`A coleção "questions" já tem ${existing.size} questões. Nada foi importado.`);
    return;
  }
  for (const q of SEED_QUESTIONS) {
    await addDoc(collection(db, "questions"), q);
  }
  console.log(`${SEED_QUESTIONS.length} questões importadas com sucesso.`);
}

run().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });

// 必要な関数を import
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBHd9HlM-3960xJI-1kQGG9aL40bfLjBOo",
  authDomain: "team-original-app-1126b.firebaseapp.com",
  projectId: "team-original-app-1126b",
  storageBucket: "team-original-app-1126b.appspot.com",
  messagingSenderId: "380310972941",
  appId: "1:380310972941:web:45cabd360ec71f141a8344",
};

// Firebaseアプリオブジェクトを初期化
const app = initializeApp(firebaseConfig);
// Firestoreを読み込み、db(databaseの略)として export
export const db = getFirestore(app);

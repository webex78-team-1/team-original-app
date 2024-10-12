import { auth, provider } from "../firebase.js"; // Firebaseの設定をインポート
import { signInWithPopup } from "firebase/auth"; // ポップアップでログインするためのメソッドをインポート
import { useState } from "react";

export default function SignIn() {
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider); // Googleでログイン
      window.location.href = "/"; // ログイン成功後にマイページへリダイレクト
    } catch (err) {
      setError(err.message); // エラー処理
    }
  };

  return (
    <div>
      <h1>KOTABI ~孤旅~</h1>
      <button onClick={handleGoogleLogin}>Googleでログイン</button>
      {error && <p>{error}</p>} {/* エラーメッセージの表示 */}
    </div>
  );
}

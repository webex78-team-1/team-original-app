import { SignInButton } from "../components/Sign.jsx";
import { auth } from "../firebase.js";
import { useNavigate } from "@remix-run/react";
import "../styles/style.css";
import kotabi from "../images/kotabi.png";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

export default function SignIn() {
  const [user, setUser] = useState(null); // ユーザーの状態をuseStateで管理

  const navigate = useNavigate();

  // Firebaseの認証状態を監視してuserを設定する
  useEffect(() => {
    // onAuthStateChangedで認証状態を監視
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // 認証状態に応じてuserを更新
      if (currentUser) {
        navigate("/"); // ユーザーがログインしていればマイページにリダイレクト
      }
    });

    // コンポーネントがアンマウントされたときに監視を解除
    return () => unsubscribe();
  }, [navigate]); // userの代わりにnavigateのみ依存

  return (
    <div className="signinscreen">
      <div className="kotabi">
        <img src={kotabi} alt="kotabi"></img>
      </div>
      <h3>あなたの旅が、あなたの物語になる。</h3>
      <SignInButton />
    </div>
  );
}

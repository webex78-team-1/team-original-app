import { SignInButton } from "../components/Sign.jsx";
import { auth } from "../firebase.js";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import "../styles/style.css";
import kotabi from "../images/kotabi.png";

export default function SignIn() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  // ユーザーがログインしていればマイページにリダイレクト
  useEffect(() => {
    if (user) {
      navigate("/"); // ログイン後はマイページにリダイレクト
    }
  }, [user, navigate]);

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

import { SignInButton } from "../components/Sign.jsx";
import { auth } from "../firebase.js";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import { useNavigate } from "@remix-run/react";

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
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>KOTABI ~孤旅~</h1>
      <h2>ログインしてください</h2>
      <SignInButton />
    </div>
  );
}

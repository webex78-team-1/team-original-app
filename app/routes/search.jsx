import { SearchMapComponent } from "../components/SearchMap.jsx";
import "../styles/style.css";
import { Header } from "../components/Header.jsx";
import { Footer } from "../components/Footer.jsx";
import { useState, useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import { auth } from "../firebase.js";

export default function SearchMap() {
  // ログイン状態を管理する変数の宣言
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // onAuthStateChangedでログイン状態を管理
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        navigate("/signin"); // ログインしていない場合はログイン画面へリダイレクト
      } else {
        setUser(currentUser); // ログインしているユーザー情報を設定
      }
    });

    return () => unsubscribe(); // コンポーネントがアンマウントされたときにリスナーを解除
  }, [navigate]);

  if (!user) {
    return null; // ログイン状態が確定するまで何も表示しない
  }

  return (
    <div>
      <Header />
      <h1
        style={{
          borderBottom: "0.5rem solid",
          borderColor: "rgb(260,70,0)",
          fontSize: "50px",
        }}
      >
        KOTABI ~孤旅~
      </h1>
      <div className="googlebackground">
        <div className="toumei">
          <h2>Search on Google Map</h2>
          <h4>Google Mapで一人旅に最適な行先を検索しましょう</h4>
          <h4>条件を自由に入力してください</h4>
          <SearchMapComponent />
          <Footer />
        </div>
      </div>
    </div>
  );
}

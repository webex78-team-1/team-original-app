import { CustomAPICallComponent } from "../components/Recommend.jsx";
import { GoogleMapComponent } from "../components/GoogleMap.jsx";
import { useState, useEffect } from "react";
import { Header } from "../components/Header.jsx";
import { Footer } from "../components/Footer.jsx";
import { useNavigate } from "@remix-run/react";
import { auth } from "../firebase.js";

export default function RecommendGemini() {
  // APIの結果を保存するステート
  const [apiResponse, setApiResponse] = useState(null);

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
      <div className="geminibackground">
        <div className="toumei">
          <h2>Suggestion from AI</h2>
          {/* CustomAPICallComponentにコールバックを渡す */}
          <CustomAPICallComponent setApiResponse={setApiResponse} />
          {/* マップを最初から表示 */}
          <GoogleMapComponent
            spotNames={
              apiResponse
                ? apiResponse.information.map((item) => item.spot)
                : []
            } // APIレスポンスがあればスポットを表示、なければ空の配列
          />
          <Footer />
        </div>
      </div>
    </div>
  );
}

import { CustomAPICallComponent } from "../components/Recommend.jsx";
import { GoogleMapComponent } from "../components/GoogleMap.jsx";
import { useState } from "react";
import { Link } from "@remix-run/react";
import kotabi from "../images/kotabi.png";

export default function RecommendGemini() {
  // APIの結果を保存するステート
  const [apiResponse, setApiResponse] = useState(null);

  return (
    <div>
      <div className="header">
        <img src={kotabi} className="icon" alt="kotabi"></img>
        <ul>
          <li>
            <Link to="/">マイページ</Link>
          </li>
          <li>
            <Link to="/search">最適スポット検索</Link>
          </li>
          <li>
            <Link to="/recommend">生成AI Geminiからのアドバイス</Link>
          </li>
        </ul>
      </div>
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
          <h2>一人旅にオススメなスポットをAIに聞いてみる</h2>
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
        </div>
      </div>
    </div>
  );
}

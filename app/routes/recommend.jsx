import { CustomAPICallComponent } from "../components/Recommend.jsx";
import { GoogleMapComponent } from "../components/GoogleMap.jsx";
import { useState } from "react";
import { Link } from "@remix-run/react";

export default function RecommendGemini() {
  // APIの結果を保存するステート
  const [apiResponse, setApiResponse] = useState(null);

  return (
    <div>
      <h1>KOTABI ~孤旅~</h1>
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
      <h2>一人旅にオススメなスポットをAIに聞いてみる</h2>
      {/* CustomAPICallComponentにコールバックを渡す */}
      <CustomAPICallComponent setApiResponse={setApiResponse} />
      {/* マップを最初から表示 */}
      <GoogleMapComponent
        spotNames={
          apiResponse ? apiResponse.information.map((item) => item.spot) : []
        } // APIレスポンスがあればスポットを表示、なければ空の配列
      />
    </div>
  );
}

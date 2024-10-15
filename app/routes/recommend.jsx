import { CustomAPICallComponent } from "../components/Recommend.jsx";
import { GoogleMapComponent } from "../components/GoogleMap.jsx";
import { useState } from "react";
import { Header } from "../components/Header.jsx";
import { Footer } from "../components/Footer.jsx";

export default function RecommendGemini() {
  // APIの結果を保存するステート
  const [apiResponse, setApiResponse] = useState(null);

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
        KOTABi ~孤旅~
      </h1>
      <h2>Suggestion from AI</h2>
      {/* CustomAPICallComponentにコールバックを渡す */}
      <CustomAPICallComponent setApiResponse={setApiResponse} />
      {/* マップを最初から表示 */}
      <GoogleMapComponent
        spotNames={
          apiResponse ? apiResponse.information.map((item) => item.spot) : []
        } // APIレスポンスがあればスポットを表示、なければ空の配列
      />
      <Footer />
    </div>
  );
}

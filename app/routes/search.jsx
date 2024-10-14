import { SearchMapComponent } from "../components/SearchMap.jsx";
import { Link } from "@remix-run/react";
import kotabi from "../images/kotabi.png";
import "../styles/style.css";

export default function SearchMap() {
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
      <div className="googlebackground">
        <div className="toumei">
          <h2>Googleマップを活用した最適スポット検索</h2>
          <SearchMapComponent />
        </div>
      </div>
    </div>
  );
}

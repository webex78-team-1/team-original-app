import { SearchMapComponent } from "../components/SearchMap.jsx";
import { Link } from "@remix-run/react";

export default function SearchMap() {
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
      </ul>
      <h2>Googleマップを活用した最適スポット検索</h2>
      <SearchMapComponent />
    </div>
  );
}

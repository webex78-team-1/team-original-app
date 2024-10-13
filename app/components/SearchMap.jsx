import { useState, useCallback, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

// Google Mapsのコンテナスタイル
const containerStyle = {
  width: "100%",
  height: "500px",
};

// 初期のマップ中心（東京駅）
const defaultCenter = {
  lat: 35.681236,
  lng: 139.767125,
};

export const SearchMapComponent = () => {
  const [map, setMap] = useState(null); // マップインスタンス
  const [markers, setMarkers] = useState([]); // マーカーの状態管理
  const [placesList, setPlacesList] = useState([]); // 絞り込んだ場所のリスト
  const [selectedPlace, setSelectedPlace] = useState(null); // 選択された場所の詳細表示用
  const [errorMessage, setErrorMessage] = useState(""); // エラーメッセージ
  const [loadMap, setLoadMap] = useState(false); // マップの強制再ロード

  // フォーム入力の状態管理
  const [location, setLocation] = useState(""); // 地名
  const [category, setCategory] = useState(""); // カテゴリー
  const [people, setPeople] = useState(""); // 人数（指定なしも可）
  const [budget, setBudget] = useState("すべて"); // 予算（無料、低価格、中価格、高価格、指定なし）
  const [inout, setInout] = useState(""); // 屋内・屋外（指定なしも可）

  // ページ遷移後にマップを強制リロードする
  useEffect(() => {
    setLoadMap(true); // マップを表示する
  }, []); // 初回マウント時のみ実行

  // マップがロードされた時に呼び出される
  const onLoad = (mapInstance) => {
    setMap(mapInstance);
  };

  // Google Places APIで場所を検索
  const fetchPlaces = useCallback(() => {
    if (!location || !map) return;

    const service = new window.google.maps.places.PlacesService(map);

    const request = {
      query: `${location} ${category}`,
      fields: [
        "place_id",
        "name",
        "geometry",
        "price_level",
        "user_ratings_total",
        "formatted_address",
        "rating",
        "types", // 屋内・屋外のフィルタに利用
      ], // 必要なフィールド
    };

    service.textSearch(request, (results, status) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        results
      ) {
        // 絞り込み処理
        const filteredResults = results.filter((place) => {
          // 予算に応じたフィルタリング（"すべて"を除外）
          if (budget === "無料" && place.price_level !== 0) return false;
          if (budget === "低価格" && place.price_level !== 1) return false;
          if (budget === "中価格" && place.price_level !== 2) return false;
          if (budget === "高価格" && place.price_level !== 3) return false;

          // 人数に応じたフィルタリング（例: 1人向けスポット）、指定しない場合はフィルタを無効
          if (people === "1人" && place.user_ratings_total < 50) return false;

          // 屋内・屋外のフィルタリング
          if (inout === "屋内" && !place.types.includes("indoor")) return false;
          if (inout === "屋外" && !place.types.includes("outdoor"))
            return false;

          return true;
        });

        // 評価の高い順にソート
        const sortedResults = filteredResults.sort(
          (a, b) => b.rating - a.rating
        );

        // 絞り込んだ場所をリストに表示するために保存
        setPlacesList(sortedResults);

        // マーカー情報を更新
        const newMarkers = sortedResults.map((place) => ({
          position: place.geometry.location,
          name: place.name,
          placeId: place.place_id,
          address: place.formatted_address,
          rating: place.rating,
        }));

        setMarkers(newMarkers);

        // マップの中心を最初の結果に移動
        if (newMarkers.length > 0) {
          map.setCenter(newMarkers[0].position);
        }
      }
    });
  }, [location, category, people, budget, inout, map]);

  // 検索処理の実行
  const handleSearchSubmit = (e) => {
    e.preventDefault();

    // 必須フィールドが未入力の場合のエラーメッセージ
    if (!location || !category) {
      setErrorMessage("「地名」と「カテゴリー」は必須入力です。");
      return;
    }

    setErrorMessage(""); // エラーメッセージをクリア
    fetchPlaces();
  };

  // Google Mapsリンク生成
  const generateGoogleMapsLink = (placeId) => {
    return `https://www.google.com/maps/place/?q=place_id:${placeId}`;
  };

  return (
    <>
      {/* フィルタ入力フォーム */}
      <form onSubmit={handleSearchSubmit}>
        <div>
          <label htmlFor="location">地名: </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="例: 東京駅"
          />
        </div>
        <div>
          <label htmlFor="category">カテゴリー: </label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="例: 和食、遊ぶ、温泉"
          />
        </div>
        <div>
          <label htmlFor="people">人数: </label>
          <select
            id="people"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
          >
            <option value="">指定なし</option>
            <option value="1人">1人</option>
            <option value="家族">家族</option>
            <option value="カップル">カップル</option>
          </select>
        </div>
        <div>
          <label htmlFor="budget">予算: </label>
          <select
            id="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          >
            <option value="すべて">すべて</option>
            <option value="無料">無料</option>
            <option value="低価格">低価格</option>
            <option value="中価格">中価格</option>
            <option value="高価格">高価格</option>
          </select>
        </div>
        <div>
          <label htmlFor="inout">屋内・屋外: </label>
          <select
            id="inout"
            value={inout}
            onChange={(e) => setInout(e.target.value)}
          >
            <option value="">指定なし</option>
            <option value="屋内">屋内</option>
            <option value="屋外">屋外</option>
          </select>
        </div>
        <button type="submit">検索</button>
      </form>

      {/* エラーメッセージ表示 */}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {/* リスト表示 */}
      <h2>検索結果（評価の高い順）</h2>
      <ul>
        {placesList.map((place, index) => (
          <li key={index}>
            <strong>{place.name}</strong> <br />
            住所: {place.formatted_address} <br />
            評価: {place.rating} <br />
            <a
              href={generateGoogleMapsLink(place.place_id)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Mapsで表示
            </a>
          </li>
        ))}
      </ul>

      {/* Google Mapsの表示部分 */}
      {loadMap && (
        <LoadScript
          googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
          libraries={["places"]}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={defaultCenter}
            zoom={14}
            onLoad={onLoad}
          >
            {/* フィルタリングされた場所にマーカーを表示 */}
            {markers.map((marker, index) => (
              <Marker
                key={index}
                position={marker.position}
                onClick={() => setSelectedPlace(marker)} // マーカークリック時に詳細表示
              />
            ))}

            {/* マーカーをクリックした時の詳細表示 */}
            {selectedPlace && (
              <InfoWindow
                position={selectedPlace.position}
                onCloseClick={() => setSelectedPlace(null)}
              >
                <div>
                  <h4>{selectedPlace.name}</h4>
                  <p>住所: {selectedPlace.address}</p>
                  <p>評価: {selectedPlace.rating}</p>
                  <a
                    href={generateGoogleMapsLink(selectedPlace.placeId)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google Mapsで表示
                  </a>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      )}
    </>
  );
};

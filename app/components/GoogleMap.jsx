import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

export const GoogleMapComponent = () => {
  // Google Mapのコンテナスタイルを定義
  // マップの初期中心座標を設定（東京）
  const [center, setCenter] = useState({
    lat: 43.0508, // 緯度
    lng: 141.3471, // 経度
  });
  // マーカーの位置を保持するためのstate
  const [markers, setMarkers] = useState([]);

  // Google Places APIを使ってスポット名から位置を取得し、マップにマーカーを追加
  const handleSearch = async (placeName) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      placeName
    )}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        setMarkers((prevMarkers) => [
          ...prevMarkers,
          { lat: location.lat, lng: location.lng },
        ]);
        setCenter({ lat: location.lat, lng: location.lng });
      } else {
        alert("場所が見つかりませんでした");
      }
    } catch (error) {
      console.error("エラーが発生しました: ", error);
    }
  };
  // 初回レンダリング時に「東京タワー」で検索を実行
  useEffect(() => {
    handleSearch("天文館むじゃき 本店");
  }, []); // 空の依存配列により、コンポーネントがマウントされたときに一度だけ実行
  return (
    <>
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={14}>
          {markers.map((marker, index) => (
            <Marker key={index} position={marker} />
          ))}
        </GoogleMap>
      </LoadScript>
    </>
  );
};

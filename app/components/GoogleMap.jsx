import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

// Google Mapsのコンテナスタイル
const containerStyle = {
  width: "100%",
  height: "500px",
};

// 初期のマップ中心
const defaultCenter = {
  lat: 35.682839, // 東京の緯度
  lng: 139.759455, // 東京の経度
};

export const GoogleMapComponent = ({ spotNames }) => {
  const [map, setMap] = useState(null); // マップインスタンス
  const [markers, setMarkers] = useState([]); // マーカーの状態管理

  // マップがロードされた時に呼び出される
  const onLoad = (mapInstance) => {
    setMap(mapInstance);
  };

  // スポット名の配列を基に検索
  useEffect(() => {
    if (!spotNames || !map) return;

    const service = new window.google.maps.places.PlacesService(map);

    // 複数のスポット名の検索リクエストをPromiseで処理
    const requests = spotNames.map((spotName) => {
      return new Promise((resolve, reject) => {
        const request = {
          query: spotName,
          fields: ["name", "geometry"],
        };

        // 各スポット名を検索して結果を処理
        service.textSearch(request, (results, status) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            results
          ) {
            const newMarkers = results.map((result) => ({
              position: result.geometry.location,
              name: result.name,
            }));
            resolve(newMarkers); // マーカー情報を返す
          } else {
            reject("検索結果が見つかりませんでした");
          }
        });
      });
    });

    // すべての検索が完了したらマーカーを更新
    Promise.all(requests)
      .then((allMarkers) => {
        // 全てのマーカーを一つの配列に結合
        const combinedMarkers = allMarkers.flat();
        setMarkers(combinedMarkers);

        // 最初の結果に基づいてマップの中心を設定
        if (combinedMarkers.length > 0) {
          map.setCenter(combinedMarkers[0].position);
        }
      })
      .catch((error) => {
        console.error("エラーが発生しました: ", error);
      });
  }, [spotNames, map]);

  return (
    <>
      {/* Google Mapsの表示部分 */}
      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        libraries={["places"]}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={12}
          onLoad={onLoad}
        >
          {/* 検索結果に基づいてマーカーを表示 */}
          {markers.map((marker, index) => (
            <Marker key={index} position={marker.position} />
          ))}
        </GoogleMap>
      </LoadScript>
    </>
  );
};

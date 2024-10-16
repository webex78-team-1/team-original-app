import { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

// Google Mapsのコンテナスタイル
const containerStyle = {
  width: "100%",
  height: "750px",
};

// 初期のマップ中心
const defaultCenter = {
  lat: 35.682839, // 東京の緯度
  lng: 139.759455, // 東京の経度
};

export const GoogleMapComponent = ({ spotNames }) => {
  const [map, setMap] = useState(null); // マップインスタンス
  const [markers, setMarkers] = useState([]); // マーカーの状態管理
  const [selectedPlace, setSelectedPlace] = useState(null); // 選択された場所のインフォウィンドウ表示用

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
          fields: ["name", "geometry", "formatted_address", "place_id"],
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
              address: result.formatted_address,
              placeId: result.place_id, // Google Mapsのリンクを生成するためにplace_idを保存
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

  // Google Mapsリンク生成
  const generateGoogleMapsLink = (placeId) => {
    return `https://www.google.com/maps/place/?q=place_id:${placeId}`;
  };

  return (
    <>
      {/* Google Mapsの表示部分 */}
      <LoadScript
        googleMapsApiKey={"AIzaSyArF6jbeP8QOnzJtWWYzc-nVIJVPMebuyw"}
        libraries={["places"]}
      >
        <h2>提案された結果に基づく関連スポット（Google Map）</h2>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={12}
          onLoad={onLoad}
        >
          {/* 検索結果に基づいてマーカーを表示 */}
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
              onCloseClick={() => setSelectedPlace(null)} // インフォウィンドウを閉じる
            >
              <div>
                <h4>{selectedPlace.name}</h4>
                <p>住所: {selectedPlace.address}</p>
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
    </>
  );
};

import { useState } from "react";
import Select from "react-select"; //セレクトボタンのインポート

export const CustomAPICallComponent = ({ setApiResponse }) => {
  // 各入力フィールド用のステート
  const [location, setLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null); // カテゴリ選択用のステート
  const [selectedInout, setSelectedInout] = useState(null); // 屋内外選択用のステート
  const [response, setResponse] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // カテゴリと屋内外のオプション
  const category = [
    { value: "食べる", label: "食べる" },
    { value: "遊ぶ", label: "遊ぶ" },
    { value: "リラックス", label: "リラックス" },
    { value: "温泉", label: "温泉" },
  ];
  const inout = [
    { value: "屋内", label: "屋内" },
    { value: "屋外", label: "屋外" },
  ];

  // APIリクエストを送信する関数
  const handleSubmit = async () => {
    // ユーザーが選択した値をチェック
    if (!location || !selectedCategory || !selectedInout) {
      setErrorMessage("すべての項目を入力してください");
      return;
    }

    // リクエストボディのデータを作成
    const requestData = {
      location: location,
      category: selectedCategory.value, // 選択されたカテゴリの値
      inout: selectedInout.value, // 選択された屋内外の値
    };

    try {
      // APIリクエストを送信
      const response = await fetch(
        "https://generaterecommendedspots-mllh5rupca-an.a.run.app",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData), // JSON形式で送信
        }
      );

      if (!response.ok) {
        throw new Error("APIリクエストが失敗しました");
      }

      // レスポンスを取得してステートに保存
      const result = await response.json();
      setResponse(result); // レスポンスデータをステートに保存
      setErrorMessage(""); // エラーメッセージをクリア

      // 取得したAPIレスポンスを親に渡す
      setApiResponse(result); // 親のコールバック関数を呼び出して親にデータを渡す
    } catch (error) {
      console.error("エラーが発生しました: ", error);
      setErrorMessage("APIリクエストに失敗しました: " + error.message);
    }
  };

  return (
    <div>
      <h2>条件入力</h2>
      <div>地域</div>
      <input
        type="text"
        value={location}
        onChange={(e) => {
          setLocation(e.target.value);
        }}
      />
      <div>カテゴリ</div>
      <Select
        options={category}
        onChange={setSelectedCategory} // 選択された値をステートにセット
      />
      <div>屋内か屋外か</div>
      <Select
        options={inout}
        onChange={setSelectedInout} // 選択された値をステートにセット
      />
      {/* ボタンを押してAPIリクエスト送信 */}
      <button onClick={handleSubmit}>検索</button>

      {/* レスポンスの表示 */}
      <h2>おすすめスポット一覧</h2>
      {response ? (
        <ul>
          {response.information.map((item, index) => (
            <li key={index}>
              <strong>スポット名: </strong>
              {item.spot}
              <br />
              <strong>理由: </strong>
              {item.reason}
            </li>
          ))}
        </ul>
      ) : (
        <p>オススメスポットをここに表示します</p>
      )}

      {/* エラーメッセージの表示 */}
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
    </div>
  );
};

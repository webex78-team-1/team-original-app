import { useState } from "react";
import Select from "react-select"; //セレクトボタンのインポート
import "../styles/style.css";

export const CustomAPICallComponent = ({ setApiResponse }) => {
  // 各入力フィールド用のステート
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState(null); // カテゴリ選択用のステート
  const [selectedInout, setSelectedInout] = useState(null); // 屋内外選択用のステート
  const [response, setResponse] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // カテゴリと屋内外のオプション
  // const category = [
  //   { value: "食べる", label: "食べる" },
  //   { value: "遊ぶ", label: "遊ぶ" },
  //   { value: "リラックス", label: "リラックス" },
  //   { value: "温泉", label: "温泉" },
  // ];
  const inout = [
    { value: "屋内", label: "屋内" },
    { value: "屋外", label: "屋外" },
  ];

  // APIリクエストを送信する関数
  const handleSubmit = async () => {
    setIsLoading(true);
    // ユーザーが選択した値をチェック
    if (!location || !category || !selectedInout) {
      setErrorMessage("すべての項目を入力してください");
      return;
    }

    // リクエストボディのデータを作成
    const requestData = {
      location: location,
      category: category, // 選択されたカテゴリの値
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="input">
        <h2>条件入力</h2>
        <div className="kensakufont">
          <div>地域</div>
          <div className="inputposition">
            <input
              type="text"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
              }}
              placeholder="東京都, 札幌市, 大阪駅 etc."
            />
          </div>
          <div>カテゴリ</div>
          <div className="inputposition">
            {/* <Select
              options={category}
              onChange={setCategory} // 選択された値をステートにセット
            /> */}
            <input
              type="text"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
              }}
              placeholder="遊ぶ, 食べる, 気分転換 etc."
            />
          </div>
          <div>屋内か屋外か</div>
          <div className="inputposition">
            <Select
              options={inout}
              onChange={setSelectedInout} // 選択された値をステートにセット
            />
          </div>
          {/* ボタンを押してAPIリクエスト送信 */}
          <div className="kensakubuttonposition">
            <button className="kensakubutton" onClick={handleSubmit}>
              検索
            </button>
          </div>
        </div>
      </div>
      {/*画像挿入するかも*/}

      {/*画像挿入するかも */}
      <div className="response">
        {/* レスポンスの表示 */}
        <h2>おすすめスポット一覧</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : !isLoading && response?.information ? (
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
          <p>オススメスポットはここに表示します</p>
        )}

        {/* エラーメッセージの表示 */}
        {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
      </div>
    </div>
  );
};

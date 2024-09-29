import { useState } from "react";
import Select from "react-select"; //セレクトボタンのインポート

export const TextUI = () => {
  const [location, setLocation] = useState("");
  const category = [
    { value: "eat", label: "食べる" },
    { value: "play", label: "遊ぶ" },
    { value: "relax", label: "リラックス" },
  ];
  const in_out = [
    { value: "in", label: "屋内" },
    { value: "out", label: "屋外" },
  ];

  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");

  return (
    <>
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
      <Select options={category} />
      <div>屋内か屋外か</div>
      <Select options={in_out} />
      <button value={"プロンプトの内容"}>検索</button>
    </>
  );
};

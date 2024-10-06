import { useState } from "react";
import Select from "react-select"; //セレクトボタンのインポート
import { Result } from "./result.js";

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

  //const answerResult = JSON.parse(Result)
  //const [message, setMessage] = useState("");
  //const [answer, setAnswer] = useState([]);

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
      <button>検索</button>
      <div>候補1</div>
      <li>{Result.spot[0]}</li>
      <li>{Result.reason[0]}</li>
      <li>{Result.link[0]}</li>
      <div>候補2</div>
      <li>{Result.spot[1]}</li>
      <li>{Result.reason[1]}</li>
      <li>{Result.link[1]}</li>
      <div>候補3</div>
      <li>{Result.spot[2]}</li>
      <li>{Result.reason[2]}</li>
      <li>{Result.link[2]}</li>
      <div>候補4</div>
      <li>{Result.spot[3]}</li>
      <li>{Result.reason[3]}</li>
      <li>{Result.link[3]}</li>
      <div>候補5</div>
      <li>{Result.spot[4]}</li>
      <li>{Result.reason[4]}</li>
      <li>{Result.link[4]}</li>
    </>
  );
};

import { useState, useRef } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from "../firebase.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "../styles/style.css";

export default function MemoForm({ userId, onMemoSave }) {
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  // Firestoreにメモを保存する関数
  const saveMemo = async (userId, date, location, content, imageUrl = null) => {
    try {
      await addDoc(collection(db, "memos"), {
        userId,
        date,
        location,
        content,
        imageUrl,
      });
      console.log("メモが保存されました");
    } catch (error) {
      console.error("メモの保存に失敗しました: ", error);
    }
  };

  // Firebase Storageに画像をアップロードする関数
  const uploadImage = async (file) => {
    if (!file) return null;
    const storageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 画像をFirebase Storageにアップロード
    let imageUrl = null;
    if (image) {
      imageUrl = await uploadImage(image);
    }

    await saveMemo(userId, date, location, content, imageUrl);

    //フォームのリセット
    setDate("");
    setLocation("");
    setContent("");
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // ファイル入力をリセット
    }
    if (onMemoSave) {
      onMemoSave(); // メモを保存後に呼び出し
    }
  };

  return (
    <div className="input">
      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        <div className="inputposition">
          <label>日付: </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="inputposition">
          <label>訪れた場所: </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <div className="inputposition">
          <label>メモ内容: </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="inputposition">
          <label>写真:</label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <div className="memokeepposition">
          <button className="memokeep" type="submit">
            メモを保存
          </button>
        </div>
      </form>
    </div>
  );
}

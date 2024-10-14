// import { CustomAPICallComponent } from "../components/Recommend.jsx";
// import { GoogleMapComponent } from "../components/GoogleMap.jsx";
import { UserInfo, SignOutButton } from "../components/Sign.jsx";
import { auth } from "../firebase.js";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "@remix-run/react";
import MemoForm from "../components/MemoForm.jsx";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase.js";
import { getStorage, ref, deleteObject } from "firebase/storage";
import kotabi from "../images/kotabi.png";
import "../styles/style.css";
import { Link } from "@remix-run/react";

// export const meta = () => {
//   return [
//     { title: "New Remix SPA" },
//     { name: "description", content: "Welcome to Remix (SPA Mode)!" },
//   ];
// };

export default function Index() {
  //ログイン状態を管理する変数の宣言
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [memos, setMemos] = useState([]);

  // Firestoreからメモを取得する関数
  const getMemos = async (userId) => {
    const q = query(collection(db, "memos"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const memos = [];
    querySnapshot.forEach((doc) => {
      memos.push({ id: doc.id, ...doc.data() });
    });
    return memos;
  };

  // Firestoreからメモを削除する関数
  const deleteMemo = async (memoId) => {
    try {
      await deleteDoc(doc(db, "memos", memoId));
      console.log("メモが削除されました");
    } catch (error) {
      console.error("メモの削除に失敗しました: ", error);
    }
  };

  // Firebase Storageから画像を削除する関数
  const deleteImage = async (imageUrl) => {
    if (!imageUrl) return;

    const storage = getStorage();
    const fileRef = ref(storage, imageUrl);

    try {
      await deleteObject(fileRef);
      console.log("画像が削除されました");
    } catch (error) {
      console.error("画像の削除に失敗しました: ", error);
    }
  };

  // メモリストを取得する関数
  const fetchMemos = async (userId) => {
    const userMemos = await getMemos(userId);
    setMemos(userMemos);
  };

  const handleMemoSave = async () => {
    // メモを保存後、リストを再取得
    if (user) {
      await fetchMemos(user.uid);
    }
  };

  const handleDelete = async (memoId, imageUrl) => {
    console.log("削除する画像URL: ", imageUrl);
    // メモ削除の前に、画像があれば削除
    if (imageUrl) {
      await deleteImage(imageUrl);
    }

    await deleteMemo(memoId);
    setMemos(memos.filter((memo) => memo.id !== memoId)); // ローカルのメモリストから削除
  };

  useEffect(() => {
    if (!user) {
      navigate("/signin"); // ログインしていない場合はログイン画面へリダイレクト
    }
    if (user) {
      fetchMemos(user.uid);
    }
  }, [user, navigate]);

  if (!user) {
    return null; // ログイン状態が確定するまで何も表示しない
  }

  return (
    // <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
    //   <h1>KOTABI ~孤旅~</h1>
    //   <ul>
    //     <li>
    //       <a
    //         target="_blank"
    //         href="https://remix.run/guides/spa-mode"
    //         rel="noreferrer"
    //       >
    //         SPA Mode Guide
    //       </a>
    //     </li>
    //     <li>
    //       <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
    //         Remix Docs
    //       </a>
    //     </li>
    //   </ul>
    //   <Sign />
    // </div>
    <div>
      {/* {user ? (
        <div>
          <UserInfo />
          <SignOutButton />
          <CustomAPICallComponent />
          <GoogleMapComponent />
        </div>
      ) : (
        <SignInButton />
      )} */}

      <div className="header">
        <img src={kotabi} className="icon" alt="kotabi"></img>
        <div>
          <SignOutButton />
          <ul>
            <li>
              <Link to="/">マイページ</Link>
            </li>
            <li>
              <Link to="/search">最適スポット検索</Link>
            </li>
            <li>
              <Link to="/recommend">生成AI Geminiからのアドバイス</Link>
            </li>
          </ul>
        </div>
      </div>
      <h1
        style={{
          borderBottom: "0.5rem solid",
          borderColor: "rgb(260,70,0)",
          fontSize: "50px",
        }}
      >
        KOTABi ~孤旅~
      </h1>
      <div className="mypagebackground">
        <div className="toumei">
          <h2>マイページ</h2>
          <UserInfo />

          {/* メモフォームの表示。メモ追加後に onMemoSave を呼び出す */}
          <MemoForm userId={user.uid} onMemoSave={handleMemoSave} />

          {/* 保存されたメモの表示 */}

          <div className="response">
            <h2>これまでのメモ</h2>
            <ul>
              {memos.map((memo) => (
                <li key={memo.id}>
                  <div className="memolog">
                    <strong>日付: </strong>
                    {memo.date}
                  </div>
                  <div className="memolog">
                    <strong>場所: </strong>
                    {memo.location}
                  </div>
                  <div className="memolog">
                    <strong>メモ: </strong>
                    {memo.content}
                  </div>
                  <div className="memolog">
                    {memo.imageUrl && (
                      <div>
                        <strong>写真: </strong>
                        <br />
                        <img
                          src={memo.imageUrl}
                          alt="メモの画像"
                          style={{ maxWidth: "200px", maxHeight: "200px" }}
                        />
                        <br />
                      </div>
                    )}
                  </div>
                  <div className="memodeleteposition">
                    <button
                      className="memodelete"
                      onClick={() => handleDelete(memo.id, memo.imageUrl)}
                    >
                      メモを削除
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

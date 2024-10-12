// import { CustomAPICallComponent } from "../components/Recommend.jsx";
// import { GoogleMapComponent } from "../components/GoogleMap.jsx";
import { UserInfo } from "../components/Sign.jsx";
import { auth } from "../firebase.js";
import { useEffect, useState } from "react";

export const meta = () => {
  return [
    { title: "New Remix SPA" },
    { name: "description", content: "Welcome to Remix (SPA Mode)!" },
  ];
};

export async function loader() {
  return null;
}

export default function Index() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    import("firebase/auth").then(({ onAuthStateChanged }) => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
        } else {
          window.location.href = "/login";
        }
      });
      return () => unsubscribe();
    });
  }, []);

  if (!user) {
    return <p>ロード中...</p>; // ユーザー情報がロードされるまでの表示
  }

  const handleSignOut = async () => {
    await auth.signOut(); // サインアウト処理
    window.location.href = "/signin"; // サインアウト後にログイン画面へリダイレクト
  };

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
      <h1>KOTABI ~孤旅~</h1>
      <h2>My Page</h2>

      <UserInfo />
      <button onClick={handleSignOut}>サインアウト</button>
    </div>
  );
}

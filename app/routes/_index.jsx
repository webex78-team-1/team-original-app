import { CustomAPICallComponent } from "../components/Recommend.jsx";
import { GoogleMapComponent } from "../components/GoogleMap.jsx";
import { UserInfo, SignOutButton, SignInButton } from "../components/Sign.jsx";
import { auth } from "../firebase.js";
import { useAuthState } from "react-firebase-hooks/auth";

export const meta = () => {
  return [
    { title: "New Remix SPA" },
    { name: "description", content: "Welcome to Remix (SPA Mode)!" },
  ];
};

export default function Index() {
  //ユーザーのログイン状態を管理する変数の宣言
  const [user] = useAuthState(auth);
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
    <div >
      {user ? (
        <div>
          <UserInfo />
          <SignOutButton />
          <CustomAPICallComponent />
          <GoogleMapComponent />
        </div>
      ) : (
        <SignInButton />
      )}
    </div>
  );
}

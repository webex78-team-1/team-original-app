import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase.js";
import { useAuthState } from "react-firebase-hooks/auth";
import "../styles/style.css";

export default function Sign() {
  //ユーザーのログイン状態を管理する変数の宣言
  const [user] = useAuthState(auth);

  return (
    <div>
      {user ? (
        <div>
          <UserInfo />
          <SignOutButton />
        </div>
      ) : (
        <SignInButton />
      )}
    </div>
  );
}

//サインインするボタン
function SignInButton() {
  const signInWithGoogle = () => {
    //firebaseを使ってgoogleでサインインする
    signInWithPopup(auth, provider);
  };

  return (
    <button className="signinbutton" onClick={signInWithGoogle}>
      Googleでサインイン
    </button>
  );
}

//サインアウトするボタン
function SignOutButton() {
  return (
    <button className="signoutbutton" onClick={() => auth.signOut()}>
      サインアウト
    </button>
  );
}

//Googleアカウント名とアイコンの出力
function UserInfo() {
  return (
    <div className="userinfo">
      <img
        src={auth.currentUser.photoURL}
        className="accountimage"
        alt="アカウント画像"
      />
      <p>{auth.currentUser.displayName}</p>
    </div>
  );
}

export { SignInButton, SignOutButton, UserInfo };

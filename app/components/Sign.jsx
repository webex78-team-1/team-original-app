import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase.js";
import "../styles/style.css";

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

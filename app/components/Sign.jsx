import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase.js";
import { useAuthState } from "react-firebase-hooks/auth";

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

  return <button onClick={signInWithGoogle}>Googleでサインイン</button>;
}

//サインアウトするボタン
function SignOutButton() {
  return <button onClick={() => auth.signOut()}>サインアウト</button>;
}

//Googleアカウント名とアイコンの出力
function UserInfo() {
  return (
    <div>
      <img src={auth.currentUser.photoURL} alt="アカウント画像" />
      <p>{auth.currentUser.displayName}</p>
    </div>
  );
}

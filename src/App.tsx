import React, { useEffect } from "react";
import styles from "./App.module.css";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, login, logout } from "./features/userSlice";
import { auth } from "./firebase";
import Feed from "./components/Feed";
import Auth from "./components/Auth";

const App: React.FC = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const unSub = auth.onAuthStateChanged((authUser) => {
      //firebaseのuserが変化したときに毎回呼び出される
      //subscriveが始まりuserの監視が始まり、unSubで受け取る。
      //user情報を(authUser)に格納する
      if (authUser) {
        //loginのreducersをdispatch経由で実行してfirebaseから取ってきた値をpayloadで渡してuser stateの値に上書きする
        dispatch(
          login({
            uid: authUser.uid,
            photoUrl: authUser.photoURL,
            displayName: authUser.displayName,
          })
        );
      } else {
        dispatch(logout());
      }
    });
    return () => {
      unSub(); //creanUp関数
    };
  }, [dispatch]);
  return (
    <>
      {user.uid ? (
        <div className={styles.app}>
          <Feed />
        </div>
      ) : (
        <Auth />
      )}
    </>
  );
};
//loginしていたら(user情報があったら)<Feed>を表示、なかったら<Auth>を表示
export default App;

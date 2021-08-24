import React, { useState } from "react";
import styles from "./TweetInput.module.css";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { auth, storage, db } from "../firebase";
import { Avatar, Button, IconButton } from "@material-ui/core";
import firebase from "firebase/app";
import ImageIcon from "@material-ui/icons/Image";

const TweetInput: React.FC = () => {
  const user = useSelector(selectUser);
  const [tweetImage, setTweetImage] = useState<File | null>(null);
  const [tweetMsg, setTweetMsg] = useState("");
  const [tweetDetail, setTweetDetail] = useState("");
  const [tweetTime, setTweetTime] = useState("");
  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setTweetImage(e.target.files![0]);
      e.target.value = "";
    }
  };

  const sendTweet = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (tweetImage) {
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const N = 16;
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");
      const fileName = randomChar + "_" + tweetImage.name;
      const uploadTweetImg = storage.ref(`images/${fileName}`).put(tweetImage);
      uploadTweetImg.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        () => {},
        (err) => {
          alert(err.message);
        },
        async () => {
          await storage
            .ref("images")
            .child(fileName)
            .getDownloadURL()
            .then(async (url) => {
              await db
                .collection("posts")
                .add({
                  avatar: user.photoUrl,
                  image: url,
                  text: tweetMsg,
                  detail: tweetDetail,
                  time: tweetTime,
                  timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                  username: user.displayName,
                })
                .then(() => {
                  alert("投稿しました");
                })
                .catch((err) => {
                  alert(err);
                });
            });
        }
      );
    } else {
      db.collection("posts")
        .add({
          avatar: user.photoUrl,
          image: "",
          text: tweetMsg,
          detail: tweetDetail,
          time: tweetTime,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          username: user.displayName,
        })
        .then(() => {
          alert("投稿しました");
        })
        .catch((err) => {
          alert(err);
        });
    }
    setTweetImage(null);
    setTweetMsg("");
    setTweetDetail("");
    setTweetTime("");
  };

  return (
    <>
      <form onSubmit={sendTweet}>
        <div className={styles.tweet_form}>
          <div className={styles.avatar_logout}>
            <Avatar
              className={styles.tweet_avatar}
              src={user.photoUrl}
              onClick={async () => {
                await auth.signOut();
              }}
            />
            <button
              className={styles.logout}
              onClick={async () => {
                await auth.signOut();
              }}
            >
              logout
            </button>
          </div>
          <input
            className={styles.tweet_input}
            placeholder="What are you doing?"
            type="text"
            autoFocus
            value={tweetMsg}
            onChange={(e) => setTweetMsg(e.target.value)}
          />
          <input
            className={styles.tweet_input}
            placeholder="What are you studying?"
            type="text"
            autoFocus
            value={tweetDetail}
            onChange={(e) => setTweetDetail(e.target.value)}
          />
          <input
            className={styles.tweet_input}
            placeholder="How long?"
            type="text"
            autoFocus
            value={tweetTime}
            onChange={(e) => setTweetTime(e.target.value)}
          />
          <IconButton>
            <label>
              <ImageIcon
                className={
                  tweetImage ? styles.tweet_addIconLoaded : styles.tweet_addIcon
                }
              />
              <input
                className={styles.tweet_hiddenIcon}
                type="file"
                onChange={onChangeImageHandler}
              />
            </label>
          </IconButton>
        </div>

        <Button
          type="submit"
          disabled={!tweetMsg}
          className={
            tweetMsg ? styles.tweet_sendBtn : styles.tweet_sendDisableBtn
          }
        >
          share
        </Button>
      </form>
    </>
  );
};

export default TweetInput;

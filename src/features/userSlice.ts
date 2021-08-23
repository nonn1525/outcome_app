import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

interface USER {
  displayName: string;
  photoUrl: string;
}

export const userSlice = createSlice({
  name: "user",
  initialState: {
    //stateを定義する
    user: { uid: "", photoUrl: "", displayName: "" }, //持っている値
  },
  reducers: {
    login: (state, action) => {
      //actionのpaylodeの属性にloginをReactのコンポーネントのdispatchで呼び出すときに、firebaseで受け取ったuserの情報をactionのpaylodeに渡してloginで受け取れるように
      state.user = action.payload; //reduxのuserの情報をpayload経由で受け取ったactionの値で上書きする
    },
    logout: (state) => {
      state.user = { uid: "", photoUrl: "", displayName: "" }; //user情報の初期化
    },
    updateUserProfile: (state, action: PayloadAction<USER>) => {
      state.user.displayName = action.payload.displayName;
      state.user.photoUrl = action.payload.photoUrl;
    },
  },
});

export const { login, logout, updateUserProfile } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user; //stateの後のuserはstore.tsのreducerに対応する(同じになる)

export default userSlice.reducer;

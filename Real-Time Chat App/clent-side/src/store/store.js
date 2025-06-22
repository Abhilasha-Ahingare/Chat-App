import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createAuthSlice } from "./slice/authsclice";
import chatsSlice from "./slice/chatsSlice";

export const userStore = create(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      ...chatsSlice(...a),
    }),
    {
      name: "user-storage", // localStorage key
      partialize: (state) => ({
        userInfo: state.userInfo, // only persist userInfo
      }),
    }
  )
);

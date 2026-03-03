// stores/auth.js
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null,
    user: null, // 전체 user 객체 저장
    isLoggedIn: false,
  }),

  getters: {
    userName: (state) => state.user?.m_nm || "",
    userAuth: (state) => state.user?.m_auth || "",
    isAdmin: (state) => state.user?.m_auth === "a0_99",
    isManager: (state) =>
      state.user?.m_auth === "a0_40" ||
      state.user?.m_auth === "a0_30",
  },

  actions: {
    setAuth(data) {
      this.token = data.token;
      this.user = data.user;
      this.isLoggedIn = true;
    },

    logout() {
      this.token = null;
      this.user = null;
      this.isLoggedIn = false;
      localStorage.removeItem("token");
    },
  },
});
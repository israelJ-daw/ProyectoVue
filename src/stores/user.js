import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
  }),
  
  getters: {

    isLoggedIn: (state) => !!state.user,

    userName: (state) => state.user?.name || "Invitado",

    userAvatar: (state) => state.user?.avatar || "",
  },

  actions: {

    initialize() {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          this.user = JSON.parse(savedUser);
        } catch (e) {
          console.error("Error al leer usuario de localStorage:", e);
          localStorage.removeItem("user");
        }
      }
    },


    login(userData) {
      this.user = userData;
      localStorage.setItem("user", JSON.stringify(userData));
    },


    logout() {
      this.user = null;
      localStorage.removeItem("user");
    },
  },
});

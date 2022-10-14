import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
export default createStore({
  state: {
    userType: 1,
    showGlobalDialog: false,
  },
  getters: {
    getUserType: (state) => {
      return state.userType
    },
    getGlobalDialog: (state) => {
      return state.showGlobalDialog
    },
  },
  mutations: {
    initDataAction: (state) => {
      state.userType = 1
      state.showGlobalDialog = false
    },
    setUserType: (state, payload) => {
      state.userType = payload
    },
    setGlobalDialog: (state, payload) => {
      state.showGlobalDialog = payload
    },
  },
  plugins: [createPersistedState({ storage: window.sessionStorage })],
})

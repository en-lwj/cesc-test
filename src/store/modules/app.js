export default {
  namespaced: true,
  state: {
    upVue: undefined
  },
  mutations: {
    setUpVue(state, upVue) {
      state.upVue = upVue
    }
  }
}
import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
  },
  getters: {
    upVue: state => state.app.upVue
  }
})

export default store
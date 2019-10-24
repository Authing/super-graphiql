// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueApollo from 'vue-apollo'
import apolloProvider from './apollo/provider'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';

import store from './store'

Vue.use(iView)
Vue.use(VueApollo)
Vue.use(ViewUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  apolloProvider,
  store,
  components: { App },
  template: '<App/>'
})

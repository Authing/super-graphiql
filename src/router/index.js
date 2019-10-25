import Vue from 'vue'
import Router from 'vue-router'
import ApolloPage from '@/components/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/graphiql',
      name: 'GraphQL Apollo',
      component: ApolloPage
    }
  ],
  mode: 'history'
})

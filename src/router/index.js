import HomeView from '@/views/Home.vue'
import QuestionPaper from '@/views/QuestionPaper.vue'
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/question-paper/:questionPaperId',
    name: 'question-paper',
    component: QuestionPaper,
    props: true
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

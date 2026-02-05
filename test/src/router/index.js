import { createRouter,createWebHistory } from "vue-router";
import Announcement from '../components/Announcement.vue';

const routes = [
    {
        path:'/',
        name:'OverView',
        component:Announcement
    },
    {
        path:'/announcement/:id',
        name:'Details',
        component:() => import('../components/Announcement_Detail.vue')
    }
]

const router = createRouter({
    history :createWebHistory(),
    routes
})

export default router
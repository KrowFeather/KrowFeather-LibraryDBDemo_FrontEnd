import { createRouter ,createWebHashHistory} from "vue-router";
import BorrowBooks from '@/pages/BorrowPage.vue'
import Home from '@/pages/HomePage.vue'
import BookInfo from '@/pages/BookInfoPage.vue'
import UserAccount from '@/pages/UserAccountPage.vue'
import UserBorrow from '@/pages/UserBorrowPage.vue'
const router = createRouter({
    history:createWebHashHistory(),
    routes:[
        {
            name:'borrow',
            path:'/BorrowPage',
            component:BorrowBooks
        },
        {
            name:'home',
            path:'/HomePage',
            component:Home,
        },
        {
            path:'/',
            redirect:'/HomePage'
        },
        {
            name:'bookinfo',
            path:'/BookInfo',
            component:BookInfo
        },
        {
            name:'useraccount',
            path:'/UserAccount',
            component:UserAccount
        },
        {
            name:'userborrow',
            path:'/UserBorrow',
            component:UserBorrow
        }
    ]
})

export default router

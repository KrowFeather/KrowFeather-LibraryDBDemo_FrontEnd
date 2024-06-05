import { defineStore } from "pinia";

export const useAccountStore = defineStore('account',{
    state(){
        return{
            username:'root',
            isLogined:0,
            host:'http://127.0.0.1:5000',
            isadmin:false,
            ipaddress:''
        }
    }
})
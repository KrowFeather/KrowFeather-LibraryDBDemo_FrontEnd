<template>
    <div class="wrapper-bookinf">
        <header>
            <h2>借阅</h2>
        </header>
        <div class="innerwrapper">
            <div class="user-borrow-window">
                <h3 style="height: 2.5em; display: flex; align-items: center;padding-left: 1em; box-sizing: border-box; color: #333;">您的借阅</h3>
                <el-table :data="userBorrowInfo" border stripe max-height="280">
                    <el-table-column prop="no" label="编号"></el-table-column>
                    <el-table-column prop="bookname" label="书名"></el-table-column>
                    <el-table-column prop="bookauthor" label="作者"></el-table-column>
                    <el-table-column prop="borrowtime" label="借阅时间"></el-table-column>
                    <el-table-column prop="returntime" label="归还时间"></el-table-column>
                </el-table>
            </div>
            <div class="result-window">
                <h3 style="height: 2.5em; display: flex; align-items: center;padding-left: 1em; box-sizing: border-box;color: #333;">可借阅</h3>
                <el-table :data="info" border stripe @selection-change="selectedBooks" max-height="300">
                    <el-table-column prop="bookid" label="编号"></el-table-column>
                    <el-table-column prop="bookname" label="书名"></el-table-column>
                    <el-table-column prop="booktype" label="类别"></el-table-column>
                    <el-table-column prop="bookauthor" label="作者"></el-table-column>
                    <el-table-column prop="rem" label="可借阅数量"></el-table-column>
                    <el-table-column label="操作" width="200">
                    <template #default="scope">
                        <el-button size="small" @click="borrowid=scope.row,borrowbookDialog = true">借阅</el-button>
                    </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-dialog v-model="borrowbookDialog" style="width: 30vw">
                <el-form>
                    <el-form-item>
                        <el-button type="primary" @click="createNewBorrow" class="btnBor">确定要借阅此书吗</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>
    </div>
</template>

<script lang="ts" setup>
import axios from 'axios';
import dayjs from 'dayjs';
import { ElMessage } from 'element-plus';
import { onMounted,ref } from 'vue';
import { useAccountStore } from '@/store/account';
let userBorrowInfo = ref()
let info = ref()
let borrowbookDialog = ref(false)
let selected:any=[]
let borrowid = ref()
const useAccount = useAccountStore()
let host = useAccount.host
onMounted(async () => {
    await getAllUserBorrow()
    await getAll()
})
const getAllUserBorrow = async()=>{
    await axios.get(host + '/getAllUserBorrow/'+useAccount.username).then((resp) => {
        console.log(resp.data)
        if (resp.data == 'failed') {
            ElMessage({
                type:'error',
                message:'failed to fetch data!',
                showClose:true
            })
        } else {
            userBorrowInfo.value = resp.data
        }
    })
}
const getAll = async () => {
    await axios.get(host + '/getAllBookCanBorrow').then((resp) => {
        console.log(resp.data)
        if (resp.data == 'failed') {
            ElMessage({
                type:'error',
                message:'failed to fetch data!',
                showClose:true
            })
        } else {
            info.value = resp.data
        }
    })
}
const selectedBooks = (data:any)=>{
    selected = []
    data.forEach((val:any) => {
        selected.push(val.bookid)
    });
    console.log(selected)
}
const createNewBorrow = async()=>{
    console.log(borrowid.value.bookid)
    const date = dayjs().format('YYYY-MM-DD')
    console.log(date)
    await axios.get(host+'/createNewBorrow/'+borrowid.value.bookid+'&&'+useAccount.username+'&&'+date).then((resp)=>{
        if(resp.data=='success'){
            ElMessage({
                type:'info',
                message:'借阅成功',
                showClose:true
            })
        }else{
            ElMessage({
                type:'error',
                message:'借阅失败',
                showClose:true
            })
        }
        
    })
    await getAll()
    await getAllUserBorrow()
}
</script>

<style scoped>
.wrapper-bookinf header {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 4em;
    width: 100%;
    background-color: #DDD;
    color: #333;
}

.wrapper-bookinf header h2 {
    font-size: 1.5em;
}

.result-window table {
    width: 100%;
}

.wrapper-bookinf {
    width: 100%;
    height: 100%
}

.user-borrow-window{
    width: 100%;
    height: 100%;
}

.btnBor{
    margin-top: 2vw;
    width: 100%;
}

</style>
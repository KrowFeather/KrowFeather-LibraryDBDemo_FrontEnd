<template>
    <div class="wrapper-borrow">
        <header>
            <h2>借阅管理</h2>
        </header>
        <div class="filter">
            <el-button circle type="primary" @click="getAll">ref</el-button>
            <el-button circle type="success" @click="addDialog = true">add</el-button>
            <div class="filter-right">
                <el-button @click="changeFilteron" :type="ison">filter</el-button>
                <el-input placeholder="userid" style="width: 10em;" v-model="userid"></el-input>
                <el-input placeholder="bookid" style="width: 10em;" v-model="bkid"></el-input>
                <el-date-picker placeholder="date" style="width: 10em;" v-model="bortime" value-format="YYYY-MM-DD"></el-date-picker>
            </div>
        </div>
        <div class="filtered" style="margin-bottom: 0.5em">
            <div class="result-window" v-if="filteron==true">
                <el-table :data="filter_info" border stripe>
                    <el-table-column prop="no" label="编号"></el-table-column>
                    <el-table-column prop="userid" label="用户编号"></el-table-column>
                    <el-table-column prop="bookid" label="图书编号"></el-table-column>
                    <el-table-column prop="borrowtime" label="借阅时间"></el-table-column>
                    <el-table-column prop="returntime" label="归还时间"></el-table-column>
                    <el-table-column label="操作" width="200">
                    <template #default="scope">
                        <el-button size="small" @click="alterBorrowDialog = true, alterid=scope.row">归还</el-button>
                    </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="result-window">
            <el-table :data="info" border stripe>
                <el-table-column prop="no" label="编号"></el-table-column>
                <el-table-column prop="userid" label="用户编号"></el-table-column>
                <el-table-column prop="bookid" label="图书编号"></el-table-column>
                <el-table-column prop="borrowtime" label="借阅时间"></el-table-column>
                <el-table-column prop="returntime" label="归还时间"></el-table-column>
                <el-table-column label="操作" width="200">
                <template #default="scope">
                    <el-button size="small" @click="alterBorrowDialog = true, alterid=scope.row">归还</el-button>
                </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog v-model="addDialog" style="width: 30vw">
            <h2>添加借阅</h2>
            <br>
            <el-form>
                <el-form-item>
                    <p>用户编号*</p>
                    <el-input v-model="userid"></el-input>
                    <p>书籍编号*</p>
                    <el-input v-model="bkid"></el-input>
                    <p>借阅时间</p>
                    <el-date-picker v-model="bortime" type="date" style="width: 100%;" value-format="YYYY-MM-DD"></el-date-picker>
                    <el-button type="primary" @click="addNewBorrow" class="btnAdd">add</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog v-model="alterBorrowDialog" style="width: 30vw">
            <el-form>
                <el-form-item>
                    <h2>确认对方已归还？</h2>
                    <el-button type="primary" @click="alterBorrowInfo" class="btnAlt">Yes</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { onMounted,ref } from 'vue';
import { useAccountStore } from '@/store/account';
import dayjs from 'dayjs';
const useAccount = useAccountStore()
let host = useAccount.host
let info = ref()
let filter_info = ref()
let userid = ref('')
let bkid = ref('')
let bortime = ref('')
let filteron = ref(false)
let addDialog = ref(false)
let ison = 'default'
let alterBorrowDialog = ref(false)
let alterid = ref()
onMounted(async () => {
    await getAll()
})
const changeFilteron = async()=>{
    if(filteron.value==true){
        filteron.value=false
        ison = 'default'
    }else{
        filteron.value=true
        ison = 'primary'
        await getAllFiltered()
    }
}
const getAll = async () => {
    await axios.get(host + '/getAllBorrowInfo').then((resp) => {
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
const getAllFiltered = async () => {
    await axios.get(host + '/getAllBorrowInfoFiltered/'+userid.value+'&&'+bkid.value+'&&'+bortime.value).then((resp) => {
        console.log(resp.data)
        if (resp.data == 'failed') {
            ElMessage({
                type:'error',
                message:'failed to fetch data!',
                showClose:true
            })
        } else {
            filter_info.value = resp.data
        }
    })
}
const addNewBorrow = async()=>{
    if(userid.value==''||bkid.value==''||bortime.value==''){
        ElMessage({
            type:'error',
            message:'添加失败，请确定必填项已填好',
            showClose:true
        })
        return
    }
    console.log(bortime.value)
    await axios.get(host+'/addNewBorrow/'+userid.value+'&&'+bkid.value+'&&'+bortime.value).then((resp)=>{
        if(resp.data=='success'){
            ElMessage({
                type:'info',
                message:'添加成功',
                showClose:true
            })
            getAll()
        }else{
            ElMessage({
                type:'error',
                message:'添加失败',
                showClose:true
            })
        }
    })
}
const alterBorrowInfo = async()=>{
    const rettime = dayjs().format('YYYY-MM-DD')
    await axios.get(host+'/returnBorrow/'+alterid.value.no+'&&'+rettime).then((resp)=>{
        if(resp.data=='success'){
            ElMessage({
                type:'info',
                message:'归还成功',
                showClose:true
            })
        }else{
            ElMessage({
                type:'error',
                message:'归还失败',
                showClose:true
            })
        }
    })
    await getAll()
    await getAllFiltered()
}
</script>

<style scoped>
.wrapper-borrow header {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 4em;
    width: 100%;
    background-color: #DDD;
    color: #333;
}

.wrapper-borrow header h2 {
    font-size: 1.5em;
}

.result-window table {
    width: 100%;
    border: 1px solid #DDD;
    border-collapse: collapse;
}

.wrapper-borrow {
    width: 100%;
}

.filter{
    width: 100%;
    height: 4vw;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 0 1vw ;
}

.btnAdd{
    margin-top: 2vw;
    width: 100%;
}
.btnAlt{
    margin-top: 2vw;
    width: 100%;
}

.filter-right{
    display: flex;
    width: 100%;
    justify-content: flex-end;
    align-items: center ;
    gap: 0.2em;
}
</style>
<template>
    <div class="wrapper-bookinf">
        <header>
            <h2>图书信息管理</h2>
        </header>
        <div class="filter">
            <el-button circle type="primary" @click="getAll">ref</el-button>
            <el-button circle type="success" @click="addDialog = true">add</el-button>
            <el-button circle type="danger" @click="delDialog = true">del</el-button>
        </div>
        <div class="result-window">
            <el-table :data="info" border stripe @selection-change="selectedBooks">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="bookid" label="编号"></el-table-column>
                <el-table-column prop="bookname" label="书名"></el-table-column>
                <el-table-column prop="booktype" label="类别"></el-table-column>
                <el-table-column prop="bookauthor" label="作者"></el-table-column>
                <el-table-column prop="total" label="总数"></el-table-column>
                <el-table-column prop="borrowed" label="已借阅数量"></el-table-column>
                <el-table-column label="操作" width="200">
                <template #default="scope">
                    <el-button size="small" @click="alterBookDialog = true, alterid=scope.row">编辑</el-button>
                </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog v-model="addDialog" style="width: 30vw">
            <h2>添加图书</h2>
            <br>
            <el-form>
                <el-form-item>
                    <p>编号*</p>
                    <el-input v-model="bkid"></el-input>
                    <p>书名*</p>
                    <el-input v-model="bkname"></el-input>
                    <p>类别</p>
                    <el-input v-model="bktype"></el-input>  
                    <p>作者</p>
                    <el-input v-model="bkauthor"></el-input>  
                    <p>总数</p>
                    <el-input v-model="bktotal"></el-input>  
                    <el-button type="primary" @click="addNewBook" class="btnAdd">add</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog v-model="alterBookDialog" style="width: 30vw">
            <h2>修改图书信息</h2>
            <br>
            <el-form>
                <el-form-item>
                    <p>书名*</p>
                    <el-input v-model="bkname"></el-input>
                    <p>类别</p>
                    <el-input v-model="bktype"></el-input>  
                    <p>作者</p>
                    <el-input v-model="bkauthor"></el-input>  
                    <p>总数</p>
                    <el-input v-model="bktotal"></el-input>  
                    <el-button type="primary" @click="alterBookInfo" class="btnAlt">alter</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog v-model="delDialog" style="width: 30vw;">
            <h2>确定要删除所选图书吗</h2>
            <br>
            <el-button type="primary" size="default" @click="delBook" class="btnDel">Yes</el-button>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { onMounted,ref } from 'vue';
import { useAccountStore } from '@/store/account';
const useAccount = useAccountStore()
let host = useAccount.host
let info = ref()
let bkid = ref('')
let bkname = ref('')
let bktype = ref('')
let bkauthor = ref('')
let bktotal = ref('')
let addDialog = ref(false)
let delDialog = ref(false)
let alterBookDialog = ref(false)
let selected:any=[]
let alterid = ref()
onMounted(async () => {
    await getAll()
})
const getAll = async () => {
    await axios.get(host + '/getAllBookInfo').then((resp) => {
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
const addNewBook = async()=>{
    let bkt = bktype.value
    if(bkt==''){
        bkt='null'
    }
    let bkau = bkauthor.value
    if(bkau==''){
        bkau='null'
    }
    let bktot = bktotal.value
    if(bktot==''){
        bktot='0'
    }
    await axios.get(host+'/addNewBook/'+bkid.value+'&&'+bkname.value+'&&'+bkt+'&&'+bkau+'&&'+bktot).then((resp)=>{
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
                message:'添加失败，该图书序号可能已存在',
                showClose:true  
            })
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
const delBook = async()=>{
    if(selected.length==0){
        ElMessage({
            type:'warning',
            message:'删除列表为空',
            showClose:true
        })
        return
    }
    let failCnt=0
    await selected.forEach(async(val:any) => {
        await axios.get(host+'/delBooks/'+val).then((resp)=>{
            if(resp.data=='failed'){
                failCnt++
            }
        })
        await getAll()
    });
    if (failCnt==0){
        ElMessage({
            type:'info',
            message:'删除成功',
            showClose:true
        })
    }else{
        ElMessage({
            type:'warning',
            message:''+failCnt+'个数据删除失败',
            showClose:true
        })
    }
}
const alterBookInfo = async()=>{
    console.log(alterid.value)
    let bkt = bktype.value
    if(bkt==''){
        bkt='null'
    }
    let bkau = bkauthor.value
    if(bkau==''){
        bkau='null'
    }
    let bktot = bktotal.value
    if(bktot==''){
        bktot='0'
    }
    if(bkname.value==''){
        ElMessage({
            type:'error',
            message:'请填写书名',
            showClose:true
        })
        return
    }
    await axios.get(host+'/alterBookInfo/'+alterid.value.bookid+'&&'+bkname.value+'&&'+bkt+'&&'+bkau+'&&'+bktot).then((resp)=>{
        if(resp.data=='success'){
            ElMessage({
                type:'info',
                message:'修改成功',
                showClose:true
            })
        }else{
            ElMessage({
                type:'error',
                message:'修改失败',
                showClose:true
            })
        }
        getAll()
    })
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
    border: 1px solid #DDD;
    border-collapse: collapse;
}

.wrapper-bookinf {
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

.btnDel{
    width: 100%;
}

</style>
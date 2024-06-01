<template>
    <div class="wrapper-user">
        <header>
            <h1>你好 {{ username }}</h1>
        </header>
        <div class="maincontent-user">
            <div class="changePassword" @click="changePwd = true">
                修改密码
            </div>
            <div class="deleteAccount" v-if="useAccount.username != 'root'" @click="delAccount = true">
                注销账户
            </div>
            <div class="changeSecureQuestion" @click="changeSQ = true">
                修改密保
            </div>
            <el-dialog v-model="changePwd" width="24em">
                <h2>修改密码</h2>
                <p style="margin-top: 1em;">旧密码</p>
                <el-input type="password" v-model="oldPassword"></el-input>
                <p style="margin-top: 1em;">新密码</p>
                <el-input type="password" v-model="newPassword"></el-input>
                <el-button type="primary" size="default" @click="changePassword"
                    style="width: 100%;margin-top: 2em;">确定</el-button>
            </el-dialog>
            <el-dialog v-model="delAccount" width="24em">
                <p style="margin-top: 1em;">请输入密码</p>
                <el-input type="password" v-model="ckpwd"></el-input>
                <el-button type="primary" size="default" @click="deleteAccount"
                    style="width: 100%;margin-top: 2em;">确定</el-button>
            </el-dialog>
            <el-dialog v-model="changeSQ" width="24em">
                <h2 style="margin-top: 1em;margin-bottom: 1em;">修改密保</h2>
                <el-form>
                    <el-form-item>
                        <el-select v-model="questionid">
                            <el-option label="你的生日是几月几号" value="你的生日是几月几号"></el-option>
                            <el-option label="你最喜欢的颜色是什么" value="你最喜欢的颜色是什么"></el-option>
                            <el-option label="你的家乡在哪里" value="你的家乡在哪里"></el-option>
                        </el-select>
                        <el-input type="text" v-model="ans" style="margin-top: 1em;"></el-input>
                        <div style="display: flex;width: 100%;">
                            <el-button type="primary" size="default" @click="changeSeQ"
                                style="width: 100%;margin-top: 2em;">确定</el-button>
                            <el-button type="default" size="default" @click="changeSeQtoDefault"
                                style="width: 100%;margin-top: 2em; ">恢复默认</el-button>
                        </div>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useAccountStore } from '@/store/account';
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
const useAccount = useAccountStore()
let host = useAccount.host
let username = useAccount.username
let changePwd = ref(false)
let changeSQ = ref(false)
let delAccount = ref(false)
let oldPassword = ref('')
let newPassword = ref('')
let ckpwd = ref('')
let questionid = ref('')
let ans = ref('')
const changePassword = async () => {
    if (oldPassword.value == '' || newPassword.value == '') {
        ElMessage({
            type: 'error',
            message: '请填写旧密码和新密码',
            showClose: true
        })
    }
    await axios.get(host + '/changePassword/' + oldPassword.value + '&&' + newPassword.value + '&&' + useAccount.username).then((resp) => {
        if (resp.data == 'success') {
            ElMessage({
                type: 'info',
                message: '修改成功',
                showClose: true
            })
        } else {
            if (resp.data == 'wrong') {
                ElMessage({
                    type: 'error',
                    message: '修改失败,原密码错误',
                    showClose: true
                })
            } else {
                ElMessage({
                    type: 'error',
                    message: '修改失败',
                    showClose: true
                })
            }
        }
    })
}
const deleteAccount = async () => {
    if (ckpwd.value == '') {
        ElMessage({
            type: 'error',
            message: '请填写密码',
            showClose: true
        })
    }
    await axios.get(host + '/delAccount/' + ckpwd.value + '&&' + useAccount.username).then((resp) => {
        if (resp.data == 'success') {
            ElMessage({
                type: 'info',
                message: '注销成功',
                showClose: true
            })
            useAccount.isLogined = 0
        } else {
            if (resp.data == 'wrong') {
                ElMessage({
                    type: 'error',
                    message: '注销失败,密码错误',
                    showClose: true
                })
            } else {
                ElMessage({
                    type: 'error',
                    message: '注销失败',
                    showClose: true
                })
            }
        }
    })
}
const changeSeQ = async () => {
    console.log('questionid',questionid.value)
    if (questionid.value == '' || ans.value == '') {
        ElMessage({
            type: 'error',
            message: '请填写密保',
            showClose: true
        })
        return
    }
    await axios.get(host + '/changeSeQ/' + useAccount.username + '&&' + questionid.value + '&&' + ans.value).then((resp) => {
        if (resp.data == 'success') {
            ElMessage({
                type: 'info',
                message: '修改成功',
                showClose: true
            })
        } else {
            ElMessage({
                type: 'error',
                message: '修改失败',
                showClose: true
            })
        }
    })
}
const changeSeQtoDefault = async () => {
    await axios.get(host + '/changeSeQtoDefault/' + useAccount.username).then((resp) => {
        if (resp.data == 'success') {
            ElMessage({
                type: 'info',
                message: '重置成功',
                showClose: true
            })
        } else {
            ElMessage({
                type: 'error',
                message: '重置失败',
                showClose: true
            })
        }
    })
}
</script>

<style scoped>
.wrapper-user {
    width: 100%;
    height: 100%;
}

header {
    height: 10em;
    width: 100%;
    display: flex;
    align-items: center;
    background-color: #EEE;
    box-sizing: border-box;
    padding: 0 2em;
}

.maincontent-user {
    width: 100%;
    height: 100%;
}

.changePassword {
    height: 3em;
    width: 100%;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding-left: 1em;
}

.changePassword:hover {
    background-color: #EEE;
    transition: 0.25s;
}

.deleteAccount {
    height: 3em;
    width: 100%;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding-left: 1em;
}

.deleteAccount:hover {
    background-color: #EEE;
    transition: 0.25s;
}

.changeSecureQuestion {
    height: 3em;
    width: 100%;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding-left: 1em;
}

.changeSecureQuestion:hover {
    background-color: #EEE;
    transition: 0.25s;
}
</style>
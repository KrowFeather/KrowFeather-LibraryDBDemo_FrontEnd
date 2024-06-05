<template>
  <div class="mask" v-if="accountStore.isLogined == 0 || accountStore.isLogined == 2">
    <div class="loginForm" v-if="accountStore.isLogined == 0">
      <h1>Login</h1>
      <div class="inputForm">
        <el-input type="text" v-model="username" placeholder="username" class="inputer"></el-input>
        <el-input type="password" v-model="password" placeholder="password" class="inputer"></el-input>
        <div class="buttonGroup" style="margin-top: 5em;display: flex;width: 70%;">
          <el-button class="loginBtn" @click="logined" style="width: 100%;">Log in</el-button>
          <el-button class="regBtn" @click="register" style="width: 100%;">Reg</el-button>
        </div>
        <el-button class="findBtn" @click="adminLogin" style="width: 70%; margin-top: 1em;">管理员登录</el-button>
        <el-button class="findBtn" @click="findPwd = true"
          style="width: 70%; margin-top: 1em;margin-left: -0.0vw">忘记密码？</el-button>
      </div>
    </div>
    <el-dialog v-model="findPwd" width="30em" @close="showFindSeQTable = false, showResTable = false">
      <el-form>
        <el-form-item>
          <h2 style="width: 100%;">找回密码</h2>
          <h3>请输入用户id</h3>
          <el-input v-model="username"></el-input>
          <el-button style="width: 100%;margin-top: 1em" type="primary" @click="getSeQ">查询</el-button>
        </el-form-item>
        <el-form-item v-if="showFindSeQTable == true">
          <h3 style="width: 100%;">请输入密保</h3>
          <p>您的密保是：{{ seq }}</p>
          <el-input v-model="ans"></el-input>
          <el-button style="width: 100%;margin-top: 1em" type="primary" @click="confirmSeQ">确定</el-button>
        </el-form-item>
        <el-form-item v-if="showResTable == true">
          <p>您的密码是：{{ retpassword }}</p>
        </el-form-item>
      </el-form>
    </el-dialog>
    <div class="regForm" v-if="accountStore.isLogined == 2">
      <h1>Register</h1>
      <div class="inputForm">
        <el-input type="text" v-model="username" placeholder="your username *" class="inputer"></el-input>
        <el-input type="password" v-model="password" placeholder="your pwd *" class="inputer"></el-input>
        <el-input type="password" v-model="re_password" placeholder="reconfirm your pwd *" class="inputer"></el-input>
        <p style="margin: 0.3em">设置密保(选)</p>
        <el-select v-model="questionid" style="width: 70%;">
          <el-option label="你的生日是几月几号" value="你的生日是几月几号"></el-option>
          <el-option label="你最喜欢的颜色是什么" value="你最喜欢的颜色是什么"></el-option>
          <el-option label="你的家乡在哪里" value="你的家乡在哪里"></el-option>
        </el-select>
        <el-input type="text" v-model="ans" style="width: 70%;margin-top: 0.2em;margin-bottom: 1em;"
          placeholder="答案"></el-input>
        <div class="buttonGroup" style="width: 70%; display: flex;">
          <el-button class="reggBtn" @click="registerNew">Reg</el-button>
          <el-button class="backBtn" @click="backToLogin">Back</el-button>
        </div>
      </div>
    </div>
  </div>

  <div class="wrapper" v-if="accountStore.isLogined == 1">
    <el-menu mode="vertical" :default-active="selectedIndex" @select="selected" background-color="#333" class="sidebar"
      active-text-color="white" text-color="#AAA">
      <el-menu-item index="1">首页</el-menu-item>
      <el-menu-item index="5" v-if="accountStore.isadmin == false">借阅</el-menu-item>
      <el-menu-item index="2" v-if="accountStore.isadmin == true">借阅管理</el-menu-item>
      <el-menu-item index="3" v-if="accountStore.isadmin == true">图书信息管理</el-menu-item>
      <el-menu-item index="4">账号管理</el-menu-item>
    </el-menu>
    <div class="maincontent">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import axios from 'axios';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useAccountStore } from '@/store/account';
const accountStore = useAccountStore()
let router = useRouter()
let username = ref('')
let password = ref('')
let re_password = ref('')
let retpassword = ref('')
let findPwd = ref(false)
let selectedIndex = ref('1')
let questionid = ref('')
let ans = ref('')
let host = accountStore.host
let seq = ref('')
let showFindSeQTable = ref(false)
let showResTable = ref(false)
onMounted(async () => {
  await axios.get(host + '/getip')
    .then(response => {
      if (response.data == 'No') {
        ElMessage({
          type: 'error',
          message: '出错了',
          showClose: true
        })
      } else {
        accountStore.ipaddress = response.data
      }
    })
    .catch(error => {
      console.log(error);
    });
    console.log(accountStore.ipaddress)
})
const logined = async () => {
  await axios.get(host + '/Logincheck/' + username.value + '&&' + password.value).then((response) => {
    console.log(response.data)
    if (response.data == 'Yes') {
      ElMessage({
        type: 'info',
        message: '登录成功',
        showClose: true
      })
      accountStore.isLogined = 1;
      accountStore.username = username.value
      changeToHomePage()
    } else {
      ElMessage({
        type: 'error',
        message: '密码或用户名错误',
        showClose: true
      })
    }
  })
}

const adminLogin = async () => {
  await axios.get(host + '/adminLogin/' + username.value + '&&' + password.value).then((response) => {
    console.log(response.data)
    if (response.data == 'Yes') {
      ElMessage({
        type: 'info',
        message: '登录成功',
        showClose: true
      })
      accountStore.isLogined = 1;
      accountStore.username = username.value
      accountStore.isadmin = true
      changeToHomePage()
    } else {
      ElMessage({
        type: 'error',
        message: '密码或用户名错误',
        showClose: true
      })
    }
  })
}
const register = () => {
  accountStore.isLogined = 2
}

const registerNew = async () => {
  console.log('quesid', questionid.value)
  if (username.value == '' || password.value == '' || re_password.value == '') {
    ElMessage({
      type: 'error',
      message: '输入有误，请确保必填项都已填好',
      showClose: true
    })
    return
  } else {
    if (password.value != re_password.value) {
      ElMessage({
        type: 'error',
        message: '两次密码输入不一致',
        showClose: true
      })
      return
    }
    if (questionid.value == '' || ans.value == '') {
      await axios.get(host + '/regcheckNoques/' + username.value + '&&' + password.value + '&&' + accountStore.ipaddress).then((response) => {
        if (response.data == 'No') {
          ElMessage({
            type: 'error',
            message: '出现错误,用户名可能已被注册',
            showClose: true
          })
        } else {
          if (response.data == 'warning') {
            ElMessage({
              type: 'warning',
              message: '您今天已经注册过一次了，最多两次',
              showClose: true
            })
            accountStore.isLogined = 0
          }
          if (response.data == 'Yes') {
            ElMessage({
              type: 'info',
              message: '注册成功',
              showClose: true
            })
            accountStore.isLogined = 0
          }
          if (response.data == 'full') {
            ElMessage({
              type: 'error',
              message: '今天注册次数已达上限',
              showClose: true
            })
          }
        }
      })
    } else {
      await axios.get(host + '/regcheck/' + username.value + '&&' + password.value + '&&' + questionid.value + '&&' + ans.value + '&&' + accountStore.ipaddress).then((response) => {
        if (response.data == 'No') {
          ElMessage({
            type: 'error',
            message: '出现错误,用户名可能已被注册',
            showClose: true
          })
        } else {
          if (response.data == 'warning') {
            ElMessage({
              type: 'warning',
              message: '您今天已经注册过一次了，最多两次',
              showClose: true
            })
            accountStore.isLogined = 0
          }
          if (response.data == 'Yes') {
            ElMessage({
              type: 'info',
              message: '注册成功',
              showClose: true
            })
            accountStore.isLogined = 0
          }
          if (response.data == 'full') {
            ElMessage({
              type: 'error',
              message: '今天注册次数已达上限',
              showClose: true
            })
          }
        }
      })
    }
  }
}

const selected = (index: any) => {
  if (index == '1') {
    changeToHomePage()
  } else if (index == '2') {
    changeToBorrowPage()
  } else if (index == '3') {
    changeToBookInfoPage()
  } else if (index == '4') {
    changeToUserInfoPage()
  } else if (index == '5') {
    changeToUserBorrowPage()
  }
}

const backToLogin = () => {
  accountStore.isLogined = 0
}

const changeToBorrowPage = () => {
  router.push({
    name: 'borrow'
  })
}
const changeToHomePage = () => {
  router.push({
    name: 'home'
  })
}
const changeToBookInfoPage = () => {
  router.push({
    name: 'bookinfo'
  })
}
const changeToUserInfoPage = () => {
  router.push({
    name: 'useraccount'
  })
}
const changeToUserBorrowPage = () => {
  router.push({
    name: 'userborrow'
  })
}

const getSeQ = async () => {
  await axios.get(host + '/getSeQ/' + username.value).then((resp: any) => {
    console.log(resp.data)
    if (resp.data == 'No') {
      ElMessage({
        type: 'error',
        message: '出现错误',
        showClose: true
      })
    } else {
      if (resp.data == 'NULL') {
        ElMessage({
          type: 'warning',
          message: '抱歉你并没有设置密保',
          showClose: true
        })
      } else {
        seq.value = resp.data
        showFindSeQTable.value = true
      }
    }
  })
}

const confirmSeQ = async () => {
  await axios.get(host + '/confirmSeQ/' + username.value + '&&' + ans.value).then((resp: any) => {
    console.log(resp.data)
    if (resp.data == 'No') {
      ElMessage({
        type: 'error',
        message: '异常错误',
        showClose: true
      })
    } else {
      if (resp.data == 'failed') {
        ElMessage({
          type: 'error',
          message: '答案错误',
          showClose: true
        })
      } else {
        retpassword.value = resp.data
        showResTable.value = true
      }
    }
  })
}
</script>

<style scoped>
.mask {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loginForm {
  width: 20em;
  height: 30em;
  background-color: dodgerblue;
  color: white;
  border-radius: 4px;
  box-shadow: 3px 3px 4px lightblue;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.loginForm h1 {
  font-size: 3em;
  height: 25%;
}

.loginForm .inputForm {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  height: 55%;
}

.inputForm el-input {
  height: 2em;
  width: 70%;
  margin-top: 0.5em;
}

.regForm {
  width: 20em;
  height: 30em;
  background-color: dodgerblue;
  color: white;
  border-radius: 4px;
  box-shadow: 3px 3px 4px lightblue;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.regForm h1 {
  font-size: 3em;
  height: 25%;
}

.regForm .inputForm {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  height: 55%;
}

.inputer {
  width: 70%;
  margin-bottom: 2px;
}

.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 12em;
  height: 100%;
  z-index: 1000;
}

.maincontent {
  margin-left: 12em;
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  /* background-color: black */
}

.reggBtn,
.backBtn {
  width: 100%;
}
</style>
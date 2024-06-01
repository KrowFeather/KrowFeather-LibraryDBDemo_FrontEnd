<template>
  <div class="wrapper-homepage">
    <div class="statistics">
      <div class="upperstat">
        <h3>日借阅量统计</h3>
        <div class="userborrow" id="ub" :style="{ width: '100%', height: '18em' }"></div>
      </div>
      <div class="lowerstat">
        <div class="lsblock">
          <h3>最受欢迎图书排行榜</h3>
          <div class="mpopBooks" id="mpb" :style="{ width: '100%', height: '18em' }"></div>
        </div>
        <div class="lsblock">
          <h3>借阅用户排行榜</h3>
          <div class="mwelusers" id="mwu" :style="{ width: '100%', height: '18em' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import * as echarts from "echarts";
onMounted(async () => {
  const ubchart = document.getElementById("ub")
  if (ubchart) {
    ubchart.removeAttribute('_echarts_instance_');
  }
  const mpbchart = document.getElementById("mpb")
  if (mpbchart) {
    mpbchart.removeAttribute('_echarts_instance_');
  }
  const mwuchart = document.getElementById("mwu")
  if (mwuchart) {
    mwuchart.removeAttribute('_echarts_instance_');
  }
  await initChart1()
  await initChart2()
  await initChart3()
})
// let dayStat = ref()
let upperstat_date: any = []
let upperstat_cnt: any = []
let mostPopularBooks_id: any = []
let mostPopularBooks_cnt: any = []
let mostWelcomeUsers_id: any = []
let mostWelcomeUsers_cnt: any = []

async function initChart1() {
  await getRankbyDay()
  let chart = echarts.init(document.getElementById("ub"), "light");
  chart.setOption({
    xAxis: {
      type: "category",
      data: upperstat_date
    },
    tooltip: { trigger: "axis" },
    yAxis: { type: "value" },
    series: [
      {
        data: upperstat_cnt,
        type: "line",
        smooth: false,
      }
    ]
  });
  window.onresize = function () {
    chart.resize();
  };
}
async function initChart2() {
  await getMostPopularBooks()
  let chart = echarts.init(document.getElementById("mpb"), "light");
  chart.setOption({
    xAxis: {
      type: "category",
      data: mostPopularBooks_id
    },
    tooltip: {
      trigger: "axis"
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        data: mostPopularBooks_cnt,
        type: "bar",
        smooth: false,
      }
    ]
  });
  window.onresize = function () {
    chart.resize();
  };
}
async function initChart3() {
  await getMostWelcomeUser()
  let chart = echarts.init(document.getElementById("mwu"), "light");
  chart.setOption({
    xAxis: {
      type: "category",
      data: mostWelcomeUsers_id
    },
    tooltip: {
      trigger: "axis"
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        data: mostWelcomeUsers_cnt,
        type: "bar",
        smooth: false,
      }
    ]
  });
  window.onresize = function () {
    chart.resize();
  };
}
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useAccountStore } from '@/store/account';
const useAccount = useAccountStore()
let host = useAccount.host
const getRankbyDay = async () => {
  await axios.get(host + '/getBorrowRankByDay').then((resp) => {
    console.log('getRank:',resp.data)
    if (resp.data == 'failed') {
      ElMessage({
        type: 'error',
        message: 'failed to fetch data!',
        showClose: true
      })
    } else {
      resp.data.forEach((val: any) => {
        upperstat_date.push(val.borrowtime)
        upperstat_cnt.push(val.cnt)
      });
      console.log('upperstat_cnt',upperstat_cnt)
      console.log('upperstat_date',upperstat_date)
    }
  })
}
const getMostPopularBooks = async () => {
  await axios.get(host + '/getMostPopularBooks').then((resp) => {
    console.log(resp.data)
    if (resp.data == 'failed') {
      ElMessage({
        type: 'error',
        message: 'failed to fetch data!',
        showClose: true
      })
    } else {
      resp.data.forEach((val: any) => {
        mostPopularBooks_id.push(val.bookid)
        mostPopularBooks_cnt.push(val.cnt)
      });
      console.log(mostPopularBooks_id)
      console.log(mostPopularBooks_cnt)
    }
  })
}
const getMostWelcomeUser = async () => {
  await axios.get(host + '/getMostWelcomeUser').then((resp) => {
    console.log(resp.data)
    if (resp.data == 'failed') {
      ElMessage({
        type: 'error',
        message: 'failed to fetch data!',
        showClose: true
      })
    } else {
      resp.data.forEach((val: any) => {
        mostWelcomeUsers_id.push(val.userid)
        mostWelcomeUsers_cnt.push(val.cnt)
      });
      console.log(mostWelcomeUsers_id)
      console.log(mostWelcomeUsers_cnt)
    }
  })
}
</script>

<style scoped>
.wrapper-homepage {
  width: 100%;
  height: 100%;
}

.lowerstat {
  display: flex;
  width: 100%;
  justify-content: space-around;
}

.lsblock {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

}

.upperstat {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 2em;
  font-size: 1.2em;
}
</style>
<template>
  
  <!-- Header -->
  <header class="app-header">
    <div class="wrap">
      <div class="brand">
        <div class="brand-title">魔法使搬運鋪—客訴系統</div>
      </div>
      <div class="clock">
      <!-- 實時顯示時間的區域 -->
        <div class="time-display">{{ time }}</div>
      </div>
    </div>

  </header>

  <!-- Main -->
  <main class="container">
    <!-- Left: Complaint records -->
    <section class="card">
      <div class="card-header">
        <div class="card-title">客訴紀錄總覽</div>
        <div class="filters">
          <button class="button_NewCustomerCase" @click="openNewCustomer()">建立客訴案件</button>
          <select v-model="searchCase.客訴類型" class="select">
            <option>全部類型</option>
            <option v-for="value in complaintTypes" :key="value.類型編號":value="value.類型編號">{{ value.類型描述 }}</option >
            <!-- <option>物品損壞</option>
            <option>遲到</option>
            <option>服務態度不佳</option>
            <option>價格爭議</option> -->
          </select>
          <input v-model="searchCase.對應訂單編號" class="input" type="text" placeholder="搜尋案件編號 / 訂單編號 / 類型"/>
          
          <div class="form-group">
            <label for="StartDate" class="form">開始日期：</label>
            <input v-model="searchCase.開始客訴日期" type="date" name="StartDate" id="StartDate">
            <span> ~ </span>
            <label for="EndDate">結束日期：</label>
            <input v-model="searchCase.結束客訴日期" type="date" name="EndDate" id="EndDate">
          </div>
          <select v-model="searchCase.案件嚴重度" class="select">
            <option>全部嚴重度</option>
            <option>高</option>
            <option>中</option>
            <option>低</option>
          </select>
          <select v-model="searchCase.處理狀態" class="select">
            <option>全部狀態</option>
            <option v-for="status in statusTypes" :key="status.狀態編號" :value="status.狀態編號">{{ status.狀態描述 }}</option>
            <!-- <option>待處理</option>
            <option>已受理</option>
            <option>處理中</option>
            <option>處理完成</option> -->
          </select>
          <button class="button" @click="Search()">篩選</button>

        </div>
      </div>

      <div class="card-body table-wrap">
        <table>
          <thead>
            <tr>
              <th class="card-title-nav">案件編號<i class="bi bi-arrow-down-short float-end"></i></th>
              <th class="card-title-nav">類型<i class="bi bi-arrow-down-short float-end"></i></th>
              <th class="card-title-nav">對應訂單編號<i class="bi bi-arrow-down-short float-end"></i></th>
              <th class="card-title-nav">客訴日期<i class="bi bi-arrow-down-short float-end"></i></th>
              <th class="card-title-nav">受理日期<i class="bi bi-arrow-down-short float-end"></i></th>
              <th class="card-title-nav">嚴重度<i class="bi bi-arrow-down-short float-end"></i></th>
              <th class="card-title-nav">處理狀態<i class="bi bi-arrow-down-short float-end"></i></th>
              <th class="card-title-nav">負責人<i class="bi bi-arrow-down-short float-end"></i></th>
            </tr>
          </thead>
          
          <tbody>
            <!-- <tr v-for="item in cases" :key="item.id" @click="selectCase(item)"></tr> -->
          <tr v-for="c in cases" :key="c.客訴紀錄編號" @click="selectCase(c)">
            <td>{{ c.客訴紀錄編號 }}</td>
            <td>{{ c.客訴類型 }}</td>
            <td>{{ c.對應訂單編號 }}</td>
            <td>{{ c.客訴日期formatted }}</td>
            <td>{{ c.受理日期formatted }}</td>
            <td>
              <span :class="{
                badge: true,
                'sev-high': c.案件嚴重度 === '高',
                'sev-medium': c.案件嚴重度 === '中',
                'sev-low': c.案件嚴重度 === '低'
              }">
                <span class="badge-dot"></span>{{ c.案件嚴重度 }}</span>
            </td>
            <td>
              <span :class="{
                badge: true,
                'st-pending': c.處理狀態 === '待處理',
                'st-accepted': c.處理狀態 === '已受理',
                'st-processing': c.處理狀態 === '處理中',
                'st-completed': c.處理狀態 === '處理完成'
              }"><span class="badge-dot"></span>{{ c.處理狀態 }}</span>
            </td>
            <td>{{ c.案件負責人 }}</td>
          </tr>
        </tbody>

        </table> 
      </div>

    </section>

  </main>

<Customer_System_Details v-if="selectedcase" :SelectCaseDetail="selectedcase" @close="selectedcase = null" @send="handle"/>
<Customer_System_NewCustomer ref="showCreate"/>
<Customer_system_editCustomer ref="Edit"/>

</template>

<!-- <script>
    import Character from './component/Character.vue';
    export default {
        name: "App",

    };
</script> -->
<script setup>
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import Customer_System_Details from './Customer_System_Details.vue';
import Customer_System_NewCustomer from './Customer_System_NewCustomer.vue';
import api from '../axios/axios.js';
import Customer_system_editCustomer from './Customer_system_editCustomer.vue';

console.log(api.get('/EIP'));


const showCreate = ref(null);
const Edit = ref(null);
const selectedcase = ref(null);
const time = ref('')
const cases = ref([]);
const complaintTypes = ref([]);
const statusTypes = ref([]);
const searchCase =reactive({
  對應訂單編號: '',
  客訴類型: '全部類型',
  案件嚴重度: '全部嚴重度',
  處理狀態: '全部狀態',
  開始客訴日期: '',
  結束客訴日期: ''
});




// 格式化時間
function formatTime(date) {
  const h = String(date.getHours()).padStart(2, '0')
  const m = String(date.getMinutes()).padStart(2, '0')
  const s = String(date.getSeconds()).padStart(2, '0')
  return `${h}:${m}:${s}`
}

let timer = null

/* onMounted 部分*/ 
onMounted(() => {
  time.value = formatTime(new Date())
  timer = setInterval(() => {
    time.value = formatTime(new Date())
  }, 1000)
})
onMounted(async () => {
  const res = await api.get('/EIP');
  cases.value = res.data;
});

onMounted(async () => {
  const res = await api.get('/EIP/types');
  complaintTypes.value = res.data;
});

onMounted(async () => {
  const res = await api.get('/EIP/status');
  statusTypes.value = res.data;
});

onUnmounted(() => {
  clearInterval(timer)
})


// function selectCase(item) {
//   // console.log(item);

//   selectedcase.value = cases.value.find(c => c.客訴紀錄編號 === item.客訴紀錄編號);
//   console.log(selectedcase.value);
// }
async function selectCase(item) {

  try {
      const res = await api.get(`/EIP/${item.客訴紀錄編號}`); // 呼叫詳細 API
      selectedcase.value = res.data;               // DetailCaseDTO
  } catch (error) {
    console.error('Error fetching case details:', error);
  }

}

function Search() {
  console.log(searchCase);
  // 篩選邏輯
  if(searchCase.客訴類型 === '全部類型') {
    searchCase.客訴類型 = '';
  }
  if(searchCase.案件嚴重度 === '全部嚴重度') {
    searchCase.案件嚴重度 = '';
  }
  if(searchCase.處理狀態 === '全部狀態') {
    searchCase.處理狀態 = '';
  }
   
  api.get('/EIP/search', { params: searchCase})
  
    .then(response => {
      cases.value = response.data;
      if(cases.value.length === 0) {
        alert('查無符合條件的案件');
      }
      if(cases.value.length > 0) {
        alert(`共找到 ${cases.value.length} 筆符合條件的案件`);
      }
    })
    .catch(error => {
      console.error('搜尋失敗:', error);
      alert('搜尋失敗，請稍後再試。');
    });


}

function openNewCustomer() {
  showCreate.value.open();
}

function handle(item) {
  console.log('Received in parent:', item);
  Edit.value.open(item);

}

</script>

<style scoped>
    :root {
      /* 基礎配色（藍綠系） */
      --color-primary: #2F80ED;
      --color-bg: #F7F9FC;
      --color-card: #FFFFFF;
      --color-border: #E5EAF0;
      --text-main: #333333;
      --text-sub: #666666;

      /* 狀態色 */
      --status-pending: #F2994A;    /* 待處理 */
      --status-accepted: #2D9CDB;   /* 已受理 */
      --status-processing: #6FCF97; /* 處理中 */
      --status-completed: #27AE60;  /* 處理完成 */

      /* 嚴重度色 */
      --sev-high: #EB5757;
      --sev-medium: #F2994A;
      --sev-low: #27AE60;

      /* 其他 */
      --shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
      --radius: 12px;
    }

    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Segoe UI", system-ui, "Microsoft JhengHei", sans-serif;
      color: var(--text-main);
      background: var(--color-bg);
      line-height: 1.5;
    }

    /* Header */
    .app-header {
      background: var(--color-card);
      border-bottom: 1px solid var(--color-border);
      /* position: sticky;
      top: 0; */
    }
    .app-header .wrap {
      max-width: 1200px; 
      margin-left: 10%; 
      padding: 10px 20px;
      text-align: center;
      display: flex; 
      justify-content: space-between;
    }
    .brand {
      display: flex; 
      align-items: center; 
      gap: 10px;
    }
    .brand-title {
      font-size: 40px; 
      font-weight: 700; 
      color: var(--color-primary);
    }
    .brand-sub {
      font-size: 14px; color: var(--text-sub);
    }

    .card-title-nav:hover{
      cursor: pointer;
      background-color: #e4e3df;
    }
    .card-title-nav:active{
      user-select: none;
      background-color: #b9b6b0;
    }

    .clock {
      /* margin-left: 10%; */
      color: var(--text-main);
      border: 2px solid var(--color-border);
      box-shadow: var(--shadow);
      padding: 10px 30px;
      border-radius: 10px;
      background-color: var(--color-border);
      user-select: none;
    }
    .time-display {

      font-size: 40px;
      color: rgb(53, 39, 133);
    }

    /* Tabs */
    .tabs {
      display: flex; gap: 12px;
    }
    .tab {
      padding: 8px 14px; border-radius: 999px;
      color: var(--text-sub); background: transparent; border: 1px solid transparent;
      cursor: pointer;
    }

    .tab.active {
      color: var(--color-card); background: var(--color-primary); border-color: var(--color-primary);
    }

    /* Layout */
    .container {
      max-width: 100%; 
      height: auto;
      padding: 0 5%;
      gap: 20px;


    }
    @media (max-width: 980px) {
      .container { 
        grid-template-columns: 1fr; 
        }
    }

    /* Cards */
    .card {
      background: var(--color-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
    }
    /* .card-header {
      padding: 14px 16px;
      border-bottom: 2px solid var(--color-border);
      display: flex; 
      flex-wrap: wrap;
      align-items: center; 
      justify-content: space-between;
    } */
    .card-title {
      font-weight: 700; font-size: 25px;
    }
    .card-body { padding: 16px; }


    /* Filters */
    .filters {
      display: flex; 
      gap: 10px; 
      flex-wrap: wrap;
    }
    .input, .select {
      border: 1px solid var(--color-border);
       border-radius: 8px;
        padding: 8px 10px;
      background: #FAFBFE; color: var(--text-main);
    }
    .button {

      border: 1px solid var(--color-primary); 
      color: var(--color-card);
      background: var(--color-primary);
      
      border-radius: 8px; 
      padding: 8px 16px;
      cursor: pointer;
    }
    .button_NewCustomerCase {

      border: 1px solid #27AE60; 
      color: var(--color-card);
      background: #27AE60;
      margin-right: auto;
      border-radius: 8px; 
      padding: 8px 16px;
      cursor: pointer;
    }
    .form-group {
      display: flex;
      flex-wrap: wrap;
      align-items: center;      
      gap: 12px;                 
    }

    .form-group input[type="date"] {
      padding: 10px 12px;
      font-size: 14px;
      border: 1px solid #E0E0E0;
      border-radius: 8px;
      background-color: #FAFAFA;
      color: #333;
      width: 180px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.04);
    }


    /* Table */
    .table-wrap { overflow: auto; }
    table { 
      width: 100%; 
      border-collapse: collapse; 
      min-width: 760px; 
    }
    thead th {
      text-align: left;
       font-weight: 600;
        font-size: 13px;
        color: var(--text-sub);
      padding: 10px;
       border-bottom: 10px solid var(--color-border);
        background: #F6F8FB;
    }
    tbody td {
      padding: 12px 10px; 
      border-bottom: 2px solid var(--color-border);
      vertical-align: middle;
      cursor: pointer;
    }
    tbody tr:hover { background: #f8e5c8; }
    tbody tr:active { 
      background: #ecc792;
      user-select: none; 
    }

    /* Badges */
    .badge {
      display: inline-flex; 
      align-items: center; 
      gap: 6px;
      border-radius: 999px; 
      padding: 4px 10px; 
      font-size: 12px; 
      font-weight: 600;
      color: #faf9f9;
    }
    .badge-dot {
      width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.9);
    }
    .sev-high { background: var(--sev-high); }
    .sev-medium { background: var(--sev-medium); }
    .sev-low { background: var(--sev-low); }

    .st-pending { background: var(--status-pending); }
    .st-accepted { background: var(--status-accepted); }
    .st-processing { background: var(--status-processing); }
    .st-completed { background: var(--status-completed); }


    /* Footer helper */
  



  </style>
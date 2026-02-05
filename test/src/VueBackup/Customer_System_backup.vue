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
          <select class="select">
            <option>全部類型</option>
            <option>物品損壞</option>
            <option>遲到</option>
            <option>服務態度不佳</option>
            <option>價格爭議</option>
          </select>
          <input class="input" type="text" placeholder="搜尋案件編號 / 訂單編號 / 類型"/>
          
          <div class="form-group">
            <label for="StartDate" class="form">開始日期：</label>
            <input type="date" name="StartDate" id="StartDate">
            <span> ~ </span>
            <label for="EndDate">結束日期：</label>
            <input type="date" name="EndDate" id="EndDate">
          </div>
          <select class="select">
            <option>全部嚴重度</option>
            <option>高</option>
            <option>中</option>
            <option>低</option>
          </select>
          <select class="select">
            <option>全部狀態</option>
            <option>待處理</option>
            <option>已受理</option>
            <option>處理中</option>
            <option>處理完成</option>
          </select>
          <button class="button">篩選</button>
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
            <tr @click="openDetails()">
              <td>A001</td>
              <td>物品損壞</td>
              <td>O001</td>
              <td>2025-12-23</td>
              <td>2025-12-23</td>
              <td>
                <span class="badge sev-high"><span class="badge-dot"></span>高</span>
              </td>
              <td>
                <span class="badge st-pending"><span class="badge-dot"></span>待處理</span>
              </td>
              <td>板本</td>
            </tr>
            <tr>
              <td>A002</td>
              <td>物品損壞</td>
              <td>O002</td>
              <td>2025-12-22</td>
              <td>2025-12-22</td>
              <td>
                <span class="badge sev-high"><span class="badge-dot"></span>高</span>
              </td>
              <td>
                <span class="badge st-accepted"><span class="badge-dot"></span>已受理</span>
              </td>
              <td>板本</td>
            </tr>
            <tr>
              <td>A003</td>
              <td>遲到</td>
              <td>O002</td>
              <td>2025-12-22</td>
              <td>2025-12-22</td>
              <td>
                <span class="badge sev-high"><span class="badge-dot"></span>高</span>
              </td>
              <td>
                <span class="badge st-accepted"><span class="badge-dot"></span>已受理</span>
              </td>
              <td>板本</td>
            </tr>
            <tr>
              <td>A004</td>
              <td>服務態度不佳</td>
              <td>O003</td>
              <td>2025-12-21</td>
              <td>2025-12-21</td>
              <td>
                <span class="badge sev-medium"><span class="badge-dot"></span>中</span>
              </td>
              <td>
                <span class="badge st-processing"><span class="badge-dot"></span>處理中</span>
              </td>
              <td>板本</td>
            </tr>
            <tr @click="openDetails()">
              <td>A005</td>
              <td>價格爭議</td>
              <td>O004</td>
              <td>2025-12-20</td>
              <td>2025-12-20</td>
              <td>
                <span class="badge sev-low"><span class="badge-dot"></span>低</span>
              </td>
              <td>
                <span class="badge st-completed"><span class="badge-dot"></span>處理完成</span>
              </td>
              <td>板本</td>
            </tr>
          </tbody> 
        </table> 
      </div>

    </section>

  </main>

<Customer_System_Details ref="showDetails" />

</template>

<!-- <script>
    import Character from './component/Character.vue';
    export default {
        name: "App",

    };
</script> -->
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Customer_System_Details from './Customer_System_Details.vue';

const showDetails = ref(null);
const time = ref('')

// 格式化時間
function formatTime(date) {
  const h = String(date.getHours()).padStart(2, '0')
  const m = String(date.getMinutes()).padStart(2, '0')
  const s = String(date.getSeconds()).padStart(2, '0')
  return `${h}:${m}:${s}`
}

let timer = null

onMounted(() => {
  time.value = formatTime(new Date())
  timer = setInterval(() => {
    time.value = formatTime(new Date())
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})


function openDetails() {
  showDetails.value.open();
}
  


//     import { ref } from 'vue'
    
//     const sortKey = ref('')     // 目前排序欄位
//     const sortAsc = ref(true)   // 排序方向（true=升序, false=降序）

//     function sortBy(key) {
//         if (sortKey.value === key) 
//         {
//         sortAsc.value = !sortAsc.value
//         } 
//         else 
//         {
//             sortKey.value = key
//             sortAsc.value = true
//         }
// }

//     complaints: [
//       { caseId: 'A001', type: '物品損壞', orderId: 'O001', complaintDate: '2025-12-23', acceptDate: '2025-12-23', severity: '高', status: '待處理', owner: '板本' },
//       { caseId: 'A002', type: '物品損壞', orderId: 'O002', complaintDate: '2025-12-22', acceptDate: '2025-12-22', severity: '高', status: '已受理', owner: '板本' },
//       { caseId: 'A003', type: '遲到', orderId: 'O002', complaintDate: '2025-12-22', acceptDate: '2025-12-22', severity: '高', status: '已受理', owner: '板本' },
//       { caseId: 'A004', type: '服務態度不佳', orderId: 'O003', complaintDate: '2025-12-21', acceptDate: '2025-12-21', severity: '中', status: '處理中', owner: '板本' },
//       { caseId: 'A005', type: '價格爭議', orderId: 'O004', complaintDate: '2025-12-20', acceptDate: '2025-12-20', severity: '低', status: '處理完成', owner: '板本' }
//     ]




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
      margin: 20px auto; 
      padding: 0 10%;
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
    .card-header {
      padding: 14px 16px;
      border-bottom: 2px solid var(--color-border);
      display: flex; 
      flex-wrap: wrap;
      align-items: center; 
      justify-content: space-between;
    }
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
      padding: 8px 12px;
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
      display: inline-flex; align-items: center; gap: 6px;
      border-radius: 999px; padding: 4px 10px; font-size: 12px; font-weight: 600;
      color: #fff;
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
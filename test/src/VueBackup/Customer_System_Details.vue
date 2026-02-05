<template>
  <!-- Main -->
   
<transition name="fade-zoom">
  <main class="container">
    
      <section v-if="SelectCaseDetail" class="card-details position-relative">
        <h2>案件詳情</h2>
        <button class="btn btn-sm btn-outline-secondary position-absolute top-0 end-0 m-4" @click="$emit('close')">✕</button>
        
        <div class="details-content">
          <p><strong>案件編號：</strong>{{ SelectCaseDetail.客訴紀錄編號 }}</p>
          <p><strong>訂單編號：</strong>{{ SelectCaseDetail.對應訂單編號 }}</p>
          <p><strong>客戶姓名：</strong>{{SelectCaseDetail.客戶姓名}}</p>
          <p><strong>客訴類型：</strong>{{ SelectCaseDetail.客訴類型 }}</p>
          <p><strong>嚴重度：</strong>
          <span :class="{ 
            badge: true, 
          'sev-high': SelectCaseDetail.案件嚴重度 === '高', 
          'sev-medium': SelectCaseDetail.案件嚴重度 === '中', 
          'sev-low': SelectCaseDetail.案件嚴重度 === '低' }">
            {{ SelectCaseDetail.案件嚴重度}}</span>
          </p>
          <p><strong>客訴日期：</strong>{{ SelectCaseDetail.客訴日期formatted }}</p>
          <p><strong>受理日期：</strong>{{ SelectCaseDetail.受理日期formatted }}</p>
          <p><strong>受理人員：</strong>{{ SelectCaseDetail.受理人員 }}</p>
          <p><strong>案件負責人：</strong>{{ SelectCaseDetail.案件負責人 }}</p>
          <p><strong>處理狀態：</strong><span :class="{ 'badge': true,
           'st-pending': SelectCaseDetail.處理狀態 === '待處理',
            'st-accepted': SelectCaseDetail.處理狀態 === '已受理',
             'st-processing': SelectCaseDetail.處理狀態 === '處理中',
              'st-completed': SelectCaseDetail.處理狀態 === '處理完成' }">{{ SelectCaseDetail.處理狀態 }}</span></p>
          <p><strong>客訴敘述：</strong>{{SelectCaseDetail.客訴內容}}</p>
        </div>
        <div class="Detail_Edit-Delete">
          <button :class="['btn', SelectCaseDetail.處理狀態 === '待處理' ? 'btn-info' : 'btn-primary', 'me-2']" @click="handleClick(SelectCaseDetail)">
                  {{ SelectCaseDetail.處理狀態 === '待處理' ? '受理' : '編輯' }}
          </button>

          <button class="btn btn-danger" @click="DeleteCase(SelectCaseDetail)">刪除</button>
        </div>

      </section>
    </main>

    <!-- 主內容 -->


      <!-- 案件詳情卡片 -->


</transition>
      
</template>


<script setup>

import { ref } from 'vue';
import api from '../axios/axios.js';



const show = ref(false);


const emit = defineEmits(['close','send'])
function close() {
  emit('close')
}



async function handleClick(item) {
  console.log(item);
  if(item.處理狀態 === '待處理')
  {
    try {
      await api.patch(`/EIP/${item.客訴紀錄編號}`,2// 更新為已受理
      ,{
        headers: { 'Content-Type': 'application/json' }
      });
    alert('案件已受理');
    item.處理狀態 = '已受理';
    }
    catch (error) {
          console.error("更新失敗:", error.response?.data, error.response?.status);
      }
    window.location.reload();
  }
  else
  {
      sendmessage(item);
  }

}

defineProps({
  SelectCaseDetail:Object
});


function sendmessage(item) {
    emit('send',item);
}


async function DeleteCase(item) {
  if(window.confirm('確定要刪除此案件嗎？')) 
  {
    try {
    api.delete(`/EIP/${item.客訴紀錄編號}`);
    alert('案件已刪除');
    // 這裡可以加入刷新列表的邏輯
    window.location.reload();
  } 
  catch (error) {
    console.error('刪除案件失敗:', error);
    alert('刪除案件失敗，請稍後再試。');
  }
  }
  else {
    return; // 使用者取消刪除
  }

  

}

</script>

<style>

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
      --status-processing: #9ea922; /* 處理中 */
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
    /* Layout */
    .container {
      position: absolute;
      border: 0;
      width: 100%;
      margin: 20px auto;
      height: auto;
      /* margin: 20px auto;  */
      padding: 0 8%;

      /* z-index: 1000; */
      
    }
    @media (max-width: 980px) {
      .container { grid-template-columns: 1fr; }
    }
    .card-details {
      margin: 20px auto;
      width: 40%;
      @media(max-width: 980px){
            margin: 20px auto;
            width: 90%;

      }

      background: rgb(223, 184, 106);
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      padding: 20px; 


    }
    /* details */
    .details-content{
      border-radius: 5px;
      line-height: 1.6;
      box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.6);
      padding: 40px;
      background-color: var(--color-bg);
    }
    .details-content p {
      border-bottom: 2px solid var(--color-border);
           align-items: center;
    }
    .Detail_Edit-Delete{
      background-color: var(--color-bg) ;
      display: flex;
      justify-content: center;
      gap: 50px;
      padding: 20px;
    }

    /*badge styles*/
        .badge {
      display: inline-flex; 
      align-items: center; 
      gap: 6px;
      border-radius: 999px; 
      padding: 4px 10px; 
      font-size: 12px; 
      font-weight: 600;
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



    .edit-panel {
    position: fixed; /* 或 absolute，看你要浮在畫面還是父容器 */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    background: #fff;
    box-shadow: 0 6px 20px rgba(0,0,0,0.2);
  }

</style>
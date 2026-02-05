<template>
  <div v-show="show" class="container mt-4 overlay">
    <!-- 卡片 -->
    <div class="card shadow-sm mx-auto  NewCase" >
      <div class="card-header bg-primary text-white fs-5 text-align-center sticky-top" name="title">
        新增客訴
      </div>
      <div class="card-body p-4">
        <!-- 表單 -->
        <form @submit.prevent="submitform">
          <div class="mb-3">
            <label class="form-label">客訴案件編號</label>
            <input type="text" class="form-control" placeholder="系統自動帶入" disabled="true"/>
          </div>
          <div class="row mb-3">
            <div class="col-md-6">
                <label class="form-label">訂單編號</label>
                <input v-model="form.對應訂單編號" type="text" class="form-control" placeholder="例如：O001" />
            </div>

            <div class="col-md-6">
                <label class="form-label">客戶姓名</label>
                <input v-model="form.客戶姓名" type="text" class="form-control" placeholder="例如：C001" />
            </div>

          </div>


          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">客訴類型</label>
              <select v-model="form.客訴類型" class="form-select">
                <option selected disabled hidden>請選擇客訴類型</option>
                <option v-for="type in complaintTypes" :key="type.類型編號" :value="type.類型編號">{{ type.類型描述}}</option>
              <!-- <option>物件損壞</option>
              <option>服務態度</option>
              <option>延誤</option>
              <option>其他</option> -->
              </select>
            </div>

            <div class="col-md-6">
              <label class="form-label">案件嚴重度</label>
              <select v-model="form.案件嚴重度" class="form-select">
                  <option selected disabled hidden>請選擇案件嚴重度</option>
                  <option>低</option>
                  <option>中</option>
                  <option>高</option>
              </select>
            </div>
            
          </div>


          <div class="row mb-3">
            <div class="col-md-6">
                <label class="form-label">客訴日期</label>
                <input v-model="form.客訴日期" type="date" class="form-control" />
            </div>

            <!-- <div class="col-md-6">
                <label class="form-label">受理日期</label>
                <input v-model="form.受理日期" type="date" class="form-control" placeholder="已受理時自動更新" disabled="true"/>
            </div> -->
          </div>
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="form-label">受理人員</label>
                    <select v-model="form.受理人員" class="form-select">
                        <option selected disabled hidden>請選擇受理人員</option>
                        <option>板本</option>
                        <option>澤村</option>
                        <option>御幸</option>
                        <option>木棉季</option>
                    </select>
                </div>

                <div class="col-md-6">
                    <label class="form-label">負責人</label>
                    <select v-model="form.案件負責人" class="form-select">
                        <option selected disabled hidden>請選擇負責人員</option>
                        <option>櫻井</option>
                        <option>清水</option>
                        <option>村上</option>
                        <option>櫻花</option>
                    </select>
                </div>


          </div>



          <div class="mb-3">
            <label class="form-label">客訴描述</label>
            <textarea v-model="form.客訴內容" class="form-control" rows="4" placeholder="請輸入詳細描述"></textarea>
          </div>

          
          <div class="mb-3">
            <label class="form-label">附件上傳</label>
            <input type="file" class="form-control" />
          </div>

          <button type="submit" class="btn btn-success">
            新增客訴
          </button>
          <button type="button" class="btn btn-secondary ms-2" @click="close">
            取消
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref,onMounted,reactive } from 'vue';
import api from '../axios/axios.js';
const show = ref(false);

const form = reactive({
  對應訂單編號: '',
  客戶姓名: '',
  客訴類型: '',
  客訴內容: '',
  案件嚴重度: '',
  受理人員: '',
  案件負責人: '',
  客訴日期: '',
  // 受理日期: new Date().toISOString().split('T')[0]
});
const complaintTypes = ref([]);

onMounted(async () => {
  const res = await api.get('/EIP/types');
  complaintTypes.value = res.data;
});


function submitform() {
  api.post('/EIP', form,{
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => {
      alert('客訴案件新增成功！');
      
      close();

      window.location.reload();
    })
    .catch(error => {
      console.error('新增失敗:', error);
      alert('新增失敗，請稍後再試。');
    });
  console.log(JSON.stringify(form));
}

function close() {
  show.value = false;
  document.body.classList.remove('modal-open');

}

function open() {
  show.value = true;
  document.body.classList.add('modal-open');

}


defineExpose({
  close,
  open
});

  defineProps({
    EditedCase:Object
  });

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



    .NewCase{
      max-height: 90vh;
        width: 40%;
        @media(max-width:980px) {
            width: 70%;
        }
        margin: 10px auto;
        overflow-y: auto;

    }

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


    /* Overlay 樣式 */
  .overlay {
  position: fixed;
  margin: 0;
  margin-top: 0 !important;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex; justify-content: center; align-items: center;
}


</style>

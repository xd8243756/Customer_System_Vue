<template>
  <div v-show="Edit" class="container overlay">
    <!-- 卡片 -->
    <div class="card shadow-sm mx-auto  NewCase" >
      <div class="card-header bg-warning text-white fs-5 text-align-center sticky-top">
        編輯客訴
      </div>
      <div class="card-body p-4">
        <!-- 表單 -->
        <form @submit.prevent="submitform()">
          <div class="mb-3">
            <label class="form-label">客訴案件編號</label>
            <input type="text" class="form-control" placeholder="系統自動帶入" disabled="true"/>
          </div>
          <div class="row mb-3">
            <div class="col-md-6">
                <label class="form-label">訂單編號</label>
                <select v-model="form.CaseId" class="form-select">
                  <option selected disabled hidden>請選擇訂單編號</option>
                  <option v-for="type in CaseName" :key="type.caseId" :value="type.caseId">{{ type.caseNo}}</option>

                </select>
            </div>

            <div class="col-md-6">
                <label class="form-label">客戶姓名</label>
                <select v-model="form.CustomerId" class="form-select">
                  <option selected disabled hidden>請選擇客戶姓名</option>
                  <option v-for="type in CustomerName" :key="type.customerId" :value="type.customerId">{{ type.customerName}}</option>

                </select>
            </div>

          </div>


          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">客訴類型</label>
              <select v-model="form.IssueTypeId" class="form-select">
                <option selected disabled hidden>請選擇客訴類型</option>
                <option v-for="type in complaintTypes" :key="type.issueTypeId" :value="type.issueTypeId">{{ type.issueTypeName}}</option>
              <!-- <option>物件損壞</option>
              <option>服務態度</option>
              <option>延誤</option>
              <option>其他</option> -->
              </select>
            </div>

            <div class="col-md-6">
              <label class="form-label">案件嚴重度</label>
              <select v-model="form.ComplaintSeverity" class="form-select">
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
                <input v-model="form.ComplaintStartAt" type="date" class="form-control" />
            </div>

            <div class="col-md-6">
                <label class="form-label">受理日期</label>
                <input v-model="form.ComplaintAcceptedAt" type="date" class="form-control"/>
            </div>
          </div>
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="form-label">受理人員</label>
                    <select v-model="form.ComplaintAcceptedBy" class="form-select">
                        <option selected disabled hidden>請選擇受理人員</option>
                        <option v-for="staff in employee" :key="staff.employeeId" :value="staff.employeeId">{{ staff.employeeName }}</option>
                    </select>
                </div>

                <div class="col-md-6">
                    <label class="form-label">負責人</label>
                    <select v-model="form.ComplaintManagerId" class="form-select">
                        <option selected disabled hidden>請選擇負責人員</option>
                        <option v-for="staff in employee" :key="staff.employeeId" :value="staff.employeeId">{{ staff.employeeName }}</option>
                    </select>
                </div>


          </div>



          <div class="mb-3">
            <label class="form-label">客訴描述</label>
            <textarea v-model="form.ComplaintDescription" class="form-control" rows="4" placeholder="請輸入詳細描述"></textarea>
          </div>

          
          <div class="mb-3">
            <label class="form-label">附件上傳</label>
            <input type="file" class="form-control" />
          </div>

          <button type="submit" class="btn btn-success">
            儲存客訴
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
import { Item } from 'ant-design-vue/es/menu/index.js';
const Edit = ref(false);

const form = reactive({
  CaseId: '',
  CustomerId: '',
  IssueTypeId: '',
  ComplaintDescription: '',
  ComplaintSeverity: '',
  ComplaintManagerId: '',
  ComplaintAcceptedBy: '',
  ComplaintStartAt: '',
  ComplaintAcceptedAt: '',
  ComplaintId: '',
});
const complaintTypes = ref([]);
const employee = ref([]);
const CaseName = ref([]);
const CustomerName = ref([]);



onMounted(async () => {
  const res = await api.get('/TimMovE_ComplaintCase_/types');
  complaintTypes.value = res.data;

  const res2 = await api.get('/TimMovE_ComplaintCase_/staff');
  employee.value = res2.data;
  console.log(employee.value);

  const res3 = await api.get('/TimMovE_ComplaintCase_/GetCaseName');
  CaseName.value = res3.data;

  const res4 = await api.get('/TimMovE_ComplaintCase_/SelectCustomer');
  CustomerName.value = res4.data;
});


function submitform() {
  

  api.put(`/TimMovE_ComplaintCase_/${form.ComplaintId}`, form,{
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => {

      alert('客訴案件儲存成功！');
      
      close();
      emit('refresh')
      
    })
    .catch(error => {
      console.error('儲存失敗:', error);
      alert('儲存失敗，請稍後再試。');
    });
    
  console.log(JSON.stringify(form));
}

const emit = defineEmits(['close','refresh'])



  defineProps({
    EditedCase:Object
  });

  defineExpose({
    open,
    close
  });


  function close() {
    Edit.value = false;
    document.body.classList.remove('modal-open');

  }

  function open(EditedCase) {
    Edit.value = true;
    document.body.classList.add('modal-open');
    // 將傳入的 EditedCase 資料複製到 form 中

    const statusMap = {
      '待處理': 1,
      '已受理': 2,
      '處理中': 3,
      '處理完成': 4
    };

    const typeMap = {
      '物品損壞': 1,
      '遲到': 2,
      '服務態度不佳': 3,
      '價格爭議': 4
    };

    const EmployeeMap = {
      '系統管理員01': 1,
      '人事01': 2,
      '人事02': 3,
      '業務01': 4,
      '業務02': 5,
      '客服(日班)01': 6,
      '客服(晚班)02': 7,
      '行政01': 8,
      '行政02': 9
    };

    const payloadStatus = statusMap[EditedCase.處理狀態] || null;
    const payloadType = typeMap[EditedCase.客訴類型] || null;
    const payloadEmployee = EmployeeMap[EditedCase.受理人員] || null;

    form.ComplaintId = EditedCase.客訴紀錄編號;
    form.ComplaintStatusId = payloadStatus;
    form.CaseId = EditedCase.對應訂單編號;
    form.CustomerId = EditedCase.客戶姓名;
    form.IssueTypeId = payloadType;
    form.ComplaintDescription = EditedCase.客訴內容;
    form.ComplaintSeverity = EditedCase.案件嚴重度;
    form.ComplaintAcceptedBy = payloadEmployee;
    form.ComplaintManagerId = payloadEmployee;
    form.ComplaintStartAt = EditedCase.客訴日期formatted;
    form.ComplaintAcceptedAt = EditedCase.受理日期formatted;
    

  }
</script>

<style scoped>

    :root {
      /* 基礎配色（藍綠系） */
      --color-primary: #0ddbc0;
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
        position: fixed;   /* 固定在整個畫面 */
        margin: 20px auto;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 40%;
        background: #fff;
        box-shadow: 0 6px 20px rgba(0,0,0,0.2);
        overflow-y: auto;
        @media(max-width:980px) {
            width: 70%;
        }

        
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
  /* .overlay {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

} */



</style>

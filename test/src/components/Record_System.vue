<template>
<!-- Section: Timeline -->

<div class="timeline-window">

  <div class="Create">
    <button class="btn btn-success" @click="AddNewRecord">新增進度</button>
  </div>

  <div class="windows-contain">
  <section class="py-5">
  <ul class="timeline-with-icons">
    <li class="timeline-item mb-5">
      <span class="timeline-icon Pending">
        <i class="fas fa-rocket text-primary fa-sm fa-fw"></i>
      </span>

      <h5 class="fw-bold">待處理</h5>

    </li>


    <li class="timeline-item mb-5">

      <span class="timeline-icon accept">
        <i class="fas fa-hand-holding-usd text-primary fa-sm fa-fw"></i>
      </span>
      <h5 class="fw-bold">已受理</h5>
      <p class="text-muted mb-2 fw-bold">{{props.SelectCaseDetail.受理日期formatted}}</p>

    </li>
    

    <li v-for="item in CaseProgress" class="timeline-item mb-5">
      <div v-if="item.isNew == true">
          <span class="timeline-icon processing">
            <i class="fas fa-users text-primary fa-sm fa-fw"></i>
          </span>
          <select v-model="item.handleStatusId" class="form-select form-select-sm">
            <option :value="null">請選擇狀態</option>
            <option :value="3">處理中</option>
            <option :value="5">結案</option>
          </select>
          <div class="mb-2">

          <input v-if="item.isEditMode" type="datetime-local" v-model="item.timestamp" class="form-control form-control-sm w-75">
          
          <p v-else class="text-muted mb-0 fw-bold">
            <i class="bi bi-clock me-1"></i> {{ item.timestamp}}
          </p>

      </div>
          <textarea rows="4" v-model="item.description" class="form-control" :disabled="!item.isEditMode" ></textarea>

        <div class="input-group d-flex align-items-center">
            <p class="text-muted mb-0" >建立人員:</p>
            <select class="form-select" style="width: 150px;" :disabled="!item.isEditMode" v-model="item.creater">
              <option v-for="emp in employee" :key="emp.employeeId" :value="emp.employeeId">{{ emp.employeeName }}</option>
            </select>
        </div>


          <div class="Create-Delete">
            <button class="btn  btn-primary  btn-info  me-2" @click="CreateNewRecord(item)">創建</button>
            <button class="btn btn-secondary" @click="CancelAdd(item)">取消</button>
          </div>
      </div>

      <div v-else>
          <span class="timeline-icon processing">
            <i class="fas fa-users text-primary fa-sm fa-fw"></i>
          </span>
          <h5 class="fw-bold">處理中</h5>
          <p class="text-muted mb-2 fw-bold">{{item.timestamp.replace('T',' ') }}</p>
          <textarea rows="4" v-model="item.description" class="form-control" :disabled="!item.isEditMode" ></textarea>

          <div class="input-group d-flex align-items-center">
              <p class="text-muted mb-0" >建立人員:</p>
              <select class="form-select" style="width: 150px;" :disabled="!item.isEditMode" v-model="item.creater">
                <option v-for="emp in employee" :key="emp.employeeId" :value="emp.employeeId">{{ emp.employeeName }}</option>
              </select>
          </div>


          <div class="Edit-Delete">
            <button :class="['btn', !item.isEditMode === true? 'btn-primary':'btn-info' ,'me-2' ]" @click="Edit_Save(item)">
              {{!item.isEditMode === true? "編輯" : "儲存" }}
            </button>
            <button class="btn btn-danger" @click="DeleteProcess(item)">刪除</button>
          </div>
      </div>

    </li>



    <li v-for="item in SelectStaus_done" class="timeline-item mb-5">

      <span class="timeline-icon completed">
        <i class="fas fa-money-bill-wave text-primary fa-sm fa-fw"></i>
      </span>
      <h5 class="fw-bold">結案</h5>
      <p class="text-muted mb-2 fw-bold">{{item.timestamp.replace('T',' ') }}</p>
      
      <textarea rows="4" v-model="item.description" class="form-control" :disabled="!item.isEditMode" ></textarea>

      <div class="input-group d-flex align-items-center">
          <p class="text-muted mb-0" >負責人員:</p>
          <select class="form-select" style="width: 150px;" :disabled="!item.isEditMode" v-model="item.creater">
            <option v-for="emp in employee" :key="emp.employeeId" :value="emp.employeeId">{{ emp.employeeName }}</option>
          </select>
      </div>

      <div class="Edit-Delete">
        <button :class="['btn', !item.isEditMode === true? 'btn-primary':'btn-info' ,'me-2' ]" @click="Edit_Save(item)">
          {{!item.isEditMode === true? "編輯" : "儲存" }}
        </button>
        <button class="btn btn-danger" @click="DeleteProcess(item)">刪除</button>
      </div>
      <span class="timeline-icon final completed">
        <i class="fas fa-money-bill-wave text-primary fa-sm fa-fw"></i>
      </span>
    </li>
  </ul>
</section>
</div>






</div>



</template>



<script setup>
import api from '../axios/axios.js';
import { ref, onMounted, onUnmounted, reactive,computed } from 'vue'
import Customer_System_Details from './Customer_System_Details.vue';
import Customer_System_NewCustomer from './Customer_System_NewCustomer.vue';
import Record_System from './Record_System.vue';
import Customer_system_editCustomer from './Customer_system_editCustomer.vue';

const emit = defineEmits(['ResetCaseStatus']);
const time = ref('')
const progress = ref([])
const CaseProgress = ref([])
const employee =ref([])
const ResetRecord = async () =>{

  const res2 = await api.get(`/CaseRecord/${props.SelectCaseDetail.客訴紀錄編號}/Progress`);
  CaseProgress.value = res2.data.progressDTOs

}

const SelectStaus_processing = computed(() =>{
   return CaseProgress.value.filter(item => item.handleStatus === "處理中")
  .sort((a,b)=>{
    const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
    const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      
    return dateB - dateA; // 由新到舊
  })
})


const SelectStaus_done = computed(() =>{
  return CaseProgress.value.filter(item => item.handleStatus === "結案")
  .sort((a,b)=>{
    const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
    const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
    
    return dateB - dateA; // 由新到舊
  })
  console.log(SelectStaus_done)
})




async function AddNewRecord() {

  if(props.SelectCaseDetail.處理狀態 == "待處理"){
    alert("目前未受理該案件，請先受理該案件才能建立紀錄！")
    return
  }

  const hasAdding = CaseProgress.value.some(item => item.isNew === true);

  if (hasAdding) {
    alert("請先完成或取消當前的紀錄，再進行新增。");
    return;
  }

  // 1. 建立符合後端 DTO 格式的資料包
  const postData = {
    processId: 0,
    HandledBy: 0,
    CreatedBy: 0,
    HandleStatusId: 0, // 注意：後端 DTO 應該是用 ID (int)
    handleStatus: "",
    ProcessDescription: "",
    isNew:true,
    isEditMode:true
  };

  try {
    CaseProgress.value.unshift(postData);

  } catch (error) {
    console.error("儲存失敗:", error.response?.data || error.message);
    alert("新增失敗，請檢查欄位格式");
  }
}






function formatTime(date) {
  const h = String(date.getHours()).padStart(2, '0')
  const m = String(date.getMinutes()).padStart(2, '0')
  const s = String(date.getSeconds()).padStart(2, '0')
  return `${h}:${m}:${s}`
}


function DeleteProcess(item){
  console.log(item.processId)
    if(window.confirm('確定要刪除此紀錄嗎？')) 
  {
    try {
    api.delete(`/CaseRecord/${item.processId}`);
    alert('紀錄已刪除');
    // 這裡可以加入刷新列表的邏輯
    CaseProgress.value = CaseProgress.value.filter(i => i.processId !== item.processId);
  } 
  catch (error) {
    console.error('刪除記錄失敗:', error);
    alert('刪除失敗，請稍後再試。');
  }
  }
  else {
    return; // 使用者取消刪除
  }
  
}
let timer = null

onMounted(() => 
{
  time.value = formatTime(new Date())
  timer = setInterval(() => {
  time.value = formatTime(new Date())
  }, 1000)
})

onMounted(async() => {
  // const res = await api.get('/CaseRecord/progress');
  // progress.value = res.data;
  console.log(props.SelectCaseDetail.受理日期)
  const res2 = await api.get(`/CaseRecord/${props.SelectCaseDetail.客訴紀錄編號}/Progress`);
  CaseProgress.value = res2.data.progressDTOs
  console.log(CaseProgress.value)

  const res3 = await api.get('/CaseRecord/Staff');
  employee.value = res3.data

})


 async function CreateNewRecord(item){

  

  if(item.handleStatusId == 5 && SelectStaus_done.value.length >= 1)
  {
    alert("目前已有一筆結案紀錄!因此無法再新增");
    return;
  }  
  item.HandledAt = item.timestamp;
  item.CreatedBy = item.creater;
  item.HandledBy = item.creater;
  if(item.handleStatusId == 3)
  {
    item.handleStatus = "處理中";
  }
  else if (item.handleStatusId == 5)
  {
    item.handleStatus = "結案";
  }
  item.ProcessDescription = item.description;

  try {
    const response = await api.post(`/CaseRecord/${props.SelectCaseDetail.客訴紀錄編號}/CreateRecord`,item)
    item.processId = response.data.processId || response.data.ProcessId;

    item.isEditMode = false;
    item.isNew = false;

    alert("創建成功!")
    emit('ResetCaseStatus')



  } catch (error) {
    console.error('創建記錄失敗:', error);
    alert('創建失敗，請稍後再試。');
  }
  ResetRecord();
}

function CancelAdd(item){
  const index = CaseProgress.value.indexOf(item);
  if (index !== -1) {
    CaseProgress.value.splice(index, 1);
  }
}

function Edit_Save(item){

  if(item.isEditMode == false){
    item.isEditMode = true;
    alert("已開啟編輯模式")
  }
  else
  {
      if(item.isNew == true){
        item.isEditMode =false,
        item.isNew = false
        console.log("old")
      }
      api.patch(`/CaseRecord/${item.processId}`,
      {
        ProcessDescription :item.description,
        CreateBy :item.creater
      },
      {
        headers: { 'Content-Type': 'application/json' }
      })
      .then(response => {

        alert('紀錄儲存成功！');
      })
      .catch(error => {
        console.error('儲存失敗:', error);
        alert('儲存失敗，請稍後再試。');
      });
      item.isEditMode = false;
  }

}


const props = defineProps({
  SelectCaseDetail:Object
  
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
    .Edit-Delete {
      display: flex;
      gap: 20px;
    }
    .Create-Delete {
      display: flex;
      gap: 20px;
    }
    .Create{
      text-align: right;
    }



.timeline-window {
  border: 5px solid var(--color-primary);
  display: flex;
  flex-direction: column;
  /* overflow: hidden; */
  min-height: 0;
  height: 80vh !important;
  max-width: 21%;
  margin: 40px auto;
  padding: 20px;
  background-color: var(--color-bg);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}
    @media (max-width: 980px) {
      .timeline-window {
        max-width: 40%;
      }
    }

.windows-contain{
  flex: 1;           /* 佔滿剩餘高度 */
  overflow-y: auto;  /* 這裡才是捲軸出現的地方 */
  padding:10px; /* 給捲軸留一點空間 */

  min-height: 0;     /* 防止 flex 撐開 */
}

.input-group{
  margin: 20px 0;
  gap: 20px;
}




.timeline-with-icons {
  border-left: 1px solid hsl(0, 0%, 50%);
  position: relative;
  list-style: none;
}


.timeline-with-icons .timeline-item {
  position: relative;
}

.timeline-with-icons .timeline-item:after {
  position: absolute;
  display: block;
  top: 0;
}

.timeline-with-icons .timeline-icon {
  position: absolute;
  left: -42px;
  background-color: hsl(217, 88.2%, 90%);
  color: hsl(217, 88.8%, 35.1%);
  border-radius: 50%;
  height: 20px;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.final {
  top: 100%;
}
.timeline-icon.Pending{
  background-color: var(--status-pending);
}
.timeline-icon.accept{
  background-color: var(--status-accepted);
}
.timeline-icon.processing{
  background-color: var(--status-processing);
}
.timeline-icon.completed{
  background-color: var(--status-completed);
}
  </style>
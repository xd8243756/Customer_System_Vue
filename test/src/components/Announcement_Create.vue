<template>
<form class="row g-3 mb-3" v-show="show">
  <div class="card-header bg-primary text-white fs-5 text-align-center sticky-top AnnouncementHead" name="title">
        新增公告
  </div>
<div class="contain">
  <div class="col-md-6">
    <label class="form-label">公告編號：</label>
    <input class="form-control" v-model="NewAnnouncementFormat.announcementNo">
  </div>
  <div class="col-md-12">
    <label class="form-label" >公告標題：</label>
    <input class="form-control" v-model="NewAnnouncementFormat.announcementTitle">
  </div>
  <div class="col-6">
    <label class="form-label" >公告類別：</label>
    <select class="form-select" v-model="NewAnnouncementFormat.announcementType">
      <option v-for="AnnouncementType in GetAnnouncementType" 
            :key="AnnouncementType.topicTypeId" 
            :value="AnnouncementType.topicTypeId"    
      >        
            {{AnnouncementType.topicTypeName}}
      </option>
    </select>
  </div>
  <div class="col-6">
    <label class="form-label">公告部門：</label>
    <select class="form-select" v-model="NewAnnouncementFormat.announcementCategory"

    >
      <option v-for="AnnouncementTypeCategory in GetCategory"
            :key="AnnouncementTypeCategory.topicCategoryId"
            :value="AnnouncementTypeCategory.topicCategoryId">
        {{ AnnouncementTypeCategory.topicCategoryName }}
      </option>
    </select>
  </div>
  <div class="col-md-12">
    <label class="form-label" >公告內容：</label>
    <textarea 
        class="form-control" 
        id="announcementContent" 
        rows="5" 
        placeholder="請輸入公告詳細內容..."
        v-model="NewAnnouncementFormat.announcementContent">
    </textarea>
  </div>
  <div class="col-md-4">
    <label class="form-label">上傳人：</label>
    <select class="form-select" v-model="NewAnnouncementFormat.publishedBy">
      <option v-for="value in Publish" :key="value.employeeId" :value="value.employeeId">{{ value.employeeName }}</option>

    </select>
  </div>
  <div class="col-12">
    <div class="form-check">
      <input class="form-check-input" type="checkbox" v-model="NewAnnouncementFormat.istop" id="gridCheck">
      <label class="form-check-label" for="gridCheck">
        是否置頂
      </label>
    </div>
  </div>
  <div class="col-12 d-flex gap-4 ">
    <button type="submit" class="btn btn-primary" @click="CreateNewAnnouncement">新建公告</button>
    <button type="button"class="btn btn-secondary"@click="close">取消</button>
  </div>
</div>
</form>
</template>


<script setup>

    import { ref, onMounted, onUnmounted, reactive, computed } from 'vue'
    import api from '../axios/axios.js';
    const GetCategory = ref([])
    const Announcement = ref([])
    const GetAnnouncementType = ref([])
    const Publish = ref([])
    const emit = defineEmits(['refresh']);
    
    const NewAnnouncementFormat = reactive({
        announcementNo:'',
        announcementTitle:'',
        announcementType:0,
        announcementCategory:'',
        publishedBy:1, //=reviewdBy
        reviewedBy:1,
        targetRoleId:2,
        announcementContent:'',
        // createdAt:'',
        // publishStartAt:'',
        istop:false,

    })
    const show = ref(false);


    onMounted(async () => {
        const res = await api.get('Announcement_/GetAnnouncementCategory')
        GetCategory.value = res.data

        const res2 = await api.get(`Announcement_`)
        Announcement.value = res2.data
  
        const res3 = await api.get(`Announcement_/GetAnnouncementType`)
        GetAnnouncementType.value = res3.data
        console.log(GetAnnouncementType.value)

        const res4 = await api.get(`CaseRecord/Staff`)
        Publish.value = res4.data

        
    }); 

    async function CreateNewAnnouncement() {
        try {
            await api.post('Announcement_', NewAnnouncementFormat,{
            headers: { 'Content-Type': 'application/json' }
            })
        console.log(NewAnnouncementFormat)
        alert("公告建立成功")

        emit('refresh')

        } catch (error) {
            console.log(error)
            alert("建立失敗，請稍後再試...")
            return
        }

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
})
</script>
    

<style scoped>


    .AnnouncementHead{
        display: block; 
        width: 100%;
        margin-top: 0;
        padding: 5px;
       

    }
    .contain{
        display:flex;
        flex-direction: column;
        padding: 20px;
        gap: 25px;

        margin-top: 5px;
               
    }


    form {
        position: fixed;      /* 改成 fixed，滾動頁面時它也會固定在中間 */
        top: 50%;             /* 距離頂部 50% */
        left: 50%;            /* 距離左側 50% */
        transform: translate(-50%, -50%); /* 往回推自己寬高的一半，達到絕對置中 */
    
        border: 1px solid #ccc; /* 邊框細一點比較精緻 */
        border-radius: 8px;     /* 加一點圓角 */
        box-shadow: 0 5px 15px rgba(0,0,0,0.3); /* 加深陰影，讓它「浮」起來 */
    
        background-color: white; /* 換成純白，視覺上比較乾淨 */
        height: 80vh;
        width: 600px;           /* 建議用 px 或 %，vh 通常是用在高度 */
        z-index: 1000;          /* 確保它在最前面 */
        overflow-y: auto;
    }
</style>
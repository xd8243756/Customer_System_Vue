<template>
<div class="container">

    <header class="app-header">
    <div class="wrap">
      <div class="brand">
        <div class="brand-title">魔法使搬運鋪—公告欄</div>
      </div>
      <div class="clock">
      <!-- 實時顯示時間的區域 -->
        <div class="time-display">{{ time }}</div>
      </div>
    </div>

  </header>

  <div class="content">
    <nav class="navbar navbar-expand-lg bg-body-tertiary rounded-pill" data-bs-theme="dark">
        <div class="container-fluid container-gap">
            <a class="navbar-brand">分類：</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav fw-bold p-2 headtitle">
            <li class="nav-item">
                <a class="nav-link bi bi-caret-down-square me-2" aria-current="page" href="#" @click="SelectAnnouncementAll">全部公告</a>
            </li>
            <li class="nav-item">
                <a class="nav-link bi bi-clipboard me-2" aria-current="page" href="#" @click="SelectAnnouncementType(2)">行政公告</a>
            </li>
            <li class="nav-item">
                <a class="nav-link bi bi-person me-2" href="#" @click="SelectAnnouncementType(4)">人事公告</a>
            </li>
            <li class="nav-item">
                <a class="nav-link bi bi-tools me-2" href="#" @click="SelectAnnouncementType(1)">作業與安全公告</a>
            </li>
            <li class="nav-item">
                <a class="nav-link bi bi-person-heart me-2" href="#" @click="SelectAnnouncementType(3)">活動與福利公告</a>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  </div>

  <div class="announcement-detail-container ">
    <div >


      <div class="card detail-card shadow border-0">
        <div class="category-stripe bg-primary"></div>
            <div class="mb-4 d-flex">
                <button class="btn btn-outline-primary rounded-pill shadow-sm ms-3 mt-3" @click="router.back()">
                    <i class="bi bi-arrow-left"></i> 回到列表
                </button>
                <div class="d-flex ms-auto gap-2">
                    <button class="btn rounded-pill shadow-sm mt-3 "
                    :class="{
                      'btn-outline-info':isEditMode,
                      'btn-outline-primary':!isEditMode              
                      }" 
                  
                    @click="OpenEditMode()" >
                      <i class="bi"
                        :class="isEditMode?`bi-check-lg`:`bi-pencil`">
                      </i> 
                      {{isEditMode?`儲存`:`編輯`}}
                    </button>
                    <button class="btn btn-outline-danger rounded-pill shadow-sm  mt-3 me-2" @click="DeleteCase()">
                        <i class="bi bi-trash" ></i> 刪除
                    </button>
                </div>

            </div>

        <div class="card-body p-5">
          <div class="header-section border-bottom pb-4 mb-4">
            <input v-if="isEditMode" 
                        class="form-control" 
                        v-model="Details.announcementTitle">

            <h1 v-else class="display-6 fw-bold text-dark">{{Details.announcementTitle}}</h1>
          </div>

          <div class="info-grid row g-3 mb-5 py-3 bg-light rounded-3 text-center">
            <div class="col-6 col-md-3 border-end">
              <small class="text-muted d-block">發布部門</small>
              <select v-if="isEditMode" class="form-select" v-model="Details.announcementCategory">
                <option v-for="value in GetDept" 
                :key="value.topicCategoryId"
                :value="value.topicCategoryId">

                    {{ value.topicCategoryName }}
                    
                </option>
              </select>
              <strong v-else class="text-dark">
                {{ GetDept.find(d => d.topicCategoryId == Details.announcementCategory)?.topicCategoryName || Details.announcementCategory }}
              </strong>
            </div>
            <div class="col-6 col-md-3 border-end">
              <small class="text-muted d-block">公告類型</small>

              <select v-if="isEditMode" class="form-select" v-model="Details.announcementType" >
                <option v-for="value in GetCategory" 
                  :key="value.topicTypeId"
                  :value="value.topicTypeId">
                    {{ value.topicTypeName }}
                </option>
              </select>

              <strong v-else class="text-dark">
                {{GetCategory.find(d => d.topicTypeId == Details.announcementType)?.topicTypeName ||Details.announcementType}}
              </strong>

            </div>
            <div class="col-6 col-md-3 border-end">
              <small class="text-muted d-block">發布時間</small>
              <strong class="text-dark">{{ Details.createdAt?.replace('T', ' ').slice(0, 16) }}</strong>
            </div>
            <div class="col-6 col-md-3">
              <small class="text-muted d-block">發布人</small>
              <strong class="text-dark">{{Details.publishedBy}}</strong>
            </div>
          </div>

          <div class="content-section mb-5">
            <div class="announcement-text lead text-secondary " style="white-space: pre-wrap;">
                <h5 class="text-muted d-block">詳情：</h5>
                    
                <textarea 
                          v-if="isEditMode"
                          class="form-control" 
                          rows="5" 
                          placeholder="請輸入公告詳細內容..."
                          v-model="Details.announcementContent">
                </textarea>

                <strong v-else class="text-dark ms-3">{{Details.announcementContent}}</strong>
            </div>
          </div>

          <div v-if="Details.istop" class="alert alert-warning border-0 d-flex align-items-center">
            <i class="bi bi-pin-angle-fill me-2"></i>
            此公告已被管理員設定為置頂。
          </div>
          <div v-if="isEditMode" class="form-check mt-5">
            <input class="form-check-input mb-5" type="checkbox" id="gridCheck" v-model="Details.istop">
            <label class="form-check-label" for="gridCheck">
              是否置頂
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>


</div>



  







</template>

<script setup>


    import { ref, onMounted, onUnmounted, reactive, computed } from 'vue'
    import api from '../axios/axios.js';
    import { useRouter,useRoute } from 'vue-router';
    import { convertToObject } from 'typescript';
    
    const router = useRouter()
    const route =useRoute()
    const time = ref('')
    const AnnouncementCount = ref([])
    const CurrentPage = ref(1)
    
    const GetCategory = ref([])
    const GetDept = ref([])
    const RawTypeData = ref([])
    const Details = ref([])



    const isEditMode = ref(false)

    let timer = null
    function formatTime(date) {
        const h = String(date.getHours()).padStart(2, '0')
        const m = String(date.getMinutes()).padStart(2, '0')
        const s = String(date.getSeconds()).padStart(2, '0')
        return `${h}:${m}:${s}`
    }

    onMounted(() => {
        time.value = formatTime(new Date())
        timer = setInterval(() => {
        time.value = formatTime(new Date())
        }, 1000)
    })

    onMounted(async () => {

        const res = await api.get('Announcement_/GetAnnouncementCategory')
        GetDept.value = res.data

        const id = route.params.id

        const res2 = await api.get(`Announcement_/selectAnnounccement/${id}`)
        Details.value = res2.data

        console.log(Details.value)
        
        const res3 = await api.get(`Announcement_/GetAnnouncementType`)
        GetCategory.value = res3.data
        
        
    }); 

    const SelectAnnouncementAll = async() =>{

        const res = await api.get(`Announcement_`)
        AnnouncementCount.value = res.data
        // console.log(AnnouncementCount.value)
        RawTypeData.value = res.data

        
        
        CurrentPage.value = 1
   

        router.push(`/`)
    }
    
    const SelectAnnouncementType = async(TypeId) =>{

        const res = await api.get(`Announcement_/${TypeId}`)
        AnnouncementCount.value = res.data
        // console.log(AnnouncementCount.value)
        RawTypeData.value = res.data

        CurrentPage.value = 1
        router.push({ path: '/', query: { type: TypeId } });


    }

    async function OpenEditMode(){
      
      if(isEditMode.value == true){

        const id = Number(route.params.id)     
           
        console.log(Details.value)

        const EditFormat ={
          //左邊對應的是要傳進資料庫前的dto 也就是swagger裡的形式  右邊是要從前端帶入的資料
          
          announcementTitle: Details.value.announcementTitle, //因為details是ref 所以要加value才找的到值啦 傻B!
          announcementContent: Details.value.announcementContent,
          announcementCategoryId: Details.value.announcementCategory,
          announcementTypeId: Details.value.announcementType,
          istop: Details.value.istop,

        }
        

        console.log(EditFormat)

        await api.put(`Announcement_/selectAnnounccement/${id}`,
        EditFormat,      
        {
        headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
        alert('儲存成功！');
        })
        .catch(error => {
        console.error('儲存失敗:', error);
        alert('儲存失敗，請稍後再試。');
        });

        isEditMode.value =false
      }
      else{
        isEditMode.value = true
      }

    }



    async function DeleteCase(){

        const id = route.params.id

        if(window.confirm('確定要刪除此公告嗎？')) 
        {
            try {
            api.delete(`Announcement_/${id}`);
            alert('公告已刪除');
            // 這裡可以加入刷新列表的邏輯
            router.push('/')
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

    .container{
      margin-left: 15%;

    }

    .time-display {

      font-size: 40px;
      color: rgb(53, 39, 133);
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
    /*header*/
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
    
</style>
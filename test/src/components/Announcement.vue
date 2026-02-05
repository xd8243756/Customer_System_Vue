<template>
<div class="container">

    <header class="app-header">
    <div class="wrap">
      <div class="brand">
        <div class="brand-title">TimMovE搬家公司—公告欄</div>
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
                <a class="nav-link bi bi-caret-down-square me-2" aria-current="page" href="#" @click="router.push({ path: '/'})">全部公告</a>
            </li>
            <li class="nav-item">
                <a class="nav-link bi bi-clipboard me-2" aria-current="page" href="#" @click="router.push({ path: '/', query: { type: 2 } })">行政公告</a>
            </li>
            <li class="nav-item">
                <a class="nav-link bi bi-person me-2" href="#" @click="router.push({ path: '/', query: { type: 4 } })">人事公告</a>
            </li>
            <li class="nav-item">
                <a class="nav-link bi bi-tools me-2" href="#" @click="router.push({ path: '/', query: { type: 1 } })">作業與安全公告</a>
            </li>
            <li class="nav-item">
                <a class="nav-link bi bi-person-heart me-2" href="#" @click="router.push({ path: '/', query: { type: 3 } })">活動與福利公告</a>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                部門選擇
              </a>
              <ul class="dropdown-menu">
                <li v-for="item in GetCategory"><a class="dropdown-item" href="#" @click="SelectAnnouncementType_Category(item)">{{ item.topicCategoryName }}</a></li>

              </ul>
            </li>
          </ul>
    </div>
  </div>
  <button type="button" class="btn btn-success CreateNotice" @click="CreateAnnouncement()">新建公告</button>
</nav>

    <div class="card-body table-wrap ">
        <table>
            <thead>
              <tr>
                <th class="card-title-nav">公告部門</th>
                <th class="card-title-nav">公告類型</th>
                <th class="card-title-nav">公告標題</th>
                <th class="card-title-nav">建立時間</th>
                <th class="card-title-nav">上傳者</th>

              </tr>
            </thead>


            <tbody>
            <!-- <tr v-for="item in cases" :key="item.id" @click="selectCase(item)"></tr> -->
                <tr v-for="c in ChangePage" :key="c.announcementId" class="content" @click="GotoDetail(c.announcementId)">
                    
                    <td>
                      <i v-if="c.istop" class="bi bi-pin-angle-fill text-danger me-1"></i>
                      {{ c.announcementCategory }}
                    </td>
                    <td>{{ c.announcementType }}</td>
                    <td>{{ c.announcementTitle }}</td>
                    <td>{{ c.createdAt.replace('T', ' ').slice(0, 16) }}</td>
                    <td>{{ c.publishedBy }}</td>

                    
                </tr>
                
            </tbody>  



        </table>
        

        
            <div class="input-group mb-3 mt-3 m-auto" style="width: 250px;">
              <button class="btn btn-outline-secondary" @click="CurrentPage--" :disabled="CurrentPage === 1">
              &lt; </button>

              <select class="form-select text-center" v-model.number="CurrentPage">
                <option v-for="page in totalPages" :key="page" :value="page">
                第 {{ page }} 頁 / 共 {{ totalPages }} 頁
                </option>
              </select>

                <button class="btn btn-outline-secondary" @click="CurrentPage++" :disabled="CurrentPage === totalPages">
                &gt;
                </button>
            </div>
            
    </div>



  </div>
    
 

</div>



<Announcement_Create ref="show" @refresh="SelectAnnouncementAll"/>


</template>

<script setup>

    import { ref, onMounted, onUnmounted, reactive, computed, watch } from 'vue'
    import api from '../axios/axios.js';
    import { isAutoAccessorPropertyDeclaration, LanguageServiceMode } from 'typescript';
    import Announcement_Create from './Announcement_Create.vue';
    import { useRouter,useRoute } from 'vue-router';
    
    const route = useRoute()
    const router = useRouter()
    const time = ref('')
    const AnnouncementCount = ref([])
    const CurrentPage = ref(1)
    const PageSize =ref(10)
    const GetCategory = ref([])
    const RawTypeData = ref([])
    const show = ref(null)


    const ChangePage = computed( () => {
      const Start = (CurrentPage.value -1 ) * PageSize.value

      const end = Start + PageSize.value

      return AnnouncementCount.value.slice(Start,end);
    })


    const totalPages = computed(() => {
      return Math.ceil(AnnouncementCount.value.length / PageSize.value)
    })

    const GotoDetail = (id) =>{
      router.push(`/announcement/${id}`)
    }
    

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
      
        fetchAnnouncement();
        const res2 = await api.get('Announcement_/GetAnnouncementCategory')
        GetCategory.value = res2.data
        
    }); 


    

    
    const SelectAnnouncementAll = async() =>{

        const res = await api.get(`Announcement_`)
        AnnouncementCount.value = res.data
        // console.log(AnnouncementCount.value)
        RawTypeData.value = res.data


        
        CurrentPage.value = 1



    }
    
    const SelectAnnouncementType = async(TypeId) =>{

        const res = await api.get(`Announcement_/${TypeId}`)
        AnnouncementCount.value = res.data
        console.log(AnnouncementCount.value)
        RawTypeData.value = res.data

        CurrentPage.value = 1

    }
    const SelectAnnouncementType_Category = async(item) =>{
      console.log(item.topicCategoryName)
        const filtered = RawTypeData.value.filter(c =>{
          return c.announcementCategory === item.topicCategoryName
        })

        AnnouncementCount.value = filtered
        // console.log(AnnouncementCount.value)

        CurrentPage.value = 1

    }

    const fetchAnnouncement = async () =>{
     
              const typeId = route.query.type;
              // console.log(typeId);
              if(typeId !==undefined && typeId!== null){
                await SelectAnnouncementType(typeId)
              }
              else{
                await SelectAnnouncementAll()
                // console.log("ALL")
              }

    }

    function CreateAnnouncement() {
     show.value.open();
    }
    // onMounted(fetchAnnouncement)
    
    watch(() => route.query.type,() => {
      fetchAnnouncement();
    })


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

    .container {
      max-width: 100%; 
      height: auto;
      padding: 0 5%;
      gap: 20px;
    

    }
    .content {
        width: 100%!important;
    }
    @media (max-width: 980px) {
      .container { 
        grid-template-columns: 1fr; 
        }
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

    .headtitle li a:hover{
      color: #ffffff;
    }

    /*table*/



    .CreateNotice{
        margin-right: 50px;
        white-space: nowrap;
    }
    
    table { 
      /* background-color: var(--color-border); */
      width: 100%; 
      border-collapse: collapse; 
      min-width: 760px; 
      border-radius: 10px;
      height:5vh;
      
    }

    .table-wrap { overflow: auto; }

    

    thead th {
    
      text-align: left;
        font-size: 20px;
        color: var(--text-sub);
        padding: 10px;
       
        border-bottom: 10px solid var(--color-border);
        background: #c4d6f2;
        /* border-radius: 5px; */
        white-space: nowrap;


    }
    .card-body { padding: 16px; }

    tbody td {
      padding: 12px 10px; 
      border-bottom: 2px solid var(--color-border);
      vertical-align: middle;
      cursor: pointer;
    }

    tbody .content:hover { background: #f8e5c8; }

    tbody .content:active { 
      background: #ecc792;
      user-select: none; 
    }


    /* 置頂公告的專屬樣式 */
    .is-top-style {
       background-color: #fff9db !important; /* 淡淡的黃色背景 */
       border-left: 5px solid #ffc107;      /* 左側加一條金黃色的線 */
    }

    .is-top-style:hover {
       background-color: #fff3bf !important; /* 滑鼠移上去顏色深一點 */
    }

</style>
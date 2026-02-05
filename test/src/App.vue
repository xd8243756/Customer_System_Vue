<template>
    <Customer_System />
</template>

<script>
    import { ref } from 'vue';
    import Character from './components/Character.vue';
    import Customer_System from './components/Customer_System.vue';
    import Customer_System_Details from './components/Customer_System_Details.vue';
    import Customer_System_NewCustomer from './components/Customer_System_NewCustomer.vue';
    import Customer_system_editCustomer from './components/Customer_system_editCustomer.vue';
    import Record_System from './components/Record_System.vue';
    import Announcement from './components/Announcement.vue';
    
    import Announcement_Create from './components/Announcement_Create.vue';
    
    export default {
        name: "App",
        components:{
            Customer_System,
            Customer_System_Details,
            Customer_System_NewCustomer,
            Customer_system_editCustomer,
            Record_System,
            Announcement,
            Announcement_Create
        }

    };
</script>


<style>
/* 用來在彈出視窗出現時(新建客訴)，鎖住背景的卷軸 */
body.modal-open {
  overflow: hidden; /* 藉由透過將卷軸hidden來達成鎖住背景捲軸 */
}

  
  </style>
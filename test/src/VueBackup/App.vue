<template>

    <Customer_System/>
</template>

<script>
    import { ref } from 'vue';
import Character from './components/Character.vue';
    import Customer_System from './components/Customer_System.vue';
    import Customer_System_Details from './components/Customer_System_Details.vue';
    import Customer_System_NewCustomer from './components/Customer_System_NewCustomer.vue';
    import Customer_system_editCustomer from './components/Customer_system_editCustomer.vue';
    export default {
        name: "App",
        components:{Character},
        components:{Customer_System},
        components:{Customer_System_Details},
        components:{Customer_System_NewCustomer},
        components:{Customer_system_editCustomer}
    };
</script>
<script setup>



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

<style>
/* 用來在彈出視窗出現時(新建客訴)，鎖住背景的卷軸 */
body.modal-open {
  overflow: hidden; /* 藉由透過將卷軸hidden來達成鎖住背景捲軸 */
}

  
  </style>
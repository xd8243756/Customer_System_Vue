<template>
        <div class="character">
            <h1>角色名：{{charaterName}}</h1>
            <h1>等級：{{Level}}</h1>
            <h1>職業：{{ Job }}</h1>
        </div>
        <button @click="ChangeCharacterName">更改角色名稱</button>
        <button @click="LevelUP">提升等級</button>
        <button @click="JobChange">轉職</button>
        <button @click="Welcome">歡迎訊息</button>
</template>

<script lang="ts" setup>
import { ref } from 'vue';


                let 
                charaterName = '希亞',
                Level = 1,
                Job = '魔法使'

            function ChangeCharacterName() {
                charaterName = '蕾蒂西亞';
            }
            function LevelUP() {
                Level += 1;
            }
            function JobChange() {
                Job = '武士';
            }

            function Welcome() {
                alert("歡迎來到魔法使搬運公司-客訴系統");
            }

            onMounted(() => {
                ChangeCharacterName();
                LevelUP();
                JobChange();
            });
</script>

<style>
    .character{
        background-color: aqua;
        border-radius: 10px;
        margin: 5px 10px;
    }
    .character>h1{
        margin:5px 20px;
    }
    button{
        margin: 0 10px;
    }
</style>
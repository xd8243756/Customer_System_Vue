<template>
    <div class="character">
        <h2>角色名稱: {{ character.名稱 }}</h2>
        <p>等級: {{ character.等級 }}</p>
        <p>血量: {{ character.血量 }}</p>
        <p>職業: {{ character.職業 }}</p>
        <button @click="takeDamage(10)">受傷</button>
        <button @click="changeJob">轉職</button>
        <button @click="LevelUp">等級提升</button>
        <hr>
        <ul>
            <li v-for="skill in characterSkillSet" :key="skill.技能ID">
                技能名稱：{{ skill.技能名稱 }} - <br>
                傷害：{{ skill.技能傷害 }} - 
                魔力消耗：{{ skill.魔力消耗 }} - 
                範圍：{{ skill.技能範圍 }}
            </li>
        </ul>
    </div>
</template>

<!-- <script lang="ts">

    export default {
        name: 'Character',
        setup() {
            const name = 'Hero';
            let level = 100;
            let health = 100;
            let job = 'SAMURAI';

            function takeDamage(amount: number) {
                health = Math.max(0, health - amount);
                alert(`${name} took ${amount} damage! Remaining health: ${health}`);
            }

            function changeJob(){
                job = 'Ronin'
            }

            function LevelUp(){
                level += 1
            }

            return {
                name,
                level,
                health,
                job,
                takeDamage,
                changeJob,
                LevelUp
            };
        }
    };
</script> -->



<script lang="ts" setup name ="Character"> 
    import {ref} from 'vue';
    import {reactive} from 'vue';


  
        let character = reactive
        (
            {
                名稱: '希亞',
                等級: 1,
                血量: 100,
                職業: '魔法使'
            }
        )
        let characterSkill = reactive([
            {
                技能ID: 1,
                技能名稱: '火球術',
                技能傷害: 30,
                魔力消耗: 20,
                技能範圍: '單體'
            },
            {
                技能ID: 2,
                技能名稱: '冰霜新星',
                技能傷害: 20,
                魔力消耗: 15,
                技能範圍: '範圍'
            },
            {
                技能ID: 3,
                技能名稱: '治癒術',
                技能傷害: 0,
                魔力消耗: 10,
                治癒量: 25,
                技能範圍: '單體'
            }
        ])
        let characterSkill2 = reactive([
            {
                技能ID: 1,
                技能名稱: '橫斬',
                技能傷害: 30,
                魔力消耗: 20,
                技能範圍: '單體'
            },
            {
                技能ID: 2,
                技能名稱: '天下五劍',
                技能傷害: 20,
                魔力消耗: 15,
                技能範圍: '範圍'
            },
            {
                技能ID: 3,
                技能名稱: '居合術',
                技能傷害: 100,
                魔力消耗: 30,
                技能範圍: '單體'
            }
        ])

          let characterSkillSet = ref(characterSkill)

            function takeDamage(amount: number) {
                character.血量 = Math.max(0, character.血量 - amount);
                alert(`${character.名稱} took ${amount} damage! Remaining health: ${character.血量}`);
            }

            function changeJob(){

                if(character.職業 === '魔法使')
                {
                    character.職業 = '浪人'
                    characterSkillSet.value = characterSkill2;
                }
                else if(character.職業 === '浪人')
                {
                    character.職業 = '魔法使'
                    characterSkillSet.value = characterSkill;
                }
            }

            function LevelUp(){
                character.等級 += 1

            }




    
</script>

<style scoped>
    .character 
    {
        color: royalblue;
        background-color: rgb(224, 233, 232);
        box-shadow: 0 0 10px;
        border-radius: 10px;
        size: 40px;
        margin: 20%;
    }

    button {
        margin: 5px;
        padding: 10px;
        border: none;
        border-radius: 5px;
        background-color: coral;
        color: white;
        cursor: pointer;
    }
</style>
<template lang="pug">
div  
  h1 1234
  button(type="button" @click="increment()") count is {{ count }}
</template>

<script lang="ts">
import { defineComponent, toRefs, onMounted, ref } from 'vue'
import { useDefultDataStore } from '@/stores/useDefultDataStore.ts'
import { loginApi } from '@/api/login'

export default defineComponent({
  setup() {
    const defultDataStore = useDefultDataStore()
    const { count } = toRefs(defultDataStore)
    const userInfo = ref({
      Account: '',
      Password: ''
    })

    onMounted(() => {
      submit();
    });

    const increment = () => {
      defultDataStore.increment()
    }
    
    const submit = async():Promise<void> =>{
      await loginApi(userInfo.value).then(res => {
        console.log(res)
      })
    };

    return {
      count,
      increment
    }
  }
})
</script>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
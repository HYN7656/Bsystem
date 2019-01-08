<template>
    <div>
      <p>无权限</p>
      <button><router-link :to="{name:'platform.index'}">返回首页</router-link></button>
    </div>
</template>

<script>
    export default {
        name: "auth"
    }
</script>

<style scoped>

</style>

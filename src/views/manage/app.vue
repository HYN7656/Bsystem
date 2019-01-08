<template>
  <div>
    <p-header>
      <div slot="right-view">
        <router-view/>
      </div>
    </p-header>
    <div class="footer">
      <p-footer></p-footer>
    </div>
  </div>
</template>

<script>
  import PHeader from '../../components/pheader'
  import PFooter from '../../components/pfooter.vue'
  export default {
    name: '',
    components:{ PHeader,PFooter },
    created() {

    }
  }
</script>

<style scoped>

</style>

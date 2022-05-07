<template>
  <app-header />
  <comment-app />
</template>
<script>
  import commentApp from './pages/comment-app.vue'
  import appHeader from '@/cmps/app-header.vue'

  export default {
    name: 'ProjectApp',
    components: {
      commentApp,
      appHeader,
    },
    data() {
      return {}
    },
    created() {},
    methods: {},
    computed: {},
    unmounted() {},
  }
</script>
<style></style>

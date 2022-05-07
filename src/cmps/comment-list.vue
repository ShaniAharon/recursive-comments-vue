<template>
  <section>
    <comment-preview
      v-for="(comment, idx) in comments"
      :key="comment['key'] + Math.random()"
      :comment="comment"
      @added="addComment"
    />
  </section>
</template>
<script>
  import commentPreview from './comment-preview.vue'

  export default {
    name: 'commentList',
    props: ['comments'],
    emits: ['removed', 'added'],
    components: {
      commentPreview,
    },
    data() {
      return {}
    },
    created() {},
    methods: {
      removeComment(projId) {
        this.$emit('removed', projId)
      },
      addComment(data) {
        this.$emit('added', data)
      },
    },
    computed: {},
    unmounted() {},
  }
</script>

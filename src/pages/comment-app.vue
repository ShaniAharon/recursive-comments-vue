<template>
  <div class="comment-app">
    <section class="comment-container container-layout">
      <h1>I Love Vue</h1>
      <div class="add-comment-container center">
        <input
          type="text"
          placeholder="Add new comment"
          v-model="commentText"
          class="input-test"
        />
        <button class="btn btn-blue" @click="addToRoot">Add</button>
      </div>
      <section class="inner-comment">
        <comment-list @added="loadComments" :comments="commentsToShow" />
        <!-- <pre v-if="comments">{{ comments }}</pre> -->
      </section>
    </section>
  </div>
</template>

<script>
  import {itemService} from '../services/item.service'
  import commentList from '@/cmps/comment-list.vue'
  import appHeader from '@/cmps/app-header.vue'

  export default {
    name: 'comments',
    components: {
      commentList,
      appHeader,
    },
    data() {
      return {
        comments: null,
        commentText: '',
      }
    },
    async created() {
      this.loadComments()
    },
    methods: {
      addComment({key, text}) {
        itemService.addComment(key, text)
      },
      async loadComments() {
        this.comments = await itemService.query()
      },
      async addToRoot() {
        const savedItem = await itemService.addCommentToRoot(this.commentText)
        this.loadComments()
        this.commentText = ''
      },
    },
    computed: {
      commentsToShow() {
        return this.comments
      },
    },
    unmounted() {},
  }
</script>

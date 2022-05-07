<template>
  <div class="comment-preview" :style="nodeMargin">
    <section class="comment">
      <div class="info">
        <div class="profile-pic">
          <img :src="showImg" alt="" />
        </div>
        <span class="user-name"> {{ comment.userName }}</span>
        <span class="time">· {{ formatTime }}</span>
      </div>
      <div class="line-container">
        <i class="line"></i>
      </div>
      <section class="comment-body inner-container">
        <p>
          <span>{{ comment?.commentText }}</span>
        </p>
        <div class="actions">
          <button class="btn-pre btn-orange-pre" @click="toggleReply">
            Reply
          </button>
        </div>
      </section>
      <section v-if="isReply" class="comment-reply inner-container">
        <input
          class="input-test-pre"
          type="text"
          v-model="commentText"
          placeholder="What are your thoughts?"
        />
        <button class="btn-pre btn-blue-pre" @click="addComment(comment._id)">
          Add
        </button>
      </section>
    </section>
    <div v-if="hasChildren">
      <!-- recursive component to display all childs -->
      <comment-preview
        v-for="child in comment.children"
        :key="child.key"
        :comment="child"
        :spacing="spacing + 30"
        @added="addComment(comment._id)"
      />
    </div>
  </div>
</template>

<script>
  import {itemService} from '../services/item.service'
  import {utilService} from '../services/util.service'

  export default {
    name: 'commentPreview',
    props: {
      comment: {
        type: Object,
        required: true,
      },
      spacing: {
        type: Number,
        default: 0,
      },
    },
    emits: ['remove', 'added'],
    components: {},
    data() {
      return {
        isAdded: false,
        isReply: false,
        commentText: '',
      }
    },
    created() {},
    methods: {
      toggleReply() {
        this.isReply = !this.isReply
      },
      async addComment(id) {
        // if (this.isAdded) return
        //try to fix because the recursion cmp preview fire 3 or more times if in the deep
        const savedItem = await itemService.addComment(id, this.commentText) // tryid to add directly because of prob with deep emits
        this.$emit('added', savedItem)
        this.commentText = ''
      },
    },
    computed: {
      nodeMargin() {
        return {
          'margin-left': `${this.spacing}px`,
        }
      },
      hasChildren() {
        const {children} = this.comment
        return children && children.length > 0
      },
      RandomUserName() {
        return utilService.generateRandomName()
      },
      formatTime() {
        const time = utilService.timeAgo(this.comment.createdAt)
        return time ? time : 'Just now'
      },
      showImg() {
        return `src/assets/img/${this.comment.imgUrl}`
      },
    },
    unmounted() {},
  }
</script>

import {describe, it, expect} from 'vitest'

import {mount} from '@vue/test-utils'
// import HelloWorld from '../HelloWorld.vue'
import commentPreview from '../comment-preview.vue'

describe('commentPreview', () => {
  it('renders properly', () => {
    const wrapper = mount(commentPreview, {props: {msg: 'Hello Vitest'}})
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})

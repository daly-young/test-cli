<template>
  <div class="line-text">
    <h4><span></span></h4>
    <p v-if="caption"></p>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'line-text',
  props: {
    title: {
      type: String
    },
    caption: {
      type: String
    },
  }
}
</script>

<style lang="scss" scoped>
.line-text {
  text-align: center;
  h4 {
    &::before, &::after {
      content: '';
      display: inline-block;
      width: 20%;
      height: 1px;
      background: #efefef;
      vertical-align: middle;
      margin: 0 1em;
    }
    span {
      vertical-align: middle;
    }
  }
  p {
    color: #999;
  }
}
</style>

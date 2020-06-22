<template>
  <img @click="change" :src="baseSrc" alt="图片验证码">
</template>

<script>
import {getCheckCodeImageUrl} from '@mizlicai/helper'
export default {
  name: 'img-code',
  props: {
    src: {
      type: String,
      default: 'http://placeholder.qiniudn.com/160x80'
    },
  },
  data () {
    return {
      baseSrc: this.src
    }
  },
  mounted () {
    this.change()
  },
  computed: {
  },
  methods: {
    change () {
      getCheckCodeImageUrl()
        .then(res => {
          this.baseSrc = res
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.mz-reg-form {
  font-size: .34rem;
  dd {
    position: relative;
    line-height: 1rem;
    margin-bottom: 0.2rem;
  }
  .input-title {
    position: absolute;
    left: .2rem;
    top: 0;
  }
  .btn-link {
    display: inline-block;
    padding: 0 .2rem;
    position: absolute;
    top: 0;
    right: 0;
  }
  .mz-input {
    padding-left: 4.5em;
    &.img-code-input {
      padding-left: 0.2rem;
      width: 4.3rem;
    }
  }
  .agree {
    line-height: 1.5;
    font-size: 0.24rem;
  }
  .img-code {
    width: 1.6rem;
    height: 0.8rem;
    position: absolute;
    top: 0;
    bottom: 0;
    right: .15rem;
    margin: auto;
  }
}
</style>

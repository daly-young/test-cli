<template>
   <div class="mz-footer">
      <a href="tel:400-699-8883" class="contact-us">联系客服(09:00-21:00)</a>
      <p class="tip">市场有风险  出借需谨慎</p>
      <p v-if="isIOS" class="apple-tip"><span>活动由米庄提供，与设备生产商Apple Inc.公司无关</span></p>
    </div>
</template>

<script>
const isIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
export default {
  name: 'mz-footer',
  props: {
  },
  data () {
    return {
      isIOS
    }
  },
  mounted () {
  },
  computed: {
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.mz-footer {
  background: rgba(255, 255, 255, .05);
  text-align: center;
  font-size: .24rem;
  padding-top: 0.4rem;
  .contact-us {
    padding: 0 .25rem 0 .6rem;
    display: inline-block;
    height: .5rem;
    line-height: .5rem;
    color: #5193ff;
    text-decoration: none;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAaVBMVEUAAABRk/9Rk/9Rk/9Rk/9Rk/9Rk/9Rk/9Rk/9Rk/9Rk/9Rk/9Rk/9Rk/9Rk/9Rk/9Rk/9Rk/9Rk/9Rk/9Rk/9Rk/9Rk/9Rk/9Rk/9Rk/9Rk/9Rk/9Rk/9Rk/9Rk/9Rk/9Rk/9Rk/9Rk/814bBFAAAAInRSTlMA+QaPDpRFKubg1jglEvPqMcnCu6qknm0J19WNenhVPC8kqy8DSQAAALBJREFUKM9tz0kWgyAQBNBuQBzAecyc1P0PGROfimAtoOm/qAetiWXGnMmYjpkixj8cCXcvWrA0SpnZW1ciJNUyVQmifR8zV+v8Zt57JCSdPjKYHQwu28xwCgV4m4H5CF/56MOY/25dwgeUmsgWaHxoUFjq0YUdHXpK8AkhRkIMEYIAUwYdgsaV7kitDzbFg0QN9oFRT0RqCGFQy9eP8NS5U3eeAq9zkFiSKg/ErQzgCxEpENnvuN/yAAAAAElFTkSuQmCC) .25rem #fff no-repeat;
    background-size: .24rem .24rem;
    border-radius: 99rem;
  }
  .tip {
    color: rgba(255, 255, 255, .6);
    padding: .1rem 0 .22rem 0;
    font-size: .2rem;
    transform: scale(.8)
  }
  .apple-tip {
    height: 0.5rem;
    line-height: 0.5rem;
    background: rgba(255, 255, 255, .1);
    color: #fff;
    font-size: .2rem;
    span {
      display: inline-block;
      transform: scale(.8);
    }
  }
}
</style>

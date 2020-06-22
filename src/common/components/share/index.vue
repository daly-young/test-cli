<template>
  <div class="v-share">
    <span class="v-share-content" @click="share">
      <slot></slot>
    </span>
    <v-popup auto ref="popup" @popupClick="hide">
      <img
        class="v-share-img"
        src="https://miz-image.b0.upaiyun.com/zuimifen/wx-share.png"
        alt="分享图片"
      >
    </v-popup>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk';
import { app } from '@mizlicai/helper';

const ua = navigator.userAgent
const isWeixin = !!ua.match(/MicroMessenger/i);
const isQQ = !!ua.match(/QQ/i);

const wxConfig = {
  debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
  appId: '', // 必填，公众号的唯一标识
  timestamp: 0, // 必填，生成签名的时间戳
  nonceStr: '', // 必填，生成签名的随机串
  signature: '', // 必填，签名，见附录1
  jsApiList: [
    'updateAppMessageShareData',
    'updateTimelineShareData',
    'onMenuShareTimeline',
    'onMenuShareAppMessage',
    'onMenuShareQQ',
    'onMenuShareQZone'
  ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
};

export default {
  name: 'v-share',
  props: {
    info: {
      type: Object
    }
  },
  data() {
    return {};
  },
  created() {
    this.init();
  },
  watch: {
    info() {
      this.wxShareConfig();
    }
  },
  methods: {
    hide() {
      this.$refs.popup.close();
    },
    share() {
      const { title, desc, link, imgUrl } = this.info;
      if (app.isInApp) {
        return (window.location.href =
          'share:test?x=' +
          encodeURIComponent(
            JSON.stringify({
              text: title,
              desc,
              lineLink: link,
              imgUrl
            })
          ));
      }
      if (isWeixin || isQQ) {
        return this.$refs.popup.open();
      }
      return this.$toast.open(
        '啊哦，我在别人的地盘，请庄主移步至“米庄”公众号内'
      );
    },
    init() {
      if (this.info) {
        if (isWeixin) {
          this.wxShareConfig();
          fetch('https://api.mizlicai.com/system/wxconfig')
            .then(res => res.json())
            .then(data => {
              console.log(data);
              wxConfig.appId = data.appid;
              wxConfig.timestamp = data.timestamp;
              wxConfig.nonceStr = data.noncestr;
              wxConfig.signature = data.signature;
              wx.config(wxConfig);
            })
            .catch(() => this.$toast.open('请求微信配置失败'));
        }
        if (isQQ) {
          this.QQShareConfig()
        }
      }
    },
    QQShareConfig () {
      const { title, desc, imgUrl } = this.info;
      const QQConfig = {
        name: title,
        desc,
        image: imgUrl
      }
      for (let i in QQConfig) {
        document.getElementById('share-qq-' + i).content = QQConfig[i]
      }
    },
    wxShareConfig() {
      const { title, desc, link, imgUrl } = this.info;
      wx.error(function(res) {
        console.log('err' + res);
      });
      wx.ready(function() {
        console.log('ready');
        // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容
        wx.updateAppMessageShareData({
          title, // 分享标题
          desc, // 分享描述
          link, // 分享链接
          imgUrl // 分享图标
        });
        // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
        wx.updateTimelineShareData({
          title, // 分享标题
          link, // 分享链接
          imgUrl // 分享图标
        });
        wx.onMenuShareTimeline({
          title, // 分享描述
          link, // 分享链接
          imgUrl, // 分享图标
        });
        // 微信朋友
        wx.onMenuShareAppMessage({
          title, // 分享标题
          desc, // 分享描述
          link, // 分享链接
          imgUrl, // 分享图标
          type: '', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        });
        // qq
        wx.onMenuShareQQ({
          title, // 分享标题
          desc, // 分享描述
          link, // 分享链接
          imgUrl, // 分享图标
        });
        // qq空间
        wx.onMenuShareQZone({
          title, // 分享标题
          desc, // 分享描述
          link, // 分享链接
          imgUrl, // 分享图标
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.v-share {
  .v-share-img {
    width: 100%;
  }
}
</style>

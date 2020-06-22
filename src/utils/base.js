import { getUserKey, alarmlog, app } from '@mizlicai/helper';
import { baseUrl, jumpConf, userkey } from './conf';

const verifyRule = {
  mobile(val) {
    return /^1[3|4|5|6|7|8|9][0-9]{9}$/.test(val);
  }
};

const formatList = {
  thousand(val) {
    return val.replace(/(^|\s)\d+/g, s =>
      s.replace(/(?=(?!\b)(\d{3})+$)/g, ',')
    );
  },
  date(date, c = '-') {
    const d = new Date(date);
    return `${d.getFullYear()}${c}${this.zero(d.getMonth() + 1)}${c}${this.zero(
      d.getDate()
    )}`;
  },
  datetime(date) {
    const d = new Date(date);
    return `${this.date(d)} ${this.zero(d.getHours())}:${this.zero(
      d.getMinutes()
    )}:${this.zero(d.getSeconds())}`;
  },
  zero(s, n = 2) {
    return s ? String(s).padStart(n, '0') : '00';
  }
};

export function pasteText (text) {
  let msg = ''
  if (app.isInApp) {
    app.pasteText(text)
  } else {
    const textarea = document.createElement('textarea')
    textarea.style.position = 'fixed'
    textarea.style.top = 0
    textarea.style.left = 0
    textarea.style.border = 'none'
    textarea.style.outline = 'none'
    textarea.style.resize = 'none'
    textarea.style.background = 'transparent'
    textarea.style.color = 'transparent'

    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()

    try {
      msg = document.execCommand('copy') ? '复制成功' : '复制失败'
    } catch (err) {
      msg = err
    }
    document.body.removeChild(textarea)
  }
  return msg
}

export function verify(type, val) {
  return typeof verifyRule[type] === 'function' && verifyRule[type](val);
}

export function format(type, val) {
  return typeof formatList[type] === 'function' && formatList[type](val);
}

export const env =
  process.env.BUILD_ENV === 'undefined'
    ? process.env.NODE_ENV
    : process.env.BUILD_ENV;

export const isDev = process.env.NODE_ENV === 'development';

const ua = navigator.userAgent;

export const platform = navigator.platform;
export const isIOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
export const isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1;
export const isWeixin = !!ua.match(/MicroMessenger/i);

export function jump(name, params = '') {
  const os = app.isInApp ? 'app' : 'h5';
  let url = jumpConf[name] ? jumpConf[name][os] : '';
  return os === 'h5'
    ? url && baseUrl[env] + url + params
    : url || baseUrl[env] + jumpConf[name]['h5'] + params;
}

export function getUrlParam (key) {
  var search = location.search;
  var arr = !search ? [] : location.search.substr(1).split('&');
  var param = {};
  for (var i = 0, l = arr.length; i < l; i++) {
    var kv = arr[i].split('=');
    param[kv[0]] = kv[1];
  }
  return key ? (param[key] || '') : param;
}

export function loginWithExternalHref () {
  var link = '';
  var urlExternalArr = (/external=([^&]*)/.exec(location.search));
  var urlExternal = '';
  var source = getUrlParam('source') || sessionStorage.getItem('source');
  if (urlExternalArr) {
    urlExternal = urlExternalArr[1];
  }
  if (urlExternal) {
    if (source && source !== '') {
      link = '/?external=' + urlExternal + '&source=' + source + '#/login?backTo=' + encodeURIComponent(window.location.href);
    } else {
      link = '/?external=' + urlExternal + '#/login?backTo=' + encodeURIComponent(window.location.href);
    }
  } else {
    if (source && source !== '') {
      link = '/?source=' + source + '#/login?backTo=' + encodeURIComponent(window.location.href);
    } else {
      link = '/#/login?backTo=' + encodeURIComponent(window.location.href);
    }
  }
  return link;
}
export default {
  install(Vue, options) {
    Vue.prototype.$base = {};

    let doc = document.documentElement; // 获取屏幕尺寸
    let baseWidth = 750; // 设计图基准尺寸
    let baseFontSize = 100; // 基准字体大小

    let getSize = () => {
      let clientWidth = doc.clientWidth;
      let clientHeight = doc.clientHeight;
      doc.style.fontSize = (clientWidth / baseWidth) * baseFontSize + 'px';
      Vue.prototype.$base.clientWidth = clientWidth;
      Vue.prototype.$base.clientHeight = clientHeight;
      Vue.prototype.$base.pageHeight = doc.offsetHeight;
    };

    getSize();

    window.onresize = () => {
      getSize();
    };

    const alarmlogFormat = (propertyList = []) => {
      const { activityFlag, channelFlag } = Vue.prototype.$bus.tempData || {};
      const prop = propertyList.concat([
        {
          key: 'page_url',
          value: window.location.href
        },
        {
          key: 'active_id',
          value: activityFlag
        },
        {
          key: 'put_channel',
          value: channelFlag
        }
      ]);
      return prop;
    };

    Vue.prototype.$bus =
      Vue.prototype.$bus ||
      new Vue({
        data: {}
      });
    Vue.prototype.$alarmlog = (code, propertyList) => {
      const prop = alarmlogFormat(propertyList);
      alarmlog(code, prop);
    };

    let readyList = [];
    Vue.prototype.$ready = fn => {
      typeof fn === 'function' && readyList.push(fn);
    };

    // getSessionId()
    //   .then((data) => {
    //     Vue.prototype.$session = data
    //     readyList.forEach(fn => fn(data))
    //   })
    getUserKey().then(data => {
      Vue.prototype.$userkey = isDev ? userkey : data;
      readyList.forEach(fn => fn(data));
    });
    // 自定义title 用法 如<div v-title="'title'"></div>
    Vue.directive('title', {
      inserted(el, binding) {
        document.title = binding.value;
      },
      update(el, binding) {
        document.title = binding.value;
      }
    });

    let posy = 0;
    const scroll = e => {
      e.preventDefault();
      if (!isNaN(posy)) {
        if (!isNaN(window.scrollY)) {
          let now = window.scrollY;
          let step = (now - posy) / 15;
          let timer = setInterval(() => {
            now -= step;
            let isOver = step > 0 ? now <= posy : now >= posy;
            if (isOver) {
              now = posy;
              clearInterval(timer);
            }
            window.scrollTo(0, now);
          }, 17);
        } else {
          window.scrollTo(0, posy);
        }
      } else {
        window.scrollTo(0, 0);
      }
    };
    Vue.directive('scroll', {
      bind(el, binding) {
        posy = +binding.value;
        el.onclick = scroll
        el.addEventListener('click', scroll, false)
      },
      update(el, binding) {
        posy = binding.value;
      },
      unbind(el, binding) {
        posy = null;
        el.removeEventListener('click', scroll)
      }
    });

    Vue.directive('bury-point', {
      bind(el, binding) {
        const val = binding.value;
        const { type, code, propertyList = [] } = val;
        const prop = alarmlogFormat(propertyList);

        if (type) {
          if (type.indexOf('unload') === -1) {
            el.addEventListener(type, () => alarmlog(code, prop), false);
          } else {
            window.onbeforeunload = () => alarmlog(code, prop);
          }
        } else {
          alarmlog(code, prop);
        }
      }
    });
  }
};

import { stringify } from 'qs';
import { hostConf } from './conf';
import { env, isDev, loginWithExternalHref } from './base';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'
};

function checkStatus(res) {
  // 请求状态处理
  const { status, statusText } = res;
  if (status >= 200 && status < 300) {
    return res;
  }
  const error = new Error(statusText);
  const msg = codeMessage[status] || statusText;
  error.res = res;
  error.msg = msg;
  throw error;
}

function parseErrorMessage(res) {
  // 返回数据处理
  const { status, errorMsg, data = {}, message, code, ...otherData } = res;
  const statusCode = status === undefined ? code : status;
  const msg = errorMsg || message || '网络错误，请重试';
  if (statusCode === undefined || +statusCode !== 0) {
    const error = new Error(msg);
    error.res = res;
    error.msg = msg;
    throw error;
  }

  if (statusCode === 21000) {
    localStorage.removeItem('auth');
    window.location.href = loginWithExternalHref();
    return;
  }

  return Object.keys(otherData).length
    ? Object.prototype.toString.call(data) !== '[object Object]'
      ? { data, ...otherData }
      : { ...data, ...otherData }
    : data;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options = {}) {
  const defaultOptions = {
    // credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  const mockList = ['/mock', '/local'];
  const isMock = mockList.some(item => url.startsWith(item));
  const api = Object.keys(hostConf).find(item => url.startsWith(item));

  if (api && (!isDev || !isMock)) {
    url = `${hostConf[api][env]}${url.replace(api, '')}`;
  }
  url = `${url}?${stringify(newOptions.params)}`;

  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers
      };
      newOptions.body = JSON.stringify(newOptions.data);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers
      };
    }
  }

  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => {
      // DELETE and 204 do not return data by default
      // using .json will report an error.
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      return response.json();
    })
    .then(parseErrorMessage);
}

export function busyRequest() {
  let busy = false;

  return (url, options) => {
    return new Promise((resolve, reject) => {
      if (!busy) {
        busy = true;
        request(url, options)
          .then(data => {
            resolve(data);
            busy = false;
          })
          .catch(err => {
            reject(err);
            busy = false;
          });
      }
    });
  };
}

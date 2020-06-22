export const hostConf = {
  '/api': {
    development: 'http://121.40.194.189:8013',
    production: 'https://api.mizlicai.com/sinnis'
  },
  '/reg': {
    development: 'http://121.43.59.43:8022',
    production: 'https://api.mizlicai.com/activities'
  },
  '/miz': {
    development: 'http://qa.mizlicai.com',
    production: 'https://api.mizlicai.com'
  },
  '/gaia': {
    development: 'http://121.43.59.43:8007',
    production: 'https://api.mizlicai.com'
  },
  '/member': {
    development: 'http://121.40.194.189:8015',
    production: 'https://api.mizlicai.com'
  }
};

export const baseUrl = {
  development:
      'http://mizlicai.chinacloudsites.cn',
  production: 'https://h5.mizlicai.com'
}

export const jumpConf = {
  index: {
    app: 'mizlicai://mizData={"tabSelect": "0"}',
    h5: '/',
  },
  hongbao: {
    app: 'mizlicai://mizData={"myAsset": "0"}',
    h5: '/?host=121.43.59.43&port=8007#/hongbao',
  },
  products: {
    app: 'mizlicai://mizData={"tabSelect": "1"}',
    h5: '/?host=121.43.59.43&port=8007#/products',
  },
  investList: {
    app: 'mizlicai://mizData={"myAsset": "2"}',
    h5: '#/account-record',
  },
  address: {
    app: '',
    h5: '/feature/miz-address-activity#/',
  },
}

export const userkey = ''

var indexPath = '../dist/'
var cdnPath = '../dist/', publicPath = ''

/* cdn example */
// indexPath = '../../web-server/views/'
// cdnPath = '../../cdn/'
// publicPath = 'https://cdn.vesper.com.cn/'

module.exports = {
  build: {
    indexPath, // index输出本地目录
    cdnPath, // cdn输出本地目录
    publicPath,
    project: ['example'] // 需打包的项目（对应project文件夹中的项目
  },
  dev: {
    project: ['example'] // 需运行的项目（对应project文件夹中的项目） 空则运行project中的所有项目（这样可能会导致编译变慢）
  }
}

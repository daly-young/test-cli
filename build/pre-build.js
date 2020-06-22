const project = process.argv[2]
const buildType = process.argv[3]
const config = require('../config')
const child = require('child_process')
const projectFile = project === 'config' ? config.build.run : require('fs').readdirSync('./src/project/').filter(item => !item.startsWith('.'))

const build = function (name) {
  console.log()
  console.log('------------------------' + name + ' 项目开始构建' + '------------------------')
  return new Promise((resolve, reject) => {
    const out = child.exec('node build/build.js ' + name + (buildType ? ' ' + buildType : ''), function(err, stdout, stderr){
      if(err) {
        console.log(stderr)
        reject()
      } else {
        console.log(stdout)
        console.log('------------------------' + name + ' 项目构建完成'+ '------------------------')
        console.log()
        resolve()
      }
    })
  })
}

const buildAll = async function () {
  for (let i = 0; i < projectFile.length; i++) {
    try {
      await build(projectFile[i])
    } catch (e) {
      console.log(e)
    }
  }
}

buildAll()


const IS_PROD = require('./is_prod')

const childProcess = require('child_process')

function exec (command) {
  return new Promise((resolve, reject) =>
    childProcess.exec(command, (err) => {
      if (err) {
        return reject(err)
      }

      resolve()
    })
  )
}

module.exports = {
  exec,
  execSync: childProcess.execSync
}

if (!IS_PROD) {
  module.exports = {
    exec: () => Promise.resolve(),
    execSync: () => ''
  }
}

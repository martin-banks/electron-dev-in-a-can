const mkdirp = require('mkdirp')
const path = require('path')

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

function magick({name = 'new folder'} = {}) {
	mkdirp(path.join(getUserHome(), name), err => console.log(err || 'success!!!'))
	return `Dir created in ${path.join(getUserHome(), name)}`
}

module.exports = magick

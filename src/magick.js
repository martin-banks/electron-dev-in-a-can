const mkdirp = require('mkdirp')
const path = require('path')
const cp = require('cp')

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

function magick({name = 'new folder'} = {}) {
	const newDir = path.join(getUserHome(), name)
	mkdirp(newDir, err => console.log(err || 'success!!!'))
	console.log(path.join(__dirname, 'magick.js'))
	cp(path.join(__dirname, 'magick.js'), `${newDir}/newFile.js`, err => console.log(err || 'done'))
	return `Dir created in ${path.join(getUserHome(), name)}`
}

module.exports = magick

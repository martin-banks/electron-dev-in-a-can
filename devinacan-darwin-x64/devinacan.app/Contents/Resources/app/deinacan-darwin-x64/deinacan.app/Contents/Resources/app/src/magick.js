const mkdirp = require('mkdirp')
const path = require('path')


function magick({name = 'new folder'} = {}) {
	mkdirp(path.join(__dirname, name), err => console.log(err || 'success!!!'))
	return 'stuff done'
}

module.exports = magick
